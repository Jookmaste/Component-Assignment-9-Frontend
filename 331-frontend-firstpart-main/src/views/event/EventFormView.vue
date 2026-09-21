<script setup lang="ts">
import type { Event, Organizer } from '@/types'
import { ref, onMounted } from 'vue'
import EventService from '@/services/EventService'
import OrganizerService from '@/services/OrganizerService'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'

const event = ref<Event>({
  id: null,
  category: '',
  title: '',
  description: '',
  location: '',
  date: '',
  time: '',
  petsAllowed: false,
  organizer: {
    id: 0,
    name: ''
  }
})

const organizers = ref<Organizer[]>([])
const router = useRouter()
const store = useMessageStore()

onMounted(() => {
  OrganizerService.getOrganizers()
    .then((response) => {
      organizers.value = response.data
    })
    .catch((error) => {
      console.error('Failed to load organizers:', error)
      // ไม่ต้องสั่ง router.push ไปหน้า network-error-view เพื่อป้องกันหน้าค้างขณะ Render
    })
})

function saveEvent() {
  EventService.saveEvent(event.value)
    .then((response) => {
      // เมื่อเซฟสำเร็จ ให้ Push ไปหน้า event-detail-view
      router.push({ name: 'event-detail-view', params: { id: response.data.id } })
      store.updateMessage('You are successfully add a new event for ' + response.data.title)
      setTimeout(() => {
        store.resetMessage()
      }, 3000)
    })
    .catch((error) => {
      console.error('Failed to save event:', error)
    })
}
</script>

<template>
  <div>
    <h1>Create an event</h1>
    <form @submit.prevent="saveEvent">
      <BaseInput v-model="event.category" type="text" label="Category" />

      <h3>Name & describe your event</h3>
      <BaseInput v-model="event.title" type="text" label="Title" />
      <BaseInput v-model="event.description" type="text" label="Description" />

      <h3>Where is your event?</h3>
      <BaseInput v-model="event.location" type="text" label="Location" />

      <h3>Who is your organizer?</h3>
      <BaseSelect v-if="organizers.length"
        v-model="event.organizer.id"
        :options="organizers"
        label="Select an Organizer"
      />

      <button
        class="flex w-fit mx-auto items-center justify-center h-13 px-10 rounded-md font-semibold whitespace-nowrap border border-gray-400 focus:border-emerald-500 transition-all duration-200 ease-linear hover:scale-105 hover:border-emerald-500 hover:shadow-lg active:scale-100 focus:outline-none"
        type="submit"
      >
        Submit
      </button>
    </form>

    <pre>{{ event }}</pre>
  </div>
</template>