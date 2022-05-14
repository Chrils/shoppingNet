<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form ref="form" :model="form" label-width="80px" size="small">
            <el-form-item label="订单编号">
              <el-input v-model="form.orderNo" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                <el-option v-for="item in orderStatus" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" style="width: 200px;"></el-date-picker>
              <span style="margin: 0 5px;">-</span>
              <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" style="width: 200px;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column label="订单编号">
          <template v-slot="scope">
            <router-link :to="'/order/detail/' + scope.row.orderNo">{{ scope.row.orderNo }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="订单状态">
          <template v-slot="scope">
            <el-tag type="info" v-if="scope.row.orderStatus === 0">待付款</el-tag>
            <el-tag type="primary" v-if="scope.row.orderStatus === 1">待发货</el-tag>
            <el-tag type="warning" v-if="scope.row.orderStatus === 2">已发货</el-tag>
            <el-tag type="danger" v-if="scope.row.orderStatus === 3">已取消</el-tag>
            <el-tag type="success" v-if="scope.row.orderStatus === 4">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ scope.row.orderCreateTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-more" size="small" @click="handleDetail(scope.row)">查看详情</el-button>
            <el-button type="success" icon="el-icon-location" size="small" @click="handleDelivery(scope.row)">定位</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="deliveryDialogVisible" width="30%">
      <!-- 使用timeline倒序显示物流信息 -->
      <el-timeline v-if="deliveryInfo.length > 0">
        <el-timeline-item v-for="item in deliveryInfo" :key="item.logisticsTime" :timestamp="item.logisticsTime">
          {{ item.logisticsDesc }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "order",
  data(){
    return{
      form: {
        orderNo: '',
        orderStatus: '',
        startTime: '',
        endTime: '',
      },
      orderList: [],
      orderStatus: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '0',
          label: '待付款',
        },
        {
          value: '1',
          label: '待发货',
        },
        {
          value: '2',
          label: '已发货',
        },
        {
          value: '3',
          label: '已取消',
        },
        {
          value: '4',
          label: '已完成',
        }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      deliveryInfo: [],
      deliveryDialogVisible: false,
    }
  },
  methods:{
    search(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.getOrderList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    reset(){
      this.form = {
        orderNo: '',
        orderStatus: '',
        startTime: '',
        endTime: '',
      }
      this.getOrderList();
    },
    async getOrderList(){
      const {data:res} = await this.$http.get('/admin/order/list', {params: this.form});
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.orderList = res.data.page.records;
      this.total = res.data.page.total;
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getOrderList();
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getOrderList();
    },
    handleDetail(row){
      this.$router.push(`/order/detail/${row.orderNo}`);
    },
    async handleDelivery(row){
      const {data:res} = await this.$http.get(`/admin/order/detail/${row.orderId}/logistics`);
      if(res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.deliveryInfo = res.data.list;
      this.deliveryDialogVisible = true;
    }
  },
  created() {
    this.getOrderList();
  },
  computed: {
  }
}
</script>

<style scoped>

</style>