const path = require('path')
const XLSX = require('xlsx')

// 获取 sheet 表头
function getSheetHeader (sheet) {
  if (sheet['!ref']) {
    const headers = []
    /*
     sheet1['!ref'] 获取工作薄的有效范围 'A1:C20'
     XLSX.utils.decode_range 将有效范围转为 range对象
     range: {s: {r:0, c:0}, e: {r:10, 3}}
    */
    const range = XLSX.utils.decode_range(sheet['!ref'])
    // worksheet['!ref'] 是工作表的有效范围
    let C
    /* 获取单元格值 start in the first row */
    const R = range.s.r // 行 //C 列
    for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
      // {c:C,r:R} 单元格地址
      const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* 根据地址得到单元格的值find the cell in the first row */
      // let hdr = 'UNKNOWN ' + C // <-- 替换为您想要的默认值replace with your desired default
      // XLSX.utils.format_cell 生成单元格文本值
      // if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
      // 判断表头是否合法
      if (cell && cell.t) {
        headers.push(XLSX.utils.format_cell(cell).replace(/\s|\r|\n/g, ''))
      }
    }
    return headers
  } else {
    return null
  }
}

// 去除对象的 key 值中的 \r \n \s
function trimKey (obj = Object || Array) {
  if (Array.isArray(obj)) {
    return obj.map(trimKey)
  } else {
    const newObj = {}
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = key.replace(/\s|\r|\n/g, '')
      if (Array.isArray(value)) {
        newObj[newKey] = value.map(i => trimKey(i))
      } else if (/Object/.test(Object.prototype.toString.call(value))) {
        newObj[newKey] = trimKey(value)
      } else {
        newObj[newKey] = value
      }
    })
    return newObj
  }
}

class Xlsx {
  constructor (filePath) {
    this.workbook = XLSX.readFile(path.join(filePath))
  }

  // 获取表名
  getSheetName () {
    return this.workbook.SheetNames
  }

  /**
   * 获取对应表表格数据
   * @desc 当传入 sheetName 数组和 Null 或者 Undefined 时返回数组，结果 key-value 对应表格 sheet 和其数据
   * @param {Array | String | Null | Undefined} sheetName
   * @return {Object}
   */
  getSheet (sheetName = Array || String || null || undefined) {
    if (Array.isArray(sheetName)) {
      const data = {}
      sheetName.forEach(sheet => {
        data[sheet] = XLSX.utils.sheet_to_json(this.workbook.Sheets[sheet])
      })
      return data
    } else if (typeof sheetName === 'string') {
      const worksheet = this.workbook.Sheets[sheetName]
      return trimKey(XLSX.utils.sheet_to_json(worksheet))
    } else {
      const data = {}
      this.workbook.SheetNames.forEach(sheetName => {
        data[sheetName] = trimKey(XLSX.utils.sheet_to_json(this.workbook.Sheets[sheetName]))
      })
      return data
    }
  }

  /**
   * 获取表格表头
   * @name getHeaderEow
   * @desc sheet1['!ref'] 获取工作薄的有效范围 'A1:C20'
   *       XLSX.utils.decode_range 将有效范围转为 range对象
   *       range: {s: {r:0, c:0}, e: {r:10, 3}}
   */
  getHeaderEow (sheetName = Array || String || null || undefined) {
    if (Array.isArray(sheetName)) {
      const data = {}
      sheetName.forEach(sheet => {
        data[sheet] = getSheetHeader(this.workbook.Sheets[sheet])
      })
      return data
    } else if (typeof sheetName === 'string') {
      return getSheetHeader(this.workbook.Sheets[sheetName])
    } else {
      const data = {}
      this.workbook.SheetNames.forEach(sheetName => {
        data[sheetName] = getSheetHeader(this.workbook.Sheets[sheetName])
      })
      return data
    }
  }
}

module.exports = {
  Xlsx
}
