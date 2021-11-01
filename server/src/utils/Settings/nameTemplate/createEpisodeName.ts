
import { Version } from '../../../stores/animes';
import { downloader } from '../../../stores/download';
import { getAnimeFromID } from '../../../stores/animes';
import { settings } from '../../../stores/settings';

export const createEpisodeName = async (animeID: number, version: Version, episodeIndex: number): Promise<string> => {
	const anime = getAnimeFromID(version, animeID);

	const episodeTitle = (await downloader.getCachedEpisodes(animeID, version, episodeIndex)).title;
	const animeTitle = anime.title.replace(/\W/g, ' ').replace(/ {2,}/g, '_');

	const formattedTitle = settings.episodeNameTemplate
		.replace('{ animeTitle }', animeTitle)
		.replace('{ version }', version)
		.replace('{ episodeTitle }', episodeTitle);

	return formattedTitle;
}

export default createEpisodeName;

