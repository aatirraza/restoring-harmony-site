// Graduation night: the drive, the crash flash and the Room 144 heart monitor.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Graduation() {
  return (
    <section className="realm" id="graduation">
      <div className="plate" data-img="L03"></div>
      <div className="shade"></div>
      <div className="wrap grid2">
        <div className="copy rv">
          <div className="eyebrow">Graduation night</div>
          <h2>The road home, <em>golden hour</em></h2>
          <p>Cap and gown, the whole world ahead of her. Harmony drives toward the intersection by the ice-cream stand, carrying one instruction from her mother.</p>
          <p className="quote">"Harmony, whenever you have bad spiritual encounters, remember to always pray in your heart to your Creator."<cite>Momma</cite></p>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}><button className="btn" id="driveBtn">Drive home</button><button className="btn ghost" id="rewind" hidden>Rewind the night</button></div>
        </div>
        <div className="monitor rv">
          <div className="scene" id="roadScene" data-img="L03"></div>
          <div className="scene" id="roomScene" data-img="L04" style={{opacity:"0"}}></div>
          <div className="flash" id="flash"></div>
          <div className="ecg" id="ecg">
            <canvas id="ecgCanvas" aria-hidden="true"></canvas>
            <div className="readout"><button id="room144">ROOM 144</button><span id="days">DAY 1</span></div>
            <div className="whisper">She can hear them. They cannot hear her.</div>
          </div>
        </div>
      </div>
      <button className="glint" data-coin="1" style={{right:"6%",top:"16%"}} aria-label="A glint of gold"></button>
    </section>
  );
}
