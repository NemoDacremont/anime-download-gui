
import { Version } from '../../../stores/animes';
import { downloader } from '../../../stores/download';
import { getAnimeFromID } from '../../../stores/animes';
import { settings } from '../../../stores/settings';

export const createEpisodeName = async (animeID: number, version: Version, episodeIndex: number): Promise<string> => {
	const anime = getAnimeFromID(version, animeID);
	const episode = await downloader.getCachedEpisodes(animeID, version, episodeIndex);

	// shoulden't actually happens
	if (!(anime && anime.title && episode)) return 'err';

	const animeTitle = anime.title.replace(/\W/g, ' ').replace(/ {2,}/g, '_');
	const episodeTitle = `${(anime.type && anime.type === "m0v1e")
		? animeTitle.replace(/\W/g, ' ').replace(/ {2,}/g, '_')
		: episode.title.replace(/\W/g, ' ').replace(/ {2,}/g, '_')}.mp4`;

	const formattedTitle = settings.episodeNameTemplate
		.replace('{ animeTitle }', animeTitle)
		.replace('{ version }', version)
		.replace('{ episodeTitle }', episodeTitle);

	return formattedTitle;
}

export default createEpisodeName;

