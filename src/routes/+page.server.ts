import { fetchTrending, fetctNowPlaying, fetctPopular } from '$lib/services/tmdb';

export async function load(){

    return {
        trending: await fetchTrending(),
        popular: await fetctPopular(),
        nowPlaying : await fetctNowPlaying()
    };
};