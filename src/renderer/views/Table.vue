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
      <template #tabBarExtraContent>
        <div class="tab-content-action-bar">
          <a-button type="primary" @click="unfoldAll">
            <ArrowsAltOutlined />
            全部展开
          </a-button>
          <a-button type="primary" @click="foldAll">
            <ShrinkOutlined />
            全部折叠
          </a-button>
        </div>
      </template>
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
          :scroll="{ x: 2000, y: tableScrollY }"
          :expanded-row-keys="expandedRowKeys"
          bordered
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
            <span class="tag-list">
              <template v-if="Array.isArray(text)">
                <template
                  v-for="(tag, index) of text"
                  :key="tag.id"
                >
                  <a-tag :color="getTagColor(index)">{{ tag.text }}</a-tag>
                  <br v-if="index % 2 === 1"/>
                </template>
              </template>
              <template v-else-if="text">
                <a-tag :color="getTagColor()">{{ text }}</a-tag>
              </template>
            </span>
          </template>
          <template #CostCenter="{text}">
            <span class="tag-list">
              <template v-if="Array.isArray(text)">
                <template
                  v-for="(tag, index) of text"
                  :key="tag.id"
                >
                  <a-tag :color="getTagColor(index)">{{ tag.text }}</a-tag>
                  <br v-if="index % 2 === 1"/>
                </template>
              </template>
              <template v-else-if="text">
                <a-tag :color="getTagColor()">{{ text }}</a-tag>
              </template>
            </span>
          </template>
          <template #TablePosition="{text}">
            <span class="tag-list">
              <template v-if="Array.isArray(text)">
                <template
                  v-for="(tag, index) of text"
                  :key="tag.id"
                >
                  <a-tag :color="getTagColor(index)">{{ tag.text }}</a-tag>
                  <br v-if="index % 2 === 1"/>
                </template>
              </template>
              <template v-else-if="text">
                <a-tag :color="getTagColor()">{{ text }}</a-tag>
              </template>
            </span>
          </template>
          <template #ACAndPL="{text}">
            <span class="tag-list">
              <template v-if="Array.isArray(text)">
                <template
                  v-for="(tag, index) of text"
                  :key="tag.id"
                >
                  <a-tag :color="getTagColor(index)">{{ tag.text }}</a-tag>
                  <br v-if="index % 2 === 1"/>
                </template>
              </template>
              <template v-else-if="text">
                <a-tag :color="getTagColor()">{{ text }}</a-tag>
              </template>
            </span>
          </template>
          <template #DisclosureCaliber="{text}">
            <span class="tag-list">
              <template v-if="Array.isArray(text)">
                <template
                  v-for="(tag, index) of text"
                  :key="tag.id"
                >
                  <a-tag :color="getTagColor(index)">{{ tag.text }}</a-tag>
                  <br v-if="index % 2 === 1"/>
                </template>
              </template>
              <template v-else-if="text">
                <a-tag :color="getTagColor()">{{ text }}</a-tag>
              </template>
            </span>
          </template>
          <template #AssetTypes="{text}">
            <span class="tag-list">
              <template v-if="Array.isArray(text)">
                <template
                  v-for="(tag, index) of text"
                  :key="tag.id"
                >
                  <a-tag :color="getTagColor(index)">{{ tag.text }}</a-tag>
                  <br v-if="index % 2 === 1"/>
                </template>
              </template>
              <template v-else-if="text">
                <a-tag :color="getTagColor()">{{ text }}</a-tag>
              </template>
            </span>
          </template>
          <template #RiskClassification="{text}">
            <span class="tag-list">
              <template v-if="Array.isArray(text)">
                <template
                  v-for="(tag, index) of text"
                  :key="tag.id"
                >
                  <a-tag :color="getRiskClassificationTagColor(tag.text)">{{ tag.text }}</a-tag>
                  <br v-if="index % 2 === 1"/>
                </template>
              </template>
              <template v-else-if="text">
                <a-tag :color="getRiskClassificationTagColor(text)">
                  {{ text }}
                </a-tag>
              </template>
            </span>
          </template>
          <template #BalanceTitle>
            <span class="custom-title">
              <span>{{customTitle.cutdown}}</span>
              <span>项目余额</span>
            </span>
          </template>
          <template #Balance="{text, record, column}">
            <p v-if="Object.prototype.hasOwnProperty.call(record, 'children')">
              {{ Number(text).toFixed(2).toLocaleString('en-us') }}
            </p>
            <editable-cell
              v-else
              :text="text"
              @change="val => onCellChange(record.id, column.dataIndex, val)"
            />
          </template>
          <template #CutDownTitle>
            <span class="custom-title">
              <span>{{customTitle.cutdown}}</span>
              <span>单项减值</span>
            </span>
          </template>
          <template #CutDown="{text, record, column}">
            <p v-if="Object.prototype.hasOwnProperty.call(record, 'children')">
              {{ Number(text).toFixed(2).toLocaleString('en-us') }}
            </p>
            <editable-cell
              v-else
              :text="text"
              @change="val => onCellChange(record.id, column.dataIndex, val)"
            />
          </template>
          <template #footer>
            <footer class="statistics-bar">
              <a-statistic
                v-for="(key, index) of getSheetBalanceAndCutdown"
                :title="key.title"
                :key="`${key}__${index}`"
                :precision="2"
                :value="key.value"
              />
            </footer>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <a-back-top :target="() => $refs['table-content'].$el"/>
  </main>
</template>

<script>
import NavBar from '@/components/NavBar'
import Utils from '@/common/utils'
import EditableCell from '@/components/EditableCell'
import { ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons-vue'

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
    EditableCell,
    NavBar,
    ArrowsAltOutlined,
    ShrinkOutlined
  },
  data () {
    return {
      fileList: [],
      selectFileId: '',
      sheets: [],
      selectSheet: '',
      pagination: false,
      reloadTable: false,
      tableScrollY: window.innerHeight - 301,
      customTitle: {
        balance: '',
        cutdown: ''
      },
      isFirstLoad: true,
      expandedRowKeys: [],
      columns: [
        {
          title: '',
          width: 50
        },
        {
          title: '序号',
          slots: { customRender: 'index' },
          width: 100
        },
        {
          title: '项目名称',
          dataIndex: '项目名称',
          key: 'ProjectName',
          slots: {
            title: 'ProjectNameTitle',
            customRender: 'ProjectName'
          },
          width: 250
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
          },
          width: 200
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
      this.sheets = { ...this.fileList[0].data.sheets }
      this.selectSheet = this.fileList[0].data.sheetNames[0]
    }
    // this.init()
  },
  mounted () {
    window.addEventListener('resize', this.getTableScrollY)
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
      this.columns = arr.reduce((acc, cur) => {
        if (!acc.find(i => i.dataIndex === cur.dataIndex)) {
          acc.push(cur)
        }
        return acc
      }, this.columns)
    },
    changeCustomTitle (key, value) {
      this.customTitle[key] = value.replace(/(\d{4}年\d{2}月\d{2}日).*/, '$1')
    },
    // 获取table的y轴可滚动距离
    getTableScrollY () {
      this.tableScrollY = window.innerHeight - 301
    },
    // 修改单元格触发
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.getSheet]
      const deep = (list) => {
        for (const item of list) {
          if (Object.prototype.hasOwnProperty.call(item, 'children')) {
            const res = deep(item.children)
            if (res) {
              return res
            }
          } else if (item.id === key) {
            return item
          }
        }
      }
      const target = deep(dataSource)
      if (target) {
        target[dataIndex] = value
        this.sheets[this.selectSheet] = dataSource
      }
    },
    // 改变页面是否初始化
    changePageInitState (value) {
      this.isFirstLoad = value
    },
    // 展开全部
    unfoldAll () {
      const keys = []
      this.getSheet.forEach(item => {
        if (Object.prototype.hasOwnProperty.call(item, 'children') && !item.single) {
          keys.push(item.id)
        }
      })
      this.expandedRowKeys = keys
    },
    // 折叠全部
    foldAll () {
      this.expandedRowKeys = []
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
    },
    // 获取表格数据
    getSheet () {
      // 判断是否为有效值
      const isEffectiveValue = i => i !== null && i !== undefined && i !== ''
      // 深拷贝
      const sheet = [...this.sheets[this.selectSheet]]
      if (this.isFirstLoad) {
        sheet.splice(-2, 2)
        this.changePageInitState(false)
      }
      const result = []
      sheet.forEach(item => {
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
              Array.isArray(result[key]) &&
              !result[key].find(i => i.text === value)
            ) {
              if (/项目名称/.test(key)) key = '项目名称'
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
            项目名称: item['项目名称（户）'] || item['项目名称'],
            // '项目名称（笔）': [],
            风险分类: [],
            children: [
              {
                index: result.length,
                ...item,
                项目名称: item['项目名称（笔）'] || item['项目名称']
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
          if (isEffectiveValue(item['项目名称（户）'] || item['项目名称'])) {
            param['项目名称'] = item['项目名称（户）'] || item['项目名称']
          }

          // 判断数据合法性
          param = mergeParam(item, param)
          // param['项目名称'] = []
          param.children.push({
            index,
            ...item,
            项目名称: item['项目名称（笔）']
          })
          // 计算户的总减值和总余额
          Object.keys(item).forEach(key => {
            if (/余额|减值/.test(key)) {
              param[key] += item[key]
            }
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
      // 设置减值和余额的th
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
            },
            align: 'right'
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
    }
  },
  unmounted () {
    window.removeEventListener('resize', this.getTableScrollY)
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
    background: #fff;
    height: calc(100% - 65px);
    overflow: auto;

    .tab-content-action-bar {
      margin-right: 25px;

      button + button {
        margin-left: 10px;
      }
    }

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

    .tag-list /deep/ .ant-tag ~ .ant-tag {
      margin-top: 5px;
    }

    .custom-title {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .statistics-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;

      & .ant-statistic {
        margin: 0 50px;
      }
    }
  }
}
</style>
