// TODO: Move API key to env variable

const PUBLIC_FANART_API_KEY = "6bf291ef6526e64508b2f6a23b6d9694"

async function makeServiceRequest(uri:string, params:any = {}){
    let url = new URL(`https://webservice.fanart.tv/v3`+ uri);
    params.api_key = PUBLIC_FANART_API_KEY;
    url.search = Object.keys(params).map((key: string) => key + '=' + params[key]).join('&');
    const res = await fetch(url);
    const data = await res.json();
    return data.results;
}

export async function getMovieDetails(titleId:string){
    return await makeServiceRequest(`/movies/${ titleId }`);
}

