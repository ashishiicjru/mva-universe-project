/* Milky Way galaxy model + star types gallery */
(function(){
'use strict';
var SP=SPACE,T=SP.THREE,TAU=SP.TAU,gauss=SP.gauss;
SP.buildNav('milky-way.html');
var S=SP.createStage({dist:130,minDist:1,maxDist:420,far:9000,fov:50,pan:false});
S.camera.position.set(0,72,112);
SP.makeStars(S,6000,8000);

var state={speed:1,gt:0,labels:true,mode:'galaxy'};
var R=60;

/* ---------- galaxy (GPU-animated particles, slightly faster rotation near the centre) ---------- */
var N=90000,aR=new Float32Array(N),aA=new Float32Array(N),aY=new Float32Array(N),aSize=new Float32Array(N),aCol=new Float32Array(N*3);
for(var i=0;i<N;i++){
  var r,a,y,c,size,t=Math.random();
  if(t<.16){
    r=Math.abs(gauss())*5.5;a=Math.random()*TAU;y=gauss()*2.6;c=[1,.82,.55];size=.5+Math.random()*.6;
  }else{
    r=-Math.log(1-Math.random()*.985)*R*.27;if(r>R)r=R*Math.random();
    var arm=Math.random()<.7?(Math.random()<.5?0:2):(Math.random()<.5?1:3);
    var spread=Math.random()<.78?gauss()*(.2+r/R*.2):(Math.random()-.5)*TAU;
    a=r*.105+arm*TAU/4+spread;
    y=gauss()*(.7+2.4*Math.exp(-r/18))*.55;
    var mix=Math.min(1,r/(R*.62));
    c=[1-mix*.38,.86-mix*.04,.66+mix*.34];size=.35+Math.random()*.55;
    var q=Math.random();
    if(q<.025){c=[1,.45,.62];size=1.2;}else if(q<.05){c=[.62,.78,1];size=1;}
  }
  var br=(.5+.5*Math.random())*(t<.16?.55:1);
  aR[i]=r;aA[i]=a;aY[i]=y;aSize[i]=size;aCol[i*3]=c[0]*br;aCol[i*3+1]=c[1]*br;aCol[i*3+2]=c[2]*br;
}
var gg=new T.BufferGeometry();
gg.setAttribute('position',new T.BufferAttribute(new Float32Array(N*3),3));
gg.setAttribute('aR',new T.BufferAttribute(aR,1));gg.setAttribute('aA',new T.BufferAttribute(aA,1));
gg.setAttribute('aY',new T.BufferAttribute(aY,1));gg.setAttribute('aSize',new T.BufferAttribute(aSize,1));
gg.setAttribute('aCol',new T.BufferAttribute(aCol,3));
var galMat=new T.ShaderMaterial({
  uniforms:{uT:{value:0},uScale:{value:600},uMap:{value:SP.dotTexture()}},
  vertexShader:'attribute float aR;attribute float aA;attribute float aY;attribute float aSize;attribute vec3 aCol;'+
    'uniform float uT;uniform float uScale;varying vec3 vC;'+
    'void main(){float om=(0.75+0.5*exp(-aR/22.0))*0.11;float a=aA+uT*om;'+
    'vec4 mv=modelViewMatrix*vec4(cos(a)*aR,aY,sin(a)*aR,1.0);gl_Position=projectionMatrix*mv;'+
    'gl_PointSize=clamp(aSize*uScale/(-mv.z),1.0,26.0);vC=aCol;}',
  fragmentShader:'uniform sampler2D uMap;varying vec3 vC;void main(){float a=texture2D(uMap,gl_PointCoord).a;gl_FragColor=vec4(vC,a*0.9);}',
  transparent:true,depthWrite:false,blending:T.AdditiveBlending});
var galaxy=new T.Group(),pts=new T.Points(gg,galMat);pts.frustumCulled=false;galaxy.add(pts);
var core=new T.Sprite(new T.SpriteMaterial({map:SP.glowTexture('rgba(255,235,190,.9)','rgba(255,190,110,.35)'),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
core.scale.setScalar(26);galaxy.add(core);
var halo=new T.Sprite(new T.SpriteMaterial({map:SP.glowTexture('rgba(170,190,255,.25)','rgba(120,150,255,.08)'),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
halo.scale.setScalar(150);galaxy.add(halo);
var centerLabel=SP.makeLabel('Sagittarius A*, the central black hole',3.4,'#ffe3b0');centerLabel.position.set(0,7,0);galaxy.add(centerLabel);
var sunDot=new T.Sprite(new T.SpriteMaterial({map:SP.glowTexture('rgba(255,255,255,1)','rgba(255,230,120,.7)'),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
sunDot.scale.setScalar(5);galaxy.add(sunDot);
var sunLabel=SP.makeLabel('You are here: the Sun, about 26,000 light-years out',3.4,'#ffe27a');galaxy.add(sunLabel);
var SUN_R=30,SUN_A0=.6;
S.scene.add(galaxy);

/* ---------- star types gallery ---------- */
var STARS=[
 {id:'O',name:'O stars',color:'#9bb0ff',hex:0x9bb0ff,r:2.4,temp:'30,000 to 50,000 K',radius:'6.6 or more × Sun',mass:'16 or more × Sun',lum:'30,000 or more × Sun',
  life:'a few million years',share:'0.00003% of main-sequence stars',ex:'Zeta Ophiuchi, Mintaka',
  about:['O stars are the hottest, brightest and rarest. They burn through their fuel so fast that they die in a supernova within a few million years, often leaving a neutron star or black hole.']},
 {id:'B',name:'B stars',color:'#aabfff',hex:0xaabfff,r:1.9,temp:'10,000 to 30,000 K',radius:'1.8 to 6.6 × Sun',mass:'2.1 to 16 × Sun',lum:'25 to 30,000 × Sun',
  life:'10 to 300 million years',share:'0.13%',ex:'Rigel, Spica',
  about:['Blue-white B stars light up young star clusters. Rigel in Orion is a B supergiant roughly 120,000 times as luminous as the Sun.']},
 {id:'A',name:'A stars',color:'#cad7ff',hex:0xcad7ff,r:1.45,temp:'7,500 to 10,000 K',radius:'1.4 to 1.8 × Sun',mass:'1.4 to 2.1 × Sun',lum:'5 to 25 × Sun',
  life:'about 1 billion years',share:'0.6%',ex:'Sirius A, Vega',
  about:['White A stars include Sirius, the brightest star in our night sky, and Vega. Many spin very fast, so they are slightly flattened.']},
 {id:'F',name:'F stars',color:'#f8f7ff',hex:0xf8f7ff,r:1.2,temp:'6,000 to 7,500 K',radius:'1.15 to 1.4 × Sun',mass:'1.04 to 1.4 × Sun',lum:'1.5 to 5 × Sun',
  life:'3 to 7 billion years',share:'3%',ex:'Procyon A, Polaris',
  about:['Yellow-white F stars are hotter and brighter than the Sun and live long enough that planets around them could in principle develop life.']},
 {id:'G',name:'G stars',color:'#fff4a8',hex:0xfff0a0,r:1,temp:'5,200 to 6,000 K',radius:'0.96 to 1.15 × Sun',mass:'0.8 to 1.04 × Sun',lum:'0.6 to 1.5 × Sun',
  life:'about 10 billion years',share:'7.6%',ex:'The Sun, Alpha Centauri A',
  about:['The Sun is a G2 star. About 4.6 billion years old, it is roughly halfway through its main-sequence life.']},
 {id:'K',name:'K stars',color:'#ffcb8a',hex:0xffcb8a,r:.85,temp:'3,700 to 5,200 K',radius:'0.7 to 0.96 × Sun',mass:'0.45 to 0.8 × Sun',lum:'0.08 to 0.6 × Sun',
  life:'15 to 70 billion years',share:'12.1%',ex:'Alpha Centauri B, Epsilon Eridani',
  about:['Orange K stars are calm, long-lived and considered promising places to look for habitable planets.']},
 {id:'M',name:'M stars',color:'#ff9a6b',hex:0xff9a6b,r:.55,temp:'2,400 to 3,700 K',radius:'0.7 or less × Sun',mass:'0.08 to 0.45 × Sun',lum:'0.08 or less × Sun',
  life:'up to trillions of years',share:'76.5%',ex:'Proxima Centauri, Barnard’s Star',
  about:['Red dwarfs are by far the most common stars and none visible to the naked eye is a main-sequence M star. Betelgeuse is also class M, but it is a dying red supergiant.']}
];
var starGroup=new T.Group(),starObjs={};S.scene.add(starGroup);
(function(){
  var x=0,xs=[];STARS.forEach(function(s,i){x+=(i?STARS[i-1].r:0)+s.r+(i?2:0);xs.push(x);});
  var mid=(xs[0]+xs[xs.length-1])/2;
  STARS.forEach(function(s,i){
    var proc={seed:200+i,scale:12,octaves:6,colors:[[0,0,0],[0,0,0],[0,0,0]]},c=new T.Color(s.hex);
    var rgb=[Math.round(c.r*255),Math.round(c.g*255),Math.round(c.b*255)];
    proc.colors=[[rgb[0]*.55,rgb[1]*.5,rgb[2]*.45],[rgb[0]*.85,rgb[1]*.82,rgb[2]*.8],[Math.min(255,rgb[0]*1.05),Math.min(255,rgb[1]*1.05),Math.min(255,rgb[2]*1.05)],[255,255,245]];
    var mat=new T.MeshBasicMaterial({map:SP.proceduralTexture(proc,512,256)});
    var m=new T.Mesh(new T.SphereGeometry(s.r,64,64),mat);
    var g=new T.Group();g.position.set(xs[i]-mid,0,0);g.add(m);
    [[3.4,.55],[6.5,.22]].forEach(function(q){
      var sp=new T.Sprite(new T.SpriteMaterial({map:SP.glowTexture('rgba(255,255,255,.9)','rgba(255,255,255,.25)'),color:s.hex,blending:T.AdditiveBlending,transparent:true,depthWrite:false,opacity:q[1]*1.4}));
      sp.scale.setScalar(s.r*q[0]);g.add(sp);
    });
    var lab=SP.makeLabel(s.id+' class',1.2,s.color);lab.position.set(0,-s.r-1.3,0);g.add(lab);
    var pick=new T.Mesh(new T.SphereGeometry(s.r*1.4,10,10),new T.MeshBasicMaterial({visible:false}));pick.userData.id=s.id;g.add(pick);
    starGroup.add(g);starObjs[s.id]={group:g,mesh:m,def:s,pick:pick,lab:lab};
  });
})();
starGroup.visible=false;
S.ticks.push(function(dt){
  state.gt+=dt*state.speed;galMat.uniforms.uT.value=state.gt;
  var a=SUN_A0+state.gt*(.75+.5*Math.exp(-SUN_R/22))*.11;
  sunDot.position.set(Math.cos(a)*SUN_R,0,Math.sin(a)*SUN_R);sunLabel.position.set(sunDot.position.x,5,sunDot.position.z);
  sunLabel.visible=centerLabel.visible=state.labels;
  if(starGroup.visible){for(var k in starObjs){var o=starObjs[k];o.mesh.rotation.y+=dt*.35*state.speed/Math.max(.5,o.def.r);o.lab.visible=state.labels;}}
});
S.onResize=function(){galMat.uniforms.uScale.value=S.pointScale;};S.onResize();

/* ---------- info text ---------- */
var galaxyInfo={name:'Milky Way',tagline:'Our home: a barred spiral galaxy of 100 to 400 billion stars.',
  about:['This is a model of the Milky Way as it would look from outside, built from about 90,000 particles that follow its known structure: a bright central bulge, spiral arms of young blue stars and pink star-forming regions, and a thin disk. Nobody can photograph our galaxy from outside, so this view is a simulation based on survey data, not a photo.',
         'The Sun sits about 26,000 light-years from the centre in the Orion Spur and circles the galaxy at roughly 230 km/s, taking about 225 to 250 million years for each lap. Rotation here is sped up enormously.'],
  facts:[['Type','Barred spiral galaxy'],['Diameter (stellar disk)','about 100,000 light-years'],['Thickness of the thin disk','about 1,000 light-years'],
    ['Stars','100 to 400 billion'],['Age','about 13.6 billion years'],['Central black hole','Sagittarius A*, 4.3 million × Sun'],
    ['Sun’s distance from centre','about 26,000 light-years'],['Galactic year','225 to 250 million years'],
    ['Neighbour','Andromeda, 2.5 million light-years away']],
  fun:['Most of the galaxy’s mass is dark matter, which we cannot see.',
       'Andromeda is approaching at about 110 km/s. A collision was once predicted in 4 to 5 billion years, though newer analyses say it is far less certain.',
       'Stars are born in clouds of gas and dust, shine for millions to trillions of years, then end as white dwarfs, neutron stars or black holes.']};
var starsIntro={name:'Star types',tagline:'Stars are sorted by temperature into classes O, B, A, F, G, K and M.',
  about:['Hot stars glow blue-white and cool stars glow orange-red. Sizes here show typical relative radii, so a class O star is roughly four times wider than a class M star in this lineup. Select a class above, or click a star, to read its details.',
         'A star’s life depends on its mass. Heavy stars burn fast and end in supernovae that leave neutron stars or black holes. Stars like the Sun swell into red giants and fade into white dwarfs. The faintest red dwarfs will shine for trillions of years.'],
  facts:[['Hottest class','O (30,000 to 50,000 K)'],['Coolest class','M (2,400 to 3,700 K)'],['Most common class','M, about 76% of main-sequence stars'],
    ['Our Sun','Class G2']],note:'Drag to turn the view. Click a star for its details.'};
function starInfo(s){
  return {name:s.name,tagline:'Surface temperature '+s.temp+'.',about:s.about,
    facts:[['Colour',s.color.toUpperCase()==='#FFF4A8'?'Yellow':({O:'Blue',B:'Blue-white',A:'White',F:'Yellow-white',G:'Yellow',K:'Orange',M:'Red'})[s.id]],['Temperature',s.temp],['Radius',s.radius],['Mass',s.mass],
      ['Luminosity',s.lum],['Main-sequence life',s.life],['Share of stars',s.share],['Examples',s.ex]],note:'Typical values for main-sequence stars of this class.'};
}

/* ---------- mode switching ---------- */
var tabs=null,tb=SP.toolbar();
function setMode(id){
  var star=starObjs[id];
  tabs.mark(id);
  if(id==='galaxy'){
    state.mode='galaxy';galaxy.visible=true;starGroup.visible=false;SP.setInfo(galaxyInfo);document.title='Milky Way | MVA Space';
    S.controls.minDistance=8;S.flyTo(new T.Vector3(0,72,112),new T.Vector3(0,0,0));
    gG.hidden=false;gS.hidden=true;return;
  }
  state.mode='stars';galaxy.visible=false;starGroup.visible=true;S.controls.minDistance=1.5;gG.hidden=true;gS.hidden=false;
  if(id==='stars'){
    SP.setInfo(starsIntro);document.title='Star types | MVA Space';S.flyTo(new T.Vector3(0,5,30),new T.Vector3(0,0,0));
  }else{
    SP.setInfo(starInfo(star.def));document.title=star.def.name+' | MVA Space';
    var p=star.group.position;S.flyTo(new T.Vector3(p.x+1.5,p.y+star.def.r*.8,p.z+star.def.r*3.6+3),p);
  }
}
var gG=tb.group('Galaxy');
tb.toggle(gG,'Pause',false,function(v){if(S.paused!==v)S.togglePause();});
tb.range(gG,'Rotation',0,6,.1,1,function(v){state.speed=v;},function(v){return v.toFixed(1)+'×';});
tb.button(gG,'Top-down',function(){S.flyTo(new T.Vector3(0,140,.01),new T.Vector3(0,0,0));});
tb.button(gG,'Edge-on',function(){S.flyTo(new T.Vector3(0,4,140),new T.Vector3(0,0,0));});
tb.button(gG,'Angled',function(){S.flyTo(new T.Vector3(0,72,112),new T.Vector3(0,0,0));});
tb.toggle(gG,'Orbit camera',false,function(on){S.controls.autoRotate=on;S.controls.autoRotateSpeed=1.4;});
var gS=tb.group('Stars');gS.hidden=true;
tb.toggle(gS,'Pause',false,function(v){if(S.paused!==v)S.togglePause();});
tb.range(gS,'Spin',0,6,.1,1,function(v){state.speed=v;},function(v){return v.toFixed(1)+'×';});
tb.button(gS,'Whole lineup',function(){setMode('stars');});
tb.toggle(gS,'Orbit camera',false,function(on){S.controls.autoRotate=on;S.controls.autoRotateSpeed=1.4;});
var gL=tb.group('Labels');tb.toggle(gL,'Show labels',true,function(v){state.labels=v;});
SP.windowGroup(tb);

var items=[{id:'galaxy',label:'Milky Way'},{id:'stars',label:'Star types'}];
STARS.forEach(function(s){items.push({id:s.id,label:s.id+' stars'});});
tabs=SP.buildTabs(items,setMode,'galaxy');
setMode('galaxy');

/* click a star to open it */
var ray=new T.Raycaster(),ndc=new T.Vector2(),down=null,cv=S.renderer.domElement;
cv.addEventListener('pointerdown',function(e){down=[e.clientX,e.clientY];});
cv.addEventListener('pointerup',function(e){
  if(!down||state.mode!=='stars')return;var mv=Math.hypot(e.clientX-down[0],e.clientY-down[1]);down=null;if(mv>5)return;
  var r=cv.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(ndc,S.camera);
  var list=Object.keys(starObjs).map(function(k){return starObjs[k].pick;}),h=ray.intersectObjects(list,false)[0];
  if(h)setMode(h.object.userData.id);
});
})();
