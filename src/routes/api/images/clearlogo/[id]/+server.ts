import { error, type RequestEvent } from '@sveltejs/kit';
import { getTitleImages } from '$lib/services/tmdb';
import * as imgService from '$lib/services/image';

const TMDB_IMAGE_BASE_PATH = 'https://image.tmdb.org/t/p/w500/';
const MIN_BRIGHTNESS = 75;
const MIN_ASPECT_RATIO = 2.5;
const MAX_ASPECT_RATIO = 12;
const OPTIMAL_BRIGHTNESS_LOW = 100;
const OPTIMAL_BRIGHTNESS_HIGH = 255;
const OPTIMAL_ASPECT_LOW = 3;
const OPTIMAL_ASPECT_HIGH = 8;

export async function GET(req: RequestEvent) {
    if (!req.params.id) return;
    
    const images = await getTitleImages(req.params.id);
    const urls = images.logos.map((logo: any) => {
        return `${TMDB_IMAGE_BASE_PATH}${logo.file_path}`;
    });

    let canidates = await imgService.analyzeImages(urls);
    let preferred: any = null;

    /* 
    * Let's assume we want to postprocess images as little as possible
    * That approach should help assume what you see (tmdb / mCMS) is what you get
    * and reduce mental complexity & tech debt in the future
    */

    // Optimal canidate search
    preferred = canidates.find((c) => {
        const optimal = c.metadata.aspectRatio >= OPTIMAL_ASPECT_LOW &&
            c.metadata.aspectRatio <= OPTIMAL_ASPECT_HIGH &&
            c.metadata.brightness >= OPTIMAL_BRIGHTNESS_LOW &&
            c.metadata.brightness <= OPTIMAL_BRIGHTNESS_HIGH
        if(optimal){
            console.log('Optimal logo found for ', req.params.id);
            return true;
        }
    });
    
    // Secondary canidate search
    if(!preferred) {
        preferred = canidates.find((c) => {
            const secondary = c.metadata.aspectRatio >= MIN_ASPECT_RATIO &&
                c.metadata.aspectRatio <= MAX_ASPECT_RATIO &&
                c.metadata.brightness >= OPTIMAL_BRIGHTNESS_LOW &&
                c.metadata.brightness <= OPTIMAL_BRIGHTNESS_HIGH
            if(secondary){
                console.log('Secondary canidate found for ', req.params.id);
                return true;
            }
        });
    }
    
    // Fallback acceptance
    // TODO: Improve this logic
    if(!preferred) {
        // Prioritize brightness, then aspect ratio while filtering items that would just be a bad experience
        let rankedBrightness = [...canidates].sort((a, b) => b.metadata.brightness - a.metadata.brightness);
        let rankedAspectRatio = canidates.filter(c => c.metadata.aspectRatio > MIN_ASPECT_RATIO)
            .sort((a: any, b: any) => b.aspectRatio - a.aspectRatio);
        preferred = rankedBrightness.find(c => rankedAspectRatio.includes(c));

        // Since we are not working with an optimal clearlogo (sometimes there is only a single candiate)
        // Let's greyscale and invert anything below the min brightness (usually full black or dark grey)
        if (preferred) {
            console.log('Fallback canidate found for ', req.params.id);
            if(preferred.metadata.brightness < MIN_BRIGHTNESS){
                console.log(`brightness is low (${preferred.metadata.url}) for ${preferred.metadata.brightness}, fixing!`);
                preferred.imgdata = await preferred.imgdata.grayscale().negate({ alpha: false });
            } 
        } else {
            throw error(404, 'No qualified logo for this title');
        }
    }

    // Output debug json if debug param is present
    if (req.url.searchParams.has('debug') && canidates) {
        const debugInfo = {
            prefered: preferred ? preferred.metadata : null,
            canidates: canidates.map(c => c.metadata)
        }
        return new Response(JSON.stringify(debugInfo));
    }

    // TODO: Cache PNG to disk for future requests during testing
    return new Response(await preferred.imgdata.png().toBuffer());
}