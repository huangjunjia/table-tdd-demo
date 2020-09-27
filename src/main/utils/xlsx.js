const path = require('path')
const XLSX = require('xlsx')

class Xlsx {
  constructor (filePath) {
    this.workbook = XLSX.readFile(path.join(filePath))
  }

  // 获取表名
  getSheetName () {
    return this.workbook.SheetNames
  }

  // 获取对应表表格数据
  getSheet (sheetName = Array || String) {
    if (Array.isArray(sheetName)) {
      const data = {}
      sheetName.forEach(sheet => {
        data[sheet] = XLSX.utils.sheet_to_json(this.workbook.Sheets[sheet])
      })
      return data
    } else if (typeof sheetName === 'string') {
      const worksheet = this.workbook.Sheets[sheetName]
      return XLSX.utils.sheet_to_json(worksheet)
    }
  }
}

module.exports = {
  Xlsx
}
