import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Home from '@/views/Home.vue'
import notFound from '@/views/notFound.vue';
import Anime from '@/views/Anime.vue';
import AnimeList from '@/views/AnimeList.vue';
import Download from '@/views/Download.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
	},
	{
		path: '/anime/:version/:id',
		name: 'Anime',
		component: Anime
	},
	{
		path: '/animelist/:version/:page',
		name: 'AnimeList',
		component: AnimeList
	},
	{
		path: '/download',
		name: 'Download',
		component: Download
	},
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		name: '404',
		component: notFound
	}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
