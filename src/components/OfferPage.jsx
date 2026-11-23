// The unlock page ($1,999 with review discounts).
// Markup only. Behaviour lives in src/engine/world.js, which finds elements by id/class.
export default function OfferPage() {
  return (
    <>
    <div className="offer" id="offer" hidden role="dialog" aria-modal="true" aria-labelledby="offerT">
      <div className="wrap">
        <div className="beamline" aria-hidden="true"></div>
        <div className="eyebrow">Restoring Harmony · Book world website</div>
        <h2 id="offerT">Unlock it for</h2>
        <div className="price">$1,999</div>
        <p style={{color:"var(--ink-soft)"}}>The full interactive website for your book, with every realm, every interaction and every hidden easter egg.</p>
        <div className="deals">
          <div className="deal">
            <div className="amt">$500 <small>off</small></div>
            <h3>Review us on Trustpilot</h3>
            <p className="hint">Share an honest review of your experience with World Publishing Company on Trustpilot.</p>
            <div className="net">Your price: <b>$1,499</b></div>
          </div>
          <div className="deal">
            <div className="amt">$250 <small>off</small></div>
            <h3>Review us on Google Reviews</h3>
            <p className="hint">Share an honest review of your experience with World Publishing Company on Google.</p>
            <div className="net">Your price: <b>$1,749</b></div>
          </div>
        </div>
        <form className="leadform" id="leadForm" noValidate>
          <h3>Claim your book world</h3>
          <p className="hint">Tell us where to reach you and we will be in touch about building yours.</p>
          <fieldset className="choices">
            <legend className="eyebrow">Your option</legend>
            <label className="choice"><input type="radio" name="choice" value="full" defaultChecked /><span>Full price <b>$1,999</b></span></label>
            <label className="choice"><input type="radio" name="choice" value="trustpilot" /><span>Trustpilot <b>$1,499</b></span></label>
            <label className="choice"><input type="radio" name="choice" value="google" /><span>Google <b>$1,749</b></span></label>
          </fieldset>
          <label className="field"><span>Your name</span><input id="leadName" name="name" type="text" autoComplete="name" maxLength="120" required /></label>
          <label className="field"><span>Email</span><input id="leadEmail" name="email" type="email" autoComplete="email" maxLength="254" required /></label>
          <label className="hp" aria-hidden="true">Website<input name="website" type="text" tabIndex="-1" autoComplete="off" /></label>
          <button className="btn" id="leadSubmit" type="submit">Send my details</button>
          <p className="leadmsg" id="leadMsg" role="status" aria-live="polite"></p>
        </form>
        <button className="btn ghost" id="offerBack">Back to the world</button>
      </div>
    </div>
    </>
  );
}
