import { writable, derived, readable, type Writable } from 'svelte/store';

async function asyncGetMovieDetails($id:Writable<string>) {
    const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${ $id }/`)
	const data = await request.json()
    return data;
}

export const currentTitleId = writable('');
export const currentTitle:any = derived(currentTitleId, async ($currentTitleId, set) => {
    if(!$currentTitleId) return;
    const tmdb_request = await fetch(`https://api.themoviedb.org/3/movie/${ $currentTitleId }?api_key=45adfcd2d9670f40952762676f9d2097&append_to_response=release_dates,credits`)
	const tmdb_data = await tmdb_request.json();

    const fanart_request = await fetch(`https://webservice.fanart.tv/v3/movies/${ $currentTitleId }?api_key=6bf291ef6526e64508b2f6a23b6d9694`)
    const fanart_data = await fanart_request.json();

    if(fanart_data.hdmovielogo) {
        tmdb_data.clearLogo = fanart_data.hdmovielogo[0].url;
    }
    set(tmdb_data);
});
