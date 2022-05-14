<template>
    <div class="profile">
      <el-descriptions :columns="2" :data="user" :span="24">
        <el-descriptions-item label="用户名">{{user.username}}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{user.email}}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{user.phone}}</el-descriptions-item>
        <el-descriptions-item label="暂存地址">{{user.address}}</el-descriptions-item>
      </el-descriptions>
    </div>
</template>

<script>
export default {
  name: "profile",
  data() {
    return {
      user: this.$store.state.userInfo
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {

    }
  }
}
</script>

<style scoped>

</style>