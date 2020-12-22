
export type DefaultView = 'grid' | 'list';

export const API_BASE_URL = process.env.NODE_ENV === "production"
	? '/api'
	: 'http://localhost:8080/api';

export const ANIME_PER_PAGE = 50;

export const DEFAULT_VIEW: DefaultView = 'grid';
