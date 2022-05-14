<template>
<div class="mall-root">
  <el-container class="mall-container">
    <!-- 商城顶部区域 -->
    <el-header>
      <!-- 商城顶部菜单 -->
      <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router>
        <el-menu-item index="/mall/index">首页</el-menu-item>
        <el-menu-item :disabled="!isLogin" index="/mall/order">订单</el-menu-item>
        <el-menu-item :disabled="!isLogin" index="/mall/cart">购物车</el-menu-item>
        <template v-if="isLogin">
          <el-menu-item index="/mall/profile">我的</el-menu-item>
        </template>
        <template v-else>
          <el-menu-item index="/login">
            <i class="el-icon-user"></i>
            登录
          </el-menu-item>
        </template>
      </el-menu>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</div>
</template>

<script>
export default {
  name: "Mall",
  data() {
    return {
      activeIndex: "/mall/index",
    };
  },
  methods: {
    handleSelect(index) {
      this.activeIndex = index;
    },
  },
  computed:{
    isLogin(){
      return this.$store.state.currentUserType !== null
    }
  }
}
</script>

<style scoped>
.el-header{
  padding: 0;
}
.mall-root{
  height: 100%;
}
.mall-container{
  height: 100%;
}
</style>