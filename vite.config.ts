import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://66a5a7305dc27a3c190bd6f7.mockapi.io/', // http://127.0.0.1:5000/
        //http://qg-env.eba-rskeuxuj.ap-southeast-1.elasticbeanstalk.com/
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }, 
})

