import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

interface Step {
  uses?: string;
  run?: string;
  env?: Record<string, string>;
  with?: Record<string, unknown>;
}

interface Job {
  permissions?: Record<string, string> | string;
  env?: Record<string, string>;
  steps?: Step[];
}

interface Workflow {
  permissions?: Record<string, string> | string;
  env?: Record<string, string>;
  jobs: Record<string, Job>;
}

const directory = join(process.cwd(), '.github/workflows');
const workflows = readdirSync(directory)
  .filter((name) => /\.ya?ml$/.test(name))
  .map((name) => {
    const yaml = readFileSync(join(directory, name), 'utf8');
    // Reuse the YAML parser already used for post frontmatter.
    const workflow = matter(`---\n${yaml}\n---`).data as Workflow;
    return { name, workflow };
  });

describe.each(workflows)('$name credential boundaries', ({ workflow }) => {
  it('pins every external action to a full commit SHA', () => {
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps ?? []) {
        if (step.uses) {
          expect(step.uses).toMatch(/^[\w./-]+@[a-f0-9]{40}$/);
        }
      }
    }
  });

  it('removes checkout authentication before repository code executes', () => {
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps ?? []) {
        if (step.uses?.startsWith('actions/checkout@')) {
          expect(step.with?.['persist-credentials']).toBe(false);
        }
      }
    }
  });

  it('keeps write permissions confined to deployment without repository code', () => {
    expect(workflow.permissions).toEqual({ contents: 'read' });
    for (const [id, job] of Object.entries(workflow.jobs)) {
      const permissions = job.permissions ?? workflow.permissions;
      expect(typeof permissions).toBe('object');
      if (id === 'deploy') {
        // Deployment consumes the validated artifact; it must not check out
        // the repository or execute its scripts/dependencies, and the only
        // credential it holds is the Cloudflare token handed to Wrangler.
        expect(Object.values(permissions ?? {})).not.toContain('write');
        for (const step of job.steps ?? []) {
          expect(step.run).toBeUndefined();
          expect(step.uses).toMatch(
            /^(?:actions\/download-artifact|cloudflare\/wrangler-action)@/,
          );
        }
      } else {
        expect(Object.values(permissions ?? {})).not.toContain('write');
        expect(JSON.stringify([workflow.env, job.env, job.steps])).not.toMatch(
          /\$\{\{\s*(?:secrets[.\[]|github\.token)/,
        );
      }
    }
  });

  it('builds with read-only permissions and no GitHub Pages actions', () => {
    const build = workflow.jobs.build;
    expect(build.permissions).toEqual({ contents: 'read' });
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps ?? []) {
        expect(step.uses ?? '').not.toMatch(
          /^actions\/(?:configure-pages|upload-pages-artifact|deploy-pages)@/,
        );
      }
    }
  });

  it('deploys only to the existing Cloudflare Pages project, behind a switch', () => {
    const deploy = workflow.jobs.deploy as Job & { if?: string };
    expect(deploy.if).toContain("vars.CLOUDFLARE_DEPLOY == 'true'");
    const wrangler = deploy.steps?.find((step) =>
      step.uses?.startsWith('cloudflare/wrangler-action@'),
    );
    expect(wrangler?.with?.command).toBe(
      'pages deploy --project-name=fabioassuncao --branch=main',
    );
  });
});
