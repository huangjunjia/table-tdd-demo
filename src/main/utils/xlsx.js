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

  /**
   * 获取表格表头
   * @name getHeaderEow
   * @desc sheet1['!ref'] 获取工作薄的有效范围 'A1:C20'
   *       XLSX.utils.decode_range 将有效范围转为 range对象
   *       range: {s: {r:0, c:0}, e: {r:10, 3}}
   */
  getHeaderEow () {
    const headers = {}
    this.getSheetName().forEach(sheetName => {
      const sheet = this.getSheet(sheetName)
      console.log(sheet)
      const range = XLSX.utils.decode_range(sheet['!ref'])
      // worksheet['!ref'] 是工作表的有效范围
      let C
      /* 获取单元格值 start in the first row */
      const R = range.s.r // 行 //C 列
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        // {c:C,r:R} 单元格地址
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] /* 根据地址得到单元格的值find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- 替换为您想要的默认值replace with your desired default
        // XLSX.utils.format_cell 生成单元格文本值
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers[sheetName] = hdr
      }
    })

    return headers
  }
}

module.exports = {
  Xlsx
}
