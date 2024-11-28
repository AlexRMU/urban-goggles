<script lang="ts">
    import { local_storage } from "$lib/utils";

    let sites = local_storage.$state("sites");
    let visits = local_storage.$state("visits", {});

    // $inspect("sites", sites);
    // $inspect("visits", visits);
</script>

<div class="container">
    {#if sites.value?.length}
        {#each sites.value as { domain }}
            <a href="https://{domain}" target="_blank">
                {domain}
                {#if visits.value}
                    ({visits.value[domain] || 0} visits)
                {/if}
            </a>
        {/each}
    {:else}
        no sites
    {/if}
</div>

<style lang="scss">
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 20rem;
        padding: 1rem;
        font-size: 1.5rem;
        gap: 1rem;
    }
    a {
        background: black;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        border: none;
        font-size: inherit;
    }
</style>
