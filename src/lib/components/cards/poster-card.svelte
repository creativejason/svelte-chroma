<script lang="ts">

    import { hoverToFocus } from "$lib/actions/focusable"    
    import { createEventDispatcher } from 'svelte';
    
    export let backgroundImage:string = "";
    export let data:any = {};
    let elm:HTMLElement;

    const dispatch = createEventDispatcher();

    function handleFocus(){
        dispatch('cardFocus', data);
        elm.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }

</script>

<li bind:this={elm} class="poster-card dpad-focusable" style:--background-image=url({backgroundImage}) use:hoverToFocus on:focus={handleFocus}>   
</li>


<style lang="less">

    .poster-card{
        background-image: var(--background-image);
        background-size: cover;
        width: 240px;
        min-width: 240px;;
        height: 360px;
        background-color: rgba(0,0,0,.5);
        border-radius: 8px; 
        transition: transform 300ms;
        position: relative;
        &:focus{
            transform: scale(1.1);
            border: solid 2px black;
            outline: 2px solid var(--color-background-focus);
            box-shadow: 16px 16px 16px rgba(0,0,0,.5);
        }
        /*&:first-child{
            margin-left: 112px;
        }
        */
        
       
    }

</style>