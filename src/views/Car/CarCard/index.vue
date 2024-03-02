<template>
  <div class="card-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <span class="search-label">车牌号码：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="params.carNumber"
      />
      <span class="search-label">车主姓名：</span>
      <el-input
        clearable
        placeholder="请输入内容"
        class="search-main"
        v-model="params.personName"
      />
      <span class="search-label">状态：</span>
      <el-select v-model="params.cardStatus">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" class="search-btn" @click="search"
        >查询</el-button
      >
    </div>
    <!-- 新增删除操作区域 -->
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/car/addMonthCard')"
        >添加月卡</el-button
      >
      <el-button @click="batchDeleteCard">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" :index="indexMethod" />
        <el-table-column label="车主名称" prop="personName" />
        <el-table-column label="联系方式" prop="phoneNumber" />
        <el-table-column label="车牌号码" prop="carNumber" />
        <el-table-column label="车辆品牌" prop="carBrand" />
        <el-table-column label="剩余有效天数" prop="totalEffectiveDate" />
        <el-table-column
          label="状态"
          prop="cardStatus"
          :formatter="formatStatus"
        />
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="scope">
            <el-button size="mini" type="text">续费</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editCard(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="mini" type="text" @click="delCard(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="params.page"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="params.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 添加楼宇 -->
    <el-dialog title="添加楼宇" width="580px">
      <!-- 表单接口 -->
      <div class="form-container">
        <!-- <el-form ref="addForm" :model="addForm" :rules="addFormRules">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form> -->
      </div>
      <template #footer>
        <el-button size="mini">取 消</el-button>
        <el-button size="mini" type="primary">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getCardListAPI, delCardAPI } from '@/api/card'
export default {
  data () {
    return {
      total: 0,
      params: {
        page: 1,
        pageSize: 2,
        carNumber: '',
        personName: '',
        cardStatus: null
      },
      list: [],
      status: {
        0: '可用',
        1: '已过期'
      },
      statusList: [
        {
          text: '全部',
          value: null
        },
        {
          text: '可用',
          value: '0'
        },
        {
          text: '已过期',
          value: '1'
        }
      ],
      selectionVal: []
    }
  },
  created () {
    this.getCardList()
  },
  methods: {
    async getCardList () {
      const res = await getCardListAPI(this.params)
      this.list = res.data.rows
      this.total = res.data.total
    },
    formatStatus (row, column, cellValue, index) {
      return this.status[cellValue]
    },
    handleCurrentChange (page) {
      // 把点击的页数赋值给请求参数页数
      this.params.page = page
      // 使用最新的请求参数获取列表数据
      this.getCardList()
    },
    handleSizeChange (size) {
      this.params.pageSize = size
      this.getCardList()
    },
    indexMethod (index) {
      // return this.params.page * this.params.pageSize
      return index + 1 + (this.params.page - 1) * this.params.pageSize
    },
    search () {
      this.params.page = 1
      this.getCardList()
    },
    editCard (id) {
      this.$router.push({
        path: '/car/addMonthCard',
        query: {
          id
        }
      })
    },
    delCard (id) {
      this.$confirm('您确定要删除此项数据吗?', '温馨提示')
        .then(async () => {
          await delCardAPI(id)
          this.$message.success('删除成功')
          if (this.list.length === 1 && this.params.page > 1) {
            this.params.page--
          }
          this.getCardList()
        })
        .catch(() => {})
    },
    handleSelectionChange (val) {
      this.selectionVal = val
    },
    batchDeleteCard () {
      if (this.selectionVal.length <= 0) {
        this.$message.warning('请先选中要删除的数据')
        return
      } else {
        const ids = this.selectionVal.map(item => item.id)
        this.$confirm('您确定要删除这些数据吗?', '温馨提示')
          .then(async () => {
            await delCardAPI(ids.join(','))
            this.$message.success('批量删除成功')
            this.getCardList()
          })
          .catch(() => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;
  .search-main {
    width: 220px;
    margin-right: 10px;
  }
  .search-btn {
    margin-left: 20px;
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
