<script setup lang="ts">
import BaseInput from '@/components/BaseInput.vue';
import EventCard from '@/components/EventCard.vue';
import router from '@/router';
import EventService from '@/services/EventService';
import type { Event } from '@/types.ts'
import { ref, computed, watchEffect, onMounted } from 'vue';
const events = ref<Event[] | null>(null);
const keyword = ref('')
const totalEvents = ref(0);
const hasNextPage = computed(() => {
  const totalPages = Math.ceil(totalEvents.value / /* props.totalPage */ 3)
  return page.value < totalPages
})

const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  totalPage: {
    type: Number,
    required: true
  }
})
const page = computed(() => props.page)

const updateKeyword = () => {
  let queryFunction;
  if (keyword.value === '') {
    queryFunction = EventService.getEvents(3, page.value)
  } else {
    queryFunction = EventService.getEventsByKeyword(keyword.value, 3, page.value)
  }
  queryFunction.then(res => {
    events.value = res.data
    console.log('events', events.value);
    totalEvents.value = res.headers['x-total-count']
    console.log('totalEvent', totalEvents.value);
  })
    .catch(() => {
      router.push({ name: 'network-error-view' })
    })
}
onMounted(() => {
  events.value = null
  watchEffect(() => {
    updateKeyword()
  })
})
</script>

<template>
  <h1>Events For Good</h1>
  <main class="flex flex-col items-center">
    <div class="w-64">
      <BaseInput @input="updateKeyword" v-model="keyword" label="Search..." class="w-full" />
    </div>
    <EventCard v-for="event in events" :key="event.id ?? 0" :event="event" />
    <div class="flex w-[290px]">
      <RouterLink class="flex-1 decoration-0 text-[#2c3e50] text-left"
        :to="{ name: 'event-list-view', query: { page: page - 1, _limit: totalPage } }" rel="prev" v-if="page != 1">
        Prev Page
      </RouterLink>
      <RouterLink id="page-next" class="flex-1 decoration-0 text-[#2c3e50] text-right"
        :to="{ name: 'event-list-view', query: { page: page + 1, _limit: totalPage } }" rel="next" v-if="hasNextPage">
        Next Page
      </RouterLink>
    </div>
  </main>

</template>
