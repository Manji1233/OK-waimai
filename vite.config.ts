import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  // Vercel 构建时 VERCEL=1,用根路径;本地/GitHub Pages 仍用 /OK-waimai/ 子路径
  base: process.env.VERCEL ? "/" : "/OK-waimai/",
  plugins: [uni()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
  },
});
