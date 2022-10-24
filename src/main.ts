import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { ComponentCustomProperties } from "vue";
import { Store } from "vuex";
import "./assets/icons/index";
import "./assets/css/index.scss";
import * as ElIconModules from '@element-plus/icons-vue'
declare  module "@vue/runtime-core" {
    interface State {
        count: number;
    }

    interface  ComponentCustomProperties {
        $store: Store<State>;
    }
}
const app=createApp(App)
// 统一注册el-icon图标
for(let iconName in ElIconModules){
    // @ts-ignore
    app.component(iconName,ElIconModules[iconName])
}
app.use(store).use(router).use(ElementPlus).mount('#app')
