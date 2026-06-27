/*
   ==========================================================================
   Interactive Script Engine for Birthday Surprise Website
   ==========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const unlockBtn = document.getElementById('unlock-btn');
  const surpriseContainer = document.getElementById('surprise-container');
  const heroSection = document.getElementById('hero-section');
  const envelope = document.getElementById('envelope');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const visualizer = document.getElementById('visualizer');
  
  // Countdown elements
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  // Image upload slots
  const uploadSlots = [
    { input: document.getElementById('upload-slot-1'), img: document.getElementById('img-slot-1'), key: 'birthday_img_slot_1' },
    { input: document.getElementById('upload-slot-2'), img: document.getElementById('img-slot-2'), key: 'birthday_img_slot_2' },
    { input: document.getElementById('upload-slot-3'), img: document.getElementById('img-slot-3'), key: 'birthday_img_slot_3' }
  ];

  // Balloon elements
  const balloonGarden = document.getElementById('balloon-garden');
  const wishBox = document.getElementById('wish-box');
  const wishText = document.getElementById('wish-text');

  // --- Configuration ---
  const targetDate = new Date("July 1, 2026 00:00:00").getTime();
  
  const sweetWishes = [
    "To the girl who makes my heart skip a beat every single day. 💖",
    "May your year be filled with as much laughter as you bring to my life! 🌸",
    "You are my favorite adventure, my sweetest dream, and my home. 🏡",
    "Wishing the happiest birthday to the most beautiful soul I know. ✨",
    "I love you more than words can express, today and every single day! 💕",
    "To a lifetime of shared secrets, warm hugs, and silly jokes! 👩‍❤️‍👨",
    "You shine brighter than any star in the night sky. 🌟",
    "Happy birthday to my favorite person in the whole universe! 🌌"
  ];

  // --- State Variables ---
  let musicPlaying = false;
  let audioCtx = null;
  let synthInterval = null;
  let isTargetReached = false;

  // --- Init Images from Local Storage ---
  uploadSlots.forEach(slot => {
    const savedImg = localStorage.getItem(slot.key);
    if (savedImg) {
      slot.img.src = savedImg;
    }

    slot.input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          slot.img.src = event.target.result;
          localStorage.setItem(slot.key, event.target.result);
          // Trigger sparkle explosion on upload
          const rect = slot.img.getBoundingClientRect();
          triggerExplosion(rect.left + rect.width/2, rect.top + rect.height/2, 30);
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // --- Countdown Timer Logic ---
  const updateCountdown = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      isTargetReached = true;
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minutesEl.innerText = "00";
      secondsEl.innerText = "00";
      
      // Update typography & text for active Birthday
      document.querySelector('.main-title').innerHTML = "✨ Happy Birthday, My Love! 💖 ✨";
      document.querySelector('.subtitle').innerText = "Today is your special day! July 1st is finally here.";
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.innerText = d.toString().padStart(2, '0');
    hoursEl.innerText = h.toString().padStart(2, '0');
    minutesEl.innerText = m.toString().padStart(2, '0');
    secondsEl.innerText = s.toString().padStart(2, '0');
  };
  
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- Music Synthesizer Engine (Web Audio API) ---
  const initAudio = () => {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  };

  const playSynthesizedMelody = () => {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Gentle Dreamy Music Box Arpeggiator
    const tempo = 220; // Tempo in ms per beat
    // Beautiful romantic chord progression (Cmaj7 -> Fmaj7 -> Am7 -> G6)
    const melody = [
      // Chord 1: Cmaj7 (C4, E4, G4, B4, C5)
      { note: 261.63, duration: 1.5 }, // C4
      { note: 329.63, duration: 1.5 }, // E4
      { note: 392.00, duration: 1.5 }, // G4
      { note: 493.88, duration: 1.5 }, // B4
      { note: 523.25, duration: 3.0 }, // C5
      { note: 493.88, duration: 1.5 }, // B4
      { note: 392.00, duration: 1.5 }, // G4
      { note: 329.63, duration: 1.5 }, // E4
      
      // Chord 2: Fmaj7 (F4, A4, C5, E5, F5)
      { note: 349.23, duration: 1.5 }, // F4
      { note: 440.00, duration: 1.5 }, // A4
      { note: 523.25, duration: 1.5 }, // C5
      { note: 659.25, duration: 1.5 }, // E5
      { note: 698.46, duration: 3.0 }, // F5
      { note: 659.25, duration: 1.5 }, // E5
      { note: 523.25, duration: 1.5 }, // C5
      { note: 440.00, duration: 1.5 }, // A4

      // Chord 3: Am7 (A4, C5, E5, G5, A5)
      { note: 440.00, duration: 1.5 }, // A4
      { note: 523.25, duration: 1.5 }, // C5
      { note: 659.25, duration: 1.5 }, // E5
      { note: 783.99, duration: 1.5 }, // G5
      { note: 880.00, duration: 3.0 }, // A5
      { note: 783.99, duration: 1.5 }, // G5
      { note: 659.25, duration: 1.5 }, // E5
      { note: 523.25, duration: 1.5 }, // C5

      // Chord 4: G6 (G4, B4, D5, E5, G5)
      { note: 392.00, duration: 1.5 }, // G4
      { note: 493.88, duration: 1.5 }, // B4
      { note: 587.33, duration: 1.5 }, // D5
      { note: 659.25, duration: 1.5 }, // E5
      { note: 783.99, duration: 3.0 }, // G5
      { note: 659.25, duration: 1.5 }, // E5
      { note: 587.33, duration: 1.5 }, // D5
      { note: 493.88, duration: 1.5 }  // B4
    ];

    let currentStep = 0;

    const playStep = () => {
      if (!musicPlaying) return;

      const item = melody[currentStep];
      playMusicBoxTone(item.note, item.duration * tempo * 0.001);

      // Advance step
      currentStep = (currentStep + 1) % melody.length;
      
      // Schedule next note
      synthInterval = setTimeout(playStep, item.duration * tempo);
    };

    playStep();
  };

  const playMusicBoxTone = (freq, duration) => {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine'; // Pure sweet bell sound
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Simple bell-like decay envelope
    gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration); // Long release

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);

    // Sound routing
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  };

  // Synthesize soft popping balloon audio sound
  const playPopSound = () => {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    // Rapid sweep downwards for pop feel
    osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.1);
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      // Pause
      musicPlaying = false;
      musicIcon.className = 'fas fa-music';
      musicBtn.classList.remove('playing');
      visualizer.classList.remove('active');
      if (synthInterval) clearTimeout(synthInterval);
    } else {
      // Play
      musicPlaying = true;
      musicIcon.className = 'fas fa-pause';
      musicBtn.classList.add('playing');
      visualizer.classList.add('active');
      playSynthesizedMelody();
    }
  };

  musicBtn.addEventListener('click', toggleMusic);

  // --- Reveal Surprise Button ---
  unlockBtn.addEventListener('click', () => {
    // Show container
    surpriseContainer.classList.remove('hidden');
    
    // Smooth scroll down
    setTimeout(() => {
      surpriseContainer.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    // Auto play music on reveal interaction
    if (!musicPlaying) {
      toggleMusic();
    }

    // Trigger full screen confetti shower
    triggerConfettiShower();
  });

  // --- Interactive Envelope Card Logic ---
  envelope.addEventListener('click', (e) => {
    e.stopPropagation();
    envelope.classList.toggle('open');
    
    // Trigger sweet explosion
    const rect = envelope.getBoundingClientRect();
    triggerExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
  });

  // --- Interactive Balloons Pop Garden Logic ---
  const spawnBalloons = () => {
    balloonGarden.innerHTML = '';
    const balloonColors = [
      'hsl(350, 85%, 72%)',  // Pastel Pink
      'hsl(320, 80%, 75%)',  // Lavender Pink
      'hsl(280, 75%, 78%)',  // Lilac
      'hsl(20, 90%, 72%)',   // Peach
      'hsl(45, 90%, 70%)',   // Soft Gold
      'hsl(170, 70%, 75%)',  // Mint
      'hsl(200, 80%, 75%)'   // Sky Blue
    ];

    const numBalloons = 9;
    for (let i = 0; i < numBalloons; i++) {
      const balloon = document.createElement('div');
      balloon.className = 'balloon';
      
      const color = balloonColors[i % balloonColors.length];
      balloon.style.backgroundColor = color;
      balloon.style.color = color; // For the pseudo-element string color matching
      
      // Distribute balloon positions across container
      const leftPercent = 10 + (i * 9);
      balloon.style.left = `${leftPercent}%`;
      // Randomize float heights
      const topOffset = Math.random() * 80 + 30;
      balloon.style.top = `${topOffset}px`;

      // Create balloon string
      const string = document.createElement('div');
      string.className = 'balloon-string';
      balloon.appendChild(string);

      // Click / Touch interaction
      balloon.addEventListener('click', (e) => {
        if (!balloon.classList.contains('pop')) {
          e.stopPropagation();
          balloon.classList.add('pop');
          playPopSound();
          
          // Spawn confetti particles at pop coordinate
          const rect = balloon.getBoundingClientRect();
          triggerExplosion(rect.left + rect.width/2, rect.top + rect.height/2, 20);

          // Select and show wish text
          const randomWish = sweetWishes[Math.floor(Math.random() * sweetWishes.length)];
          wishText.innerText = randomWish;
          wishBox.classList.remove('hidden');
        }
      });

      balloonGarden.appendChild(balloon);
    }
  };

  spawnBalloons();

  // --- Canvas Particle Animation Engine ---
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const maxParticles = 100;

  class Particle {
    constructor(x, y, type = null) {
      this.x = x || Math.random() * width;
      this.y = y || (x ? y : Math.random() * height - height); // If spawned, use y. Else, top of screen.
      this.type = type || ['heart', 'star', 'confetti'][Math.floor(Math.random() * 3)];
      
      // Sizes & colors
      this.size = Math.random() * 8 + 4;
      this.color = this.getRandomColor();
      
      // Velocities
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 + 1; // Downward drift
      
      // Oscillations & rotations
      this.oscillationSpeed = Math.random() * 0.02 + 0.01;
      this.oscillationAmount = Math.random() * 25 + 5;
      this.oscTime = Math.random() * 100;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.opacity = Math.random() * 0.5 + 0.5;
    }

    getRandomColor() {
      if (this.type === 'heart') {
        const pColors = ['#ff7e8a', '#ff4a5a', '#ffb3bd', '#ff8fa3', '#fecfef'];
        return pColors[Math.floor(Math.random() * pColors.length)];
      } else if (this.type === 'star') {
        return '#ffd700'; // Gold stars
      } else {
        const cColors = ['#ffd700', '#ff4a5a', '#a5c7f7', '#a8e6cf', '#ffd3b6', '#e8a7ff'];
        return cColors[Math.floor(Math.random() * cColors.length)];
      }
    }

    update() {
      this.oscTime += this.oscillationSpeed;
      // Drift sideways with oscillation
      this.x += this.vx + Math.sin(this.oscTime) * 0.3;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      // Wrap-around check
      if (this.y > height + 20) {
        this.y = -20;
        this.x = Math.random() * width;
        this.opacity = Math.random() * 0.5 + 0.5;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);

      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1;

      if (this.type === 'heart') {
        ctx.beginPath();
        // Standard heart shape drawing
        const s = this.size;
        ctx.moveTo(0, -s/4);
        ctx.bezierCurveTo(-s/2, -s, -s, -s/2, -s, 0);
        ctx.bezierCurveTo(-s, s/2, -s/2, s, 0, s*1.2);
        ctx.bezierCurveTo(s/2, s, s, s/2, s, 0);
        ctx.bezierCurveTo(s, -s/2, s/2, -s, 0, -s/4);
        ctx.closePath();
        ctx.fill();
      } else if (this.type === 'star') {
        ctx.beginPath();
        const r = this.size;
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r);
          ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r/2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r/2));
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Confetti - little squares
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
      }

      ctx.restore();
    }
  }

  // Populate initial falling particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // --- Interaction Trail Particles ---
  window.addEventListener('mousemove', (e) => {
    // Spawn 1 trail particle every few frames of mouse motion
    if (Math.random() < 0.25) {
      const trailParticle = new Particle(e.clientX, e.clientY, Math.random() < 0.6 ? 'heart' : 'star');
      trailParticle.vy = -(Math.random() * 2 + 1); // Float upwards
      trailParticle.vx = Math.random() * 2 - 1;
      trailParticle.opacity = 0.8;
      particles.push(trailParticle);
      
      // Keep array bounded
      if (particles.length > 250) {
        particles.shift();
      }
    }
  });

  // --- Particle Explosions (e.g. Balloon Pop or Envelope Open) ---
  const triggerExplosion = (x, y, count) => {
    for (let i = 0; i < count; i++) {
      const p = new Particle(x, y, ['heart', 'star', 'confetti'][Math.floor(Math.random() * 3)]);
      // Fast explosive speeds
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1; // Throw upwards
      p.opacity = 1.0;
      p.rotationSpeed = Math.random() * 10 - 5;
      p.size = Math.random() * 6 + 5;
      
      // Custom update logic for explosion fade-out
      const originalUpdate = p.update;
      p.update = function() {
        originalUpdate.call(this);
        this.opacity -= 0.015; // Fade out quickly
        this.vx *= 0.96; // Air resistance friction
        this.vy += 0.05; // Gravity
      };

      particles.push(p);
    }
  };

  // Shower of confetti when Surprise is Unlocked
  const triggerConfettiShower = () => {
    const intervals = [100, 300, 600, 900];
    intervals.forEach(delay => {
      setTimeout(() => {
        // Explode from random spots across the screen width
        triggerExplosion(Math.random() * width, Math.random() * (height * 0.4) + height * 0.1, 40);
      }, delay);
    });
  };

  // Render Loop
  const render = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();

      // Remove exploded particles that fully faded out
      if (p.opacity <= 0) {
        particles.splice(i, 1);
        // Fill back standard floating particles if count drops low
        if (particles.filter(p => !p.update.name).length < maxParticles) {
          particles.push(new Particle());
        }
      }
    }

    requestAnimationFrame(render);
  };

  // Start Canvas Render Engine
  render();
});
