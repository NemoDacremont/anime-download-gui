
import { updateVOSTFRAnimeList, updateVFAnimeList } from '../../stores/animes';

export default async function (): Promise<void> {
	await updateVOSTFRAnimeList();
	await updateVFAnimeList();
}
