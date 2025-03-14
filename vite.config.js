import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'

export default defineConfig({
	plugins: [react()],
	build: {
		outDir: '../backend/public',
		emptyOutDir: true
	},
	optimizeDeps: {
		include: ['@radix-ui', '@mui'],
	},
	css: {
		preprocessorOptions: {
			scss: {
				implementation: sass,
			},
		},
	},
})
