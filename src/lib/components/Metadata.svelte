<script lang="ts">
	import { currentTitle } from '$lib/stores/AppState.js';
	import { toHoursAndMinutes } from '$lib/utils/utils';
	import Badge from './Badge.svelte';

	let releaseYear: any;
	let parentalRating: string;
	let topCast: string;
	let title: string;
    let runtime: string;
    let genres: string;
    let overview: string;
	let clearLogo: any

	$: {
		if ($currentTitle) {
			releaseYear = $currentTitle.release_date ? new Date($currentTitle.release_date).getFullYear() : 'Unknown';
			parentalRating = $currentTitle.release_dates.results.find((r: any) => r.iso_3166_1 === 'US')?.release_dates[0]?.certification || 'NR';
			topCast = $currentTitle.credits.cast.slice(0, 4).map((c: any) => c.name).join(', ');
            title = $currentTitle.title;
            runtime = toHoursAndMinutes($currentTitle.runtime);
            genres = $currentTitle.genres.map((g: any) => g.name).join(', ');
            overview = $currentTitle.overview;
			clearLogo = $currentTitle.hasClearLogo ? `./api/images/clearlogo/${$currentTitle.id}` : null;
		}
	}

</script>

{#if $currentTitle}
	<div class="metadata">
		<div class="title-container">			
			{#if clearLogo}
				<img class="clear-logo" src={clearLogo} alt="Clear Logo" />
			{:else}
				<h1 id="text-title">{title}</h1>
			{/if}
		</div>	
		<div class="attributes">
			<p class="text-body-2">
				<span>{releaseYear}</span>
				<span>{runtime}</span>
				<span>{parentalRating}</span>
				<span>•</span>
				<span>{genres}</span>
				<Badge label="Watched" />
			</p>
		</div>
		<div class="summary-container">
            <p class="summary text-body-1">{overview}</p>
        </div>
		<p class="cast text-body-2">{topCast}</p>
	</div>
{/if}

<style lang="less">

	.metadata {
		padding: 48px 80px 0 80px;
		display: flex;
		flex-flow: column nowrap;
		gap: 16px;
	}
	.title-container {
		display: flex;
		align-items: end;
		height: 160px;
		width: 60%;
	}
	h1 {
		color: var(--color-text-primary);
		font-size: var(--font-tv-display-2-font-size);
		text-shadow: 0 0 16px rgba(0,0,0,.3);
	}
	.clear-logo {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: left bottom;
	}
	.attributes {
		color: var(--color-text-muted);
		display: flex;
		flex-flow: column nowrap;
		p {
			display: flex;
			gap: 16px;
			align-items: center;
		}
	}
    .summary-container {
        display: flex;
        align-items: center;
        min-height: 96px;
    }
	.summary {
		max-width: 800px;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.cast {
		color: var(--color-text-muted);
	}
</style>
