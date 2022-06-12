
export const chars_to_remove = /\W/g;

export const formatName = (name: string): string => {
	let out = name;
	out = out.replace(chars_to_remove, " ");
	out = out.replace(/ {2,}/g, " ");
	out = out.replace(/ /g, "_");
	out = out.toLocaleLowerCase();

	return out;
}

export default formatName;

