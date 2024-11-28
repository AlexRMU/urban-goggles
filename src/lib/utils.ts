import { MyStorage, storage_key } from "./storage.svelte";

export type Site = {
    domain: string;
    text: string;
};

export const search_engine_domains = new Set(["google.com", "google.ru", "ya.ru"]);
export const update_interval = 1000 * 60 * 60 * 4; // 4h
export const sites_src = "https://config-tool.ru/ext.json";

export async function get_sites() {
    try {
        const res: {
            ok: boolean;
            data: Site[];
        } = await fetch(sites_src).then((x) => x.json());
        if (res.ok) {
            return res.data;
        } else {
            console.log("error", res);
            return [];
        }
    } catch (error) {
        console.log("error", error);
        return [];
    }
}

export function get_domain(href: string) {
    try {
        const url = new URL(href);
        return url.host.startsWith("www.") ? url.host.slice(4) : url.host;
    } catch (error) {
        console.log("error", error);
        return;
    }
}

export const local_storage = new MyStorage<{
    sites: Site[];
    sites_updated_at: number;
    message_closed_on: string[];
    visits: Record<string, number>;
}>(storage_key, "sync");
