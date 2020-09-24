<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-input v-model:value="value" @pressEnter="check" />
      <check-outlined class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper">
      {{ value || ' ' }}
      <edit-outlined class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>

<script>
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue'

export default {
  name: 'EditableCell',
  components: {
    CheckOutlined,
    EditOutlined
  },
  props: {
    text: String,
    onChange: Function
  },
  data () {
    return {
      value: this.text,
      editable: false
    }
  },
  methods: {
    handleChange (e) {
      this.value = e.target.value
    },
    check () {
      this.editable = false
      this.$message.success('修改成功')
      this.$emit('change', this.value)
    },
    edit () {
      this.editable = true
    }
  }
}
</script>

<style scoped>

</style>
