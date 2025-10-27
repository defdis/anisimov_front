import {defineStore} from 'pinia'
// Импортируем userStore, чтобы получить данные клиента
import host from "../../host.js";
import { useAuthStore } from "@/stores/userStore.js"
const LOCAL_STORAGE_KEY = 'anisimov_proj_order';


export const useAllOrdersStore = defineStore('allOrders', {
    state: () => ({
		orders: [],
	}),
    actions: {

    },

    getters: {

    },
});

export default useAllOrdersStore;

