
/*
*		URLs regexp checkers
*/

// TO-DO: not optimized, cpu runinng at 100% for no reason
export const myStreamCDNRegExp = /^https?:\/\/\w+\.mstreamcdn\.com(\/?\w+\.?)*?\.mp4$/

/*
*		Validator Function
*/
export const isValidURL = (url: string): boolean => {
	return myStreamCDNRegExp.test(url)
}
