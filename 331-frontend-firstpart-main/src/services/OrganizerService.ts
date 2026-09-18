import axios from 'axios'
import type { Organizer } from '@/types'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json'
  }
})

export default {
  saveOrganizer(organizer: Organizer) {
    return apiClient.post('/organizers', organizer)
  }
}