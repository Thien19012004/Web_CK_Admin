import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Sử dụng process.env để đọc biến môi trường từ file .env
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  base: "/",
 plugins: [react()],
 preview: {
  port: 8080,
  strictPort: true,
 },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === "development"
        ? process.env.VITE_DOMAIN
        : process.env.VITE_DOMAIN_HOST,
        changeOrigin: true,
        secure: false,
      },
    },
  strictPort: true,
  host: true,
  origin: "https://0.0.0.0:8080",
  },
});
