<script lang="ts">
    // Icons
    import Home from "$lib/assets/icons/check-circled-filled.svg";

    export let icon:any = Home;
    export let label = "Label"
    const iconSize:number = 24;
</script>

<span class="badge text-caption">
    <div class="icon-container">
        {#if icon }
            <svelte:component this={icon} width={iconSize} height={iconSize} viewBox="0 0 48 48" class="icon" />        
        {/if}  
    </div>			
    {label}
</span>

<style lang="less">
    .badge{
        background-color: rgb(35, 122, 197);
        padding:8px 8px;
        color: var(--color-text-primary);
        background-color: var(--color-background-card);
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap:8px;
        .icon-container :global(path){
            fill: var(--color-confirm-highlight);
        }
    }
</style>