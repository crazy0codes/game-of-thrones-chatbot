import { useState } from 'react'

function ChatPage({
  discipline,
  error,
  isSending,
  messages,
  onNewInquiry,
  onResetConversation,
  onSendMessage,
}) {
  const [draft, setDraft] = useState('')
  const latestAssistantMessage =
    [...messages].reverse().find((message) => message.role === 'assistant') ||
    messages[0]
  const sigil = discipline.house.includes('Stark')
    ? '🐺'
    : discipline.house.includes('Lannister')
      ? '🦁'
      : discipline.house.includes('Targaryen')
        ? '🐉'
        : '🦌'

  function handleSubmit(event) {
    event.preventDefault()

    if (!draft.trim()) {
      return
    }

    onSendMessage(draft)
    setDraft('')
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter') {
      return
    }

    const isTextarea = event.currentTarget.tagName === 'TEXTAREA'

    if (isTextarea && event.shiftKey) {
      return
    }

    event.preventDefault()

    if (!draft.trim() || isSending) {
      return
    }

    onSendMessage(draft)
    setDraft('')
  }

  return (
    <main className="chat-shell">
      <aside className="chat-sidebar">
        <div className="chat-brand">
          <div className="chat-brand-mark">✺</div>
          <div>
            <strong>The Maester&apos;s Shelf</strong>
            <p>Oldtown research</p>
          </div>
        </div>

        <nav className="chat-sidebar-nav" aria-label="Archive sections">
          <span className="chat-nav-item chat-nav-item-active">Chronicles</span>
          <span className="chat-nav-item">Lineages</span>
          <span className="chat-nav-item">Bestiary</span>
          <span className="chat-nav-item">Vault</span>
        </nav>

        <button className="chat-primary-side-button" type="button" onClick={onNewInquiry}>
          New Inquiry
        </button>

        <div className="chat-sidebar-footer">
          <span>Settings</span>
          <span>Log Out</span>
        </div>
      </aside>

      <section className="chat-main">
        <header className="chat-header">
          <h1>The Citadel&apos;s Ledger</h1>
          <div className="chat-top-actions">
            <span>⌲</span>
            <span>⌕</span>
          </div>
        </header>

        <div className="chat-layout">
          <aside className="chat-column chat-column-left">
            <article className="dashboard-card allegiance-card">
              <span className="dashboard-kicker">Current allegiance</span>
              <h2>{discipline.house.replace('House ', 'House\n')}</h2>
              <p className="allegiance-motto">{discipline.motto}</p>
              <div className="allegiance-sigil" aria-hidden="true">
                <span>{sigil}</span>
              </div>
            </article>

            <article className="dashboard-card lore-card">
              <h3>Saved Lore</h3>
              <ul className="lore-list">
                <li>
                  <strong>The Long Night</strong>
                  <span>Ancient Histories · Vol IV</span>
                </li>
                <li>
                  <strong>Targaryen Dragons</strong>
                  <span>Bestiary · Dracarys</span>
                </li>
                <li>
                  <strong>Wildfire Alchemy</strong>
                  <span>Pyromancy · Secret Scrolls</span>
                </li>
              </ul>
            </article>
          </aside>

          <section className="chat-column chat-column-center">
            <section className="dashboard-card chat-parchment">
              <div className="chat-thread-header">
                <h2>Grand Maester Pycelle</h2>
                <span>Scribe of the Citadel</span>
              </div>

              <div className="chat-thread" role="log" aria-live="polite">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`message-bubble message-${message.role}`}
                  >
                    <p>{message.content}</p>
                  </article>
                ))}

                {isSending ? (
                  <article className="message-bubble message-assistant message-pending">
                    <p>He scratches at the parchment...</p>
                  </article>
                ) : null}
              </div>

              {error ? <p className="chat-error">{error}</p> : null}

              <form className="chat-form" onSubmit={handleSubmit}>
                <label className="sr-only" htmlFor="chat-input">
                  Ask Pycelle a question
                </label>
                <textarea
                  id="chat-input"
                  className="chat-input"
                  rows="3"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write your inquiry..."
                />
                <div className="chat-form-actions">
                  <button className="chat-send-button" type="submit" disabled={isSending}>
                    ➤
                  </button>
                </div>
              </form>
            </section>
          </section>

          <aside className="chat-column chat-column-right">
            <article className="dashboard-card world-card">
              <div className="world-card-header">
                <h3>The Known World</h3>
                <span>↗</span>
              </div>
              <div className="world-map" aria-hidden="true">
                <span className="map-pin map-pin-red" />
                <span className="map-pin map-pin-dark" />
              </div>
              <div className="world-tags">
                <span>Winterfell</span>
                <span>Oldtown</span>
                <span>King&apos;s Landing</span>
              </div>
            </article>

            <article className="dashboard-card glossary-card">
              <span className="dashboard-kicker">Lore definition</span>
              <h3>Valyrian Steel</h3>
              <p>
                Valyrian steel is a form of metal forged in the old Freehold,
                whispered over with spells and impossible heat.
              </p>
              <em>
                &quot;Lighter, stronger, and sharper than even the best castle forged
                steel.&quot;
              </em>
              <button type="button" className="glossary-lock" onClick={onResetConversation}>
                ⌂
              </button>
            </article>
          </aside>
        </div>

        <section className="chat-mobile-dashboard">
          <header className="mobile-chat-header">
            <strong>The Citadel</strong>
            <button className="mobile-avatar" type="button" aria-label="Current house">
              {sigil}
            </button>
          </header>

          <article className="mobile-card mobile-message-card mobile-message-assistant">
            <div className="mobile-card-head">
              <h3>Grand Maester Pycelle</h3>
              <span>Yesterday</span>
            </div>
            <p>{latestAssistantMessage?.content}</p>
          </article>

          <article className="mobile-card mobile-message-card mobile-message-user">
            <div className="mobile-card-head">
              <h3>Your Response</h3>
              <span>Just now</span>
            </div>
            <p>{messages.filter((message) => message.role === 'user').at(-1)?.content || 'Your next question will appear here.'}</p>
          </article>

          {error ? <p className="chat-error mobile-error">{error}</p> : null}

          <form className="mobile-chat-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="mobile-chat-input">
              Ask Pycelle a question
            </label>
            <textarea
              id="mobile-chat-input"
              className="mobile-chat-input"
              rows="1"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Scribe a message..."
            />
            <button className="chat-send-button" type="submit" disabled={isSending}>
              ➤
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default ChatPage
