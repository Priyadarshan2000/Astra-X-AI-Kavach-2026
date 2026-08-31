<?php
/** @var array $catalog */
/** @var string $baseUrl */
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ASTRA-X API Portal · Kavach 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Orbitron:wght@500;700&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #f4f7fb;
      --panel: #ffffff;
      --field: #f8fafc;
      --text: #16131c;
      --muted: #5a6478;
      --border: #dde4ee;
      --ink: #16131c;
      --cyan: #007ea8;
      --cyan-bright: #00b8d9;
      --violet: #6d28d9;
      --magenta: #db2777;
      --amber: #d97706;
      --emerald: #059669;
    }
    * { box-sizing: border-box; margin: 0; }
    body {
      font-family: "Space Grotesk", system-ui, sans-serif;
      background:
        radial-gradient(900px 500px at 10% -10%, rgb(0 184 217 / 0.12), transparent 55%),
        radial-gradient(700px 400px at 100% 0%, rgb(109 40 217 / 0.08), transparent 50%),
        var(--bg);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.5;
    }
    .grid-bg {
      position: fixed; inset: 0; pointer-events: none; opacity: 0.5;
      background-image: linear-gradient(rgb(0 126 168 / 0.07) 1px, transparent 1px),
        linear-gradient(90deg, rgb(0 126 168 / 0.07) 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .wrap { position: relative; max-width: 1080px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    .ribbon { display: flex; height: 4px; margin-bottom: 1.5rem; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 3px rgb(0 0 0 / 0.08); }
    .ribbon span { flex: 1; }
    .ribbon span:nth-child(1) { background: #ff9933; }
    .ribbon span:nth-child(2) { background: #fff; }
    .ribbon span:nth-child(3) { background: #138808; }
    header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1.5rem; margin-bottom: 2rem; }
    .logo {
      display: flex; align-items: center; gap: 0.75rem;
    }
    .logo-icon {
      width: 48px; height: 48px; display: grid; place-items: center;
      background: var(--cyan-bright); color: var(--ink); border: 2.5px solid var(--ink);
      border-radius: 10px; box-shadow: 4px 4px 0 var(--magenta);
      font-family: Orbitron, sans-serif; font-weight: 700; font-size: 0.65rem;
    }
    h1 {
      font-family: Orbitron, sans-serif; font-size: 1.35rem; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--text);
    }
    .kicker {
      font-family: Orbitron, sans-serif; font-size: 0.62rem; letter-spacing: 0.22em;
      color: var(--cyan); text-transform: uppercase; margin-bottom: 0.35rem;
    }
    .sub { color: var(--muted); font-size: 0.95rem; max-width: 36rem; margin-top: 0.5rem; }
    .status-pill {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.45rem 0.85rem; border-radius: 999px;
      border: 2px solid var(--ink); background: var(--panel);
      font-family: Orbitron, sans-serif; font-size: 0.65rem; letter-spacing: 0.12em;
      color: var(--text);
      box-shadow: 3px 3px 0 var(--violet);
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); animation: pulse 2s infinite; }
    .dot.ready { background: var(--emerald); }
    .dot.degraded { background: var(--amber); }
    .dot.offline { background: var(--magenta); }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .card {
      background: var(--panel); border: 2.5px solid var(--border);
      border-radius: 14px; padding: 1rem 1.1rem;
      box-shadow: 5px 5px 0 rgb(109 40 217 / 0.15);
    }
    .card-label {
      font-family: Orbitron, sans-serif; font-size: 0.58rem; letter-spacing: 0.18em;
      color: var(--muted); text-transform: uppercase;
    }
    .card-val { font-family: Orbitron, sans-serif; font-size: 1.1rem; margin-top: 0.35rem; color: var(--cyan); }
    .card-val.mono { font-family: ui-monospace, monospace; font-size: 0.8rem; word-break: break-all; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-bottom: 2.5rem; }
    .btn {
      display: inline-flex; align-items: center; gap: 0.4rem;
      padding: 0.65rem 1.1rem; border-radius: 10px;
      border: 2.5px solid var(--ink); font-family: Orbitron, sans-serif;
      font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase;
      text-decoration: none; color: var(--ink); transition: transform 0.15s;
    }
    .btn:hover { transform: translate(-2px, -2px); }
    .btn-primary { background: var(--cyan-bright); box-shadow: 4px 4px 0 var(--magenta); }
    .btn-ghost { background: var(--panel); color: var(--text); box-shadow: 4px 4px 0 rgb(109 40 217 / 0.25); }
    .section-title {
      font-family: Orbitron, sans-serif; font-size: 0.72rem; letter-spacing: 0.2em;
      color: var(--amber); text-transform: uppercase; margin-bottom: 1rem;
    }
    .endpoint {
      display: grid; grid-template-columns: auto 1fr auto; gap: 0.85rem; align-items: start;
      padding: 1rem 1.1rem; margin-bottom: 0.65rem;
      background: var(--panel); border: 2px solid var(--border);
      border-radius: 12px; transition: border-color 0.2s, box-shadow 0.2s;
    }
    .endpoint:hover { border-color: var(--cyan-bright); box-shadow: 0 2px 12px rgb(0 184 217 / 0.12); }
    .method {
      font-family: Orbitron, sans-serif; font-size: 0.58rem; letter-spacing: 0.1em;
      padding: 0.3rem 0.55rem; border-radius: 6px; border: 2px solid var(--ink);
      min-width: 3.2rem; text-align: center;
    }
    .method-get { background: #6ee7b7; color: var(--ink); }
    .method-post { background: #fcd34d; color: var(--ink); }
    .path { font-family: ui-monospace, monospace; font-size: 0.88rem; color: var(--cyan); font-weight: 600; }
    .desc { font-size: 0.85rem; color: var(--muted); margin-top: 0.25rem; grid-column: 2; }
    .badges { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.4rem; grid-column: 2; }
    .badge {
      font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase;
      padding: 0.15rem 0.45rem; border-radius: 4px;
      border: 1px solid var(--border); color: var(--muted); background: var(--field);
    }
    .badge-jwt { border-color: rgb(109 40 217 / 0.35); color: var(--violet); background: rgb(109 40 217 / 0.06); }
    .try-link {
      font-family: Orbitron, sans-serif; font-size: 0.55rem; letter-spacing: 0.12em;
      color: var(--cyan); text-decoration: none; text-transform: uppercase;
      padding: 0.35rem 0.6rem; border: 1.5px solid var(--cyan); border-radius: 6px;
    }
    .try-link:hover { background: rgb(0 126 168 / 0.08); }
    .curl-box {
      margin-top: 2rem; padding: 1.25rem; background: var(--field);
      border: 2.5px solid var(--ink); border-radius: 14px;
      box-shadow: 5px 5px 0 var(--cyan-bright);
    }
    .curl-box pre {
      font-family: ui-monospace, monospace; font-size: 0.78rem; line-height: 1.6;
      color: var(--text); overflow-x: auto; white-space: pre-wrap; word-break: break-all;
    }
    footer {
      margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border);
      font-size: 0.8rem; color: var(--muted); text-align: center;
    }
    footer a { color: var(--cyan); }
    @media (max-width: 640px) {
      .endpoint { grid-template-columns: 1fr; }
      .try-link { grid-column: 1; justify-self: start; }
    }
  </style>
</head>
<body>
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="wrap">
    <div class="ribbon" aria-hidden="true"><span></span><span></span><span></span></div>

    <header>
      <div>
        <div class="logo">
          <div class="logo-icon">AX</div>
          <div>
            <p class="kicker">Kavach 2026 · Indian Army Cyber</p>
            <h1>ASTRA-X API Portal</h1>
          </div>
        </div>
        <p class="sub"><?= htmlspecialchars($catalog['tagline']) ?></p>
      </div>
      <div class="status-pill" id="status-pill">
        <span class="dot" id="status-dot"></span>
        <span id="status-text">Checking uplink…</span>
      </div>
    </header>

    <div class="cards">
      <div class="card">
        <p class="card-label">Version</p>
        <p class="card-val"><?= htmlspecialchars($catalog['version']) ?></p>
      </div>
      <div class="card">
        <p class="card-label">Base URL</p>
        <p class="card-val mono"><?= htmlspecialchars($baseUrl) ?></p>
      </div>
      <div class="card">
        <p class="card-label">Demo operator</p>
        <p class="card-val mono" style="font-size:0.72rem"><?= htmlspecialchars($catalog['demo']['email']) ?></p>
      </div>
      <div class="card">
        <p class="card-label">JSON schema</p>
        <p class="card-val mono"><a href="?format=json" style="color:inherit">?format=json</a></p>
      </div>
    </div>

    <div class="actions">
      <a class="btn btn-primary" href="<?= htmlspecialchars($catalog['frontend']) ?>" target="_blank" rel="noopener">Open Command Deck</a>
      <a class="btn btn-ghost" href="health.php">Health Check</a>
      <a class="btn btn-ghost" href="<?= htmlspecialchars($catalog['github']) ?>" target="_blank" rel="noopener">GitHub + Postman</a>
      <a class="btn btn-ghost" href="?format=json">Raw JSON</a>
    </div>

    <?php foreach ($catalog['groups'] as $group): ?>
      <p class="section-title"><?= htmlspecialchars($group['title']) ?></p>
      <?php foreach ($group['items'] as $item): ?>
        <article class="endpoint">
          <span class="method method-<?= strtolower($item['method']) ?>"><?= htmlspecialchars($item['method']) ?></span>
          <div>
            <div class="path"><?= htmlspecialchars($item['path']) ?></div>
            <p class="desc"><?= htmlspecialchars($item['desc']) ?></p>
            <div class="badges">
              <?php if ($item['auth']): ?><span class="badge badge-jwt">JWT</span><?php endif; ?>
              <span class="badge"><?= $item['method'] === 'GET' ? 'Idempotent' : 'JSON body' ?></span>
            </div>
          </div>
          <?php if (!empty($item['try'])): ?>
            <a class="try-link" href="<?= htmlspecialchars($item['path']) ?>">Try →</a>
          <?php endif; ?>
        </article>
      <?php endforeach; ?>
    <?php endforeach; ?>

    <div class="curl-box">
      <p class="card-label" style="margin-bottom:0.75rem">Quick smoke test</p>
      <pre id="curl-sample">curl -s <?= htmlspecialchars($baseUrl) ?>/health.php</pre>
    </div>

    <footer>
      <p>ASTRA-X · Autonomous Security Tactical Reasoning Agent</p>
      <p style="margin-top:0.35rem">Defensive hold only · Lab sandbox · No live targeting</p>
      <p style="margin-top:0.5rem"><a href="<?= htmlspecialchars($catalog['frontend']) ?>">Frontend</a> · <a href="health.php">Health</a> · <a href="?format=json">JSON</a></p>
    </footer>
  </div>

  <script>
    (async () => {
      const dot = document.getElementById('status-dot');
      const text = document.getElementById('status-text');
      try {
        const res = await fetch('health.php');
        const data = await res.json();
        if (data.status === 'ready') {
          dot.classList.add('ready');
          text.textContent = 'API READY · MySQL linked';
        } else {
          dot.classList.add('degraded');
          text.textContent = 'API DEGRADED · Check health';
        }
      } catch {
        dot.classList.add('offline');
        text.textContent = 'UPLINK OFFLINE';
      }
    })();
  </script>
</body>
</html>
