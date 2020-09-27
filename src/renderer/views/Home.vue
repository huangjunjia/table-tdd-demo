<template>
  <div class="home">
    <!--<a-radio-group
      v-model:value="selectFileType"
      button-style="solid"
    >
      <a-radio-button value="excel">
        Excel
      </a-radio-button>
      <a-radio-button value="json">
        Json
      </a-radio-button>
    </a-radio-group>-->
    <a-upload-dragger
      class="upload-input"
      name="file"
      accept=".json,.xlsx,.xls"
      :multiple="true"
      :beforeUpload="() => false"
      :customRequest="() => false"
      :showUploadList="false"
      @change="handleChange"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined />
      </p>
      <p class="ant-upload-text">
        点击或者拖拽文件至该区域上传
      </p>
      <p class="ant-upload-hint">
        支持单次或批量上传
        <br />
        严格禁止上传公司数据或其他敏感文件
      </p>
    </a-upload-dragger>
  </div>
</template>

<script>
import { InboxOutlined } from '@ant-design/icons-vue'
import { ipcRenderer } from '@/common'

export default {
  name: 'Home',
  inject: ['loading'],
  components: {
    InboxOutlined
  },
  data () {
    return {
      selectFileType: '',
      timer: null,
      fileCount: 0,
      fileList: []
    }
  },
  methods: {
    handleChange ({ file, fileList }) {
      this.loading.open()
      // const fileReader = new FileReader()
      // fileReader.readAsText(file)
      // fileReader.onload = () => {
      //   // 文件读取内容
      //   window.localStorage.setItem('file', fileReader.result)
      //   this.loading = false
      //   this.$router.push('/table')
      // }
      ipcRenderer.receiveFile(file).then(res => {
        this.fileCount++
        this.fileList.push(res)
        if (this.fileCount === fileList.length) {
          this.loading.close()
          window.localStorage.setItem('files', JSON.stringify(this.fileList))
          this.$router.push('/table')
        }
      })
    }
  }
}
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.upload-input {
  width: 80%;
  min-width: 800px;
  height: 50%;
  min-height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
