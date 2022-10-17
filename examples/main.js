import Vue from 'vue'
import App from './App'
import SuperFlow from '../packages/index'
import ElementUI from 'element-gui';
import 'element-gui/lib/theme-chalk/index.css';

Vue.use(SuperFlow);
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
