import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({test:{environment:"node",include:["packages/**/*.test.ts"]},resolve:{alias:{"@qchat/core":path.resolve(__dirname,"packages/core/src/index.ts")}}});
