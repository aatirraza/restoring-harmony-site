// Right-hand dot navigation between realms.
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function Rail() {
  return (
    <nav className="rail" aria-label="Realms">
      <a href="#threshold"><span>The Threshold</span></a>
      <a href="#graduation"><span>Graduation Night</span></a>
      <a href="#chariot"><span>The Pearl Chariot</span></a>
      <a href="#conviction"><span>Planet Conviction</span></a>
      <a href="#lifelight"><span>The Life Light</span></a>
      <a href="#night"><span>Night Without Light</span></a>
      <a href="#gifts"><span>The Professor's Gifts</span></a>
      <a href="#temple"><span>The Temple Beast</span></a>
      <a href="#pandemonium"><span>Pandemonium</span></a>
    </nav>
  );
}
