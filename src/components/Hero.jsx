// The Threshold: volcano den, burning eyes, title and gold beam.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Hero() {
  return (
    <header className="realm hero" id="threshold">
      <div className="plate" data-img="L01"></div>
      <div className="shade"></div>
      <canvas id="eyes" aria-hidden="true"></canvas>
      <div className="wrap inner">
        <div className="eyebrow">A novel by Tawaskee L. Hill</div>
        <h1 className="title" aria-label="Restoring Harmony"><span className="w">Restoring</span><button className="beam" id="beam" aria-label="The beam of light"></button><span className="w">Harmony</span></h1>
        <p className="lede">A graduation night. A crash that opens a door between worlds. And a girl who learns that faith is her only weapon.</p>
        <button className="btn" id="enterBtn">Enter her world</button>
        <a className="cue" href="#graduation">Something is watching from the dark</a>
      </div>
      <button className="glint" data-coin="0" style={{left:"8%",top:"78%"}} aria-label="A glint of gold"></button>
    </header>
  );
}
