
// Dependencies
import { Router } from 'express';

import { Version, getAnimeFromID, ExtractEpisodeList } from '../../../../stores/animes';

// Start

const episodesRouter = Router();

// ts things
interface RequestParams {
	version: Version;
	animeID: string;
	episode: string;
}

// Routes handler

episodesRouter.get('/:version/:animeID/:episode?', async (req, res, next) => {
	const { version, animeID: rawAnimeID, episode: rawEpisode } = req.params as unknown as RequestParams;
	const episodeInput = parseInt(rawEpisode), animeID = parseInt( rawAnimeID );

	// run next() if inputs are invalid, handle if episode is undefined
	if (isNaN(animeID) || (rawEpisode && isNaN(episodeInput)) ) {
		next();
		return;
	}

	const anime = getAnimeFromID( version, animeID );
	if (!anime) {
		next();
		return;
	}

	// handle if no episode is passed as param
	let output = null;

	if (rawEpisode && episodeInput) {
		output = await ExtractEpisodeList(anime, episodeInput);
	}
	else {
		output = await ExtractEpisodeList(anime);
	}

	if (!output) {
		next();
		return;
	}

	res.json(output);
});

export default episodesRouter;
