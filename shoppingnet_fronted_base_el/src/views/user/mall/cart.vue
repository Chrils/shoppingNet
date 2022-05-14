<template>
  <div>
    <el-card>
      <el-table :data="cart.cartItems" ref="cartTable" @selection-change="changePrice" @row-click="handleRowClick">
        <el-table-column type="selection" width="100"></el-table-column>
        <el-table-column type="index" label="#" width="100"></el-table-column>
        <el-table-column label="商品信息" width="500">
          <template v-slot="scope">
            <el-row>
              <el-col :span="10">
                <img :src="'http://localhost:9999/images/'+scope.row.itemGoodsImage" style="width: 100px; height: 100px;">
              </el-col>
              <el-col :span="13">
                <span>{{scope.row.itemGoodsName}}</span>
                <span>{{scope.row.itemGoodsPrice}}</span>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="330">
          <template v-slot="scope">
            <el-input-number v-model="scope.row.itemGoodsCount" :min="1" :max="scope.row.itemGoodsStock" @change="changeQuantity(scope.row)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="小计" width="150">
          <template v-slot="scope">
            <span>{{(scope.row.itemGoodsPrice * scope.row.itemGoodsCount).toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="text" @click="removeItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="cart-bottom">
         <span>总计：￥ {{totalPrice.toFixed(2)}}</span>
         <span>已选择: ￥ {{chosenPrice.toFixed(2)}} </span>
         <el-button type="primary" :disabled="chosenPrice <= 0" @click="checkout">结算</el-button>
      </div>
    </el-card>
    <el-dialog title="结算" :visible.sync="checkoutDialogVisible">
      <el-form :model="orderForm" :rules="orderFormRules" ref="checkoutForm">
        <el-form-item label="收货人" prop="orderUserName">
          <el-input v-model="orderForm.orderUsername"></el-input>
        </el-form-item>
        <el-form-item label="收货地址信息" prop="address">
          <el-select value="请选择" v-model="activeIndex" @change="handleSelectAddr">
            <el-option v-for="(item, index) in addressList" :key="index" :label="item.addrStreet" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="orderRemark">
          <el-input v-model="orderForm.orderRemark"></el-input>
        </el-form-item>
        <!-- 提交取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="orderConfirm">提交</el-button>
          <el-button @click="checkoutDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cart",
  data(){
    return{
      cart:{
        cartItems:[]
      },
      chosenPrice:0,
      orderForm:{
        orderUserId: this.$store.state.userInfo.id,
        orderUsername: this.$store.state.userInfo.username,
        address: {}, //地址
        orderTotal: 0,
        orderFee: 0,
        orderStatus: 0,
        orderRemark: '无',
        orderItemList: [],
        orderAddressId: 0,
        orderAddress: '',
        orderItemCount: 0,
      },
      addressList:[], //地址列表
      checkoutDialogVisible: false,
      orderFormRules: {
        orderUsername: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请选择收货地址', trigger: 'blur' }
        ],
      },
      activeIndex: 0,
    }
  },
  methods:{
    async fetchCardInfo(){
      const {data:res} = await this.$http.get(`/user/cart/${this.$store.state.userInfo.id}`);
      if(res.meta.status !== 'OK') return this.$message.error(res.meta.msg);
      this.cart = res.data.cart;
    },
    async changeQuantity(item){
      const {data:res} = await this.$http.put(`/user/cart/item`,item);
      if(res.meta.status !== 'OK') return this.$message.error(res.meta.msg);
      this.changePrice();
    },
    async removeItem(item){
      const confirm = await this.$confirm('确定要将该商品移除购物车吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      if(!confirm) return;
      const {data:res} = await this.$http.delete(`/user/cart/item/${item.itemId}`);
      if(res.meta.status !== 'OK') return this.$message.error(res.meta.msg);
      this.$message.success('移除商品成功');
      this.cart.cartItems.splice(this.cart.cartItems.indexOf(item),1);
      this.changePrice();
    },
    async checkout(){
      const confirm = await this.$confirm('确定要提交订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      if(!confirm) return;
      await this.fetchAddressList();
      this.$refs.cartTable.selection.forEach(item => {
        this.orderForm.orderItemList.push({
          itemCount: item.itemGoodsCount,
          itemGoodsId: item.itemGoodsId,
          itemGoodsName: item.itemGoodsName,
          itemGoodsPrice: item.itemGoodsPrice,
          itemImgUrl: 'http://localhost:9999/images/'+item.itemGoodsImage,
          itemNumber: item.itemGoodsCount * item.itemGoodsPrice,
        });
      });
      this.checkoutDialogVisible = true;
    },
    changePrice(){
      // 过滤出已选择的商品
      const selectedItems = this.$refs.cartTable.selection;
      this.orderForm.orderItemCount = selectedItems.length;
      this.$nextTick(()=>{
        // 计算已选择的商品的总价
        this.chosenPrice = selectedItems.reduce((total,item)=>{
          return total + item.itemGoodsPrice * item.itemGoodsCount;
        },0);
      })
    },
    handleRowClick(row){
    },
    async fetchAddressList(){
      const {data:res} = await this.$http.get(`/client/user/${this.orderForm.orderUserId}/address`);
      if(res.meta.status !== 'OK') return this.$message.error(res.meta.msg);
      this.addressList = res.data.list;
    },
    orderConfirm(){
      this.$refs.checkoutForm.validate(async valid => {
        this.orderForm.orderTotal = this.chosenPrice;
        this.orderForm.address = this.addressList[this.activeIndex];
        this.orderForm.orderAddressId = this.orderForm.address.addrId;
        if(!valid) return;
        const {data:res} = await this.$http.post(`/admin/order/add`,this.orderForm);
        if(res.meta.status !== 'OK') return this.$message.error(res.meta.msg);
        this.$message.success('提交订单成功');
        this.checkoutDialogVisible = false;
        // 将结算的商品从购物车中移除
        // this.cart.cartItems = this.cart.cartItems.filter(item => {
        //   return !this.$refs.cartTable.selection.includes(item);
        // });
        this.cart.cartItems = this.cart.cartItems.filter(async item => {
          if(this.$refs.cartTable.selection.includes(item)) {
            const {data:res} = await this.$http.delete(`/user/cart/item/${item.itemId}`);
            return false;
          }
          return true;
        });
        await this.$router.push("/mall/cart")
      });
    },
    handleSelectAddr(){
      this.orderForm.address = this.addressList[this.activeIndex];
    }
  },
  created(){
    this.fetchCardInfo();
  },
  computed:{
    totalPrice(){
      return this.cart.cartItems.reduce((total,item)=>{
        return total + item.itemGoodsPrice * item.itemGoodsCount;
      },0);
    }
  }
}
</script>

<style lang="less" scoped>
.cart-bottom{
  display: flex;
  justify-content: right;
  align-items: center;
  margin-top: 20px;
  padding: 0 90px;
  >span{
    margin-right: 20px;
  }
}
</style>