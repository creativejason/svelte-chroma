<script lang="ts">
	
	import { currentTitleId } from '$lib/stores/AppState.js';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ContentContainer from '$lib/components/ContentContainer.svelte';
	import TapBar from '$lib/components/TabBar.svelte';
	import TabbarMenuItem from '$lib/components/TabButton.svelte';
	import Metadata from '$lib/components/Metadata.svelte';
	import Hub from '$lib/components/Hub.svelte';
	import HubGroup from '$lib/components/HubGroup.svelte';
	import { onMount } from 'svelte';

	export let data;
	const { trending, popular } = data;
	let lastTitleFocused: any = null;

	function handleCardFocus(event: CustomEvent) {
		lastTitleFocused = event.detail.id;
		// Delay setting the current title to ensure they were not just quickly moving across
		setTimeout(() => {
			if (lastTitleFocused === event.detail.id) {
				currentTitleId.set(event.detail.id);
				console.log('Setting current title to ', event.detail.id);
			}
		}, 1000);
	}

	onMount(async () => {
		currentTitleId.set(trending[0].id);
	});




</script>
<!--
<Sidebar />
-->
<ContentContainer>
	<!--
	<TapBar>
		<TabbarMenuItem label="Home" active={true} />
		<TabbarMenuItem label="Watchlist" />
	</TapBar>
	-->
	
	<Metadata/>
	
</ContentContainer>
<HubGroup>
	<Hub metadataItems={trending} title="Trending Movies" on:cardFocus={handleCardFocus} />
	<Hub metadataItems={popular} title="Popular Movies" on:cardFocus={handleCardFocus} />
	<Hub metadataItems={popular} title="Popular Movies" on:cardFocus={handleCardFocus} />
</HubGroup>
