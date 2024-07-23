import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import dotenv from "dotenv"

export default defineConfig({
  plugins: [
    react(),

    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true
    })
  ],
  define: {
    'process.env.VITE_LOCALHOST_KEY': JSON.stringify(process.env.VITE_LOCALHOST_KEY),
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser'
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
