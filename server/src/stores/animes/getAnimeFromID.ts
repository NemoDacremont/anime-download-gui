
import { Anime, animeList, Version } from ".";

export function getAnimeFromID (version: Version, animeID: number): Anime | null {
	const animelist = animeList[version];

	for (let i=0 ; i<animelist.length ; i++) {
		const anime = animelist[i]
		if (anime.id === animeID) return anime;
	}

	return null;
}
