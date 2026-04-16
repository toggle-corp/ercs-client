import { defineConfig } from "vite";
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import babel from '@rolldown/plugin-babel'

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    plugins: [
        react(),
        tsconfigPaths(),
        babel({ presets: [reactCompilerPreset()] })
      ],
    css: {
      devSourcemap: isProd,
      modules: {
        scopeBehaviour: "local",
        localsConvention: "camelCaseOnly",
      },
    },
    sourcemap: isProd,
    build: {
      outDir: "build",
      sourcemap: isProd,
    },
    envPrefix: "APP_",
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
      strictPort: true,
    },
  };
});
