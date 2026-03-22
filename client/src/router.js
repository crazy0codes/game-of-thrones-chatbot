import { useEffect, useState } from 'react'

export const routes = {
  home: '/',
  choose: '/choose',
  chat: '/chat',
}

export function getStageFromPath(pathname) {
  if (pathname === routes.choose) {
    return 'choose'
  }

  if (pathname === routes.chat) {
    return 'chat'
  }

  return 'home'
}

export function useSimpleRouter() {
  const [stage, setStage] = useState(() => getStageFromPath(window.location.pathname))

  useEffect(() => {
    const nextStage = getStageFromPath(window.location.pathname)

    if (nextStage !== stage) {
      setStage(nextStage)
    }

    if (window.location.pathname !== routes[nextStage]) {
      window.history.replaceState({}, '', routes[nextStage])
    }

    function handlePopState() {
      setStage(getStageFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [stage])

  function navigateTo(nextStage, { replace = false } = {}) {
    const nextPath = routes[nextStage] || routes.home

    if (window.location.pathname !== nextPath) {
      const method = replace ? 'replaceState' : 'pushState'
      window.history[method]({}, '', nextPath)
    }

    setStage(nextStage)
  }

  function navigateBack(fallbackStage = 'home') {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    navigateTo(fallbackStage, { replace: true })
  }

  return {
    stage,
    navigateBack,
    navigateTo,
    routes,
  }
}
