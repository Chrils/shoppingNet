<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="4">
          <!-- 级联选择框渲染 -->
          <el-cascader
              v-model="selectedKeys"
              :options="cateList"
              :props="cascaderProps"
              placeholder="请选择分类">
          </el-cascader>
        </el-col>
        <el-col :span="5">
          <div class="pickerContainer">
            <el-date-picker
                v-model="queryInfo.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择开始时间"
                :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="pickerContainer">
            <el-date-picker
                v-model="queryInfo.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择结束时间"
                :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.goodsName" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="handleAdd">添加商品</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" @click="handleMultiDelete">批量删除</el-button>
        </el-col>
      </el-row>

      <!-- 列表视图 -->
      <el-table
        :data="goodsList"
        border stripe ref="multipleTable">
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="商品名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
            label="商品分类">
          <template v-slot="scope">
            <span>{{getCateName(scope.row.goodsCate)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsPrice"
          label="商品价格">
        </el-table-column>
        <el-table-column
          prop="goodsStock"
          label="商品库存">
        </el-table-column>
        <el-table-column
          prop="goodsCreate"
          label="商品创建时间"
          :formatter="formatDate">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页视图 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.page"
        :page-sizes="pageSizes"
        :page-size="queryInfo.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加商品的对话框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="dialogFormVisible"
      width="60%" @close="dialogClosed">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="form.goodsName" placeholder="请输入商品名称" clearable @clear="handleInputClear"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goodsCate">
          <el-cascader
              v-model="form.goodsCate"
              :options="cateList"
              :props="cascaderProps"
              placeholder="请选择分类">
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品价格" prop="goodsPrice">
          <el-input-number v-model="form.goodsPrice" :min="0" :max="999999"></el-input-number>
        </el-form-item>
        <el-form-item label="商品库存" prop="goodsStock">
          <el-input-number v-model="form.goodsStock" :min="0" :max="999999"></el-input-number>
        </el-form-item>
        <el-form-item label="商品描述" prop="goodsDesc">
          <el-input type="textarea" v-model="form.goodsDesc" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="goodsImgs">
          <!-- 图片上传 -->
          <el-upload
            class="upload-demo"
            list-type="picture-card"
            action=""
            :headers="headers"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            :http-request="upload"
            :file-list="fileList">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 图片预览 -->
          <el-dialog
            title="预览" append-to-body
            :visible.sync="dialogImageVisible" width="30%">
            <img width="100%" :src="dialogImageUrl" alt=""
                 crossOrigin="use-credentials">
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      queryInfo: {
        goodsName: "",
        cateId: 1,
        cateLevel: 0,
        page: 1,
        size: 10,
        startTime: null,
        endTime: null
      },
      total: 0,
      goodsList: [],
      cateList: [], // 商品分类列表
      pageSizes: [5,8,10,12,15,20],
      cascaderProps: {
        value: "cateId", //当前节点值
        label: "cateName", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
      },
      selectedKeys: [], // 级联选择框选中的值
      dialogSelectedKeys: [], // 对话框选中的值
      // 日期选择器配置
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      dialogFormVisible: false,
      form: {
        goodsId: 0,
        goodsName: "",
        goodsCate: [],
        goodsPrice: 0,
        goodsStock: 0,
        goodsDesc: "",
        goodsImgs: "",
        goodsCreate: ""
      },
      dialogImageUrl: "",
      dialogImageVisible: false,
      fileList: [],
      rules: {
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goodsCate: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        goodsPrice: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goodsStock: [
          { required: true, message: "请输入商品库存", trigger: "blur" }
        ],
        goodsImgs: [
          { required: true, message: "请上传商品图片", trigger: "change" }
        ]
      },
      headers:{
        'Authorization': window.sessionStorage.getItem('token')
      }
    };
  },
  methods:{
    // 获取商品分类列表
    async getCateList(){
      const {data:res} = await this.$http.get("/admin/goods/cate",{ params: {maxLevel: 1}})
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.cateList = res.data.list;
    },
    // 获取商品列表
    async getGoodsList(){
      if (this.selectedKeys.length > 0) {
        this.queryInfo.cateId = this.selectedKeys[this.selectedKeys.length-1];
        this.queryInfo.cateLevel = this.selectedKeys.length;
      }else{
        this.queryInfo.cateId = 1;
        this.queryInfo.cateLevel = 0;
      }
      const {data:res} = await this.$http.get("/client/goods/list",{ params: this.queryInfo})
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.goodsList = res.data.page.records;
      this.total = res.data.page.total;
    },
    searchGoodsList(){
      this.queryInfo.page = 1;
      this.getGoodsList();
    },
    handleSizeChange(val) {
      this.queryInfo.page = 1;
      this.queryInfo.size = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.queryInfo.page = val;
      this.getGoodsList();
    },
    handleAdd(){

      //this.dialogFormVisible = true;
      this.$router.push("/goods/add");
    },
    handleDelete(row){
      this.$confirm("确定删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const {data:res} = await this.$http.delete(`/admin/goods/goods/${row.goodsId}`)
        if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
        this.$message.success("删除成功");
        await this.getGoodsList();
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    handleMultiDelete(){
      this.$confirm("确定删除选中的商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const selectedRows = this.$refs.multipleTable.selection;
        const {data:res} = await this.$http.delete("/admin/goods/goods",{ params: {
            ids: selectedRows.map(item => item.goodsId).join(",")
          }
        })
        if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
        this.$message.success("删除成功");
        await this.getGoodsList();
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    handleEdit(row){
      this.dialogFormVisible = true;
      this.form = row;
    },
    dialogClosed(){
      this.dialogFormVisible = false;
      this.$refs.form.resetFields();
      this.fileList = [];
    },
    handleInputClear(){
      this.getGoodsList();
    },
    formatDate(row, column, cellValue){
      return this.$moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    //根据cateId逐层查找cateName
    getCateName(cateId){
      let cateName = "";
      this.cateList.forEach(item=>{
        if(item.cateId === cateId){
          cateName = item.cateName;
        }
        if (item.children && item.children.length > 0) {
          item.children.forEach(cate=>{
            if(cate.cateId === cateId){
              cateName = cate.cateName;
            }
            if (cate.children && cate.children.length > 0) {
              cate.children.forEach(cate2=>{
                if(cate2.cateId === cateId){
                  cateName = cate2.cateName;
                }
              })
            }
          })
        }
      });
      //TODO 页面重新渲染会反复执行 效率低 后续优化
      console.log(cateName);
      return cateName;
    },
  },
  computed:{
  },
  created(){
    this.getCateList();
    this.getGoodsList();
  },
}
</script>

<style lang="less" scoped>
/deep/.el-upload-list__item.is-ready {
  display: none;
}
</style>