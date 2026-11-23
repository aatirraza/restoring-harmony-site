// The mountain: throw the silk heavenward, then the book end card.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Pandemonium() {
  return (
    <section className="realm" id="pandemonium">
      <div className="plate" data-img="L14"></div>
      <div className="shade c"></div>
      <canvas id="mountfx" style={{position:"absolute",left:"0",right:"0",top:"0",width:"100%",height:"46%",zIndex:"-1"}} aria-hidden="true"></canvas>
      <div className="wrap" style={{display:"grid",justifyItems:"center",textAlign:"center",gap:"20px"}}>
        <div className="eyebrow">The mountain</div>
        <h2>Throw the silk <em>heavenward</em></h2>
        <p>Armies on the ridge, helicopters in the storm. The ground splits and Pandemonium rises from the fire, with the same burning eyes that watched her from the dark.</p>
        <button className="btn" id="throwBtn" style={{marginTop:"10px"}}>Hold to call on the Universe</button>
        <p className="hint" id="throwHint" style={{fontStyle:"italic"}}>"Throw the silk heavenward and call on the Universe with all your inner might."</p>

        <div className="endcard" style={{textAlign:"left"}}>
          <img className="cover" alt="Restoring Harmony book cover: a young woman facing a golden storm cloud beneath a beam of light" src="/images/cover.jpg" />
          <div className="copy">
            <div className="eyebrow">Available now</div>
            <h2>Restoring <em>Harmony</em></h2>
            <p className="byline" style={{letterSpacing:".3em"}}>Tawaskee L. Hill</p>
            <p style={{color:"var(--ink-soft)"}}>Harmony Love Hill's journey from a child haunted by spectral terrors to a spiritual warrior, wielding faith as her weapon against evil.</p>
            <div><a className="btn" href="https://www.amazon.com/s?k=Restoring+Harmony+Tawaskee+Hill" target="_blank" rel="noopener">Find it on Amazon</a></div>
          </div>
        </div>
      </div>
      <button className="glint" data-coin="6" style={{left:"6%",bottom:"8%"}} aria-label="A glint of gold"></button>
    </section>
  );
}
