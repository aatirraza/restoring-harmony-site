// Planet Conviction: Unity Pearl's silk with the golden string.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Conviction() {
  return (
    <section className="realm" id="conviction">
      <div className="plate" data-img="L06"></div>
      <div className="shade c"></div>
      <div className="wrap" style={{display:"grid",justifyItems:"center",textAlign:"center",gap:"20px"}}>
        <div className="eyebrow">Planet Conviction</div>
        <h2>The gift of <em>Unity Pearl</em></h2>
        <p>Beside a garden waterfall, the guardian prophetess places a purple silk in Harmony's hands, tied with a golden string. Unravel it only when the battle becomes overwhelming.</p>
        <div className="silkstage">
          <div className="scroll" id="scroll">
            <button className="cord" id="cord" aria-label="Untie the golden string"><svg viewBox="0 0 46 82" aria-hidden="true"><path d="M23 6 C7 16 7 32 23 36 C39 32 39 16 23 6 Z" stroke="#f1c47c" strokeWidth="2.4" fill="none"/><path d="M23 36 L15 76 M23 36 L31 76" stroke="#f1c47c" strokeWidth="2.4"/><circle cx="15" cy="77" r="3" fill="#f1c47c"/><circle cx="31" cy="77" r="3" fill="#f1c47c"/></svg></button>
            <div className="roll" aria-hidden="true"></div>
            <div className="cloth"><div className="words">
              <p className="quote">"You are loved by The King, my daughter. Be strong."</p>
              <p style={{color:"var(--ink-soft)"}}>"Patience is practiced, and knowledge must be applied to gain wisdom. Protect your loved ones."</p>
              <p className="hint">Unity Pearl, guardian prophetess of Planet Conviction</p>
            </div></div>
          </div>
          <p className="hint">Pull the golden string.</p>
        </div>
      </div>
      <button className="glint" data-coin="3" style={{right:"9%",bottom:"12%"}} aria-label="A glint of gold"></button>
    </section>
  );
}
