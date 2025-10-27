<template>
    <div style="position: relative" :key="$route.path">
        <header ref="nav_scroll" class="w-100">
            <NavigationComponent/>
        </header>
        <router-view style="z-index: 1;" v-slot="{ Component, route }">
            <transition :name="$route.meta.transition || 'fade'" duration="300">
                <component :is="Component"/>
            </transition>
        </router-view>
        <button id="UpBtn"
                :class="{ 'scroll_to_bottom': !up_button_flag && !scroll_top_hide, 'visible': !scroll_top_hide }"
                @click="scroll_to_target"
        >
            &uarr;
        </button>
    </div>
</template>

<script>
import NavigationComponent from '@/components/NavigationComponent.vue'
import {useScreenStore} from '@/stores/screenStore'

// dev brunch
export default {
    metaInfo: {
        meta: [
            {name: 'theme-color', content: '#161616'},
            {name: 'apple-mobile-web-app-capable', content: 'yes'},
            {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
        ],
    },
    components: {
        NavigationComponent,
    },

    created() {

    },
    mounted() {
        // yandex

    },
    data() {
        return {
            screen: useScreenStore(),
            scroll_top_hide: true,
            up_button_flag: false,
        }
    },
    methods: {
        handleScroll() {
            this.screen.scroll = parseInt(window.scrollY)
        },
        handleResize() {
            this.screen.width = parseInt(window.innerWidth)
            this.screen.height = parseInt(window.innerHeight)
        },
        scroll_to_target() {
            if (this.$refs.nav_scroll) {
                this.$refs.nav_scroll.scrollIntoView({behavior: 'smooth'})
            }
        },
    },
    watch: {
        'screen.scroll': function (nv, ov) {
            if (nv > ov) {
                this.screen.scroll_direction = 'down'
            } else {
                this.screen.scroll_direction = 'up'
            }
            if (this.screen.scroll > 500) {
                this.up_button_flag = false
                this.scroll_top_hide = false
            } else {
                this.up_button_flag = true
                this.scroll_top_hide = true
            }
        },
    },
}
</script>

<style>
button#UpBtn, button#UpBtnDuble {
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: transparent;
}

button#UpBtn:active, button#UpBtnDuble {
    background-color: #d3d3d3;
}


#UpBtn {
    transition: all .3s ease-in-out;
    -webkit-transition: all .3s ease-in-out;
    font-size: 1.5em;
    line-height: 1.6em;
    font-weight: bold;
    right: -100px;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    border: none;
    color: #b9b9b9;
    padding: 0;
    bottom: 10px;
    position: fixed;
    opacity: 0;
    z-index: 10000;
}

.visible {
    transition: opacity .5s ease-in-out;
    -webkit-transition: opacity .5s ease-in-out;
    opacity: 0.7 !important;
    bottom: 10px;
    right: 10px !important;
}

.scroll_to_bottom {
    transition: bottom .5s ease-in-out;
    -webkit-transition: bottom .5s ease-in-out;
    bottom: 15px !important;
}
</style>
