import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({test:{environment:"node",include:["packages/**/*.test.ts","packages/**/*.test.tsx","app/**/*.test.ts"]},resolve:{alias:{"@qchat/core":path.resolve(__dirname,"packages/core/src/index.ts"),"server-only":path.resolve(__dirname,"app/server/server-only-test.ts")}}});
