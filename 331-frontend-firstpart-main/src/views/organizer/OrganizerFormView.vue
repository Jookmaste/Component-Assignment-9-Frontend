<script setup lang="ts">
import type { Organizer } from '@/types'
import { ref } from 'vue'
import OrganizerService from '@/services/OrganizerService'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

// ปรับให้ไม่มี id ตั้งแต่แรก หรือใช้ Partial<Organizer> เพื่อไม่ให้ส่ง id: null ไปยัง Backend
const organizer = ref<Omit<Organizer, 'id'>>({
  name: '',
  address: ''
})

const router = useRouter()
const store = useMessageStore()

function saveOrganizer() {
  OrganizerService.saveOrganizer(organizer.value as Organizer)
    .then((response) => {
      store.updateMessage('Successfully added organizer: ' + response.data.name)
      setTimeout(() => {
        store.resetMessage()
      }, 3000)
      // แก้ไขชื่อ Route ให้ตรงกับใน index.ts (event-list-view)
      router.push({ name: 'event-list-view' })
    })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
}
</script>

<template>
  <div class="max-w-md mx-auto my-8">
    <h1 class="text-2xl font-bold mb-4">Add Organizer</h1>
    <form @submit.prevent="saveOrganizer">
      <label class="block text-gray-700 font-bold mb-2">Organizer Name</label>
      <input
        v-model="organizer.name"
        type="text"
        placeholder="Name"
        class="h-10 w-full px-3 mb-4 border border-gray-400 rounded focus:outline-none focus:border-emerald-500"
        required
      />

      <label class="block text-gray-700 font-bold mb-2">Address</label>
      <input
        v-model="organizer.address"
        type="text"
        placeholder="Address"
        class="h-10 w-full px-3 mb-6 border border-gray-400 rounded focus:outline-none focus:border-emerald-500"
        required
      />

      <button
        type="submit"
        class="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600 transition duration-200"
      >
        Submit
      </button>
    </form>
  </div>
</template>