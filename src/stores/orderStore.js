import {defineStore} from 'pinia'
// Импортируем userStore, чтобы получить данные клиента

import host from "../../host.js";
import { useAuthStore } from "@/stores/userStore.js"
// Ключ для хранения в localStorage
const LOCAL_STORAGE_KEY = 'anisimov_proj_order';

// Функция для загрузки состояния из localStorage
const loadStateFromLocalStorage = () => {
    try {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (e) {
        console.error("Failed to parse order state from localStorage", e);
    }
    return {
        client: {
            name: '',
            phone: '',
            email: '',
            address: '',
        },
        furniture_items: [],
    };
};

// Функция для сохранения состояния в localStorage
const saveStateToLocalStorage = (state) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save order state to localStorage", e);
    }
};

export const useOrderStore = defineStore('order', {
    state: () => loadStateFromLocalStorage(),

    actions: {
        _saveState() {
            saveStateToLocalStorage(this.$state);
        },

        addItem(newItem) {
            const existingItem = this.getItemByID(newItem.id);
            if (existingItem) {
                this.updateQuantity(newItem.id, existingItem.quantity + (newItem.quantity || 1));
            } else {
                this.furniture_items = [
                    ...this.furniture_items,
                    {...newItem, quantity: newItem.quantity || 1},
                ];
            }
            this._saveState();
        },

        updateQuantity(itemId, quantity) {
            if (quantity <= 0) {
                this.removeItem(itemId);
                return;
            }
            this.furniture_items = this.furniture_items.map(item =>
                    item.id === itemId ? {...item, quantity: quantity} : item
            );
            this._saveState();
        },

        updateItem(updatedItem) {
            this.furniture_items = this.furniture_items.map(item =>
                    item.id === updatedItem.id ? updatedItem : item
            );
            this._saveState();
        },

        removeItem(itemId) {
            this.furniture_items = this.furniture_items.filter((i) => i.id !== itemId);
            this._saveState();
        },

        clearOrder() {
            this.furniture_items = [];
            this._saveState();
        },

        // --- НОВЫЙ ACTION ДЛЯ ОТПРАВКИ ЗАКАЗА ---
        async submitOrder(orderData) {
            let auth = useAuthStore()
            const url = host + '/api/v1/order/';
            // 1. Готовим данные для отправки
            const payload = {
                client: {
                    phone: orderData.client.phone || '',
                    name: orderData.client.name|| '',
                    email: orderData.client.email || '',
                    address: orderData.client.address || '',
                },
                description: orderData.description || 'Новый заказ',
                // Трансформируем данные из корзины в формат, который ожидает сервер
                furniture: this.furniture_items.map(item => ({
                    // Убедитесь, что все эти поля есть в объекте item
                    category_string: JSON.stringify(item.category) || 'Без категории',
                    material_string: JSON.stringify(item.material) || 'Без материала',
                    article: item.article || 'N/A',
                    title: item.title,
                    description: item.description || '',
                    price: String(item.price),
                    sort: item.sort || 0,
                    quantity: item.quantity,
                    height: item.height || 0,
                    width: item.width || 0,
                    depth: item.depth || 0,
                    parts: item.parts || [],
                }))
            };

            try {
                // 2. Отправляем запрос
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + auth.token,
                    },
                    body: JSON.stringify(payload)
                });
                // 3. Обрабатываем ответ
                if (!response.ok) {
                    // Если сервер вернул ошибку, создаем объект ошибки
                    const errorData = await response.json();
                    return {success: false, error: errorData};
                    // throw new Error(errorData.detail || `Ошибка сервера: ${response.status}`);
                }
                const responseData = await response.json();
                // 4. В случае успеха очищаем корзину
                this.clearOrder();
                // Возвращаем успешный результат
                return {success: true, data: responseData};
            } catch (error) {
                console.error('Ошибка при отправке заказа:', error);
                // Возвращаем ошибку, чтобы компонент мог ее обработать
                return {success: false, error: error.message};
            }
        }
    },

    getters: {
        itemCount: (state) => state.furniture_items.length,
        totalItemsCount: (state) =>
                state.furniture_items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: (state) =>
                state.furniture_items.reduce(
                        (total, item) => total + (item.price || 0) * item.quantity,
                        0
                ),
        getItemByID: (state) => (itemId) => {
            return state.furniture_items.find((item) => item.id === itemId) || null;
        },
    },
});

export default useOrderStore;

