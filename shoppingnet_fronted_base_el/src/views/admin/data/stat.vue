<template>
  <div>
    <!-- 面包屑导航区域 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <router-link to="/welcome">首页</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据监控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 数据监控 -->
    <el-card>
      <el-row :gutter="40">
        <el-col :span="8">
          <!-- 柱状图 -->
          <div class="chart-content" :style="{width: '500px', height: '500px'}"></div>
        </el-col>
        <el-col :span="16">
          <!-- 饼状图 -->
          <div class="chart-content" :style="{width: '700px', height: '500px'}"></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
const option = {
  title: {
    text: '销售地区来源',
  },
  series: [
    {
      type: "pie", // type设置为饼图
      data: [
        {
          value: 147,
          name: "江苏"
        },
        {
          value: 395,
          name: "浙江"
        },
        {
          value: 157,
          name: "山东"
        },
        {
          value: 149,
          name: "广东"
        },
        {
          value: 463,
          name: "湖南"
        },
        {
          value: 523,
          name: "湖北"
        }
      ],
      label: {
        normal: {
          show: true,
          position: "outside",
          formatter: "{b}:{d}%"
        }
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
};


export default {
  name: "Stat",
  data(){
    return{
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementsByClassName('chart-content')[0]);
    // 绘制图表
    myChart.setOption({
      title: {
        text: '销售额统计',
      },
      tooltip: {},
      legend: {
        data:['销量']
      },
      xAxis: {
        data: ["美的","格力","无线充电宝","手机充电线","蓝牙耳机","华为手机"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    });
    const myChart2 = echarts.init(document.getElementsByClassName('chart-content')[1]);
    // 绘制图表
    myChart2.setOption(option);
  }
}
</script>

<style scoped>

</style>