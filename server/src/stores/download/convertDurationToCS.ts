
export const convertDurationToCS = (duration: string): number => {

	const splittedDuration = duration.split(":");
	const [ rawHours, rawMinutes, rawSeconds ] = splittedDuration;
	if ( !(rawHours && rawMinutes && rawSeconds) ) {
		return NaN;
	}

	const [ rawSec, rawCSec ] = rawSeconds.split(".");

	const hours = parseInt(rawHours);
	const minutes = parseInt(rawMinutes);
	const seconds = parseInt(rawSec);
	const cSeconds = parseInt(rawCSec);

	const out = cSeconds +
							seconds * 100 +
							minutes * 10000 +
							hours * 1000000;

	return out;
};

export default convertDurationToCS;

