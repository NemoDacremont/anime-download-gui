

const values = [
	0,
	"f",
	1,
	"a",
	2,
	"b",
	"d",
	3,
	"e",
	4,
	5,
	"c",
	6,
	7,
	8,
	9,
	"constructor",
	"o",
	"return",
	"t",
	"r",
	"u"
]

interface JJKeysValues {
	[key: string]: string | number;
}

const testRegExp = /^\s?\$=~\[\].*?\(\);?$/;

export function JJDecodeMyStream (EncodedString: string): string | null {
	if (!testRegExp.test(EncodedString)) throw new Error("Input is not correct.");

	const objMatch = EncodedString.match(/\{.*?\};/);
	if (!objMatch) throw new Error("No $={...} found");

	const keyValuesMatch = objMatch[0].match(/(_|\$)+:.*?(,|;$)/g);
	if (!keyValuesMatch) throw new Error("No properties found in $={...}.");

	const $: JJKeysValues = {};
	let length = 0;
	for (const keyValue in keyValuesMatch) {
		const [key, value] = keyValuesMatch[keyValue].split(":");
		$[key] = values[length++];
	}

	const secondKeyValuesMatch = EncodedString.match(/.*?;/g);
	if (!(secondKeyValuesMatch && secondKeyValuesMatch[2] && secondKeyValuesMatch[3])) throw new Error("No lines found");

	for (let i=2 ; i<=3 ; i++) {
		const keys = secondKeyValuesMatch[i].match(/(\$|_)+=/g);
		if (!keys) throw new Error("No property definition found in line.");
		for (let x=0 ; x<keys.length ; x++) {
			const key = keys[x].replace("=", "");
			if (!Object.keys($).includes(key)) $[key] = values[length++];
		}
	}

	//  Match the encoded Content
	const content = EncodedString.match(/\\".+\\"/);
	if (!content) throw new Error("No content found.");

	let out = content[0];

	const test = Object.keys($).sort((a,b) => b.length-a.length);

	for (const key of Object.keys($).sort((a,b) => b.length-a.length)) {
		const value = $[key];
		const s = "\\$\\.\\" + key.split("").join("\\");
		out = out.replace(new RegExp(s, "g"), value.toString());
	}

	//  Replace (![]+"")[number] by the value
	out = out.replace(/\(!\[\]\+""\)\[\d\]/g, (a) => {
		const nmatches = a.match(/\d/)
		if (!nmatches) return "";

		const number = parseInt(nmatches[0]);
		return "false"[number];
	});

	out = out.replace(/"|\+/g, "").replace(/ {2,}/g, "");

	out = out.replace(/\\\d{2,3}/g, (a) => {
		a = a.replace(/ |\\/g, "");
		return String.fromCharCode(parseInt(a, 8));
	});

	return out.replace(/\\/g, "");
}

export default JJDecodeMyStream;
