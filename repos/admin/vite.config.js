import vue from '@vitejs/plugin-vue'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  plugins: [vue()],
  server: {
    port: 8082,
    hmr: {
      path: 'admin/'
    }
  }
}
