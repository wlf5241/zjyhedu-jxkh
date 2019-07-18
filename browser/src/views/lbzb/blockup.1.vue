<template>
  <div class="app-container">
    <!--el-table :data="tableData" border fit style="width: 100%">
      <el-table-column prop label="类别名称" width="200"/>
      <el-table-column prop label="项目名称" width="200"/>
      <el-table-column prop label="级别名称" width="200"/>
      <el-table-column prop label="分值" width="200"/>
      <el-table-column prop label="操作" width="200"/>
      :span-method="objectSpanMethod"
    </el-table-->

    <el-table
      :data="tableData"

      class="ems-table borderstyle"
      style="width: 100%;"
    >
      <el-table-column prop="lbmc" label="类别名称" width="200"/>
      <el-table-column prop="xmmc" label="项目名称" width="200"/>
      <el-table-column prop="jbmc" label="级别名称" width="200"/>
      <el-table-column prop="fz" label="分值" width="200"/>
      <el-table-column label="操作" width="200"/>
    </el-table>
  </div>
</template>

<script>
import { fetchAllList } from '@/api/lbzb'

export default {
  data() {
    return {
      tableData: null,
      cacheData: [],
      cacheIndex: [],
      cache: [],
      spanArr: [],
      lbListQuery: {
        lbmc: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchAllList({}).then(response => {
        this.tableData = response.data.items
        // this.getSpanArr(this.tableData)
      })
      // console.log(this.spanArr)
    },

    // spanArr用于存放每一行记录的合并数
    getSpanArr(data) {
      // console.log(data)// 从后台获取的数据
      data.forEach((key1, index1) => {
        this.spanArr[index1] = []

        this.spanArr[index1][0] = key1.jblength

        this.spanArr[index1][1] = key1.xmlist.jblist.length

        this.spanArr[index1][2] = 0
        this.spanArr[index1][3] = 0
        this.spanArr[index1][4] = 0
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const colNum = this.spanArr[rowIndex][columnIndex]
      // console.log(colNum + '----' + (columnIndex))
      return {
        rowspan: colNum,
        colspan: 0
      }
    }
  }
}
</script>
