import { fetchTrending, fetctPopular } from '$lib/services/tmdb/service';

export async function load(){

    const trending = await fetchTrending();
    const popular = await fetctPopular();

    return {
        trending: trending,
        popular: popular
    };
};