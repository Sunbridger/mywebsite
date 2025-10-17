import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 使用 loadEnv 加载环境变量
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');

  console.log('VITE_API_TOKEN:', env.VITE_API_TOKEN);
  console.log('所有环境变量:', env);

  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
    },
    define: {
      // 使用 loadEnv 加载的变量
      __API_TOKEN__: JSON.stringify(env.VITE_API_TOKEN),
    },
  };
});