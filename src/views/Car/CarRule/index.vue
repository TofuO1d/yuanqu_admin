<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="dialogVisible = true"
        >增加停车计费规则</el-button
      >

      <el-button @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上线(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ formatChargeType(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editRule(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="delRule(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pager" style="margin-top:10px;float:right">
        <el-pagination
          layout="prev,pager,next"
          :total="total"
          :editId.sync="editId"
          :page-size="params.pageSize"
          @current-change="handleChange"
        />
      </div>
    </div>
    <AddRule
      :dialogVisible="dialogVisible"
      :editId.sync="editId"
      @closeDialog="dialogVisible = false"
    />
  </div>
</template>

<script>
import { utils, writeFileXLSX } from 'xlsx'
import { getRuleListAPI, delRuleAPI } from '@/api/car'
import AddRule from './components/AddRule.vue'
export default {
  name: 'Building',
  data () {
    return {
      dialogVisible: true, // 控制弹框关闭打
      ruleList: [],
      params: {
        page: 1,
        pageSize: 2
      },
      total: 0,
      dialogVisible: false,
      editId: ''
    }
  },
  components: {
    AddRule
  },
  mounted () {
    this.getRuleList()
  },
  methods: {
    // 获取规则列表
    async getRuleList () {
      const res = await getRuleListAPI(this.params)
      this.ruleList = res.data.rows
      this.total = res.data.total
    },
    indexMethod (row) {
      return (this.params.page - 1) * this.params.pageSize + row + 1
    },
    handleChange (val) {
      this.params.page = val
      this.getRuleList()
    },
    async delRule (id) {
      this.$confirm('确定删除该规则吗?', '提示', {
        type: 'warning'
      })
        .then(async () => {
          const res = await delRuleAPI(id)
          console.log(res)
          this.getRuleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败!'
          })
        })
    },
    async exportToExcel () {
      const workbook = utils.book_new()
      // const tableHeaderKeys = [
      //   'ruleNumber',
      //   'ruleName',
      //   'freeDuration',
      //   'chargeCeiling',
      //   'chargeType',
      //   'ruleNameView'
      // ]
      const tableHeaderValues = [
        '计费规则编号',
        '计费规则名称',
        '免费时长(分钟)',
        '收费上线(元)',
        '计费方式',
        '计费规则'
      ]
      const res = await getRuleListAPI(this.params)
      res.data.rows.forEach(item => {
        if (item.chargeType) {
          item.chargeType = this.formatChargeType(item.chargeType)
        }
      })
      const sheetData = res.data.rows.map(item => {
        return {
          ruleNumber: item.ruleNumber,
          ruleName: item.ruleName,
          freeDuration: item.freeDuration,
          chargeCeiling: item.chargeCeiling,
          chargeType: item.chargeType,
          ruleNameView: item.ruleNameView
        }
      })
      console.log(sheetData)
      const worksheet = utils.json_to_sheet(sheetData)
      utils.book_append_sheet(workbook, worksheet, 'Data')
      utils.sheet_add_aoa(worksheet, [tableHeaderValues], { origin: 'A1' })
      writeFileXLSX(workbook, 'chageRule.xlsx')
    },
    // 适配收费状态
    formatChargeType (type) {
      const TYPEMAP = {
        duration: '按时长收费',
        turn: '按次收费',
        partition: '分段收费'
      }
      return TYPEMAP[type]
    },
    editRule (id) {
      this.editId = id.toString()
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
