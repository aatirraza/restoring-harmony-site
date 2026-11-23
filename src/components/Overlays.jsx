// Gold-coin tracker, toast messages and the gold flood used by easter eggs.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Overlays() {
  return (
    <>
    <div className="coins" id="coins" aria-label="Gold coins found"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <div className="toast" id="toast" role="status" aria-live="polite"><b id="toastT"></b><span id="toastB"></span></div>
    <div className="flood" id="flood"></div>
    </>
  );
}
