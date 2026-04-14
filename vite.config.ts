import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    // GitHub Pages 用子路径，Netlify 用根路径（通过环境变量控制）
    base: env.VITE_BASE_URL || "/my-platform/",
  };
});
