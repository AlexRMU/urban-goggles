<script lang="ts">
    import type { Snippet } from "svelte";

    let { children }: { children: Snippet } = $props();
</script>

<div class="FloatingContainer">
    {@render children()}
</div>

<style lang="scss">
    .FloatingContainer {
        transition: all 235ms ease 0s;
        box-shadow: 15px 28px 25px -18px rgba(0, 0, 0, 0.2);

        &:hover {
            transform: translate3d(0, 2px, 0);
            box-shadow: 2px 8px 8px -5px rgba(0, 0, 0, 0.3);
        }
    }
</style>
