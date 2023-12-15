import * as imgService from '$lib/services/image';
import { getTMDBImageUrlFromPath } from '$lib/services/tmdb';
import type { RequestEvent } from '../$types';

export async function GET(req:RequestEvent) {
    const path = req.url.searchParams.get('path');
    if (!path) return;

    let img = await imgService.fetchSharpImage(getTMDBImageUrlFromPath(path));
    img = await imgService.sizeAndTrimImage(img);

    // TODO: Cache PNG to disk for future requests during testing
    return new Response(await img.png().toBuffer());
}