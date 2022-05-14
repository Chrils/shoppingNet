<template>
  <div>
    <!-- 搜索框及logo区域 -->
    <div class="header-logo">
      <img src="@/assets/img/fronted_logo.png" width="100" height="150" alt="logo"/>
      <!-- 级联选择框渲染 -->
      <el-cascader
          v-model="selectedKeys"
          :options="cateList"
          :props="cascaderProps"
          @change="handleCascaderChange"
          placeholder="请选择分类"
          clearable
          style="width: 300px;">
      </el-cascader>
      <el-input
          class="ipt-search"
          v-model="queryInfo.goodsName"
          placeholder="请输入商品名称"
          clearable
          @keyup.enter="searchGoods"
          @clear="searchGoods"
          style="width: 400px;"
      >
        <el-button type="danger" slot="append" icon="el-icon-search" @click="searchGoods" plain></el-button>
      </el-input>
    </div>
    <!-- 商品列表 -->
    <div class="search-result">
      <div class="search-result-title">
        <span>
          <span>搜索结果</span>
          <span class="search-result-title-records">共{{ total }}条记录</span>
        </span>
        <!-- 筛选按钮 -->
        <el-button type="primary" icon="el-icon-more" @click="showFilter">筛选</el-button>
      </div>
      <div class="search-result-list">
        <div class="search-result-list-item" v-for="item in searchResult" @click="goodsDetail(item.goodsId)">
          <div class="search-result-list-item-img">
            <img :src="'http://localhost:9999/images/' + item.goodsImgs[0]" alt="">
          </div>
          <div class="search-result-list-item-info">
            <div class="search-result-list-item-info-title">
              <span>{{ item.goodsName }}</span>
            </div>
            <div class="search-result-list-item-info-price">
              <span class="search-result-list-item-info-price-price">￥{{ item.goodsPrice }}</span>
              <span class="search-result-list-item-info-price-sell">已售{{ item.goodsSell }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 筛选框 -->
    <el-drawer :visible.sync="filterVisible" placement="right" width="350" title="条件筛选" @close="closeFilter">
      <div class="filter-content">
        <div class="filter-content-list">
          <div class="filter-content-list-item">
            <span>价格区间</span>
            <div class="filter-content-range">
              <el-input type="number" v-model="queryInfo.minPrice" placeholder="请输入最低价格"></el-input>
              <span>-</span>
              <el-input type="number" v-model="queryInfo.maxPrice" placeholder="请输入最高价格"></el-input>
            </div>
          </div>
          <div class="filter-content-list-item">
            <span>销量区间</span>
            <div class="filter-content-range">
              <el-input type="number" v-model="queryInfo.minSell" placeholder="请输入最低销量"></el-input>
              <span>-</span>
              <el-input type="number" v-model="queryInfo.maxSell" placeholder="请输入最高销量"></el-input>
            </div>
          </div>
          <div class="filter-content-list-item">
            <el-switch
                v-model="queryInfo.priceDesc"
                active-text="价格降序"
                inactive-text="价格升序">
            </el-switch>
          </div>
          <div class="filter-content-list-item">
            <el-switch
                v-model="queryInfo.sellDesc"
                active-text="销量降序"
                inactive-text="销量升序">
            </el-switch>
          </div>
          <div class="filter-content-list-item filter-option">
            <el-button @click="closeFilter">取消</el-button>
            <el-button type="primary" @click="handleFilterConfirm">确定</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      urlPrefix: this.$store.state.urlPrefix,
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
      searchResult: [],
      queryInfo: {
        goodsName: "",
        cateId: 1,
        cateLevel: 0,
        page: 1,
        size: 12,
        startTime: null,
        endTime: null,
        minPrice: '',
        maxPrice: '',
        minSell: '',
        maxSell: '',
        priceDesc: true,
        sellDesc: true
      },
      total: 0,
      filterVisible: false,
    };
  },
  methods: {
    async searchGoods() {
      if (this.selectedKeys.length > 0) {
        this.queryInfo.cateId = this.selectedKeys[this.selectedKeys.length - 1];
        this.queryInfo.cateLevel = this.selectedKeys.length;
      } else {
        this.queryInfo.cateId = 1;
        this.queryInfo.cateLevel = 0;
      }
      const {data: res} = await this.$http.get("/client/goods/list", {params: this.queryInfo})
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.searchResult = res.data.page.records;
      this.searchResult.forEach(item => {
        item.goodsImgs = item.goodsImgs.split(" ");
      });
      this.total = res.data.page.total;
    },
    handleCascaderChange() {
      this.searchGoods();
    },
    // 获取商品分类列表
    async getCateList() {
      const {data: res} = await this.$http.get("/admin/goods/cate", {params: {maxLevel: 1}})
      if (res.meta.status !== "OK") return this.$message.error(res.meta.msg);
      this.cateList = res.data.list;
    },
    // 获取搜索结果
    async init() {
      this.queryInfo.goodsName = this.$route.query.search;
      this.selectedKeys = this.$route.query.selectedKeys.split(",");
      await this.searchGoods();
    },
    // 显示筛选面板
    showFilter() {
      this.filterVisible = true;
    },
    // 关闭筛选面板
    closeFilter() {
      this.filterVisible = false;
    },
    handleFilterConfirm() {
      this.filterVisible = false;
      this.searchGoods();
    },
    goodsDetail(goodsId){
      this.$router.push(`/mall/goods/${goodsId}`);
    }
  },
  created() {
    this.getCateList();
    this.init();
  }
}
</script>

<style lang="less" scoped>
.banner {
  margin: 0 auto;
  height: 230px;
  background-color: #fff;
  width: 800px;
}

.header-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}

.el-cascader {
  margin-left: 60px;
}

::v-deep .header-logo .el-input {
  outline: 2px solid #f00;
}

.search-result-title {
  margin-top: 20px;
  margin-bottom: 20px;
  font: bold 20px/30px "Microsoft YaHei";
  display: flex;
  justify-content: space-between;
  align-items: center;
  >span{
    >.search-result-title-records{
      font: normal 14px/20px "Microsoft YaHei";
      margin-left: 10px;
    }
  }
}

.search-result-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;
  >.search-result-list-item{
    width: 300px;
    height: 300px;
    margin-bottom: 20px;
    margin-right: 20px;
    background-color: #eeeeee;
    transition: box-shadow .3s;
    >.search-result-list-item-img{
      width: 60%;
      height: 60%;
      margin: 5px auto 0;
      >img{
        width: 100%;
        height: 100%;
      }
    }
    >.search-result-list-item-info{
      padding: 10px;
      >.search-result-list-item-info-title{
        font: bold 16px/30px "Microsoft YaHei";
        height: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        >span{
          color: #333;
        }
      }
      >.search-result-list-item-info-price{
        font: bold 16px/30px "Microsoft YaHei";
        display: flex;
        justify-content: space-between;
        align-items: center;
        >.search-result-list-item-info-price-price{
          color: #f00;
        }
        >.search-result-list-item-info-price-sell{
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
.search-result-list-item:hover{
  box-shadow: 10px 10px 1rem #8D8D8D;
}

.filter-content{
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  >.filter-content-list{
    >.filter-content-list-item{
      display: flex;
      height: 60px;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      font: bold 16px/30px "Microsoft YaHei";
      >span{
        margin-right: 10px;
      }
      >.filter-content-range{
        display: flex;
        justify-content: center;
        align-items: center;
        >::v-deep .el-input{
          width: 150px;
          height: 30px;
          padding: 0 5px;
          font-size: 13px;
          line-height: 30px;
          color: #666;
        }
      }
    }
    >.filter-option{
      display: flex;
      justify-content: right;
      margin-top: 10px;
    }
  }
}
</style>