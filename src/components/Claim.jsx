// "Get my website" call to action.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Claim() {
  return (
    <section className="claim" id="claim"><div className="wrap" style={{display:"grid",justifyItems:"center",gap:"18px"}}>
      <div className="eyebrow">Your book, as a world readers can walk through</div>
      <h2>Make this website <em>yours</em></h2>
      <button className="btn" id="getSite">Get my website</button>
    </div></section>
  );
}
