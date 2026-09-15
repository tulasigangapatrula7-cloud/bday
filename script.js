/* ============================================================
   MATRIX PINK RAIN — 3 SECOND INTRO
   ============================================================ */

(function matrixPinkIntro() {

  const overlay = document.createElement('div');
  overlay.id = 'matrixIntro';

  const canvas = document.createElement('canvas');
  canvas.id = 'matrixCanvas';

  overlay.appendChild(canvas);
  document.body.appendChild(overlay);

  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;

  canvas.width = W;
  canvas.height = H;

  const messages = [
    'CHOTA DON 🩷',
    'BIRTHDAY GIRL 🧿',
    'CHOTA DON',
    'BIRTHDAY GIRL',
    '🩷',
    '🧿',
    'NANA',
    'MY GIRL'
  ];

  const fontSize = 19;
  const columnWidth = 60;

  let columns = Math.ceil(W / columnWidth);

  const streams = [];

  for (let i = 0; i < columns; i++) {

    streams.push({
      x: i * columnWidth + Math.random() * 30,
      y: Math.random() * H,
      speed: 1.1 + Math.random() * 1.2,
      length: 5 + Math.floor(Math.random() * 9),
      message: messages[Math.floor(Math.random() * messages.length)],
      gap: 35 + Math.random() * 70
    });

  }

  function resize() {

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W;
    canvas.height = H;

  }

  window.addEventListener('resize', resize);

  function draw() {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `700 ${fontSize}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    streams.forEach(stream => {

      const chars = stream.message.split('');

      for (let i = 0; i < stream.length; i++) {

        const y =
          stream.y -
          i * stream.gap;

        if (y < -50 || y > H + 50) continue;

        const char =
          chars[Math.floor(
            (stream.y / stream.gap + i) %
            chars.length
          )];

        const fade = 1 - i / stream.length;

        if (i === 0) {

          ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff';

          ctx.shadowBlur = 9;
          ctx.shadowColor = '#ff3f9e';

        } else {

          ctx.globalAlpha = fade * 0.85;

          ctx.fillStyle =
            i % 2 === 0
              ? '#ff4f9a'
              : '#ff9bc8';

          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ff4f9a';

        }

        ctx.fillText(
          char,
          stream.x,
          y
        );

      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      stream.y += stream.speed;

      if (
        stream.y -
        stream.length * stream.gap >
        H + 100
      ) {

        stream.y = -100 - Math.random() * 500;

        stream.speed =
          0.7 + Math.random() * 0.6;

        stream.message =
          messages[
            Math.floor(
              Math.random() * messages.length
            )
          ];

      }

    });

    if (document.getElementById('matrixIntro')) {
      requestAnimationFrame(draw);
    }

  }

  /* Start black */
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  draw();

  /* Stay for 3 seconds */
  setTimeout(() => {

    overlay.classList.add('matrixExit');

    setTimeout(() => {

      overlay.remove();

    }, 900);

  }, 5500);

})();




/* ============================================================
   Mera Chota Don — birthday experience
   Scene manager + interactions
   ============================================================ */

const PASSWORD = '1718';
const PASSWORD2 = '0612';

const scenes = {
  password:   document.getElementById('scene-password'),
  heart:      document.getElementById('scene-heart'),
  wishtitle:  document.getElementById('scene-wishtitle'),
  chat:       document.getElementById('scene-chat'),
  butthis:    document.getElementById('scene-butthis'),
  pink:       document.getElementById('scene-pink'),
  tree:       document.getElementById('scene-tree'),
  blossom:    document.getElementById('scene-blossom'),
  collage:    document.getElementById('scene-collage'),
  reveal:     document.getElementById('scene-reveal'),
  memories:   document.getElementById('scene-memories'),
  hanging:    document.getElementById('scene-hanging'),
  password2:  document.getElementById('scene-password2'),
  letter:     document.getElementById('scene-letter'),
};

let currentScene = 'password';
function goTo(name){
  if(scenes[currentScene]) scenes[currentScene].classList.remove('active');
  scenes[name].classList.add('active');
  currentScene = name;
}

/* ---------------- Particle helper ---------------- */
const particleLayer = document.getElementById('particleLayer');
function burstParticles(x, y, opts = {}){
  const count = opts.count || 14;
  const glyphs = opts.glyphs || ['🌸','💗','✨'];
  for(let i=0;i<count;i++){
    const el = document.createElement('span');
    el.className = 'particle';
    el.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.fontSize = (12 + Math.random()*16) + 'px';
    particleLayer.appendChild(el);
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random()*140;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - 40;
    gsap.fromTo(el, {opacity:0, x:0, y:0, scale:.4, rotate:0},
      {opacity:1, x:dx*0.25, y:dy*0.25, scale:1, duration:.25, ease:'power1.out'});
    gsap.to(el, {opacity:0, x:dx, y:dy+120, rotate:Math.random()*180-90, scale:.6,
      duration:1.1+Math.random()*.6, delay:.2, ease:'power1.in',
      onComplete:()=>el.remove()});
  }
}

/* ---------------- Full screen flash transition ---------------- */
const flashOverlay = document.getElementById('flashOverlay');
function flashTransition(color, midCallback, done){
  flashOverlay.style.background = color;
  flashOverlay.classList.remove('fade');
  void flashOverlay.offsetWidth; // reflow
  flashOverlay.classList.add('go');
  setTimeout(()=>{
    if(midCallback) midCallback();
    flashOverlay.classList.remove('go');
    flashOverlay.classList.add('fade');
    setTimeout(()=>{
      flashOverlay.classList.remove('fade');
      flashOverlay.style.opacity = 0;
      if(done) done();
    }, 620);
  }, 480);
}

/* ---------------- Music ---------------- */
let sound = null;
const musicBtn = document.getElementById('musicToggle');
let musicPlaying = false;

function initMusic(){
  if(sound) return;
  sound = new Howl({
    src: ['assets/audio/birthday-music.mp3'],
    loop: true,
    volume: 0,
  });
}
function startMusic(){
  initMusic();
  musicBtn.classList.add('visible');
  if(!musicPlaying){
    sound.play();
    sound.fade(0, 0.55, 1500);
    musicPlaying = true;
    musicBtn.classList.add('playing');
    musicBtn.classList.remove('muted');
  }
}
function toggleMusic(){
  initMusic();
  if(musicPlaying){
    sound.fade(sound.volume(), 0, 500);
    setTimeout(()=>sound.pause(), 520);
    musicPlaying = false;
    musicBtn.classList.remove('playing');
    musicBtn.classList.add('muted');
  }else{
    startMusic();
  }
}
musicBtn.addEventListener('click', toggleMusic);

/* ============================================================
   PASSWORD SCENE
   ============================================================ */
const pinBoxes = Array.from(document.querySelectorAll('.pin-box'));
const pinError = document.getElementById('pinError');

pinBoxes.forEach((box, i)=>{
  box.addEventListener('input', ()=>{
    box.value = box.value.replace(/[^0-9]/g,'');
    if(box.value && i < pinBoxes.length - 1){ pinBoxes[i+1].focus(); }
    checkPin();
  });
  box.addEventListener('keydown', (e)=>{
    if(e.key === 'Backspace' && !box.value && i > 0){ pinBoxes[i-1].focus(); }
  });
});

function checkPin(){
  const entered = pinBoxes.map(b=>b.value).join('');
  if(entered.length === 4){
    if(entered === PASSWORD){
      startMusic();
      flashTransition('#fff', ()=>{}, ()=>{
        goTo('heart');
      });
    } else {
      pinError.classList.add('show');
      pinBoxes.forEach(b=>{ b.value=''; });
      setTimeout(()=>{ pinBoxes[0].focus(); pinError.classList.remove('show'); }, 900);
    }
  }
}
setTimeout(()=>pinBoxes[0] && pinBoxes[0].focus(), 400);

/* ============================================================
   HEART + ARROW SCENE
   ============================================================ */
const heartTarget = document.getElementById('heartTarget');
const arrowEl = document.getElementById('arrowEl');
const bowZone = document.getElementById('bowZone');
let pulling = false, startY = 0, pullY = 0;
const MAX_PULL = 70;
const MIN_RELEASE = 22;

function pointerDown(e){
  pulling = true;
  startY = (e.touches ? e.touches[0].clientY : e.clientY);
  arrowEl.style.transition = 'none';
}
function pointerMove(e){
  if(!pulling) return;
  const y = (e.touches ? e.touches[0].clientY : e.clientY);
  pullY = Math.min(MAX_PULL, Math.max(0, y - startY));
  arrowEl.style.transform = `rotate(-90deg) translateY(${pullY}px)`;
}
function pointerUp(){
  if(!pulling) return;
  pulling = false;
  arrowEl.style.transition = '';
  if(pullY >= MIN_RELEASE){
    fireArrow();
  } else {
    arrowEl.style.transform = 'rotate(-90deg) translateY(0px)';
  }
  pullY = 0;
}
bowZone.addEventListener('mousedown', pointerDown);
window.addEventListener('mousemove', pointerMove);
window.addEventListener('mouseup', pointerUp);
bowZone.addEventListener('touchstart', pointerDown, {passive:true});
window.addEventListener('touchmove', pointerMove, {passive:true});
window.addEventListener('touchend', pointerUp);

let arrowFired = false;
function fireArrow(){
  if(arrowFired) return;
  arrowFired = true;
  const bowRect = bowZone.getBoundingClientRect();
  const heartRect = heartTarget.getBoundingClientRect();
  const travel = (bowRect.top - heartRect.top) + 40;
  gsap.to(arrowEl, {
    y: -travel, duration: .38, ease:'power3.in',
    onComplete: ()=>{
      hitHeart();
    }
  });
}
function hitHeart(){
  heartTarget.classList.add('hit');
  const rect = heartTarget.getBoundingClientRect();
  burstParticles(rect.left+rect.width/2, rect.top+rect.height/2, {count:22, glyphs:['❤️','💗','🌸','✨']});
  setTimeout(()=>{
    flashTransition('radial-gradient(circle,#ff1744 0%,#ff1744 45%,#7a0018 100%)', ()=>{}, ()=>{
      goTo('wishtitle');
      runWishTitle();
    });
  }, 420);
}

/* ============================================================
   WISH TITLE -> CHAT
   ============================================================ */
function runWishTitle(){
  const el = document.getElementById('wishTitleText');
  gsap.fromTo(el, {opacity:0, scale:.85}, {opacity:1, scale:1, duration:.9, ease:'power2.out'});
  setTimeout(()=>{
    gsap.to(el, {opacity:0, duration:.6, onComplete:()=>{
      goTo('chat');
      runChat();
    }});
  }, 2200);
}

const wishMessages = [
  {name:'Priya', text:'Happy birthday Nissu!! have the bestest day 🎂', time:'11:58 PM'},
  {name:'Kavya', text:'omgg its finally here, HBD cutie 💕', time:'11:59 PM'},
  {name:'Rahul', text:'happy bday da, party kavali ah!', time:'12:00 AM'},
  {name:'Sanjana', text:'may this year bring you everything you deserve ✨', time:'12:01 AM'},
  {name:'Comrade', text:"waiting for the real gift? scroll cheyyi 👀", time:'12:02 AM', me:true},
];

function runChat(){
  const wrap = document.getElementById('chatWrap');
  wrap.innerHTML = '';
  wishMessages.forEach((m, i)=>{
    setTimeout(()=>{
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble' + (m.me ? ' me' : '');
      bubble.innerHTML = `
        ${m.me ? '' : `<div class="bubble-avatar">${m.name[0]}</div>`}
        <div class="bubble-text-wrap">
          ${m.me ? '' : `<span class="bubble-name">${m.name}</span>`}
          <span>${m.text}</span>
          <span class="bubble-time">${m.time}</span>
        </div>`;
      wrap.appendChild(bubble);
      requestAnimationFrame(()=>bubble.classList.add('show'));
      if(i === wishMessages.length - 1){
        setTimeout(()=>{ goTo('butthis'); runButThis(); }, 1900);
      }
    }, i * 850);
  });
}

/* ============================================================
   BUT THIS -> PINK -> TREE
   ============================================================ */
function runButThis(){
  setTimeout(()=>{
    flashTransition('linear-gradient(135deg,#E85C8A,#B23568)', ()=>{}, ()=>{
      goTo('pink');
      runPink();
    });
  }, 2000);
}
function runPink(){
  setTimeout(()=>{
    flashTransition('#FFF8EF', ()=>{}, ()=>{
      goTo('tree');
      runTree();
    });
  }, 1900);
}

/* ============================================================
   TREE GROWTH + HEART-SHAPED FLOWERS
   ============================================================ */
let treeBuilt = false;
function runTree(){
  const trunk = document.getElementById('trunkPath');
  const branches = ['branchL1','branchR1','branchL2','branchR2','branchC'].map(id=>document.getElementById(id));
  gsap.set([trunk, ...branches], {strokeDashoffset:600});
  gsap.to(trunk, {strokeDashoffset:0, duration:1.3, ease:'power2.inOut'});
  branches.forEach((b, i)=>{
    gsap.to(b, {strokeDashoffset:0, duration:.9, ease:'power2.inOut', delay:1.1 + i*.18});
  });

  if(!treeBuilt){
    buildFlowerHeart();
    treeBuilt = true;
  } else {
    gsap.set('.flower-dot', {opacity:0, scale:0});
  }

  const flowers = document.querySelectorAll('.flower-dot');
  gsap.to(flowers, {
    opacity:1, scale:1, rotate:()=>Math.random()*40-20,
    duration:.5, ease:'back.out(2)',
    stagger:{each:0.035, from:'random'},
    delay: 2.1,
  });
}

function buildFlowerHeart(){
  const layer = document.getElementById('flowerLayer');
  const glyphs = ['🌸','🌺','💮','🌷'];
  const points = [];
  const N = 42;
  for(let i=0;i<N;i++){
    const t = (i/N) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t),3);
    const y = -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t));
    points.push({x,y});
  }
  // scale into canopy bounding box (SVG viewBox 600x620, canopy roughly x:120-480 y:60-320)
  const cx = 300, cy = 195, scaleX = 11.5, scaleY = 10.5;
  points.forEach(p=>{
    const svgX = cx + p.x*scaleX;
    const svgY = cy + p.y*scaleY;
    const pctX = (svgX/600)*100;
    const pctY = (svgY/620)*100;
    const dot = document.createElement('span');
    dot.className = 'flower-dot';
    dot.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    dot.style.left = pctX + '%';
    dot.style.top = pctY + '%';
    dot.style.fontSize = (16 + Math.random()*10) + 'px';
    layer.appendChild(dot);
  });
  // a few extra filler flowers scattered inside the heart for fullness
  for(let i=0;i<18;i++){
    const t = Math.random()*Math.PI*2;
    const r = Math.random()*0.65;
    const x = 16*Math.pow(Math.sin(t),3)*r;
    const y = -(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*r;
    const svgX = cx + x*11.5, svgY = cy + y*10.5;
    const dot = document.createElement('span');
    dot.className = 'flower-dot';
    dot.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    dot.style.left = ((svgX/600)*100) + '%';
    dot.style.top = ((svgY/620)*100) + '%';
    dot.style.fontSize = (13 + Math.random()*8) + 'px';
    layer.appendChild(dot);
  }
}

// tree -> blossom scene after growth completes
document.getElementById('scene-tree').addEventListener('transitionend', ()=>{}, {passive:true});
function scheduleAfterTree(){
  setTimeout(()=>{
    flashTransition('#FDEFF6', ()=>{}, ()=>{ goTo('blossom'); });
  }, 4600);
}
const _origRunTree = runTree;
runTree = function(){
  _origRunTree();
  scheduleAfterTree();
};

/* ============================================================
   TOUCH THE BLOSSOM -> FLOWER COLLAGE
   ============================================================ */
const blossomBtn = document.getElementById('blossomBtn');
blossomBtn.addEventListener('click', ()=>{
  const rect = blossomBtn.getBoundingClientRect();
  gsap.fromTo(blossomBtn, {scale:1}, {scale:1.5, duration:.35, ease:'power2.out', yoyo:true, repeat:1});
  burstParticles(rect.left+rect.width/2, rect.top+rect.height/2, {count:20, glyphs:['🌸','🌷','✨','💗']});
  setTimeout(()=>{
    goTo('collage');
    runCollage();
  }, 650);
});

function runCollage(){
  const layer = document.getElementById('collageLayer');
  layer.innerHTML = '';
  const glyphs = ['🌸','🌼','🌺','🌷','🪷','💮','🌹'];
  const count = 34;
  for(let i=0;i<count;i++){
    const el = document.createElement('span');
    el.className = 'collage-item';
    el.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    const left = Math.random()*94;
    const top = Math.random()*88;
    el.style.left = left + '%';
    el.style.top = top + '%';
    el.style.fontSize = (22 + Math.random()*34) + 'px';
    layer.appendChild(el);
    gsap.to(el, {
      opacity: 0.9, scale:1, rotate: Math.random()*90-45,
      duration:.6, ease:'back.out(2)', delay: i*0.028
    });
    gsap.to(el, {
      y: '+=10', duration: 2+Math.random()*1.5, yoyo:true, repeat:-1, ease:'sine.inOut', delay: 1+i*0.02
    });
  }
  setTimeout(()=>{
    flashTransition('#FCE9F0', ()=>{}, ()=>{
      goTo('reveal');
      runReveal();
    });
  }, count*28 + 1500);
}

/* ============================================================
   BIRTHDAY REVEAL
   ============================================================ */
function runReveal(){
  const title = document.getElementById('revealTitle');
  const text = 'Happy Birthday, Nissu! 🎂';
  title.innerHTML = text.split('').map(ch=>`<span class="rl">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  gsap.to('#revealTitle .rl', {
    opacity:1, y:0, rotate:0, duration:.5, ease:'back.out(2)', stagger:0.035
  });
}
document.getElementById('revealContinue').addEventListener('click', ()=>{
  goTo('memories');
  buildGallery();
});
// also auto-advance softly if user doesn't tap
let revealAuto = null;
function armRevealAuto(){
  revealAuto = setTimeout(()=>{
    if(currentScene === 'reveal'){ goTo('memories'); buildGallery(); }
  }, 6500);
}

/* ============================================================
   MEMORIES GALLERY (3D carousel)
   ============================================================ */
let galleryBuilt = false;
let galleryAngle = 0;
const CARD_COUNT = 9;
function buildGallery(){
  if(galleryBuilt) return;
  galleryBuilt = true;
  const carousel = document.getElementById('galleryCarousel');
  const radius = 210;
  for(let i=1;i<=CARD_COUNT;i++){
    const card = document.createElement('div');
    card.className = 'mem-card';
    const angle = (360/CARD_COUNT) * (i-1);
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    card.innerHTML = `<img src="assets/images/photo${i}.jpg" alt="memory ${i}" loading="lazy">`;
    carousel.appendChild(card);
  }
  updateCarousel();

  let dragging = false, startX = 0, lastAngle = 0;
  carousel.addEventListener('pointerdown', (e)=>{
    dragging = true; startX = e.clientX; lastAngle = galleryAngle;
    carousel.setPointerCapture(e.pointerId);
  });
  carousel.addEventListener('pointermove', (e)=>{
    if(!dragging) return;
    const dx = e.clientX - startX;
    galleryAngle = lastAngle + dx * 0.35;
    updateCarousel();
  });
  carousel.addEventListener('pointerup', ()=>{ dragging = false; });
  carousel.addEventListener('pointercancel', ()=>{ dragging = false; });

  document.getElementById('galleryPrev').addEventListener('click', ()=>{
    galleryAngle += 360/CARD_COUNT; updateCarousel();
  });
  document.getElementById('galleryNext').addEventListener('click', ()=>{
    galleryAngle -= 360/CARD_COUNT; updateCarousel();
  });
}
function updateCarousel(){
  const carousel = document.getElementById('galleryCarousel');
  carousel.style.transform = `translateZ(-210px) rotateY(${galleryAngle}deg)`;
}
document.getElementById('memoriesContinue').addEventListener('click', ()=>{
  goTo('hanging');
});


/* ============================================================
   HANGING CHARACTER
   ============================================================ */
const hangChar = document.getElementById('hangChar');
hangChar.addEventListener('click', ()=>{
  hangChar.classList.remove('poked');
  void hangChar.offsetWidth;
  hangChar.classList.add('poked');
  const rect = hangChar.getBoundingClientRect();
  burstParticles(rect.left+rect.width/2, rect.top+rect.height/2, {count:8, glyphs:['✨','💗']});
});
document.getElementById('hangContinue').addEventListener('click', ()=>{
  goTo('password2');
  setTimeout(()=>pinBoxes2[0] && pinBoxes2[0].focus(), 500);
});

/* ============================================================
   SECOND PASSWORD — GATE TO THE FINAL LETTER
   ============================================================ */
const pinBoxes2 = Array.from(document.querySelectorAll('.pin-box2'));
const pinError2 = document.getElementById('pinError2');

pinBoxes2.forEach((box, i)=>{
  box.addEventListener('input', ()=>{
    box.value = box.value.replace(/[^0-9]/g,'');
    if(box.value && i < pinBoxes2.length - 1){ pinBoxes2[i+1].focus(); }
    checkPin2();
  });
  box.addEventListener('keydown', (e)=>{
    if(e.key === 'Backspace' && !box.value && i > 0){ pinBoxes2[i-1].focus(); }
  });
});

function checkPin2(){
  const entered = pinBoxes2.map(b=>b.value).join('');
  if(entered.length === 4){
    if(entered === PASSWORD2){
      flashTransition('linear-gradient(135deg,#F4E7C1,#B23568)', ()=>{}, ()=>{
        goTo('letter');
      });
    } else {
      pinError2.classList.add('show');
      pinBoxes2.forEach(b=>{ b.value=''; });
      setTimeout(()=>{ pinBoxes2[0].focus(); pinError2.classList.remove('show'); }, 900);
    }
  }
}

/* ============================================================
   REPLAY
   ============================================================ */
document.getElementById('replayBtn').addEventListener('click', ()=>{
  arrowFired = false;
  arrowEl.style.transform = 'rotate(-90deg) translateY(0px)';
  heartTarget.classList.remove('hit');
  gsap.set('.flower-dot', {opacity:0, scale:0});
  goTo('heart');
});

/* Hook reveal auto-advance arming into scene entry */
const revealObserver = new MutationObserver(()=>{
  if(scenes.reveal.classList.contains('active')) armRevealAuto();
});
revealObserver.observe(scenes.reveal, {attributes:true, attributeFilter:['class']});

// Full screen heart-color flash
function heartHitFlash() {
    let flash = document.getElementById("heartHitFlash");

    if (!flash) {
        flash = document.createElement("div");
        flash.id = "heartHitFlash";
        document.body.appendChild(flash);
    }

    flash.classList.remove("active");

    void flash.offsetWidth;

    flash.classList.add("active");
}