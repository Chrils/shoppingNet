<template>
<div>
  <!-- 面包屑导航 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/welcome">首页</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 卡片视图 -->
  <el-card>
    <!-- 添加角色按钮区域 -->
    <el-row>
      <el-col>
        <el-button type="primary" icon="el-icon-plus" @click="addRole">新增角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="roles"
      border
      style="width: 100%">
      <el-table-column
      type="expand">
        <template v-slot="scope">
          <!-- 渲染一级权限 -->
          <el-row :class="['bdbottom','vcenter',index1===0?'bdtop':'']" v-for="(item1,index1) in scope.row.rightTreeList" :key="item1.rightId">
            <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row,item1.rightId)">{{item1.rightName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <!-- 渲染二级权限 -->
              <el-row v-for="(item2,index2) in item1.children" :key="item2.rightId" :class="['vcenter',index2===0?'':'bdtop']">
                <el-col :span="6" >
                  <el-tag type="success" closable @close="removeRightById(scope.row,item2.rightId)">{{item2.rightName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag v-for="(item3,index3) in item2.children"
                          :key="item3.rightId"
                          :class="[index3===0?'':'bdtop']"
                          closable
                          type="warning"
                          @close="removeRightById(scope.row,item3.rightId)">
                    {{item3.rightName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述">
      </el-table-column>
      <el-table-column
        label="操作">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" @click="editRole(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteRole(scope.$index, scope.row)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="small" @click="assignRole(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 分配权限对话框 -->
  <el-dialog
    title="分配权限"
    :visible.sync="assignRoleDialogVisible">
      <el-tree
        ref="tree"
        :data="rightTree"
        :props="defaultProps"
        :default-checked-keys="rightIds"
        node-key="rightId"
        show-checkbox
        default-expand-all>
      </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="assignRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="assignRoleConfirm">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 添加角色对话框 -->
  <el-dialog
    title="添加角色"
    :visible.sync="addRoleDialogVisible">
    <el-form :model="addRoleForm" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="addRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="addRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 编辑角色对话框 -->
  <el-dialog
    title="编辑角色"
    :visible.sync="editRoleDialogVisible">
    <el-form :model="editRoleForm" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="editRoleForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="editRoleForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editRoleDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "roles",
  data(){
    return{
      roles: [],
      //添加角色表单
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      //编辑角色表单
      editRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      rightIds: [],
      assignRoleDialogVisible: false,
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      rightTree: [],
      roleId: 0,
      defaultProps: {
        children: 'children',
        label: 'rightName',
        value: 'rightId'
      }
    }
  },
  methods:{
    //添加角色
    addRole(){
      this.addRoleDialogVisible = true;
    },
    editRole(index, row){
      this.editRoleForm.roleId = row.roleId;
      this.editRoleForm.roleName = row.roleName;
      this.editRoleForm.roleDesc = row.roleDesc;
      this.editRoleDialogVisible = true;
    },
    async deleteRole(index, row){
      const will = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(will !== 'confirm') return;
      const {data:res} = await this.$http.delete(`/admin/role/roles/${row.roleId}`);
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.$message.success('删除成功');
      await this.getRoles();
    },
    //删除角色下的权限
    async removeRightById(role, rightId){
      const will = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (will==="confirm") {
        const {data:res} = await this.$http.delete(`/admin/role/roles/${role.roleId}/rights/${rightId}`)
        if (res.meta.status === "OK") {
          this.$message.success('删除成功')
          role.rightTreeList = res.data.list.rightTreeList
        }else{
          this.$message.error('删除失败')
        }
      }else{
        this.$message.info('已取消删除')
      }
    },
    //获取角色列表
    async getRoles(){
      const {data:res} = await this.$http.get('/admin/role/roles')
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.roles = res.data.list
    },
    //打开分配权限对话框并请求数据
    assignRole(role){
      // const {data:res} = this.$http.get(`/admin/role/roles`);
      // if (res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.roleId = role.roleId
      this.rightTree = this.roles[0].rightTreeList
      this.rightIds = []
      this.addRightIds(role.rightTreeList)
      /**
       * 响应式设置默认选中的权限
       * 由于当前this不能访问到$refs.tree，getCheckedKeys()，所以需要使用this.$nextTick(callback)
       */
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.rightIds)
      })
      this.assignRoleDialogVisible = true
    },
    //更改分配权限
    // handleCheckChange(data, checked, indeterminate){
    //   console.log(data, checked, indeterminate)
    // },
    //通过递归形式将角色下的所有三级权限添加到默认选择的权限数组rightIds中
    addRightIds(rightTree){
      if (rightTree.length === 0) return
      rightTree.forEach(item => {
        if (item.children.length === 0) {
          this.rightIds.push(item.rightId)
        }else{
          this.addRightIds(item.children)
        }
      })
    },
    //确认分配权限
    async assignRoleConfirm(){
      /**
       * 获取选中及半选中的权限保存到新数组中
       * ...是es6的扩展运算符，将数组展开转为参数
       * TODO 当未选择任何权限时，会报错，需要修改
       * @type {*[]}
       */
      const checkedKeys = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ]
      if (checkedKeys.length === 0) return this.$message.warning('请保留至少一项权限')
      console.log( checkedKeys.join(','))
      const {data:res} = await this.$http.post(`/admin/role/roles/${this.roleId}/rights/${checkedKeys.join(',')}`)
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.$message.success('分配权限成功')
      await this.getRoles()
      this.assignRoleDialogVisible = false
    },
    async addRoleConfirm(){
      this.addRoleDialogVisible = false
      const {data:res} = await this.$http.post('/admin/role/roles', this.addRoleForm)
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.$message.success('添加角色成功')
      await this.getRoles()
    },
    async editRoleConfirm(){
      this.editRoleDialogVisible = false
      const {data:res} = await this.$http.put(`/admin/role/roles`, this.editRoleForm)
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg)
      this.$message.success('修改角色成功')
      await this.getRoles()
    },
  },
  async created(){
    await this.getRoles()
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eeeeee;
}
.bdbottom{
  border-bottom: 1px solid #eeeeee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>