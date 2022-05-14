import Vue from 'vue'
import Vuex from 'vuex'
//1.安装插件
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
      currentUserType: null,
      // 存储用户信息
      userInfo: null,
      // 购物车信息
      cartInfo: null,
      // 图片访问前缀
      urlPrefix: ''
  },
  mutations: {
      // 设置用户信息
      setUserInfo(state, userInfo) {
          state.userInfo = userInfo || {};
      },
      // 设置用户类型
      setUserType(state, userType) {
          state.currentUserType = userType;
      },
      // 设置图片访问前缀
      setUrlPrefix(state, urlPrefix) {
          state.urlPrefix = urlPrefix;
      },
      // 设置购物车信息
      setCartInfo(state, cartInfo) {
          state.cartInfo = cartInfo;
      }
  },
  actions: {
      // 设置用户信息
      setUserInfo({ commit }, userInfo) {
          commit('setUserInfo', userInfo);
      },
      // 设置用户类型
      setUserType({ commit }, userType) {
          commit('setUserType', userType);
      },
      // 设置图片访问前缀
      setUrlPrefix({ commit }, urlPrefix) {
          commit('setUrlPrefix', urlPrefix);
      },
      // 设置购物车信息
      setCartInfo({ commit }, cartInfo) {
          commit('setCartInfo', cartInfo);
      }
  },
  getters: {
      // 获取用户信息
      getUserInfo(state) {
          return state.userInfo;
      },
      // 获取用户类型
      getUserType(state) {
          return state.currentUserType;
      },
      // 获取图片访问前缀
      getUrlPrefix(state) {
          return state.urlPrefix;
      },
      // 获取购物车信息
      getCartInfo(state) {
          return state.cartInfo;
      }
  }
})

export default store
