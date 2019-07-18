<template>
  <div class="app-container">
    <rowspan-table
      :head-data="theadData"
      :body-data="tbodyData"
      :noshow-field="noshowField"
      style="width: 100%; margin-top: 20px">
      <template slot="operate" slot-scope="props">
        <span>修改</span>
      </template>
    </rowspan-table>
  </div>
</template>

<script>
import { fetchAllList } from '@/api/lbzb'
import RowspanTable from '@/components/table/rowspanTable'

export default {
  name: 'Blockup',
  components: {
    RowspanTable
  },
  data() {
    return {
      theadData: ['类别名称', '项目名称', '级别名称', '分值'],
      tbodyData: [],
      noshowField: 'jbid'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const _this = this
      fetchAllList().then(response => {
        _this.tbodyData = response.data.items
        // this.getSpanArr(this.tableData)
      })
    }
  }
}
</script>
