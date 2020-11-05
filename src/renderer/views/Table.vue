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
    <a-tabs ref="table-content" class="table-content" @change="tabIndexChange">
      <a-tab-pane
        class="tab-pane-content"
        v-for="(sheet, index) of getSheetNames"
        :key="index"
        :tab="sheet"
        v-model:value="selectSheet"
      >
        <a-table
          v-if="!reloadTable"
          :columns="getColumns"
          :data-source="getSheet"
          :row-key="record => record.id"
          :pagination="pagination"
          :row-selection="rowSelection"
          :scroll="{ x: 3000, y: getTableScrollY }"
        >
          <template #index="{index, record}">
            <p>
              {{
                Object.prototype.hasOwnProperty.call(record, "children")
                  ? record.index + 1
                  : record.single
                  ? record.index + 1
                  : `${record.index + 1}-${index + 1}`
              }}
            </p>
          </template>
          <template #COA="{text}">
            <template v-if="Array.isArray(text)">
              <a-tag
                v-for="(tag, index) of text"
                :key="tag.id"
                :color="getTagColor(index)"
              >{{ tag.text }}
              </a-tag>
            </template>
            <template v-else-if="text">
              <a-tag :color="getTagColor()">{{ text }}</a-tag>
            </template>
          </template>
          <template #CostCenter="{text}">
            <template v-if="Array.isArray(text)">
              <a-tag
                v-for="(tag, index) of text"
                :key="tag.id"
                :color="getTagColor(index)"
              >{{ tag.text }}
              </a-tag>
            </template>
            <template v-else-if="text">
              <a-tag :color="getTagColor()">{{ text }}</a-tag>
            </template>
          </template>
          <template #TablePosition="{text}">
            <template v-if="Array.isArray(text)">
              <a-tag
                v-for="(tag, index) of text"
                :key="tag.id"
                :color="getTagColor(index)"
              >{{ tag.text }}
              </a-tag>
            </template>
            <template v-else-if="text">
              <a-tag :color="getTagColor()">{{ text }}</a-tag>
            </template>
          </template>
          <template #ACAndPL="{text}">
            <template v-if="Array.isArray(text)">
              <a-tag
                v-for="(tag, index) of text"
                :key="tag.id"
                :color="getTagColor(index)"
              >{{ tag.text }}
              </a-tag>
            </template>
            <template v-else-if="text">
              <a-tag :color="getTagColor()">{{ text }}</a-tag>
            </template>
          </template>
          <template #DisclosureCaliber="{text}">
            <template v-if="Array.isArray(text)">
              <a-tag
                v-for="(tag, index) of text"
                :key="tag.id"
                :color="getTagColor(index)"
              >{{ tag.text }}
              </a-tag>
            </template>
            <template v-else-if="text">
              <a-tag :color="getTagColor()">{{ text }}</a-tag>
            </template>
          </template>
          <template #AssetTypes="{text}">
            <template v-if="Array.isArray(text)">
              <a-tag
                v-for="(tag, index) of text"
                :key="tag.id"
                :color="getTagColor(index)"
              >{{ tag.text }}
              </a-tag>
            </template>
            <template v-else-if="text">
              <a-tag :color="getTagColor()">{{ text }}</a-tag>
            </template>
          </template>
          <template #RiskClassification="{text}">
            <template v-if="Array.isArray(text)">
              <a-tag
                v-for="tag of text"
                :key="tag.id"
                :color="getRiskClassificationTagColor(tag)"
              >{{ tag.text }}
              </a-tag>
            </template>
            <template v-else-if="text">
              <a-tag :color="getRiskClassificationTagColor(text)">{{
                  text
                }}
              </a-tag>
            </template>
          </template>
          <template #BalanceTitle>
            <span class="custom-title">
              <span>{{customTitle.cutdown}}</span>
              <span>项目余额</span>
            </span>
          </template>
          <template #Balance="{text}">
            <p style="text-align: right">{{ text.toLocaleString("en-US") }}</p>
          </template>
          <template #CutDownTitle>
            <span class="custom-title">
              <span>{{customTitle.cutdown}}</span>
              <span>单项减值</span>
            </span>
          </template>
          <template #CutDown="{text}">
            <p style="text-align: right">{{ text.toLocaleString("en-US") }}</p>
          </template>
        </a-table>
        <footer class="statistics-bar">
          <a-statistic
            v-for="(key, index) of getSheetBalanceAndCutdown"
            :title="key.title"
            :key="`${key}__${index}`"
            :precision="2"
            :value="key.value"
          />
        </footer>
      </a-tab-pane>
    </a-tabs>
    <a-back-top :target="() => $refs['table-content'].$el"/>
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

const TAG_COLOR = ['blue', 'pink', 'red', 'orange', 'green', 'cyan', 'purple']

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
      pagination: false,
      reloadTable: false,
      customTitle: {
        balance: '',
        cutdown: ''
      },
      columns: [
        {
          title: '',
          width: 40,
          fixed: 'left'
        },
        {
          title: '序号',
          slots: { customRender: 'index' },
          width: 100,
          fixed: 'left'
        },
        {
          title: '项目名称',
          dataIndex: '项目名称',
          key: 'ProjectName',
          slots: {
            title: 'ProjectNameTitle',
            customRender: 'ProjectName'
          },
          width: 250,
          fixed: 'left'
        },
        {
          title: 'COA',
          dataIndex: 'COA',
          key: 'COA',
          slots: {
            title: 'COATitle',
            customRender: 'COA'
          }
        },
        {
          title: '成本中心',
          key: 'CostCenter',
          dataIndex: '成本中心',
          slots: {
            title: 'CostCenterTitle',
            customRender: 'CostCenter'
          }
        },
        {
          title: '表内外',
          key: 'TablePosition',
          dataIndex: '表内外',
          slots: {
            title: 'TablePositionTitle',
            customRender: 'TablePosition'
          }
        },
        {
          title: 'AC/PL',
          key: 'ACAndPL',
          dataIndex: 'AC/PL',
          slots: {
            title: 'ACAndPLTitle',
            customRender: 'ACAndPL'
          }
        },
        {
          title: '披露口径',
          key: 'DisclosureCaliber',
          dataIndex: '披露口径',
          slots: {
            title: 'DisclosureCaliberTitle',
            customRender: 'DisclosureCaliber'
          }
        },
        {
          title: '资产类别',
          key: 'AssetTypes',
          dataIndex: '资产类别',
          slots: {
            title: 'AssetTypesTitle',
            customRender: 'AssetTypes'
          }
        },
        {
          title: '风险分类',
          key: 'RiskClassification',
          dataIndex: '风险分类',
          slots: {
            title: 'RiskClassificationTitle',
            customRender: 'RiskClassification'
          }
        }
      ]
    }
  },
  watch: {
    selectFileId (id) {
      this.selectFile = this.fileList.find(i => i.id === id)
    }
  },
  created () {
    this.fileList = JSON.parse(window.localStorage.getItem('files')).map(
      item => ({
        ...item,
        data: {
          ...item.data,
          sheets: setId(item.data.sheets)
        }
      })
    )

    if (this.fileList.length > 0) {
      this.selectFileId = this.fileList[0].id
      this.sheets = this.fileList[0].data.sheets
      this.selectSheet = this.fileList[0].data.sheetNames[0]
    }
    // this.init()
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
    },
    // 获取标签
    getTagColor (index) {
      if (index > TAG_COLOR.length) {
        index = Math.floor(Math.random() * TAG_COLOR.length)
      } else if (!index) {
        index = 0
      }
      return TAG_COLOR[index]
    },
    // 获取风险分类标签颜色
    getRiskClassificationTagColor (tag) {
      const color = {
        正常: 'green',
        损失: 'red',
        可疑: 'orange',
        关注: 'blue',
        次级: 'cyan',
        不分类: ''
      }
      if (typeof tag === 'object') {
        return color[tag.text]
      } else if (typeof tag === 'string') {
        return color[tag]
      } else {
        return ''
      }
    },
    changeColumns (arr) {
      this.columns = this.columns.concat(arr)
    },
    changeCustomTitle (key, value) {
      this.customTitle[key] = value.replace(/(\d{4}年\d{2}月\d{2}日).*/, '$1')
    }
  },
  computed: {
    // 获取 sheet's names
    getSheetNames () {
      return this.fileList.find(i => i.id === this.selectFileId).data
        .sheetNames
    },
    // 获取当前选中文件
    getFile () {
      return this.fileList.find(i => i.id === this.selectFileId)
    },
    // 获取表格数据
    getSheet () {
      // 判断是否为有效值
      const isEffectiveValue = i => i !== null && i !== undefined && i !== ''
      // 深拷贝
      const sheet = JSON.parse(JSON.stringify(this.sheets[this.selectSheet]))
      sheet.splice(-2, 2)
      const result = []
      sheet.forEach((item, sheetIndex) => {
        // 判断该归并类是否存在
        const index = result.findIndex(i => i.归并 === item.归并)
        // 插入数据
        const mergeParam = (i, param) => {
          // 深拷贝
          const result = JSON.parse(JSON.stringify(param))
          // 遍历key-value
          Object.entries(i).forEach(([key, value]) => {
            // 判断key是否为目标、合法且包含
            if (
              [
                'AC/PL',
                '成本中心',
                '披露口径',
                '移交类型',
                'COA',
                '表内外',
                '资产类别',
                '项目名称',
                '风险分类'
              ].includes(key) &&
              isEffectiveValue(value) &&
              !result[key].find(i => i.text === value)
            ) {
              if (/项目名称/.test(key)) key = key.replace(/(项目名称)/, '$1')
              result[key].push({
                text: value,
                id: Utils.uuid()
              })
            } else if (/余额|减值/.test(key)) {
              result[key] += Number(value)
            }
          })
          return result
        }

        if (index === -1) {
          // 父数据
          let param = {
            index: result.length,
            id: item.id,
            归并: item.归并,
            'AC/PL': [],
            成本中心: [],
            披露口径: [],
            移交类型: [],
            COA: [],
            表内外: [],
            资产类别: [],
            项目名称: item['项目名称（户）'],
            // '项目名称（笔）': [],
            风险分类: [],
            children: [
              {
                index: result.length,
                ...item,
                项目名称: item['项目名称（笔）']
              }
            ]
          }

          const paramKey = Object.keys(param)
          // 初始化余额和减值
          Object.keys(item).forEach(key => {
            if (!paramKey.includes(key) && /余额|减值/.test(key)) {
              param[key] = 0
            }
          })

          // 判断数据合法性
          param = mergeParam(item, param)

          result.push(param)
        } else {
          let param = result[index]
          if (isEffectiveValue(item['项目名称（户）'])) {
            param['项目名称'] = item['项目名称（户）']
          }

          // 判断数据合法性
          param = mergeParam(item, param)
          // param['项目名称'] = []
          param.children.push({
            index,
            ...item,
            项目名称: item['项目名称（笔）']
          })
          result[index] = param
        }
      })
      return result.map(item => {
        if (
          Object.prototype.hasOwnProperty.call(item, 'children') &&
          item.children.length === 1
        ) {
          return {
            ...item.children[0],
            single: true
          }
        } else {
          return item
        }
      })
    },
    getSheetBalanceAndCutdown () {
      const keys = []
      Object.keys(this.getSheet[0]).forEach(key => {
        if (/余额|减值/.test(key)) {
          this.changeCustomTitle(/余额/.test(key) ? 'balance' : 'cutdown', key)
          keys.push({
            // title: key,
            key: /余额/.test(key) ? 'Balance' : 'CutDown',
            dataIndex: key,
            slots: {
              title: `${/余额/.test(key) ? 'Balance' : 'CutDown'}Title`,
              customRender: /余额/.test(key) ? 'Balance' : 'CutDown'
            }
          })
        }
      })
      this.changeColumns(keys)

      // 深度遍历
      const deep = (list) => {
        let balance = 0
        let cutdown = 0
        list.forEach(item => {
          if (Object.prototype.hasOwnProperty.call(list, 'children')) {
            const sum = deep(item.children)
            balance += sum.balance
            cutdown += sum.cutdown
          } else {
            Object.keys(item).forEach(key => {
              if (/余额/.test(key)) {
                balance += item[key]
              } else if (/减值/.test(key)) {
                cutdown += item[key]
              }
            })
          }
        })
        return {
          balance,
          cutdown
        }
      }
      const result = deep(this.getSheet)
      return [
        {
          title: '总项目余额',
          value: result.balance
        },
        {
          title: '总单项减值',
          value: result.cutdown
        }
      ]
    },
    getColumns () {
      return this.columns
    },
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
          )
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows)
        }
      }
    },
    getTableScrollY () {
      return window.innerHeight - 310
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

    & /deep/ .ant-table-body {
      & /deep/ .ant-table-thead {
        position: sticky;
        top: 0;
      }
    }

    & /deep/ .ant-table-row {
      & /deep/ td:nth-child(5) {
        margin-left: 20px;
      }
    }

    & /deep/ .ant-table-row-cell-break-word {
      //padding: 0;
    }

    .custom-title {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .statistics-bar {
      position: sticky;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      background: #fff;
      width: 100%;
      border-top: 1px solid #efefef;
      padding: 20px 0;
      z-index: 10;

      & .ant-statistic {
        margin: 0 50px;
      }
    }
  }
}
</style>
