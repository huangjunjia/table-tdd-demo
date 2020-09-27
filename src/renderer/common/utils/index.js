const utils = {
  /**
   * 获取uuid
   * @param {number} len uuid长度
   * @param {number} radix uuid类型，8：八进制，10：十进制，16：十六进制, 36: 0-1 A-Z, 62: 0-1 a-z A-Z
   * @param {string} placeholder 占位符，如果设置自动每6位添加一个
   * @param {number} splitDigit 分割位数 默认 6
   * @returns {string}
   */
  uuid (len = 8, radix = 10, placeholder = '', splitDigit = 6) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
      ''
    )
    const uuid = []
    let i
    radix = radix || chars.length
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
      if (placeholder) {
        let index = splitDigit
        while (index < uuid.length) {
          uuid.splice(index + index / splitDigit - 1, 0, placeholder)
          index += splitDigit
        }
      }
    } else {
      // rfc4122, version 4 form
      let r
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      // Fill in random data. At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16)
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    return uuid.join('')
  }
}

export default utils
