import { sveltePreprocess } from "svelte-preprocess";

export default {
    preprocess: sveltePreprocess({
        globalStyle: true,
        typescript: true,
        scss: true,
    }),
};
