<template>
    <div class="rights-list-container">
      <!-- 面包屑导航区域 -->
      <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <router-link to="/welcome">首页</router-link>
          </el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 权限列表 -->
      <el-card>
        <el-table
          :data="rightsList"
          border
          stripe
          style="width: 100%">
          <el-table-column
            prop="rightId"
            label="ID">
          </el-table-column>
          <el-table-column
            prop="rightName"
            label="权限名称">
          </el-table-column>
          <el-table-column
            prop="rightUrl"
            label="权限URL">
          </el-table-column>
          <el-table-column
            prop="rightPid"
            label="父级ID">
          </el-table-column>
          <el-table-column
          prop="rightLevel"
          label="级别">
            <template v-slot="scope">
              <el-tag type="success" v-if="scope.row.rightLevel === 1">一级</el-tag>
              <el-tag type="info" v-else-if="scope.row.rightLevel === 2">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: "rights",
  data(){
    return{
      // 权限列表
      rightsList: [],
    }
  },
  methods: {
    // 获取权限列表
    async getRightsList(){
      const {data:res} = await this.$http.get("admin/base/rights");
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.rightsList = res.data.rights;
    },
    // 添加权限
    addRights(){
      this.$router.push("/admin/rights/create");
    },
  },
  created() {
    this.getRightsList();
  }
}
</script>

<style lang="less" scoped>
  .rights-list-container{
    > el-table{
      height: 100%;
    }
  }
</style>