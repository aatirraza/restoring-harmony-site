// Professor James's gifts, including the King of Light sword.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Gifts() {
  return (
    <section className="realm" id="gifts">
      <div className="plate" data-img="L09"></div>
      <div className="shade"></div>
      <div className="wrap grid2">
        <div className="copy rv">
          <div className="eyebrow">The firelit study</div>
          <h2>What Professor James <em>gave them</em></h2>
          <p>From an old scroll he reads of a silk lost for ages. Then, in the basement below his study, he hands over everything they will need for the mountain.</p>
          <div className="giftnote" id="giftNote" aria-live="polite"><h3>Choose a gift</h3><p className="hint">Each one goes with Harmony and DJ into the dark.</p></div>
        </div>
        <div className="gifts rv" role="group" aria-label="The professor's gifts">
          <button className="gift" data-g="map" aria-pressed="false"><svg viewBox="0 0 60 60"><path d="M8 14 L22 9 L38 15 L52 10 L52 46 L38 51 L22 45 L8 50 Z"/><path d="M22 9 V45 M38 15 V51"/><path d="M28 28 l5 5 m0 -5 l-5 5"/></svg><b>The map</b></button>
          <button className="gift" data-g="coins" aria-pressed="false"><svg viewBox="0 0 60 60"><ellipse cx="30" cy="44" rx="15" ry="4.5"/><ellipse cx="30" cy="38" rx="15" ry="4.5"/><ellipse cx="30" cy="32" rx="15" ry="4.5"/><ellipse cx="30" cy="26" rx="15" ry="4.5"/></svg><b>Seven gold coins</b></button>
          <button className="gift" data-g="robe" aria-pressed="false"><svg viewBox="0 0 60 60"><path d="M22 8 L30 14 L38 8 L50 18 L44 26 L42 22 L42 52 L18 52 L18 22 L16 26 L10 18 Z"/><path d="M30 14 V52"/></svg><b>Fine linen robe</b></button>
          <button className="gift" data-g="sandals" aria-pressed="false"><svg viewBox="0 0 60 60"><path d="M15 12 C9 12 9 50 17 50 C23 50 23 12 15 12 Z"/><path d="M43 12 C37 12 37 50 45 50 C51 50 51 12 43 12 Z"/><path d="M11 26 L21 22 M39 26 L49 22"/></svg><b>Sandals</b></button>
          <button className="gift" data-g="sword" aria-pressed="false"><svg viewBox="0 0 60 60"><path d="M30 4 L33.5 12 L33.5 40 L26.5 40 L26.5 12 Z"/><path d="M18 40 H42"/><path d="M30 40 V52"/><circle cx="30" cy="54" r="2.5"/></svg><b>Two-edged sword</b></button>
          <button className="gift" data-g="scroll" aria-pressed="false"><svg viewBox="0 0 60 60"><rect x="14" y="12" width="32" height="36" rx="2"/><path d="M10 12 h40 M10 48 h40"/><path d="M20 22 h20 M20 28 h20 M20 34 h14"/></svg><b>The old scroll</b></button>
        </div>
      </div>
      <button className="glint" data-coin="5" style={{right:"12%",top:"10%"}} aria-label="A glint of gold"></button>
    </section>
  );
}
