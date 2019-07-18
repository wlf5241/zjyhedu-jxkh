<template>
  <div class="app-container" style="padding-left:8px;padding-right:8px;">
    <div class="filter-container" style="padding-top:10px;min-width:650px;padding-bottom:0px;">
      <el-form ref="filtersForm" :inline="true" :model="listQuery" style="">
        <el-form-item label="获奖时间">
          <el-date-picker
            v-model="listQuery.kssj"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期"
            style="width:300px;font-size:12px;"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.xxid" placeholder="学校选择" @change="handleFilterXx">
            <el-option v-for="item in xxList" :key="item.id" :label="item.mc" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="zzSelected" multiple filterable collapse-tags placeholder="教师选择" @change="handleFilterZz">
            <el-option
              v-for="item in zzList"
              :key="item.id"
              :label="item.mc"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="dataTable"
      :data="tableData"
      border
      style="width:510px;float:left;"
    >
      <el-table-column
        v-for="item in tableColumn"
        :key="item.id"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="item.type==='datetime'">{{ scope.row[item.prop] | parseTime(item.filter) }}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <table
        slot="append"
        :width="dataTableWidth"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <colgroup>
          <!--col v-for="item in tableColumn" :key="item.id" :width="item.width"-->
          <col :width="colspanTdWidth" colspan="2">
          <col :width="dataTableColumnsWidth[dataTableColumnsWidth.length-2]">
          <col :width="dataTableColumnsWidth[dataTableColumnsWidth.length-1]">
        </colgroup>
        <tbody>
          <tr>
            <td style="font-weight:bold;text-align:center;">合计</td>
            <td style="text-align:center">111</td>
            <td />
          </tr>
          <tr>
            <td style="font-weight:bold;text-align:center;">权重计算得分</td>
            <td style="text-align:center">11</td>
            <td />
          </tr>
        </tbody>
      </table>
    </el-table>
  </div>
</template>

<script>
import '@/styles/other.scss' // global css

import { fetchPfhzList } from '@/api/tjfx'
import { fetchXxList, fetchZzList } from '@/api/dict'
import { arrayToString } from '@/utils'

import waves from '@/directive/waves' // Waves directive

export default {
  directives: { waves },
  filters: {
    timeFilter(time) {
      return 'asdfasdf'
    }
  },
  data() {
    return {
      tableData: [],
      dataTableColumnsWidth: [],
      dataTableWidth: 0,
      // 前面合并列的宽度
      colspanTdWidth: 0,
      // 最后一列的宽度
      endTdWidth: 0,
      tableColumn: [
        { id: 0, label: '教师姓名', prop: 'jsmc', type: 'normal', width: '180' },
        { id: 1, label: '材料数量', prop: 'clsl', type: 'normal', width: '111' },
        { id: 2, label: '得分', prop: 'fz', type: 'normal', width: '109' },
        { id: 3, label: '权重得分', prop: 'qz', type: 'normal', width: '109' }
      ],
      xxList: [],
      zzList: [],
      zzSelected: '',
      listQuery: {
        xxid: null,
        page: 1,
        limit: 20,
        zz: [],
        mc: undefined,
        kssj: undefined,
        jssj: undefined,
        sort: '+id'
      }
    }
  },
  computed: {

  },
  created() {
    this.getTable()
    this.getXx()
  },
  mounted() {
    // 生成表格宽度数组,并去除null,undefined
    this.dataTableColumnsWidth = this.$refs.dataTable.columns.map((item) => {
      return item.width
    }).filter(item => item)
    console.log('dataTable', this.$refs.dataTable)
    this.dataTableWidth = parseInt(this.$refs.dataTable.bodyWidth)
    // 合计单元格长度设置，即最后一列的宽度
    this.endTdWidth = this.$refs.dataTable.columns[this.$refs.dataTable.columns.length - 1].realWidth
    this.dataTableColumnsWidth.push(this.endTdWidth)
    // 合并单元格宽度
    // 合并前9列，共有11列
    this.colspanTdWidth = this.dataTableWidth - parseInt(this.endTdWidth) - this.dataTableColumnsWidth[this.dataTableColumnsWidth.length - 2]
    console.log('dataTableWidth', this.dataTableWidth)
    console.log('dataTableColumnsWidth', this.dataTableColumnsWidth)
    console.log('endTdWidth', this.endTdWidth)
    console.log('colspanTdWidth', this.colspanTdWidth)
  },
  methods: {
    // 模拟后台返回的值
    getTable() {
      fetchPfhzList(this.listQuery).then(response => {
        this.tableData = response.data.items
        // console.log(this.tableData)
        // this.getSpanArr(this.tableData)
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合  计'
          // console.log(column)  里面有column的很多设置
          // console.log(column)
          column.colSpan = 9
          column.labelClassName = 'summaries-label' // other.scss
          // console.log(column)
          return
        }
        if (index === 1) {
          // const values1 = data.map(item => Number(item[column.property]))
          // console.log(values1)
          sums[index] = ' 元'
        }

        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          // sums[index] = 'N/A'
          column.colSpan = 0
        }
      })

      return sums
    },
    // 学校列表
    getXx() {
      fetchXxList({}).then(response => {
        this.xxList = response.data.items
      })
    },
    // 教师列表
    getZz() {
      fetchZzList({ xxid: this.listQuery.xxid }).then(response => {
        this.zzList = response.data.items
      })
    },
    handleFilterXx(selected) {
      this.listQuery.xxid = selected
      this.getZz()
      this.handleFilter()
    },
    handleFilterZz(selected) {
      this.listQuery.zz = arrayToString(selected)
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getTable()
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
