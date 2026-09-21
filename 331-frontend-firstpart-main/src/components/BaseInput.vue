<script setup lang="ts">
const modelValue = defineModel()

interface BaseInputProps {
  label: string
}

const props = withDefaults(defineProps<BaseInputProps>(), {
  label: ''
})
</script>

<template>
  <label v-if="label" class="block text-gray-500 font-bold">
    {{ props.label }}
  </label>
  <input
    class="h-13 w-full px-2.5 text-xl border border-gray-400 focus:border-emerald-500 focus:outline-none mb-6"
    v-bind="$attrs"
    v-model="modelValue"
    :placeholder="label"
  />
</template>