<script lang="ts">
	
	import { currentTitleId } from '$lib/stores/app-state.js';
	import Sidebar from '$lib/components/sidebar/sidebar.svelte';
	import ContentContainer from '$lib/components/content-container.svelte';
	import TapBar from '$lib/components/tabs/tap-bar.svelte';
	import TabbarMenuItem from '$lib/components/buttons/tab-button.svelte';
	import Metadata from '$lib/components/metadata/metadata.svelte';
	import Hub from '$lib/components/cards/hub.svelte';
	import HubGroup from '$lib/components/layout/hub-group.svelte';

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
</script>

<Sidebar />
<ContentContainer>
	<TapBar>
		<TabbarMenuItem label="Home" active={true} />
		<TabbarMenuItem label="Watchlist" />
	</TapBar>
	<Metadata/>
	<HubGroup>
		<Hub metadataItems={trending} title="Trending Movies" on:cardFocus={handleCardFocus} />
		<Hub metadataItems={popular} title="Popular Movies" on:cardFocus={handleCardFocus} />
		<Hub metadataItems={popular} title="Popular Movies" on:cardFocus={handleCardFocus} />
	</HubGroup>
</ContentContainer>
