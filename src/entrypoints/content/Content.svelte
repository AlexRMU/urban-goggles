<script lang="ts">
    import FloatingContainer from "$lib/FloatingContainer.svelte";
    import { get_domain, local_storage } from "$lib/utils";

    const domain = get_domain(location.href)!;
    if (!domain) {
        throw new Error("no current_domain");
    }

    let sites = local_storage.$state("sites");
    let text = $derived(sites.value?.find((x) => x.domain === domain)?.text);

    let closed_on = local_storage.$state("message_closed_on");
    let closed = $derived(closed_on.value?.includes(domain));

    let all_visits = local_storage.$state("visits", {});

    const visits_key = `${domain}_visits`;
    const visits = (parseInt(sessionStorage.getItem(visits_key) || "") || 0) + 1;
    console.log("visits", visits);
    if (visits <= 3) {
        sessionStorage.setItem(visits_key, visits + "");
    }

    // $inspect("sites", sites);
    // $inspect("text", text);
    // $inspect("closed_on", closed_on);
    // $inspect("closed", closed);
    // $inspect("all_visits", all_visits);

    async function close() {
        console.log("close");
        await closed_on.promise;
        if (!closed_on.value) {
            closed_on.value = [];
        }
        closed_on.value.push(domain);
    }

    onMount(async () => {
        console.log("mount");
        await all_visits.promise;
        if (!all_visits.value) {
            all_visits.value = {};
        }
        all_visits.value[domain] = (all_visits.value[domain] || 0) + 1;
    });
</script>

{#if !closed && visits <= 3 && text}
    <div class="wrap">
        <FloatingContainer>
            <div class="content">
                {text}
                <FloatingContainer>
                    <button onclick={close}>close</button>
                </FloatingContainer>
            </div>
        </FloatingContainer>
    </div>
{/if}

<style lang="scss">
    .wrap {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        font-size: 2rem;

        :global(.FloatingContainer) {
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #00000021;
        }
    }
    .content {
        padding: 4rem;
    }
    button {
        border-radius: 4px;
        padding: 1rem;
        width: 100%;
        font-weight: bold;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
</style>
