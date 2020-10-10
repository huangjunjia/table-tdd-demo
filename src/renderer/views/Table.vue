<template>
  <main class="table">
    <nav-bar title="列表页">
      <a-select
        v-model:value="selectFileId"
        style="width: 160px"
        @change="changeSelectFileId"
      >
        <a-select-option
          v-for="file of fileList"
          :key="file.id"
          :value="file.id"
        >
          {{ file.name }}
        </a-select-option>
      </a-select>
      <a-button @click="download" type="primary">
        导出数据
      </a-button>
    </nav-bar>
    <a-tabs
      ref="table-content"
      class="table-content"
      @change="tabIndexChange"
    >
      <a-tab-pane
        class="tab-pane-content"
        v-for="(sheet, index) of getSheetNames"
        :key="index"
        :tab="sheet"
      >
        <a-table
          :columns="columns"
          :data-source="sheets[sheet]"
          :row-key="record => record.id"
          :pagination="pagination"
        >
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <a-back-top :target="() => $refs['table-content'].$el" />
  </main>
</template>

<script>
import NavBar from '@/components/NavBar'
import Utils from '@/common/utils'

// 设置id
function setId (data) {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      id: Utils.uuid(8, 36)
    }))
  } else if (/Object/.test(Object.prototype.toString.call(data))) {
    const newData = {}
    Object.entries(data).forEach(([key, value]) => {
      newData[key] = setId(value)
    })
    return newData
  }
}

export default {
  name: 'Table',
  components: {
    NavBar
  },
  data () {
    return {
      fileList: [],
      selectFileId: '',
      sheets: [],
      selectSheet: '',
      columns: [],
      pagination: false
    }
  },
  watch: {
    selectFileId (id) {
      this.selectFile = this.fileList.find(i => i.id === id)
    }
  },
  created () {
    this.fileList = JSON.parse(window.localStorage.getItem('files')).map(item => ({
      ...item,
      data: {
        ...item.data,
        sheets: setId(item.data.sheets)
      }
    })).splice(-2, 2)

    if (this.fileList.length > 0) {
      this.selectFileId = this.fileList[0].id
      this.sheets = this.fileList[0].data.sheets
      this.selectSheet = this.fileList[0].data.sheetNames[0]
    }
    this.init()
  },
  methods: {
    // 初始化
    init () {
      const sheetHeaders = this.getFile.data.headers[this.selectSheet]
      const columns = []

      sheetHeaders.forEach(td => {
        columns.push({
          title: td,
          key: td,
          dataIndex: td,
          slots: { customRender: td }
        })
      })

      console.log(this.sheets, columns)

      this.columns = columns
    },
    download () {
      // 创建隐藏的可下载链接
      const eleLink = document.createElement('a')
      eleLink.download = `${new Date().getTime()}.json`
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      const blob = new Blob([JSON.stringify(this.fileList, null, 2)])
      eleLink.href = URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    },
    // 切换文件时触发
    changeSelectFileId (id) {
      console.log(arguments)
    },
    // tab 切换触发
    tabIndexChange (key) {
      this.selectSheet = this.getSheetNames[key]
    }
  },
  computed: {
    // 获取 sheet's names
    getSheetNames () {
      return this.fileList.find(i => i.id === this.selectFileId).data.sheetNames
    },
    // 获取当前选中文件
    getFile () {
      return this.fileList.find(i => i.id === this.selectFileId)
    }
  }
}
</script>

<style lang="less" scoped>
main.table {
  background: #efefef;
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .table-content {
    padding: 0 15px;
    background: #fff;
    height: calc(100% - 65px);
    overflow: auto;

    & /deep/ .ant-tabs-top-bar {
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 1;
    }
  }
}
</style>
