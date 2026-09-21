import { createRouter, createWebHistory } from 'vue-router'
import EventService from '@/services/EventService'
import EventListView from '@/views/EventListView.vue'
import AboutView from '@/views/AboutView.vue'
import EventDetailView from '@/views/event/DetailView.vue'
import EventRegisterView from '@/views/event/RegisterView.vue'
import EventEditView from '@/views/event/EditView.vue'
import EventLayoutView from '@/views/event/LayoutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NetworkErrorView from '@/views/NetworkErrorView.vue'
import nProgress from 'nprogress'
import { useEventStore } from '@/stores/event'
import AddEventView from '@/views/event/EventFormView.vue'
import AddOrganizerView from '@/views/organizer/OrganizerFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'event-list-view',
      component: EventListView,
      props: (route) => ({ page: parseInt(route.query.page as string) || 1 }),
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/add-event',
      name: 'add-event',
      component: AddEventView,
    },
    {
      path: '/add-organizer',
      name: 'add-organizer',
      component: AddOrganizerView,
    },
    {
      path: '/event/:id',
      name: 'event-layout-view',
      component: EventLayoutView,
      props: true,
      beforeEnter: (to, from, next) => {
        const id = parseInt(to.params.id as string)

        EventService.getEvent(id)
          .then((response) => {
            const eventStore = useEventStore()
            eventStore.setEvent(response.data)
            next()
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              next({
                name: '404-resource-view',
                params: { resource: 'event' },
              })
            } else {
              next({ name: 'network-error-view' })
            }
          })
      },
      children: [
        {
          path: '',
          name: 'event-detail-view',
          component: EventDetailView,
        },
        {
          path: 'register',
          name: 'event-register-view',
          component: EventRegisterView,
        },
        {
          path: 'edit',
          name: 'event-edit-view',
          component: EventEditView,
        },
      ],
    },
    {
      path: '/404/:resource',
      name: '404-resource-view',
      component: NotFoundView,
      props: true,
    },
    {
      path: '/network-error',
      name: 'network-error-view',
      component: NetworkErrorView,
    },
    {
      path: '/:catchAll(.*)*',
      name: 'not-found',
      component: NotFoundView,
      props: { resource: 'page' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})

export default router