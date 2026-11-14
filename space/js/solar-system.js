/* Solar system orrery: Sun, 8 planets, 5 dwarf planets, belts. Click a world to follow it. */
(function(){
'use strict';
var SP=SPACE,T=SP.THREE,D=SP.DATA,TAU=SP.TAU,rad=SP.rad;
SP.buildNav('solar-system.html');
var HOME_POS=new T.Vector3(0,58,108),ORIGIN=new T.Vector3(0,0,0);
var S=SP.createStage({dist:100,minDist:1.2,maxDist:900,far:12000,pan:true,fov:50});
S.camera.position.copy(HOME_POS);
SP.makeStars(S,9000,10000);
S.scene.add(new T.AmbientLight(0xffffff,.3));
S.scene.add(new T.PointLight(0xffffff,1.9,0,0));

var PLANETS=['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
var DWARFS=['ceres','pluto','haumea','makemake','eris'];
var state={dps:Math.pow(10,.9),orbits:true,labels:true,dwarfs:true,belts:true};
var items={},sphere=new T.SphereGeometry(1,48,48);

/* Sun */
var sunMat=new T.MeshBasicMaterial();SP.applyMap(sunMat,D.sun.urls,D.sun.proc,512,256);
var sunMesh=new T.Mesh(sphere,sunMat);sunMesh.scale.setScalar(5);S.scene.add(sunMesh);
var sunGlow=[];
[[16,'rgba(255,235,170,.9)','rgba(255,170,70,.45)'],[30,'rgba(255,190,90,.4)','rgba(255,120,30,.18)'],[56,'rgba(255,150,60,.16)','rgba(255,90,20,.05)']].forEach(function(g){
  var sp=new T.Sprite(new T.SpriteMaterial({map:SP.glowTexture(g[1],g[2]),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
  sp.scale.setScalar(g[0]);sp.userData.base=g[0];S.scene.add(sp);sunGlow.push(sp);
});
var sunLabel=SP.makeLabel('Sun',1,'#ffd9a0');S.scene.add(sunLabel);
var sunPick=new T.Mesh(new T.SphereGeometry(7,12,12),new T.MeshBasicMaterial({visible:false}));sunPick.userData.key='sun';S.scene.add(sunPick);

/* planets and dwarf planets */
function addBody(key,dwarf){
  var d=D[key],tilt=new T.Group(),pivot=new T.Group(),holder=new T.Group(),axial=new T.Group(),spin=new T.Group();
  tilt.rotation.x=rad(d.incl||0);S.scene.add(tilt);tilt.add(pivot);
  holder.position.x=d.orrDist;pivot.add(holder);
  axial.rotation.z=rad(d.tilt||0);holder.add(axial);axial.add(spin);
  var mat=new T.MeshPhongMaterial({shininess:3,specular:0x111111});
  var mesh=new T.Mesh(sphere,mat);mesh.scale.setScalar(d.rOrr);
  if(d.scale)mesh.scale.set(d.rOrr*d.scale[0],d.rOrr*d.scale[1],d.rOrr*d.scale[2]);
  spin.add(mesh);SP.applyMap(mat,d.urls,d.proc,512,256);
  if(d.ring){var r=SP.makeRing(d.ring.inner,d.ring.outer,d.ring.urls,d.ring.kind);r.scale.setScalar(d.rOrr);axial.add(r);}
  if(d.atm&&!dwarf){/* thin tint is skipped in the orrery to keep it light */}
  var pts=[];for(var i=0;i<256;i++)pts.push(new T.Vector3(Math.cos(i/256*TAU)*d.orrDist,0,Math.sin(i/256*TAU)*d.orrDist));
  var line=new T.LineLoop(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:dwarf?0xb59cff:0x7fa2ff,transparent:true,opacity:dwarf?.22:.28}));
  tilt.add(line);
  var label=SP.makeLabel(d.name,1,dwarf?'#cdbfff':'#dbe6ff');holder.add(label);
  var pick=new T.Mesh(new T.SphereGeometry(Math.max(d.rOrr*2.6,1.6),10,10),new T.MeshBasicMaterial({visible:false}));
  pick.userData.key=key;holder.add(pick);
  var it={key:key,def:d,tilt:tilt,pivot:pivot,holder:holder,spin:spin,line:line,label:label,pick:pick,dwarf:dwarf,ang:Math.random()*TAU,moon:null};
  if(key==='earth'){
    var mp=new T.Group(),mm=new T.MeshPhongMaterial({shininess:2}),mmesh=new T.Mesh(sphere,mm);
    mmesh.scale.setScalar(.3);mmesh.position.x=2.4;SP.applyMap(mm,D.moon.urls,D.moon.proc,256,128);mp.rotation.x=rad(5);mp.add(mmesh);holder.add(mp);
    it.moon=mp;
  }
  items[key]=it;
}
PLANETS.forEach(function(k){addBody(k,false);});
DWARFS.forEach(function(k){addBody(k,true);});

/* belts */
function belt(n,r0,r1,ySpread,color,size){
  var pos=new Float32Array(n*3);
  for(var i=0;i<n;i++){var r=r0+Math.random()*(r1-r0),a=Math.random()*TAU;pos[i*3]=Math.cos(a)*r;pos[i*3+1]=SP.gauss()*ySpread;pos[i*3+2]=Math.sin(a)*r;}
  var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));
  var p=new T.Points(g,new T.PointsMaterial({size:size,sizeAttenuation:false,color:color,map:SP.dotTexture(),transparent:true,opacity:.85,depthWrite:false}));
  p.frustumCulled=false;S.scene.add(p);return p;
}
var asteroids=belt(3500,20.8,25.2,.5,0xc2b29c,1.6),kuiper=belt(5500,77,100,5.5,0x9fb4d8,1.3);

/* simulation */
S.ticks.push(function(dt){
  var dps=state.dps;
  sunMesh.rotation.y+=TAU*Math.min(dps*24/609,.2)*dt;
  sunGlow.forEach(function(g,i){g.scale.setScalar(g.userData.base*(1+.02*Math.sin(S.time*(1.2+i*.4)+i)));});
  for(var k in items){
    var it=items[k],d=it.def;
    it.ang+=TAU/d.orbitDays*dps*dt;it.pivot.rotation.y=-it.ang;
    it.spin.rotation.y+=TAU*Math.min(dps*24/d.periodH,.45)*dt;
    if(it.moon)it.moon.rotation.y+=TAU/27.32*dps*dt*.2;
  }
  asteroids.rotation.y-=TAU/1680*dps*dt;kuiper.rotation.y-=TAU/98000*dps*dt;
});
/* labels keep a constant on-screen size */
S.ticks.push(function(){
  function size(lab,wp){var h=S.camera.position.distanceTo(wp)*.032;lab.scale.set(h*512/96,h,1);}
  var wp=new T.Vector3();
  sunLabel.position.set(0,8,0);size(sunLabel,sunLabel.position);sunLabel.visible=state.labels&&focus!=='sun';
  for(var k in items){
    var it=items[k];it.holder.getWorldPosition(wp);
    var up=Math.max(it.def.rOrr*1.8,1.1);
    it.label.position.set(0,up,0);size(it.label,wp);
    it.label.visible=state.labels&&it.group!==false&&focus!==k&&(!it.dwarf||state.dwarfs);
  }
});

/* focus and follow */
var focus='overview',zoomUntil=0,desired=30,tmp=new T.Vector3(),delta=new T.Vector3();
function bodyPos(k,out){if(k==='sun')return out.set(0,0,0);items[k].holder.getWorldPosition(out);return out;}
S.ticks.push(function(dt,real){
  if(focus==='overview')return;
  bodyPos(focus,tmp);
  delta.copy(S.controls.target);
  if(S.controls.target.distanceTo(tmp)<1.2)S.controls.target.copy(tmp);
  else S.controls.target.lerp(tmp,1-Math.pow(.0004,real));
  delta.subVectors(S.controls.target,delta);S.camera.position.add(delta);
  if(performance.now()<zoomUntil){
    var off=S.camera.position.clone().sub(S.controls.target),len=off.length();
    off.setLength(len+(desired-len)*(1-Math.pow(.02,real)));
    S.camera.position.copy(S.controls.target).add(off);
  }
});

var tabs=null,dwarfBtn=null;
var overview={name:'Solar system',tagline:'One star, eight planets, five recognised dwarf planets and billions of small bodies.',
  about:['Everything here orbits the Sun, which holds 99.86% of the system’s mass. Rocky planets sit close in, then the asteroid belt, then the gas and ice giants. Beyond Neptune lies the Kuiper Belt, home to Pluto and other dwarf planets.',
         'Planets spin on their own axes and travel around their orbits at the real relative speeds set by the Time slider. Orbit tilts of the dwarf planets are drawn at their true angles, which is why Eris and Haumea sit well above and below the others.'],
  facts:[['Age','4.6 billion years'],['Planets','8'],['Dwarf planets','5 recognised (Ceres, Pluto, Haumea, Makemake, Eris)'],
    ['Asteroid belt','2.2 to 3.2 AU from the Sun'],['Kuiper Belt','30 to 50 AU from the Sun'],['Heliosphere edge','about 120 AU (Voyager 1 crossed it in 2012)'],
    ['Light travel to Neptune','about 4 hours'],['Nearest star','Proxima Centauri, 4.25 light-years away']],
  fun:['Voyager 1 is the most distant human-made object, now more than 160 AU from the Sun.',
       'The Sun’s gravity reaches out to the Oort Cloud, perhaps 100,000 AU away.'],
  note:'Sizes and distances are compressed so every world stays visible. Click a world, or pick it above, to follow it.'};
function select(id){
  if(id!=='overview'&&D[id]&&DWARFS.indexOf(id)>=0&&!state.dwarfs){state.dwarfs=true;dwarfBtn.setAttribute('aria-pressed','true');applyVis();}
  focus=id;tabs.mark(id);
  if(id==='overview'){setTitle('Solar system');SP.setInfo(overview);S.flyTo(HOME_POS,ORIGIN);return;}
  var d=D[id];S._fly=null;zoomUntil=performance.now()+2400;
  desired=id==='sun'?24:Math.max(d.rOrr*6,7);
  var info=Object.assign({},d,{moons:null,note:'Scale is compressed in this view. Open the planet’s own page for moons and a close-up.'});
  SP.setInfo(info);setTitle(d.name);
}
function setTitle(t){document.title=t+' | MVA Space';}
function applyVis(){
  DWARFS.forEach(function(k){items[k].tilt.visible=state.dwarfs;});
  PLANETS.forEach(function(k){items[k].line.visible=state.orbits;});
  DWARFS.forEach(function(k){items[k].line.visible=state.orbits;});
  asteroids.visible=kuiper.visible=state.belts;
  picks();
}
var pickables=[];
function picks(){
  pickables=[sunPick];
  for(var k in items){if(!items[k].dwarf||state.dwarfs)pickables.push(items[k].pick);}
}

/* click to select */
var ray=new T.Raycaster(),ndc=new T.Vector2(),downAt=null,cv=S.renderer.domElement;
cv.addEventListener('pointerdown',function(e){downAt=[e.clientX,e.clientY];});
cv.addEventListener('pointerup',function(e){
  if(!downAt)return;var moved=Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1]);downAt=null;if(moved>5)return;
  var r=cv.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);
  ray.setFromCamera(ndc,S.camera);var hit=ray.intersectObjects(pickables,false)[0];
  if(hit)select(hit.object.userData.key);
});

/* controls */
var tb=SP.toolbar();
var g1=tb.group('Time');
tb.button(g1,'Pause',function(e){e.target.textContent=S.togglePause()?'Play':'Pause';});
tb.range(g1,'Speed',0,3,.02,.9,function(v){state.dps=Math.pow(10,v);},function(v){var x=Math.pow(10,v);return (x<10?x.toFixed(1):Math.round(x))+' days/s';});
var g2=tb.group('Show');
tb.toggle(g2,'Orbits',true,function(v){state.orbits=v;applyVis();});
tb.toggle(g2,'Labels',true,function(v){state.labels=v;});
dwarfBtn=tb.toggle(g2,'Dwarf planets',true,function(v){state.dwarfs=v;applyVis();});
tb.toggle(g2,'Belts',true,function(v){state.belts=v;applyVis();});
var g3=tb.group('View');
tb.button(g3,'Top-down',function(){focus='overview';tabs.mark('overview');SP.setInfo(overview);S.flyTo(new T.Vector3(0,190,.01),ORIGIN);});
tb.button(g3,'Side-on',function(){focus='overview';tabs.mark('overview');SP.setInfo(overview);S.flyTo(new T.Vector3(0,6,170),ORIGIN);});
tb.button(g3,'Overview',function(){select('overview');});
SP.windowGroup(tb);

var tabItems=[{id:'overview',label:'Overview'},{id:'sun',label:'Sun'}];
PLANETS.concat(DWARFS).forEach(function(k){tabItems.push({id:k,label:D[k].name});});
tabs=SP.buildTabs(tabItems,select,'overview');
applyVis();SP.setInfo(overview);setTitle('Solar system');
})();
