import { defineStore } from 'pinia'

export const useScreenStore = defineStore('screen', {
	state: () => ({
		width: 0,
		height: 0,
		scroll: 0,
		scroll_direction: 'down',
		is_mobile: false,
		menu_show: true,
	}),
})


