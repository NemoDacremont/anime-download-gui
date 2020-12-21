
import { createStore } from 'vuex';

export default createStore({
	state: {
		API_BASE_URL:
			process.env.NODE_ENV === "production"
				? '/api'
				: 'http://localhost:8080/api'
	}
});
