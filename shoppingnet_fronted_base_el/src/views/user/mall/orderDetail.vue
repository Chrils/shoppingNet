<template>
  <div>
    <!-- 订单详情 -->
    <el-card>
      <el-descriptions class="order-detail-info" :column="2" :data="order">
        <el-descriptions-item label="订单编号" >{{order.orderNo}}</el-descriptions-item>
        <el-descriptions-item label="订单状态" >{{orderStatusName}}</el-descriptions-item>
        <el-descriptions-item label="下单时间" >{{order.orderCreateTime}}</el-descriptions-item>
        <el-descriptions-item label="订单备注" >{{order.orderRemark === '' ? '无' : order.orderRemark}}</el-descriptions-item>
        <el-descriptions-item label="收货人" >{{order.address.addrRealname}}</el-descriptions-item>
        <el-descriptions-item label="收货地址" >{{fullAddress}}</el-descriptions-item>
        <el-descriptions-item label="联系电话" >{{order.address.addrTelephone}}</el-descriptions-item>
        <el-descriptions-item label="订单总价" >{{order.orderTotal}}</el-descriptions-item>
        <el-descriptions-item label="优惠活动" >无</el-descriptions-item>
        <el-descriptions-item label="优惠金额" >0</el-descriptions-item>
        <el-descriptions-item label="应付金额" >{{order.orderTotal}}</el-descriptions-item>
        <el-descriptions-item label="实付金额" >{{order.orderTotal}}</el-descriptions-item>
        <el-descriptions-item label="商品信息" >
          <el-table :data="order.orderItemList" style="width: 100%" border stripe>
            <el-table-column label="商品名称" prop="itemGoodsName" width="180"></el-table-column>
            <el-table-column label="商品图片" prop="itemImgUrl" width="180">
              <template v-slot="scope">
                <img :src="scope.row.itemImgUrl" width="100" height="100" alt="">
              </template>
            </el-table-column>
            <el-table-column label="商品价格" prop="itemGoodsPrice" width="180"></el-table-column>
            <el-table-column label="商品数量" prop="itemCount" width="180"></el-table-column>
            <el-table-column label="商品总价" width="180">
              <template v-slot="scope">
                {{scope.row.itemGoodsPrice * scope.row.itemCount}}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "orderDetail",
  data() {
    return {
      order: {
        orderNo: "",
        orderCreatedTime: "",
        orderTotal: "",
        orderStatus: "",
        orderStatusName: "",
        orderRemark: "",
        orderItemList: [],
        address: {
          addrRealname: "",
          addrTelephone: "",
          addrProvince: "",
          addrCity: "",
          addrArea: "",
          addrDetail: ""
        }
      }
    };
  },
  methods: {
    async getOrderDetail() {
      let order_no = this.$route.params.order_no;
      const {data:res} = await this.$http.get(`/admin/order/detail/${order_no}`);
      if(res.meta.status !== 'OK') return this.$message.error(res.meta.msg);
      this.order = res.data.item;
    }
  },
  created() {
    this.getOrderDetail();
  },
  computed:{
    fullAddress(){
      return this.order.address.addrProvince + '-' +
          this.order.address.addrCity + '-' +
          this.order.address.addrArea + '-' +
          this.order.address.addrStreet
    },
    orderStatusName(){
      switch(this.order.orderStatus){
        case 0:
          return '待付款';
        case 1:
          return '待发货';
        case 2:
          return '已发货';
        case 3:
          return '已取消';
        case 4:
          return '已完成';
        default:
          return '未知状态';
      }
    }
  }
}
</script>

<style scoped>

</style>