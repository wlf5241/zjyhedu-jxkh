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
          :data="lbTree"
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
          <el-button :disabled="sendDataBtndisabled" :loading="sendDataBtnLoading" class="filter-item" size="mini" type="primary" @click="sendData">上报</el-button>
          <el-tooltip effect="dark" placement="top-start">
            <div slot="content">当有选取数据时，导出已选数据，否则导出当前页的所有数据</div>
            <el-button v-waves :loading="downloadLoading" size="mini" class="filter-item" type="primary" @click="handleDownload">导出</el-button>
          </el-tooltip>
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
          <el-table-column label="状态" align="center" width="95px">
            <template slot-scope="scope">
              <span v-if="scope.row.zt.msg === ''"> {{ scope.row.zt.strtype }}</span>
              <el-tooltip v-else :content="scope.row.zt.msg" class="item" effect="dark" placement="top-start">
                <span> <i class="el-icon-info" /> {{ scope.row.zt.strtype }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="top:-80px;">
          <el-form ref="dataForm" :rules="rules" :model="dialogItem" label-position="left" label-width="120px" style="width: 520px; margin-left:50px;">
            <el-form-item label="类    别" prop="classid">
              <tree-select
                :height="400"
                :width="220"
                :node-key="nodeKey"
                :checked-keys="defaultCheckedKeys"
                :data="lbTree"
                :default-props="defaultProps"
                clearable
                collapse-tags
                check-strictly
                size="small"
                @popoverHide="selectChange"
              />
            </el-form-item>
            <el-form-item label="材料名称" prop="mc">
              <el-input v-model="dialogItem.mc" />
            </el-form-item>
            <el-form-item label="获奖日期" prop="hjsj">
              <el-date-picker v-model="dialogItem.hjsj" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="date" placeholder="请选择获奖时间" />
            </el-form-item>
            <el-form-item label="颁奖单位" prop="bjdw">
              <el-input v-model="dialogItem.bjdw" />
            </el-form-item>
            <el-form-item label="作者" prop="zz">
              <el-input v-model="dialogItem.zz" />
            </el-form-item>
            <el-form-item v-if="lbdjtags.length > 0" label="获奖等级" prop="hjdj">
              <el-select v-model="dialogItem.hjdj" class="filter-item" placeholder="请选择等级">
                <el-option v-for="item in lbdjtags" :key="item.id" :label="item.mc" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="科   目" prop="km">
              <el-select v-model="dialogItem.km" class="filter-item" placeholder="请选择科目">
                <el-option v-for="item in kmList" :key="item.mc" :label="item.mc" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="备   注">
              <el-input v-model="dialogItem.bz" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="备注信息，选填" />
            </el-form-item>
            <el-form-item label="附   件">
              <el-upload
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :file-list="dialogItem.fj"
                multiple
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
              >
                <!--i class="el-icon-upload" />
                <div class="el-upload__text" style="line-height:22px;">将文件拖到此处，或<em>点击上传</em><br>上传格式：jpg,png,bmp,gif,zip,rar,doc,xls,ppt</div-->
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">上传格式：jpg,png,bmp,gif,zip,rar,doc,xls,ppt, 文件不超过50MB</div>
              </el-upload>
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
import { fetchAllClassByTree, fetchClassList } from '@/api/lbzb'
import { fetchClList, createCl, updateCl, getCl, delCl, sendCl } from '@/api/clsc'
import { fetchKmList } from '@/api/dict'

import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import TreeSelect from '@/components/TreeSelect'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ClTable',
  components: {
    Pagination,
    TreeSelect
  },
  directives: { waves },
  filters: { },
  data() {
    return {
      lbTree: [],
      // 所有类别
      lbAllList: null,
      defaultExpand: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      nodeKey: 'classid',
      // 选中默认值
      defaultCheckedKeys: [],
      // 树选中的ClassID
      treeClickClassID: 0,
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
      clList: null,
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
      downloadLoading: false,
      // 初始化数据
      selectTreeProps: {
        value: 'classid',
        label: 'label',
        children: 'children'
      },
      // 类别包含等级的个数
      lbdjtags: [],
      kmList: null,
      dialogItem: {
        classid: null,
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
        // 附件
        fj: undefined,
        // 上报时间
        sbsj: undefined,
        // 备注
        bz: undefined,
        // 更新时间
        gxsj: undefined,
        // 排序
        ordernum: undefined
      },
      // 验证规则
      rules: {
        classid: [{ required: true, message: '请选择类别', trigger: 'change' }],
        mc: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        hjsj: [{ required: true, message: '请选择获奖时间', trigger: 'blur' }],
        bjdw: [{ required: true, message: '颁奖单位不能为空', trigger: 'blur' }],
        zz: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
        hjdj: [{ required: true, message: '请选择获奖等级', trigger: 'change' }],
        km: [{ required: true, message: '请选择科目', trigger: 'change' }]
      }
    }
  },
  created() {
    // 类别树
    this.getLbTree()
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
            // 附件
            fj: undefined,
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
      const _this = this
      _this.lbAllList.forEach(item => {
        if (item.classid === Number(selectValue)) {
          _this.lbdjtags = item.djtags
          return false
        }
      })
      this.dialogItem.classid = selectValue
    },
    getLbTree() {
      const _this = this
      fetchAllClassByTree({}).then(response => {
        _this.lbTree = response.data.items
        // console.log(this.lbTree)
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
      // console.log(data)
      // 展开
      node.expanded = !node.expanded
      // 获取对应的列表
      this.listQuery.classid = data.classid
      // 设置窗体初始值
      // 先清空数据，再添加，原因为 defaultCheckedKeys 需要数组形式，不能改为string
      this.defaultCheckedKeys.pop()
      this.defaultCheckedKeys.unshift(data.classid)
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      const _this = this
      _this.listLoading = true
      fetchClList(this.listQuery).then(response => {
        _this.clList = response.data.items
        _this.total = response.data.total
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
    // 获取科目
    getKmList() {
      const _this = this
      if (!_this.kmList) {
        fetchKmList({}).then(response => {
          _this.kmList = response.data.items
        })
      }
    },
    // 获取所有类别
    getClassList() {
      const _this = this
      if (!_this.lbAllList) {
        fetchClassList({}).then(response => {
          _this.lbAllList = response.data.items
        })
      }
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.resetTemp('')
      this.defaultCheckedKeys.pop()
      this.defaultCheckedKeys.unshift(this.treeClickClassID)
      this.getClassList()
      this.getKmList()
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
      this.getClassList()
      this.getKmList()
      getCl({ id: _id }).then(response => {
        this.dialogItem = response.data.item
        this.defaultCheckedKeys.pop()
        this.defaultCheckedKeys.unshift(this.dialogItem.classid)
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
        delCl({ sels: _this.sels }).then(response => {
          if (response.data.status === 'success') {
            _this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            // 清除clList中的数据
            _this.sels.forEach(item => {
              _this.clList.splice(_this.clList.indexOf(item), 1)
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
    // 上报
    sendData() {
      const _this = this
      let disSend = 0
      _this.sels.forEach(item => {
        if (item.zt.type !== 0 && item.zt.type !== 2) {
          disSend++
        }
      })
      if (disSend > 0) {
        _this.$message.error('上报的记录只能选择未上报或是退回的记录')
        return false
      }
      _this.sendDataBtnLoading = true
      sendCl({ sels: _this.sels }).then(response => {
        if (response.data.status === 'success') {
          _this.$notify({
            title: '成功',
            message: '上报成功',
            type: 'success',
            offset: 100,
            duration: 2000
          })
          // 更新状态
          _this.sels.forEach(item => {
            _this.clList[_this.clList.indexOf(item)].zt = {
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
          createCl(this.dialogItem).then(response => {
            if (response.data.status === 'success') {
              this.dialogFormVisible = false
              // 直接更新list即可
              this.clList.push(response.data.item)
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
          updateCl(this.dialogItem).then(response => {
            if (response.data.status === 'success') {
              this.dialogFormVisible = false
              // 更新 clList
              for (const data of this.clList) {
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
    // --------------上传-------------------------
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    handlePreview(file) {
      // console.log(file)
    },
    beforeRemove(file, fileList) {
      this.$confirm(` 确定移除 ${file.name} `, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(file)
      })
    },
    // --------------上传end----------------------
    handleDownload() {
      this.downloadLoading = true
      // 有选取时，导出选取的数据，无选取时，导出当前页
      const downList = this.sels.length < 1 ? this.clList : this.sels
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

