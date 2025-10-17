import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 替换为你的实际仓库名
  build: {
    outDir: 'dist',
  },
});
