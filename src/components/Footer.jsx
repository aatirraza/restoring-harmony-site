// Footer with the hidden author signature egg.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Footer() {
  return (
    <footer><div className="wrap">Website concept · <button id="sig">Tawaskee L. Hill</button> · World Publishing Company</div></footer>
  );
}
