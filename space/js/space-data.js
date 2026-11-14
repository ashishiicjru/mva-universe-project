/* MVA Space – planet / moon / sun / dwarf planet data.
   Texture lists try your own file first (assets/textures/), then a public NASA-based mirror,
   and finally fall back to a generated surface, so every page always renders. */
(function(global){
'use strict';
var T3='https://threejs.org/examples/textures/planets/';
var SSS='https://www.solarsystemscope.com/textures/download/';
function tex(name,ext,remote){var a=['assets/textures/'+name+'.'+ext];if(remote)a.push(remote);return a;}

var DATA={
sun:{
  name:'Sun',tagline:'Our star: a 4.6-billion-year-old ball of fusing hydrogen.',
  emissive:true,glow:true,tilt:7.25,periodH:609.1,camDist:5,
  urls:tex('sun','jpg',SSS+'2k_sun.jpg'),
  proc:{seed:11,scale:14,octaves:6,colors:[[170,45,0],[245,105,10],[255,175,50],[255,225,130],[255,246,200]]},
  rOrr:5,orrDist:0,
  about:[
    'The Sun holds 99.86% of all the mass in the Solar System. Deep in its core, at about 15 million °C, hydrogen nuclei fuse into helium and turn roughly four million tonnes of matter into light and heat every second.',
    'Sunlight takes 8 minutes 20 seconds to reach Earth. The Sun is not a solid: it spins fastest at the equator (about 25 days) and slowest near the poles (about 35 days), which twists its magnetic field into sunspots, flares and eruptions.'],
  facts:[['Type','G2V yellow dwarf star'],['Diameter','1,392,700 km (109 × Earth)'],['Mass','1.989 × 10³⁰ kg (333,000 × Earth)'],
    ['Surface gravity','274 m/s² (28 × Earth)'],['Surface temperature','about 5,500 °C'],['Core temperature','about 15 million °C'],
    ['Rotation','25.4 days at equator, 35 days at poles'],['Composition','73% hydrogen, 25% helium'],['Age','4.6 billion years'],
    ['Luminosity','3.83 × 10²⁶ watts'],['Distance from Earth','149.6 million km (1 AU)'],['Remaining life','about 5 billion years']],
  fun:['Sunspots look dark only because they are about 1,500 °C cooler than their surroundings.',
       'The Sun follows an 11-year activity cycle. Solar Cycle 25 reached its peak around 2024.',
       'In about 5 billion years it will swell into a red giant, then shrink to a white dwarf.']
},
mercury:{
  name:'Mercury',tagline:'The smallest planet, baked by day and frozen by night.',
  tilt:0.03,periodH:1407.6,camDist:3.6,
  urls:tex('mercury','jpg',SSS+'2k_mercury.jpg'),
  proc:{seed:21,scale:6,octaves:6,craters:140,colors:[[70,66,62],[110,104,98],[150,144,136],[185,178,168]]},
  rOrr:0.55,orrDist:8.7,orbitDays:88,incl:7,
  about:[
    'Mercury is only slightly larger than our Moon and has almost no atmosphere, so its surface is covered in craters that are billions of years old. The Caloris Basin, an impact scar about 1,550 km wide, is one of the largest in the Solar System.',
    'It spins exactly three times for every two orbits of the Sun. One full day from sunrise to sunrise lasts 176 Earth days, longer than its 88-day year.'],
  facts:[['Diameter','4,879 km (0.38 × Earth)'],['Mass','3.30 × 10²³ kg (0.055 × Earth)'],['Gravity','3.7 m/s²'],
    ['Rotation','58.6 Earth days'],['Orbit (year)','88 days'],['Distance from Sun','57.9 million km (0.39 AU)'],
    ['Axial tilt','0.03°'],['Temperature','−180 °C to 430 °C'],['Moons','0'],['Missions','Mariner 10, MESSENGER, BepiColombo']],
  fun:['Water ice survives in permanently shadowed craters near Mercury’s poles.',
       'Mercury is shrinking: its iron core is cooling and the crust is wrinkling into cliffs.',
       'It is the fastest planet, moving at about 47 km/s around the Sun.']
},
venus:{
  name:'Venus',tagline:'Earth’s twin in size, a crushing greenhouse in practice.',
  tilt:177.4,periodH:5832.5,camDist:3.6,
  urls:tex('venus','jpg',SSS+'2k_venus_surface.jpg'),
  proc:{seed:31,scale:3,octaves:5,bands:7,bandAmt:.45,turb:5,stretch:2,colors:[[170,120,60],[210,160,90],[236,196,125],[248,226,170]]},
  atm:'#e8b86a',rOrr:0.95,orrDist:11.9,orbitDays:224.7,incl:3.4,
  about:[
    'Venus is wrapped in thick clouds of sulphuric acid. Its carbon-dioxide atmosphere traps heat so efficiently that the surface sits at about 465 °C, hot enough to melt lead, under a pressure 92 times that of Earth.',
    'It spins backwards (east to west) and so slowly that one day on Venus is longer than its year. Radar shows thousands of volcanoes and vast lava plains.'],
  facts:[['Diameter','12,104 km (0.95 × Earth)'],['Mass','4.87 × 10²⁴ kg (0.82 × Earth)'],['Gravity','8.87 m/s²'],
    ['Rotation','243 Earth days, retrograde'],['Orbit (year)','224.7 days'],['Distance from Sun','108.2 million km (0.72 AU)'],
    ['Axial tilt','177.4° (spins upside down)'],['Surface temperature','about 465 °C'],['Atmosphere','96.5% CO₂, 3.5% N₂'],['Moons','0']],
  fun:['Venus is the hottest planet, even hotter than Mercury.',
       'Soviet Venera 13 survived 127 minutes on the surface in 1982.',
       'The Sun rises in the west and sets in the east on Venus.']
},
earth:{
  name:'Earth',tagline:'The only world known to host life, turning once every 24 hours.',
  tilt:23.44,periodH:23.934,camDist:5.4,shininess:14,
  urls:tex('earth','jpg',T3+'earth_atmos_2048.jpg'),
  normal:tex('earth_normal','jpg',T3+'earth_normal_2048.jpg'),
  spec:tex('earth_specular','jpg',T3+'earth_specular_2048.jpg'),
  clouds:tex('earth_clouds','png',T3+'earth_clouds_1024.png'),
  proc:{seed:7,scale:3.2,octaves:6,colors:[[6,24,72],[8,34,96],[10,46,120],[14,60,140],[40,104,62],[100,126,68],[180,166,122]]},
  atm:'#4aa3ff',rOrr:1,orrDist:14,orbitDays:365.25,incl:0,
  moons:[{name:'Moon',key:'moon',r:0.27,d:3.3,p:27.32,incl:5.1}],moonPlane:'ecliptic',
  about:[
    'Earth is the third planet from the Sun and the only place we know with liquid water on the surface, a protective magnetic field and an oxygen-rich atmosphere. About 71% of the surface is ocean.',
    'The planet turns once every 23 h 56 min, giving us day and night, and its 23.4° tilt causes the seasons. Spin the globe from any angle and move the Sun slider to see the day side and night side change.'],
  facts:[['Diameter','12,742 km'],['Mass','5.97 × 10²⁴ kg'],['Gravity','9.81 m/s²'],['Rotation','23 h 56 min'],
    ['Orbit (year)','365.25 days'],['Distance from Sun','149.6 million km (1 AU)'],['Axial tilt','23.44°'],
    ['Average temperature','15 °C'],['Atmosphere','78% N₂, 21% O₂'],['Moons','1'],['Age','4.54 billion years']],
  fun:['Earth is not a perfect sphere: it bulges about 21 km wider at the equator.',
       'The Moon drifts away from Earth by about 3.8 cm every year.',
       'Earth moves around the Sun at roughly 30 km/s, about 107,000 km/h.']
},
moon:{
  name:'Moon',tagline:'Earth’s only natural satellite, always showing us the same face.',
  tilt:6.68,periodH:655.7,camDist:3.8,shininess:2,
  urls:tex('moon','jpg',T3+'moon_1024.jpg'),
  proc:{seed:41,scale:7,octaves:6,craters:170,colors:[[62,62,64],[110,110,112],[158,158,160],[200,200,200]]},
  rOrr:0.27,orrDist:2.2,orbitDays:27.32,incl:5.1,
  about:[
    'The Moon probably formed about 4.5 billion years ago when a Mars-sized body struck the young Earth and the debris merged. The dark patches called maria are ancient lava plains; the bright highlands are older and heavily cratered.',
    'Tidal forces locked its rotation, so it turns once per orbit and the same side always faces Earth. Drag the Sun-angle slider to watch the phases from new Moon to full Moon.'],
  facts:[['Diameter','3,475 km (0.27 × Earth)'],['Mass','7.35 × 10²² kg (1.2% of Earth)'],['Gravity','1.62 m/s² (0.17 × Earth)'],
    ['Rotation','27.3 days (tidally locked)'],['Orbit around Earth','27.3 days'],['Distance from Earth','384,400 km'],
    ['Axial tilt','6.7° to its orbit, 1.5° to the ecliptic'],['Temperature','−173 °C to 127 °C'],['Atmosphere','almost none'],
    ['Age','about 4.5 billion years']],
  fun:['Twelve people have walked on the Moon. Apollo 17 in December 1972 was the last crewed landing.',
       'Moonquakes can last for several minutes because the Moon has little water to damp the vibrations.',
       'The Moon causes ocean tides on Earth twice a day.']
},
mars:{
  name:'Mars',tagline:'The red planet, with the tallest volcano in the Solar System.',
  tilt:25.19,periodH:24.62,camDist:3.6,
  urls:tex('mars','jpg',SSS+'2k_mars.jpg'),
  proc:{seed:51,scale:5,octaves:6,craters:60,colors:[[84,40,24],[140,70,40],[184,100,58],[214,140,90],[230,190,150]],
        spots:[{u:.5,v:.03,rx:300,ry:14,color:'rgba(245,245,250,.85)'},{u:.5,v:.97,rx:300,ry:16,color:'rgba(245,245,250,.9)'}]},
  atm:'#d98e66',rOrr:0.7,orrDist:17.3,orbitDays:687,incl:1.85,
  moons:[{name:'Phobos',r:0.09,d:1.7,p:0.319,color:0x8a7f76},{name:'Deimos',r:0.06,d:2.5,p:1.263,color:0x9a9086}],
  about:[
    'Mars is cold, dry and dusty, coloured by iron oxide. It has Olympus Mons, a volcano about 22 km high, and Valles Marineris, a canyon system roughly 4,000 km long. Dried-up river valleys show that liquid water once flowed here.',
    'Its day is almost the same length as Earth’s and it has seasons, polar ice caps and giant dust storms. Rovers such as Curiosity and Perseverance are exploring it today.'],
  facts:[['Diameter','6,779 km (0.53 × Earth)'],['Mass','6.42 × 10²³ kg (0.11 × Earth)'],['Gravity','3.71 m/s²'],
    ['Rotation','24 h 37 min'],['Orbit (year)','687 days'],['Distance from Sun','227.9 million km (1.52 AU)'],
    ['Axial tilt','25.2°'],['Temperature','−140 °C to 20 °C'],['Atmosphere','95% CO₂, very thin'],['Moons','2 (Phobos, Deimos)']],
  fun:['Martian sunsets look blue because of fine dust in the sky.',
       'Phobos circles Mars three times a day and is slowly spiralling inward.',
       'A person weighing 70 kg on Earth would weigh about 27 kg on Mars.']
},
jupiter:{
  name:'Jupiter',tagline:'The giant of the Solar System, with a storm wider than Earth.',
  tilt:3.13,periodH:9.925,camDist:9,
  urls:tex('jupiter','jpg',SSS+'2k_jupiter.jpg'),
  proc:{seed:61,scale:4,octaves:5,bands:15,bandAmt:.8,turb:3.2,stretch:5,colors:[[110,76,52],[176,128,92],[222,186,148],[240,224,196],[196,120,80]],
        spots:[{u:.62,v:.64,rx:56,ry:28,color:'rgba(186,70,44,.92)'}]},
  atm:'#e0b080',rOrr:3.2,orrDist:31.9,orbitDays:4332.6,incl:1.3,
  moons:[{name:'Io',r:0.07,d:1.9,p:1.769,color:0xe6d27a},{name:'Europa',r:0.06,d:2.4,p:3.551,color:0xd9d2c4},
         {name:'Ganymede',r:0.1,d:3.1,p:7.155,color:0xa59a8c},{name:'Callisto',r:0.09,d:3.9,p:16.69,color:0x7d7468}],
  about:[
    'Jupiter is a gas giant made mostly of hydrogen and helium, with more than twice the mass of all the other planets combined. Its banded look comes from fast jet streams that run in opposite directions at different latitudes.',
    'The Great Red Spot is a storm that has raged for centuries. Jupiter spins faster than any other planet, once every 9 h 56 min, which flattens it noticeably at the poles. The four large Galilean moons are shown here at exaggerated scale.'],
  facts:[['Diameter','139,820 km (11 × Earth)'],['Mass','1.898 × 10²⁷ kg (318 × Earth)'],['Gravity','24.8 m/s²'],
    ['Rotation','9 h 56 min'],['Orbit (year)','11.86 Earth years'],['Distance from Sun','778.5 million km (5.2 AU)'],
    ['Axial tilt','3.1°'],['Cloud-top temperature','about −110 °C'],['Moons','95 confirmed or more'],['Rings','faint, mostly dust']],
  fun:['Ganymede is the largest moon in the Solar System, bigger than Mercury.',
       'Io has more than 400 active volcanoes, making it the most volcanic body known.',
       'Europa Clipper, launched in 2024, is heading to study Europa’s hidden ocean.']
},
saturn:{
  name:'Saturn',tagline:'The ringed planet, lighter than water.',
  tilt:26.73,periodH:10.55,camDist:8,
  urls:tex('saturn','jpg',SSS+'2k_saturn.jpg'),
  ring:{inner:1.28,outer:2.4,urls:tex('saturn_ring','png',SSS+'2k_saturn_ring_alpha.png'),kind:'saturn'},
  proc:{seed:71,scale:4,octaves:5,bands:11,bandAmt:.7,turb:2.2,stretch:5,colors:[[150,126,86],[198,170,120],[228,208,160],[242,230,190]]},
  atm:'#e8d4a0',rOrr:2.8,orrDist:43.3,orbitDays:10759,incl:2.5,
  moons:[{name:'Enceladus',r:0.04,d:2.75,p:1.37,color:0xf2f4f8},{name:'Rhea',r:0.05,d:3.3,p:4.52,color:0xcfcac4},{name:'Titan',r:0.1,d:4.1,p:15.95,color:0xd9a860}],
  about:[
    'Saturn is the second-largest planet and the least dense: its average density is lower than water. Its rings are made of billions of pieces of mostly water ice, from dust grains to house-sized boulders, spread across about 282,000 km yet usually only about 10 metres thick.',
    'A strange hexagon-shaped jet stream circles its north pole. Titan, its biggest moon, has a thick atmosphere and lakes of liquid methane, while Enceladus sprays water from a hidden ocean.'],
  facts:[['Diameter','116,460 km (9.1 × Earth)'],['Mass','5.68 × 10²⁶ kg (95 × Earth)'],['Gravity','10.4 m/s²'],
    ['Rotation','10 h 33 min'],['Orbit (year)','29.46 Earth years'],['Distance from Sun','1.434 billion km (9.58 AU)'],
    ['Axial tilt','26.7°'],['Cloud-top temperature','about −140 °C'],['Moons','140+ confirmed'],['Mission','Cassini (2004 to 2017)']],
  fun:['The rings may be only a few hundred million years old, young compared with the planet itself.',
       'Saturn’s rings appear to vanish from Earth every 13 to 15 years when seen edge-on.',
       'Winds near the equator reach about 1,800 km/h.']
},
uranus:{
  name:'Uranus',tagline:'The ice giant that rolls around the Sun on its side.',
  tilt:97.77,periodH:17.24,camDist:6,
  urls:tex('uranus','jpg',SSS+'2k_uranus.jpg'),
  ring:{inner:1.65,outer:2.05,urls:tex('uranus_ring','png'),kind:'faint'},
  proc:{seed:81,scale:3,octaves:4,bands:8,bandAmt:.25,turb:2,stretch:4,colors:[[120,200,205],[140,214,218],[162,226,228],[184,238,238]]},
  atm:'#9fe3e6',rOrr:1.9,orrDist:61.3,orbitDays:30687,incl:0.8,
  moons:[{name:'Miranda',r:0.04,d:2.35,p:1.41,color:0xb7b2ac},{name:'Ariel',r:0.05,d:2.7,p:2.52,color:0xc5c0b8},
         {name:'Umbriel',r:0.05,d:3.05,p:4.14,color:0x8d8984},{name:'Titania',r:0.06,d:3.5,p:8.71,color:0xb0a89e},{name:'Oberon',r:0.06,d:3.9,p:13.46,color:0x9b9187}],
  about:[
    'Uranus is an ice giant whose axis is tilted 97.8°, so it effectively orbits the Sun lying on its side. Each pole gets about 42 years of continuous sunlight followed by 42 years of darkness.',
    'Methane in its atmosphere absorbs red light and gives the planet its pale cyan colour. Its thin, dark rings run vertically because of the extreme tilt, and its moons are named after characters in Shakespeare and Pope.'],
  facts:[['Diameter','50,724 km (4 × Earth)'],['Mass','8.68 × 10²⁵ kg (14.5 × Earth)'],['Gravity','8.69 m/s²'],
    ['Rotation','17 h 14 min (retrograde)'],['Orbit (year)','84 Earth years'],['Distance from Sun','2.871 billion km (19.2 AU)'],
    ['Axial tilt','97.8°'],['Temperature','about −195 °C (record low −224 °C)'],['Moons','28 or more known'],['Rings','13 known']],
  fun:['Only one spacecraft, Voyager 2 in 1986, has ever visited Uranus.',
       'Its magnetic field is tilted about 59° from its spin axis.',
       'It was the first planet discovered with a telescope, by William Herschel in 1781.']
},
neptune:{
  name:'Neptune',tagline:'The windiest world, found by mathematics before it was seen.',
  tilt:28.32,periodH:16.11,camDist:6,
  urls:tex('neptune','jpg',SSS+'2k_neptune.jpg'),
  ring:{inner:1.7,outer:2.1,urls:tex('neptune_ring','png'),kind:'faint'},
  proc:{seed:91,scale:3,octaves:5,bands:9,bandAmt:.35,turb:2.5,stretch:4,colors:[[22,50,140],[34,76,190],[56,110,225],[110,160,240]],
        spots:[{u:.4,v:.58,rx:48,ry:22,color:'rgba(10,22,80,.75)'}]},
  atm:'#4f7dff',rOrr:1.85,orrDist:76.7,orbitDays:60190,incl:1.8,
  moons:[{name:'Proteus',r:0.04,d:2.3,p:1.12,color:0x8a8782},{name:'Triton',r:0.08,d:3.2,p:5.88,color:0xe2d6cf,retro:true}],
  about:[
    'Neptune is the farthest known major planet. Its existence was predicted from irregularities in Uranus’s orbit and it was first observed in 1846. Its deep blue colour comes from methane plus another, still unidentified, component.',
    'Winds here are the fastest in the Solar System, reaching about 2,100 km/h. Its largest moon Triton orbits backwards, a sign that it was captured from the Kuiper Belt, and it has nitrogen geysers.'],
  facts:[['Diameter','49,244 km (3.9 × Earth)'],['Mass','1.02 × 10²⁶ kg (17 × Earth)'],['Gravity','11.15 m/s²'],
    ['Rotation','16 h 6 min'],['Orbit (year)','164.8 Earth years'],['Distance from Sun','4.495 billion km (30.1 AU)'],
    ['Axial tilt','28.3°'],['Temperature','about −200 °C'],['Moons','16 known'],['Rings','5 main rings']],
  fun:['Neptune completed its first orbit since its discovery in 2011.',
       'Voyager 2 flew past in 1989 and remains the only visitor.',
       'Dark storms appear and fade on Neptune, unlike Jupiter’s long-lived Red Spot.']
},
ceres:{
  name:'Ceres',tagline:'The largest object in the asteroid belt and the nearest dwarf planet.',
  tilt:4,periodH:9.074,camDist:3.6,
  urls:tex('ceres','jpg'),
  proc:{seed:101,scale:6,octaves:6,craters:150,colors:[[58,56,54],[92,90,86],[128,125,120],[168,164,158]],
        spots:[{u:.62,v:.38,rx:10,ry:7,color:'rgba(255,255,255,.95)'}]},
  rOrr:0.5,orrDist:23.3,orbitDays:1682,incl:10.6,
  about:[
    'Ceres holds roughly a third of the mass of the entire asteroid belt. Discovered in 1801 by Giuseppe Piazzi, it was called a planet, then an asteroid, and became a dwarf planet in 2006.',
    'NASA’s Dawn spacecraft orbited it from 2015 to 2018 and found bright patches in Occator Crater, which are salty deposits left by briny water that reached the surface.'],
  facts:[['Diameter','940 km (0.07 × Earth)'],['Mass','9.38 × 10²⁰ kg (0.015% of Earth)'],['Gravity','0.28 m/s²'],
    ['Rotation','9 h 4 min'],['Orbit (year)','4.6 Earth years'],['Distance from Sun','413 million km (2.77 AU)'],
    ['Axial tilt','about 4°'],['Temperature','about −105 °C average'],['Moons','0'],['Mission','Dawn']],
  fun:['Ceres may hide a layer of briny liquid below its crust.',
       'It is the only dwarf planet in the inner Solar System.']
},
pluto:{
  name:'Pluto',tagline:'The famous dwarf planet with a heart of nitrogen ice.',
  tilt:122.53,periodH:153.3,camDist:6,
  urls:tex('pluto','jpg'),
  proc:{seed:111,scale:5,octaves:6,craters:30,colors:[[96,66,48],[146,106,78],[190,154,120],[222,200,170],[238,226,206]],
        spots:[{u:.45,v:.5,rx:90,ry:60,color:'rgba(240,232,214,.95)'}]},
  rOrr:0.45,orrDist:88,orbitDays:90560,incl:17.1,
  moons:[{name:'Charon',r:0.5,d:3.1,p:6.39,color:0x9a9189,lock:true}],
  about:[
    'Pluto was discovered by Clyde Tombaugh in 1930 and reclassified as a dwarf planet in 2006. NASA’s New Horizons flew past on 14 July 2015, revealing glaciers of nitrogen ice, mountains of water ice up to about 3.5 km high and a huge bright plain called Sputnik Planitia.',
    'Charon is half Pluto’s diameter, so the pair orbit a point in space between them. Both are tidally locked: each always shows the same face to the other, and Charon hangs over one spot in Pluto’s sky.'],
  facts:[['Diameter','2,377 km (0.19 × Earth)'],['Mass','1.30 × 10²² kg (0.2% of Earth)'],['Gravity','0.62 m/s²'],
    ['Rotation','6.39 Earth days (retrograde)'],['Orbit (year)','248 Earth years'],['Distance from Sun','5.9 billion km (39.5 AU average)'],
    ['Axial tilt','122.5°'],['Temperature','about −229 °C'],['Moons','5 (Charon, Styx, Nix, Kerberos, Hydra)'],['Mission','New Horizons (2015)']],
  fun:['Pluto’s orbit is tilted 17° and sometimes brings it closer to the Sun than Neptune.',
       'It has a thin nitrogen atmosphere that freezes and falls as snow as Pluto moves away from the Sun.']
},
haumea:{
  name:'Haumea',tagline:'A dwarf planet spinning so fast that it is stretched into an egg.',
  tilt:0,periodH:3.915,camDist:4,scale:[1.15,0.55,0.9],
  urls:tex('haumea','jpg'),
  proc:{seed:121,scale:5,octaves:5,colors:[[200,204,214],[224,228,236],[240,242,248],[252,252,255]],
        spots:[{u:.5,v:.5,rx:40,ry:28,color:'rgba(160,70,60,.85)'}]},
  rOrr:0.4,orrDist:91.9,orbitDays:104100,incl:28.2,
  moons:[{name:'Hiʻiaka',r:0.08,d:3.0,p:49.5,color:0xdfe3ea},{name:'Namaka',r:0.05,d:2.3,p:18.3,color:0xdfe3ea}],
  about:[
    'Haumea rotates once every 3.9 hours, the fastest of any known large object in the Solar System, which has stretched it into an elongated shape roughly 2,100 km long but only about 1,070 km thick.',
    'It is covered in crystalline water ice, has a dark red spot, two moons named for Hawaiian goddesses, and a thin ring discovered in 2017 when it passed in front of a distant star.'],
  facts:[['Size','about 2,100 × 1,680 × 1,070 km'],['Mass','4.0 × 10²¹ kg (0.07% of Earth)'],['Gravity','about 0.4 m/s²'],
    ['Rotation','3.9 hours'],['Orbit (year)','285 Earth years'],['Distance from Sun','6.45 billion km (43 AU average)'],
    ['Orbit tilt','28°'],['Temperature','about −241 °C'],['Moons','2 (Hiʻiaka, Namaka)'],['Rings','1 (found 2017)']],
  fun:['Haumea’s ring was the first found around a dwarf planet.',
       'A family of icy objects in the Kuiper Belt shares its orbit, likely fragments of an ancient collision.']
},
makemake:{
  name:'Makemake',tagline:'A bright, reddish world in the Kuiper Belt, named for Easter Island’s creator god.',
  tilt:0,periodH:22.83,camDist:3.6,
  urls:tex('makemake','jpg'),
  proc:{seed:131,scale:5,octaves:5,colors:[[120,66,44],[160,92,60],[196,124,84],[224,170,130]]},
  rOrr:0.38,orrDist:94.4,orbitDays:111845,incl:29,
  moons:[{name:'MK2',r:0.04,d:2.2,p:12.4,color:0x504a46}],
  about:[
    'Makemake was found in March 2005 and is one of the brightest objects in the Kuiper Belt after Pluto. Its reddish surface is covered with frozen methane, ethane and possibly nitrogen.',
    'In 2016 the Hubble Space Telescope discovered a small, dark moon nicknamed MK2, only about 160 km across.'],
  facts:[['Diameter','about 1,430 km'],['Mass','3.1 × 10²¹ kg (0.05% of Earth)'],['Gravity','about 0.5 m/s²'],
    ['Rotation','about 22.8 hours'],['Orbit (year)','306 Earth years'],['Distance from Sun','6.8 billion km (45.5 AU average)'],
    ['Orbit tilt','29°'],['Temperature','about −239 °C'],['Moons','1 (MK2)']],
  fun:['Makemake is named after the Rapa Nui creator of humanity.',
       'It has no thick atmosphere, but a thin one may form when its surface ice warms.']
},
eris:{
  name:'Eris',tagline:'The distant world whose discovery led to Pluto’s reclassification.',
  tilt:78,periodH:25.9,camDist:3.8,
  urls:tex('eris','jpg'),
  proc:{seed:141,scale:4,octaves:4,colors:[[190,190,196],[214,214,220],[234,234,238],[248,248,250]]},
  rOrr:0.45,orrDist:115,orbitDays:204000,incl:44,
  moons:[{name:'Dysnomia',r:0.07,d:2.6,p:15.8,color:0x6a6764}],
  about:[
    'Eris was identified in 2005 and is about 27% more massive than Pluto, though very slightly smaller. That discovery prompted astronomers to define “planet” formally in 2006, which put Pluto and Eris in the new dwarf-planet category.',
    'Its surface is coated in highly reflective ice, reflecting about 96% of sunlight, and its 559-year orbit takes it out to nearly 98 AU. Its moon Dysnomia is named after Eris’s daughter in myth.'],
  facts:[['Diameter','about 2,326 km'],['Mass','1.66 × 10²² kg (0.28% of Earth)'],['Gravity','about 0.82 m/s²'],
    ['Rotation','about 26 hours'],['Orbit (year)','559 Earth years'],['Distance from Sun','10.1 billion km (68 AU average)'],
    ['Orbit tilt','44°'],['Temperature','about −240 °C'],['Moons','1 (Dysnomia)']],
  fun:['Eris is one of the most distant known objects that is bound to the Sun and larger than Pluto in mass.',
       'The IAU officially recognises five dwarf planets: Ceres, Pluto, Haumea, Makemake and Eris.']
}
};
global.SPACE_DATA=DATA;
})(window);
