import { defineConfig } from "wxt";
import { resolve } from "node:path";

export default defineConfig({
    srcDir: "src",
    outDir: "build",
    extensionApi: "chrome",
    modules: ["@wxt-dev/module-svelte"],
    alias: {
        $lib: resolve("./src/lib"),
    },
    manifest: {
        permissions: ["storage"],
        web_accessible_resources: [
            {
                resources: ["/icon/128.png"],
                matches: ["<all_urls>"],
            },
        ],
    },
});
