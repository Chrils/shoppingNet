<template>
    <div class="userList">
      <!-- 面包屑导航区域 -->
      <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
              <router-link to="/welcome">首页</router-link>
            </el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <!-- 卡片视图区域 -->
      <el-card>
        <!-- 使用栅格系统布局 -->
        <el-row :gutter="20"
        >
          <el-col :span="4">
            <el-select v-model="queryParam.userType" placeholder="请选择" class="el-select-addUser" v-slot="prepend" @change="handleTypeChange">
              <el-option label="全部" value="-1"></el-option>
              <el-option v-for="item in roleList" :label="item.roleName" :key="item.roleName" :value="item.roleId"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <!-- 搜索与添加区域 -->
            <el-input aria-placeholder="请输入内容" v-model="queryParam.username" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="toAddUser">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表区域 -->
        <el-table
          :data="userList"
          border stripe
          style="width: 100%">
          <!-- 添加索引列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column
            prop="username"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
              label="权限">
            <template v-slot="scope">
              <span v-text="getRoleNameByRoleId(scope.row.userType)"></span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template v-slot="scope">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEditUser(scope.row.id)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              <!-- 分配角色按钮 -->
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryParam.pageNo"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-count="pageCount">
        </el-pagination>
      </el-card>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="userType">
            <el-radio-group v-model="userForm.userType">
              <!-- 遍历roleList -->
              <el-radio v-for="item in roleList" :key="item.roleName" :label="item.roleId">{{item.roleName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改用户的对话框 -->
      <el-dialog title="修改用户" :visible.sync="dialogFormEditVisible">
        <el-form :model="userFormEdit" :rules="rules" ref="userFormEdit" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userFormEdit.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userFormEdit.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userFormEdit.email"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="userType">
            <el-radio-group v-model="userFormEdit.userType">
              <!-- 遍历roleList -->
              <el-radio v-for="item in roleList" :key="item.roleName" :label="item.roleId">{{item.roleName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
  name: "userList",
  data() {
    return {
      userList: [],
      roleList: [],
      queryParam:{
        pageNo:1,
        pageSize:4,
        username:'',
        userType:''
      },
      currentPage:1,
      pageSizes:[4,8,12,16,20],
      total:0,
      pageSize: 4,
      dialogFormVisible: false,
      dialogFormEditVisible: false,
      userForm: {
        username: '',
        password: '',
        email: '',
        userType: '',
      },
      userFormEdit: {
        id: '',
        username: '',
        password: '',
        email: '',
        userType: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
    };
  },
  methods: {
    search() {
      this.queryParam.pageNo = 1;
      this.getUserList();
    },
    async getUserList(){
      const {data:res} = await this.$http.get("/admin/user/list",{params:this.queryParam});
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.userList = res.data.page.records
      console.log(this.userList)
      this.total = res.data.page.total
    },
    handleSizeChange(val) {
      this.queryParam.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.queryParam.pageNo = val;
      this.getUserList();
    },
    handleTypeChange(val) {
      this.queryParam.userType = val;
      //切换当前页数为1
      this.queryParam.pageNo = 1;
      this.getUserList();
    },
    /**
     * 添加用户
     */
    toAddUser() {
      this.dialogFormVisible = true;
      this.userForm = {
        username: '',
        password: '',
        email: '',
        userType: '',
      };
    },
    /**
     * 提交添加用户
     */
    submitAdd(){
      this.$refs.userForm.validate(async valid => {
        if (!valid) return;
        const {data:res} = await this.$http.put("/admin/user/add",this.userForm);
        if(res.meta.status !== "OK") return this.$message.error(res.meta.msg)
        this.$message.success("添加成功");
        this.dialogFormVisible = false;
        await this.getUserList();
      });
    },
    /**
     * 编辑用户
     */
    async toEditUser(id) {
      this.dialogFormEditVisible = true;
      const {data:res} = await this.$http.get("/admin/user/users/"+id);
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.userFormEdit = res.data.user;
    },
    /**
     * 提交编辑用户
     */
    submitEdit(){
      this.$refs.userFormEdit.validate(async valid => {
        if (!valid) return;
        const {data:res} = await this.$http.put("/admin/user/update",this.userFormEdit);
        if(res.meta.status !== "OK") return this.$message.error(res.meta.msg)
        this.$message.success("修改成功");
        this.dialogFormEditVisible = false;
        await this.getUserList();
      });
    },
    /**
     * 删除用户
     */
    async removeUserById(id) {

      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data:res} = await this.$http.delete("/admin/user/users/"+id);
        if(res.meta.status !== "OK") return this.$message.error(res.meta.msg)
        this.$message.success("删除成功");
        await this.getUserList();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    /**
     * 获取角色列表
     */
    async getRoleList(){
      const {data:res} = await this.$http.get("/admin/base/roles");
      console.log(res);
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.roleList = res.data.roles
    },
    getRoleNameByRoleId(roleId){
      let roleName = ''
      this.roleList.forEach(item=>{
        if(item.roleId === roleId){
          roleName = item.roleName
        }
      })
      return roleName
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.total / this.pageSize);
    },

  },
  created() {
    this.getRoleList().then(()=>{
      this.getUserList();
    })
  }
}
</script>

<style lang="less" scoped>
.el-select-addUser{
  width: 100%;
}
</style>