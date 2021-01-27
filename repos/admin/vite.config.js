import vue from '@vitejs/plugin-vue'

/**
 * @type {import('vite').UserConfig}
 */
export default {
  base: '/admin/',
  plugins: [vue()],
  server: {
    port: 8082
  }
}
