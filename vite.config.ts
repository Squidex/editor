import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), ],

    build: {
        rollupOptions: {
            output: {
                entryFileNames: `assets/squidex-editor.js`,
                assetFileNames: `assets/squidex-editor.css`
            }
        }
    }
});
