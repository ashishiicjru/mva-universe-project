/* MVA Space – shared engine: navigation, info panel, toolbar, 3D stage, textures, body viewer.
   Requires three.js r128 + OrbitControls and space-data.js loaded first. */
(function(global){
'use strict';
var THREE=global.THREE, DATA=global.SPACE_DATA||{};
var TAU=Math.PI*2;

/* ---------- configuration ---------- */
var HOME='../index.html';          // where the "MVA Space" brand link goes. Change after connecting.
var PAGES=[
  ['earth.html','Earth'],['moon.html','Moon'],['sun.html','Sun'],['inner-planets.html','Inner planets'],
  ['gas-giants.html','Gas giants'],['ice-giants.html','Ice giants'],['dwarf-planets.html','Dwarf planets'],
  ['solar-system.html','Solar system'],['milky-way.html','Milky Way and stars'],['universe-black-hole.html','Universe and black holes'],
  ['earth-large.html','Earth XL'],['sun-large.html','Sun XL'],['mars-large.html','Mars XL'],['saturn-large.html','Saturn XL'],['jupiter-large.html','Jupiter XL'],
  ['../cosmos-app/index.html','COSMOS App'],['../universe.html','Universe Hub']
];

/* ---------- small helpers ---------- */
function $(s,r){return (r||document).querySelector(s);}
function el(tag,attrs,html){
  var e=document.createElement(tag);
  if(attrs)for(var k in attrs){if(k==='class')e.className=attrs[k];else e.setAttribute(k,attrs[k]);}
  if(html!==undefined)e.innerHTML=html;return e;
}
function rad(d){return d*Math.PI/180;}
function rand(a,b){return a+Math.random()*(b-a);}
function gauss(){return (Math.random()+Math.random()+Math.random()+Math.random()-2)/2*1.7;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function fmtNum(n){
  if(n>=1e9)return (n/1e9).toPrecision(3).replace(/\.?0+$/,'')+' billion';
  if(n>=1e6)return (n/1e6).toPrecision(3).replace(/\.?0+$/,'')+' million';
  if(n>=1e4)return Math.round(n).toLocaleString('en-US');
  return (n>=100?n.toFixed(0):n.toPrecision(3)).replace(/\.?0+$/,'');
}

/* ---------- navigation ---------- */
function buildNav(active){
  var nav=$('#nav');if(!nav)return;
  nav.innerHTML='<a class="brand" href="'+HOME+'">MVA Space</a><nav aria-label="Space pages">'+
    PAGES.map(function(p){return '<a href="'+p[0]+'"'+(p[0]===active?' aria-current="page"':'')+'>'+p[1]+'</a>';}).join('')+'</nav>';
  var a=nav.querySelector('[aria-current]');
  if(a&&a.parentElement)a.parentElement.scrollLeft=Math.max(0,a.offsetLeft-60);
}

/* ---------- info panel ---------- */
function setInfo(d){
  var box=$('#info');if(!box)return;
  var h='<h1>'+d.name+'</h1><p class="tagline">'+(d.tagline||'')+'</p>';
  (d.about||[]).forEach(function(p){h+='<p>'+p+'</p>';});
  if(d.facts&&d.facts.length){
    h+='<h2>Key facts</h2><dl>'+d.facts.map(function(f){return '<dt>'+f[0]+'</dt><dd>'+f[1]+'</dd>';}).join('')+'</dl>';
  }
  if(d.moons&&d.moons.length){
    h+='<h2>Moons shown</h2><p>'+d.moons.map(function(m){return m.name;}).join(', ')+'. Sizes and distances are exaggerated so they stay visible.</p>';
  }
  if(d.fun&&d.fun.length){
    h+='<h2>Did you know</h2><ul>'+d.fun.map(function(f){return '<li>'+f+'</li>';}).join('')+'</ul>';
  }
  h+='<p class="note">'+(d.note||'Drag to turn the view. Scroll or pinch to zoom.')+'</p>';
  box.innerHTML=h;box.scrollTop=0;
}

/* ---------- tabs ---------- */
function buildTabs(items,onSelect,activeId){
  var t=$('#tabs');if(!t)return null;
  t.hidden=false;t.innerHTML='';
  var btns={};
  items.forEach(function(it){
    var b=el('button',{type:'button','aria-pressed':'false'},it.label);
    b.addEventListener('click',function(){mark(it.id);onSelect(it.id);});
    t.appendChild(b);btns[it.id]=b;
  });
  function mark(id){for(var k in btns)btns[k].setAttribute('aria-pressed',k===id?'true':'false');}
  mark(activeId);
  return {mark:mark};
}

/* ---------- toolbar ---------- */
function toolbar(){
  var root=$('#toolbar');root.innerHTML='';
  var api={
    root:root,
    group:function(name){
      var g=el('div',{'class':'tb-group',role:'group','aria-label':name});
      g.appendChild(el('span',{'class':'tb-name'},name));root.appendChild(g);return g;
    },
    button:function(g,label,fn,title){
      var b=el('button',{type:'button'},label);if(title)b.title=title;
      b.addEventListener('click',fn);g.appendChild(b);return b;
    },
    toggle:function(g,label,checked,fn){
      var b=el('button',{type:'button','aria-pressed':checked?'true':'false'},label);
      b.addEventListener('click',function(){
        var v=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',v?'true':'false');fn(v);
      });
      g.appendChild(b);return b;
    },
    range:function(g,label,min,max,step,val,fn,fmt){
      var w=el('label',{'class':'tb-range'});
      var s=el('span',null,label);
      var i=el('input',{type:'range',min:min,max:max,step:step,value:val});
      var o=el('output');
      function upd(){o.textContent=fmt?fmt(+i.value):i.value;}
      i.addEventListener('input',function(){upd();fn(+i.value);});
      upd();w.appendChild(s);w.appendChild(i);w.appendChild(o);g.appendChild(w);
      return {input:i,update:upd};
    }
  };
  return api;
}
function windowGroup(tb,startCollapsed){
  var g=tb.group('Window');
  var viewer=$('.viewer');
  tb.toggle(g,'Details',true,function(open){viewer.classList.toggle('collapsed',!open);});
  var m=viewer;
  if(m.requestFullscreen||m.webkitRequestFullscreen){
    tb.button(g,'Full screen',function(){
      if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document);}
      else{(m.requestFullscreen||m.webkitRequestFullscreen).call(m);}
    });
  }
  if(startCollapsed||(window.matchMedia&&window.matchMedia('(max-width:820px)').matches)){
    // start phones with the sheet closed so the model is visible; user opens it with Details
    viewer.classList.add('collapsed');g.querySelector('button').setAttribute('aria-pressed','false');
  }
  return g;
}

/* ---------- textures ---------- */
function loadFirst(urls,ok,fail,linear){
  var i=0,loader=new THREE.TextureLoader();loader.setCrossOrigin('anonymous');
  (function next(){
    if(!urls||i>=urls.length){if(fail)fail();return;}
    loader.load(urls[i++],function(t){
      t.anisotropy=8;if(!linear)t.encoding=THREE.sRGBEncoding;ok(t);
    },undefined,next);
  })();
}
function noise(seed){
  function h(x,y){var n=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;return n-Math.floor(n);}
  function sm(t){return t*t*(3-2*t);}
  function vn(x,y){
    var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
    var a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1),u=sm(xf),v=sm(yf);
    return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;
  }
  return function(x,y,o){var s=0,a=.5,f=1;for(var i=0;i<o;i++){s+=a*vn(x*f,y*f);f*=2;a*=.5;}return s;};
}
function proceduralTexture(p,w,h){
  p=p||{};w=w||1024;h=h||512;
  var c=document.createElement('canvas');c.width=w;c.height=h;
  var ctx=c.getContext('2d'),img=ctx.createImageData(w,h),d=img.data;
  var f=noise(p.seed||1),sc=p.scale||4,st=p.stretch||1,oct=p.octaves||5,ramp=p.colors||[[120,120,120],[200,200,200]];
  var bands=p.bands||0,bAmt=p.bandAmt||.8,turb=p.turb||3,W=sc*2/st,L=ramp.length-1;
  for(var j=0;j<h;j++){
    var v=j/h;
    for(var i=0;i<w;i++){
      var u=i/w,nx=u*W,ny=v*sc;
      var raw=f(nx,ny,oct)*(1-u)+f(nx-W,ny,oct)*u;
      var n=clamp((raw-.18)/.64,0,1);
      if(bands){var b=.5+.5*Math.sin(v*Math.PI*bands+n*turb);n=n*(1-bAmt)+b*bAmt;}
      var o=(j*w+i)*4;
      if(p.alpha){var a=clamp((n-.45)/.3,0,1);d[o]=d[o+1]=d[o+2]=255;d[o+3]=a*a*(3-2*a)*255;}
      else{
        var idx=n*L,k=Math.min(L-1,Math.floor(idx)),t=idx-k,c1=ramp[k],c2=ramp[Math.min(L,k+1)];
        d[o]=c1[0]+(c2[0]-c1[0])*t;d[o+1]=c1[1]+(c2[1]-c1[1])*t;d[o+2]=c1[2]+(c2[2]-c1[2])*t;d[o+3]=255;
      }
    }
  }
  ctx.putImageData(img,0,0);
  var k2=w/1024;
  if(p.craters){
    for(var q=0;q<p.craters;q++){
      var cx=Math.random()*w,cy=h*(.08+Math.random()*.84),r=(2+Math.pow(Math.random(),3)*26)*k2;
      var g=ctx.createRadialGradient(cx,cy,r*.2,cx,cy,r);
      g.addColorStop(0,'rgba(0,0,0,.28)');g.addColorStop(.8,'rgba(0,0,0,.12)');g.addColorStop(.92,'rgba(255,255,255,.2)');g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();
    }
  }
  (p.spots||[]).forEach(function(s){
    ctx.save();ctx.translate(s.u*w,s.v*h);ctx.scale(s.rx*k2,s.ry*k2);
    var g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,s.color);g.addColorStop(.7,s.color);g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,TAU);ctx.fill();ctx.restore();
  });
  var t=new THREE.CanvasTexture(c);t.anisotropy=4;t.encoding=THREE.sRGBEncoding;return t;
}
function avgColor(ramp){
  var r=0,g=0,b=0;ramp.forEach(function(c){r+=c[0];g+=c[1];b+=c[2];});
  var n=ramp.length;return new THREE.Color('rgb('+Math.round(r/n)+','+Math.round(g/n)+','+Math.round(b/n)+')');
}
/* apply a real texture if one loads, otherwise generate one */
function applyMap(mat,urls,proc,w,h){
  mat.color.copy(avgColor((proc||{}).colors||[[128,128,128]]));
  loadFirst(urls,function(t){mat.color.set(0xffffff);mat.map=t;mat.needsUpdate=true;},
    function(){mat.color.set(0xffffff);mat.map=proceduralTexture(proc,w,h);mat.needsUpdate=true;});
}
function ringTexture(kind){
  var w=1024,c=document.createElement('canvas');c.width=w;c.height=8;
  var x=c.getContext('2d'),img=x.createImageData(w,8),d=img.data,f=noise(5);
  for(var i=0;i<w;i++){
    var t=i/w,a=0,shade=1;
    if(kind==='saturn'){
      if(t<.18)a=.12+.1*f(t*40,1,2);
      else if(t<.5)a=.55+.4*f(t*60,2,3);
      else if(t<.57)a=.04;
      else if(t<.87)a=.5+.3*f(t*70,3,3);
      else if(t<.885)a=.03;
      else if(t<.97)a=.4+.25*f(t*90,4,3);
      shade=.78+.22*f(t*50,7,2);
    }else{a=(t>.35&&t<.5||t>.78&&t<.86)?.35+.2*f(t*80,2,2):.05;shade=.55;}
    for(var j=0;j<8;j++){var o=(j*w+i)*4;d[o]=225*shade;d[o+1]=205*shade;d[o+2]=170*shade;d[o+3]=clamp(a,0,1)*255;}
  }
  x.putImageData(img,0,0);var tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;return tx;
}
function makeRing(inner,outer,urls,kind){
  var g=new THREE.RingGeometry(inner,outer,180,1),pos=g.attributes.position,uv=g.attributes.uv,v=new THREE.Vector3();
  for(var i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i);uv.setXY(i,(v.length()-inner)/(outer-inner),.5);}
  var mat=new THREE.MeshBasicMaterial({side:THREE.DoubleSide,transparent:true,depthWrite:false,opacity:.95});
  var m=new THREE.Mesh(g,mat);m.rotation.x=-Math.PI/2;
  loadFirst(urls,function(t){mat.map=t;mat.needsUpdate=true;},function(){mat.map=ringTexture(kind);mat.needsUpdate=true;});
  return m;
}
function glowTexture(inner,outer){
  var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d');
  var g=x.createRadialGradient(128,128,0,128,128,128);
  g.addColorStop(0,inner||'rgba(255,255,255,1)');g.addColorStop(.25,outer||'rgba(255,200,120,.45)');g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(c);
}
var _dot=null;
function dotTexture(){
  if(_dot)return _dot;
  var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d');
  var g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);_dot=new THREE.CanvasTexture(c);return _dot;
}
function makeLabel(text,height,color){
  var c=document.createElement('canvas');c.width=512;c.height=96;var x=c.getContext('2d');
  x.font='600 40px Sora,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';
  x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=8;x.fillStyle=color||'#dbe6ff';x.fillText(text,256,48);
  var t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;
  var s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,depthWrite:false}));
  s.scale.set(height*512/96,height,1);s.renderOrder=20;return s;
}

/* ---------- stage (renderer, camera, controls, loop) ---------- */
function createStage(o){
  o=o||{};
  var host=$('#stage');
  var renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(global.devicePixelRatio||1,2));
  renderer.outputEncoding=THREE.sRGBEncoding;
  renderer.setClearColor(0x02030a,1);
  host.appendChild(renderer.domElement);
  var fov=o.fov||45;
  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(fov,1,o.near||.05,o.far||6000);
  var d0=o.dist||4;camera.position.set(0,d0*.16,d0);
  var controls=new THREE.OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.06;controls.rotateSpeed=.75;controls.zoomSpeed=.8;
  controls.minDistance=o.minDist||1.3;controls.maxDistance=o.maxDist||40;controls.enablePan=!!o.pan;
  var S={THREE:THREE,renderer:renderer,scene:scene,camera:camera,controls:controls,host:host,ticks:[],time:0,paused:false,
    w:1,h:1,pointScale:600,_fly:null};
  function size(){
    var r=host.getBoundingClientRect();S.w=Math.max(1,r.width);S.h=Math.max(1,r.height);
    renderer.setSize(S.w,S.h,true);camera.aspect=S.w/S.h;camera.updateProjectionMatrix();
    S.pointScale=S.h*renderer.getPixelRatio()/(2*Math.tan(rad(fov)/2));
    S.onResize&&S.onResize();
  }
  size();global.addEventListener('resize',size);
  if(global.ResizeObserver)new ResizeObserver(size).observe(host);
  controls.addEventListener('start',function(){S._fly=null;});
  S.flyTo=function(pos,target){S._fly={pos:pos.clone(),tgt:target?target.clone():null};};
  S.togglePause=function(){S.paused=!S.paused;return S.paused;};
  var clock=new THREE.Clock();
  (function loop(){
    requestAnimationFrame(loop);
    var real=Math.min(clock.getDelta(),.05),dt=S.paused?0:real;S.time+=dt;
    for(var i=0;i<S.ticks.length;i++)S.ticks[i](dt,real);
    if(S._fly){
      var k=1-Math.pow(.0015,real);
      camera.position.lerp(S._fly.pos,k);if(S._fly.tgt)controls.target.lerp(S._fly.tgt,k);
      if(camera.position.distanceTo(S._fly.pos)<.02*Math.max(1,S._fly.pos.length()*.05))S._fly=null;
    }
    controls.update();renderer.render(scene,camera);
  })();
  return S;
}
function randUnit(){var z=Math.random()*2-1,a=Math.random()*TAU,s=Math.sqrt(1-z*z);return new THREE.Vector3(s*Math.cos(a),z,s*Math.sin(a));}
function makeStars(S,count,radius){
  var pos=new Float32Array(count*3),col=new Float32Array(count*3),nrm=new THREE.Vector3(.3,1,.25).normalize();
  for(var i=0;i<count;i++){
    var v=randUnit();
    if(i<count*.45){v.addScaledVector(nrm,-v.dot(nrm)+gauss()*.13).normalize();}
    var R=radius*(.92+Math.random()*.08);
    pos[i*3]=v.x*R;pos[i*3+1]=v.y*R;pos[i*3+2]=v.z*R;
    var r=Math.random(),c=r<.16?[.7,.8,1]:r<.6?[1,.98,.94]:r<.85?[1,.9,.72]:[1,.74,.55];
    var b=.2+Math.pow(Math.random(),3)*.8;
    col[i*3]=c[0]*b;col[i*3+1]=c[1]*b;col[i*3+2]=c[2]*b;
  }
  var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));
  var m=new THREE.PointsMaterial({size:1.7,sizeAttenuation:false,vertexColors:true,map:dotTexture(),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
  var p=new THREE.Points(g,m);p.frustumCulled=false;S.scene.add(p);
  S.ticks.push(function(dt){p.rotation.y+=dt*.004;});
  return p;
}

/* ---------- shared view helpers ---------- */
function viewButtons(tb,S,getAxisTilt,getDist,extra){
  var g=tb.group('View');
  function go(dir){
    var d=getDist();S.flyTo(dir.clone().normalize().multiplyScalar(d),new THREE.Vector3(0,0,0));
  }
  function axis(){var t=rad(getAxisTilt());return new THREE.Vector3(-Math.sin(t),Math.cos(t),0);}
  var views=[['Equator',function(){return new THREE.Vector3(0,0,1);}],
    ['North pole',function(){return axis().add(new THREE.Vector3(0,0,.001));}],
    ['South pole',function(){return axis().negate().add(new THREE.Vector3(0,0,.001));}],
    ['Side',function(){var t=rad(getAxisTilt());return new THREE.Vector3(Math.cos(t),Math.sin(t),0);}],
    ['Far side',function(){return new THREE.Vector3(0,0,-1);}],
    ['Tilted',function(){return axis().multiplyScalar(.6).add(new THREE.Vector3(.3,0,.75));}]];
  views.forEach(function(v){tb.button(g,v[0],function(){go(v[1]());});});
  tb.toggle(g,'Orbit camera',false,function(on){S.controls.autoRotate=on;S.controls.autoRotateSpeed=1.6;});
  return g;
}

/* ---------- single-body viewer (Earth, Moon, Sun, planets, dwarf planets) ---------- */
function turnSeconds(D){return clamp(D.periodH,8,30);}
function glowShader(color){
  return new THREE.ShaderMaterial({
    uniforms:{c:{value:new THREE.Color(color)}},
    vertexShader:'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
    fragmentShader:'uniform vec3 c;varying vec3 vN;void main(){float i=pow(max(0.0,0.74-dot(vN,vec3(0.0,0.0,1.0))),3.0);gl_FragColor=vec4(c*i*1.7,i);}',
    side:THREE.BackSide,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false});
}
function buildBody(S,key,state){
  var D=DATA[key],root=new THREE.Group(),axial=new THREE.Group(),spin=new THREE.Group();
  axial.rotation.z=rad(D.tilt||0);root.add(axial);axial.add(spin);
  var geo=new THREE.SphereGeometry(1,96,96);
  var mat=D.emissive?new THREE.MeshBasicMaterial():new THREE.MeshPhongMaterial({shininess:D.shininess||4,specular:0x222222});
  var mesh=new THREE.Mesh(geo,mat);if(D.scale)mesh.scale.set(D.scale[0],D.scale[1],D.scale[2]);spin.add(mesh);
  applyMap(mat,D.urls,D.proc,1024,512);
  if(D.normal)loadFirst(D.normal,function(t){mat.normalMap=t;mat.normalScale=new THREE.Vector2(.9,.9);mat.needsUpdate=true;},null,true);
  if(D.spec)loadFirst(D.spec,function(t){mat.specularMap=t;mat.specular=new THREE.Color(0x6a6a6a);mat.needsUpdate=true;},null,true);
  var clouds=null;
  if(D.clouds){
    var cm=new THREE.MeshPhongMaterial({transparent:true,opacity:.95,depthWrite:false});
    clouds=new THREE.Mesh(new THREE.SphereGeometry(1.012,80,80),cm);spin.add(clouds);
    loadFirst(D.clouds,function(t){cm.map=t;cm.needsUpdate=true;},function(){
      cm.map=proceduralTexture({seed:3,scale:5,octaves:6,alpha:true},1024,512);cm.needsUpdate=true;});
  }
  if(D.atm){var a=new THREE.Mesh(new THREE.SphereGeometry(1.14,64,64),glowShader(D.atm));axial.add(a);}
  var glows=[];
  if(D.glow){
    [[2.5,'rgba(255,230,160,.95)','rgba(255,160,60,.5)'],[4.6,'rgba(255,190,90,.5)','rgba(255,120,30,.22)'],[9,'rgba(255,150,60,.22)','rgba(255,90,20,.08)']].forEach(function(g){
      var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(g[1],g[2]),blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));
      sp.scale.setScalar(g[0]);sp.userData.base=g[0];root.add(sp);glows.push(sp);
    });
  }
  if(D.ring){axial.add(makeRing(D.ring.inner,D.ring.outer,D.ring.urls,D.ring.kind));}
  var moons=[];
  if(D.moons&&D.moons.length){
    var mg=new THREE.Group();(D.moonPlane==='ecliptic'?root:axial).add(mg);
    D.moons.forEach(function(m){
      var mm=new THREE.MeshPhongMaterial({color:m.color||0xbdbdbd,shininess:2});
      var mmesh=new THREE.Mesh(new THREE.SphereGeometry(m.r,40,40),mm);
      if(m.key&&DATA[m.key])applyMap(mm,DATA[m.key].urls,DATA[m.key].proc,512,256);
      var pivot=new THREE.Group();pivot.rotation.x=rad(m.incl||0);mg.add(pivot);
      var ring=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints((function(){var a=[];for(var i=0;i<128;i++)a.push(new THREE.Vector3(Math.cos(i/128*TAU)*m.d,0,Math.sin(i/128*TAU)*m.d));return a;})()),
        new THREE.LineBasicMaterial({color:0x7fa2ff,transparent:true,opacity:.22}));
      pivot.add(ring);pivot.add(mmesh);
      var lab=makeLabel(m.name,m.r>.2?.34:.2);pivot.add(lab);
      moons.push({def:m,mesh:mmesh,pivot:pivot,label:lab,ang:Math.random()*TAU});
    });
  }
  var api={root:root,axial:axial,spin:spin,
    update:function(dt){
      var omega=TAU*state.mult/turnSeconds(D);
      spin.rotation.y+=omega*dt;
      if(clouds)clouds.rotation.y+=omega*.06*dt;
      var timeScale=D.periodH*3600/turnSeconds(D)*state.mult;
      moons.forEach(function(m){
        var dir=m.def.retro?-1:1;
        if(m.def.lock){m.ang=spin.rotation.y+.6;}
        else{
          var pSec=m.def.p*86400/timeScale,eff=Math.min(pSec,(10+1.5*m.def.p)/state.mult);
          m.ang+=dir*TAU*dt/eff;
        }
        m.mesh.position.set(Math.cos(m.ang)*m.def.d,0,Math.sin(m.ang)*m.def.d);
        m.label.position.set(m.mesh.position.x,m.def.r+.22,m.mesh.position.z);
        m.label.visible=state.labels;
      });
      glows.forEach(function(g,i){g.scale.setScalar(g.userData.base*(1+.025*Math.sin(S.time*(1.3+i*.5)+i)));});
    },
    dispose:function(){
      root.traverse(function(o){if(o.geometry)o.geometry.dispose();if(o.material){if(o.material.map)o.material.map.dispose();o.material.dispose();}});
    }};
  return api;
}
function bodyViewer(cfg){
  var keys=cfg.keys;
  buildNav(cfg.active);
  var hash=(location.hash||'').slice(1);
  var key=keys.indexOf(hash)>=0?hash:keys[0];
  function camD(){return cfg.camDist||DATA[key].camDist||4;}
  var state={mult:1,angle:rad(40),full:false,labels:true};
  var S=createStage({dist:camD(),minDist:cfg.minDist||1.25,maxDist:60,far:8000});
  makeStars(S,7000,7000);
  var amb=new THREE.AmbientLight(0xffffff,.14),sun=new THREE.DirectionalLight(0xffffff,1.45);
  S.scene.add(amb);S.scene.add(sun);
  function light(){
    var D=DATA[key];
    sun.position.set(Math.cos(state.angle)*30,6,Math.sin(state.angle)*30);
    if(D.emissive){sun.intensity=0;amb.intensity=1;}
    else if(state.full){sun.intensity=0;amb.intensity=1.15;}
    else{sun.intensity=1.45;amb.intensity=.14;}
  }
  var built=null,tb=toolbar();
  var g1=tb.group('Spin');
  tb.button(g1,'Pause',function(e){var p=S.togglePause();e.target.textContent=p?'Play':'Pause';});
  var readout;
  function timeText(){
    var D=DATA[key],hPerSec=D.periodH/turnSeconds(D)*state.mult;
    return hPerSec>=48?'1 s = '+(hPerSec/24).toFixed(1)+' days':'1 s = '+hPerSec.toFixed(1)+' h';
  }
  readout=tb.range(g1,'Speed',.1,8,.1,1,function(v){state.mult=v;},function(v){return v.toFixed(1)+'×';});
  var timeOut=el('output',{'class':'tb-name'},'');g1.appendChild(timeOut);
  function refreshTime(){timeOut.textContent=timeText();}
  readout.input.addEventListener('input',refreshTime);
  viewButtons(tb,S,function(){return DATA[key].tilt||0;},function(){return Math.max(S.camera.position.length(),camD()*.8);});
  var g3=tb.group('Light');
  tb.range(g3,'Sun angle',0,360,1,40,function(v){state.angle=rad(v);light();},function(v){return Math.round(v)+'°';});
  var fullBtn=tb.toggle(g3,'Light the night side',false,function(v){state.full=v;light();});
  tb.toggle(g3,'Labels',true,function(v){state.labels=v;});
  windowGroup(tb,!!cfg.large);

  function show(k){
    key=k;var D=DATA[k];
    if(built){S.scene.remove(built.root);built.dispose();}
    built=buildBody(S,k,state);S.scene.add(built.root);
    light();setInfo(D);refreshTime();
    S.controls.maxDistance=Math.max(30,camD()*6);
    var dir=S.camera.position.clone().normalize();if(dir.y>.7)dir.set(0,.16,1).normalize();
    S.flyTo(dir.multiplyScalar(camD()),new THREE.Vector3(0,0,0));
    document.title=D.name+' | MVA Space';
    var emissive=!!D.emissive;g3.hidden=emissive;
  }
  S.ticks.push(function(dt){if(built)built.update(dt);});
  var tabs=null;
  if(keys.length>1){
    tabs=buildTabs(keys.map(function(k){return {id:k,label:DATA[k].name};}),function(id){
      history.replaceState(null,'','#'+id);show(id);},key);
  }
  show(key);
  S.camera.position.set(0,camD()*.16,camD());
  return S;
}

global.SPACE={PAGES:PAGES,DATA:DATA,THREE:THREE,TAU:TAU,$:$,el:el,rad:rad,rand:rand,gauss:gauss,clamp:clamp,fmtNum:fmtNum,
  buildNav:buildNav,setInfo:setInfo,buildTabs:buildTabs,toolbar:toolbar,windowGroup:windowGroup,createStage:createStage,
  makeStars:makeStars,applyMap:applyMap,loadFirst:loadFirst,proceduralTexture:proceduralTexture,makeRing:makeRing,
  makeLabel:makeLabel,glowTexture:glowTexture,dotTexture:dotTexture,randUnit:randUnit,viewButtons:viewButtons,
  bodyViewer:bodyViewer,noise:noise};
})(window);
