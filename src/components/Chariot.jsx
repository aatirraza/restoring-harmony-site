// The spirit realm: hold the sky to ascend with the pearl chariot.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Chariot() {
  return (
    <section className="realm" id="chariot">
      <div className="plate" data-img="L05"></div>
      <div className="shade r"></div>
      <canvas id="skyfx" style={{position:"absolute",inset:"0",width:"100%",height:"100%",zIndex:"-1"}} aria-hidden="true"></canvas>
      <div className="wrap">
        <div className="copy right rv">
          <div className="eyebrow">The spirit realm</div>
          <h2>A pearl chariot, <em>twelve rams</em></h2>
          <p>A white pearl chariot trimmed in pure gold lifts her above war-torn places. The King rides beside her. His hands are rough, his voice is like soft thunder, and his face stays turned away from us.</p>
          <p className="hint">Hold anywhere on the sky to ascend through the clouds.</p>
        </div>
      </div>
      <button className="glint" data-coin="2" style={{left:"46%",top:"84%"}} aria-label="A glint of gold"></button>
    </section>
  );
}
