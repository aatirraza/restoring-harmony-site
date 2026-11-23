// The ten-headed beast mini-game.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Temple() {
  return (
    <section className="realm" id="temple">
      <div className="plate" data-img="L12" style={{filter:"brightness(.6) saturate(.9)"}}></div>
      <div className="shade"></div>
      <div className="wrap grid2">
        <div className="copy rv">
          <div className="eyebrow">The temple</div>
          <h2>The beast of <em>ten heads</em></h2>
          <p>The crowd melts into shadow and becomes one beast. Twin dragons, twin serpents, twin possums, twin catfish, twin hogs. With every strike it separates, then reunites. Strike fast enough and it cannot.</p>
          <p className="quote">"Destroy each head, my lord, and you will conquer it."<cite>Harmony</cite></p>
          <div className="meter" aria-hidden="true"><i id="beastMeter"></i></div>
          <p className="hint" id="beastMsg" aria-live="polite">Ten pairs of eyes burn in the dark. Strike each one before the beast reunites.</p>
          <div><button className="btn ghost" id="beastReset" hidden>Face the beast again</button></div>
        </div>
        <div className="glass ar rv"><canvas id="beastCanvas" style={{cursor:"crosshair",touchAction:"manipulation"}}></canvas></div>
      </div>
    </section>
  );
}
