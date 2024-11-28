import { get_sites, local_storage, update_interval } from "$lib/utils";

export default defineBackground(() => {
    async function update() {
        const updated_at = (await local_storage.get("sites_updated_at")) || 0;
        console.log("updated_at", updated_at);
        if (updated_at + update_interval < Date.now()) {
            const sites = await get_sites();
            console.log("sites", sites);
            await local_storage.set("sites", sites);
            await local_storage.set("sites_updated_at", Date.now());
            setTimeout(update, update_interval);
        } else {
            setTimeout(update, update_interval - (Date.now() - updated_at));
        }
    }
    update();
});
