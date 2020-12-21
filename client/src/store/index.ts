import { createStore } from 'vuex'

export const constants = createStore({
	state: {
		API_BASE_URL:
			process.env.NODE_ENV === "production"
				? '/api'
				: 'http://localhost:8080/api'
	}
})

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
