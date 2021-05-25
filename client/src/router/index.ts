import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
	},
	{
		path: '/anime/:version/:id',
		name: 'Anime',
    component: () => import(/* webpackChunkName: "anime" */ '@/views/Anime.vue')
	},
	{
		path: '/animelist/:version/:page',
		name: 'AnimeList',
    component: () => import(/* webpackChunkName: "animelist" */ '@/views/AnimeList.vue')
	},
	{
		path: '/download',
		name: 'Download',
    component: () => import(/* webpackChunkName: "download" */ '@/views/Download.vue')
	},
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
	},
	{
		path: '/:pathMatch(.*)*',
		name: '404',
    component: () => import(/* webpackChunkName: "notfound" */ '@/views/notFound.vue')
	},
	{
		path: '/settings',
		name: 'Settings',
		component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue')
	}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
