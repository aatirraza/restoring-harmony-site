// Presenter's map / author note overlay (press ? to open).
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function PresenterMap() {
  return (
    <>
    <div className="veil" id="veil" hidden>
      <div className="card" role="dialog" aria-modal="true" aria-labelledby="veilT">
        <div className="eyebrow" id="veilE">Presenter's map</div>
        <h3 id="veilT" style={{fontSize:"28px"}}>Hidden in the world</h3>
        <div id="veilBody"></div>
        <button className="btn ghost x" id="veilX">Close</button>
      </div>
    </div>
    </>
  );
}
