import { error, type RequestEvent } from '@sveltejs/kit';
import { getTitleImages } from '$lib/services/tmdb';
import sharp, { type Sharp } from 'sharp';

const MIN_LOGO_ASPECT_RATIO = 2.3;
const TMDB_IMAGE_BASE_PATH = 'https://image.tmdb.org/t/p/w500/';

export async function GET(req: RequestEvent) {
    if (!req.params.id) return;
    const images = await getTitleImages(req.params.id);
    const logos = images.logos;
    const logo = selectBestClearLogo(logos);

    // Output debug json if debug param is present
    if (req.url.searchParams.has('debug')) {
        const debugInfo = {
            selected: logo,
            canidates: logos
        }
        return new Response(JSON.stringify(debugInfo));
    }
    if(!logo){
        throw error(404, 'No qualified logo for this title');
    }
    // Fetch the winning clear logo and process the image as needed
    let img = await fetchSharpImage(`${TMDB_IMAGE_BASE_PATH}${logo.file_path}`);
    img = await sizeAndPrumeImage(img);
    img = await adjustBrightness(img);
    return new Response(await img.png().toBuffer());
}

function selectBestClearLogo(logos: any) {
    if(!logos.length) return;
    // copy
    logos = [...logos];
    // sort by vote average
    logos.sort((a: any, b: any) => b.vote_average - a.vote_average);
    // qualify logo canidates (currently on aspect ratio in the data)
    const logoCanidates = logos.filter((logo: any) => logo.aspect_ratio > MIN_LOGO_ASPECT_RATIO);
    // TODO: We should eventually fully disqualify logos that don't meet criteria
    // For now we will return the top rated if no canidates passed
    return logoCanidates[0] || logos[0];
}

async function sizeAndPrumeImage(img: Sharp) {
    return await img.trim().resize({ height: 120 })
}

async function fetchSharpImage(url: string) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return await sharp(bytes);
}


async function adjustBrightness(img: Sharp) {
    let testImg = img.clone();
    let nonAlphaPixels = 0;
    let avgColorVals = 0;
    // Downsize the image for performance
    await testImg.resize({ height: 60 })
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => {
            for (let x = 0, len = data.length; x < len; x += 4) {
                let r = data[x];
                let g = data[x + 1];
                let b = data[x + 2];
                let a = data[x + 3];

                // Only include pixels with high enough alpa in the final calculation
                if (a > 25) {
                    nonAlphaPixels++;
                    avgColorVals += Math.floor((r + g + b) / 3);
                }
            }
        });
    const brightness = Math.floor(avgColorVals / nonAlphaPixels);
    if (brightness < 30) {
        console.log(`Image is brightness is low (${brightness}), fixing!`)
        img.grayscale()
        img.negate({ alpha: false });
    }
    return img;
}