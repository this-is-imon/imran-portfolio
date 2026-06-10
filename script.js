document.addEventListener('DOMContentLoaded', () => {

  // ===== Scientific Background Illustrations =====
  (function drawScienceBackground() {
    const sc = document.getElementById('scienceCanvas');
    const sctx = sc.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function renderScience() {
      sc.width = window.innerWidth * dpr;
      sc.height = window.innerHeight * dpr;
      sc.style.width = window.innerWidth + 'px';
      sc.style.height = window.innerHeight + 'px';
      sctx.scale(dpr, dpr);
      const W = window.innerWidth;
      const H = window.innerHeight;
      sctx.clearRect(0, 0, W, H);

      const color = 'rgba(140, 180, 220, 0.35)';
      const colorDim = 'rgba(140, 180, 220, 0.18)';
      const colorBright = 'rgba(140, 180, 220, 0.5)';

      // Seeded random for consistency
      let seed = 42;
      function rand() { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; }

      // Helper: draw text at angle
      function drawText(text, x, y, size, angle) {
        sctx.save();
        sctx.translate(x, y);
        sctx.rotate(angle || 0);
        sctx.font = size + 'px "JetBrains Mono", "Courier New", monospace';
        sctx.fillStyle = color;
        sctx.fillText(text, 0, 0);
        sctx.restore();
      }

      // Helper: draw text italic (for variables)
      function drawItalic(text, x, y, size, angle) {
        sctx.save();
        sctx.translate(x, y);
        sctx.rotate(angle || 0);
        sctx.font = 'italic ' + size + 'px "Times New Roman", serif';
        sctx.fillStyle = color;
        sctx.fillText(text, 0, 0);
        sctx.restore();
      }

      // --- Equations scattered across viewport ---
      const equations = [
        { t: '∂L/∂w = -2Xᵀ(y - Xw)', s: 13 },
        { t: 'f(x) = σ(Wx + b)', s: 14 },
        { t: 'P(y|x) = softmax(Wh + b)', s: 12 },
        { t: '∇θ J(θ) = 𝔼[∇θ log π(a|s) · R]', s: 12 },
        { t: 'L = -Σ yᵢ log(ŷᵢ)', s: 14 },
        { t: 'attention(Q,K,V) = softmax(QKᵀ/√dₖ)V', s: 11 },
        { t: 'KL(p‖q) = Σ p(x) log(p(x)/q(x))', s: 12 },
        { t: 'ŷ = argmax P(y|x; θ)', s: 13 },
        { t: 'h_t = tanh(W_h h_{t-1} + W_x x_t)', s: 12 },
        { t: 'ELBO = 𝔼_q[log p(x|z)] - KL(q(z|x)‖p(z))', s: 10 },
        { t: 'x̂ = Decoder(Encoder(x))', s: 13 },
        { t: 'μ, σ² = Encoder(x)', s: 14 },
        { t: 'Adam: m_t = β₁m_{t-1} + (1-β₁)g_t', s: 11 },
        { t: 'BatchNorm: x̂ = (x - μ) / √(σ² + ε)', s: 11 },
        { t: 'ReLU(x) = max(0, x)', s: 14 },
        { t: 'GELU(x) = x · Φ(x)', s: 13 },
        { t: 'Σᵢ wᵢxᵢ + b', s: 15 },
        { t: 'dw = -η · ∂L/∂w', s: 14 },
        { t: 'F₁ = 2 · P·R / (P+R)', s: 13 },
        { t: 'AUC = ∫ TPR d(FPR)', s: 13 },
        { t: 'H(X) = -Σ p(x) log p(x)', s: 12 },
        { t: 'conv(f,g) = ∫ f(τ)g(t-τ)dτ', s: 12 },
        { t: 'λ₁|w|₁ + λ₂|w|₂²', s: 14 },
        { t: 'dropout(x, p) = x · Bernoulli(1-p) / (1-p)', s: 10 },
      ];

      // Place equations in a grid with jitter
      const cols = Math.ceil(W / 320);
      const rows = Math.ceil(H / 200);
      let eqIdx = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (eqIdx >= equations.length) eqIdx = 0;
          const eq = equations[eqIdx++];
          const x = c * 320 + rand() * 160 + 20;
          const y = r * 200 + rand() * 100 + 40;
          const angle = (rand() - 0.5) * 0.15;
          drawText(eq.t, x, y, eq.s, angle);
        }
      }

      // --- Neural network diagram (top-right area) ---
      function drawNNDiagram(ox, oy, scale) {
        const layers = [3, 5, 5, 4, 2];
        const layerGap = 70 * scale;
        const nodeGap = 28 * scale;
        const nodeR = 5 * scale;
        const positions = [];

        // Draw nodes per layer
        layers.forEach((count, li) => {
          const layerPos = [];
          const startY = oy - ((count - 1) * nodeGap) / 2;
          for (let ni = 0; ni < count; ni++) {
            const nx = ox + li * layerGap;
            const ny = startY + ni * nodeGap;
            layerPos.push({ x: nx, y: ny });
          }
          positions.push(layerPos);
        });

        // Draw connections
        sctx.lineWidth = 0.6 * scale;
        for (let li = 0; li < positions.length - 1; li++) {
          positions[li].forEach(a => {
            positions[li + 1].forEach(b => {
              sctx.beginPath();
              sctx.moveTo(a.x, a.y);
              sctx.lineTo(b.x, b.y);
              sctx.strokeStyle = colorDim;
              sctx.stroke();
            });
          });
        }

        // Draw nodes
        positions.forEach((layer, li) => {
          layer.forEach(n => {
            sctx.beginPath();
            sctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
            sctx.fillStyle = li === 0 || li === positions.length - 1 ? colorBright : color;
            sctx.fill();
            sctx.strokeStyle = colorBright;
            sctx.lineWidth = 0.8;
            sctx.stroke();
          });
        });

        // Labels
        sctx.font = (10 * scale) + 'px "JetBrains Mono", monospace';
        sctx.fillStyle = colorDim;
        sctx.fillText('input', ox - 8 * scale, oy + ((layers[0]) * nodeGap) / 2 + 14 * scale);
        sctx.fillText('output', ox + (layers.length - 1) * layerGap - 10 * scale, oy + ((layers[layers.length - 1]) * nodeGap) / 2 + 14 * scale);
      }

      drawNNDiagram(W * 0.72, H * 0.15, 1);
      if (H > 900) drawNNDiagram(W * 0.08, H * 0.75, 0.8);

      // --- Sigmoid / activation function curve ---
      function drawCurve(ox, oy, scale, label, fn) {
        sctx.save();
        sctx.translate(ox, oy);
        // Axes
        sctx.strokeStyle = colorDim;
        sctx.lineWidth = 0.8;
        sctx.beginPath();
        sctx.moveTo(-50 * scale, 0); sctx.lineTo(50 * scale, 0);
        sctx.moveTo(0, -40 * scale); sctx.lineTo(0, 40 * scale);
        sctx.stroke();
        // Curve
        sctx.strokeStyle = color;
        sctx.lineWidth = 1.2;
        sctx.beginPath();
        for (let i = -50; i <= 50; i++) {
          const x = i * scale;
          const y = -fn(i / 12) * 35 * scale;
          i === -50 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
        }
        sctx.stroke();
        // Label
        sctx.font = (10 * scale) + 'px "JetBrains Mono", monospace';
        sctx.fillStyle = color;
        sctx.fillText(label, -20 * scale, 50 * scale);
        sctx.restore();
      }

      const sigmoid = x => 1 / (1 + Math.exp(-x));
      const tanh_fn = x => Math.tanh(x);
      const relu = x => Math.max(0, x / 5);
      drawCurve(W * 0.15, H * 0.3, 1, 'σ(x)', sigmoid);
      drawCurve(W * 0.85, H * 0.55, 0.9, 'tanh(x)', tanh_fn);
      if (W > 800) drawCurve(W * 0.55, H * 0.85, 0.85, 'ReLU(x)', relu);

      // --- Matrix notation ---
      function drawMatrix(ox, oy, rows, cols, scale) {
        sctx.save();
        sctx.translate(ox, oy);
        const cellW = 22 * scale;
        const cellH = 16 * scale;
        const totalW = cols * cellW;
        const totalH = rows * cellH;
        // Brackets
        sctx.strokeStyle = color;
        sctx.lineWidth = 1.2;
        // Left bracket
        sctx.beginPath();
        sctx.moveTo(4, -4); sctx.lineTo(0, -4); sctx.lineTo(0, totalH + 4); sctx.lineTo(4, totalH + 4);
        sctx.stroke();
        // Right bracket
        sctx.beginPath();
        sctx.moveTo(totalW + 6, -4); sctx.lineTo(totalW + 10, -4); sctx.lineTo(totalW + 10, totalH + 4); sctx.lineTo(totalW + 6, totalH + 4);
        sctx.stroke();
        // Values
        sctx.font = (10 * scale) + 'px "JetBrains Mono", monospace';
        sctx.fillStyle = color;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const val = (rand() * 2 - 1).toFixed(1);
            sctx.fillText(val, 6 + c * cellW, 12 + r * cellH);
          }
        }
        sctx.restore();
      }

      drawMatrix(W * 0.04, H * 0.45, 3, 3, 1);
      drawMatrix(W * 0.88, H * 0.18, 4, 3, 0.9);

      // --- Attention heatmap block ---
      function drawHeatmap(ox, oy, size, scale) {
        sctx.save();
        sctx.translate(ox, oy);
        const cellSize = 12 * scale;
        sctx.font = (9 * scale) + 'px "JetBrains Mono", monospace';
        sctx.fillStyle = colorDim;
        sctx.fillText('Attention Weights', 0, -8 * scale);
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            const v = rand();
            sctx.fillStyle = `rgba(59, 130, 246, ${v * 0.4})`;
            sctx.fillRect(c * cellSize, r * cellSize, cellSize - 1, cellSize - 1);
          }
        }
        sctx.restore();
      }

      drawHeatmap(W * 0.38, H * 0.12, 6, 1);
      if (H > 700) drawHeatmap(W * 0.62, H * 0.72, 5, 0.9);

      // --- Loss curve ---
      function drawLossCurve(ox, oy, scale) {
        sctx.save();
        sctx.translate(ox, oy);
        const w = 100 * scale, h = 60 * scale;
        // Axes
        sctx.strokeStyle = colorDim;
        sctx.lineWidth = 0.8;
        sctx.beginPath();
        sctx.moveTo(0, 0); sctx.lineTo(0, -h); // y
        sctx.moveTo(0, 0); sctx.lineTo(w, 0); // x
        sctx.stroke();
        // Labels
        sctx.font = (9 * scale) + 'px "JetBrains Mono", monospace';
        sctx.fillStyle = colorDim;
        sctx.fillText('loss', -20 * scale, -h + 5);
        sctx.fillText('epoch', w - 28 * scale, 14 * scale);
        // Train loss curve (decaying)
        sctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        sctx.lineWidth = 1.2;
        sctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const x = (i / 100) * w;
          const y = -(0.9 * Math.exp(-i / 25) + 0.05 + (rand() - 0.5) * 0.02) * h;
          i === 0 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
        }
        sctx.stroke();
        // Val loss (slightly higher, overfitting)
        sctx.strokeStyle = 'rgba(6, 214, 160, 0.4)';
        sctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const x = (i / 100) * w;
          const y = -(0.9 * Math.exp(-i / 30) + 0.12 + Math.max(0, (i - 60) / 300) + (rand() - 0.5) * 0.03) * h;
          i === 0 ? sctx.moveTo(x, y) : sctx.lineTo(x, y);
        }
        sctx.stroke();
        sctx.font = (8 * scale) + 'px "JetBrains Mono", monospace';
        sctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
        sctx.fillText('train', w + 4, -h * 0.15);
        sctx.fillStyle = 'rgba(6, 214, 160, 0.4)';
        sctx.fillText('val', w + 4, -h * 0.35);
        sctx.restore();
      }

      drawLossCurve(W * 0.25, H * 0.68, 1);
      if (W > 800) drawLossCurve(W * 0.75, H * 0.88, 0.85);

      // --- Geometric: circles, arrows, flow diagrams ---
      // Transformer block diagram
      function drawTransformerBlock(ox, oy, scale) {
        sctx.save();
        sctx.translate(ox, oy);
        const bw = 80 * scale, bh = 24 * scale, gap = 32 * scale;
        const blocks = ['Multi-Head Attn', 'Add & Norm', 'FFN', 'Add & Norm'];
        sctx.font = (8 * scale) + 'px "JetBrains Mono", monospace';

        blocks.forEach((label, i) => {
          const y = i * gap;
          // Box
          sctx.strokeStyle = color;
          sctx.lineWidth = 0.8;
          sctx.strokeRect(-bw / 2, y, bw, bh);
          // Label
          sctx.fillStyle = color;
          sctx.textAlign = 'center';
          sctx.fillText(label, 0, y + bh * 0.65);
          // Arrow down
          if (i < blocks.length - 1) {
            sctx.beginPath();
            sctx.moveTo(0, y + bh);
            sctx.lineTo(0, y + gap);
            sctx.stroke();
            sctx.beginPath();
            sctx.moveTo(-3 * scale, y + gap - 4 * scale);
            sctx.lineTo(0, y + gap);
            sctx.lineTo(3 * scale, y + gap - 4 * scale);
            sctx.stroke();
          }
        });
        sctx.textAlign = 'left';
        sctx.restore();
      }

      drawTransformerBlock(W * 0.5, H * 0.05, 1);
      if (W > 1000 && H > 800) drawTransformerBlock(W * 0.12, H * 0.58, 0.85);

      // --- Scatter of Greek / ML symbols ---
      const symbols = ['θ', 'α', 'β', 'γ', 'η', 'λ', 'μ', 'σ', 'ε', 'δ', '∇', '∑', '∏', '∂', '∞', '≈', '⊗', '⊕', '∈', '∀'];
      for (let i = 0; i < 14; i++) {
        const x = rand() * W;
        const y = rand() * H;
        const s = symbols[Math.floor(rand() * symbols.length)];
        sctx.font = (12 + rand() * 16) + 'px "Times New Roman", serif';
        sctx.fillStyle = `rgba(140, 180, 220, ${0.08 + rand() * 0.12})`;
        sctx.fillText(s, x, y);
      }

      // --- Coordinate axes / graph grids ---
      function drawAxes(ox, oy, w, h, scale) {
        sctx.save();
        sctx.translate(ox, oy);
        sctx.strokeStyle = colorDim;
        sctx.lineWidth = 0.5;
        // Grid
        for (let i = 0; i <= 5; i++) {
          const gx = (i / 5) * w * scale;
          const gy = (i / 5) * h * scale;
          sctx.beginPath();
          sctx.moveTo(gx, 0); sctx.lineTo(gx, -h * scale);
          sctx.stroke();
          sctx.beginPath();
          sctx.moveTo(0, -gy); sctx.lineTo(w * scale, -gy);
          sctx.stroke();
        }
        // Axes lines
        sctx.strokeStyle = color;
        sctx.lineWidth = 1;
        sctx.beginPath();
        sctx.moveTo(0, 0); sctx.lineTo(w * scale, 0);
        sctx.moveTo(0, 0); sctx.lineTo(0, -h * scale);
        sctx.stroke();
        sctx.restore();
      }

      drawAxes(W * 0.42, H * 0.52, 80, 50, 1);

      // --- Data flow arrows ---
      function drawArrow(x1, y1, x2, y2) {
        sctx.beginPath();
        sctx.moveTo(x1, y1);
        sctx.lineTo(x2, y2);
        sctx.strokeStyle = colorDim;
        sctx.lineWidth = 0.8;
        sctx.stroke();
        const angle = Math.atan2(y2 - y1, x2 - x1);
        sctx.beginPath();
        sctx.moveTo(x2, y2);
        sctx.lineTo(x2 - 6 * Math.cos(angle - 0.4), y2 - 6 * Math.sin(angle - 0.4));
        sctx.moveTo(x2, y2);
        sctx.lineTo(x2 - 6 * Math.cos(angle + 0.4), y2 - 6 * Math.sin(angle + 0.4));
        sctx.stroke();
      }

      // A few scattered arrows suggesting data flow
      for (let i = 0; i < 6; i++) {
        const x = rand() * W * 0.8 + W * 0.1;
        const y = rand() * H * 0.8 + H * 0.1;
        const angle = rand() * Math.PI * 2;
        const len = 30 + rand() * 40;
        drawArrow(x, y, x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      }

      // --- Circles (representing convolution kernels / filters) ---
      for (let i = 0; i < 3; i++) {
        const cx = rand() * W;
        const cy = rand() * H;
        const r = 25 + rand() * 50;
        sctx.beginPath();
        sctx.arc(cx, cy, r, 0, Math.PI * 2);
        sctx.strokeStyle = `rgba(140, 180, 220, ${0.06 + rand() * 0.06})`;
        sctx.lineWidth = 0.6;
        sctx.stroke();
      }
    }

    renderScience();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderScience, 300);
    });
  })();

  // ===== Neural Network Background =====
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let mouse = { x: null, y: null };
  let nodes = [];
  let animRunning = true;
  let time = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNodes();
  }

  function initNodes() {
    nodes = [];
    const count = Math.min(45, Math.floor((canvas.width * canvas.height) / 28000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: 0,
        baseY: 0,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        type: Math.random() < 0.3 ? 'accent' : Math.random() < 0.5 ? 'cyan' : 'primary'
      });
      nodes[nodes.length - 1].baseX = nodes[nodes.length - 1].x;
      nodes[nodes.length - 1].baseY = nodes[nodes.length - 1].y;
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function getColor(type, alpha) {
    if (type === 'accent') return `rgba(6, 214, 160, ${alpha})`;
    if (type === 'cyan') return `rgba(34, 211, 238, ${alpha})`;
    return `rgba(59, 130, 246, ${alpha})`;
  }

  function animate() {
    if (!animRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.005;

    // Update & draw connections
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.pulse += n.pulseSpeed;
      n.x += n.vx + Math.sin(time + n.pulse) * 0.15;
      n.y += n.vy + Math.cos(time + n.pulse * 0.7) * 0.15;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.6;
          n.x += (dx / dist) * force;
          n.y += (dy / dist) * force;
        }
      }

      // Soft boundary
      if (n.x < -20) n.x = canvas.width + 20;
      if (n.x > canvas.width + 20) n.x = -20;
      if (n.y < -20) n.y = canvas.height + 20;
      if (n.y > canvas.height + 20) n.y = -20;

      // Draw connections
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x;
        const dy = n.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          const alpha = 0.06 * (1 - dist / 180);
          // Gradient line
          const grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y);
          grad.addColorStop(0, getColor(n.type, alpha));
          grad.addColorStop(1, getColor(m.type, alpha));
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.6;
          ctx.stroke();

          // Data pulse traveling along connection
          if (dist < 120 && Math.sin(time * 3 + i + j) > 0.7) {
            const t = (Math.sin(time * 2 + i) + 1) / 2;
            const px = n.x + (m.x - n.x) * t;
            const py = n.y + (m.y - n.y) * t;
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, Math.PI * 2);
            ctx.fillStyle = getColor(n.type, 0.4);
            ctx.fill();
          }
        }
      }

      // Draw node
      const pulseAlpha = 0.3 + Math.sin(n.pulse) * 0.15;
      const glowSize = n.radius + 4 + Math.sin(n.pulse) * 2;

      // Outer glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = getColor(n.type, 0.04);
      ctx.fill();

      // Inner node
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = getColor(n.type, pulseAlpha);
      ctx.fill();

      // Bright core
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = getColor(n.type, pulseAlpha + 0.2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      animRunning = false;
    } else {
      animRunning = true;
      animate();
    }
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // ===== Navbar =====
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  // ===== Active nav link on scroll =====
  const sections = document.querySelectorAll('section[id]');
  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active-link');
        } else {
          link.classList.remove('active-link');
        }
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);

  // ===== Typed Text Effect =====
  const phrases = [
    'AI/ML Researcher',
    'Software Engineer',
    'Machine Learning Enthusiast',
    'MRes Candidate @ Macquarie',
    'Building Responsible AI'
  ];
  const typedEl = document.getElementById('typedText');
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeWriter() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 35 : 65;

    if (!isDeleting && charIdx === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(typeWriter, delay);
  }
  typeWriter();

  // ===== Counter Animation =====
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1600;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(update);
    });
  }

  // ===== Scroll Reveal =====
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          if (entry.target.closest('.hero')) {
            animateCounters();
          }
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  const heroObserver = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) animateCounters(); },
    { threshold: 0.3 }
  );
  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  // ===== Smooth scroll for all anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ===== AI Chat Widget =====
  const knowledgeBase = {
    greeting: [
      "Imran Hossain Imon is a software engineer and AI/ML researcher based in Sydney, Australia. He's currently pursuing a Master of IT (AI) at Macquarie University, with a background in computer vision, NLP safety, and fintech systems. Feel free to ask me anything about his work!"
    ],
    skills: [
      "Imran is proficient in <strong>Python, Java, R, JavaScript, SQL</strong>, and works extensively with <strong>TensorFlow, Keras, PyTorch, scikit-learn, and Django</strong>. He's comfortable across the full data-science/ML toolchain including Jupyter, Streamlit, Pandas, and NumPy. On the infrastructure side, he works with <strong>Linux, Docker, GCP, AWS, and Git</strong>."
    ],
    projects: [
      "Imran has worked on several impactful projects:\n\n<strong>1. Fine-Grained Beverage Can Classification</strong> — Deep learning pipeline using MobileNetV2 and ResNet50, achieving 100% test accuracy.\n\n<strong>2. Smart Waste Management System</strong> — IoT-based system with ultrasonic sensors and GSM modules, 91% bin fill detection accuracy.\n\n<strong>3. FraudPredict</strong> — AI-powered card fraud detection analyzing spatial, temporal, and behavioral patterns.\n\n<strong>4. EEG Emotion Detection</strong> — CNN and GCN models classifying emotional states from brainwave data with 90% accuracy.\n\n<strong>5. BRACU Mongol-Tori</strong> — Mars rover prototype, 2nd Runner-up at URC 2020."
    ],
    education: [
      "Imran holds a <strong>B.Sc. in Computer Science & Engineering</strong> from BRAC University, Dhaka (CGPA 3.6/4.0, 2019–2023). He is currently pursuing a <strong>Master of Information Technology (AI)</strong> at Macquarie University, Sydney (WAM 74/100, July 2024–Present). His coursework covers Advanced Computer Vision, NLP, Data Science, and System Design."
    ],
    experience: [
      "Imran has industry experience at <strong>BRAC Bank PLC</strong> in the Technology Division:\n\n<strong>Software Engineer, Card Systems</strong> (Jan–Jun 2024) — Built ML-driven simulators for card transaction automation, maintained core payment systems, and deployed a QR-based feedback system.\n\n<strong>Core Banking System Intern</strong> (Jun–Sep 2023) — Prototyped an AI-powered fraud detection system and supported banking infrastructure.\n\nHe also served as a <strong>Teaching Assistant</strong> at BRAC University (2022), tutoring 250+ students in calculus and geometry."
    ],
    research: [
      "Imran has three active research projects:\n\n<strong>1. MMOR-Bench</strong> (Final Project, Macquarie) — A multilingual, multitask benchmark for evaluating LLM over-refusal and safety alignment across 6 datasets and multiple languages.\n\n<strong>2. Trustworthy Sepsis Prediction</strong> (Proposal, CQ Uni & UoW) — LLM-based clinical decision support for 12-hour early sepsis risk prediction with evidence grounding, uncertainty calibration, and governance audit.\n\n<strong>3. SafeMind</strong> (Proposal, Uni of Melbourne) — Co-designed multilingual benchmark for evaluating AI safety in mental health tools, addressing over-refusal and equity gaps across CALD communities."
    ],
    awards: [
      "Imran has earned notable international recognitions:\n\n<strong>2nd Runner-up — University Rover Challenge 2020</strong> — Among 36 international teams at the world's premier Mars rover competition. The team also placed 4th globally in URC 2021.\n\n<strong>Top 5 Finalist — Kibo Robot Programming Challenge 2021</strong> — Programmed the Astrobee robot aboard the ISS simulation for autonomous navigation and object recognition."
    ],
    contact: [
      "You can reach Imran at:\n\n<strong>Email:</strong> hossainimran.imzz@gmail.com\n<strong>Phone:</strong> +61 478 780 484\n<strong>GitHub:</strong> github.com/imranhossainimon\n<strong>LinkedIn:</strong> linkedin.com/in/imranhossainimon\n\nHe's based in Sydney, Australia and is open to research collaborations and opportunities."
    ],
    leadership: [
      "Imran is actively involved in the community:\n\n<strong>MARS (Macquarie Aerospace Rover Society)</strong> — Software member since July 2024, contributing to autonomous navigation and mission control for Mars rover prototypes.\n\n<strong>FYAT Peer Mentor at BRAC University</strong> (2021–2023) — Mentored 200+ first-year students, facilitated orientation programs, and provided academic guidance."
    ],
    fraud: [
      "Imran's <strong>FraudPredict</strong> project is an AI-driven card fraud detection system built with Python, Django, SQL, and ML/DL models. It analyzes spatial, temporal, and behavioral patterns in transaction data to identify anomalies, with real-time fraud flagging based on adaptive behavior modeling. He also built a prototype fraud detection system during his internship at BRAC Bank."
    ],
    rover: [
      "Imran was part of the <strong>BRACU Mongol-Tori</strong> Mars rover team (2019–2021). He worked on autonomous navigation algorithms, real-time control systems, and wireless communication protocols. The team achieved <strong>2nd Runner-up at URC 2020</strong> among 36 international teams and <strong>4th place globally in URC 2021</strong>."
    ],
    eeg: [
      "Imran built CNN and GCN models to classify emotional states (boredom, calmness, horror, excitement) from EEG brainwave signals. He used the DREAMER and GAMEMO datasets, applying <strong>FFT, Welch's method, and Hjorth parameters</strong> for feature extraction, achieving <strong>90% average classification accuracy</strong>."
    ],
    beverage: [
      "The Fine-Grained Beverage Can Classification project tackles distinguishing visually similar drink cans — a challenging real-world task for automated retail and smart vending. Imran compared <strong>MobileNetV2 and ResNet50</strong> with transfer learning, ran 8 ablation experiments across 4 configurations, and achieved <strong>100% test accuracy with ResNet50</strong> and <strong>98.1% with MobileNetV2</strong> after fine-tuning."
    ],
    mmor: [
      "Imran's <strong>MMOR-Bench</strong> is his final project at Macquarie University — a large-scale multilingual benchmark for evaluating LLM over-refusal and safety alignment. It integrates 6 safety datasets (AdvBench, HarmBench, OR-Bench, MedSafetyBench, CatQA, Do-Not-Answer) with a complete pipeline: dataset translation, preparation, evaluation, base prompt evaluation, and multitask response/query classification."
    ],
    sepsis: [
      "Imran's sepsis research proposes a <strong>Trustworthy LLM-Based Clinical Decision Support Framework</strong> for 12-hour early sepsis risk prediction. It uses MIMIC-IV data with a four-layer architecture: LightGBM + GRU-D predictive backbone, RAG-based explanation grounding in sepsis guidelines, uncertainty calibration with selective abstention, and governance-oriented audit logging. This is a research proposal for CQ University and University of Wollongong."
    ],
    safemind: [
      "Imran's <strong>SafeMind</strong> is a research proposal submitted to Prof. Roisin McNaney at the University of Melbourne. It proposes a co-designed, multilingual benchmark for evaluating AI safety in mental health tools across 6 languages and 8 crisis categories. It addresses over-refusal and harmful compliance in LLM-powered mental health chatbots, with a focus on equity for Australia's culturally and linguistically diverse (CALD) communities."
    ]
  };

  function findResponse(query) {
    const q = query.toLowerCase();
    const keywordMap = [
      { keys: ['skill', 'technolog', 'language', 'framework', 'tool', 'python', 'java', 'tensorflow', 'what can', 'tech stack', 'proficien'], topic: 'skills', weight: 3 },
      { keys: ['project', 'built', 'build', 'develop', 'portfolio', 'what have', 'show me'], topic: 'projects', weight: 3 },
      { keys: ['education', 'degree', 'university', 'study', 'stud', 'macquarie', 'brac uni', 'gpa', 'wam', 'academic', 'school', 'qualification'], topic: 'education', weight: 3 },
      { keys: ['experience', 'job', 'work experience', 'career', 'company', 'employ', 'brac bank', 'intern', 'software engineer', 'professional'], topic: 'experience', weight: 3 },
      { keys: ['research', 'interest', 'focus', 'area', 'nlp', 'computer vision'], topic: 'research', weight: 3 },
      { keys: ['mmor', 'overrefusal', 'over-refusal', 'safety benchmark', 'multilingual benchmark', 'final project'], topic: 'mmor', weight: 4 },
      { keys: ['sepsis', 'clinical decision', 'trustworthy', 'mimic', 'icu', 'wollongong', 'cq uni'], topic: 'sepsis', weight: 4 },
      { keys: ['safemind', 'safe mind', 'mental health', 'mcnaney', 'melbourne', 'cald', 'co-design'], topic: 'safemind', weight: 4 },
      { keys: ['award', 'honour', 'honor', 'achievement', 'recognition', 'urc', 'rover challenge', 'kibo', 'competition'], topic: 'awards', weight: 3 },
      { keys: ['contact', 'email', 'phone', 'reach', 'connect', 'linkedin', 'github', 'hire', 'available'], topic: 'contact', weight: 3 },
      { keys: ['leader', 'mentor', 'volunteer', 'community', 'extracurricular', 'mars society', 'teaching assistant', 'peer'], topic: 'leadership', weight: 3 },
      { keys: ['fraud', 'fraudpredict', 'card fraud', 'transaction', 'fintech'], topic: 'fraud', weight: 4 },
      { keys: ['rover', 'mongol', 'mars rover', 'autonomous nav'], topic: 'rover', weight: 4 },
      { keys: ['eeg', 'emotion detect', 'brainwave', 'brain signal', 'gcn'], topic: 'eeg', weight: 4 },
      { keys: ['beverage', 'can classif', 'fine-grained', 'mobilenet', 'resnet', 'drink', 'vending'], topic: 'beverage', weight: 4 },
      { keys: ['who is', 'who are', 'introduce', 'yourself', 'background', 'summary', 'overview'], topic: 'greeting', weight: 1 },
      { keys: ['hello', 'hi ', 'hey', 'sup', 'good morning', 'good evening'], topic: 'greeting', weight: 1 }
    ];

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of keywordMap) {
      let score = 0;
      for (const key of entry.keys) {
        if (q.includes(key)) score += (entry.weight || 1);
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry.topic;
      }
    }

    if (bestMatch && knowledgeBase[bestMatch]) {
      return knowledgeBase[bestMatch][0];
    }

    return "That's a great question! While I don't have a specific answer for that, I'd suggest exploring the sections below or reaching out to Imran directly at <strong>hossainimran.imzz@gmail.com</strong>. You can ask me about his <strong>skills, projects, education, experience, research, or awards</strong>.";
  }

  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatSuggestions = document.getElementById('chatSuggestions');

  function addMessage(text, isUser) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    if (isUser) {
      avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><circle cx="12" cy="7" r="4"/><path d="M5.5 21c0-3.5 2.9-6.5 6.5-6.5s6.5 3 6.5 6.5"/></svg>';
    } else {
      avatar.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4zM4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
    }

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (isUser) {
      bubble.textContent = text;
    } else {
      // Show typing indicator then reveal text
      bubble.innerHTML = '<span class="chat-typing"><span></span><span></span><span></span></span>';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      const delay = Math.min(600 + text.length * 3, 1800);
      setTimeout(() => {
        bubble.innerHTML = text.replace(/\n/g, '<br>');
        requestAnimationFrame(() => {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      }, delay);
    }
  }

  function handleChat(query) {
    if (!query.trim()) return;
    addMessage(query, true);
    chatInput.value = '';
    const response = findResponse(query);
    addMessage(response, false);
  }

  chatSend.addEventListener('click', () => handleChat(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleChat(chatInput.value);
  });

  document.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      handleChat(chip.dataset.q);
    });
  });

  // Initial greeting with typing effect
  setTimeout(() => {
    const initialBubble = document.getElementById('initialBubble');
    if (initialBubble) {
      initialBubble.innerHTML = knowledgeBase.greeting[0];
    }
  }, 1200);
});
