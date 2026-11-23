// The warehouse: charge and fire the Life Light.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function LifeLight() {
  return (
    <section className="realm" id="lifelight">
      <div className="plate" data-img="L07"></div>
      <div className="shade"></div>
      <div className="wrap grid2">
        <div className="copy rv">
          <div className="eyebrow">The warehouse</div>
          <h2>The <em>Life Light</em></h2>
          <p>DJ is caged. Hooded walkers chant by firelight. Under the truck seat waits his invention, fully charged. Harmony says a silent prayer, aims, and pulls the trigger. What pours out of the light is music.</p>
          <div className="lifeui">
            <button className="lifebtn" id="lifeBtn" aria-label="Press and hold to charge the Life Light, release to fire"><svg viewBox="0 0 136 136" aria-hidden="true"><circle cx="68" cy="68" r="62" stroke="rgba(255,255,255,.14)" strokeWidth="3" fill="none"/><circle id="lifeRing" cx="68" cy="68" r="62" stroke="#fff1d4" strokeWidth="3" fill="none" strokeDasharray="390" strokeDashoffset="390" strokeLinecap="round"/></svg><span className="lbl">Hold<br />to charge</span></button>
            <p className="hint" id="lifeHint" style={{maxWidth:"24ch"}}>Press and hold, then release to fire.</p>
          </div>
        </div>
        <div className="glass ar rv"><canvas id="lifeCanvas"></canvas></div>
      </div>
      <button className="glint" data-coin="4" style={{left:"4%",top:"12%"}} aria-label="A glint of gold"></button>
    </section>
  );
}
