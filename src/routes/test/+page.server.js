import { env } from '$env/dynamic/private';

export const load = async () => {
    
    const fetchTrending = async () => {
        const uri = `https://api.themoviedb.org/3/trending/movie/week?api_key=${env.TMDB_API_KEY}`;
        const res = await fetch(uri);
        const data = await res.json();
        return data.results;
    }

    const fetctPopular = async () => {
        const uri = `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&api_key=${env.TMDB_API_KEY}`;
        const res = await fetch(uri);
        const data = await res.json();
        return data.results;
    }

    return {
        trending: fetchTrending(),
        popular: fetctPopular()
    };
};