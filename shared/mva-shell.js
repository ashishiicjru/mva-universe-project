/* MVA Universe shell: one registry, one sound system, one menu for every page. */
(function(){
const SC=document.currentScript,B=new URL('..',SC.src).href,own=!!window.MVA_OWN_AUDIO,P=location.pathname;
const SP=[['earth','Earth'],['moon','Moon'],['sun','Sun'],['inner-planets','Inner planets'],['gas-giants','Gas giants'],['ice-giants','Ice giants'],['dwarf-planets','Dwarf planets'],['solar-system','Solar system'],['milky-way','Milky Way & stars'],['universe-black-hole','Universe & black holes'],['earth-large','Earth XL'],['sun-large','Sun XL'],['mars-large','Mars XL'],['saturn-large','Saturn XL'],['jupiter-large','Jupiter XL']];
const REG=[
['MVA Organisation','🤖',[['index.html','MVA Home','🏠'],['brahmand-home.html','Brahmand Home','🌌'],['problem.html','Problem & Solution','🧩'],['health.html','Astronaut Health','🧑‍🚀'],['astronaut-health-lab.html','Astronaut Health Lab (Astroverse)','🧬'],['ganga.html','Ganga Monitor','🌊']]],
['Live Earth & Space','🛰️',[['solar.html','Solar System Explorer','☀️'],['earth.html','Earth Explorer (maps)','🌍'],['iss.html','ISS Live + GPS','🛰️'],['weather.html','Space Weather','🌦️'],['cosmos.html','Cosmos Gallery (NASA)','🪐']]],
['3D Space Viewers','🔭',SP.map(s=>['space/'+s[0]+'.html',s[1],'🔭'])],
['Live Apps · NASA API','🛰️',[['https://brahmand-ganga.vercel.app/','Brahmand Ganga Live App','🛰️'],['https://brahmand-ganga-frontend.vercel.app/','Brahmand Ganga Frontend','🚀']]],
['COSMOS App','🌠',[['cosmos-app/index.html','COSMOS: 13 worlds + Inside view','🌠'],['universe.html','Universe Hub','🌐']]]];
const FLAT=REG.flatMap(g=>g[2].map(i=>({g:g[0],u:i[0],t:i[1],e:i[2]})));
const store={get:()=>{try{return localStorage.getItem('mva.snd')}catch(e){return null}},set:v=>{try{localStorage.setItem('mva.snd',v)}catch(e){}}};
/* ---------- sound ---------- */
let ac,mg,nb,on=false;const root=/\/space\//.test(P)?49:/cosmos-app/.test(P)?41:55;
function ctx(){if(!ac){ac=new(window.AudioContext||window.webkitAudioContext)();nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=nb.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}}ac.resume&&ac.resume();return ac}
function ambient(){if(mg)return;const a=ctx();mg=a.createGain();mg.gain.value=0;mg.connect(a.destination);
 const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=360;lp.Q.value=3;lp.connect(mg);
 [[1,'sawtooth',.12],[1.006,'sawtooth',.12],[.5,'sine',.5],[1.5,'triangle',.1],[2.002,'sine',.05]].forEach(([m,t,g])=>{const o=a.createOscillator(),n=a.createGain();o.type=t;o.frequency.value=root*m;n.gain.value=g;o.connect(n);n.connect(lp);o.start()});
 const l=a.createOscillator(),lg=a.createGain();l.frequency.value=.06;lg.gain.value=200;l.connect(lg);lg.connect(lp.frequency);l.start();
 const ns=a.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=500;bp.Q.value=.8;const ng=a.createGain();ng.gain.value=.4;ns.connect(bp);bp.connect(ng);ng.connect(mg);ns.start();
 const dl=a.createDelay(2),fb=a.createGain();dl.delayTime.value=.6;fb.gain.value=.5;dl.connect(fb);fb.connect(dl);dl.connect(mg);
 (function ping(){if(on){const o=a.createOscillator(),g=a.createGain(),t=a.currentTime,n=[4,4.5,5,6,7.5,9][Math.random()*6|0];o.frequency.value=root*n*2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.07,t+.05);g.gain.exponentialRampToValueAtTime(.0005,t+4);o.connect(g);g.connect(dl);g.connect(mg);o.start(t);o.stop(t+4.2)}setTimeout(ping,2500+Math.random()*3500)})()}
function blip(f,d,v){if(!on||!ac)return;const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.5,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d)}
function whoosh(){if(!on||!ac)return;const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),t=ac.currentTime;s.buffer=nb;f.type='bandpass';f.Q.value=2;f.frequency.setValueAtTime(200,t);f.frequency.exponentialRampToValueAtTime(3000,t+.4);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.5,t+.15);g.gain.linearRampToValueAtTime(0,t+.42);s.connect(f);f.connect(g);g.connect(ac.destination);s.start(t);s.stop(t+.45)}
const btn=()=>document.querySelector('#mva-dock [data-a=snd]');
function setSound(v){on=v;store.set(v?'1':'0');if(v){ambient();mg.gain.linearRampToValueAtTime(.5,ac.currentTime+2);blip(660,.15,.12)}else if(mg)mg.gain.linearRampToValueAtTime(0,ac.currentTime+.4);const b=btn();if(b){b.textContent=v?'🔊':'🔇';b.classList.toggle('on',v)}}
/* ---------- navigation ---------- */
const ext=u=>/^https?:/.test(u),opn=u=>ext(u)?window.open(u,'_blank','noopener'):go(B+u);
function go(u){blip(520,.12,.1);whoosh();document.body.classList.add('mva-warp');setTimeout(()=>location.href=u,on?380:260)}
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||a.target||e.metaKey||e.ctrlKey||e.shiftKey||e.button)return;let u;try{u=new URL(a.href,location)}catch(x){return}
 if(u.origin!==location.origin||!u.pathname.startsWith(new URL(B).pathname)||u.pathname===P&&u.hash||/\.(zip|pdf)$/.test(u.pathname))return;e.preventDefault();go(u.href)});
addEventListener('pageshow',()=>document.body.classList.remove('mva-warp'));
/* ---------- UI ---------- */
function toast(t){let e=document.getElementById('mva-toast');if(!e){e=document.createElement('div');e.id='mva-toast';document.body.append(e)}e.textContent=t;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),3200)}
const dock=document.createElement('div');dock.id='mva-dock';
dock.innerHTML=`<button data-a=menu title='Search all pages (K)'>🧭</button>${own?'':"<button data-a=snd title='Space sound (M)'>🔇</button>"}<button data-a=fs title='Full screen (F)'>⛶</button><a href='${B}universe.html' title='Universe Hub'>🌠</a>`;
const pal=document.createElement('div');pal.id='mva-pal';pal.innerHTML="<div class=bx><input placeholder='Jump to any page… (arrows + Enter)'><div class=ls></div></div>";
let sel=0,shown=[];const inp=()=>pal.querySelector('input'),ls=()=>pal.querySelector('.ls');
function render(){const q=inp().value.toLowerCase().trim();shown=FLAT.filter(i=>!q||(i.t+' '+i.g).toLowerCase().includes(q));sel=Math.min(sel,Math.max(0,shown.length-1));let h='',g='';shown.forEach((i,n)=>{if(i.g!==g){g=i.g;h+=`<h6>${g}</h6>`}h+=`<div class='it${n===sel?' sel':''}' data-n=${n}><span>${i.e}</span>${i.t}<small>${ext(i.u)?new URL(i.u).host:i.u.split('/').pop()}</small></div>`});ls().innerHTML=h||'<h6>No match</h6>';const s=ls().querySelector('.sel');s&&s.scrollIntoView({block:'nearest'})}
function openPal(v){pal.classList.toggle('open',v);if(v){inp().value='';sel=0;render();inp().focus();blip(880,.1,.08)}}
function fs(){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}}
function init(){
 const v=document.createElement('div');v.id='mva-veil';document.body.append(v);setTimeout(()=>v.remove(),900);
 document.body.append(dock,pal);
 dock.onclick=e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.a;if(a==='menu')openPal(true);if(a==='snd')setSound(!on);if(a==='fs')fs()};
 pal.onclick=e=>{const i=e.target.closest('.it');if(i)opn(shown[+i.dataset.n].u);else if(e.target===pal)openPal(false)};
 pal.addEventListener('input',()=>{sel=0;render()});
 addEventListener('keydown',e=>{const typing=/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName);
  if(pal.classList.contains('open')){if(e.key==='Escape')openPal(false);if(e.key==='ArrowDown'){sel=Math.min(shown.length-1,sel+1);render();e.preventDefault()}if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);render();e.preventDefault()}if(e.key==='Enter'&&shown[sel])opn(shown[sel].u);return}
  if(typing||e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key.toLowerCase();if(k==='k'||k==='/'){e.preventDefault();openPal(true)}if(k==='m'&&!own)setSound(!on);if(k==='f'&&!own)fs()});
 let last=0;document.addEventListener('mouseover',e=>{const t=Date.now();if(t-last>70&&e.target.closest&&e.target.closest('a,button')){last=t;blip(1200,.05,.025)}});
 if(!own){if(store.get()==='1'){const r=()=>{setSound(true);removeEventListener('pointerdown',r);removeEventListener('keydown',r)};addEventListener('pointerdown',r);addEventListener('keydown',r);toast('Tap anywhere to resume space sound')}else toast('Tap 🔇 for space sound · press K to search every page')}
}
window.MVA={REG,FLAT,go:u=>go(B+u),setSound,base:B,toast};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
