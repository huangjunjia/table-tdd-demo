<template>
  <a-config-provider :locale="locale">
    <a-spin
      id="app-loading"
      :spinning="loading"
      tip="正在加载中..."
    >
      <router-view />
    </a-spin>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
export default {
  data () {
    return {
      locale: zhCN,
      loading: false
    }
  },
  provide () {
    return {
      loading: this.loadingFunc()
    }
  },
  mounted () {
    if (process.env.NODE_MODE === 'production') {
      window.onkeydown = e => {
        const event = window.event || e
        const code = event.keyCode || event.which
        if (code === 82 && (event.metaKey || event.ctrlKey)) {
          return false
        }
      }
    }
  },
  methods: {
    loadingFunc () {
      return {
        open: this.loadingOpen,
        close: this.loadingClose
      }
    },
    loadingOpen () {
      this.loading = true
    },
    loadingClose () {
      this.loading = false
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app-loading {
  width: 100vw;
  height: 100vh;
  max-height: 100%;
}

#app > .ant-spin-nested-loading, #app > .ant-spin-nested-loading > .ant-spin-container {
  height: 100%;
  width: 100%;
}
</style>
