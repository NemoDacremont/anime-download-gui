
export const parseDownloadPath = (path: string): string => {
	let out = path;
	if (out.includes('~')) {
		if (!process.env.HOME) throw new Error("process.env.HOME is null");

		out.replace("~", process.env.HOME);
	}

	return out;
};

export default parseDownloadPath;

