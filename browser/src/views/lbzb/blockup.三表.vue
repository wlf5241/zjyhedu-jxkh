<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      :span-method="arraySpanMethod"
      border
      style="width: 60%">
      <el-table-column
        prop="lbmc"
        label="类别名称"/>
      <el-table-column
        prop="xmmc"
        label="项目名称"/>
      <el-table-column
        prop="jbmc"
        label="级别名称"/>
      <el-table-column label="操作" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="updateData(scope.row)">启用</el-button>

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchAllClassByTree, updateBlockup } from '@/api/lbzb'

export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getTable()
  },
  methods: {
    // 模拟后台返回的值
    getTable() {
      fetchAllClassByTree({ ty: 1 }).then(response => {
        this.tableData = response.data.items
        // 处理数据
        this.clearData()
        // this.getSpanArr(this.tableData)
      })
    },
    // 处理表格数据
    clearData() {
      const getData = [] // 存储新表格数据
      const xmIndex = [0] // 保存项目需要合并的值
      const jbIndex = [0] // 保存级别需要合并的值
      let a // id,地区需要合并的行是所有类型的长度
      this.tableData.forEach((v, index) => {
        if (v.xmlist && v.xmlist.length) {
          a = 0
          v.xmlist.forEach((subV, i, xmlistData) => {
            if (subV.jblist && subV.jblist.length) {
              subV.jblist.forEach((ss, k, data) => {
                if (k === data.length - 1) {
                  xmIndex.push(data.length) // 把每一个类型下面数据长度存起来
                  a += data.length // 把所有类型下面的数据长度相加
                  if (i === xmlistData.length - 1) {
                    jbIndex.push(a) // 类型循环完成后把数据长度存起来
                  }
                }
                getData.push({
                  lbid: v.lbid,
                  lbmc: v.lbmc,
                  xmmc: subV.xmmc,
                  jbmc: ss.jbmc
                })
              })
            }
          })
        }
      })

      // console.log(jbIndex)
      // [0, 5, 4]
      // 看一下打印出来的规律,除去第一项,5是第一次需要合并的行
      // 第二次合并又是从第五行开始合并4行

      // console.log(xmIndex)
      // [0, 2, 3, 2, 2]
      // 类型的数据存储规律也是一样,第一次合并2行
      // 第二次从2行开始,合并3行,以此类推

      // 根据这个规则,只需要给数据加上两个额外的属性控制是否合并就OK
      let k = 0
      let t = 0
      jbIndex.forEach((v, i, jbArr) => {
        if (jbArr[i + 1]) {
          getData[k].jbIndex = jbArr[i + 1]
          k += jbArr[i + 1]
        }
      })

      xmIndex.forEach((v, i, xmArr) => {
        if (xmArr[i + 1]) {
          getData[t].xmIndex = xmArr[i + 1]
          t += xmArr[i + 1]
        }
      })
      this.tableData = getData
      // console.log(getData)
      // 0: {id: 1, name: "器械1", nameIndex: 5, region: "中国", type: "器械", typeIndex: 2},
      // 1: {id: 1, name: "器械2", region: "中国", type: "器械"}
      // ....
      // 5: {id: 2, name: "器械1", nameIndex: 4, region: "美国", type: "器械", typeIndex: 2}
    },
    // 表格合并方法
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.jbIndex) { // 如果有值,说明需要合并
          return [row.jbIndex, 1]
        } else return [0, 0]
      }
      if (columnIndex === 1) {
        if (row.xmIndex) {
          return [row.xmIndex, 1]
        } else return [0, 0]
      }
    },
    updateData(row) {
      updateBlockup(row).then(response => {
        if (response.data.status === 'success') {
          this.$notify({
            title: '成功',
            message: '启用成功',
            type: 'success',
            offset: 100,
            duration: 2000
          })
        } else {
          this.$notify({
            title: '错误',
            message: '操作失败',
            type: 'error',
            offset: 100,
            duration: 2000
          })
        }
      })
    }

  }
}
</script>
