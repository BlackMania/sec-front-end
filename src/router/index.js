import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import FacialRecognitionLogin from '../views/FacialRecognitionLogin.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: "Login",
    component: Login
  },
  {
    path: "/faciallogin",
    name: "FacialLogin",
    component: FacialRecognitionLogin
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
