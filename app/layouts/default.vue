<script setup lang="ts">
// Fontes do site (Google Fonts) só nas páginas com chrome padrão — as
// apresentações usam fontes self-hosted e precisam funcionar 100% offline.
useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap",
    },
  ],
});
</script>

<template>
  <div class="noise min-h-screen">
    <nav class="fixed top-0 right-0 z-50 p-5 flex items-center gap-3">
      <LocaleToggle />
      <ThemeToggle />
    </nav>
    <slot />
  </div>
</template>
