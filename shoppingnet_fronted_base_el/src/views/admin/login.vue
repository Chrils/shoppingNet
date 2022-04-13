<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/img/header_m.png" alt="header" >
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="LoginFormRef" :model="LoginForm" :rules="LoginFormRules" label-width="0px" class="login_form">
		  <!-- 用户名 -->
		  <el-form-item prop="username">
			<el-input prefix-icon="el-icon-user-solid" v-model="LoginForm.username"></el-input>
		  </el-form-item>
		  <!-- 密码 -->
		  <el-form-item prop="password">
			<el-input prefix-icon="el-icon-lock" v-model="LoginForm.password" type="password"></el-input>
		  </el-form-item>
		  <!-- 按钮区域 -->
		  <el-form-item class="btns">
			<el-button type="primary" @click="login">登录</el-button>
			<el-button type="info" @click="resetLoginForm">重置</el-button>
		  </el-form-item>
	  </el-form>
    </div>
  </div>
</template>

<script>
  export default{
	  data(){
		  return {
			  // 表单数据绑定对象
			  LoginForm:{
				  username:'',
				  password:''
			  },
			  // 表单验证规则对象
        LoginFormRules:{
          //验证用户名是否合法
          username:[
            {required:true,message:'用户名不能为空',trigger:'blur'},
            {min:3,max:10,message:'用户名长度为3-10位',trigger:'blur'}
          ],
          //验证密码是否合法
          password:[
            {required:true,message:'密码不能为空',trigger:'blur'},
            {min:5,max:10,message:'密码长度为5-10位',trigger:'blur'}
          ]
        }
		  }
	  },
    methods:{
      // 重置表单
      resetLoginForm(){
        this.$refs.LoginFormRef.resetFields();
      },
      //表单预验证
      login(){
        //打印原型中的$http属性
        console.log();
        //async修饰的函数，可以异步执行
        this.$refs.LoginFormRef.validate(async valid =>{
          //valid表示验证是否通过
          if(!valid){return;}
          //验证通过，发送登录请求
          //await用于等待异步操作完成，必须使用async声明
          const {data : res} = await this.$http.post('/client/user/login',this.LoginForm)
          console.log(res)
          if (res.meta.status === "OK"){
            //保存token到sessionStorage
            sessionStorage.setItem('token',res.data.token);
            this.$message.success(res.meta.msg);
            await this.$router.push('/home');
          }else{
            this.$message.error(res.meta.msg);
          }

          // if (res.meta.status !== 200) {
          //   return console.log("登录失败");
          // }
          // console.log("登录成功");
        });
      }
    }

  }
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;

    .login_box {
      width: 450px;
      height: 300px;
      background-color: #FFFFFF;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

    .avatar_box {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        border: 1px solid #eee;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .btns {
      display: flex;
      justify-content: flex-end;
    }
</style>
