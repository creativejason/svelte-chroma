<script lang="ts">
	
	import { currentTitleId } from '$lib/stores/AppState.js';
	import Metadata from '$lib/components/Metadata.svelte';
	import Hub from '$lib/components/Hub.svelte';
	import HubGroup from '$lib/components/HubGroup.svelte';
	import { onMount } from 'svelte';

	export let data:any;
	let lastTitleFocused: any = null;

	function handleCardFocus(event: CustomEvent) {
		lastTitleFocused = event.detail.id;
		// Delay setting the current title for debounce
		setTimeout(() => {
			if (lastTitleFocused === event.detail.id) {
				currentTitleId.set(event.detail.id);
				console.log('Setting current title to ', event.detail.id);
			}
		}, 500);
	}

	onMount(async () => {
		if(data.popular && data.popular[0]){
			currentTitleId.set(data.popular[0].id);
		}		
	});

</script>

<Metadata/>
<HubGroup>
	<Hub metadataItems={data.popular} title="Popular Movies" on:cardFocus={handleCardFocus} />
	<Hub metadataItems={data.trending} title="Trending Movies" on:cardFocus={handleCardFocus} />
	<Hub metadataItems={data.nowPlaying} title="Popular Movies" on:cardFocus={handleCardFocus} />
</HubGroup>
