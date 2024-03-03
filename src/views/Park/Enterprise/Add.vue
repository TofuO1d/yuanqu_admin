<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <el-page-header
          :content="this.$route.query.id ? '编辑企业' : '新增企业'"
          @back="$router.back()"
        />
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form
            :model="addForm"
            :rules="addRules"
            label-width="100px"
            ref="ruleForm"
          >
            <el-form-item label="企业名称" prop="name">
              <el-input v-model="addForm.name" />
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <el-input v-model="addForm.legalPerson" />
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <el-input v-model="addForm.registeredAddress" />
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <el-select v-model="addForm.industryCode">
                <el-option
                  v-for="item in industryList"
                  :key="item.industryCode"
                  :value="item.industryCode"
                  :label="item.industryName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <el-input v-model="addForm.contact" />
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input v-model="addForm.contactNumber" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <el-upload
                action="#"
                :http-request="uploadRequest"
                :before-upload="beforeUpload"
                ref="myUpload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
              <img
                v-if="id"
                :src="addForm.businessLicenseUrl"
                alt=""
                style="width:100px ;"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="confirmSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  getIndustryListAPI,
  uploadAPI,
  createExterpriseAPI,
  getEnterpriseDetailAPI
} from '@/api/enterprise'
const validatePhone = (rule, value, callback) => {
  if (/^1[3-9]\d{9}$/.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正常的手机号'))
  }
}
export default {
  data () {
    return {
      industryList: [], // 可选行业列表
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },
      addRules: {
        name: [{ required: true, message: '企业名称为必填', trigger: 'blur' }],
        legalPerson: [
          { required: true, message: '法人为必填', trigger: 'blur' }
        ],
        registeredAddress: [
          { required: true, message: '注册地址为必填', trigger: 'blur' }
        ],
        industryCode: [
          { required: true, message: '所在行业为必填', trigger: 'change' }
        ],
        contact: [
          { required: true, message: '企业联系人为必填', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '企业联系人电话为必填', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        businessLicenseId: [
          { required: true, message: '请上传营业执照', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  mounted () {
    if (this.id) {
      this.getEnterpriseDetail()
    }
    this.getIndustryList()
  },
  methods: {
    async getIndustryList () {
      const res = await getIndustryListAPI()
      this.industryList = res.data
    },
    async uploadRequest (data) {
      const file = data.file

      // 处理formData类型参数
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'businessLicense')
      const res = await uploadAPI(formData)

      // 赋值表单数据
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url
      // 单独校验表单，清除错误信息
      this.$refs.ruleForm.validateField('businessLicenseId')
    },
    // 编写校验逻辑
    beforeUpload (file) {
      const allowImgType = ['image/jpeg', 'image/png', 'image/jpg'].includes(
        file.type
      )
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!allowImgType) {
        this.$message.error('上传合同图片只能是 PNG/JPG/JPEG 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传合同图片大小不能超过 5MB!')
      }
      return allowImgType && isLt5M
    },
    confirmSubmit () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return
        // 1. 调用接口
        if (this.id) {
          // 编辑
          await updateExterpriseAPI({
            ...this.addForm,
            id: this.Id
          })
        } else {
          // 新增
          await createExterpriseAPI(this.addForm)
        }
        // 2. 返回列表页
        this.$router.back()
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
      this.$refs.myUpload.clearFiles()
    },
    async getEnterpriseDetail () {
      const res = await getEnterpriseDetailAPI(this.id)
      const {
        businessLicenseId,
        businessLicenseUrl,
        contact,
        contactNumber,
        industryCode,
        legalPerson,
        name,
        registeredAddress
      } = res.data
      this.addForm = {
        businessLicenseId,
        businessLicenseUrl,
        contact,
        contactNumber,
        industryCode,
        legalPerson,
        name,
        registeredAddress
      }
    }
  }
}
</script>

<style scoped lang="scss">
.add-enterprise {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      padding-top: 20px;
      span {
        margin-right: 4px;
      }
      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    background: #f4f6f8;
    padding: 20px 130px;

    .form-container {
      background-color: #fff;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 50%;
          }
        }
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
  }
}
</style>
