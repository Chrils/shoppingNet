<template>
<div class="index-container">
  <!-- 回到顶部按钮 -->
  <!--  <el-backtop target=".index-container" :bottom="100"></el-backtop>-->
  <!-- 搜索框及logo区域 -->
  <div class="header-logo">
    <img src="@/assets/img/fronted_logo.png" width="100" height="150" alt="logo" />
    <!-- 级联选择框渲染 -->
    <el-cascader
        v-model="selectedKeys"
        :options="cateList"
        :props="cascaderProps"
        @change="handleCascaderChange"
        placeholder="请选择分类"
        style="width: 300px;">
    </el-cascader>
    <el-input
        class="ipt-search"
        v-model="search"
        placeholder="请输入商品名称"
        clearable
        @keyup.enter="searchGoods"
        @clear="searchGoods"
        style="width: 400px;"
    >
      <el-button type="danger" slot="append" icon="el-icon-search" @click="searchGoods" plain></el-button>
    </el-input>
  </div>
  <!-- banner区域 -->
  <div class="banner">
    <template>
      <el-carousel :interval="4000" type="card" height="230px">
        <el-carousel-item v-for="item in banner" :key="item.goodsId">
          <img :src="urlPrefix + item.goodsImgs[0]" alt="banner" width="400" height="230" />
        </el-carousel-item>
      </el-carousel>
    </template>
  </div>
  <!-- 商品列表区域 -->
  <div class="goods-list">
    <template>
      <el-row>
        <el-col :span="24" :lg="12" :md="12" :sm="12" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>热卖商品</span>
              <el-button type="text" class="pull-right" icon="el-icon-arrow-right" @click="handleClickMore('hot')"></el-button>
            </div>
            <div class="goods-list-box">
              <el-row>
                <el-col :span="24" :lg="12" :md="12" :sm="12" :xs="24" v-for="item in hotGoodsList" :key="item.goodsId">
                  <div class="goods-item" @click="goodsDetail(item.goodsId)">
                    <div class="goods-img">
                      <img :src="urlPrefix + item.goodsImgs[0]" alt="商品图片" width="150" height="150" />
                    </div>
                    <div class="goods-info">
                      <div class="goods-name">{{item.goodsName}}</div>
                      <div class="goods-price">￥{{item.goodsPrice}}</div>
                    </div>
                    <div class="goods_options">
                      <el-button type="text" icon="el-icon-plus" @click.stop="handleAddCart(item)">加入购物车</el-button>
<!--                      <el-button v-else type="text" icon="el-icon-minus">已添加购物车</el-button>-->
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24" :lg="12" :md="12" :sm="12" :xs="24">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>新品上市</span>
              <el-button type="text" class="pull-right" icon="el-icon-arrow-right" @click="handleClickMore('new')"></el-button>
            </div>
            <div class="goods-list-box">
              <el-row>
                <el-col :span="24" :lg="12" :md="12" :sm="12" :xs="24" v-for="item in newGoodsList" :key="item.goodsId">
                  <div class="goods-item" @click="goodsDetail(item.goodsId)">
                    <div class="goods-img">
                      <img :src="urlPrefix + item.goodsImgs[0]" alt="商品图片" width="150" height="150" />
                    </div>
                    <div class="goods-info">
                      <div class="goods-name">{{item.goodsName}}</div>
                      <div class="goods-price">￥{{item.goodsPrice}}</div>
                    </div>
                    <div class="goods_options">
                      <el-button type="text" icon="el-icon-plus" @click.stop="handleAddCart(item)">加入购物车</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>
  </div>
</div>
</template>

<script>
import Vue from "vue";

export default {
  name: "index",
  data(){
    return{
      banner: [],
      search: "",
      cateList: [], // 商品分类列表
      cascaderProps: {
        value: "cateId", //当前节点值
        label: "cateName", //当前节点显示的文本
        children: "children", //父子节点之间的关系
        expandTrigger: "hover",  // 何时触发展开
        checkStrictly: true
      },
      selectedKeys: [], // 级联选择框选中的值
      urlPrefix: "", // 图片前缀
      hotGoodsList: [], // 热卖商品列表
      newGoodsList: [], // 新品上市列表
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
    }
  },
  methods: {
    searchGoods() {
      // 搜索商品
      this.$router.push({
        path: "/mall/search",
        query: {
          keyword: this.search,
          selectedKeys: this.selectedKeys.join(",")
        }
      });
    },
    handleCascaderChange(){

    },
    // 获取商品分类列表
    async getCateList(){
      const {data:res} = await this.$http.get("/admin/goods/cate",{ params: {maxLevel: 1}})
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.cateList = res.data.list;
    },
    async fetchBanner() {
      const {data:res} = await this.$http.get("/client/base/banner");
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.banner = res.data.banner;
      this.urlPrefix = res.data.urlPrefix;
      //存入到vuex
      this.$store.commit("setUrlPrefix", res.data.urlPrefix);
      //将banner中的goodsImgs转换为数组
      this.banner.forEach(item => {
        item.goodsImgs = item.goodsImgs.split(" ");
      })
    },
    // 获取热卖商品列表
    async getHotGoodsList(){
      const {data:res} = await this.$http.get("/client/base/hot")
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.hotGoodsList = res.data.list;
      this.hotGoodsList.forEach(item => {
        item.goodsImgs = item.goodsImgs.split(" ");
      })
    },
    // 获取新品上市列表
    async getNewGoodsList(){
      const {data:res} = await this.$http.get("/client/base/new")
      if(res.meta.status!=="OK") return this.$message.error(res.meta.msg);
      this.newGoodsList = res.data.list;
      this.newGoodsList.forEach(item => {
        item.goodsImgs = item.goodsImgs.split(" ");
      })
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
    inCart(goodsId){
      if (!this.$store.state.currentUserType) {
        return false;
      }
      const cartInfo = this.$store.state.cartInfo;
      const itemList = cartInfo.cartItems;
      for(let i=0;i<itemList.length;i++){
        if(itemList[i].itemGoodsId === goodsId) return true;
      }
      return false;
    },
    goodsDetail(goodsId){
      this.$router.push(`/mall/goods/${goodsId}`);
    }
  },
  mounted() {

  },
  created() {
    this.getCateList();
    this.fetchBanner();
    this.getHotGoodsList();
    this.getNewGoodsList();
  }
}
</script>

<style lang="less" scoped>
.banner{
  margin: 0 auto;
  height: 230px;
  background-color: #fff;
  width: 800px;
}
.header-logo{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}
.el-cascader{
  margin-left: 60px;
}
::v-deep .header-logo .el-input{
  outline: 2px solid #f00;
}
.goods-list{
  margin-top: 20px;
}
.goods-list-box{
  display: flex;
  padding: 5px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.goods-item{
  width: 330px;
  height: 270px;
  margin-bottom: 10px;
  text-align: center;
  transition: box-shadow 0.7s;
  background-color: #eeeeee;
  >.goods-img{
    margin: 0 auto;
    width: 150px;
    height: 150px;
    background-size: cover;
    background-position: center;
    >img{
      margin-top: 5px;
    }
  }
  >.goods-info{
    padding: 10px 10px 0 10px;
    >.goods-name{
      line-height: 16px;
      font-size: 14px;
      color: #757373;
      margin: 5px 0;
    }
    >.goods-price{
      font-size: 18px;
      color: #f00;
    }
  }
}

.goods-item:hover{
  cursor: pointer;
  //移入制造阴影
  box-shadow: 10px 10px 1rem #8D8D8D;
}

::v-deep .el-card__header{
  background-color: rgba(255, 228, 201, 0.99);
}
.goods_options{
  width: 100%;
  height: 20px;
}
</style>