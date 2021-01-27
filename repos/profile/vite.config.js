import vue from '@vitejs/plugin-vue'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  base: '/profile/',
  plugins: [vue()],
  server: {
    port: 8081
  }
}
