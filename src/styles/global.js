export function injectGlobalStyles() {
  if (document.getElementById("sb-global-styles")) return;

  const s = document.createElement("style");
  s.id = "sb-global-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Mono:wght@300;400&family=Syne:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink:       #0a0a0f;
      --surface:   #111118;
      --card:      #16161e;
      --border:    rgba(255,255,255,0.07);
      --gold:      #c9a84c;
      --gold-dim:  rgba(201,168,76,0.15);
      --gold-glow: rgba(201,168,76,0.08);
      --text:      #e8e6e0;
      --muted:     #7a7870;
      --success:   #4caf7d;
      --danger:    #e05c5c;
      --warning:   #d4965a;
    }

    html, body, #root {
      height: 100%;
      background: var(--ink);
      color: var(--text);
      font-family: 'Syne', sans-serif;
    }

    input, textarea, select {
      font-family: 'Syne', sans-serif;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 6px;
      padding: 11px 14px;
      width: 100%;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, select:focus {
      border-color: var(--gold);
      background: rgba(201,168,76,0.05);
    }
    input::placeholder { color: var(--muted); }

    button { cursor: pointer; font-family: 'Syne', sans-serif; border: none; outline: none; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--ink); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

    /* Animations */
    .fade-in  { animation: fadeIn  0.35s ease forwards; }
    .slide-up { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }

    @keyframes fadeIn  { from { opacity:0; transform:translateY(6px);  } to { opacity:1; transform:none; } }
    @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }

    /* Shimmer skeleton */
    .shimmer {
      background: linear-gradient(90deg, var(--card) 25%, rgba(255,255,255,0.04) 50%, var(--card) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 6px;
    }
    @keyframes shimmer { from { background-position:200% 0; } to { background-position:-200% 0; } }

    /* Toast */
    .toast { position:fixed; bottom:24px; right:24px; z-index:9999; animation: toastIn 0.3s ease; }
    @keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:none; } }

    /* Reusable primitives */
    .card  { background:var(--card); border:1px solid var(--border); border-radius:12px; }
    .mono  { font-family:'DM Mono', monospace; }
    .stat-number { font-family:'Cormorant Garamond',serif; font-size:42px; font-weight:300; color:var(--gold); line-height:1; }

    .badge {
      display:inline-block; padding:2px 8px; border-radius:20px;
      font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase;
    }
    .badge.success { background:rgba(76,175,125,0.15);  color:var(--success); }
    .badge.failed  { background:rgba(224,92,92,0.15);   color:var(--danger);  }
    .badge.pending { background:rgba(212,150,90,0.15);  color:var(--warning); }

    .btn {
      padding:10px 20px; border-radius:6px; font-size:13px; font-weight:600;
      letter-spacing:0.05em; text-transform:uppercase; transition:all 0.2s;
      display:inline-flex; align-items:center; gap:6px;
    }
    .btn-primary  { background:var(--gold); color:var(--ink); }
    .btn-primary:hover  { background:#d4af5a; box-shadow:0 0 20px rgba(201,168,76,0.3); }
    .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }

    .btn-secondary { background:transparent; border:1px solid var(--border); color:var(--text); }
    .btn-secondary:hover { border-color:var(--gold); color:var(--gold); }
    .btn-secondary:disabled { opacity:0.4; cursor:not-allowed; }

    .btn-danger { background:transparent; border:1px solid var(--danger); color:var(--danger); }
    .btn-danger:hover { background:rgba(224,92,92,0.1); }

    .btn-sm { padding:5px 12px; font-size:11px; }

    .tx-row { transition:background 0.15s; }
    .tx-row:hover { background:rgba(255,255,255,0.02); }

    .nav-item {
      display:flex; align-items:center; gap:10px; width:100%; padding:11px 12px;
      border-radius:8px; font-size:13px; text-align:left; transition:all 0.2s;
      background:transparent; color:var(--muted); border:1px solid transparent;
    }
    .nav-item.active {
      background:var(--gold-dim); color:var(--gold); border-color:rgba(201,168,76,0.2); font-weight:600;
    }
    .nav-item:hover:not(.active) { color:var(--text); background:rgba(255,255,255,0.03); }

    label.field-label {
      display:block; font-size:11px; color:var(--muted);
      text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px;
    }
  `;
  document.head.appendChild(s);
}
