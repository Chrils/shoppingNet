<template>
<div>
  <!-- 面包屑导航区域 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/welcome">首页</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 卡片视图 -->
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 新闻分类列表区域 -->
    <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
                show-index index-text="#" border class="tree-table">
      <!-- 是否有效 -->
      <template slot="isValid" slot-scope="scope">
        <i class="el-icon-success" style="color: lightgreen;" v-if="scope.row.cateDeleted===0"></i>
        <i class="el-icon-error" style="color: red;" v-else></i>
      </template>
      <!-- 排序 -->
      <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.cateLevel===1">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.cateLevel===2">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="operation" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </tree-table>

    <!-- 分页条区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNo"
      :page-sizes="[3,5,10,15]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  <!-- 添加分类对话框 -->
  <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="50%" @close="cascaderClose">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="分类名称" prop="cateName">
        <el-input v-model="form.cateName" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="父级分类" prop="catePid">
        <!-- 使用级联选择器进行分类展示 -->
        <el-cascader v-model="selectedKeys" :options="cascaderMenus"
                     clearable placeholder="请选择父级分类"
                     :props="cascaderProps"
                     @change="parentMenuChange"
                     :disabled="!isAdding"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      cateList: [],
      queryInfo: {
        pageNo: 1,
        pageSize: 5,
        maxLevel: 1
      },
      //总数据条数
      total: 0,
      //表格列配置
      columns: [
        {
          label: "分类名称",
          prop: "cateName",
          width: "200"
        },
        {
          label: "分类级别",
          prop: "cateLevel",
        },
        {
          label: "是否有效",
          prop: "cateDeleted",
          type: "template",
          template: "isValid"
        },
        {
          label: "排序",
          prop: "cateLevel",
          type: "template",
          template: "order"
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
          minWidth: 185
        }
      ],
      //表单数据
      form: {
        cateName: "",
        catePid: 1,
        cateLevel: 1,
        cateDeleted: 0
      },
      //表单验证规则
      rules: {
        cateName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        parentId: [
          { required: true, message: "请选择父级分类", trigger: "blur" }
        ]
      },
      //对话框是否显示
      dialogFormVisible: false,
      //当前是否处于添加状态
      isAdding: false,
      //级联选择器选中的父子节点
      selectedKeys: [],
      //级联选择器列表数据
      cascaderMenus: [],
      //级联选择器配置
      cascaderProps: {
        value: "cateId", //当前节点值
        label: "cateName", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
        checkStrictly: true  // 是否严格检查父子关系,即父菜单是否可以被选中
      }
    };
  },
  methods:{
    // 获取分类列表
    async getCateList() {
      const {data:res} = await this.$http.get("/admin/goods/cate",{ params: this.queryInfo})
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.total = res.data.page.total;
      this.cateList = res.data.page.records;
    },
    // 添加分类
    async handleAdd() {
      this.isAdding = true;
      this.dialogFormVisible = true;
      //获取分类一二级列表
      const {data:res} = await this.$http.get("/admin/goods/cate/list")
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.cascaderMenus = res.data.list;
    },
    // 编辑分类
    handleEdit(row) {
      this.isAdding = false;
      this.dialogFormVisible = true;
      this.form = row;
      this.selectedKeys = [row.catePid];
    },
    // 删除分类
    handleDelete(row) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const {data:res} = await this.$http.delete(`/admin/goods/cate/${row.cateId}`)
          if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
          this.$message.success("删除成功!");
          await this.getCateList();
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 级联选择器选择事件
    parentMenuChange() {
      if (this.selectedKeys.length === 0) {
        this.form.catePid = 1;
        this.form.cateLevel = 1;
      } else {
        this.form.catePid = this.selectedKeys[this.selectedKeys.length - 1];
        this.form.cateLevel = this.selectedKeys.length + 1;
      }
    },
    // 提交表单
    async handleSubmit() {
      await this.$refs.form.validate(async valid => {
        if (!valid) return;
        if (this.isAdding){
          // 添加分类
          const {data:res} = await this.$http.post("/admin/goods/cate",this.form);
          if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
          this.$message.success("添加成功");
          this.dialogFormVisible = false;
          await this.getCateList();
        }else{
          //更新 TODO 返回当前一级菜单下的所有数据，避免页面出现刷新
          const {data:res} = await this.$http.put(`/admin/goods/cate`,this.form);
          if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
          this.$message.success("修改成功");
          this.dialogFormVisible = false;
          await this.getCateList();
        }
      });
    },
    // 分页改变
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val;
      this.getCateList();
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.getCateList();
    },
    cascaderClose() {
      this.selectedKeys = [];
      //移除form中的cateId，避免作为添加分类表单提交时出现错误
      delete this.form.cateId;
      this.form.cateName = "";
      this.form.catePid = 1;
      this.form.cateLevel = 1;
      this.form.cateDeleted = 0;
      //清空验证信息
      this.$refs.form.clearValidate();

    },
  },
  created() {
    this.getCateList();
  }
}
</script>

<style scoped>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>