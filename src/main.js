import Vue from 'vue'
import Checklist from './Checklist.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  components: { Checklist }
})
