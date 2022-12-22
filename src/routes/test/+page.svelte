<script lang="ts">
   
	import { currentTitle, currentTitleId } from "$lib/stores/app-state.js"
	import Hub from "$lib/components/cards/hub.svelte";

	export let data;
	const { trending, popular } = data;
	let lastTitleFocused:any = null;

	function handleCardFocus(event:CustomEvent){
		lastTitleFocused = event.detail.id;
		// Delay setting the current title to ensure they were not just quickly moving across
		setTimeout(() => {
			if(lastTitleFocused === event.detail.id){
				currentTitleId.set(event.detail.id);
				console.log('Setting current title to ', event.detail.id);
			}			
		}, 1000);		
    }

</script>
<div class="nav"></div>
<div class="hubs">
	<Hub metadataItems={trending} title="Trending Movies" on:cardFocus={handleCardFocus}/>
	<Hub metadataItems={popular} title="Popular Movies" on:cardFocus={handleCardFocus}/>
	<Hub metadataItems={popular} title="Popular Movies" on:cardFocus={handleCardFocus}/>
</div>

<style lang="less">
	.nav{
		min-width:200px;
	}
	.hubs{
		//overflow: hidden;
		border: 1px solid blue;
	
	}
</style>
