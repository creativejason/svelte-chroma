import { writable, derived, readable, type Writable } from 'svelte/store';
import * as tmdb from '$lib/services/tmdb';
import * as fanart from '$lib/services/fanart';

async function asyncGetMovieDetails($id:Writable<string>) {
    const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${ $id }/`)
	const data = await request.json()
    return data;
}

export const currentTitleId = writable('');

export const currentTitle:any = derived(currentTitleId, async ($currentTitleId, set) => {
    if(!$currentTitleId) return;
    let tmdb_data = await tmdb.getMovieDetails($currentTitleId);
    set(tmdb_data);
});
