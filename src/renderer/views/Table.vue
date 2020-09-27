<template>
  <main class="table" ref="table">
    <nav-bar title="列表页">
      <a-select
        v-model:value="selectFile"
        style="width: 160px"
      >
        <a-select-option
          v-for="file of fileList"
          :key="file.id"
          :value="file.id"
        >
          {{file.name}}
        </a-select-option>
      </a-select>
      <a-button @click="download" type="primary">
        导出数据
      </a-button>
    </nav-bar>
    <a-collapse :bordered="false">
      <a-collapse-panel key="1" header="查看统计总数">
        <div style="background-color: #ececec; padding: 20px;">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-card title="省份总数" :bordered="false">
                <a-statistic
                  title="2020年"
                  style="margin-right: 50px"
                >
                  <template v-slot:suffix>
                    <p>个</p>
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card title="市级总数" :bordered="false">
                <a-statistic
                  title="2020年"
                  style="margin-right: 50px"
                >
                  <template v-slot:suffix>
                    <p>个</p>
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
            <a-col :span="8">
              <a-card title="县级总数" :bordered="false">
                <a-statistic
                  title="2020年"
                  style="margin-right: 50px"
                >
                  <template v-slot:suffix>
                    <p>个</p>
                  </template>
                </a-statistic>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-collapse-panel>
    </a-collapse>
<!--    <a-table :columns="columns" :data-source="data">-->

<!--    </a-table>-->
    <a-back-top :target="() => $refs.table" />
  </main>
</template>

<script>
import NavBar from '@/components/NavBar'
// import EditableCell from '@/components/EditableCell'
// import { DeleteOutlined } from '@ant-design/icons-vue'

const sumLength = (list, level = 0) => {
  if (level === 0) {
    return list.length
  } else {
    return list.reduce((acc, cur) => acc + sumLength(cur.child, level - 1), 0)
  }
}

export default {
  name: 'Table',
  components: {
    NavBar
    // EditableCell,
    // DeleteOutlined
  },
  data () {
    return {
      fileList: [],
      selectFile: '',
      rowSelection: [],
      provinceNum: 0,
      cityNum: 0,
      countyNum: 0,
      filteredInfo: null,
      sortedInfo: null,
      searchText: '',
      searchInput: null,
      searchedColumn: ''
    }
  },
  created () {
    this.fileList = JSON.parse(window.localStorage.getItem('files'))
    if (this.fileList.length > 0) this.selectFile = this.fileList[0].id
  },
  methods: {
    getChildrenCity (children) {
      return children.reduce((acc, { name, code, child }) => {
        acc.push({
          name,
          code
        })
        return acc.concat(this.getChildrenCity(child))
      }, [])
    },
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.fileList]
      const target = dataSource.find(item => item.code === key)
      if (target) {
        target[dataIndex] = value
        this.fileList = dataSource
      }
    },
    onDelete (key) {
      const dataSource = [...this.fileList]
      this.fileList = dataSource.filter(item => item.code !== key)
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
    handleChange (pagination, filters, sorter) {
      this.filteredInfo = filters
      this.sortedInfo = sorter
    },
    handleSearch (confirm, dataIndex) {
      console.log(confirm)
      confirm()
      this.searchedColumn = dataIndex
      this.$forceUpdate()
    },
    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    handleSetSearchText (setSelectedKeys, e) {
      setSelectedKeys(e.target.value ? [e.target.value] : [])
    },
    onCheckboxChange (list, setSelectedKeys, selectedKeys, checkedList) {
      selectedKeys[0] = checkedList
      selectedKeys[2] = !!selectedKeys[0].length && selectedKeys[0].length < list.length
      selectedKeys[1] = selectedKeys[0].length === list.length
      setSelectedKeys(selectedKeys)
    },
    onCheckboxCheckAllChange (list, setSelectedKeys, selectedKeys, e) {
      selectedKeys[1] = e.target.checked
      selectedKeys[2] = false
      selectedKeys[0] = e.target.checked ? list.map(i => i.value) : []
      setSelectedKeys(selectedKeys)
    },
    filterName (value, record) {
      console.log(value, record)
      return value.find(i => record.code
        .toString()
        .toLowerCase()
        .includes(i.toLowerCase()))
    }
  },
  computed: {
    getTableData () {
      return this.fileList.find(i => i.id === this.selectFile)
    },
    getProvinceNum () {
      return sumLength(this.fileList, 0)
    },
    getCityNum () {
      return sumLength(this.fileList, 1)
    },
    getCountyNum () {
      return sumLength(this.fileList, 2)
    },
    columns () {
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return [
        {
          title: '序号',
          width: '100px',
          slots: { customRender: 'index' }
        },
        {
          title: '省份名称',
          dataIndex: 'name',
          key: 'name',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'name'
          },
          sorter: (a, b) => a.name.localeCompare(b.name, 'zh'),
          sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
          filteredValue: filteredInfo.name || null,
          filters: this.fileList.map(i => ({ text: i.name, value: i.code })),
          onFilter: (value, record) => record.code.includes(value),
          /* onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchText = ''
                this.searchInput.focus()
              }, 0)
            }
          }, */
          width: '200px'
        },
        {
          title: '代码',
          dataIndex: 'code',
          key: 'code',
          slots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'code'
          },
          sorter: (a, b) => Number(a.code) - Number(b.code),
          sortOrder: sortedInfo.columnKey === 'code' && sortedInfo.order,
          filteredValue: filteredInfo.code || null,
          filters: this.fileList.map(i => ({ text: i.code, value: i.code })),
          onFilter: (value, record) => record.code.includes(value),
          /* onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchText = ''
                this.searchInput.focus()
              }, 0)
            }
          }, */
          width: '200px'
        },
        {
          title: '市',
          dataIndex: 'child',
          ellipsis: true,
          slots: {
            customRender: 'child'
          }
        },
        {
          title: '操作',
          slots: {
            customRender: 'action'
          },
          width: '150px'
        }
      ]
    }
  }
}
</script>

<style scoped>
main.table {
  padding: 0 15px 15px;
  background: #efefef;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.filter-checkbox-group-content {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 10px;
}

.filter-checkbox-group-content >>> .ant-checkbox-group-item {
  display: block;
}
</style>

<style lang="less">
.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
    display: flex;
    align-items: center;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
    display: flex;
    align-items: center;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
