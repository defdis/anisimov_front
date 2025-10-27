<template>
    <div ref="nav" class="navigation_box"
         :style="{height: (!screen.menu_show) ? '0px' : '', padding: (!screen.menu_show) ? '0px' : ''}">
        <div class="navigation_menu">
            <div v-if="!is_mobile" class="navigation_menu_logo">
                <!--				<img class="logo" @click="$router.push('/')" src="@/assets/img/svg/delfin_logo.svg"/>-->
            </div>
            <div v-else class="navigation_menu_mobile_nav">
                <img class="navigation_menu_mobile_icon"
                     :class="{show: !mobile_menu_is_shown}"
                     src="../assets/img/svg/nav.svg"
                     alt="" @click="mobile_menu_is_shown = true"
                >
                <img class="navigation_menu_mobile_icon"
                     :class="{show: mobile_menu_is_shown}"
                     src="../assets/img/svg/nav_close.svg" alt=""
                     @click="mobile_menu_is_shown = false"
                >
            </div>
            <nav class="navigation" :class="{show: mobile_menu_is_shown}">
                <RouterLink @click="mobile_menu_is_shown = false" to="/">главная</RouterLink>
                <RouterLink @click="mobile_menu_is_shown = false" to="/furniture">мебель</RouterLink>
                <RouterLink @click="mobile_menu_is_shown = false" to="/order">корзина</RouterLink>
                <RouterLink @click="mobile_menu_is_shown = false" to="/orders">заказы</RouterLink>
            </nav>

            <div v-if="!is_mobile" class="nav_buttons_box">
            </div>
            <div v-else class="navigation_menu_mobile_cart_box">
            </div>
        </div>
    </div>
</template>

<script>
import {useScreenStore} from '@/stores/screenStore'
import { useAuthStore } from "@/stores/userStore"
import {defineComponent} from "vue";

export default defineComponent({
    name: "NavigationComponent",
    created() {
        if (!this.auth.isAuthenticated) {
            this.$router.push({name: 'auth'})
        }
    },
    computed: {
        is_mobile() {
            return this.screen.width <= 768
        },
    },
    data() {
        return {
            mobile_menu_is_shown: false,
            screen: useScreenStore(),
            auth: useAuthStore(),
        }
    },
    methods: {},

})
</script>

<style>

.router-link-active.router-link-exact-active:has(.shares) {
    text-decoration-color: #F64655;
}

.router-link-active.router-link-exact-active {
    font-weight: bold;
    text-decoration: underline;
}

.navigation_menu {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    background-color: white;
    overflow: hidden;
    transition: height 0.3s ease-in-out;
    z-index: 1000;
}

.navigation {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
    justify-content: flex-start;
    font-size: 1em;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;
    scrollbar-color: transparent transparent;
    transition: opacity 0.5s ease-in-out, height 0.3s ease-in-out;
}

.navigation_box a {
    font-size: 0.9em;
    padding: 1rem;
    text-transform: uppercase;
    text-decoration: none;
    color: black;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
}

.logo {
    cursor: pointer;
}

.shares {
    position: relative;
    color: #F64655;
}

.shares_badge {
    position: relative;
    top: -1px;
    background-color: #F64655;
    color: white;
    font-size: 0.6em;
    font-weight: bold;
    border-radius: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    text-decoration: none;
    margin-left: 0.5em;

}

.nav_buttons_box {
    font-size: 0.8em;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    padding: 0.5em;
}

.nav_buttons_box button {
    white-space: nowrap;
    border: 1px solid black;
    text-transform: uppercase;
    display: flex;
    flex-flow: row nowrap;
    justify-content: baseline;
    align-items: center;
}

.nav_buttons_box button span {
    margin-left: 0.5rem;
    font-size: 0.7em;
}

.navigation_menu_mobile_nav {
    position: relative;
    background-color: red;
    height: 100%;
}

.navigation_menu_mobile_icon {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.5s ease-in-out;
    opacity: 0;

}

.navigation_menu_mobile_icon.show {
    opacity: 1;
    z-index: 1001;
}


.navigation_menu_mobile_cart_box {
    display: flex;
    align-items: flex-end;
    z-index: 1001;
}

.navigation_menu_mobile_cart_box .badge {
    background-color: #1f1f1f;
    border-radius: 1000px;
}

.shares_badge_ny {
    color: transparent !important;
    width: 20px;
    height: 20px;
    background-color: transparent !important;
    background-image: url('../assets/img/svg/ny.svg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
}

@media screen and (max-width: 768px) {
    .navigation_menu {
        position: fixed;
        height: 9%;
        top: 0;
        padding: 0.7em;
    }

    .navigation {
        font-size: 1.5em;
        background-color: #fff;
        position: fixed;
        width: 100%;
        top: 9%;
        left: 0;
        right: 0;
        bottom: 0;
        height: 0;
        opacity: 0;
        z-index: 9999;

        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
    }

    .navigation.show {
        height: calc(100% - 9%);
        opacity: 1;
    }
}
</style>