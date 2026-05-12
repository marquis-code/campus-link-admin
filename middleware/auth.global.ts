export default defineNuxtRouteMiddleware((to) => {
  const { token } = useUser()
  
  const publicPaths = ['/login', '/']
  const isPublicPath = publicPaths.includes(to.path)

  if (token.value && isPublicPath) {
    return navigateTo('/dashboard')
  }

  if (!token.value && !isPublicPath) {
    return navigateTo('/login')
  }
})
