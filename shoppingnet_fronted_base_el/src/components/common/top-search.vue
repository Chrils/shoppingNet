<template>
  <!-- 搜索框及logo区域 -->
  <div class="header-logo">
    <img src="@/assets/img/fronted_logo.png" width="100" height="150" alt="logo" />
    <!-- 级联选择框渲染 -->
    <el-cascader
        v-model="selectedKeys"
        :options="cateList"
        :props="cascaderProps"
        @change="handleCascaderChange"
        placeholder="请选择分类">
    </el-cascader>
    <el-input
        class="ipt-search"
        v-model="search"
        placeholder="请输入商品名称"
        clearable
        @keyup.enter="searchGoods"
        @clear="searchGoods"
        style="width: 400px;"
    >
      <el-button type="danger" slot="append" icon="el-icon-search" @click="searchGoods" plain></el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  name: "top-search",
  data(){
    return{
      search: "",
      cateList: [], // 商品分类列表
      cascaderProps: {
        value: "cateId", //当前节点值
        label: "cateName", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
      },
      selectedKeys: [], // 级联选择框选中的值
    }
  },
  methods:{
    searchGoods() {
      // 搜索商品
      this.$router.push({
        path: "/mall/search",
        query: {
          keyword: this.search
        }
      });
    },
    handleCascaderChange(){
      this.searchGoods();
    },
    // 获取商品分类列表
    async getCateList(){
      const {data:res} = await this.$http.get("/admin/goods/cate",{ params: {maxLevel: 1}})
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.cateList = res.data.list;
    },
  },
  created(){
    this.getCateList();
  },
}
</script>

<style scoped>

</style>