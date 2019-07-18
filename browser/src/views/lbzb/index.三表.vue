<template>

  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate('', 'dataFormLb')">{{ $t('lbzb.add') }}{{ $t('lbzb.title') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDelete(clickLbRow,'lb')">{{ $t('lbzb.delete') }}{{ $t('lbzb.title') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="lbList"
      :cell-style="tableCellStyle"
      :header-cell-style="tableHeardStyle"
      border
      fit
      highlight-current-row
      style="width:410px;float:left;"
      @row-click="getXmList"
    >
      <el-table-column :label="$t('lbzb.lbmc')" prop="lbmc" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lbmc }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.fz')" prop="fz" align="center" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.fz }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.qz')" prop="qz" align="center" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.qz }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.order')" prop="order" align="center" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.order }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.actions')" align="center" width="140">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreate(scope.row, 'dataFormXm')">{{ $t('lbzb.addsubclass') }}</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row, 'dataFormLb')">{{ $t('lbzb.edit') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="12" width="40" style="top:180px;height:100%;float:left;">
      <el-col :span="8">
        <i v-if="clickLbRow!=''" class="el-icon-d-arrow-right"/>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      v-show="xmTableVisible"
      :data="xmList"
      :visible.sync="xmTableVisible"
      border
      fit
      highlight-current-row
      style="width:380px;float:left;"
      @row-click="getJbList"
    >
      <el-table-column :label="$t('lbzb.xmmc')" prop="xmmc" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.xmmc }} ({{ scope.row.id }})</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.fz')" prop="fz" align="center" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.fz }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.order')" prop="order" align="center" width="55">
        <template slot-scope="scope">
          <span>{{ scope.row.order }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.actions')" align="center" width="185">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreate(scope.row, 'dataFormJb')">{{ $t('lbzb.addsubclass') }}</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row, 'dataFormXm')">{{ $t('lbzb.edit') }}</el-button>
          <el-button type="primary" size="mini" @click="handleDelete(scope.row, 'xm')">{{ $t('lbzb.delete') }}</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-row :gutter="12" width="40" style="top:180px;height:100%;float:left;">
      <el-col :span="8">
        <i v-if="clickXmRow!=''" class="el-icon-d-arrow-right"/>
      </el-col>
    </el-row>

    <el-table
      v-loading="listLoading"
      v-show="jbTableVisible"
      :data="jbList"
      :visible.sync="jbTableVisible"
      border
      fit
      highlight-current-row
      style="width:425px;float:left;"
    >
      <el-table-column :label="$t('lbzb.jbmc')" prop="jbmc" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jbmc }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.fz')" prop="fz" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.fz }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.dj')" prop="dj" show-overflow-tooltip align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.dj==0"/>
          <span v-else>
            <span v-for="(item,index) in scope.row.djtags" :key="item.djmc">
              {{ item.djmc }}
              <i v-if="index < scope.row.djtags.length-1">,</i>
            </span>
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.order')" prop="order" align="center" width="50">
        <template slot-scope="scope">
          <span>{{ scope.row.order }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('lbzb.actions')" align="center" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row, 'dataFormJb')">{{ $t('lbzb.edit') }}</el-button>
          <el-button type="primary" size="mini" @click="handleDelete(scope.row, 'jb')">{{ $t('lbzb.delete') }}</el-button>
          <!--el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button-->
        </template>
      </el-table-column>

    </el-table>

    <el-dialog :title="textLbMap[dialogStatus]" :visible.sync="dialogLbFormVisible" width="300">
      <el-form ref="dataFormLb" :rules="rulesLb" :model="dialogLbItem" label-position="left" label-width="80px" style="width: 300px; margin-left:50px;">
        <el-form-item label="类别名称" prop="lbmc">
          <el-input v-model="dialogLbItem.lbmc" clearable width="150" placeholder="请输入类别名称"/>
        </el-form-item>
        <el-form-item label="分值" prop="fz">
          <el-input v-model.number="dialogLbItem.fz" clearable width="150" placeholder="请输入数字"/>
        </el-form-item>
        <el-form-item label="权重" prop="qz">
          <el-input v-model.number="dialogLbItem.qz" clearable width="150" placeholder="请输入数字"/>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input v-model.number="dialogLbItem.order" clearable width="150" placeholder="请输入数字"/>
        </el-form-item>
        <el-form-item label="停用" prop="ty">
          <el-switch v-model="dialogLbItem.ty" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#eeeeee"/>
        </el-form-item>
        <!--el-form-item :label="类别名称" prop="type">
          <el-select v-model="dialogItem.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="dialogItem.timestamp" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="dialogItem.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="dialogItem.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="dialogItem.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="dialogItem.remark" type="textarea" placeholder="Please input"/>
        </el-form-item-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLbFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createLbData():updateLbData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textXmMap[dialogStatus]" :visible.sync="dialogXmFormVisible" width="300">
      <el-form ref="dataFormXm" :rules="rulesXm" :model="dialogXmItem" label-position="left" label-width="80px" style="width: 300px; margin-left:50px;">
        <el-form-item label="项目名称" prop="xmmc">
          <el-input v-model="dialogXmItem.xmmc" clearable placeholder="请输入项目名称"/>
        </el-form-item>
        <el-form-item label="分值" prop="fz">
          <el-input v-model.number="dialogXmItem.fz" clearable placeholder="请输入数字"/>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input v-model.number="dialogXmItem.order" clearable placeholder="请输入数字"/>
        </el-form-item>
        <el-form-item label="停用" prop="ty">
          <el-switch v-model="dialogXmItem.ty" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#eeeeee"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogXmFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createXmData():updateXmData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textJbMap[dialogStatus]" :visible.sync="dialogJbFormVisible">
      <el-dialog :title="textDjMap[dialogDjStatus]" :visible.sync="dialogDjFormVisible" append-to-body>
        <el-form ref="dataFormDj" :rules="rulesDj" :model="dialogDjItem" label-position="left" label-width="90px" style="width: 300px; margin-left:50px;">
          <el-form-item label="名称" prop="djmc">
            <el-input v-model="dialogDjItem.djmc" clearable placeholder="名称"/>
          </el-form-item>
          <el-form-item label="分值" prop="fz">
            <el-input v-model.number="dialogDjItem.fz" clearable placeholder="请输入数字"/>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input v-model.number="dialogDjItem.order" clearable placeholder="请输入数字"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDjFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogDjStatus==='create'?createDjData():updateDjData()">确 认</el-button>
        </div>
      </el-dialog>
      <el-form ref="dataFormJb" :rules="rulesJb" :model="dialogJbItem" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;">
        <el-form-item label="级别名称" prop="jbmc">
          <el-input v-model="dialogJbItem.jbmc" clearable placeholder="请输入级别名称"/>
        </el-form-item>
        <el-form-item label="是否分等级" prop="dj">
          <el-switch v-model="dialogJbItem.dj" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#eeeeee"/>
          <span v-if="dialogJbItem.dj == 1">分等级后，分值将变为以各等级分值之和</span>
        </el-form-item>
        <el-form-item v-if="dialogJbItem.dj == 0" label="分值" prop="fz">
          <el-input v-model.number="dialogJbItem.fz" clearable placeholder="请输入数字"/>
        </el-form-item>
        <el-form-item v-else-if="dialogJbItem.dj == 1" prop="djtags">
          <div class="djtags">
            <el-tag v-for="item in dialogJbItem.djtags" :key="item.id" :disable-transitions="false" closable @close="handleDjClose(item)">{{ item.djmc }}</el-tag>
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" size="small" @click="handleCreate('','dataFormDj')">新增</el-button>
          </div>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input v-model.number="dialogJbItem.order" clearable placeholder="请输入数字"/>
        </el-form-item>
        <el-form-item label="停用" prop="ty">
          <el-switch v-model.number="dialogJbItem.ty" active-value="1" inactive-value="0" active-color="#13ce66" inactive-color="#eeeeee"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogJbFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createJbData():updateJbData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
// , , ,
import { fetchLbList, fetchXmList, fetchJbList, createLb, updateLb, getLb, delLb, createXm, updateXm, getXm, delXm, createJb, updateJb, delJb, getJb } from '@/api/lbzb'
// import tagsInput from './tagsInput'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'LbzbTable',
  components: {
    Pagination
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
    },
    typeFilter(type) {
      // return calendarTypeKeyValue[type]
    }
  },
  props: {

  },
  data() {
    return {
      lbList: null,
      xmList: null,
      jbList: null,
      total: 0,
      listLoading: false,
      lbListQuery: {
        // page: 1,
        // limit: 20,
        lbmc: undefined
        // sort: '+id'
      },
      xmListQuery: {
        // page: 1,
        // limit: 20,
        lbid: undefined,
        xmmc: undefined
        // sort: '+id'
      },
      jbListQuery: {
        // page: 1,
        // limit: 20,
        jbmc: undefined,
        xmid: undefined
        // sort: '+id'
      },
      xmTableVisible: false,
      jbTableVisible: false,
      downloadLoading: false,
      clickLbRow: '',
      clickXmRow: '',
      // 状态
      textLbMap: {
        update: '编辑类别',
        create: '新增类别'
      },
      textXmMap: {
        update: '编辑项目',
        create: '新增项目'
      },
      textJbMap: {
        update: '编辑级别',
        create: '新增级别'
      },
      textDjMap: {
        update: '编辑等级',
        create: '新增等级'
      },
      // 初始化数据
      dialogLbItem: {
        id: null,
        lbmc: undefined,
        qz: undefined,
        order: undefined,
        fz: undefined,
        ty: undefined
      },
      dialogXmItem: {
        id: null,
        lbid: undefined,
        xmmc: undefined,
        order: undefined,
        fz: undefined,
        ty: undefined
      },
      dialogJbItem: {
        id: null,
        xmid: undefined,
        jbmc: undefined,
        order: undefined,
        fz: undefined,
        ty: undefined,
        dj: null,
        djtags: []
      },
      dialogDjItem: {
        id: undefined,
        djmc: undefined,
        order: undefined,
        fz: undefined
      },
      // 弹窗显示tag
      dialogLbFormVisible: false,
      dialogXmFormVisible: false,
      dialogJbFormVisible: false,
      dialogDjFormVisible: false,
      dialogStatus: '',
      dialogDjStatus: '',
      // 验证规则
      rulesLb: {
        lbmc: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        fz: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }],
        qz: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }],
        order: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }]
      },
      rulesXm: {
        xmmc: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        fz: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }],
        order: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }]
      },
      rulesJb: {
        jbmc: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        fz: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }],
        order: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }]
      },
      rulesDj: {
        djmc: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        fz: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }],
        order: [{ type: 'number', required: true, message: '请输入数字', trigger: 'change' }]
      },
      tbodyData: null
    }
  },
  computed: {

  },
  mounted() {
    // this.setSort()
  },
  created() {
    this.getLbList()
    this.getList()
  },
  updated: function() {

  },
  methods: {
    getList() {
      const _this = this
      fetchLbList(this.lbListQuery).then(response => {
        _this.tbodyData = response.data.items
        // this.getSpanArr(this.tableData)
      })
    },
    // 新增操作 - 弹窗
    handleCreate(row, formName) {
      switch (formName) {
        case 'dataFormXm':
          this.dialogStatus = 'create'
          this.resetTemp('xm')
          this.dialogXmItem.lbid = row.id
          this.dialogXmFormVisible = true
          break
        case 'dataFormJb':
          this.dialogStatus = 'create'
          this.resetTemp('jb')
          this.dialogJbItem.xmid = row.id
          this.dialogJbFormVisible = true
          break
        case 'dataFormDj':
          // 添加等级时，不改变其它窗口状态
          this.resetTemp('dj')
          this.dialogDjStatus = 'create'
          this.dialogDjFormVisible = true
          break
        default:
          this.dialogStatus = 'create'
          this.resetTemp('lb')
          this.dialogLbFormVisible = true
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    // 编辑 - 弹窗
    handleUpdate(row, formName) {
      this.dialogStatus = 'update'
      switch (formName) {
        case 'dataFormLb':
          this.resetTemp('lb')
          getLb({ id: row.id }).then(response => {
            this.dialogLbItem = response.data.item
          })
          this.dialogLbFormVisible = true
          break
        case 'dataFormXm':
          this.resetTemp('xm')
          getXm({ id: row.id }).then(response => {
            this.dialogXmItem = response.data.item
          })
          this.dialogXmFormVisible = true
          break
        case 'dataFormJb':
          this.resetTemp('jb')
          // 新增，但未
          if (row.id !== null || typeof (row) !== 'undefined') {
            getJb({ id: row.id }).then(response => {
              if (response.data.status === 'success') {
                for (const key in this.dialogJbItem) {
                  this.dialogJbItem[key] = response.data.item[key]
                }
              }
            })
          }
          this.dialogJbFormVisible = true
          break
        // 由于el-tag无click事件，无法进行update操作
        case 'dataFormDj':
          // this.resetTemp('dj') 更新无需清空
          this.dialogDjFormVisible = true
          this.dialogDjStatus = 'update'
          this.dialogDjItem = row
          // console.log(item)
          break
      }
      this.$nextTick(() => {
        this.$refs[formName].clearValidate()
      })
    },
    handleDelete(row, tableName) {
      this.$confirm('此操作将永久删除记录，如果暂时不使用，可以停用该类别, 是否还要继续永久删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        switch (tableName) {
          case 'lb':
            delLb(row).then(response => {
              if (response.data.status === 'success') {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                this.lbList.splice(this.lbList.indexOf(row), 1)
              } else {
                this.$notify({
                  title: '错误',
                  message: '创建失败',
                  type: 'error',
                  offset: 100,
                  duration: 2000
                })
              }
            })
            break
          case 'xm':
            delXm(row).then(response => {
              if (response.data.status === 'success') {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                this.xmList.splice(this.xmList.indexOf(row), 1)
              } else {
                this.$notify({
                  title: '错误',
                  message: '创建失败',
                  type: 'error',
                  offset: 100,
                  duration: 2000
                })
              }
            })
            break
          case 'jb':
            delJb(row).then(response => {
              if (response.data.status === 'success') {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                this.jbList.splice(this.jbList.indexOf(row), 1)
              } else {
                this.$notify({
                  title: '错误',
                  message: '创建失败',
                  type: 'error',
                  offset: 100,
                  duration: 2000
                })
              }
            })
            break
        }
      }).catch(() => {

      })
    },
    // 增加类别
    createLbData() {
      this.$refs['dataFormLb'].validate((valid) => {
        if (valid) {
          createLb(this.dialogLbItem).then(response => {
            if (response.data.status === 'success') {
              this.dialogLbFormVisible = false
              // 直接更新list即可
              this.lbList.push(response.data.item)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                offset: 100,
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: '创建失败',
                type: 'error',
                offset: 100,
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 编辑类别
    updateLbData() {
      this.$refs['dataFormLb'].validate((valid) => {
        if (valid) {
          updateLb(this.dialogLbItem).then(response => {
            if (response.data.status === 'success') {
              this.dialogLbFormVisible = false
              // 更新lbList
              for (const data of this.lbList) {
                if (data.id === this.dialogLbItem.id) {
                  for (const key in this.dialogLbItem) {
                    data[key] = this.dialogLbItem[key]
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
    // 增加项目
    createXmData() {
      this.$refs['dataFormXm'].validate((valid) => {
        if (valid) {
          createXm(this.dialogXmItem).then(response => {
            if (response.data.status === 'success') {
              this.dialogXmFormVisible = false
              // 直接更新list即可
              this.xmList.push(response.data.item)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                offset: 100,
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: '创建失败',
                type: 'error',
                offset: 100,
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 编辑项目
    updateXmData() {
      this.$refs['dataFormXm'].validate((valid) => {
        if (valid) {
          updateXm(this.dialogXmItem).then(response => {
            if (response.data.status === 'success') {
              this.dialogXmFormVisible = false
              // 更新XmList
              for (const data of this.xmList) {
                if (data.id === this.dialogXmItem.id) {
                  for (const key in this.dialogXmItem) {
                    data[key] = this.dialogXmItem[key]
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
    // 增加级别
    createJbData() {
      this.$refs['dataFormJb'].validate((valid) => {
        if (valid) {
          createJb(this.dialogJbItem).then(response => {
            if (response.data.status === 'success') {
              this.dialogJbFormVisible = false
              // 直接更新list即可
              this.jbList.push(response.data.item)
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                offset: 100,
                duration: 2000
              })
            } else {
              this.$notify({
                title: '错误',
                message: '创建失败',
                type: 'error',
                offset: 100,
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 编辑级别
    updateJbData() {
      // console.log('update')
      this.$refs['dataFormJb'].validate((valid) => {
        if (valid) {
          updateJb(this.dialogJbItem).then(response => {
            console.log(response.data)
            if (response.data.status === 'success') {
              this.dialogJbFormVisible = false
              // 更新JbList
              for (const data of this.jbList) {
                if (data.id === this.dialogJbItem.id) {
                  for (const key in this.dialogJbItem) {
                    data[key] = this.dialogJbItem[key]
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
    // 等级标签操作
    handleDjClose(tag) {
      this.dialogJbItem.djtags.splice(this.dialogJbItem.djtags.indexOf(tag), 1)
      // 减项目分值
      this.dialogJbItem.fz = Number(this.dialogJbItem.fz) - Number(tag.fz)
      this.dialogJbItem.fz = this.dialogJbItem.fz < 0 ? 0 : this.dialogJbItem.fz
    },
    createDjData() {
      this.$refs['dataFormDj'].validate((valid) => {
        if (valid) {
          // 改为分等级后，将fz设为0
          if (this.dialogJbItem.djtags.length < 1) { this.dialogJbItem.fz = 0 }
          // 增加记录
          this.dialogJbItem.djtags.push({
            id: null,
            djmc: this.dialogDjItem.djmc,
            fz: this.dialogDjItem.fz,
            order: this.dialogDjItem.order
          })
          // 统计对应级别分值
          this.dialogJbItem.fz = (typeof (this.dialogJbItem.fz) === 'undefined' ? 0 : Number(this.dialogJbItem.fz)) + Number(this.dialogDjItem.fz)
          this.dialogDjFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            offset: 100,
            duration: 2000
          })
        }
      })
    },
    updateDjData() {

    },
    // 单独设置某列的样式
    tableCellStyle({ row, column, rowIndex, columnIndex }) {
      /*
      if (columnIndex === 5) {
        return 'border:0px'
      } else {
        return ''
      }
      */
    },
    // 设置表格头部的样式
    tableHeardStyle({ row, column, rowIndex, columnIndex }) {
      /*
      if (columnIndex === 5) {
        return 'border:0px'
      } else {
        return ''
      }
      */
    },
    scrollToBottom: function() {
      this.$nextTick(() => {
        // var container = this.$refs['myScrollbar'].wrap
        // container.scrollTop = container.scrollHeight
      })
    },
    // 清空弹窗默认数据
    resetTemp(dialog) {
      switch (dialog) {
        case 'lb':
          this.DialogLbItem = {
            id: null,
            lbmc: undefined,
            qz: undefined,
            order: undefined,
            fz: undefined,
            ty: undefined
          }
          break
        case 'xm':
          this.DialogXmItem = {
            id: null,
            lbid: undefined,
            xmmc: undefined,
            order: undefined,
            fz: undefined,
            ty: undefined
          }
          break
        case 'jb':
          this.DialogJbItem = {
            id: null,
            xmid: undefined,
            jbmc: undefined,
            order: undefined,
            fz: undefined,
            ty: undefined,
            dj: null,
            djtags: []
          }
          break
        case 'dj':
          this.dialogDjItem = {
            id: undefined,
            djmc: undefined,
            order: undefined,
            fz: undefined
          }
          break
      }
    },
    getLbList() {
      // this.listLoading = true
      fetchLbList(this.lbListQuery).then(response => {
        this.lbList = response.data.items
        // this.total = response.data.total
        // console.log(response.data.items)
        // Just to simulate the time of the request
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      })
    },
    // 显示二级类别
    getXmList(row, event, column) {
      this.clickLbRow = row
      // 清空级别箭头标志
      this.clickXmRow = ''
      this.xmTableVisible = true
      this.jbTableVisible = false

      this.xmListQuery.lbid = row.id

      fetchXmList(this.xmListQuery).then(response => {
        this.xmList = response.data.items
        // this.total = response.data.total
        // console.log(response.data.items)
      })
    },
    getJbList(row, event, column) {
      this.clickXmRow = row
      this.jbTableVisible = true
      this.jbListQuery.xmid = row.id
      fetchJbList(this.jbListQuery).then(response => {
        this.jbList = response.data.items
        // this.total = response.data.total
        // console.log(response.data.items)
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          /*
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          */
        }
      })
    },
    handleFetchPv(pv) {
      /*
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
      */
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
    /*
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
    */
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container{
    min-width: 1300px;
    height:100%;
}
.el-button--mini{
    padding:5px;
}
.djtags{
  border:1px solid #ccc;
  width:100%;
  min-height:50px;
  border-radius: 4px;
  padding:10px;

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .el-tag--medium{
    height:35px;
    line-height:35px;
  }
}

/*
.scroll-container {
  z-index: 10000;
  /deep/ {
    .el-scrollbar__bar {
      bottom: 0px;
    }
    .el-scrollbar__wrap {
      height:100%;
      overflow-x: auto;
    }
    .is-horizontal{
      height:15px;
    }
  }
}
*/
</style>
