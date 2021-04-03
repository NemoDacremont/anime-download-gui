
import { updateVOSTFRAnimeList, updateVFAnimeList } from '../../stores/animes/cacheAnimeList';

export default async function (): Promise<void> {
	updateVOSTFRAnimeList();
	updateVFAnimeList();
}
