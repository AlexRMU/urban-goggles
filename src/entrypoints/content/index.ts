import { get_domain, local_storage, search_engine_domains } from "$lib/utils";
import { mount, unmount } from "svelte";
import logo_src from "/icon/128.png";
import Content from "./Content.svelte";

const logo = browser.runtime.getURL(logo_src as any);
const query = `div > div > div > div > div > div > span > a[ping], #search-result > li > div > div > a`;

export default defineContentScript({
    matches: ["<all_urls>"],
    main: async (context) => {
        const current_domain = get_domain(location.href);
        console.log("current_domain", current_domain);
        const sites = new Set(((await local_storage.get("sites")) || []).map((x) => x.domain));
        console.log("sites", sites);
        if (current_domain) {
            if (search_engine_domains.has(current_domain)) {
                const links = Array.from(document.querySelectorAll(query));
                console.log("links", links);

                links
                    .filter((element) => {
                        try {
                            const domain = get_domain((element as HTMLAnchorElement).href);
                            if (domain) {
                                return sites.has(domain);
                            }
                        } catch (error) {}
                        return false;
                    })
                    .forEach((element) => {
                        const img = document.createElement("img");
                        img.src = logo;
                        img.style.height = "1rem";
                        element.appendChild(img);
                    });
            }
            if (sites.has(current_domain)) {
                const ui = createIntegratedUi(context, {
                    position: "inline",
                    anchor: "body",
                    onMount: (container) => {
                        const app = mount(Content, {
                            target: container,
                        });
                        return app;
                    },
                    onRemove: (app) => {
                        if (app) {
                            unmount(app);
                        }
                    },
                });
                ui.mount();
            }
        }
    },
    runAt: "document_idle",
});
