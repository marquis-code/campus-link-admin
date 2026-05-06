export default defineNuxtRouteMiddleware((to) => {
  const { token } = useUser()
  
  if (!token.value && to.path !== '/login' && to.path !== '/signup' && to.path !== '/') {
    return navigateTo('/')
  }
})
