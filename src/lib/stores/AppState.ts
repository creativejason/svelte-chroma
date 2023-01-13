import { writable, derived, readable, type Writable } from 'svelte/store';

async function asyncGetMovieDetails($id:Writable<string>) {
    const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${ $id }/`)
	const data = await request.json()
    return data;
}

export const currentTitleId = writable('');

export const currentTitle:any = derived(currentTitleId, async ($currentTitleId, set) => {
    if(!$currentTitleId) return;
	
    const res = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${ $currentTitleId }?api_key=45adfcd2d9670f40952762676f9d2097&append_to_response=release_dates,credits`),
        fetch(`https://webservice.fanart.tv/v3/movies/${ $currentTitleId }?api_key=6bf291ef6526e64508b2f6a23b6d9694`),
    ]);

    const [tmdb_data, fanart_data] = await Promise.all(res.map(r => r.json()));
    tmdb_data.clearLogo = fanart_data.hdmovielogo?.[0].url;
    set(tmdb_data);
});
