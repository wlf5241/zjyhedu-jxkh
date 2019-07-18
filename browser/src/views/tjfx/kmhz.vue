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
          <el-select v-model="kmSelected" multiple filterable collapse-tags placeholder="科目选择" @change="handleFilterKm">
            <el-option-group
              v-for="group in kmList"
              :key="group.mc"
              :label="group.mc"
              :value="group.id"
            >
              <el-option
                v-for="item in group.km"
                :key="item.mc"
                :label="item.mc"
                :value="item.id"
              />
            </el-option-group>
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
    </el-table>
  </div>
</template>

<script>
import '@/styles/other.scss' // global css

import { fetchClassAndClList } from '@/api/tjfx'
import { fetchClassList } from '@/api/lbzb'
import { fetchXxList, fetchKmList } from '@/api/dict'
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
      tableColumn: [
        { id: 0, label: '学段', prop: 'lbmc', type: 'normal', width: '110' },
        { id: 1, label: '科目', prop: 'xmmc', type: 'normal', width: '110' },
        { id: 2, label: '级别名称', prop: 'jbmc', type: 'normal', width: '108' },
        { id: 3, label: '获奖名称', prop: 'mc', type: 'normal', width: '108' },
        { id: 5, label: '获奖教师', prop: 'zz', type: 'normal', width: '90' },
        { id: 6, label: '获奖时间', prop: 'hjsj', type: 'datetime', filter: '{y}-{m}-{d}', width: '100' },
        { id: 7, label: '颁奖单位', prop: 'bjdw', type: 'normal', width: '110' }
      ],
      xxList: [],
      lbList: [],
      lbSelected: '',
      kmList: [],
      kmSelected: '',
      listQuery: {
        classid: [],
        xxid: null,
        page: 1,
        limit: 20,
        km: [],
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
    this.getClass()
    this.getKm()
  },
  mounted() {
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
    // 科目列表
    getKm() {
      fetchKmList({ }).then(response => {
        this.kmList = response.data.items
      })
    },
    handleFilterXx(selected) {
      this.listQuery.xxid = selected
      this.handleFilter()
    },
    handleFilterLb(selected) {
      this.listQuery.classid = arrayToString(selected)
      this.handleFilter()
    },
    handleFilterKm(selected) {
      this.listQuery.km = arrayToString(selected)
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
