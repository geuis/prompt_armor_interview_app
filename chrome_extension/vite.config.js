import { defineConfig } from 'vite';
import postcssNesting from 'postcss-nesting';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const extensionNames = new Set(['background', 'contentScript']);

  return {
    build: {
      rollupOptions: {
        input: {
          app: 'popup.html',
          background: './src/background.mjs',
          contentScript: './src/contentScript.js'
        },
        output: {
          entryFileNames: (asset) => {
            if (extensionNames.has(asset.name)) {
              return '[name].js';
            }

            return 'assets/js/[name]-[hash].js';
          }
        }
      }
    },
    clearScreen: false,
    server: {
      port: 2000,
      open: '/popup.html'
    },
    css: {
      postcss: {
        plugins: [
          postcssNesting
        ],
      }
    }
  };
});
