
export const PORT = parseInt(process.env.PORT? process.env.PORT: '8080');

export const logStyle: 'dev' | 'combined'
	= (process.env.NODE_ENV === 'production') ? 'combined': 'dev';
