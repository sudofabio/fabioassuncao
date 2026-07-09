<script setup lang="ts">
import { profile } from "~/data/profile";

const { locale } = useLocale();
const year = new Date().getFullYear();
</script>

<template>
  <footer class="py-16 section-rule">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex gap-6">
        <a
          v-for="social in profile.socials"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="accent-link font-mono text-xs tracking-wider text-ink-400 dark:text-ink-500 hover:text-accent transition-colors duration-300 pb-0.5"
        >
          {{ social.name }}
        </a>
      </div>
      <p class="font-mono text-xs text-ink-400/60 dark:text-ink-600">
        <NuxtLink
          to="/presentations"
          class="hover:text-accent transition-colors duration-300"
        >
          {{ locale === "en" ? "talks" : "palestras" }}
        </NuxtLink>
        <span class="mx-1.5" aria-hidden="true">·</span>
        &copy; {{ year }} {{ profile.name }}
      </p>
    </div>
  </footer>
</template>
