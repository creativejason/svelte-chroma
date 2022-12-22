import { env } from '$env/dynamic/private';

// TODO: Develop cache for image urls

export async function fetchTrending() {
    const uri = `https://api.themoviedb.org/3/trending/movie/week?api_key=${env.TMDB_API_KEY}`;
    const res = await fetch(uri);
    const data = await res.json();
    return data.results;
}

export async function fetctPopular() {
    const uri = `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&api_key=${env.TMDB_API_KEY}`;
    const res = await fetch(uri);
    const data = await res.json();
    return data.results;
}

export async function getImageURL(path: string, type: string) {
    const uri = `https://api.themoviedb.org/3/configuration?api_key=${env.TMDB_API_KEY}`;
    const res = await fetch(uri);
    const data = await res.json();
    const base_url = data.images.secure_base_url;
    const size = data.images[type];
    return `${base_url}${size}${path}`;
}