<template>
  <div class="app-container" style="padding-left:8px;padding-right:8px;">

    <div class="filter-container" style="padding-top:10px;min-width:650px;">
      <el-button :disabled="sels.length < 1" :loading="passBtnLoading" class="filter-item" size="mini" style="margin-left: 10px;" type="primary" @click="handlePass">通过</el-button>
      <el-button :disabled="sels.length < 1" :loading="backBtnLoading" class="filter-item" size="mini" type="danger" @click="handleBack">退回</el-button>
      <el-form ref="filtersForm" :inline="true" :model="listQuery" style="float:right;width:640px;height:32px;">
        <el-form-item>
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
            size="mini"
            style="width:350px;"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.mc" placeholder="输入要搜索的名称" size="mini" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" size="mini" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      ref="dataTable"
      v-loading="listLoading"
      :data="clList"
      fit
      style="width: 100%;min-width:650px;"
      @selection-change="selsChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="35px" />
      <el-table-column label="名称" prop="id" align="left" min-width="200px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.mc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="获奖时间" sortable="custom" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hjsj | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="颁奖单位" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.bjdw }}</span>
        </template>
      </el-table-column>
      <el-table-column label="附件" width="220px" align="center">
        <template slot-scope="scope">
          <span v-for="item in scope.row.fj" :key="item.name">{{ item.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.classmc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教师" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.zz }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" sortable="custom" fixed="right" align="center" width="95px">
        <template slot-scope="scope">
          <span v-if="scope.row.zt.msg === ''"> {{ scope.row.zt.strtype }}</span>
          <el-tooltip v-else :content="scope.row.zt.msg" class="item" effect="dark" placement="top-start">
            <span> <i class="el-icon-info" /> {{ scope.row.zt.strtype }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" title="退回原因" style="">
      <el-form ref="dataForm" :rules="rules" :model="dialogItem" label-position="left" label-width="120px" style="width: 520px; margin-left:50px;">
        <el-form-item label="原因" prop="mc">
          <el-input v-model="dialogItem.msg" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="backCl()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { fetchClList, passCl, backCl } from '@/api/clsc'

import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ClshTable',
  components: {
    Pagination
  },
  directives: { waves },
  filters: { },
  data() {
    return {
      listLoading: true,
      total: 0,
      tableKey: 0,
      clList: null,
      passBtnLoading: false,
      backBtnLoading: false,
      // 选中的
      sels: [],
      listQuery: {
        classid: null,
        page: 1,
        limit: 20,
        mc: undefined,
        kssj: undefined,
        jssj: undefined,
        sort: '+id'
      },
      dialogFormVisible: false,
      dialogItem: {
        msg: null
      },
      // 验证规则
      rules: {
        msg: [{ required: true, message: '退回原因不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 列表
    this.getList()
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchClList(this.listQuery).then(response => {
        this.clList = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // 格式化状态
    formatZt: function(value) {
      return value.strtype
    },
    // 选取后操作
    selsChange(sels) {
      this.sels = sels
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handlePass() {
      const _this = this
      _this.$confirm('确定通过已选的记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.passBtnLoading = true
        passCl({ sels: this.sels }).then(response => {
          if (response.data.status === 'success') {
            // 重新获取一次得了。
            this.getList()
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            _this.$notify({
              title: '错误',
              message: '操作失败',
              type: 'error',
              offset: 100,
              duration: 2000
            })
          }
          _this.passBtnLoading = false
        })
      })
    },
    handleBack() {
      this.dialogFormVisible = true
    },
    backCl() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.backBtnLoading = false
          backCl(this.dialogItem).then(response => {
            if (response.data.status === 'success') {
              // 重新获取一次得了。
              this.getList()
              // 清空选择
              this.$refs.dataTable.clearSelection()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '操作成功',
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
            this.backBtnLoading = false
          })
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item{
  margin-bottom: 18px;
}
</style>

