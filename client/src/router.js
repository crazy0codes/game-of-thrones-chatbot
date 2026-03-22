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
    function handlePopState() {
      setStage(getStageFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  function navigateTo(nextStage, { replace = false } = {}) {
    const safeStage = routes[nextStage] ? nextStage : 'home'
    const nextPath = routes[safeStage]

    if (window.location.pathname !== nextPath) {
      const method = replace ? 'replaceState' : 'pushState'
      window.history[method]({}, '', nextPath)
    }

    setStage(safeStage)
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
