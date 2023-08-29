import sharp, { type Sharp } from 'sharp';

export async function analyzeImage(url: string) {
    const meta: any = {};
    let img = await fetchSharpImage(url);
    img = await sizeAndTrimImage(img);
    const { info } = await img.png().toBuffer({ resolveWithObject: true });
    meta.url = url;
    meta.width = info.width;
    meta.height = info.height;
    meta.aspectRatio = Number((info.width / info.height).toFixed(2));
    meta.brightness = await analyzeBrightness(img);

    return {
        metadata: meta,
        imgdata: img
    }
}

// Rely solely on urls and image analysis so there is no reliance
// on any particular metadata by a data provider
export async function analyzeImages(urls: Array<string>) {
    if (!urls.length) return [];

    // analyze the images in parallell
    const imgs = await Promise.all(
        urls.map(async (url) => {
            return await analyzeImage(url);
        })
    );
    return imgs;
}

export async function sizeAndTrimImage(img: Sharp, height: number = 240) {
    return await img.trim().resize({ height: height })
}

export async function fetchSharpImage(url: string) {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return await sharp(bytes);
}

export async function analyzeBrightness(img: Sharp) {
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
    return brightness;
}