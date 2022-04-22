<template>
<div>
  <!-- 面包屑导航区域 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <router-link to="/welcome">首页</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <!-- 卡片视图 -->
  <el-card>
    <el-row>
      <el-col><el-alert show-icon title="只允许为第三级分类添加参数" type="warning"/></el-col>
    </el-row>
    <el-row>
      <el-col>
        <span class="type-title">商品分类</span>
        <!-- 级联选择框渲染 -->
        <el-cascader
          v-model="selectedKeys"
          :options="cateList"
          :props="cascaderProps"
          placeholder="请选择分类"
          @change="handleChange">
        </el-cascader>
      </el-col>
    </el-row>
    <!-- tab页签区域 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="dynamic">
        <el-button type="primary" size="mini"
                   @click="addAttribute"
                   :disabled="selectedKeys.length!==3">添加参数
        </el-button>
        <el-table :data="paramsList" border stripe>
          <el-table-column type="expand">
            <template v-slot="props">
              <el-tag v-for="(item,index) in props.row.attrVals" :key="index" closable @close="tagClosed(index,props.row)">{{item}}</el-tag>
              <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                  @keydown.esc="handleInputConfirm(props.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attrName">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template v-slot="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit"
                         @click="editAttribute(scope.row.attrId)">编辑
              </el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete"
                         @click="deleteAttribute(scope.row.attrId)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="static">
        <el-button type="primary" size="mini"
                   @click="addAttribute"
                   :disabled="selectedKeys.length!==3">添加属性
        </el-button>
        <el-table :data="paramsList" border stripe>
          <el-table-column type="expand">
            <template v-slot="props">
              <el-tag v-for="(item,index) in props.row.attrVals" :key="index" closable @close="tagClosed(index,props.row)">{{item}}</el-tag>
              <el-input
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                  @keydown.esc="handleInputConfirm(props.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(props.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="参数名称" prop="attrName">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template v-slot="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit"
                         @click="editAttribute(scope.row.attrId)">编辑
              </el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete"
                         @click="deleteAttribute(scope.row.attrId)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

  </el-card>

  <!-- 添加参数对话框 -->
  <el-dialog :title="'添加'+dialogTitle" :visible.sync="dialogFormVisible" width="50%" @close="addFormDialogClosed" @submit.native.prevent>
    <el-form :model="form" :rules="addRules" ref="addFormRef" label-width="100px">
      <el-form-item label="参数名称" prop="attrName">
        <el-input v-model="form.attrName" placeholder="请输入参数名称" @keyup.enter.native="addFormSubmit"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addFormSubmit">确 定</el-button>
    </div>
  </el-dialog>

  <!-- 修改参数对话框 -->
  <el-dialog :title="'修改'+dialogTitle" :visible.sync="dialogEditFormVisible" width="50%" @close="editFormDialogClosed">
    <el-form :model="form" :rules="addRules" ref="editFormRef" label-width="100px">
      <el-form-item label="参数名称" prop="attrName">
        <el-input v-model="form.attrName" placeholder="请输入参数名称" @keyup.enter.native="editFormSubmit"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogEditFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="editFormSubmit">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
export default {
  name: "Params",
  data(){
    return{
      cateList: [],
      paramsList: [],
      selectedKeys: [],
      cascaderProps: {
        value: "cateId", //当前节点值
        label: "cateName", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
      },
      activeName: "dynamic",
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      form: {
        cateId: 0,
        attrName: '',
        attrSel: '',
        attrVals: '',
      },
      addRules: {
        attrName: [
          {required: true, message: '请输入参数名称', trigger: 'blur'},
        ],
      },

    }
  },
  methods:{
    handleChange(){
      //设置只允许选择第三级分类
      if(this.selectedKeys.length !== 3){
        this.selectedKeys = [];
        this.paramsList = [];
        return;
      }
      //获取当前选中的分类参数
      this.getParamsList();
    },
    handleTabClick(){
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        return;
      }
      //获取当前选中的分类参数
      this.getParamsList();
    },
    //获取分类列表
    async getCateList(){
      const {data:res} = await this.$http.get("/admin/goods/cate",{ params: {maxLevel: 1}})
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.cateList = res.data.list;
    },
    //获取参数列表
    async getParamsList(){
      const {data:res} = await this.$http.get(`/admin/goods/cate/${this.selectedKeys[2]}/params/${this.activeName}`)
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.paramsList = res.data.list;
      //将参数列表中的attrVals值转换为数组
      this.paramsList.forEach(item=>{
        item.attrVals = item.attrVals ? item.attrVals.split(' ') : [];
        //动态设置控制显示与隐藏输入框或按钮的属性
        this.$set(item, 'inputVisible', false);
        this.$set(item, 'inputValue', '');
      })
    },
    addAttribute(){
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.$refs.addFormRef.resetFields();
      })
    },
    addFormSubmit(){
      this.$refs.addFormRef.validate(async valid => {
        this.form.cateId = this.selectedKeys[2];
        this.form.attrSel = this.activeName;
        if(!valid) return;
        const {data:res} = await this.$http.post(`/admin/goods/cate/params`,this.form)
        if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
        this.$message.success("参数添加成功");
        this.dialogFormVisible = false;
        await this.getParamsList();
      })
    },
    addFormDialogClosed(){
      //TODO 当enter键关闭dialog时，会出现验证信息没有消失的情况
      this.$refs.addFormRef.resetFields();
    },
    async editAttribute(attrId){
      this.dialogEditFormVisible = true;
      const {data:res} = await this.$http.get(`/admin/goods/cate/params/${attrId}`)
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.form = res.data.item;
    },
    editFormSubmit(){
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return;
        const {data:res} = await this.$http.put(`/admin/goods/cate/params`,this.form)
        if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
        this.$message.success("参数修改成功");
        this.dialogEditFormVisible = false;
        await this.getParamsList();
      })
    },
    editFormDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    deleteAttribute(attrId){
      this.$confirm("确定要删除该参数吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const {data:res} = await this.$http.delete(`/admin/goods/cate/params/${attrId}`)
        if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
        this.$message.success("参数删除成功");
        await this.getParamsList();
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    showInput(row){
      row.inputVisible = true;
      //$nextTick()方法是在下一个时间周期（下一次DOM更新）执行的函数
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm(row){
      if (row.inputValue.trim() === "") {
        row.inputVisible = false;
        row.inputValue = "";
        return;
      }
      const {attrVals} = row;
      attrVals.push(row.inputValue);
      this.saveAttribute(row);
    },
    async saveAttribute(row){
      //发起请求
      const {attrVals} = row;
      const {data:res} = await this.$http.put(`/admin/goods/cate/params`,{
        attrId:row.attrId,
        attrVals:attrVals.join(' '),
        cateId:this.selectedKeys[2],
        attrSel:row.attrSel
      })
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.$message.success("参数修改成功！");
      row.inputVisible = false;
      row.inputValue = "";
    },
    //删除参数值
    tagClosed(i,row){
      /**
       * splice() 方法用于插入、删除或替换数组的元素。
       * 该方法会改变原始数组。
       * 可以通过设置第二个参数为负数，以便从数组末尾开始索引。
       * 如果第三个参数为负数，则会删除从第一个参数开始的元素。
       * 如果第三个参数大于等于数组长度，则会从第一个参数开始插入。
       * 如果第三个参数为 0，则不会改变数组。
       */
      row.attrVals.splice(i,1);
      this.saveAttribute(row);
    },
  },
  computed:{
    //对话框显示标题
    dialogTitle(){
      return this.activeName === 'dynamic' ? '动态参数' : '静态属性';
    },
  },
  created(){
    this.getCateList();
  }
}
</script>

<style lang="less" scoped>
.type-title{
  font-size: 14px;
}
.el-cascader{
  margin: 10px;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>