<template>
  <div class="goods-container">
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-row>
            <!-- 正在展示的图片 -->
            <el-col :span="24">
              <div class="goods-img-container">
                <img :src="'http://localhost:9999/images/'+goods.goodsImgs[active]" width="300" height="300"/>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <!-- 图片列表 -->
            <el-col :span="24">
              <div class="goods-pic-list">
                <el-carousel :autoplay="true" arrow="always" indicator-position="outside">
                  <el-carousel-item v-for="(item, index) in goods.goodsImgs" :key="index">
                    <img :src="'http://localhost:9999/images/'+item" @click="active=index" width="250" height="250"/>
<!--                    <el-image :src="'http://localhost:9999/images/'+item" fit="cover" @click="active=index" ></el-image>-->
                  </el-carousel-item>
                </el-carousel>
              </div>
            </el-col>
<!--            <el-col v-for="(item,index) in goods.goodsImgs" :key="index">-->
<!--              <el-image :src="'http://localhost:9999/images/'+item" fit="contain"-->
<!--                        @click="active=index"></el-image>-->
<!--            </el-col>-->
          </el-row>
        </el-col>
        <el-col :span="16">
          <el-row>
            <!-- 商品名称 -->
            <el-col :span="24">
              <h1>{{ goods.goodsName }}</h1>
            </el-col>
          </el-row>
          <el-row>
            <!-- 商品价格 -->
            <el-col :span="24">
              <h2>￥ {{ goods.goodsPrice }}</h2>
            </el-col>
          </el-row>
          <el-row>
            <div class="goods-desc">
              <!-- 商品详情 -->
              <el-col :span="24">
                <div v-html="goods.goodsDesc"></div>
              </el-col>
            </div>
          </el-row>
          <el-row>
            <!-- 加入购物车按钮 -->
            <el-col :span="6">
              <div class="goods-options">
                <el-input-number v-model="addCartForm.itemGoodsCount" :min="1" :max="goods.goodsStock" class="goods-num"></el-input-number>
                <el-button type="primary" plain icon="el-icon-plus" @click="handleAddCart(goods)">加入购物车</el-button>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "goods",
  data() {
    return {
      goods: {},
      params: [],
      active: 0,
      addCartForm:{
        itemGoodsId: "",
        itemGoodsCount: 1,
        itemGoodsName: "",
        itemGoodsImage: "",
        itemGoodsPrice: 0,
        itemGoodsStock: 0,
        itemTotal: 0,
        itemCart: 0
      },
    };
  },
  methods: {
    async getGoods() {
      let goodsId = this.$route.params.goods_id;
      console.log(goodsId);
      const {data: res} = await this.$http.get(`/client/goods/detail/${goodsId}`);
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.goods = res.data.item;
      //将商品的图片转换成数组
      this.goods.goodsImgs = this.goods.goodsImgs.split(" ");
      this.active = 0;
    },
    // 加入购物车
    async handleAddCart(goods){
      if (!this.$store.state.currentUserType) {
        this.$message.warning("请先登录");
        await this.$router.push("/login");
        return;
      }
      this.addCartForm.itemGoodsId = goods.goodsId;
      this.addCartForm.itemGoodsName = goods.goodsName;
      this.addCartForm.itemGoodsImage = goods.goodsImgs[0];
      this.addCartForm.itemGoodsPrice = goods.goodsPrice;
      this.addCartForm.itemGoodsStock = goods.goodsStock;
      this.addCartForm.itemTotal = this.addCartForm.itemGoodsCount * this.addCartForm.itemGoodsPrice;
      this.addCartForm.itemCart = this.$store.state.cartInfo.cartId;
      const {data:res} = await this.$http.post("/user/cart/item",this.addCartForm);
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.$message.success("加入购物车成功");
    },
  },
  created() {
    this.getGoods();
  }
}
</script>

<style lang="less" scoped>
.goods-img-container{
  display: flex;
  justify-content: center;
  align-items: center;
}
.goods-pic-list{
  margin: 5px auto;
  text-align: center;
  width: 250px;
  height: 250px;
}
.goods-desc{
  display: flex;
  margin-top: 20px;
}
.goods-options{
  margin: 10px 20px;
  >.goods-num{
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>