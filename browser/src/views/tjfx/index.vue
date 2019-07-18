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
          <el-select v-model="lbSelected" multiple filterable collapse-tags placeholder="类别选择" @change="handleFilterLb">
            <el-option
              v-for="item in lbList"
              :key="item.classid"
              :label="item.mc"
              :value="item.classid"
            />
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
      :span-method="arraySpanMethod"
      border
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
      <el-table-column ref="actTd" label="附件" align="center">
        <template slot-scope="scope">
          <span v-for="item in scope.row.fj" :key="item.name">{{ item.name }}</span>
        </template>
      </el-table-column>
      <table
        slot="append"
        cellspacing="0"
        cellpadding="0"
        border="0"
        width="100%"
      >
        <colgroup>
          <!--col v-for="item in tableColumn" :key="item.id" :width="item.width"-->
          <col :width="colspanTdWidth" :colspan="dataTableColumnsWidth.length-2">
          <col :width="dataTableColumnsWidth[dataTableColumnsWidth.length-2]">
          <col :width="dataTableColumnsWidth[dataTableColumnsWidth.length-1]">
        </colgroup>
        <tbody>
          <tr>
            <td style="font-weight:bold;text-align:center;">合计</td>
            <td style="text-align:center">{{ countColWidth }}</td>
            <td />
          </tr>
          <tr>
            <td style="font-weight:bold;text-align:center;">权重计算得分</td>
            <td style="text-align:center">{{ countColWidth }}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </el-table>
  </div>
</template>

<script>
import '@/styles/other.scss' // global css

import { fetchClassAndClList } from '@/api/tjfx'
import { fetchClassList } from '@/api/lbzb'
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
        { id: 0, label: '类别名称', prop: 'lbmc', type: 'normal', width: '110' },
        { id: 1, label: '项目名称', prop: 'xmmc', type: 'normal', width: '110' },
        { id: 2, label: '级别名称', prop: 'jbmc', type: 'normal', width: '108' },
        { id: 3, label: '获奖名称', prop: 'mc', type: 'normal', width: '108' },
        { id: 4, label: '科目', prop: 'km', type: 'normal', width: '108' },
        { id: 5, label: '获奖教师', prop: 'zz', type: 'normal', width: '90' },
        { id: 6, label: '获奖时间', prop: 'hjsj', type: 'datetime', filter: '{y}-{m}-{d}', width: '100' },
        { id: 7, label: '颁奖单位', prop: 'bjdw', type: 'normal', width: '110' },
        { id: 8, label: '等级', prop: 'hjdj', type: 'normal', width: '80' },
        { id: 9, label: '得分', prop: 'fz', type: 'normal', width: '80' }
      ],
      xxList: [],
      lbList: [],
      lbSelected: '',
      zzList: [],
      zzSelected: '',
      listQuery: {
        classid: [],
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
    // 合并行宽
    countColWidth() {
      // console.log('dataTable-countColWidth', this.$refs.dataTable)
      const _this = this
      let _result = 0
      const result = _this.tableColumn.reduce((num, item, index) => {
        if (index === 1) {
          num = Number(num.width)
        }
        if (index < _this.tableColumn.length) {
          _result = num + Number(item.width)
        }
        return _result
      })
      return result
    }
  },
  created() {
    this.getTable()
    this.getXx()
    this.getClass()
  },
  mounted() {
    // 生成表格宽度数组,并去除null,undefined
    this.dataTableColumnsWidth = this.$refs.dataTable.columns.map((item) => {
      return item.width
    }).filter(item => item)
    this.dataTableWidth = this.$refs.dataTable.resizeState.width
    // 合计单元格长度设置，即最后一列的宽度
    this.endTdWidth = this.$refs.dataTable.columns[this.$refs.dataTable.columns.length - 1].realWidth
    this.dataTableColumnsWidth.push(this.endTdWidth)
    // 合并单元格宽度
    // 合并前9列，共有11列
    this.colspanTdWidth = this.dataTableWidth - parseInt(this.endTdWidth) - this.dataTableColumnsWidth[this.dataTableColumnsWidth.length - 2]
  },
  methods: {
    // 模拟后台返回的值
    getTable() {
      fetchClassAndClList(this.listQuery).then(response => {
        this.tableData = response.data.items
        // console.log(this.tableData)
        // 处理数据
        this.clearData()
        // this.getSpanArr(this.tableData)
      })
    },
    // 处理表格数据
    clearData() {
      const getData = [] // 存储新表格数据
      const lbIndex = [0] // 一级
      const xmIndex = [0] // 二级
      const jbIndex = [0] // 三级
      let a // 一级总行数
      let b // 二级行数
      this.tableData.forEach((lbItem, index) => {
        if (lbItem.xmList && lbItem.xmList.length) {
          a = 0
          lbItem.xmList.forEach((xmItem, i, xmListData) => {
            b = 0
            if (xmItem.jbList && xmItem.jbList.length) {
              xmItem.jbList.forEach((jbItem, k, jbListData) => {
                if (jbItem.clList && jbItem.clList.length) {
                  jbItem.clList.forEach((clItem, j, clListData) => {
                    if (j === clListData.length - 1) {
                      // 这个三级类别对应其材料的个数
                      jbIndex.push(clListData.length)
                      // 把数据长度加至一级类别
                      a += clListData.length
                      b += clListData.length
                      if (k === jbListData.length - 1) {
                        // 三级类别的个数+二级类别的长度
                        xmIndex.push(b)
                        // 把数据长度加至一级类别, 貌似不用加
                        // a += jbListData.length
                        if (i === xmListData.length - 1) {
                          // 一级类别数据长度
                          lbIndex.push(a)
                        }
                      }
                    }
                    getData.push({
                      lbmc: lbItem.lbmc,
                      xmmc: xmItem.xmmc,
                      jbmc: jbItem.jbmc,
                      mc: clItem.mc,
                      km: clItem.km,
                      zz: clItem.zz,
                      hjsj: clItem.hjsj,
                      bjdw: clItem.bjdw,
                      hjdj: clItem.hjdj,
                      fz: clItem.fz,
                      fj: clItem.fj
                    })
                  })
                }
              })
            }
          })
        }
      })

      // console.log(lbIndex)
      // [0, 5, 4]
      // 看一下打印出来的规律,除去第一项,5是第一次需要合并的行
      // 第二次合并又是从第五行开始合并4行
      // console.log(xmIndex)
      // [0, 2, 3, 2, 2]
      // 类型的数据存储规律也是一样,第一次合并2行
      // 第二次从2行开始,合并3行,以此类推
      // console.log(jbIndex)
      // 根据这个规则,只需要给数据加上两个额外的属性控制是否合并就OK
      let k = 0
      let t = 0
      let m = 0
      lbIndex.forEach((v, i, lbArr) => {
        if (lbArr[i + 1]) {
          getData[k].lbIndex = lbArr[i + 1]
          k += lbArr[i + 1]
        }
      })

      xmIndex.forEach((v, i, xmArr) => {
        if (xmArr[i + 1]) {
          getData[t].xmIndex = xmArr[i + 1]
          t += xmArr[i + 1]
        }
      })

      jbIndex.forEach((v, i, jbArr) => {
        if (jbArr[i + 1]) {
          getData[m].jbIndex = jbArr[i + 1]
          m += jbArr[i + 1]
        }
      })
      this.tableData = getData
      // console.log(this.tableData)
      // console.log(getData)
      // 0: {id: 1, name: "器械1", nameIndex: 5, region: "中国", type: "器械", typeIndex: 2},
      // 1: {id: 1, name: "器械2", region: "中国", type: "器械"}
      // ....
      // 5: {id: 2, name: "器械1", nameIndex: 4, region: "美国", type: "器械", typeIndex: 2}
    },
    // 表格合并方法
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.lbIndex) { // 如果有值,说明需要合并
          return [row.lbIndex, 1]
        } else return [0, 0]
      }
      if (columnIndex === 1) {
        if (row.xmIndex) {
          return [row.xmIndex, 1]
        } else return [0, 0]
      }
      if (columnIndex === 2) {
        if (row.jbIndex) {
          return [row.jbIndex, 1]
        } else return [0, 0]
      }
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
    // 类别列表
    getClass() {
      fetchClassList({ parentid: 0 }).then(response => {
        this.lbList = response.data.items
        // console.log(this.lbList)
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
    handleFilterLb(selected) {
      this.listQuery.classid = arrayToString(selected)
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
