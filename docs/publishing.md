# Publishing
Run type checking, tests, package builds, the showcase build, and `npm pack --dry-run` for every package. Publish in dependency order: core, server, orpc, react. Start with the `next` tag, install packed artifacts in clean Vite and Next fixtures, then promote verified versions to `latest` with npm provenance enabled.
