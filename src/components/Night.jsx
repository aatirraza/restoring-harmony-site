// The night without light: cursor torch and the eyes in the cave.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Night() {
  return (
    <section className="realm" id="night">
      <div className="plate" data-img="L10" style={{filter:"brightness(.55)"}}></div>
      <div className="shade r"></div>
      <div className="wrap grid2">
        <div className="glass ar rv"><canvas id="nightCanvas" style={{cursor:"none",touchAction:"none"}}></canvas></div>
        <div className="copy rv">
          <div className="eyebrow">The night without light</div>
          <h2>Carry <em>the fire</em></h2>
          <p>In a land without light, a tribe huddles in its cave. Wolves, hyenas and large cats wait with hungry eyes for night to fall, to feed on the fears that darkness unveils.</p>
          <p className="hint">Your cursor is a torch. The eyes will not come near it.</p>
          <p className="quote">"…no matter how bad things may get, trust in the Universal Sovereign and you will succeed."<cite>Unity Pearl</cite></p>
        </div>
      </div>
    </section>
  );
}
