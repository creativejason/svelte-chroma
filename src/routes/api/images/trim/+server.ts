import type { RequestEvent } from '@sveltejs/kit';
import sharp from 'sharp';
const devCache = new Map();

export async function GET({url}:RequestEvent) {
  if(!url.searchParams.has('url')) return;    
  const imageUrl = String(url.searchParams.get('url'));

  // If we have the trimmed version of the image in cache, return it
  if(devCache.has(imageUrl)){
    console.log('returning cached version');
    return new Response(devCache.get(imageUrl));
  }
  
  const res = await fetch(imageUrl);
  const buffer = await res.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const data = await sharp(bytes)
    .trim()
    .resize({ height: 120 })
    .png()
    .toBuffer();

  // Cache the trimmed image
  devCache.set(imageUrl, data);
  return new Response(data);
}