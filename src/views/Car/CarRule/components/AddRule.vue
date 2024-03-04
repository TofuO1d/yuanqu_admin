<template>
  <!-- 弹框 -->
  <el-dialog
    :visible="dialogVisible"
    width="680px"
    :title="editId === '' ? '新增规则' : '编辑规则'"
    @close="closeDialog"
  >
    <!-- 表单接口 -->
    <div class="form-container">
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-position="top"
      >
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input v-model="addForm.ruleNumber" />
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input v-model="addForm.ruleName" />
        </el-form-item>

        <div class="flex-container">
          <el-form-item label="免费时长">
            <el-input v-model="addForm.freeDuration" />
          </el-form-item>
          <el-form-item label="收费上限">
            <el-input v-model="addForm.chargeCeiling" />
          </el-form-item>
        </div>
        <el-form-item label="计费方式" prop="chargeType">
          <el-radio-group v-model="addForm.chargeType" size="small">
            <el-radio label="duration" border>时长收费</el-radio>
            <el-radio label="turn" border>按次收费</el-radio>
            <el-radio label="partition" border>分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计费规则">
          <!-- 按时长收费区域 -->
          <div v-if="addForm.chargeType === 'duration'" class="duration">
            每
            <el-form-item prop="durationTime">
              <el-input v-model="addForm.durationTime" class="input-box" />
            </el-form-item>
            小时
            <el-form-item prop="durationPrice">
              <el-input v-model="addForm.durationPrice" class="input-box" />
            </el-form-item>
            元
          </div>
          <!-- 按次收费区域 -->
          <div v-if="addForm.chargeType === 'turn'" class="turn">
            每次
            <el-form-item prop="turnPrice">
              <el-input v-model="addForm.turnPrice" class="input-box" />
            </el-form-item>

            元
          </div>
          <!-- 按分段收费区域 -->
          <div v-if="addForm.chargeType === 'partition'" class="partition">
            <div class="item">
              <el-form-item prop="partitionFrameTime">
                <el-input
                  v-model="addForm.partitionFrameTime"
                  class="input-box"
                />
              </el-form-item>
              <el-form-item prop="partitionFramePrice">
                小时内,每小时收费<el-input
                  v-model="addForm.partitionFramePrice"
                  class="input-box"
                />
              </el-form-item>
              元
            </div>
            <div class="item">
              每增加
              <el-form-item prop="partitionIncreaseTime">
                <el-input
                  v-model="addForm.partitionIncreaseTime"
                  class="input-box"
                />
              </el-form-item>
              小时,增加
              <el-form-item prop="partitionIncreasePrice">
                <el-input
                  v-model="addForm.partitionIncreasePrice"
                  class="input-box"
                />
              </el-form-item>
              元
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button size="mini" @click="closeDialog">取 消</el-button>
      <el-button size="mini" type="primary" @click="confirmAdd"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
import { createRuleAPI, getRuleDetailAPI, editRuleAPI } from '@/api/car'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    editId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      feeRuleProp: 'durationTime',
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: 'duration', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      }, // 计费规则表单对象
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ],
        durationTime: [
          {
            required: true,
            message: '请输入时间',
            trigger: 'blur'
          }
        ],
        durationPrice: [
          {
            required: true,
            message: '请输入金额',
            trigger: 'blur'
          }
        ],
        turnPrice: [
          {
            required: true,
            message: '请输入每次费用',
            trigger: 'blur'
          }
        ],
        partitionFrameTime: [
          {
            required: true,
            message: '请输入段内时间',
            trigger: 'blur'
          }
        ],
        partitionFramePrice: [
          {
            required: true,
            message: '请输入段内费用',
            trigger: 'blur'
          }
        ],
        partitionIncreaseTime: [
          {
            required: true,
            message: '请输入超出时间',
            trigger: 'blur'
          }
        ],
        partitionIncreasePrice: [
          {
            required: true,
            message: '请输入超出费用',
            trigger: 'blur'
          }
        ]
      } // 计费规则校验规则对
    }
  },
  watch: {
    'addForm.chargeType' (val) {
      this.$refs.addForm.clearValidate([
        'turnPrice',
        'durationTime',
        'durationPrice',
        'partitionFrameTime',
        'partitionFramePrice',
        'partitionIncreaseTime',
        'partitionIncreasePrice'
      ])
    },
    dialogVisible (val) {
      if (val === true && this.editId) {
        this.getRuleDetail()
      } else return
    }
  },
  methods: {
    async getRuleDetail () {
      const res = await getRuleDetailAPI(this.editId)
      delete res.data['id']
      this.addForm = { ...res.data }
    },
    confirmAdd () {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          if (!this.editId) {
            await createRuleAPI(this.addForm)
            this.$message.success('添加成功')
          } else {
            await editRuleAPI({ ...this.addForm, id: this.editId })
            this.$message.success('编辑成功')
          }
          this.$parent.getRuleList()
          // this.getRuleList()
          this.closeDialog()
        }
      })
    },
    closeDialog () {
      // this.dialogVisible = false
      this.$emit('closeDialog')
      // 使用.sync实现子改父组件的属性值，双向绑定
      this.$emit('update:editId', '')
      this.$refs.addForm.resetFields()
      this.addForm.freeDuration = ''
      this.addForm.chargeCeiling = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 0px 80px;
}
</style>
