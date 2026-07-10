<script setup lang="ts">
import { presentations } from "~/data/presentations";

const { t, locale } = useLocale();

usePageSeo({
  title: () => (locale.value === "en" ? "Talks & Presentations" : "Palestras & Apresentações"),
  description: () =>
    locale.value === "en"
      ? "Talks and technical presentations by Fábio Assunção on software engineering, AI, and cloud computing."
      : "Palestras e apresentações técnicas de Fábio Assunção sobre engenharia de software, IA e cloud computing.",
  path: "/presentations",
});
</script>

<template>
  <main class="max-w-2xl mx-auto px-6 sm:px-8 min-h-screen flex flex-col">
    <section class="pt-28 pb-20 flex-1">
      <NuxtLink
        to="/"
        class="font-mono text-xs tracking-wider text-ink-400 dark:text-ink-500 hover:text-accent transition-colors duration-300"
      >
        ← {{ locale === "en" ? "home" : "início" }}
      </NuxtLink>

      <h1 class="font-mono text-xs tracking-[0.2em] uppercase text-ink-400 dark:text-ink-500 mt-14 mb-10">
        <span class="text-accent mr-2">//</span
        >{{ locale === "en" ? "Talks & Presentations" : "Palestras & Apresentações" }}
      </h1>

      <ul class="space-y-10">
        <li v-for="p in presentations" :key="p.slug" class="group">
          <span class="inline-block font-mono text-[11px] tracking-wider text-ink-400 dark:text-ink-500 mb-2">
            {{ t(p.dateLabel) }} · {{ p.event }}
          </span>
          <h2 class="font-display text-base font-600 mb-1.5">
            <NuxtLink
              :to="`/presentations/${p.slug}`"
              class="text-ink-900 dark:text-ink-100 group-hover:text-accent transition-colors duration-300"
            >
              {{ p.title }}
            </NuxtLink>
          </h2>
          <p class="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">
            {{ t(p.description) }}
          </p>
        </li>
      </ul>
    </section>

    <FooterSection />
  </main>
</template>
