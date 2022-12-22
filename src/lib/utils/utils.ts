export function getTMDBImageUrlFromPath(path:string, size:number = 500){
    return `https://image.tmdb.org/t/p/w${size}/${path}`
}

export function toHoursAndMinutes(totalMinutes:number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
}