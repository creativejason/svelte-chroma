<script lang="ts">

    import { hoverToFocus } from "$lib/actions/focusable"  
    export let expanded:boolean = false;     
    export let icon:ConstructorOfATypedSvelteComponent;
    export let title:string = "";
    export let subtitle:string = "";

    const iconSize:number = 32;

</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class:expanded class="sidebar-item dpad-focusable" tabindex="0" use:hoverToFocus>
    <div class="icon-container">
        {#if icon }
            <svelte:component this={icon} width={iconSize} height={iconSize} viewBox="0 0 48 48" class="icon" />        
        {/if}  
    </div>
    {#if expanded}
        <div class="text-container">
            <p class="title text-button-2">{title}</p>
            <p class="subtitle text-caption">{subtitle}</p>
        </div>
    {/if}
</div>


<style lang="less">
    .sidebar-item{
        border-radius: 8px;
        color:var(--color-text-muted);
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 16px;
        padding: 16px;
        height: 80px;
        &:focus{
            background-color: var(--color-background-focus);
            color: var(--color-text-on-focus);
            transition: all 300ms linear;
            .icon-container :global(path){
                fill: var(--color-text-on-focus);
            }
        }
        .icon-container{
            //padding:16px;
            display: flex;
            align-items: center;
            :global(path){
                fill: var(--color-text-muted);
            }
        }
        .text-container{
            display: flex;
            flex-flow: column;
            display: none;
        }
        &.expanded{
            .text-container{
                display: flex;
            }
        }
    }

    

    

    

</style>