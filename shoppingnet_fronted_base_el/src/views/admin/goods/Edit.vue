<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 消息提示区域 -->
      <el-alert
          title="编辑商品信息"
          type="info"
          center
          :closable="false"
          show-icon>
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :active="active - 0" align-center finish-status="success" :space="200">
        <el-step title="基本信息" description="填写商品信息"></el-step>
        <el-step title="商品参数" description="填写商品参数"></el-step>
        <el-step title="商品属性" description="填写商品属性"></el-step>
        <el-step title="商品图片" description="上传商品图片"></el-step>
        <el-step title="商品内容" description="填写商品内容"></el-step>
        <el-step title="完成" description="已完成编辑"></el-step>
      </el-steps>

      <!-- 左侧tab栏区域 -->
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" >
        <el-tabs v-model="active" tab-position="left"
                 :before-leave="beforeLeaveTab"
                 @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="form.goodsName" style="width: 300px;" placeholder="请输入商品名称" clearable></el-input>
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
              <el-input-number v-model="form.goodsPrice" type="number" :min="0" :max="999999"></el-input-number>
            </el-form-item>
            <el-form-item label="商品库存" prop="goodsStock">
              <el-input-number v-model="form.goodsStock" type="number" :min="0" :max="999999"></el-input-number>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goodsWeight">
              <el-input v-model="form.goodsWeight" type="number" style="width: 200px;"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="(item,index) in dynamicParamsList" :key="item.attrId" :label="item.attrName">
              <el-checkbox-group v-model="tempDynamicParamsList[index].attrVals">
                <el-checkbox v-for="(item2,index2) in item.attrVals" :key="index2" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="(item,index) in staticParamsList" :key="item.attrId" :label="item.attrName">
              <el-checkbox-group v-model="tempStaticParamsList[index].attrVals">
                <el-checkbox v-for="(item2,index2) in item.attrVals" :key="index2" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-form-item label="商品图片">
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
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor ref="quillEditor" v-model="form.goodsDesc" :options="editorOption"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="handleSubmit">提交编辑</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  name: "Edit",
  data() {
    return {
      active: '0',
      activeName: 'dynamic',
      rules: {
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goodsCate: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        goodsPrice: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        goodsStock: [
          { required: true, message: "请输入商品库存", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" }
        ],
        goodsWeight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" }
        ]
      },
      form: {
        goodsId: 0, // 商品id
        goodsName: "", // 商品名称
        goodsCate: [], // 商品分类
        goodsPrice: 0, // 商品价格
        goodsStock: 0, // 商品库存
        goodsWeight: 0, // 商品重量
        goodsDesc: "", // 商品描述
        goodsImgs: [], // 商品图片
        goodsCreate: "", // 商品创建时间
        attrs: [], // 商品属性
        rawImg: [], // 商品原始图片
      },
      dialogImageUrl: "", // 图片预览url
      dialogImageVisible: false, // 图片预览对话框是否显示
      cateList: [], // 商品分类列表
      fileList: [], // 商品图片列表
      dynamicParamsList: [], // 商品动态参数列表
      staticParamsList: [], // 商品静态参数列表
      tempDynamicParamsList: [], // 临时商品动态参数列表
      tempStaticParamsList: [], // 临时商品静态参数列表
      // 级联选择器配置
      cascaderProps: {
        value: "cateId", //当前节点值
        label: "cateName", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
      },
      // 商品图片上传headers信息
      headers:{
        'Authorization': window.sessionStorage.getItem('token')
      },
      // 富文本编辑器配置
      editorOption: {
        theme: 'snow'
      },

    }
  },
  methods: {
    handleClick(index) {
      this.active = index
    },
    // 获取商品分类列表
    async getCateList(){
      const {data:res} = await this.$http.get("/admin/goods/cate",{ params: {maxLevel: 1}})
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.cateList = res.data.list;
      console.log("获取商品分类列表",this.cateList);
    },
    beforeLeaveTab(to, from) {
      if (this.form.goodsCate.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      } else {
        return true;
      }
    },
    tabClicked() {
      if (this.active === "1"){
        this.activeName = "dynamic"
        this.getParamsList()
      }else if (this.active === "2") {
        this.activeName = "static"
        this.getParamsList()
      }
    },
    //获取参数列表
    async getParamsList(special) {
      if (special) {
        this.activeName = special
      }
      const {data: res} = await this.$http.get(`/admin/goods/cate/${this.selectedId}/params/${this.activeName}`)
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      if (this.activeName === "dynamic") {
        this.dynamicParamsList = res.data.list;
        this.dynamicParamsList.forEach(item => {
          item.attrVals = item.attrVals ? item.attrVals.split(' ') : [];
        })
      } else if (this.activeName === "static") {
        this.staticParamsList = res.data.list;
        this.staticParamsList.forEach(item => {
          item.attrVals = item.attrVals ? item.attrVals.split(' ') : [];
        })
      }
    },
    handlePreview(file){
      this.dialogImageUrl = file.url;
      this.dialogImageVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log(this.form.goodsImgs);
      //1.获取当前点击的图片的path路径
      const path = file.path
      //2.从goodsImgs中找到图片的索引值
      const index = this.form.goodsImgs.findIndex(item => item.path === path);
      //3.删除goodsImgs中的图片
      this.form.goodsImgs.splice(index, 1);
      //4.删除fileList中的图片
      this.fileList.splice(index, 1);
      console.log("filelist", fileList);
      console.log("imgs",this.form.goodsImgs);
    },
    handleSuccess(res, file, fileList) {
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG || isGIF) && isLt2M;
    },
    async upload(param){
      const formData = new FormData();
      formData.append('file', param.file);
      const {data:res} = await this.$http.post("/admin/goods/upload",formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      console.log(res);
      this.fileList.push({
        url: res.data.url,
        uid: res.data.path
      });
      this.form.goodsImgs.push(res.data.path);
      this.$notify({
        title: "",
        message: "上传成功",
        type: "success"
      });
    },
    handleError(err, file, fileList) {
      console.log(err, file, fileList);
    },
    async handleSubmit(){
      const conf = await this.$refs.form.validate();
      if(!conf) {
        this.$message.error("请检查表单是否填写完整");
        return;
      }
      //将fileList中的url转换为数组并拼接成字符串
      const copyFrom = _.cloneDeep(this.form)
      copyFrom.goodsImgs = this.form.goodsImgs.join(' ');
      copyFrom.goodsCate = this.form.goodsCate[this.form.goodsCate.length-1];
      this.form.attrs = []
      //将动态参数列表转换为字符串
      this.tempDynamicParamsList.forEach(item => {
        const newInfo = {
          attrId: item.attrId,
          attrVals: item.attrVals.join(' ')
        }
        this.form.attrs.push(newInfo);
      })
      //将静态参数列表转换为字符串
      this.tempStaticParamsList.forEach(item => {
        const newInfo = {
          attrId: item.attrId,
          attrVals: item.attrVals.join(' ')
        }
        this.form.attrs.push(newInfo);
      })
      copyFrom.attrs = this.form.attrs
      //使用moment格式化日期
      copyFrom.goodsCreate = this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const {data:res} = await this.$http.put("/admin/goods/goods",copyFrom);
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.$message.success("修改成功");
      await this.$router.push("/goods/list");
    },
    //页面初始化加载数据
    async init(){
      // 获取当前正在编辑的商品信息
      const {data:res} = await this.$http.get(`/client/goods/detail/${this.$route.query.goodsId}`);
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      //将商品信息赋值给form
      this.form = res.data.item;
      // 保存商品的原始图片
      this.form.rawImg = this.form.goodsImgs;
      //将商品图片转换为数组
      this.form.goodsImgs = this.form.goodsImgs.split(' ');
      this.form.goodsImgs.forEach(item => {
        this.fileList.push({
          url: res.data.urlPrefix+item,
          uid: res.data.urlPrefix+item
        })
      })
      this.cateList.forEach(item => {
        item.children.forEach(cate => {
          cate.children.forEach(cateItem => {
            if (cateItem.cateId === this.form.goodsCate) {
              this.form.goodsCate = [item.cateId, cate.cateId, cateItem.cateId];
              console.log("====3==",this.form.goodsCate);
            }
          })
        })
      })
      await this.getParamsList('dynamic');
      await this.getParamsList('static');
      this.form.attrs=res.data.params;
      this.dynamicParamsList.forEach(item => {
        this.form.attrs.forEach(attr => {
          if (item.attrId === attr.attrId) {
            this.tempDynamicParamsList.push({
              attrId: attr.attrId,
              attrVals: attr.attrVals.split(' ')
            });
          }
        })
      })
      console.log("====4==",this.staticParamsList);
      console.log("====5==",this.tempStaticParamsList);
      this.staticParamsList.forEach(item => {
        this.form.attrs.forEach(attr => {
          console.log("====4==",item.attrId,attr.attrId);
          if (item.attrId === attr.attrId) {
            this.tempStaticParamsList.push({
              attrId: attr.attrId,
              attrVals: attr.attrVals.split(' ')
            });
          }
        })
      })
    }
  },
  created() {
    console.log("start created ...")
    new Promise(async resolve => {
      console.log("start created ...")
      await this.getCateList()
      resolve()
    }).then(() => {
      console.log("init ...")
      this.init()
    })
  },
  computed: {
    selectedId() {
      if (this.form.goodsCate.length !== 3){
        console.log("length",this.form.goodsCate.length);
        return null;
      }
      return this.form.goodsCate[this.form.goodsCate.length - 1];
    }
  },
}
</script>

<style scoped>
.el-tag{
  margin: 10px;
}
.el-checkbox{
  margin: 2px 10px 2px 0 !important;
}
/deep/.el-upload-list__item.is-ready {
  display: none;
}
.btnAdd{
  margin-top: 15px;
}
</style>