<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" >
      </div>
      <!-- 登录表单区域 -->
      <div>
        <el-input
            placeholder="请选择日期"
            suffix-icon="el-icon-date">
          </el-input>
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search">
          </el-input>
      </div>
    </div>
  </div>
</template>

<script>
  export default{

  }
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #FFFFFF;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      border: 1px solid #eee;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
</style>
