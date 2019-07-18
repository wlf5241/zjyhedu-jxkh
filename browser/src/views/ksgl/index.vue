<template>
  <div class="app-container" style="padding-left:8px;padding-right:8px;">
    <el-row style="height:100%;min-heigth:300px;border:1px solid #eee;">
      <el-col :span="4">
        <div class="tree-top">
          <div class="left" style="cursor:pointer" @click="showAllClass"><svg-icon icon-class="list" /> 全部</div>
          <div class="right">
            <span v-if="defaultExpand">全部展开</span>
            <span v-else>默认</span>
            <el-switch v-model="defaultExpand" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#eeeeee" @change="setSwitchKeys" />
          </div>
        </div>
        <el-tree
          ref="tree"
          :data="xxnjTree"
          :props="defaultProps"
          :expand-on-click-node="false"
          :default-expand-all="defaultExpand"
          node-key="id"
          highlight-current
          @node-click="treeClick"
        />
      </el-col>

      <el-col :span="20" style="border-left:2px solid #eee">
        <div class="filter-container" style="padding-top:10px;min-width:650px;">
          <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="primary" @click="handleCreate">新增</el-button>
          <el-button :disabled="sels.length!==1" class="filter-item" size="mini" type="primary" @click="handleUpdate">编辑</el-button>
          <el-button :disabled="sels.length===0" class="filter-item" size="mini" type="primary" @click="handleDelete">删除</el-button>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">当有选取数据时，导出已选数据，否则导出当前页的所有数据</div>
            <el-button v-waves :loading="downloadLoading" size="mini" class="filter-item" type="primary" @click="handleDownload">导出</el-button>
          </el-tooltip>
          <el-form ref="filtersForm" :inline="true" :model="listQuery" style="float:right;height:32px;">
            <el-form-item>
              <el-input v-model="listQuery.xm" class="filter-item" placeholder="输入要搜索的学生姓名" size="mini" style="width: 160px;line-height:30px;" @keyup.enter.native="handleFilter" />
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
          :data="ksList"
          fit
          style="width: 100%;"
          @selection-change="selsChange"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="35" />
          <el-table-column label="班级" sortable="custom" align="left" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.bjmc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="班级编号" sortable="custom" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.bjbh }}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" sortable="custom" width="150" align="center">
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.xm }}</span>
            </template>
          </el-table-column>
          <el-table-column label="证件编号" width="220" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.zjbh }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" width="60">
            <template slot-scope="scope">
              <span>{{ scope.row.xb }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="{row}">
              <el-tag :type="reduceXszt[row.zt].tag">
                {{ reduceXszt[row.zt].mc }}
              </el-tag>
            </template>
            <!-- <template slot-scope="scope">
              <span v-if="scope.row.zt.msg === ''"> {{ scope.row.zt.strtype }}</span>
              <el-tooltip v-else :content="scope.row.zt.msg" class="item" effect="dark" placement="top-start">
                <span> <i class="el-icon-info" /> {{ scope.row.zt.strtype }}</span>
              </el-tooltip>
            </template> -->
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="top:-80px;">
          <el-form ref="dataForm" :rules="rules" :model="dialogItem" label-position="left" label-width="120px" style="width: 520px; margin-left:50px;">
            <el-form-item label="所属班级" prop="classid">
              <tree-select
                :height="400"
                :width="220"
                :node-key="nodeKey"
                :checked-keys="defaultCheckedKeys"
                :data="xxnjTree"
                :default-props="defaultProps"
                clearable
                collapse-tags
                check-strictly
                size="small"
                @popoverHide="selectChange"
              />
            </el-form-item>
            <el-form-item label="姓名" prop="xm">
              <el-input v-model="dialogItem.xm" />
            </el-form-item>
            <el-form-item label="性别" prop="xb">
              <el-radio-group v-model="dialogItem.xb" size="small">
                <el-radio-button label="男" />
                <el-radio-button label="女" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件编号" prop="zjbh">
              <el-input v-model="dialogItem.zjbh" />
            </el-form-item>
            <el-form-item label="学籍辅号" prop="xjfh">
              <el-input v-model="dialogItem.xjfh" />
            </el-form-item>
            <el-form-item label="状态" prop="zt">
              <el-radio-group v-model="dialogItem.zt" size="small">
                <el-radio-button v-for="item in xsztList" :key="item.id" :label="item.mc" />
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchAllXxnjByTree, fetchXxnjList } from '@/api/xxgl'
import { fetchKsList, createKs, updateKs, getKs, delKs, setKs } from '@/api/ksgl'
import { fetchXsztList } from '@/api/dict'

import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import TreeSelect from '@/components/TreeSelect'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

// import { arrayToString } from '@/utils'

export default {
  name: 'KsTable',
  components: {
    Pagination,
    TreeSelect
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      xxnjTree: [],
      // 学生状态
      xsztList: [],
      reduceXszt: [],
      // 所有类别
      xxnjAllList: null,
      defaultExpand: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      nodeKey: 'bjid',
      // 选中默认值
      defaultCheckedKeys: [],
      // 树选中的bjID
      treeClickBjID: 0,
      // 状态
      textMap: {
        update: '编辑材料',
        create: '新增材料'
      },
      // 上报按钮
      sendDataBtnLoading: false,
      sendDataBtndisabled: true,
      dialogStatus: '',
      listLoading: true,
      tableKey: 0,
      total: 0,
      ksList: null,
      // 选中的
      sels: [],
      listQuery: {
        xxid: null,
        njbh: null,
        bjbh: null,
        page: 1,
        limit: 30,
        xm: undefined,
        sort: '+id'
      },
      dialogFormVisible: false,
      downloadLoading: false,
      // 初始化数据
      selectTreeProps: {
        value: 'classid',
        label: 'label',
        children: 'children'
      },
      dialogItem: {
        // 学校ID
        xxid: null,
        // 班级ID
        bjid: null,
        // 班级编号
        bjbh: null,
        // 姓名
        xm: undefined,
        // 性别
        xb: undefined,
        // 证件编号
        zjbh: undefined,
        // 学籍辅号
        xjfh: undefined,
        // 状态
        zt: undefined,
        // 备注
        bz: undefined,
        // 更新时间
        gxsj: undefined,
        // 排序
        ordernum: undefined
      },
      // 验证规则
      rules: {
        bjid: [{ required: true, message: '请选择班级', trigger: 'change' }],
        xm: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        xb: [{ required: true, message: '请选性别', trigger: 'blur' }],
        zjbh: [{ required: true, message: '证件编号不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 类别树
    this.getXxnjTree()
    // 学生状态
    this.getXsztList()
    // 列表
    this.getList()
    // console.log(this.$store.state.lbzb.lbzbAllList)
  },
  methods: {
    // 清空弹窗默认数据
    resetTemp(dialog) {
      switch (dialog) {
        default:
          this.dialogItem = {
            classid: undefined,
            // 标题
            mc: undefined,
            // 获奖时间
            hjsj: undefined,
            // 获奖等级
            hjdj: undefined,
            // 颁奖单位
            bjdw: undefined,
            // 科目
            km: undefined,
            // 状态
            zt: undefined,
            // 作者
            zz: undefined,
            // 上报时间
            sbsj: undefined,
            // 备注
            bz: undefined,
            // 更新时间
            gxsj: undefined,
            // 排序
            ordernum: undefined
          }
      }
    },
    /** select tree 改变时，遍历tree查看是否包含等级 djtags
     * selectValue 返回选中的值，具体查看 selectTree组件
     */
    selectChange(selectValue, selectData) {
      this.dialogItem.classid = selectValue
    },
    getXxnjTree() {
      const _this = this
      fetchAllXxnjByTree({}).then(response => {
        // console.log(response.items)
        _this.xxnjTree = response.items
      })
    },
    // 学生状态
    getXsztList() {
      const _this = this
      fetchXsztList({}).then(response => {
        // console.log(response.items)
        _this.xsztList = response.items
        // arr to obj, such as { CN : "China", US : "USA" }
        _this.reduceXszt = _this.xsztList.reduce((acc, cur) => {
          acc[cur.id] = {
            mc: cur.mc,
            tag: cur.tag
          }
          return acc
        }, {})
      })
    },
    // 展开/关闭节点
    setSwitchKeys() {
      // console.log(this.$refs.tree)
      // 通过找tree的所有属性和方法找到
      // this.$refs.tree.$children
      // 要设置root下的childNodes，设置$children下的，会有怪异的问题
      this.$refs.tree.root.childNodes.forEach((key, index) => {
        // console.log(this.defaultExpand)
        key.expanded = this.defaultExpand
      })
    },
    treeClick(data, checked, node) {
      // 展开
      node.expanded = !node.expanded
      // 获取对应的学校
      this.listQuery.xxid = data.xxid
      // 获取对应的年级
      this.listQuery.njbh = data.njbh
      // 获取对应的班级
      this.listQuery.bjbh = data.bjbh
      // 获取对应的班级ID
      this.listQuery.bjid = data.bjid
      // 设置窗体初始值
      // 先清空数据，再添加，原因为 defaultCheckedKeys 需要数组形式，不能改为string
      this.defaultCheckedKeys.pop()
      this.defaultCheckedKeys.unshift(data.bjid)
      console.log(this.defaultCheckedKeys)
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      const _this = this
      _this.listLoading = true
      fetchKsList(this.listQuery).then(response => {
        _this.ksList = response.items
        _this.total = response.total
        _this.listLoading = false
      })
    },
    // 类别全部按钮
    showAllClass() {
      this.listQuery.classid = null
      this.getList()
    },
    // 格式化状态
    formatZt: function(value) {
      return value.strtype
    },
    // 选取后操作
    selsChange(sels) {
      this.sels = sels
      // 上报按钮
      this.sendDataBtndisabled = this.sels.length < 1
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
    // 获取所有类别
    getXxnjList() {
      const _this = this
      if (!_this.xxnjAllList) {
        fetchXxnjList({}).then(response => {
          _this.xxnjAllList = response.items
        })
      }
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.resetTemp('')
      this.defaultCheckedKeys.pop()
      this.defaultCheckedKeys.unshift(this.treeClickClassID)
      this.getXxnjList()
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      if (this.sels.length > 1) {
        this.$message.error('只能选择一条进行编辑！')
        return
      }
      if (!row && this.sels.length < 1) {
        this.$message.error('请选择一条数据进行编辑！')
        return
      }
      const _id = typeof (row.id) !== 'undefined' ? row.id : this.sels[0].id
      this.getXxnjList()
      getKs({ id: _id }).then(response => {
        this.dialogItem = response.item
        this.defaultCheckedKeys.pop()
        this.defaultCheckedKeys.unshift(this.dialogItem.bjid)
        this.dialogFormVisible = true
      })
    },
    handleDelete() {
      const _this = this
      if (_this.sels.length < 1) {
        _this.$message.error('至少选择一条进行删除！')
        return
      }
      _this.$confirm('此操作将永久删除记录，是否还要继续永久删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delKs({ sels: _this.sels }).then(response => {
          if (response.code === 20000) {
            _this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            // 清除ksList中的数据
            _this.sels.forEach(item => {
              _this.ksList.splice(_this.ksList.indexOf(item), 1)
            })
            _this.total -= _this.sels.length
          } else {
            _this.$notify({
              title: '错误',
              message: '删除失败',
              type: 'error',
              offset: 100,
              duration: 2000
            })
          }
        })
      })
    },
    // 设置考生状态
    setKs() {
      const _this = this
      let disSet = 0
      _this.sels.forEach(item => {
        if (item.zt.type !== 0 && item.zt.type !== 2) {
          disSet++
        }
      })
      if (disSet > 0) {
        _this.$message.error('上报的记录只能选择未上报或是退回的记录')
        return false
      }
      _this.sendDataBtnLoading = true
      setKs({ sels: _this.sels }).then(response => {
        if (response.code === 20000) {
          _this.$notify({
            title: '成功',
            message: '上报成功',
            type: 'success',
            offset: 100,
            duration: 2000
          })
          // 更新状态
          _this.sels.forEach(item => {
            _this.ksList[_this.ksList.indexOf(item)].zt = {
              type: 1,
              strtype: '已上报',
              msg: ''
            }
          })
          // 清空选择
          this.$refs.dataTable.clearSelection()
        } else {
          _this.$notify({
            title: '错误',
            message: '上报失败',
            type: 'error',
            offset: 100,
            duration: 2000
          })
        }
        _this.sendDataBtnLoading = false
      }).catch(() => {
        console.log('网络连接错误')
      })
    },
    // 添加数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.dialogItem)
          createKs(this.dialogItem).then(response => {
            if (response.code === 20000) {
              this.dialogFormVisible = false
              // 直接更新list即可
              this.ksList.push(response.items)
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                offset: 100,
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: '新增失败',
                type: 'error',
                offset: 100,
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 更新数据
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateKs(this.dialogItem).then(response => {
            if (response.code === 20000) {
              this.dialogFormVisible = false
              // 更新 ksList
              for (const data of this.ksList) {
                if (data.id === this.dialogItem.id) {
                  for (const key in this.dialogItem) {
                    data[key] = this.dialogItem[key]
                  }
                  break
                }
              }
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                offset: 100,
                duration: 2000
              })
              // 清空选择
              this.$refs.dataTable.clearSelection()
            } else {
              this.$notify({
                title: '错误',
                message: '更新失败',
                type: 'error',
                offset: 100,
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDownload() {
      this.downloadLoading = true
      // 有选取时，导出选取的数据，无选取时，导出当前页
      const downList = this.sels.length < 1 ? this.ksList : this.sels
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['名称', '作者', '获奖时间', '颁奖单位', '项目', '状态']
        const filterVal = ['mc', 'zz', 'hjsj', 'bjdw', 'classmc', 'zt']
        const data = this.formatJson(filterVal, downList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '材料上报导出'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        // 获奖时间
        if (j === 'hjsj') {
          return parseTime(v[j])
        // 状态
        } else if (j === 'zt') {
          return v[j].strtype + (v[j].type === 2 ? ':' + v[j].msg : '')
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.tree-top{
  width:100%;
  height:35px;
  position: relative;
  padding: 15px 8px;
  font-size:14px;
  color:#999;
  margin-bottom: 8px;

  .left{
    float:left;
  }
  .right{
    float:right;
    text-align: right;
  }
}
.el-form-item{
  margin-bottom: 18px;
}
</style>

