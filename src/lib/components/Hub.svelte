<script lang="ts">
    import { getTMDBImageUrlFromPath } from "$lib/utils/utils";
    import PosterCard from "./PosterCard.svelte";

    export let metadataItems:any = []; 
    export let title:string | null = null; 

    let scrolled = false;
    
    function handleScroll(event:Event){
        const target = event.target as HTMLElement;
        if(target.scrollLeft > 0){
            scrolled = true;
        } else {
            scrolled = false;
        }
    }
    
</script>

<div class="hub">
    {#if title}
         <h2>{title}</h2>
    {/if}
    
        <ul on:scroll={handleScroll} class:scrolled={scrolled}>
            {#each metadataItems as item}
                <PosterCard data={item} backgroundImage={getTMDBImageUrlFromPath(item.poster_path)} on:cardFocus />
            {/each}
        </ul>
    
</div>

<style lang="less">

    .hub{
        display: flex;
        flex-flow: column nowrap;
    }
    h2{
        padding-left:80px;
    }
    ul{
        display: flex;
        flex-flow: row nowrap;
        gap: 32px;
        list-style: none;
        overflow: hidden;
        padding:32px 0;
        padding-left:80px;
        &.scrolled{
            mask-image: linear-gradient(to right, transparent 32px, black 360px);
            -webkit-mask-image: linear-gradient(to right, transparent 32px, black 360px);
        }
    }
</style>

