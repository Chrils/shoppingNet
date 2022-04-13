<template>
  <!-- 容器区域 -->
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="logo" src="@/assets/img/logo.png" alt="logo">
        <span>购物网后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧菜单区域 -->
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <!-- 折叠展开按钮 -->
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu :default-active="activePath" class="el-menu-vertical-demo" unique-opened :collapse="isCollapsed" router
                 :collapse-transition = "false" background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :index="item.url" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.children" :index="subItem.url" :key="subItem.id" @click="saveNavState(subItem.url)">
              <i :class="subItem.icon"></i>
              <span>{{ subItem.name }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 内容区域 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: "Home",
  created() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem('activePath');
  },
  methods:{
    // 用户注销
    logout(){
      window.sessionStorage.removeItem('token');
      this.$router.push('/login');
    },
    // 获取菜单列表
    async getMenuList(){
      const {data:res} = await this.$http.get('/admin/base/menus')
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.menuList = res.data.menus.menuItems
    },
    // 切换折叠
    toggleCollapse(){
      this.isCollapsed = !this.isCollapsed
    },
    // 保存当前菜单状态
    saveNavState(url){
      sessionStorage.setItem('navState', url)
      this.activePath = url
    }

  },
  data() {
    return {
      menuList: [],
      isCollapsed: false,
      activePath: ''
    };
  },
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    > img{
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    > span{
      font-size: 20px;
    }
  }
}

.toggle-btn{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}

</style>