<script lang="ts">
	import { currentTitle } from '$lib/stores/app-state.js';
	import { toHoursAndMinutes } from '$lib/utils/utils';

	let releaseYear: any;
	let parentalRating: string;
	let topCast: string;
	let title: string;
    let runtime: string;
    let genres: string;
    let overview: string;
	let clearLogo: any
	let useClearLogo = true;

	$: {
		if ($currentTitle) {
			releaseYear = $currentTitle.release_date ? new Date($currentTitle.release_date).getFullYear() : 'Unknown';
			parentalRating = $currentTitle.release_dates ? $currentTitle.release_dates.results.find((r: any) => r.iso_3166_1 === 'US')?.release_dates[0]?.certification : 'NR';
			topCast = $currentTitle.credits.cast.slice(0, 4).map((c: any) => c.name).join(', ');
            title = $currentTitle.title;
            runtime = toHoursAndMinutes($currentTitle.runtime);
            genres = $currentTitle.genres.map((g: any) => g.name).join(', ');
            overview = $currentTitle.overview;
			clearLogo = $currentTitle.clearLogo ? `./api/images/trim?url=${$currentTitle.clearLogo}` : null;
			console.log(clearLogo);
		}
	}
</script>

{#if $currentTitle}
	<div class="metadata">
		{#if useClearLogo}
			{#if $currentTitle.clearLogo}
				<img class="clear-logo" src={clearLogo} alt="Clear Logo" />
			{:else}
				<h1>{title}</h1>
			{/if}			
		{/if}		
		<div class="attributes">
			<p class="text-body-2">
				<span>{releaseYear}</span>
				<span>{runtime}</span>
				<span class="badge">{parentalRating}</span>
				<span class="badge">Watched</span>
			</p>
			<p class="text-body-2">{genres}</p>
		</div>
		<div class="summary-container">
            <p class="summary text-body-1">{overview}</p>
        </div>
		<p class="cast text-body-2">{topCast}</p>
	</div>
{/if}

<style lang="less">
	.metadata {
		display: flex;
		flex-flow: column nowrap;
		gap: 16px;
	}
	h1 {
		color: var(--color-text-primary);
		//font-size: var(--font-tv-display-1-font-size);
		line-height: 160px;
		text-shadow: 4px 4px 16px rgba(0,0,0,1);
	}
	.clear-logo {
		height: 160px;
		width: 700px;
		object-fit: contain;
		object-position: left center;
	}
	.attributes {
		color: var(--color-text-muted);
		display: flex;
		flex-flow: column nowrap;
		p {
			display: flex;
			gap: 16px;
		}
	}
    .summary-container {
        display: flex;
        align-items: center;
        min-height: 96px;
    }
	.summary {
		max-width: 700px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.cast {
		color: var(--color-text-muted);
	}
</style>
