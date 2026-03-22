function Home({ onEnter }) {
  return (
    <main className="landing-shell">
      <div className="landing-vignette" aria-hidden="true" />
      <div className="landing-glow" aria-hidden="true" />

      <div className="landing-corner landing-corner-right">
        <div className="landing-corner-glyph">⬒</div>
        <span>Oldtown Records</span>
      </div>

      <div className="landing-corner landing-corner-left">
        <div className="landing-corner-glyph">⌲</div>
      </div>

      <section className="landing-stage">
        <div className="landing-candle" aria-hidden="true">
          <span className="landing-wick" />
          <span className="landing-flame" />
        </div>

        <p className="landing-kicker">The Citadel&apos;s Ledger</p>
        <h1>Who seeks the counsel of the Grand Maester?</h1>

        <div className="landing-divider" aria-hidden="true">
          <span />
          <i>⌘</i>
          <span />
        </div>

        <button className="landing-button" type="button" onClick={onEnter}>
          <span className="landing-key">⟐</span>
          Enter the Citadel
        </button>

        <p className="landing-note">
          By command of the conclave, all knowledge within is archived by the
          order of maesters.
        </p>
      </section>
    </main>
  )
}

export default Home
