<script setup lang="ts">
import OrganizerService from '@/services/OrganizerService';
import { useMessageStore } from '@/stores/message';
import type { Organizer } from '@/types';
import { ref } from 'vue';

const store = useMessageStore()
const organizer = ref<Organizer>({
    id: 0,
    name: '',
})
const saveOrganizer = () => {
    OrganizerService.saveOrganizer(organizer.value)
        .then(res => {
            store.updateMessage('Successfully add new organizer ' + res.data.name)
            setTimeout(() => {
                store.resetMessage()
            }, 3000)
        })
}
</script>

<template>
    <h1>Create an organizer</h1>
    <form @submit.prevent="saveOrganizer">
        <h3>Your organizer details</h3>
        <label class="block text-gray-500 font-bold">Name</label>
        <input v-model="organizer.name" type="text" placeholder="Name"
            class="h-13 w-full px-2.5 text-xl border border-gray-400 focus:border-emerald-500 focus:outline-none mb-6">
        <label class="block text-gray-500 font-bold">Address</label>
        <input v-model="organizer" type="text" placeholder="Name"
            class="h-13 w-full px-2.5 text-xl border border-gray-400 focus:border-emerald-500 focus:outline-none mb-6">
        <button
            class="flex w-fit mx-auto items-center justify-center h-13 px-10 rounded-md font-semibold whitespace-nowrap border border-gray-400 focus:border-emerald-500 transition-all duration-200 ease-linear hover:scale-105 hover:border-emerald-500 hover:shadow-lg active:scale-100 focus:outline-none"
            type="submit">Create</button>
    </form>

    <pre>{{ organizer }}</pre>
</template>