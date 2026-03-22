import { useEffect, useState } from 'react'
import Home from './pages/Home.jsx'
import ChoosePage from './pages/Choose.jsx'
import ChatPage from './pages/chat.jsx'
import './App.css'

const apiBaseUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '')

const disciplines = [
  {
    id: 'politics',
    title: 'Politics',
    description:
      'The art of governance, lineage disputes, and the intricate dance of the Great Houses.',
    house: 'House Lannister',
    motto: 'Hear Me Roar!',
  },
  {
    id: 'magic',
    title: 'Magic',
    description:
      'The study of valyrian steel, higher mysteries, and the whispers of the long night.',
    house: 'House Targaryen',
    motto: 'Fire and Blood',
  },
  {
    id: 'history',
    title: 'History',
    description:
      'Tracing the footsteps of the First Men and the Andals through thousands of years.',
    house: 'House Stark',
    motto: 'Winter is Coming',
  },
  {
    id: 'strategy',
    title: 'Strategy',
    description:
      'Commanding armies, logistics of war, and the fortification of the seven kingdoms.',
    house: 'House Baratheon',
    motto: 'Ours is the Fury',
  },
]

const openingMessages = [
  {
    id: 'opening-1',
    role: 'assistant',
    content:
      'You stand at the threshold at last. State your matter plainly. My ink is not immortal.',
  },
]

const routes = {
  home: '/',
  choose: '/choose',
  chat: '/chat',
}

function getStageFromPath(pathname) {
  if (pathname === routes.choose) {
    return 'choose'
  }

  if (pathname === routes.chat) {
    return 'chat'
  }

  return 'home'
}

function App() {
  const [stage, setStage] = useState(() => getStageFromPath(window.location.pathname))
  const [selectedDiscipline, setSelectedDiscipline] = useState(disciplines[2])
  const [messages, setMessages] = useState(openingMessages)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

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

  async function handleSendMessage(input) {
    const trimmed = input.trim()

    if (!trimmed || isSending) {
      return
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setIsSending(true)
    setError('')

    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'The ravens returned with nothing useful.')
      }

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
        },
      ])
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSending(false)
    }
  }

  function handleEnterCitadel() {
    navigateTo('choose')
  }

  function handleResetConversation() {
    setMessages(openingMessages)
    setError('')
  }

  function handleDismissError() {
    setError('')
  }

  function handleSelectDiscipline(disciplineId) {
    const nextDiscipline = disciplines.find((discipline) => discipline.id === disciplineId)

    if (!nextDiscipline) {
      return
    }

    setSelectedDiscipline(nextDiscipline)
  }

  function handleBeginResearch() {
    navigateTo('chat')
  }

  if (stage === 'home') {
    return <Home onEnter={handleEnterCitadel} />
  }

  if (stage === 'choose') {
    return (
      <ChoosePage
        disciplines={disciplines}
        onBack={() => navigateBack('home')}
        onBeginResearch={handleBeginResearch}
        onSelectDiscipline={handleSelectDiscipline}
        selectedDisciplineId={selectedDiscipline.id}
      />
    )
  }

  return (
    <ChatPage
      discipline={selectedDiscipline}
      error={error}
      isSending={isSending}
      messages={messages}
      onBack={() => navigateBack('choose')}
      onDismissError={handleDismissError}
      onNewInquiry={() => navigateTo('choose')}
      onResetConversation={handleResetConversation}
      onSendMessage={handleSendMessage}
    />
  )
}

export default App
