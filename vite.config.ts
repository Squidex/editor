import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(),],

    build: {
        rollupOptions: {
            input: {
                demo: resolve(__dirname, 'index.html'),

                // Expose the editor as separate file to get rid of the test content.
                ['squidex-editor']: resolve(__dirname, 'src/squidex-editor.ts'),
            },
            output: {
                entryFileNames: chunk => {
                    console.log(chunk.name);
                    if (chunk.name === 'squidex-editor') {
                        return 'squidex-editor.js';
                    } else {
                        return `${chunk.name}.[hash].js`;
                    }
                },
                
                assetFileNames: chunk => {
                    console.log(chunk.name);
                    if (chunk.name === 'squidex-editor.css') {
                        return 'squidex-editor.css';
                    } else if (chunk.name === 'demo.css') {
                        return 'demo.[hash].css';
                    } else {
                        return '[name].[hash].[ext]';
                    }
                },
            }
        },

        chunkSizeWarningLimit: 5000
    },
});
