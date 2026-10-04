// ─── INITIALISATION FIREBASE (OPEN SCIENCE EXPERIMENT) ─────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAtYUFAb74OhgUyoVumAsHjuxqgGjRAD7M",
  authDomain: "open-science-experiment.firebaseapp.com",
  databaseURL: "https://open-science-experiment-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "open-science-experiment",
  storageBucket: "open-science-experiment.firebasestorage.app",
  messagingSenderId: "76300119346",
  appId: "1:76300119346:web:972217d031b6f7db0f7b2b",
  measurementId: "G-Y3TV5Z234G"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ID sujet unique et anonyme : horodatage + chaîne aléatoire
const subject_id = "sub_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);

// ─── INITIALISATION JSPSYCH & SURVEILLANCE DU FOCUS ─────────────────────────
var jsPsych = initJsPsych({
  use_webaudio: false,
  on_interaction_data_update: function (data) {
    if (data.event === "blur" || data.event === "fullscreenexit") {
      console.warn("Attention : focus perdu ou plein écran quitté à t=" + data.time);
    }
  }
});

var timeline = [];

// ─── DÉTECTION MOBILE ROBUSTE (COMPATIBLE PC PORTABLES TACTILES) ────────────
function isComputer() {
  const ua = navigator.userAgent.toLowerCase();

  // 1. Détection classique par User-Agent
  const isMobileUA = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/.test(ua);

  // 2. Détection géométrique : largeur et hauteur logiques de l'écran physique
  const minDim = Math.min(window.screen.width, window.screen.height);
  const maxDim = Math.max(window.screen.width, window.screen.height);

  // Un smartphone ne dépasse pas ces dimensions, même avec "Version ordinateur" activée
  const isMobileDimensions = (minDim < 600 || maxDim < 950);

  // 3. Détection spécifique tablettes / iPad sous iPadOS qui s'annoncent comme MacIntel
  const isIPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 && minDim < 850);

  if (isMobileUA || isMobileDimensions || isIPad) {
    return false;
  }

  return true;
}

const isMobileDevice = !isComputer();

if (isMobileDevice) {
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `<div style="text-align:center;padding:40px;color:#fff;font-family:sans-serif;">
      <p><strong>Appareil non compatible</strong></p>
      <p>Pour passer cette expérience, il vous faut impérativement être sur un ordinateur (clavier et souris).</p>
      <p>Merci de renouveler l'expérience depuis un ordinateur.</p>
    </div>`,
    choices: ["Quitter"],
    on_finish: function () {
      window.location.href = "https://www.univ-tlse2.fr/";
    }
  });
} else {

  // ─── 0. CONSENTEMENT LIBRE ET ÉCLAIRÉ ───────────────────────────────────────
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div style="max-width:780px;margin:20px auto;text-align:left;line-height:1.55;font-size:0.88rem;background:rgba(255,255,255,0.06);padding:24px;border-radius:12px;border:1px solid #444;max-height:70vh;overflow-y:auto;color:#fff;">
        <h2 style="text-align:center;font-size:1.25rem;margin-top:0;color:#fff;">Formulaire d'information et de consentement libre et éclairé</h2>
        
        <p>Avant d’accepter de participer à ce projet de recherche, veuillez prendre le temps de lire et de comprendre les renseignements qui suivent. Ce document vous explique le but de ce projet de recherche, ses procédures, avantages, risques et inconvénients. Nous vous rappelons que vous pouvez interrompre votre participation à l'étude à tout moment sans avoir à vous justifier. Un refus de participer n'aura aucune conséquence sur votre relation avec l'équipe de recherche qui la propose.</p>
        
        <p style="background:rgba(46,204,113,0.15);padding:8px 12px;border-radius:6px;border-left:4px solid #2ecc71;">
          <strong>Avis éthique :</strong> Cette étude a reçu un avis favorable du Comité d’Éthique de la Recherche de Toulouse (avis n° 2026_1242, en date du 18/02/2026).
        </p>

        <p><strong>Responsable scientifique du projet :</strong><br>
        Pr Céline Lemercier, Laboratoire CLLE & CNRS, Université Jean Jaurès, 5 allée Antonio Machado 31058 Toulouse cedex 9 (<a href="mailto:celine.lemercier@univ-tlse2.fr" style="color:#60a5fa;">celine.lemercier@univ-tlse2.fr</a>)<br>
        <strong>Lieu de recherche :</strong> Université Toulouse Jean Jaurès, laboratoire CLLE.</p>

        <p><strong>But du projet de recherche :</strong><br>
        Ce projet vise à étudier quels sont les paramètres du stimulus qui permettent d’améliorer sa perception.</p>

        <p><strong>Ce que l’on attend de vous (méthodologie) :</strong><br>
        Si vous acceptez de participer à cette étude, vous êtes invité·e à répondre à quelques questions puis à compter le nombre de rebonds de formes qu’on vous aura préalablement décrites contre les bords de l’écran. Vous aurez 5 essais de 30 secondes pendant lesquels des formes se déplaceront sur l'écran en rebondissant contre les bords. On vous demandera de compter les rebonds d’un groupe précis de ces objets. L’expérience dure en tout environ 15 minutes (en incluant la lecture du présent consentement et le débriefing).</p>

        <p><strong>Vos droits de vous retirer de la recherche en tout temps :</strong><br>
        1. Votre contribution à cette recherche est volontaire.<br>
        2. Vous pouvez cesser votre participation à tout moment, et cela n’aura aucune conséquence. Cependant, lorsque votre participation sera terminée, il ne sera plus possible de retirer vos données. En effet, la stricte anonymisation de cette étude rend impossible l'identification de vos réponses parmi l'ensemble des données recueillies.</p>

        <p><strong>Confidentialité et respect de la vie privée :</strong><br>
        Cette étude est strictement anonyme : aucune donnée nominative ou permettant de vous identifier directement ou indirectement n'est collectée.<br>
        1. Les données obtenues seront traitées avec la plus entière confidentialité.<br>
        2. Aucun renseignement ne sera dévoilé qui puisse révéler votre identité.<br>
        3. Les données seront conservées dans un environnement sécurisé (seule l'équipe de recherche y a accès).</p>

        <p><strong>Bénéfices :</strong><br>
        • <em>Avancées scientifiques :</em> éclairage sur les paramètres du stimulus déterminants dans le taux de capture attentionnelle.<br>
        • <em>Pour la société :</em> compréhension des mécanismes d'attention dans des environnements dynamiques à haut risque (aéronautique, conduite automobile).<br>
        • <em>Pour le participant :</em> participation active à la démarche scientifique.</p>

        <p><strong>Risques possibles :</strong><br>
        Cette recherche n’implique aucun risque ou inconfort autre que ceux de la vie quotidienne face à un écran d'ordinateur.</p>

        <p><strong>Diffusion des résultats & Contacts :</strong><br>
        Les résultats seront communiqués lors de congrès scientifiques et publiés dans des revues internationales à comité de lecture. Vous pourrez prendre connaissance des résultats généraux en contactant le Pr Céline Lemercier.<br>
        • Protection des données (DPO) : <a href="mailto:dr14-rgpd@cnrs.fr" style="color:#60a5fa;">dr14-rgpd@cnrs.fr</a><br>
        • Comité d’Éthique de la Recherche (CER) : <a href="mailto:bureau-cer@univ-toulouse.fr" style="color:#60a5fa;">bureau-cer@univ-toulouse.fr</a></p>
      </div>
    `,
    choices: ["Je refuse de participer", "J'ai lu, compris et j'accepte de participer"],
    button_html: [
      '<button class="jspsych-btn" style="background:#475569;color:#fff;margin:8px;">%choice%</button>',
      '<button class="jspsych-btn" style="background:#2563eb;color:#fff;font-weight:bold;margin:8px;">%choice%</button>'
    ],
    on_finish: function (data) {
      if (data.response === 0) {
        jsPsych.abort(`<div style="text-align:center;padding:50px;color:#fff;font-family:sans-serif;">
          <h3>Participation annulée</h3>
          <p>Vous avez choisi de ne pas participer à cette étude. Aucune donnée n'a été enregistrée.</p>
          <p>Redirection en cours...</p>
        </div>`);
        setTimeout(() => {
          window.location.href = "https://www.univ-tlse2.fr/";
        }, 2000);
      }
    }
  });

  // ─── CONDITIONS US (UNEXPECTED STIMULUS) ───────────────────────────────────
  const speedcondition = Math.random() < 0.5 ? "slow" : "fast";
  const unexpectedSpeed = speedcondition === "slow" ? -80 : -200; // px/s

  const allVariants = [
    { id: 'none',                   hasUnexpected: false, shape: 'circle',   color: 'black', size: 'fixed'   },
    { id: 'circle_black_fixed',     hasUnexpected: true,  shape: 'circle',   color: 'black', size: 'fixed'   },
    { id: 'circle_black_pulsing',   hasUnexpected: true,  shape: 'circle',   color: 'black', size: 'pulsing' },
    { id: 'circle_red_fixed',       hasUnexpected: true,  shape: 'circle',   color: 'red',   size: 'fixed'   },
    { id: 'circle_red_pulsing',     hasUnexpected: true,  shape: 'circle',   color: 'red',   size: 'pulsing' },
    { id: 'triangle_black_fixed',   hasUnexpected: true,  shape: 'triangle', color: 'black', size: 'fixed'   },
    { id: 'triangle_black_pulsing', hasUnexpected: true,  shape: 'triangle', color: 'black', size: 'pulsing' },
    { id: 'triangle_red_fixed',     hasUnexpected: true,  shape: 'triangle', color: 'red',   size: 'fixed'   },
    { id: 'triangle_red_pulsing',   hasUnexpected: true,  shape: 'triangle', color: 'red',   size: 'pulsing' },
  ];

  const selectedVariantObj = jsPsych.randomization.sampleWithoutReplacement(allVariants, 1)[0];
  const selectedVariant    = selectedVariantObj.id;
  const hasUnexpected      = selectedVariantObj.hasUnexpected;
  const unexpectedShape    = selectedVariantObj.shape;
  const unexpectedColor    = selectedVariantObj.color;
  const unexpectedSizeMode = selectedVariantObj.size;

  const BASE_RADIUS = 20;       // rayon en pixels d'origine
  const PULSE_AMPLITUDE = 0.10; // ±10%
  const PULSE_FREQ = 2;         // 2 Hz

  let measuredRefreshRate = 60;

  // Enregistrement des propriétés globales
  jsPsych.data.addProperties({
    subject_id: subject_id,
    variant: selectedVariant,
    us_shape: unexpectedShape,
    us_color: unexpectedColor,
    us_size_mode: unexpectedSizeMode,
    has_unexpected: hasUnexpected,
    speedcondition: speedcondition,
    unexpected_speed_px: unexpectedSpeed,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    pixel_ratio: window.devicePixelRatio || 1
  });

  // ─── 1. PLEIN ÉCRAN & POSTURE ────────────────────────────────────────────────
  timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: `
      <div style="max-width:650px;margin:auto;text-align:center;line-height:1.6;color:#fff;">
        <p><strong>Bienvenue dans cette étude !</strong></p>
        <p>Pour la validité des mesures, merci de vous installer confortablement à <strong>environ une longueur de bras de votre écran</strong> (50 à 60 cm) et de ne plus vous déplacer jusqu'à la fin.</p>
        <p>L'expérience va démarrer en plein écran.</p>
      </div>
    `,
    button_label: "Passer en plein écran"
  });

  // ─── 2. MESURE DU TAUX DE RAFRAÎCHISSEMENT (60 FRAMES) ──────────────────────
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p style="color:#ccc;">Initialisation de l'affichage en cours...</p>`,
    choices: "NO_KEYS",
    trial_duration: 1000,
    on_load: function () {
      let frames = 0;
      let tStart = performance.now();
      function countFrames(now) {
        frames++;
        if (frames < 60) {
          requestAnimationFrame(countFrames);
        } else {
          let duration = now - tStart;
          measuredRefreshRate = Math.round((frames / duration) * 1000);
          jsPsych.data.addProperties({ measured_refresh_rate: measuredRefreshRate });
        }
      }
      requestAnimationFrame(countFrames);
    }
  });

  // ─── 3. QUESTIONS DÉMOGRAPHIQUES ────────────────────────────────────────────
  timeline.push({
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: "Quel est votre sexe ?", options: ["Homme", "Femme", "Non-binaire", "Autre", "Préfère ne pas répondre"], required: true }],
    button_label: "Valider",
    on_finish: function (data) { data.participant_sex = data.response.Q0; }
  });

  timeline.push({
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: "Quelle est votre tranche d'âge ?", options: ["Moins de 18 ans", "18-25 ans", "26-35 ans", "36-50 ans", "51 ans et plus"], required: true }],
    button_label: "Valider",
    on_finish: function (data) { data.participant_age = data.response.Q0; }
  });

  // ─── 4. ÉCRAN D'INSTRUCTIONS & DÉMONSTRATION ────────────────────────────────
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p><strong>Consignes de la tâche</strong></p>
      <p>8 ronds noirs vont se déplacer sur l'écran et rebondir contre les parois : 4 sont rapides et 4 sont lents.</p>
      <p><strong>Vous devez compter attentivement les rebonds des 4 ronds les plus rapides,<br>
      et indiquer à la fin de chaque essai le nombre total de rebonds que vous avez compté.</strong></p>
      <p>Les ronds plus lents ne sont là que pour vous distraire !</p>
      <p>Voici un aperçu : les 4 rapides clignotent <span style="color:red;">en rouge</span>
      et les 4 lents <span style="color:lightgreen;">en vert</span>. Dans l'expérience réelle, ils resteront tous noirs.</p>
      <canvas id="welcomeCanvas" width="400" height="300" style="width:400px;height:300px;border:1px solid #222;display:block;margin:10px auto;"></canvas>
    `,
    choices: ["Commencer"],
    on_load: function () {
      const canvas = document.getElementById("welcomeCanvas");
      const ctx = canvas.getContext("2d");
      canvas.style.backgroundColor = "#525252";

      const baseR = 10;
      const shapes = [];
      for (let j = 0; j < 8; j++) {
        const fast = j >= 4;
        const speed = fast ? 100 : 40;
        const baseColor = fast ? "red" : "green";
        const angle = Math.random() * 2 * Math.PI;
        shapes.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * baseR * 2,
          y: canvas.height / 2 + (Math.random() - 0.5) * baseR * 2,
          dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed,
          baseColor, color: baseColor, radius: baseR,
          group: fast ? 2 : 1, lastRebound: null
        });
      }

      let isPaused = false, blinkState = true;
      const blinkTimer = setInterval(() => {
        if (isPaused) return;
        blinkState = !blinkState;
        shapes.forEach(s => { s.color = blinkState ? s.baseColor : "black"; });
      }, 500);

      function update(dt) {
        if (isPaused) return;
        shapes.forEach(s => {
          s.x += s.dx * dt; s.y += s.dy * dt;
          if (s.x - s.radius / 2 <= 0) { s.x = s.radius / 2; if (s.lastRebound !== "left") { s.dx *= -1; s.lastRebound = "left"; } }
          else if (s.x + s.radius / 2 >= canvas.width) { s.x = canvas.width - s.radius / 2; if (s.lastRebound !== "right") { s.dx *= -1; s.lastRebound = "right"; } }
          else { if (s.lastRebound === "left" || s.lastRebound === "right") s.lastRebound = null; }

          if (s.y - s.radius / 2 <= 0) { s.y = s.radius / 2; if (s.lastRebound !== "top") { s.dy *= -1; s.lastRebound = "top"; } }
          else if (s.y + s.radius / 2 >= canvas.height) { s.y = canvas.height - s.radius / 2; if (s.lastRebound !== "bottom") { s.dy *= -1; s.lastRebound = "bottom"; } }
          else { if (s.lastRebound === "top" || s.lastRebound === "bottom") s.lastRebound = null; }
        });
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        shapes.forEach(s => {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.radius / 2, 0, 2 * Math.PI);
          ctx.fillStyle = s.color; ctx.fill();
        });
        ctx.fillStyle = "black"; ctx.font = "20px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("+", canvas.width / 2, canvas.height / 2);
      }

      let last = performance.now();
      function animate() {
        if (isPaused) return;
        const now = performance.now();
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        update(dt); draw();
        requestAnimationFrame(animate);
      }
      animate();

      document.querySelector(".jspsych-btn").addEventListener("click", () => {
        isPaused = true;
        clearInterval(blinkTimer);
      });
    }
  });

  // ─── 5. MOTEUR D'ANIMATION UNIFIÉ ───────────────────────────────────────────
  function buildTrackingTrial(config) {
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `<canvas id="animationCanvas" width="800" height="600" style="width:800px;height:600px;border:1px solid #222;display:block;margin:auto;background-color:#525252;"></canvas>`,
      choices: "NO_KEYS",
      trial_duration: config.duration_ms,
      data: {
        trial_number: config.trial_number,
        is_training: config.is_training || false,
        speedcondition: speedcondition
      },
      on_load: function () {
        const canvas = document.getElementById("animationCanvas");
        const ctx = canvas.getContext("2d");
        const baseR = BASE_RADIUS;

        let rebGroup1 = 0;
        let rebGroup2 = 0;
        let droppedFrames = 0;
        let isRunning = false;

        const shapes = [];
        for (let j = 0; j < 8; j++) {
          const fast = j >= 4;
          const speed = fast ? 200 : 80;
          const angle = Math.random() * 2 * Math.PI;
          shapes.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * baseR * 2,
            y: canvas.height / 2 + (Math.random() - 0.5) * baseR * 2,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            radius: baseR,
            group: fast ? 2 : 1,
            lastRebound: null
          });
        }

        const unexpected = {
          x: canvas.width + BASE_RADIUS + 5,
          y: canvas.height / 2,
          speed: unexpectedSpeed
        };

        let startTime = 0;
        let lastFrame = 0;

        function update(dt, elapsed) {
          shapes.forEach(s => {
            s.x += s.dx * dt;
            s.y += s.dy * dt;

            // Rebonds horizontaux
            if (s.x - s.radius / 2 <= 0) {
              s.x = s.radius / 2;
              if (s.lastRebound !== "left") {
                s.dx *= -1;
                s.lastRebound = "left";
                if (s.group === 1) rebGroup1++; else rebGroup2++;
              }
            } else if (s.x + s.radius / 2 >= canvas.width) {
              s.x = canvas.width - s.radius / 2;
              if (s.lastRebound !== "right") {
                s.dx *= -1;
                s.lastRebound = "right";
                if (s.group === 1) rebGroup1++; else rebGroup2++;
              }
            } else {
              if (s.lastRebound === "left" || s.lastRebound === "right") s.lastRebound = null;
            }

            // Rebonds verticaux
            if (s.y - s.radius / 2 <= 0) {
              s.y = s.radius / 2;
              if (s.lastRebound !== "top") {
                s.dy *= -1;
                s.lastRebound = "top";
                if (s.group === 1) rebGroup1++; else rebGroup2++;
              }
            } else if (s.y + s.radius / 2 >= canvas.height) {
              s.y = canvas.height - s.radius / 2;
              if (s.lastRebound !== "bottom") {
                s.dy *= -1;
                s.lastRebound = "bottom";
                if (s.group === 1) rebGroup1++; else rebGroup2++;
              }
            } else {
              if (s.lastRebound === "top" || s.lastRebound === "bottom") s.lastRebound = null;
            }
          });

          // Progression de l'US
          if (config.allowUS && hasUnexpected && elapsed > 10000) {
            unexpected.x += unexpected.speed * dt;
          }
        }

        function draw(elapsed) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Cibles régulières
          ctx.fillStyle = "black";
          for (let i = 0; i < shapes.length; i++) {
            ctx.beginPath();
            ctx.arc(shapes[i].x, shapes[i].y, shapes[i].radius / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Dessin de l'US
          if (config.allowUS && hasUnexpected && elapsed > 10000) {
            let r = BASE_RADIUS / 2;
            if (unexpectedSizeMode === 'pulsing') {
              r = (BASE_RADIUS * (1 + PULSE_AMPLITUDE * Math.sin(2 * Math.PI * PULSE_FREQ * (elapsed / 1000)))) / 2;
            }
            ctx.fillStyle = unexpectedColor;
            if (unexpectedShape === 'circle') {
              ctx.beginPath();
              ctx.arc(unexpected.x, unexpected.y, r, 0, Math.PI * 2);
              ctx.fill();
            } else if (unexpectedShape === 'triangle') {
              ctx.beginPath();
              ctx.moveTo(unexpected.x, unexpected.y - r * 1.3);
              ctx.lineTo(unexpected.x - r * 1.15, unexpected.y + r * 0.75);
              ctx.lineTo(unexpected.x + r * 1.15, unexpected.y + r * 0.75);
              ctx.closePath();
              ctx.fill();
            }
          }

          // Croix de fixation
          ctx.fillStyle = "black";
          ctx.font = "40px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("+", canvas.width / 2, canvas.height / 2);
        }

        function loop(now) {
          if (!isRunning) return;
          const delta = now - lastFrame;

          if (delta > 25) {
            droppedFrames++;
          }

          const dt = Math.min(delta / 1000, 0.05);
          lastFrame = now;
          const elapsed = now - startTime;

          update(dt, elapsed);
          draw(elapsed);
          requestAnimationFrame(loop);
        }

        setTimeout(() => {
          isRunning = true;
          startTime = performance.now();
          lastFrame = startTime;
          requestAnimationFrame(loop);
        }, 500);

        setTimeout(() => {
          isRunning = false;
        }, config.duration_ms - 500);

        window._currentTrialData = {
          getRebounds: () => ({ rebGroup1, rebGroup2 }),
          getDroppedFrames: () => droppedFrames
        };
      },
      on_finish: function (data) {
        if (window._currentTrialData) {
          const r = window._currentTrialData.getRebounds();
          data.rebounds_slow = r.rebGroup1;
          data.rebounds_fast = r.rebGroup2;
          data.true_rebounds = r.rebGroup2;
          data.dropped_frames = window._currentTrialData.getDroppedFrames();
          window._currentTrialData = null;
        }
      }
    };
  }

  // ─── QUESTIONS SVG ──────────────────────────────────────────────────────────
  function getShapeSVG(shapeType, size) {
    const s = size || 90;
    const cx = s / 2, cy = s / 2, r = s * 0.33;
    const bg = "#525252";
    if (shapeType === 'circle') {
      return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${bg}" rx="6"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="black"/></svg>`;
    }
    if (shapeType === 'triangle') {
      const h = r * 1.2;
      return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${bg}" rx="6"/><polygon points="${cx},${cy - h} ${cx - h},${cy + h * 0.65} ${cx + h},${cy + h * 0.65}" fill="black"/></svg>`;
    }
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${bg}" rx="6"/><line x1="14" y1="14" x2="${s-14}" y2="${s-14}" stroke="#aaa" stroke-width="3"/><line x1="${s-14}" y1="14" x2="14" y2="${s-14}" stroke="#aaa" stroke-width="3"/><text x="${cx}" y="${s - 10}" text-anchor="middle" fill="#aaa" font-size="11">Rien vu</text></svg>`;
  }

  function getSizeSVG(sizeMode, size) {
    const s = size || 90;
    const cx = s / 2, cy = s / 2, r = s * 0.28;
    const bg = "#525252";
    if (sizeMode === 'fixed') {
      return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${bg}" rx="6"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="black"/></svg>`;
    }
    if (sizeMode === 'pulsing') {
      const rMin = r * 0.9, rMax = r * 1.1;
      return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${bg}" rx="6"/><circle cx="${cx}" cy="${rMax}" fill="none" stroke="black" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="black"><animate attributeName="r" values="${rMin};${rMax};${rMin}" dur="0.5s" repeatCount="indefinite"/></circle></svg>`;
    }
    return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}"><rect width="${s}" height="${s}" fill="${bg}" rx="6"/><line x1="14" y1="14" x2="${s-14}" y2="${s-14}" stroke="#aaa" stroke-width="3"/><line x1="${s-14}" y1="14" x2="14" y2="${s-14}" stroke="#aaa" stroke-width="3"/><text x="${cx}" y="${s - 10}" text-anchor="middle" fill="#aaa" font-size="11">Rien vu</text></svg>`;
  }

  function appendIBQuestionBattery(trialNumber) {
    timeline.push({
      type: jsPsychSurveyMultiChoice,
      questions: [{ prompt: "Avez-vous vu quelque chose d'inhabituel sur cet essai ?", options: ["OUI", "NON"], required: true }],
      data: { trial_number: trialNumber, question_type: "detection_ib" },
      on_finish: function (data) { data.participant_response_ib = data.response.Q0; }
    });

    timeline.push({
      type: jsPsychHtmlSliderResponse,
      stimulus: "Êtes-vous sûr·e de votre réponse (OUI / NON) concernant la présence d'un objet inhabituel ?<br>Indiquez votre certitude.",
      labels: ["NON, j'ai des doutes...", "OUI, je suis sûr·e !"],
      min: 0, max: 100, step: 1, slider_start: 50, require_movement: true,
      data: { trial_number: trialNumber, question_type: "confiance_detection" },
      on_finish: function (data) { data.confidence_detection = data.response; }
    });

    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<p>Quelle était la <strong>forme</strong> de cet objet ?</p><p style="color:#aaa;font-size:0.9em;">Sélectionnez une option :</p><div id="shape-options" style="display:flex;gap:24px;justify-content:center;"></div>`,
      choices: ["Valider"],
      button_html: '<button class="jspsych-btn" disabled>%choice%</button>',
      data: { trial_number: trialNumber, question_type: "forme" },
      on_load: function () {
        const btn = document.querySelector(".jspsych-btn");
        const container = document.getElementById("shape-options");
        const opts = [{ val: 'circle', lab: 'Rond' }, { val: 'triangle', lab: 'Triangle' }, { val: 'none', lab: 'Rien vu' }];
        opts.forEach(opt => {
          const w = document.createElement("div");
          w.style.cssText = "display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:8px;border-radius:8px;border:2px solid transparent;";
          w.innerHTML = `${getShapeSVG(opt.val, 90)}<span style="font-size:0.85em;margin-top:4px;">${opt.lab}</span>`;
          w.onclick = () => {
            Array.from(container.children).forEach(d => { d.style.borderColor = "transparent"; d.style.backgroundColor = "transparent"; });
            w.style.borderColor = "#2ecc71"; w.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
            btn.disabled = false;
            window._selectedShape = opt.val;
          };
          container.appendChild(w);
        });
      },
      on_finish: function (data) {
        data.participant_response_shape = window._selectedShape || null;
        window._selectedShape = null;
      }
    });

    timeline.push({
      type: jsPsychHtmlSliderResponse,
      stimulus: "Indiquez votre niveau de certitude quant à la <strong>forme</strong> choisie :",
      labels: ["Faible certitude", "Totale certitude"],
      min: 0, max: 100, step: 1, slider_start: 50, require_movement: true,
      data: { trial_number: trialNumber, question_type: "confiance_forme" },
      on_finish: function (data) { data.confidence_shape = data.response; }
    });

    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<p>De quelle <strong>couleur</strong> était cet objet ?</p><div id="color-options" style="display:flex;gap:24px;justify-content:center;"></div>`,
      choices: ["Valider"],
      button_html: '<button class="jspsych-btn" disabled>%choice%</button>',
      data: { trial_number: trialNumber, question_type: "couleur" },
      on_load: function () {
        const btn = document.querySelector(".jspsych-btn");
        const container = document.getElementById("color-options");
        const cols = [
          { val: 'black', lab: 'Noir', hex: '#000000' },
          { val: 'red', lab: 'Rouge', hex: '#cc0000' },
          { val: 'none', lab: 'Rien vu', hex: null }
        ];
        cols.forEach(c => {
          const w = document.createElement("div");
          w.style.cssText = "display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:8px;border-radius:8px;border:2px solid transparent;";
          const swatch = c.hex ? `<div style="width:60px;height:60px;border-radius:8px;background:${c.hex};border:1px solid #444;"></div>`
                               : `<div style="width:60px;height:60px;border-radius:8px;background:#888;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#222;">X</div>`;
          w.innerHTML = `${swatch}<span style="font-size:0.85em;margin-top:4px;">${c.lab}</span>`;
          w.onclick = () => {
            Array.from(container.children).forEach(d => { d.style.borderColor = "transparent"; d.style.backgroundColor = "transparent"; });
            w.style.borderColor = "#2ecc71"; w.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
            btn.disabled = false;
            window._selectedColor = c.val;
          };
          container.appendChild(w);
        });
      },
      on_finish: function (data) {
        data.participant_response_color = window._selectedColor || null;
        window._selectedColor = null;
      }
    });

    timeline.push({
      type: jsPsychHtmlSliderResponse,
      stimulus: "Indiquez votre certitude quant à la <strong>couleur</strong> choisie :",
      labels: ["Faible certitude", "Totale certitude"],
      min: 0, max: 100, step: 1, slider_start: 50, require_movement: true,
      data: { trial_number: trialNumber, question_type: "confiance_couleur" },
      on_finish: function (data) { data.confidence_color = data.response; }
    });

    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<p>Comment était la <strong>taille</strong> de cet objet ?</p><div id="size-options" style="display:flex;gap:24px;justify-content:center;"></div>`,
      choices: ["Valider"],
      button_html: '<button class="jspsych-btn" disabled>%choice%</button>',
      data: { trial_number: trialNumber, question_type: "taille" },
      on_load: function () {
        const btn = document.querySelector(".jspsych-btn");
        const container = document.getElementById("size-options");
        const sizes = [
          { val: 'fixed', lab: 'Taille fixe' },
          { val: 'pulsing', lab: 'Taille variable' },
          { val: 'none', lab: 'Rien vu' }
        ];
        sizes.forEach(s => {
          const w = document.createElement("div");
          w.style.cssText = "display:flex;flex-direction:column;align-items:center;cursor:pointer;padding:8px;border-radius:8px;border:2px solid transparent;";
          w.innerHTML = `${getSizeSVG(s.val, 90)}<span style="font-size:0.85em;margin-top:4px;">${s.lab}</span>`;
          w.onclick = () => {
            Array.from(container.children).forEach(d => { d.style.borderColor = "transparent"; d.style.backgroundColor = "transparent"; });
            w.style.borderColor = "#2ecc71"; w.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
            btn.disabled = false;
            window._selectedSize = s.val;
          };
          container.appendChild(w);
        });
      },
      on_finish: function (data) {
        data.participant_response_size = window._selectedSize || null;
        window._selectedSize = null;
      }
    });

    timeline.push({
      type: jsPsychHtmlSliderResponse,
      stimulus: "Indiquez votre certitude quant à la <strong>taille</strong> choisie :",
      labels: ["Faible certitude", "Totale certitude"],
      min: 0, max: 100, step: 1, slider_start: 50, require_movement: true,
      data: { trial_number: trialNumber, question_type: "confiance_taille" },
      on_finish: function (data) { data.confidence_size = data.response; }
    });
  }

  // ─── 6. ENTRAÎNEMENT (2 ESSAIS) ─────────────────────────────────────────────
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Avant de commencer, vous allez faire <strong>2 essais d'entraînement</strong> (20 secondes chacun).</p>
      <p>Comptez attentivement les rebonds des 4 ronds <strong>rapides</strong>.</p>`,
    choices: ["Démarrer l'entraînement"]
  });

  for (let trainIdx = 1; trainIdx <= 2; trainIdx++) {
    timeline.push(buildTrackingTrial({ trial_number: `train_${trainIdx}`, is_training: true, allowUS: false, duration_ms: 20000 }));

    timeline.push({
      type: jsPsychSurveyText,
      preamble: `<p>Combien de rebonds des 4 ronds <strong>rapides</strong> avez-vous compté ?</p>`,
      questions: [{ prompt: "Nombre de rebonds :", required: true }],
      button_label: "Valider",
      on_finish: function (data) {
        const lastTrial = jsPsych.data.get().filter({ is_training: true }).last(1).values()[0];
        const trueCount = lastTrial ? lastTrial.true_rebounds : 0;
        const rep = parseInt(data.response.Q0, 10) || 0;
        const precision = trueCount > 0 ? Math.max(0, 100 - (Math.abs(trueCount - rep) / trueCount) * 100) : 0;
        data.participant_rebound_count = rep;
        data.precision = Math.round(precision);
        data.feedback_text = `Votre précision sur cet essai : <strong>${data.precision}%</strong> (Vous : ${rep}, Réel : ${trueCount}).`;
      }
    });

    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: function () { return `<p>${jsPsych.data.get().last(1).values()[0].feedback_text}</p>`; },
      choices: ["Continuer"]
    });
  }

  // ─── 7. TRANSITION VERS LES ESSAIS EXPÉRIMENTAUX ────────────────────────────
  timeline.push({
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>L'entraînement est terminé. Les essais suivants dureront <strong>30 secondes</strong>.</p>
      <p>Comme précédemment, comptez les rebonds des 4 ronds <strong>les plus rapides</strong>.</p>
    `,
    choices: ["Prêt !"]
  });

  // ─── 8. 5 ESSAIS EXPÉRIMENTAUX ───────────────────────────────────────────────
  for (let t = 1; t <= 5; t++) {
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `<p>${t < 5 ? "<strong>Prêt pour l'essai suivant ?</strong>" : "Consigne modifiée : Observez l'écran, <strong>plus besoin de compter les rebonds.</strong>"}</p>`,
      choices: ["Continuer"]
    });

    const hasUSTrial = (t >= 3);
    timeline.push(buildTrackingTrial({ trial_number: t, is_training: false, allowUS: hasUSTrial, duration_ms: 30000 }));

    if (t < 5) {
      timeline.push({
        type: jsPsychSurveyText,
        preamble: `<p>Combien de rebonds des 4 ronds rapides avez-vous compté ?</p>`,
        questions: [{ prompt: "Nombre de rebonds :", required: true }],
        button_label: "Valider",
        data: { trial_number: t, question_type: "rebound_count" },
        on_finish: function (data) {
          data.participant_rebound_count = parseInt(data.response.Q0, 10) || 0;
        }
      });
    }

    if (t >= 3) {
      appendIBQuestionBattery(t);
    }
  }

  // ─── 9. CONNAISSANCE DU PARADIGME & FIN ──────────────────────────────────────
  timeline.push({
    type: jsPsychSurveyMultiChoice,
    questions: [{
      prompt: "Connaissiez-vous déjà ce type d'expérience (ex. la vidéo du gorille invisible ou l'illusion d'inattention) ?",
      options: ["Oui", "Non"],
      required: true
    }],
    button_label: "Terminer",
    data: { question_type: "prior_knowledge" },
    on_finish: function (data) { data.participant_prior_knowledge = data.response.Q0; }
  });

  // Sauvegarde Firebase en fin de passation
  timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <div style="max-width:600px;margin:auto;text-align:center;line-height:1.6;padding-top:40px;color:#fff;">
        <h2>Merci pour votre participation !</h2>
        <p id="save-status">Enregistrement des résultats en cours, veuillez patienter...</p>
      </div>
    `,
    choices: "NO_KEYS",
    on_load: function () {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});

      const experimentData = jsPsych.data.get().values();

      // Envoi vers le nœud "experiment_data/sub_..."
      db.ref("experiment_data/" + subject_id).set(experimentData)
        .then(() => {
          const status = document.getElementById("save-status");
          if (status) status.innerHTML = "✅ Données enregistrées avec succès ! Redirection en cours...";
          setTimeout(() => {
            window.location.href = "https://www.univ-tlse2.fr/";
          }, 2000);
        })
        .catch((error) => {
          console.error("Erreur de sauvegarde :", error);
          const status = document.getElementById("save-status");
          if (status) status.innerHTML = "⚠️ Une erreur réseau est survenue lors de l'envoi. Vous pouvez fermer cette fenêtre.";
        });
    }
  });

  // ─── LANCEMENT DIRECT ───────────────────────────────────────────────────────
  jsPsych.run(timeline);
}
