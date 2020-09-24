<template>
  <div class="home">
    <a-upload-dragger
      class="upload-input"
      name="file"
      accept=".json"
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

export default {
  name: 'Home',
  components: {
    InboxOutlined
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    handleChange ({ file }) {
      this.loading = true
      const fileReader = new FileReader()
      fileReader.readAsText(file)
      fileReader.onload = () => {
        // 文件读取内容
        window.localStorage.setItem('file', fileReader.result)
        this.loading = false
        this.$router.push('/table')
      }
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
  height: 20%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
