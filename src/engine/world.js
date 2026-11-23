// Restoring Harmony world engine.
// Ported from the approved single-file mock: canvases, scroll effects, easter eggs,
// the unlock page and the presenter's map. It looks elements up by id/class, so keep
// those ids and classes when editing the JSX components.
import { track, submitLead } from './api.js';

export const IMAGES = {
  L01: '/images/L01-volcano-den.jpg',
  L03: '/images/L03-highway.jpg',
  L04: '/images/L04-hospital-144.jpg',
  L05: '/images/L05-sky.jpg',
  L06: '/images/L06-planet-conviction.jpg',
  L07: '/images/L07-warehouse.jpg',
  L09: '/images/L09-study.jpg',
  L10: '/images/L10-cave.jpg',
  L12: '/images/L12-temple.jpg',
  L14: '/images/L14-mountain-ridge.jpg',
  P06: '/images/P06-sword.jpg'
};

let started = false;
let rafId = 0;

export function initWorld() {
  if (started) return () => {};
  started = true;

const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR=Math.min(devicePixelRatio||1,2);
const IMG=IMAGES;
document.querySelectorAll('[data-img]').forEach(el=>el.style.backgroundImage=`url(${IMG[el.dataset.img]})`);
function fit(c){const r=c.getBoundingClientRect();c.width=Math.max(1,r.width*DPR);c.height=Math.max(1,r.height*DPR);return {w:c.width,h:c.height};}
const vis=new Set();const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target)),{threshold:.02});

/* rail + reveal + parallax */
const rail=[...document.querySelectorAll('.rail a')];
const railIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)rail.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-45% 0px -50% 0px'});document.querySelectorAll('.realm[id]').forEach(s=>railIO.observe(s));
if(!RM){const rvs=[...document.querySelectorAll('.rv')];const r0=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');r0.unobserve(e.target);}}),{threshold:.1});
  rvs.forEach(el=>{const b=el.getBoundingClientRect();if(b.top>innerHeight){el.classList.add('pre');r0.observe(el);}});}
const plates=[...document.querySelectorAll('.plate')];
function parallax(){if(RM)return;plates.forEach(p=>{const r=p.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const k=(r.top+r.height/2-innerHeight/2)/innerHeight;p.style.setProperty('--py',(k*-60).toFixed(1)+'px');});}
addEventListener('scroll',parallax,{passive:true});parallax();

/* toast, eggs, presenter */
const toastEl=document.getElementById('toast');let tt;
function toast(t,b,ms=4200){document.getElementById('toastT').textContent=t;document.getElementById('toastB').textContent=b;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),ms);}
const EGGS=[
 ['eyes','The eyes in the dark','Click the burning eyes at the very top three times.'],
 ['beam','The beam','Click the gold beam between RESTORING and HARMONY seven times.'],
 ['harmony','Her name','Type the word harmony anywhere on the page.'],
 ['coins','Seven gold coins','Find the seven faint gold glints hidden across the realms.'],
 ['room','Room 144','After the crash, tap ROOM 144 on the monitor.'],
 ['rams','Twelve rams','Hold the sky until the chariot climbs above the clouds.'],
 ['fire','Darkness disappears','Hold your torch over the dying embers in the cave.'],
 ['twins','The twins','Strike the ten heads in their matching twin pairs.'],
 ['sig','A signature','Triple-click the author name in the footer.']
];
const found=new Set();
function egg(id,title,body){if(!found.has(id)){found.add(id);track('egg:'+id);}toast(title,body);}
const veil=document.getElementById('veil'),veilBody=document.getElementById('veilBody');
function openMap(){const ol=document.createElement('ol');EGGS.forEach(([id,t,how])=>{const li=document.createElement('li');if(found.has(id))li.className='found';li.textContent=`${t}: ${how}${found.has(id)?' (found)':''}`;ol.append(li);});
  veilBody.innerHTML='';const p=document.createElement('p');p.className='hint';p.textContent=`${found.size} of ${EGGS.length} found. Press ? to open this map at any time.`;veilBody.append(p,ol);
  document.getElementById('veilE').textContent="Presenter's map";document.getElementById('veilT').textContent='Hidden in the world';veil.hidden=false;document.getElementById('veilX').focus();}
document.getElementById('veilX').addEventListener('click',()=>veil.hidden=true);
veil.addEventListener('click',e=>{if(e.target===veil)veil.hidden=true;});
let typed='';addEventListener('keydown',e=>{
  if(e.key==='Escape'){veil.hidden=true;if(!offer.hidden)document.getElementById('offerBack').click();return;}
  if(e.target.closest&&e.target.closest('input,textarea'))return;
  if(e.key==='?'){openMap();return;}
  if(e.key.length===1){typed=(typed+e.key.toLowerCase()).slice(-7);if(typed==='harmony'){const f=document.getElementById('flood');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),900);egg('harmony','Her name','Harmony Love Hill. The light answers when it is called.');}}
});
// coins
const coinsBar=document.getElementById('coins');const coinDots=[...coinsBar.children];let coins=0;
document.querySelectorAll('.glint').forEach(g=>g.addEventListener('click',()=>{if(g.classList.contains('got'))return;g.classList.add('got');coinDots[coins].classList.add('got');coins++;track('coin:'+coins);coinsBar.classList.add('on');
  if(coins<7)toast('A gold coin',`${coins} of 7. Professor James counted seven into her hand.`);else egg('coins','Seven gold coins','All seven found. The map and the coins are hers now.');}));
// signature
let sigN=0,sigT;document.getElementById('sig').addEventListener('click',()=>{sigN++;clearTimeout(sigT);sigT=setTimeout(()=>sigN=0,700);if(sigN>=3){sigN=0;if(!found.has('sig')){found.add('sig');track('egg:sig');}
  veilBody.innerHTML='';const a=document.createElement('p');a.className='quote';a.textContent='"Restoring Harmony" — built as a world you can walk through.';const b=document.createElement('p');b.textContent='Every realm on this page comes from your book: the pearl chariot, Unity Pearl\'s silk, the Life Light, the night without light, King of Light, and the mountain where the silk was thrown. Made for Tawaskee L. Hill by World Publishing Company.';b.style.color='var(--ink-soft)';
  veilBody.append(a,b);document.getElementById('veilE').textContent='For the author';document.getElementById('veilT').textContent='Thank you for this story';veil.hidden=false;document.getElementById('veilX').focus();}});

/* HERO: eyes in the volcano dark + beam egg */
const ec=document.getElementById('eyes');const ex=ec.getContext('2d');let EV=fit(ec);io.observe(ec);
let look={x:.5,y:.5},eyeHits=0,beamHits=0,flare=0;
ec.parentElement.addEventListener('pointermove',e=>{const r=ec.getBoundingClientRect();look.x=(e.clientX-r.left)/r.width;look.y=(e.clientY-r.top)/r.height;});
const motes=Array.from({length:70},()=>({x:Math.random(),y:Math.random(),v:.0004+Math.random()*.0012,a:Math.random()*6}));
function eyePos(){const {w,h}=EV;return {cx:w*.5,cy:h*.2,gap:Math.min(w,h)*.07};}
ec.addEventListener('click',e=>{const r=ec.getBoundingClientRect();const x=(e.clientX-r.left)*DPR,y=(e.clientY-r.top)*DPR;const {cx,cy,gap}=eyePos();
  if(Math.hypot(x-cx,y-cy)<gap*1.8){eyeHits++;flare=1;if(eyeHits===3){egg('eyes','A voice like soft thunder','"…please don\'t fall asleep."');}}});
document.getElementById('beam').addEventListener('click',()=>{beamHits++;flare=.6;if(beamHits===7){egg('beam','Seven times','"I said a silent prayer in my heart to ask the Universe to guide me."');const f=document.getElementById('flood');f.classList.add('on');setTimeout(()=>f.classList.remove('on'),700);}});
document.getElementById('enterBtn').addEventListener('click',()=>document.getElementById('graduation').scrollIntoView({behavior:RM?'auto':'smooth'}));
function drawEyes(t){const {w,h}=EV;ex.clearRect(0,0,w,h);const {cx,cy,gap}=eyePos();
  const open=RM?1:Math.min(1,t/3200);const breath=.75+.25*Math.sin(t/900)+flare;flare=Math.max(0,flare-.02);
  const ox=(look.x-.5)*gap*.25,oy=(look.y-.5)*gap*.15;
  [-1,1].forEach(d=>{const x=cx+d*gap+ox,y=cy+oy;const g=ex.createRadialGradient(x,y,0,x,y,gap*1.4);g.addColorStop(0,`rgba(255,170,70,${.35*open*breath})`);g.addColorStop(1,'rgba(255,90,20,0)');ex.fillStyle=g;ex.fillRect(x-gap*1.5,y-gap*1.5,gap*3,gap*3);
    ex.save();ex.translate(x,y);ex.scale(1,Math.max(.04,open)*.45);const c=ex.createRadialGradient(0,0,0,0,0,gap*.42);c.addColorStop(0,`rgba(255,248,220,${breath})`);c.addColorStop(.35,'rgba(255,160,50,.95)');c.addColorStop(1,'rgba(200,50,10,0)');ex.fillStyle=c;ex.beginPath();ex.arc(0,0,gap*.42,0,Math.PI*2);ex.fill();ex.restore();});
  motes.forEach(m=>{m.y-=m.v;if(m.y<0){m.y=1;m.x=Math.random();}ex.fillStyle=`rgba(255,190,110,${.15+.35*Math.abs(Math.sin(t/1200+m.a))})`;ex.fillRect(m.x*w,m.y*h,1.5*DPR,1.5*DPR);});}

/* GRADUATION */
const flash=document.getElementById('flash'),road=document.getElementById('roadScene'),room=document.getElementById('roomScene'),ecg=document.getElementById('ecg'),days=document.getElementById('days');
const driveBtn=document.getElementById('driveBtn'),rewind=document.getElementById('rewind');
const ecC=document.getElementById('ecgCanvas');const ecx=ecC.getContext('2d');let E={w:1,h:1},ecgOn=false,ex0=0,lastY=null,dayN=1,timers=[];
function later(f,ms){timers.push(setTimeout(f,RM?Math.min(ms,60):ms));}
driveBtn.addEventListener('click',()=>{driveBtn.disabled=true;road.style.transform='scale(1.18)';
  later(()=>{flash.style.transition='opacity 1.2s ease-in';flash.style.opacity='1';},2300);
  later(()=>{road.style.opacity='0';room.style.opacity='.45';flash.style.transition='opacity 1.6s';flash.style.opacity='0';},3600);
  later(()=>{E=fit(ecC);ecx.clearRect(0,0,E.w,E.h);ex0=0;lastY=null;dayN=1;ecgOn=true;ecg.classList.add('on');rewind.hidden=false;},4200);});
rewind.addEventListener('click',()=>{timers.forEach(clearTimeout);timers=[];ecgOn=false;ecg.classList.remove('on');road.style.transition='none';road.style.transform='none';road.style.opacity='1';room.style.opacity='0';requestAnimationFrame(()=>road.style.transition='');flash.style.opacity='0';driveBtn.disabled=false;rewind.hidden=true;days.textContent='DAY 1';});
let roomHits=0;document.getElementById('room144').addEventListener('click',()=>{roomHits++;egg('room','Room 144','Parents\' hands holding hers. A boy reading by the window. "You have been sleeping for almost two years."');});
function beat(p){p%=1;if(p<.05)return -Math.sin(p/.05*Math.PI)*.08;if(p>.08&&p<.1)return .15;if(p>=.1&&p<.13)return -.9;if(p>=.13&&p<.16)return .35;if(p>.3&&p<.42)return -Math.sin((p-.3)/.12*Math.PI)*.18;return 0;}
function drawECG(){if(!ecgOn)return;const {w,h}=E,st=2*DPR;for(let k=0;k<3;k++){ecx.clearRect(ex0,0,16*DPR,h);const y=h*.55+beat(ex0/(w/3.2))*h*.3;ecx.strokeStyle='#86f0bd';ecx.lineWidth=2*DPR;ecx.shadowColor='#86f0bd';ecx.shadowBlur=8*DPR;ecx.beginPath();ecx.moveTo(ex0-st,lastY??y);ecx.lineTo(ex0,y);ecx.stroke();ecx.shadowBlur=0;lastY=y;ex0+=st;if(ex0>w){ex0=0;lastY=null;}}
  if(dayN<700){dayN=Math.min(700,dayN+2);days.textContent='DAY '+dayN;}}

/* CHARIOT: hold to ascend */
const sk=document.getElementById('skyfx');const sx=sk.getContext('2d');let SK=fit(sk);io.observe(sk);
const chariot=document.getElementById('chariot');const skyPlate=chariot.querySelector('.plate');
let asc=0,holdingSky=false,ramShown=false;
chariot.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;holdingSky=true;});
['pointerup','pointerleave','pointercancel'].forEach(ev=>chariot.addEventListener(ev,()=>holdingSky=false));
const streaks=Array.from({length:60},()=>({x:Math.random(),y:Math.random(),l:.02+Math.random()*.06}));
function drawSky(t){const {w,h}=SK;sx.clearRect(0,0,w,h);
  asc=Math.max(0,Math.min(1,asc+(holdingSky?(RM?.1:.008):-.01)));
  skyPlate.style.filter=`brightness(${1+asc*.35}) saturate(${1+asc*.2})`;skyPlate.style.transform=`translateY(calc(var(--py,0px) + ${asc*60}px)) scale(${1.04+asc*.12})`;
  if(asc>0){streaks.forEach(s=>{s.y+=.01+asc*.03;if(s.y>1.1){s.y=-.1;s.x=Math.random();}sx.strokeStyle=`rgba(255,240,215,${.25*asc})`;sx.lineWidth=1.2*DPR;sx.beginPath();sx.moveTo(s.x*w,s.y*h);sx.lineTo(s.x*w,(s.y-s.l*asc*3)*h);sx.stroke();});}
  // twelve LED-bright eyes of the rams appear at the top of the climb
  if(asc>.85){const a=(asc-.85)/.15;for(let i=0;i<12;i++){const x=w*(.18+i*.055)+Math.sin(t/400+i)*4*DPR,y=h*(.58+(i%2)*.03);sx.fillStyle=`rgba(150,235,255,${a})`;sx.shadowColor='#8fe8ff';sx.shadowBlur=12*DPR;sx.beginPath();sx.arc(x,y,2.2*DPR,0,Math.PI*2);sx.fill();}sx.shadowBlur=0;
    if(a>=1&&!ramShown){ramShown=true;egg('rams','Twelve rams','Their eyes glow like LEDs as the chariot climbs through the pinnacle of the mountain.');}}
}

/* SILK */
document.getElementById('cord').addEventListener('click',()=>document.getElementById('scroll').classList.add('open'));

/* LIFE LIGHT */
const lc=document.getElementById('lifeCanvas');const lx=lc.getContext('2d');let LV=fit(lc);io.observe(lc);
lc.parentElement.style.background=`center/cover url(${IMG.L07})`;
const lifeBtn=document.getElementById('lifeBtn'),ring=document.getElementById('lifeRing'),lifeHint=document.getElementById('lifeHint');
let charge=0,charging=false,burst=0;const notes=[];
const smoke=Array.from({length:7},(_,i)=>({x:.32+i*.08,y:.66,ph:Math.random()*6,st:0,vy:0}));
function fire(){if(!charging)return;charging=false;if(charge>.25){burst=1;
  for(let i=0;i<34;i++)notes.push({x:.5,y:.62,vx:(Math.random()-.5)*.016,vy:-.004-Math.random()*.01,g:['♪','♫','♩'][i%3],life:1,s:.7+Math.random()*.8});
  smoke.forEach(s=>{s.st=1;s.vy=-.006-Math.random()*.006;});lifeHint.textContent='The shadows rip free and dance on the ceiling. Hold again to reset.';}charge=0;}
lifeBtn.addEventListener('pointerdown',e=>{e.preventDefault();charging=true;});
['pointerup','pointerleave','pointercancel'].forEach(ev=>lifeBtn.addEventListener(ev,fire));
lifeBtn.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();charging=true;}});
lifeBtn.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')fire();});
function drawLife(t){const {w,h}=LV;lx.clearRect(0,0,w,h);
  lx.fillStyle='rgba(8,7,11,.35)';lx.fillRect(0,0,w,h);
  const all=smoke.every(s=>s.st===2);
  smoke.forEach((s,i)=>{if(s.st===1){s.y+=s.vy;s.vy*=.985;if(s.y<=.12){s.y=.12;s.st=2;}}
    const x=(s.x+Math.sin(t/1100+s.ph)*.012+(s.st?Math.sin(t/300+i)*.04:0))*w,y=s.y*h;const a=s.st===2?.35:.85;
    const g=lx.createRadialGradient(x,y,0,x,y,h*.16);g.addColorStop(0,`rgba(3,2,5,${a})`);g.addColorStop(.55,`rgba(3,2,5,${a*.6})`);g.addColorStop(1,'rgba(3,2,5,0)');
    lx.fillStyle=g;lx.beginPath();lx.ellipse(x,y,h*.07,h*.17,0,0,Math.PI*2);lx.fill();
    lx.beginPath();lx.ellipse(x,y-h*.15,h*.045,h*.06,0,0,Math.PI*2);lx.fill();});
  if(burst>0){const r=w*(1.2-burst*.6);const g=lx.createRadialGradient(w*.5,h*.62,0,w*.5,h*.62,r);g.addColorStop(0,`rgba(255,246,255,${burst})`);g.addColorStop(.25,`rgba(200,160,255,${burst*.7})`);g.addColorStop(1,'rgba(120,60,200,0)');lx.fillStyle=g;lx.fillRect(0,0,w,h);
    lx.save();lx.translate(w*.5,h*.62);for(let k=0;k<14;k++){lx.rotate(Math.PI*2/14);lx.fillStyle=`rgba(255,240,255,${burst*.18})`;lx.fillRect(0,-1*DPR,w,2*DPR);}lx.restore();burst=Math.max(0,burst-.01);}
  lx.textAlign='center';for(let i=notes.length-1;i>=0;i--){const n=notes[i];n.x+=n.vx;n.y+=n.vy;n.vy+=.00015;n.life-=.0055;if(n.life<=0){notes.splice(i,1);continue;}
    lx.font=`300 ${16*n.s*DPR}px Poppins,sans-serif`;lx.fillStyle=`rgba(255,241,212,${n.life*.85})`;lx.shadowColor='#b98cf0';lx.shadowBlur=12*DPR;lx.fillText(n.g,n.x*w,n.y*h);lx.shadowBlur=0;}
  if(charging){charge=Math.min(1,charge+(RM?.2:.012));if(all){smoke.forEach(s=>{s.st=0;s.y=.66;});lifeHint.textContent='Press and hold, then release to fire.';}}
  ring.setAttribute('stroke-dashoffset',String(390*(1-charge)));}

/* NIGHT */
const nc=document.getElementById('nightCanvas');const nx=nc.getContext('2d');let NV=fit(nc);io.observe(nc);
const caveImg=new Image();caveImg.src=`${IMG.L10}`;
let torch={x:.5,y:.55,user:false},emberHold=0,fireBack=0;
function setT(e){const r=nc.getBoundingClientRect();torch.x=(e.clientX-r.left)/r.width;torch.y=(e.clientY-r.top)/r.height;torch.user=true;}
nc.addEventListener('pointermove',setT);nc.addEventListener('pointerdown',setT);
const eyesN=Array.from({length:18},(_,i)=>{const s=i%3;return {x:s===0?Math.random()*.22:s===1?.78+Math.random()*.22:.15+Math.random()*.7,y:s===2?.06+Math.random()*.16:.25+Math.random()*.45,o:1,b:Math.random()*9,s:.7+Math.random()*.5};});
function drawNight(t){const {w,h}=NV;
  if(!torch.user){torch.x=.5+Math.sin(t/1900)*.28;torch.y=.55+Math.cos(t/2400)*.15;}
  if(caveImg.complete){const ir=caveImg.width/caveImg.height,cr=w/h;let dw=w,dh=h,dx=0,dy=0;if(ir>cr){dw=h*ir;dx=(w-dw)/2;}else{dh=w/ir;dy=(h-dh)/2;}nx.drawImage(caveImg,dx,dy,dw,dh);}else{nx.fillStyle='#111';nx.fillRect(0,0,w,h);}
  // dying fire at the cave mouth floor
  const fx=w*.5,fy=h*.86;const fr=(30+fireBack*120)*DPR;const fg=nx.createRadialGradient(fx,fy,0,fx,fy,fr);fg.addColorStop(0,`rgba(255,${150+60*fireBack},70,${.55+.4*fireBack})`);fg.addColorStop(1,'rgba(255,90,20,0)');nx.fillStyle=fg;nx.fillRect(0,0,w,h);
  const tx=torch.x*w,ty=torch.y*h,R=Math.min(w,h)*(.3+fireBack*.9);
  const dk=nx.createRadialGradient(tx,ty,R*.12,tx,ty,R);dk.addColorStop(0,'rgba(2,2,3,0)');dk.addColorStop(.7,`rgba(2,2,3,${.82*(1-fireBack)})`);dk.addColorStop(1,`rgba(2,2,3,${.97*(1-fireBack*.8)})`);nx.fillStyle=dk;nx.fillRect(0,0,w,h);
  const warm=nx.createRadialGradient(tx,ty,0,tx,ty,R*.55);warm.addColorStop(0,'rgba(255,170,80,.22)');warm.addColorStop(1,'rgba(255,140,60,0)');nx.fillStyle=warm;nx.fillRect(0,0,w,h);
  eyesN.forEach(e=>{const d=Math.hypot(e.x*w-tx,e.y*h-ty);const near=d<R*1.05||fireBack>.5;e.o+=((near?0:1)-e.o)*.08;const bl=Math.sin(t/520+e.b)>.97?.1:1;const a=e.o*bl;if(a<.03)return;
    const x=e.x*w,y=e.y*h;nx.fillStyle=`rgba(255,214,90,${a})`;nx.shadowColor='rgba(255,170,0,.9)';nx.shadowBlur=9*DPR;nx.beginPath();nx.ellipse(x-5*DPR*e.s,y,2.6*DPR*e.s,1.7*DPR*e.s,0,0,Math.PI*2);nx.ellipse(x+5*DPR*e.s,y,2.6*DPR*e.s,1.7*DPR*e.s,0,0,Math.PI*2);nx.fill();nx.shadowBlur=0;});
  const fl=nx.createRadialGradient(tx,ty,0,tx,ty,11*DPR);fl.addColorStop(0,'rgba(255,250,225,1)');fl.addColorStop(.5,'rgba(255,170,60,.8)');fl.addColorStop(1,'rgba(255,100,20,0)');nx.fillStyle=fl;nx.beginPath();nx.arc(tx,ty-2*DPR+Math.sin(t/60)*1.4*DPR,11*DPR,0,Math.PI*2);nx.fill();
  // egg: hold the torch over the embers
  if(torch.user&&Math.hypot(tx-fx,ty-fy)<45*DPR){emberHold+=1;}else emberHold=Math.max(0,emberHold-2);
  if(emberHold>150&&fireBack===0){fireBack=.01;egg('fire','Then I saw Darkness disappear','The tribe\'s fire rises again, and every hungry eye retreats.');}
  if(fireBack>0&&fireBack<1)fireBack=Math.min(1,fireBack+.01);
  if(fireBack>=1&&emberHold===0){setTimeout(()=>{fireBack=0;},4000);fireBack=.999;}
}

/* GIFTS */
const GIFTS={map:['The map','Drawn for a journey into the mountain, where fog hides two glowing girls who beckon the way forward.'],coins:['Seven gold coins','Seven, counted into Harmony\'s hand. Gold for a road no ordinary money can travel.'],robe:['Fine linen robe','For DJ. The garment of the warrior he is about to become.'],sandals:['Sandals','For DJ\'s feet, to carry him over temple tiles and burning ground.'],sword:['King of Light','A two-edged sword from the professor\'s basement. Its inscription wakes when it is needed most.'],scroll:['The old scroll','It tells of a silk unused for ages, once lost, from an ancient prophetess named Unity Pearl.']};
const note=document.getElementById('giftNote');
document.querySelectorAll('.gift').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.gift').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');const [t,d]=GIFTS[b.dataset.g];note.innerHTML='';const h=document.createElement('h3');h.textContent=t;const p=document.createElement('p');p.textContent=d;p.style.color='var(--ink-soft)';note.append(h,p);
  if(b.dataset.g==='sword'){const i=document.createElement('img');i.alt='The two-edged sword King of Light';i.src=`${IMG.P06}`;const s=document.createElement('div');s.className='inscr';s.textContent='KING OF LIGHT';note.append(i,s);}}));

/* BEAST */
const bc=document.getElementById('beastCanvas');const bx=bc.getContext('2d');let BV=fit(bc);io.observe(bc);
bc.parentElement.style.background=`center/cover url(${IMG.L12})`;
const NAMES=['Dragon','Serpent','Possum','Catfish','Hog','Hog','Catfish','Possum','Serpent','Dragon'];
const heads=NAMES.map((n,i)=>{const a=Math.PI*(.12+i*.0844);return {n,x:.5-Math.cos(a)*.38,y:.78-Math.sin(a)*.58,cut:0,sl:0};});
let win0=0,cutN=0,won=false,order=[],wonT=0;const WIN=RM?20000:5600;
const meter=document.getElementById('beastMeter'),bmsg=document.getElementById('beastMsg'),breset=document.getElementById('beastReset');
function regrow(){heads.forEach(h=>{h.cut=0;});cutN=0;win0=0;order=[];meter.style.width='0';}
bc.addEventListener('click',e=>{if(won)return;const r=bc.getBoundingClientRect();const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  let best=null,bd=.09;heads.forEach((h,i)=>{if(h.cut)return;const d=Math.hypot((h.x-x)*1.6,h.y-y);if(d<bd){bd=d;best=i;}});
  if(best==null)return;if(!win0)win0=performance.now();const h=heads[best];h.cut=1;h.sl=1;cutN++;order.push(best);
  bmsg.textContent=cutN<10?`${h.n} head struck. ${10-cutN} remain before it reunites.`:'';
  if(cutN===10){won=true;wonT=performance.now();meter.style.width='100%';meter.style.background='var(--gold)';bmsg.textContent='Every head destroyed. The beast cannot reunite. You conquered it.';breset.hidden=false;
    let twins=true;for(let k=0;k<10;k+=2){if(NAMES[order[k]]!==NAMES[order[k+1]])twins=false;}if(twins)egg('twins','The twins','You struck them in pairs, twin by twin, exactly as they were made.');}});
breset.addEventListener('click',()=>{won=false;meter.style.background='';regrow();bmsg.textContent='Ten pairs of eyes burn in the dark. Strike each one before the beast reunites.';breset.hidden=true;});
function drawBeast(t){const {w,h}=BV;bx.clearRect(0,0,w,h);
  const fade=won?Math.min(1,(performance.now()-wonT)/1400):0;
  bx.fillStyle=`rgba(6,3,3,${.55*(1-fade)+.1})`;bx.fillRect(0,0,w,h);
  const bg=bx.createRadialGradient(w*.5,h*1.05,0,w*.5,h*1.05,h*.9);bg.addColorStop(0,`rgba(255,90,30,${.4*(1-fade)})`);bg.addColorStop(1,'rgba(255,60,10,0)');bx.fillStyle=bg;bx.fillRect(0,0,w,h);
  if(win0&&!won){const p=(performance.now()-win0)/WIN;meter.style.width=Math.min(100,p*100)+'%';if(p>=1){regrow();bmsg.textContent='Too slow. The heads reunite. Strike faster.';}}
  heads.forEach((hd,i)=>{const x=hd.x*w,y=hd.y*h+Math.sin(t/500+i)*3*DPR;const s=Math.min(w,h)*.028;
    // neck of shadow
    bx.strokeStyle=`rgba(4,2,2,${.75*(1-fade)})`;bx.lineWidth=s*1.4;bx.lineCap='round';bx.beginPath();bx.moveTo(w*.5,h*1.02);bx.quadraticCurveTo(w*.5+(x-w*.5)*.3,h*.7,x,y+s);bx.stroke();
    if(!hd.cut){const flick=.8+.2*Math.sin(t/120+i*2);[-1,1].forEach(d=>{const ex2=x+d*s*.55;const g=bx.createRadialGradient(ex2,y,0,ex2,y,s*.9);g.addColorStop(0,`rgba(255,240,180,${flick*(1-fade)})`);g.addColorStop(.35,`rgba(255,120,30,${flick*(1-fade)})`);g.addColorStop(1,'rgba(255,60,0,0)');bx.fillStyle=g;bx.beginPath();bx.ellipse(ex2,y,s*.9,s*.5,0,0,Math.PI*2);bx.fill();});}
    if(hd.sl>0){bx.strokeStyle=`rgba(255,241,212,${hd.sl})`;bx.lineWidth=2*DPR;bx.shadowColor='#e3ad5a';bx.shadowBlur=14*DPR;bx.beginPath();bx.moveTo(x-s*2,y-s*1.6);bx.lineTo(x+s*2,y+s*1.6);bx.stroke();bx.shadowBlur=0;hd.sl=Math.max(0,hd.sl-.04);}
  });
  if(fade>0){const g=bx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.4,w*.6);g.addColorStop(0,`rgba(255,241,212,${.35*fade})`);g.addColorStop(1,'rgba(227,173,90,0)');bx.fillStyle=g;bx.fillRect(0,0,w,h);}
}

/* PANDEMONIUM */
const mc=document.getElementById('mountfx');const mx=mc.getContext('2d');let MV=fit(mc);io.observe(mc);
const throwBtn=document.getElementById('throwBtn'),throwHint=document.getElementById('throwHint');
let hold=0,holding=false,thrown=0;
throwBtn.addEventListener('pointerdown',e=>{e.preventDefault();if(thrown===0)holding=true;});
['pointerup','pointerleave','pointercancel'].forEach(ev=>throwBtn.addEventListener(ev,()=>{holding=false;if(hold<1)hold=0;}));
throwBtn.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();if(thrown===0)holding=true;}});
throwBtn.addEventListener('keyup',()=>{holding=false;if(hold<1)hold=0;});
throwBtn.addEventListener('click',()=>{if(thrown>=1){thrown=0;hold=0;throwBtn.textContent='Hold to call on the Universe';throwHint.textContent='"Throw the silk heavenward and call on the Universe with all your inner might."';}});
const emb=Array.from({length:80},()=>({x:Math.random(),y:Math.random(),v:.0008+Math.random()*.002}));
function drawMount(t){const {w,h}=MV;mx.clearRect(0,0,w,h);
  if(holding&&thrown===0)hold=Math.min(1,hold+(RM?.2:.011));
  if(hold>=1&&thrown===0){thrown=.001;throwHint.textContent='The silk rises. The Universe answers.';throwBtn.textContent='Watch the sky';throwBtn.disabled=true;}
  if(thrown>0&&thrown<1){thrown=Math.min(1,thrown+.005);if(thrown>=1){throwBtn.disabled=false;throwBtn.textContent='Rise again';}}
  const vis=1-Math.min(1,thrown*1.4);
  // Pandemonium's eyes over the ridge
  const cx=w*.5,cy=h*.2,gap=Math.min(w,h)*.07,flick=.8+.2*Math.sin(t/90);
  if(vis>0)[-1,1].forEach(d=>{const x=cx+d*gap;const g=mx.createRadialGradient(x,cy,0,x,cy,gap*1.2);g.addColorStop(0,`rgba(255,244,200,${vis*flick})`);g.addColorStop(.3,`rgba(255,120,30,${vis*flick})`);g.addColorStop(1,'rgba(255,50,0,0)');mx.fillStyle=g;mx.beginPath();mx.ellipse(x,cy,gap*1.1,gap*.55,0,0,Math.PI*2);mx.fill();});
  // charge glow
  if(hold>0&&thrown===0){const g=mx.createRadialGradient(w*.5,h*.9,0,w*.5,h*.9,w*.4*hold);g.addColorStop(0,`rgba(185,140,240,${.5*hold})`);g.addColorStop(1,'rgba(125,57,173,0)');mx.fillStyle=g;mx.fillRect(0,0,w,h);}
  // the silk ascending as a ribbon of purple light
  if(thrown>0){const y0=h*(.9-thrown*1.1);mx.save();mx.globalAlpha=Math.min(1,(1-thrown)*3);const grad=mx.createLinearGradient(0,y0-h*.2,0,y0+h*.1);grad.addColorStop(0,'rgba(125,57,173,0)');grad.addColorStop(1,'rgba(185,140,240,.9)');mx.fillStyle=grad;mx.beginPath();
    for(let k=0;k<=20;k++){const xx=w*(.42+k*.008);mx.lineTo(xx,y0+Math.sin(t/180+k*.6)*12*DPR);}for(let k=20;k>=0;k--){const xx=w*(.42+k*.008);mx.lineTo(xx,y0+40*DPR+Math.sin(t/200+k*.5)*14*DPR);}mx.fill();mx.restore();
    const lg=mx.createRadialGradient(w*.5,0,0,w*.5,0,h*1.3);lg.addColorStop(0,`rgba(255,241,212,${thrown*.9})`);lg.addColorStop(1,`rgba(227,173,90,${thrown*.15})`);mx.fillStyle=lg;mx.fillRect(0,0,w,h);}
  emb.forEach(e=>{e.y-=e.v;if(e.y<0){e.y=1;e.x=Math.random();}mx.fillStyle=thrown>.3?'rgba(255,241,212,.75)':'rgba(255,140,60,.7)';mx.fillRect(e.x*w,e.y*h,1.6*DPR,1.6*DPR);});
}


/* offer page */
const offer=document.getElementById('offer');
function showOffer(on){offer.hidden=!on;document.body.style.overflow=on?'hidden':'';if(on){offer.scrollTop=0;document.getElementById('offerBack').focus();}}
document.getElementById('getSite').addEventListener('click',()=>{location.hash='unlock';showOffer(true);});
document.getElementById('offerBack').addEventListener('click',()=>{showOffer(false);history.replaceState(null,'',location.pathname+location.search);document.getElementById('getSite').focus();});
addEventListener('hashchange',()=>showOffer(location.hash==='#unlock'));
if(location.hash==='#unlock')showOffer(true);

/* lead form on the unlock page */
const leadForm=document.getElementById('leadForm'),leadMsg=document.getElementById('leadMsg'),leadSubmit=document.getElementById('leadSubmit');
function leadNote(text,kind){leadMsg.textContent=text;leadMsg.className='leadmsg'+(kind?' '+kind:'');}
leadForm.addEventListener('submit',async e=>{e.preventDefault();if(leadSubmit.disabled)return;
  const fd=new FormData(leadForm);const data={name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),choice:fd.get('choice'),website:fd.get('website')};
  const inputs={name:document.getElementById('leadName'),email:document.getElementById('leadEmail')};
  const errs={};if(!data.name)errs.name='Please enter your name.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))errs.email='Please enter a valid email address.';
  const showErrs=f=>{Object.entries(inputs).forEach(([k,el])=>el.setAttribute('aria-invalid',f&&f[k]?'true':'false'));const first=f&&Object.keys(inputs).find(k=>f[k]);if(first)inputs[first].focus();return first?f[first]:'';};
  if(Object.keys(errs).length){leadNote(showErrs(errs),'err');return;}
  showErrs(null);leadSubmit.disabled=true;leadSubmit.textContent='Sending…';leadNote('');
  const r=await submitLead(data);leadSubmit.disabled=false;leadSubmit.textContent='Send my details';
  if(r.ok){leadForm.classList.add('sent');leadNote(`Thank you, ${data.name.split(' ')[0]}. We will be in touch at ${data.email} soon.`,'ok');}
  else leadNote((r.fields&&showErrs(r.fields))||r.error,'err');});

/* loop */
addEventListener('resize',()=>{EV=fit(ec);SK=fit(sk);LV=fit(lc);NV=fit(nc);BV=fit(bc);MV=fit(mc);if(ecgOn){E=fit(ecC);ex0=0;}const t=performance.now();drawEyes(t);drawSky(t);drawLife(t);drawNight(t);drawBeast(t);drawMount(t);});
function loop(t){if(vis.has(ec))drawEyes(t);drawECG();if(vis.has(sk)||asc>0)drawSky(t);if(vis.has(lc)||charging)drawLife(t);if(vis.has(nc))drawNight(t);if(vis.has(bc))drawBeast(t);if(vis.has(mc)||holding)drawMount(t);rafId=requestAnimationFrame(loop);}
caveImg.onload=()=>drawNight(0);
drawEyes(4000);drawSky(0);drawLife(0);drawNight(0);drawBeast(0);drawMount(0);rafId=requestAnimationFrame(loop);

  return () => { cancelAnimationFrame(rafId); };
}
