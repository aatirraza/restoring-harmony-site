import { useEffect } from 'react';
import Rail from './components/Rail.jsx';
import Overlays from './components/Overlays.jsx';
import Hero from './components/Hero.jsx';
import Graduation from './components/Graduation.jsx';
import Chariot from './components/Chariot.jsx';
import Conviction from './components/Conviction.jsx';
import LifeLight from './components/LifeLight.jsx';
import Night from './components/Night.jsx';
import Gifts from './components/Gifts.jsx';
import Temple from './components/Temple.jsx';
import Pandemonium from './components/Pandemonium.jsx';
import Claim from './components/Claim.jsx';
import OfferPage from './components/OfferPage.jsx';
import Footer from './components/Footer.jsx';
import PresenterMap from './components/PresenterMap.jsx';
import { initWorld } from './engine/world.js';

export default function App() {
  useEffect(() => {
    const stop = initWorld();
    return stop;
  }, []);

  return (
    <>
      <Rail />
      <Overlays />
      <Hero />
      <Graduation />
      <Chariot />
      <Conviction />
      <LifeLight />
      <Night />
      <Gifts />
      <Temple />
      <Pandemonium />
      <Claim />
      <OfferPage />
      <Footer />
      <PresenterMap />
    </>
  );
}
