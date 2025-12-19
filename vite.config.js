import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 🟢 CHANGE: Use './' (relative path). 
  // This tells the app to look for assets relative to the index.html file, 
  // ensuring it works on localhost AND GitHub Pages without changing code.
  base: './',
})
