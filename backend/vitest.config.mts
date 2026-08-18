import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 15000,
    fileParallelism: false, // testes batem no mesmo banco real; evita corrida entre arquivos
  },
});
