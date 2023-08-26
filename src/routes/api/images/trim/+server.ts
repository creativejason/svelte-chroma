import type { RequestEvent } from '@sveltejs/kit';
import{UltimateTextToImage, registerFont} from "ultimate-text-to-image";
import sharp, { type Sharp } from 'sharp';
const devCache = new Map();

registerFont('src/lib/assets/fonts/Flicker.otf', {family: "flicker"});


async function getAverageBrightness(img: Sharp) {
  let nonAlphaPixels = 0;
  let avgColorVals = 0;
  // Downsize the image for performance
  await img.resize({ height: 60 })
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    for (let x = 0, len = data.length; x < len; x += 4) {
      let r = data[x];
      let g = data[x + 1];
      let b = data[x + 2];
      let a = data[x + 3];
      
      // Only include pixels with high enough alpa in the final calculation
      if(a > 25){
        nonAlphaPixels++;
        avgColorVals += Math.floor((r + g + b) / 3);
      }
    }
  });
  const brightness = Math.floor(avgColorVals / nonAlphaPixels);
  console.log("Brightness: ", brightness)
  return brightness;
}


async function sizeAndPrumeImage(img: Sharp) {
  return await img.trim().resize({ height: 120 })
}

async function fetchSharpImage(url:string){
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  return await sharp(bytes);
}

async function textToImage(text:string){
  //let buff = new UltimateTextToImage(text, {width: 150, fontFamily: "Arial, Sans"})
  let buff = new UltimateTextToImage(text, {
    width: 500,
    maxWidth: 1000,
    maxHeight: 160,
    fontSize: 72,
    minFontSize: 32,
    fontColor: "#FFFFFF",
    fontFamily: "flicker"
  })
  .render().toBuffer();
  return await sharp(buff);
}

export async function GET({ url }: RequestEvent) {
  if (!url.searchParams.has('url')) return;
  const imageUrl = String(url.searchParams.get('url'));
  let img = await fetchSharpImage(imageUrl);
  //let img = await textToImage("Doctor Strange in the Multiverse of Madness");

  // If we have the trimmed version of the image in cache, return it
  //if (devCache.has(imageUrl)) {
    //console.log('returning cached version');
    //return new Response(devCache.get(imageUrl));
  //}

  // Clean up extra 0 alpa pixels on the edges and size the image to reduce bandwidth and calcs
  img = await sizeAndPrumeImage(img);

  // Fix Dark Logos
  const avgBrightness = await getAverageBrightness(img.clone());
  if(avgBrightness < 30){
    img.grayscale()
    img.negate({alpha:false});
  }

  return new Response(await img.png().toBuffer());
}