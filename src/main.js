// npm i --save primevue pinia dayjs primeicons vue-cookies vue-html-to-paper vue-router @primevue/themes vue3-dayjs-plugin @vueuse/core
import {createPinia} from 'pinia'
// import { PiniaSharedState } from 'pinia-shared-state'
import {createApp} from 'vue'
import router from './router'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import PrimeVue from 'primevue/config'
import "primeflex/primeflex.css"
import 'primeicons/primeicons.css'

import Message from 'primevue/message';
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'
import Image from 'primevue/image'
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputNumber from 'primevue/inputnumber'
import Divider from 'primevue/divider'
import InputMask from 'primevue/inputmask'
import Select from 'primevue/select'
import TextArea from 'primevue/textarea'
import DatePicker from 'primevue/datepicker'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputGroup from 'primevue/inputgroup'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ToggleSwitch from 'primevue/toggleswitch'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import Tag from 'primevue/tag'
import Breadcrumb from 'primevue/breadcrumb'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Column from 'primevue/column'
import Tooltip from 'primevue/tooltip'
import ToggleButton from 'primevue/togglebutton'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

import Aura from '@primevue/themes/aura'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import VueDayjs from 'vue3-dayjs-plugin'
import './assets/css/main.css'
import VueHtmlToPaper from 'vue-html-to-paper'
import host from "../host.js";

dayjs.locale('ru')
dayjs.extend(isBetween)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
const app = createApp(App)


function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text

    // Сделать невидимым
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.opacity = '0'

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            document.body.removeChild(textArea)
            return {severity: 'success', summary: 'Текст скопирован!', detail: ''}
        } else {
            document.body.removeChild(textArea)
            return {severity: 'error', summary: 'Не удалось скопировать текст', detail: ''}
        }
    } catch (err) {
        console.error('Ошибка при fallback копировании: ', err)
        document.body.removeChild(textArea)
        return {severity: 'error', summary: 'Ошибка копирования', detail: ''}
    }

}

app.config.globalProperties.$getImageUrl = async function (imagePath) {
    if (imagePath.startsWith(host.protocol)) {
        return imagePath
    }
    return `${host}${imagePath}`
}
app.config.globalProperties.$copyToClipboard = async function (text) {
    try {
        // Современный способ
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return {severity: 'success', summary: 'Текст скопирован!', detail: ''}
        } else {
            // Старый способ для поддержки старых браузеров
            return fallbackCopyTextToClipboard(text)
        }

    } catch (err) {
        console.error('Ошибка копирования: ', err)
        return fallbackCopyTextToClipboard(text)
    }
}
app.config.globalProperties.$payment_statuses_list = [
    {value: 'created', title: 'Создано', color: '#ff9100'},
    {value: 'reception', title: 'Оплата на ресепшн', color: '#ff9100'},
    {value: 'canceled', title: 'Отменено', color: 'red'},
    {value: 'refund', title: 'Возврат', color: 'red'},
    {value: 'partial_refund', title: 'Частичный возврат', color: 'green'},
    {value: 'paid', title: 'Оплачено Юkassa', color: 'green'},
    {value: 'card', title: 'Оплачено картой', color: 'green'},
    {value: 'cash', title: 'Оплачено наличными', color: 'green'},
    {value: 'transfer', title: 'Перевод', color: 'green'},
    {value: 'non_cash', title: 'Оплачено безналично (р/с)', color: 'green'},
    {value: 'certificate', title: 'Сертификат', color: 'green'},
    {value: 'certificate_partner', title: 'Сертификат партнёра', color: 'green'},
    {value: 'barter', title: 'Бартер', color: 'green'},
    {value: 'invitation', title: 'Пригласительный', color: 'green'},
    {value: 'package', title: 'В составе пакета', color: 'green'},
]
app.config.globalProperties.$payment_status_options_choices = [
    {value: 'created', title: 'Создано', color: '#ff9100'},
    {value: 'reception', title: 'Оплата на ресепшн', color: '#ff9100'},
    {value: 'card', title: 'Оплачено картой', color: 'green'},
    {value: 'cash', title: 'Оплачено наличными', color: 'green'},
    {value: 'transfer', title: 'Перевод', color: 'green'},
    {value: 'non_cash', title: 'Оплачено безналично (р/с)', color: 'green'},
    {value: 'certificate', title: 'Сертификат', color: 'green'},
    {value: 'certificate_partner', title: 'Сертификат партнёра', color: 'green'},
    {value: 'barter', title: 'Бартер', color: 'green'},
    {value: 'invitation', title: 'Пригласительный', color: 'green'},
    {value: 'package', title: 'В составе пакета', color: 'green'},
]
app.config.globalProperties.$in_payment_status_debit_list = function (value) {
    return [
        'paid',
        'card',
        'transfer',
        'cash',
        'non_cash',
        'certificate',
        'invitation',
        'package',
        'partial_refund',
    ].includes(value)
}
app.config.globalProperties.$toMoneyString = function (value) {
    return parseInt(value).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    })
}
app.use(VueDayjs, {
    lang: 'ru', // Передача локали в плагин
})
app.use(VueHtmlToPaper)
app.use(PrimeVue, {
    locale: {
        firstDayOfWeek: 1,
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вос', 'Пон', 'Втор', 'Сред', 'Чет', 'Пят', 'Суб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    },
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false || 'none',
        },
    },
    // unstyled: true
})
app.use(ToastService)
app.use(createPinia())
app.use(VueCookies)
app.use(router)
app.component('Message', Message)
app.component('Toast', Toast)
app.component('ProgressSpinner', ProgressSpinner)
app.component('Card', Card)
app.component('Image', Image)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('TabPanels', TabPanels)
app.component('TabPanel', TabPanel)
app.component('Tabs', Tabs)
app.component('TabList', TabList)
app.component('Tab', Tab)
app.component('Column', Column)
app.component('InputNumber', InputNumber)
app.component('InputMask', InputMask)
app.component('TextArea', TextArea)
app.component('InputGroup', InputGroup)
app.component('InputGroupAddon', InputGroupAddon)
app.component('Dialog', Dialog)
app.component('Checkbox', Checkbox)
app.component('DataTable', DataTable)
app.component('FloatLabel', FloatLabel)
app.component('Select', Select)
app.component('IconField', IconField)
app.component('Breadcrumb', Breadcrumb)
app.component('InputIcon', InputIcon)
app.component('ToggleSwitch', ToggleSwitch)
app.component('DatePicker', DatePicker)
app.component('Tag', Tag)
app.component('Divider', Divider)
app.component('Accordion', Accordion)
app.component('AccordionTab', AccordionTab)
app.component('ToggleButton', ToggleButton)
app.directive('tooltip', Tooltip)
app.mount('#app')
