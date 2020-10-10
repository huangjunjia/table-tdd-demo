class DatabaseFactory {
  constructor (model) {
    this.model = model
  }

  /**
   * 查询一条或多条指定数据
   * @param {Object} doc
   * @return {Promise<Object>} docs
   * */
  find (doc) {
    return new Promise((resolve, reject) => {
      this.model.find(doc, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs)
        }
      })
    })
  }

  /**
   * 查询一条指定数据
   * @param {Object} doc
   * @return {Promise<Object>} docs
   * */
  findOne (doc) {
    return new Promise((resolve, reject) => {
      this.model.findOne(doc, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs)
        }
      })
    })
  }

  /**
   * 查询全部数据
   * @return {Promise<Object>} docs
   * */
  findAll () {
    return new Promise((resolve, reject) => {
      this.model.find({}, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs)
        }
      })
    })
  }

  /**
   * 插入数据
   * @param {Object} doc
   * @return {Promise<Object>} docs
   * */
  insert (doc) {
    return new Promise((resolve, reject) => {
      this.model.insert(doc, (err, newDoc) => {
        if (err) {
          reject(err)
        } else {
          resolve(newDoc)
        }
      })
    })
  }

  /**
   * 获取表符合条件的数据数量
   * @param {Object} doc
   * @return {Promise<Number>} count
   * */
  count (doc) {
    return new Promise((resolve, reject) => {
      this.model.count(doc, (err, count) => {
        if (err) {
          reject(err)
        } else {
          resolve(count)
        }
      })
    })
  }

  /**
   * 获取表全部数据数量
   * @return {Promise<Number>} count
   * */
  countAll () {
    return new Promise((resolve, reject) => {
      this.model.count({}, (err, count) => {
        if (err) {
          reject(err)
        } else {
          resolve(count)
        }
      })
    })
  }

  /**
   * 更新单条数据
   * @param {Object} doc
   * @param {Object} updateDoc
   * @param {Object} options
   * @returns {Promise<Number, Object>}
   */
  update (doc, updateDoc, options = {}) {
    return new Promise((resolve, reject) => {
      this.model.update(doc, updateDoc, options, (err, numReplaced, upsert) => {
        if (err) {
          reject(err)
        } else {
          resolve(numReplaced, upsert)
        }
      })
    })
  }

  /**
   * 删除数据
   * @param {Object} doc
   * @param {Object} options
   * @returns {Promise<Number>}
   */
  remove (doc, options = {}) {
    return new Promise((resolve, reject) => {
      this.model.remove(doc, options, (err, numRemoved) => {
        if (err) {
          reject(err)
        } else {
          resolve(numRemoved)
        }
      })
    })
  }
}

export {
  DatabaseFactory
}
