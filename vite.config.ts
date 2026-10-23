import vinext from 'vinext';
import { defineConfig } from 'vite';

// vinext reads next.config.mjs (static export, trailing slashes) and registers
// @vitejs/plugin-rsc for the App Router by itself.
export default defineConfig({
  plugins: [vinext()],
});
