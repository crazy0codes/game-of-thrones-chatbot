const icons = {
  politics: '≋',
  magic: '✦',
  history: '▣',
  strategy: '⚑',
}

function ChoosePage({
  disciplines,
  onBeginResearch,
  onSelectDiscipline,
  selectedDisciplineId,
}) {
  return (
    <main className="choose-shell">
      <div className="choose-aura" aria-hidden="true" />

      <section className="choose-hero">
        <p className="choose-kicker">The Citadel&apos;s Initiation</p>
        <h1>Choose Your Allegiance</h1>
        <p className="choose-copy">
          Your path through the Ledger is dictated by your House. Select the
          discipline that governs your research to focus the Citadel&apos;s archives.
        </p>
      </section>

      <section className="choose-grid" aria-label="Available disciplines">
        {disciplines.map((discipline) => {
          const isSelected = discipline.id === selectedDisciplineId

          return (
            <button
              key={discipline.id}
              type="button"
              className={`choose-card ${isSelected ? 'choose-card-selected' : ''}`}
              onClick={() => onSelectDiscipline(discipline.id)}
            >
              <span className="choose-card-icon" aria-hidden="true">
                {icons[discipline.id]}
              </span>
              <h2>{discipline.title}</h2>
              <p>{discipline.description}</p>
            </button>
          )
        })}
      </section>

      <section className="choose-actions">
        <button className="choose-button" type="button" onClick={onBeginResearch}>
          Begin Research
        </button>
        <p>Your choice can be amended within the Maester&apos;s Shelf later.</p>
      </section>

      <div className="choose-seal" aria-hidden="true">
        <span>⌂</span>
      </div>
    </main>
  )
}

export default ChoosePage
