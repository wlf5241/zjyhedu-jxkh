<template>
  <div class="app-container">
    <!--el-table :data="tableData" border fit style="width: 100%">
      <el-table-column prop label="类别名称" width="200"/>
      <el-table-column prop label="项目名称" width="200"/>
      <el-table-column prop label="级别名称" width="200"/>
      <el-table-column prop label="分值" width="200"/>
      <el-table-column prop label="操作" width="200"/>
    </el-table>
        <el-table :data="tableData" :span-method="objectSpanMethod" class="ems-table borderstyle" style="width: 100%;">
      <el-table-column prop="lbmc" label="类别名称" width="200"/>
      <el-table-column prop="xmmc" label="项目名称" width="200"/>
      <el-table-column prop="jbmc" label="级别名称" width="200"/>
      <el-table-column prop="fz" label="分值" width="200"/>
      <el-table-column label="操作" width="200"/>
       @multipleData="multipleData" @editData="editData"
    </el-table-->

    <split-table :head-data="headData" :body-data="bodyData">
      <template slot="operate" slot-scope="props">
        <span>修改</span>
        <span>新增</span>
        <span>删除</span>
      </template>
    </split-table>

  </div>
</template>

<script>
import { fetchAllList } from '@/api/lbzb'
import SplitTable from '@/components/table/splitTable'

// import SplitTable from 'vue-split-table'

export default {
  components: {
    SplitTable
  },

  data() {
    return {
      headData: ['类别名称', '项目名称', '级别名称', '分值'],
      bodyData: [],
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
        this.bodyData = response.data.items
      // this.getSpanArr(this.tableData)
      })
    }
  }
}
</script>
