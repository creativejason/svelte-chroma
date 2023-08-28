// TODO: Move API KEY to env variable
// TODO: Develop cache for image urls

const PUBLIC_TMDB_API_KEY = "45adfcd2d9670f40952762676f9d2097"

async function makeTMDBRequest(uri:string, params:any = {}){
    let url = new URL(`https://api.themoviedb.org/3`+ uri);
    params.api_key = PUBLIC_TMDB_API_KEY;
    url.search = Object.keys(params).map((key: string) => key + '=' + params[key]).join('&');
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export async function getMovieDetails(titleId:string){
    const details = await makeTMDBRequest(`/movie/${ titleId }`,{
        append_to_response:'release_dates,credits'
    });
    details.images = await getTitleImages(titleId);
    if(details.images.logos.length){
        details.hasClearLogo = true;
    }
    return details;
}

export async function getTitleImages(titleId:string){
    return await makeTMDBRequest(`/movie/${ titleId }/images`,{
        include_image_language:'en'
    });
}

export function getTMDBImageUrlFromPath(path:string, size:number = 500){
    return `https://image.tmdb.org/t/p/w${size}/${path}`
}

export async function getClearLogoUrl(titleId:string){
    const images = await makeTMDBRequest(`/movie/${ titleId }/images`,{
        include_image_language:'en'
    });
    if(!images.logos || !images.logos.length)
        return;
    return getTMDBImageUrlFromPath(images.logos[0].file_path);
}

export async function fetchTrending() {
    const data = await makeTMDBRequest('/trending/movie/week');
    return data.results;
}

export async function fetctPopular() {
    const data = await makeTMDBRequest('/discover/movie',{
        language:'en-US',
        sort_by : 'popularity.desc',
        include_adult : false,
        include_video : false,
        page: Math.floor(Math.random() * 100)
    });
    return data.results;
}

export async function fetctNowPlaying() {
    const data = await makeTMDBRequest('/movie/now_playing',{
        language:'en-US',
        page: Math.floor(Math.random() * 10)
    });
    return data.results
}

export async function getImageURL(path: string, type: string) {
    const config = await makeTMDBRequest('/configuration');
    const base_url = config.images.secure_base_url;
    const size = config.images[type];
    return `${base_url}${size}${path}`;
}