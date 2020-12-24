
// Dependencies
import { Router } from 'express';

import getEpisodes from './getEpisodesList';
import getAnimeFromID from './getAnimeFromID';
import { Version } from '../../../../stores/animes';

// Store
//import { animeList } from '../../../../stores/animes';

const episodesRouter = Router();

interface RequestParams {
	version: Version;
	animeID: string;
	episode: string;
}

episodesRouter.get('/:version/:animeID/:episode', async (req, res, next) => {
	const { version, animeID: rawAnimeID, episode: rawEpisode } = req.params as unknown as RequestParams;
	const episodeInput = parseInt(rawEpisode), animeID = parseInt( rawAnimeID );
	if (isNaN(animeID) || isNaN(episodeInput)) {
		next();
		return;
	}

	const anime = getAnimeFromID( version, animeID );
	if (!anime) {
		next();
		return;
	}

	const episode = await getEpisodes(anime, episodeInput);
	res.json(episode);
});

episodesRouter.get('/:version/:animeID/', async (req, res, next) => {
	const { version, animeID: rawAnimeID } = req.params as unknown as RequestParams;
	const animeID = parseInt( rawAnimeID );
	if (isNaN(animeID)) {
		next();
		return;
	}

	const anime = getAnimeFromID( version, animeID );
	if (!anime) {
		next();
		return;
	}

	const episodes = await getEpisodes(anime);
	res.json(episodes);
});

export default episodesRouter;
