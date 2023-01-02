<script lang="ts">
    import SidebarMenuItem from "$lib/components/SidebarMenuItem.svelte";
    import SidebarProfileItem from "$lib/components/SidebarAvatarItem.svelte";

    // Icons
    import Home from "$lib/assets/icons/home.svg";
    import Search from "$lib/assets/icons/search.svg";
    import Movies from "$lib/assets/icons/movie.svg";
    import Shows from "$lib/assets/icons/tv.svg";
    import LiveTV from "$lib/assets/icons/live-tv.svg";
    import More from "$lib/assets/icons/overflow-horizontal-alt.svg";

    let expanded = false;

    function handleFocusIn(event:Event) {
        console.log('Focus in');
        expanded = true;
    }

    function handleFocusOut(event:Event) {
        expanded = false;
    }
    
</script>

<nav class="sidebar" on:focusin={handleFocusIn} on:focusout={handleFocusOut}>
    <SidebarProfileItem />
    <SidebarMenuItem icon={Search} title="Search" expanded={expanded} />
    <SidebarMenuItem icon={Home} title="Home" expanded={expanded}/>
    <SidebarMenuItem icon={Movies} title="Movies" subtitle="ServyMcServerson" expanded={expanded}/>
    <SidebarMenuItem icon={Shows} title="Shows" expanded={expanded}/>
    <SidebarMenuItem icon={LiveTV} title="Live TV" expanded={expanded}/>
    <SidebarMenuItem icon={More} title="More" expanded={expanded}/>
</nav>

<style lang="less">
    .sidebar{
        display: flex;
        flex-flow: column nowrap;
        padding: 64px 16px;
        gap: 8px;
        z-index:2;
        transition: all 500ms ease-in-out;
        height: 100%;
        opacity: .5;
        width:120px;
        &:focus-within{
            width:400px;
            opacity: 1;
        }
        
    }
</style>

