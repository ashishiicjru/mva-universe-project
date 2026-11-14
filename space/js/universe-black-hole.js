/* Black hole (accretion disk, jets, photon ring) + observable universe (cosmic web, galaxies, CMB shell) */
(function(){
'use strict';
var SP=SPACE,T=SP.THREE,TAU=SP.TAU,gauss=SP.gauss,rand=SP.rand;
SP.buildNav('universe-black-hole.html');
var S=SP.createStage({dist:15,minDist:2.2,maxDist:60,far:30000,fov:50,pan:false});
S.camera.position.set(0,3.4,15);
SP.makeStars(S,9000,20000);
var state={speed:1,mode:'bh',labels:true};

/* ================= BLACK HOLE ================= */
var bh=new T.Group();S.scene.add(bh);
bh.add(new T.Mesh(new T.SphereGeometry(1,64,64),new T.MeshBasicMaterial({color:0x000000})));

function diskColor(r){ /* hot inner edge to cool outer edge */
  var t=Math.min(1,(r-1.7)/8);
  var a=[1,.97,.88],b=[1,.62,.22],c=[.75,.2,.1];
  var u=t<.4?t/.4:(t-.4)/.6,p=t<.4?a:b,q=t<.4?b:c;
  return [p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u,p[2]+(q[2]-p[2])*u];
}
var DN=60000,dR=new Float32Array(DN),dA=new Float32Array(DN),dY=new Float32Array(DN),dS=new Float32Array(DN),dC=new Float32Array(DN*3);
for(var i=0;i<DN;i++){
  var r=1.7+Math.pow(Math.random(),1.7)*9.3,c=diskColor(r),br=(.35+Math.random()*.65)*(1.3-.7*Math.min(1,(r-1.7)/9));
  dR[i]=r;dA[i]=Math.random()*TAU;dY[i]=gauss()*.05*(r*.35);dS[i]=.09+Math.random()*.12;
  dC[i*3]=c[0]*br;dC[i*3+1]=c[1]*br;dC[i*3+2]=c[2]*br;
}
var dg=new T.BufferGeometry();
dg.setAttribute('position',new T.BufferAttribute(new Float32Array(DN*3),3));
dg.setAttribute('aR',new T.BufferAttribute(dR,1));dg.setAttribute('aA',new T.BufferAttribute(dA,1));
dg.setAttribute('aY',new T.BufferAttribute(dY,1));dg.setAttribute('aSize',new T.BufferAttribute(dS,1));dg.setAttribute('aCol',new T.BufferAttribute(dC,3));
var diskMat=new T.ShaderMaterial({
  uniforms:{uT:{value:0},uScale:{value:600},uMap:{value:SP.dotTexture()}},
  vertexShader:'attribute float aR;attribute float aA;attribute float aY;attribute float aSize;attribute vec3 aCol;'+
    'uniform float uT;uniform float uScale;varying vec3 vC;varying float vB;'+
    'void main(){float om=5.0/pow(aR,1.5);float a=aA+uT*om;vec3 p=vec3(cos(a)*aR,aY,sin(a)*aR);'+
    'vec3 vel=vec3(-sin(a),0.0,cos(a));float dop=dot(vel,normalize(cameraPosition-p));vB=clamp(1.0+0.85*dop,0.2,2.2);'+
    'vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uScale/(-mv.z),1.0,30.0);vC=aCol;}',
  fragmentShader:'uniform sampler2D uMap;varying vec3 vC;varying float vB;void main(){float a=texture2D(uMap,gl_PointCoord).a;gl_FragColor=vec4(vC*vB,a*0.85);}',
  transparent:true,depthWrite:false,blending:T.AdditiveBlending});
var disk=new T.Points(dg,diskMat);disk.frustumCulled=false;bh.add(disk);

/* photon ring: a camera-facing ring imitates light bent around the hole from every direction */
function annulus(inner,outer){
  var c=document.createElement('canvas');c.width=c.height=512;var x=c.getContext('2d');
  var g=x.createRadialGradient(256,256,256*inner*.92,256,256,256*outer*1.08);
  g.addColorStop(0,'rgba(255,200,120,0)');g.addColorStop(.35,'rgba(255,225,170,.95)');g.addColorStop(.5,'rgba(255,250,235,1)');g.addColorStop(.7,'rgba(255,190,110,.5)');g.addColorStop(1,'rgba(255,140,60,0)');
  x.fillStyle=g;x.fillRect(0,0,512,512);return new T.CanvasTexture(c);
}
var ring=new T.Sprite(new T.SpriteMaterial({map:annulus(.62,.7),blending:T.AdditiveBlending,transparent:true,depthWrite:false,depthTest:false}));
ring.scale.setScalar(5.1);ring.renderOrder=5;bh.add(ring);
var halo=new T.Sprite(new T.SpriteMaterial({map:SP.glowTexture('rgba(255,170,90,.55)','rgba(255,110,40,.18)'),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
halo.scale.setScalar(13);bh.add(halo);

/* relativistic jets */
var JN=7000,jO=new Float32Array(JN),jS=new Float32Array(JN),jA=new Float32Array(JN),jR=new Float32Array(JN);
for(var j=0;j<JN;j++){jO[j]=Math.random();jS[j]=j%2?1:-1;jA[j]=Math.random()*TAU;jR[j]=Math.random();}
var jg=new T.BufferGeometry();
jg.setAttribute('position',new T.BufferAttribute(new Float32Array(JN*3),3));
jg.setAttribute('aOff',new T.BufferAttribute(jO,1));jg.setAttribute('aSide',new T.BufferAttribute(jS,1));
jg.setAttribute('aAng',new T.BufferAttribute(jA,1));jg.setAttribute('aRad',new T.BufferAttribute(jR,1));
var jetMat=new T.ShaderMaterial({
  uniforms:{uT:{value:0},uScale:{value:600},uMap:{value:SP.dotTexture()}},
  vertexShader:'attribute float aOff;attribute float aSide;attribute float aAng;attribute float aRad;uniform float uT;uniform float uScale;varying float vB;'+
    'void main(){float y=mod(aOff*30.0+uT*7.0,30.0)+1.2;float rr=(0.05+y*0.03)*aRad;'+
    'vec3 p=vec3(cos(aAng)*rr,aSide*y,sin(aAng)*rr);vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;'+
    'gl_PointSize=clamp(0.16*uScale/(-mv.z),1.0,14.0);vB=1.0-y/32.0;}',
  fragmentShader:'uniform sampler2D uMap;varying float vB;void main(){float a=texture2D(uMap,gl_PointCoord).a;gl_FragColor=vec4(vec3(0.55,0.72,1.0)*vB,a*vB*0.7);}',
  transparent:true,depthWrite:false,blending:T.AdditiveBlending});
var jets=new T.Points(jg,jetMat);jets.frustumCulled=false;bh.add(jets);

/* ================= OBSERVABLE UNIVERSE ================= */
var uni=new T.Group();S.scene.add(uni);uni.visible=false;
var nodes=[];for(var n=0;n<70;n++){var v=SP.randUnit().multiplyScalar(720*Math.cbrt(Math.random()));nodes.push(v);}
var pos=[],col=[],galaxyAnchors=[];
function addPt(p,warm,boost){
  pos.push(p.x,p.y,p.z);var b=(.35+Math.random()*.65)*(boost||1),w=warm?1:0;
  col.push((.62+.38*w)*b,(.76+.1*w)*b,(1-.4*w)*b);
}
nodes.forEach(function(a,idx){
  for(var k=0;k<220;k++){addPt(new T.Vector3(gauss()*16,gauss()*16,gauss()*16).add(a),Math.random()<.5,1.2);}
  var near=nodes.map(function(b,i){return {i:i,d:a.distanceTo(b)};}).filter(function(o){return o.i!==idx;}).sort(function(p,q){return p.d-q.d;}).slice(0,2);
  near.forEach(function(o){
    var b=nodes[o.i],steps=Math.round(o.d*.9);
    for(var s=0;s<steps;s++){
      var t=Math.random(),p=new T.Vector3().lerpVectors(a,b,t);p.x+=gauss()*9;p.y+=gauss()*9;p.z+=gauss()*9;
      addPt(p,Math.random()<.4);if(Math.random()<.02)galaxyAnchors.push(p.clone());
    }
  });
  if(Math.random()<.7)galaxyAnchors.push(a.clone().add(new T.Vector3(gauss()*8,gauss()*8,gauss()*8)));
});
for(var f=0;f<9000;f++){addPt(SP.randUnit().multiplyScalar(850*Math.cbrt(Math.random())),Math.random()<.3,.45);}
var ug=new T.BufferGeometry();
ug.setAttribute('position',new T.BufferAttribute(new Float32Array(pos),3));ug.setAttribute('color',new T.BufferAttribute(new Float32Array(col),3));
var web=new T.Points(ug,new T.PointsMaterial({size:1.8,sizeAttenuation:false,vertexColors:true,map:SP.dotTexture(),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));
web.frustumCulled=false;uni.add(web);

function galaxyTexture(kind){
  var c=document.createElement('canvas');c.width=c.height=128;var x=c.getContext('2d');
  var g=x.createRadialGradient(64,64,0,64,64,kind==='ell'?60:26);
  g.addColorStop(0,'rgba(255,245,220,1)');g.addColorStop(.3,'rgba(255,215,160,.55)');g.addColorStop(1,'rgba(255,200,140,0)');
  x.fillStyle=g;x.fillRect(0,0,128,128);
  if(kind==='spiral'){
    for(var arm=0;arm<2;arm++)for(var i=0;i<420;i++){
      var t=i/420,r=6+t*56,a=t*5.2+arm*Math.PI+gauss()*.12,px=64+Math.cos(a)*r,py=64+Math.sin(a)*r*.98;
      x.fillStyle='rgba('+(150+Math.round(90*t))+','+(185+Math.round(40*t))+',255,'+(.75*(1-t*.6))+')';x.fillRect(px,py,1.6,1.6);
    }
  }
  var t2=new T.CanvasTexture(c);return t2;
}
var texSp=galaxyTexture('spiral'),texEl=galaxyTexture('ell');
var galaxies=[];
galaxyAnchors.slice(0,520).forEach(function(p,i){
  var spiral=Math.random()<.7,tint=spiral?new T.Color().setHSL(.58+Math.random()*.08,.6,.75):new T.Color().setHSL(.09+Math.random()*.03,.55,.75);
  var sp=new T.Sprite(new T.SpriteMaterial({map:spiral?texSp:texEl,color:tint,blending:T.AdditiveBlending,transparent:true,depthWrite:false,opacity:.95,rotation:Math.random()*TAU}));
  var sz=spiral?rand(7,17):rand(5,11);sp.scale.setScalar(sz);sp.position.copy(p);uni.add(sp);
  galaxies.push({s:sp,w:(Math.random()-.5)*.5});
});
var home=new T.Sprite(new T.SpriteMaterial({map:SP.glowTexture('rgba(255,255,255,1)','rgba(255,225,120,.6)'),blending:T.AdditiveBlending,transparent:true,depthWrite:false}));
home.scale.setScalar(26);uni.add(home);
var homeLabel=SP.makeLabel('Milky Way, our home',20,'#ffe27a');homeLabel.position.set(0,26,0);uni.add(homeLabel);
var cmb=new T.Mesh(new T.SphereGeometry(1500,64,48),new T.MeshBasicMaterial({
  map:SP.proceduralTexture({seed:77,scale:9,octaves:5,colors:[[10,14,60],[40,30,120],[120,50,110],[200,90,70],[240,150,80]]},1024,512),
  side:T.BackSide,transparent:true,opacity:.34,depthWrite:false}));
cmb.visible=false;uni.add(cmb);

/* ================= animation ================= */
S.ticks.push(function(dt){
  var s=state.speed;
  if(state.mode==='bh'){
    diskMat.uniforms.uT.value+=dt*s;jetMat.uniforms.uT.value+=dt*s;
    ring.material.rotation=0;
  }else{
    uni.rotation.y+=dt*.018*s;
    for(var i=0;i<galaxies.length;i++)galaxies[i].s.material.rotation+=galaxies[i].w*dt*s;
    homeLabel.visible=state.labels;home.visible=state.labels;
  }
});
S.onResize=function(){diskMat.uniforms.uScale.value=S.pointScale;jetMat.uniforms.uScale.value=S.pointScale;};S.onResize();

/* ================= info ================= */
var bhInfo={name:'Black holes',tagline:'A region where gravity is so strong that not even light can leave.',
  about:['A black hole forms when a very massive star collapses, or when matter piles up at the centre of a galaxy. The boundary of no return is the event horizon, the black sphere in the middle. Anything that crosses it, including light, cannot escape.',
         'Gas spiralling in forms a hot accretion disk that glows in X-rays and visible light. The side moving toward you looks brighter (relativistic beaming), and gravity bends light from the far side of the disk over the top and under the bottom, which the bright ring imitates here. Some black holes also launch jets of particles at nearly the speed of light. This is a physically inspired simulation, not a photograph.'],
  facts:[['Horizon radius','2GM/c², about 2.95 km per solar mass'],['Sagittarius A*','4.3 million × Sun, 26,000 light-years away'],
    ['M87*','6.5 billion × Sun, 55 million light-years away'],['First image','M87*, April 2019 (Event Horizon Telescope)'],
    ['Sgr A* image','May 2022'],['Nearest known','Gaia BH1, about 1,560 light-years'],['Cygnus X-1','about 21 × Sun, 7,200 light-years'],
    ['Largest known','TON 618, tens of billions × Sun']],
  fun:['If the Sun became a black hole, its horizon would be only about 3 km across, and Earth would keep orbiting normally.',
       'Close to a black hole time runs slower: a clock near the horizon ticks more slowly than one far away.',
       'Stephen Hawking showed that black holes slowly leak energy, now called Hawking radiation.']};
var uniInfo={name:'Observable universe',tagline:'Everything we can see, about 93 billion light-years across.',
  about:['Galaxies are not scattered evenly. Gravity has pulled them into a cosmic web of filaments, walls and clusters separated by enormous voids. Each glowing disk here stands for a galaxy; yours is marked in the middle.',
         'The faint coloured shell is the cosmic microwave background, the afterglow of the early universe released about 380,000 years after the Big Bang, which surrounds us in every direction. Positions here are a schematic of the web’s structure, not a map of real galaxies.'],
  facts:[['Age','13.8 billion years'],['Diameter (observable)','about 93 billion light-years'],['Galaxies','roughly 2 trillion (estimate)'],
    ['Stars','more than 10²² (estimate)'],['Ordinary matter','about 5%'],['Dark matter','about 27%'],['Dark energy','about 68%'],
    ['Expansion rate','about 67 to 73 km/s per megaparsec'],['Our supercluster','Laniakea, about 520 million light-years across'],['Nearest large galaxy','Andromeda, 2.5 million light-years']],
  fun:['Space itself is expanding, so galaxies far away recede faster than light can ever catch them.',
       'The two best measurements of the expansion rate disagree, an open puzzle called the Hubble tension.',
       'The most distant galaxies seen with JWST formed within a few hundred million years of the Big Bang.']};

/* ================= toolbar and modes ================= */
var tb=SP.toolbar(),tabs=null;
var gCommon=tb.group('Motion');
tb.toggle(gCommon,'Pause',false,function(v){if(S.paused!==v)S.togglePause();});
tb.range(gCommon,'Speed',0,5,.1,1,function(v){state.speed=v;},function(v){return v.toFixed(1)+'×';});
tb.toggle(gCommon,'Orbit camera',false,function(on){S.controls.autoRotate=on;S.controls.autoRotateSpeed=1.5;});
var gB=tb.group('Black hole');
tb.button(gB,'Edge-on',function(){S.flyTo(new T.Vector3(15,.6,0),new T.Vector3(0,0,0));});
tb.button(gB,'Angled',function(){S.flyTo(new T.Vector3(0,3.4,15),new T.Vector3(0,0,0));});
tb.button(gB,'Top-down',function(){S.flyTo(new T.Vector3(0,17,.01),new T.Vector3(0,0,0));});
tb.toggle(gB,'Jets',true,function(v){jets.visible=v;});
tb.toggle(gB,'Light ring',true,function(v){ring.visible=v;});
var out=el2('output','tb-name','');
function el2(t,c,h){var e=document.createElement(t);e.className=c;e.textContent=h;return e;}
var gM=tb.group('Mass');
tb.range(gM,'Size',0,10,.1,0,function(v){out.textContent=massText(v);},function(v){return '10^'+v.toFixed(1);});
gM.appendChild(out);
function massText(v){
  var m=Math.pow(10,v),km=2.953*m;
  return fmtMass(m)+' Suns: horizon radius '+(km>=1e9?SP.fmtNum(km/1.496e8)+' AU':SP.fmtNum(km)+' km');
}
function fmtMass(m){return m>=1e4?SP.fmtNum(m):(m<10?m.toFixed(1):Math.round(m)).toString();}
out.textContent=massText(0);
var gU=tb.group('Universe');gU.hidden=true;
tb.button(gU,'Reset',function(){S.flyTo(new T.Vector3(0,260,640),new T.Vector3(0,0,0));});
tb.toggle(gU,'Microwave background',false,function(v){cmb.visible=v;});
tb.toggle(gU,'Labels',true,function(v){state.labels=v;});
SP.windowGroup(tb);

function setMode(id){
  tabs.mark(id);
  if(id==='bh'){
    state.mode='bh';bh.visible=true;uni.visible=false;S.controls.minDistance=2.2;S.controls.maxDistance=60;
    SP.setInfo(bhInfo);document.title='Black holes | MVA Space';gB.hidden=false;gM.hidden=false;gU.hidden=true;
    S.flyTo(new T.Vector3(0,3.4,15),new T.Vector3(0,0,0));
  }else{
    state.mode='uni';bh.visible=false;uni.visible=true;S.controls.minDistance=6;S.controls.maxDistance=1400;
    SP.setInfo(uniInfo);document.title='Observable universe | MVA Space';gB.hidden=true;gM.hidden=true;gU.hidden=false;
    S.flyTo(new T.Vector3(0,260,640),new T.Vector3(0,0,0));
  }
}
tabs=SP.buildTabs([{id:'bh',label:'Black holes'},{id:'uni',label:'Observable universe'}],setMode,'bh');
setMode('bh');
S.camera.position.set(0,3.4,15);
})();
