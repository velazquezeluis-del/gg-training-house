import { useState, useEffect, useRef } from "react";
// GG Training House - San Juan 2665, Quilmes Oeste
const DRIVE_FOLDER_ID = "1wih6SGj2tZ9pTQJZzg19KjAR9w-5cgpv";
// TODO (una sola vez): reemplazar por el Client ID real de Google Cloud Console.
// Pasos: console.cloud.google.com -> crear proyecto -> habilitar "Google Drive API" y
// "Google Sheets API" -> Pantalla de consentimiento OAuth -> Credenciales -> Crear
// credencial -> ID de cliente de OAuth -> Aplicación web -> agregar el dominio de
// Netlify (https://tu-app.netlify.app) en "Orígenes autorizados de JavaScript".
const GOOGLE_CLIENT_ID = "979691772186-qgrn7dh0v49t5bq1it0u690gcr9pahs3.apps.googleusercontent.com";
function driveFilesListUrl(){
  const q = `'${DRIVE_FOLDER_ID}' in parents and (mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') and trashed=false`;
  return `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,modifiedTime,mimeType)&pageSize=200&supportsAllDrives=true&includeItemsFromAllDrives=true`;
}
const GYM_LAT = -34.730867;
const GYM_LNG = -58.292175;
const GYM_RADIUS_M = 150;

// Supabase config
const SUPA_URL = "https://xhyvwfbalacozhkpegnk.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoeXZ3ZmJhbGFjb3poa3BlZ25rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0Njg5OTcsImV4cCI6MjA5OTA0NDk5N30.eq1JCQqmplbRU4hQq_xK92-o0UjXi-bjcLYqEQwCmhs";
const supa = (path, opts={}) => fetch(`${SUPA_URL}/rest/v1/${path}`, {
  headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation", ...opts.headers },
  ...opts
}).then(r => r.ok ? r.json() : r.text().then(t => { console.error(t); return null; }));

function GGApp() {
  useEffect(()=>{
    // Needed so iOS Safari actually applies :active styles on tap
    const noop = ()=>{};
    document.addEventListener('touchstart', noop, {passive:true});
    return ()=>document.removeEventListener('touchstart', noop);
  },[]);
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,600;0,700;0,800;1,600&family=Barlow:wght@400;500;600&display=swap'); *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
 button{-webkit-tap-highlight-color:transparent;transition:transform .05s ease,filter .05s ease,opacity .05s ease}
 button:active:not(:disabled){transform:scale(0.92);filter:brightness(0.85)}
 .tap-effect{-webkit-tap-highlight-color:transparent;transition:transform .05s ease,filter .05s ease,opacity .05s ease}
 .tap-effect:active{transform:scale(0.92);filter:brightness(0.82)}
 :root{ --bg:#0d0d0d;--surface:#161616;--surface2:#1f1f1f;--surface3:#282828; --border:#2a2a2a;--gold:#f5c518;--gold2:#e8b800;--gold-dim:rgba(245,197,24,0.12); --red:#e03e3e;--green:#3ecf8e;--teal:#3ecfcf;--purple:#a78bfa; --text:#f0f0f0;--text2:#aaa;--text3:#666; --radius:12px;--font-display:'Barlow Condensed',sans-serif;--font-body:'Barlow',sans-serif; }
 html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font-body)}
 .app-shell{min-height:100dvh;display:flex;flex-direction:column;max-width:480px;margin:0 auto;background:var(--bg)}
 .app-nav{display:flex;background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50}
 .nav-btn{flex:1;padding:14px 8px;background:none;border:none;color:var(--text3);font-family:var(--font-display);font-size:15px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;transition:color .2s;border-bottom:2px solid transparent;display:flex;align-items:center;justify-content:center;gap:6px}
 .nav-btn.active{color:var(--gold);border-bottom-color:var(--gold)}
 .nav-btn:hover:not(.active){color:var(--text2)}
 .member-view{padding:0 0 80px}
 .member-view--training{background:var(--bg)}
 .member-hero{background:linear-gradient(180deg,#1a1500 0%,#0f0f0f 100%);padding:28px 24px 20px;text-align:center;border-bottom:1px solid var(--border);position:relative;overflow:hidden}
 .member-hero::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,197,24,0.03) 18px,rgba(245,197,24,0.03) 19px)}
 .member-hero--active{background:radial-gradient(ellipse at 50% 0%, #0a1628 0%, #060d1a 55%, #0d0d0d 100%);padding:18px 24px 16px;border-bottom:2px solid #3a7bd5;animation:fadeInContent .45s ease both}
 .member-hero--active::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(58,123,213,0.08) 18px,rgba(58,123,213,0.08) 19px);pointer-events:none;z-index:0}
 .hero-active-avatar{width:52px;height:52px;border-radius:50%;border:2px solid #3a7bd5;overflow:hidden;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;background:rgba(10,22,40,0.8);color:#7ab3f0;position:relative;z-index:1;box-shadow:0 0 20px rgba(58,123,213,0.4)}
 .hero-active-photo{width:100%;height:100%;object-fit:cover}
 .hero-active-name{font-family:var(--font-display);font-size:22px;font-weight:700;color:#7ab3f0;letter-spacing:.5px;position:relative;z-index:1}
 .hero-active-tag{font-size:12px;color:var(--text3);letter-spacing:1px;text-transform:uppercase;margin-top:3px;position:relative;z-index:1}
 .login-fade-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:500;animation:loginFade .4s ease forwards}
 @keyframes loginFade{0%{opacity:0} 40%{opacity:1} 100%{opacity:0}}
 @keyframes fadeInContent{from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)}}
 .hero-logo{max-width:220px;width:60%;height:auto;display:block;margin:0 auto 8px;filter:drop-shadow(0 4px 20px rgba(180,130,30,0.5))}
 .hero-sub{font-size:13px;color:var(--text3);letter-spacing:2px;text-transform:uppercase;font-weight:600;position:relative}
 .info-panel{padding:12px 16px 6px;display:flex;flex-direction:column;gap:10px}
 .info-novedad{background:linear-gradient(135deg,rgba(245,197,24,0.1) 0%,rgba(245,197,24,0.04) 100%);border:1px solid rgba(245,197,24,0.35);border-left:3px solid var(--gold);border-radius:10px;padding:12px 14px}
 .info-horario{background:rgba(255,255,255,0.03);border:1px solid var(--border);border-left:3px solid var(--text3);border-radius:10px;padding:12px 14px}
 .info-tag{font-size:11px;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;font-weight:700;display:block;margin-bottom:6px}
 .info-horario .info-tag{color:var(--text3)}
 .info-text{font-size:13px;color:var(--text);line-height:1.6;margin:0;white-space:pre-wrap}
 .member-list{overflow-y:auto;max-height:calc(100vh - 340px);padding:8px 0 16px}
 .member-list-item{width:100%;display:flex;align-items:center;gap:12px;padding:11px 20px;background:none;border:none;border-bottom:1px solid var(--border);cursor:pointer;text-align:left;transition:background .15s;color:var(--text)}
 .member-list-item:active{background:rgba(245,197,24,0.06)}
 .ml-avatar{position:relative;width:44px;height:44px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
 .ml-photo{width:100%;height:100%;object-fit:cover;border-radius:50%}
 .ml-done-badge{position:absolute;bottom:-1px;right:-1px;width:16px;height:16px;border-radius:50%;background:var(--green);color:#fff;font-size:9px;display:flex;align-items:center;justify-content:center;font-weight:700;border:1.5px solid #0f0f0f}
 .ml-info{flex:1;min-width:0}
 .ml-name{display:block;font-size:15px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .ml-routine{display:block;font-size:11px;color:var(--text3);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .ml-arrow{font-size:22px;color:var(--text3);line-height:1}
 .member-list-add{width:100%;display:flex;align-items:center;gap:12px;padding:14px 20px;background:none;border:none;border-top:1px dashed var(--border);cursor:pointer;text-align:left;color:var(--gold)}
 .ml-add-icon{width:44px;height:44px;border-radius:50%;border:2px dashed var(--gold);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:300;flex-shrink:0}
 .ml-add-txt{font-size:14px;font-weight:600;letter-spacing:.3px}
 .login-card{margin:20px 20px 0;background:var(--surface2);border:1px solid var(--border);border-radius:16px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;gap:12px}
 .login-avatar{width:72px;height:72px;border-radius:50%;background:var(--gold-dim);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;color:var(--gold);overflow:hidden}
 .login-name{font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px}
 .login-title{font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--text);margin-bottom:4px;align-self:flex-start}
 .login-input{width:100%;padding:12px 14px;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;color:var(--text);font-size:15px;outline:none;box-sizing:border-box}
 .pw-wrap{position:relative;width:100%}
 .pw-wrap .login-input{padding-right:44px}
 .pw-eye{position:absolute;top:0;right:0;height:100%;width:44px;background:none;border:none;color:var(--text3);cursor:pointer;display:flex;align-items:center;justify-content:center}
 .login-input:focus{border-color:var(--gold)}
 .login-error{color:#ff5c5c;font-size:12px;margin:0;text-align:center}
 .login-btn{width:100%;padding:13px;background:var(--gold);color:#0f0f0f;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:.5px}
 .login-cancel{background:none;border:none;color:var(--text3);font-size:13px;cursor:pointer;padding:0}

 .search-box:focus-within{border-color:var(--gold)}

 .search-input::placeholder{color:var(--text3)}

 .autocomplete-item:last-child{border-bottom:none}
 .autocomplete-item:hover{background:var(--surface2)}

 .routine-card{margin:20px 20px 0;background:var(--surface);border-radius:16px;border:1px solid var(--border);overflow:hidden;animation:slideUp .3s ease}
 @keyframes slideUp{from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)}}
 .routine-header{padding:20px;background:var(--surface2);border-bottom:1px solid var(--border)}
 .back-btn{background:none;border:none;color:var(--gold);font-size:13px;font-weight:600;padding:0 0 12px;cursor:pointer;display:block;letter-spacing:.5px}
 .exit-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:999px;background:linear-gradient(135deg,rgba(245,197,24,0.16),rgba(245,197,24,0.05));border:1px solid rgba(245,197,24,0.4);color:var(--gold);font-family:var(--font-body);font-weight:700;font-size:14px;cursor:pointer;transition:all .2s}
 .exit-btn:hover{background:linear-gradient(135deg,rgba(245,197,24,0.26),rgba(245,197,24,0.1));border-color:var(--gold)}

 .day-tabs{display:flex;overflow-x:auto;border-bottom:1px solid var(--border);scrollbar-width:none}
 .day-tabs::-webkit-scrollbar{display:none}
 .day-tab{flex-shrink:0;padding:12px 18px;background:none;border:none;border-bottom:2px solid transparent;color:var(--text3);font-family:var(--font-display);font-size:14px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;transition:all .15s;white-space:nowrap}
 .day-tab.active{color:var(--gold);border-bottom-color:var(--gold)}
 .day-tab:hover:not(.active){color:var(--text2)}
 .day-tab.tab-done{color:var(--green)}
 .day-tab.tab-done.active{border-bottom-color:var(--green)}
 .day-complete-banner{margin:12px 12px 0;padding:12px 16px;background:rgba(62,207,142,0.12);border:1px solid var(--green);border-radius:10px;color:var(--green);font-weight:600;font-size:14px;text-align:center;animation:slideUp .3s ease}
 .blocks-list{padding:12px;display:flex;flex-direction:column;gap:12px}
 .member-block{border-radius:12px;border:1px solid var(--border);overflow:hidden;transition:border-color .3s}
 .member-block.warmup-block{border-color:rgba(167,139,250,0.3);background:rgba(167,139,250,0.04)}
 .member-block.block-done{border-color:rgba(62,207,142,0.35)}
 .member-block.ex-locked{opacity:.35;filter:brightness(0.6)}
 .member-block-header{display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--surface2);border-bottom:1px solid var(--border)}
 .warmup-block .member-block-header{background:rgba(167,139,250,0.08)}
 .member-block-icon{display:flex;color:var(--text3);flex-shrink:0}
 .warmup-block .member-block-icon{color:var(--purple)}
 .member-block-name{font-family:var(--font-display);font-size:15px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;flex:1;color:var(--text2)}
 .warmup-block .member-block-name{color:var(--purple)}
 .combo-badge{padding:2px 8px;border-radius:20px;background:rgba(245,197,24,0.12);color:var(--gold);font-size:10px;font-weight:700;letter-spacing:1px;flex-shrink:0}
 .block-done-badge{color:var(--green);font-size:14px;font-weight:700}
 .exercises-list{padding:8px;display:flex;flex-direction:column;gap:6px}
 .exercise-item{display:flex;gap:12px;align-items:flex-start;padding:12px;background:var(--surface2);border-radius:10px;border:1px solid var(--border);transition:all .3s}
 .exercise-item.combo-ex{border-left:2px solid var(--gold);border-radius:8px}
 .warmup-block .exercise-item.combo-ex{border-left-color:var(--purple)}
 .exercise-item.ex-completed{background:rgba(62,207,142,0.06);border-color:rgba(62,207,142,0.3)}
 .exercise-item.ex-locked{opacity:.45;filter:grayscale(0.3)}
 .ex-check-btn{width:32px;height:32px;border-radius:50%;border:2px solid var(--border);background:var(--surface3);color:var(--text3);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;transition:all .2s;padding:0}
 .ex-check-btn:disabled{cursor:not-allowed}
 .ex-check-btn:not(:disabled):hover{border-color:var(--gold);color:var(--gold)}
 .ex-check-btn.checked{background:var(--green);border-color:var(--green);color:#000}
 .ex-num-inner{font-family:var(--font-display);font-size:14px;font-weight:700}
 .ex-lock-msg{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--text3);margin-top:4px}
 .ex-name{font-weight:600;font-size:15px;margin-bottom:6px}
 .ex-meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
 .ex-pill{padding:3px 9px;border-radius:20px;background:var(--surface3);color:var(--text2);font-size:12px;font-weight:500;display:flex;align-items:center;gap:4px}
 .ex-pill.time-pill{background:rgba(62,207,207,0.1);color:var(--teal)}
 .ex-notes{margin-top:6px;font-size:12px;color:var(--text3);font-style:italic}
 .timer-wrap{display:flex;align-items:center;gap:14px;margin-top:12px;padding:12px;background:var(--surface3);border-radius:10px;border:1px solid var(--border)}
 .timer-wrap.timer-done{background:rgba(62,207,142,0.08);border-color:rgba(62,207,142,0.4)}
 .timer-ring-wrap{position:relative;width:72px;height:72px;flex-shrink:0}
 .timer-text{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:16px;font-weight:700;letter-spacing:.5px}
 .timer-controls{display:flex;flex-direction:column;gap:8px}
 .timer-btn{padding:9px 14px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;min-width:44px}
 .timer-btn:hover:not(:disabled){background:var(--gold);border-color:var(--gold);color:#000}
 .timer-btn:disabled{opacity:.4;cursor:not-allowed}
 .timer-btn.secondary{background:none;color:var(--text3)}
 .timer-btn.secondary:hover{background:var(--surface2);color:var(--text)}
 .no-routine{padding:40px 20px;text-align:center;color:var(--text3);display:flex;flex-direction:column;align-items:center;gap:12px}

 .photo-upload-btn{position:relative;width:44px;height:44px;border-radius:50%;cursor:pointer;flex-shrink:0;overflow:hidden;background:var(--surface2);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;transition:border-color .2s}
 .photo-upload-btn:hover{border-color:var(--gold)}
 .photo-upload-btn:hover .photo-overlay{opacity:1}
 .uc-photo-img{width:100%;height:100%;object-fit:cover}
 .uc-photo-icon{color:var(--text3);display:flex}
 .photo-overlay{position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;color:var(--gold);opacity:0;transition:opacity .2s;font-size:12px}
 .rest-overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;z-index:300;backdrop-filter:blur(4px);animation:fadeIn .25s ease}
 @keyframes fadeIn{from{opacity:0} to{opacity:1}}
 .rest-box{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:36px 32px;max-width:300px;width:90%;text-align:center;animation:popIn .3s cubic-bezier(.34,1.56,.64,1)}
 @keyframes popIn{from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)}}
 .rest-label{font-family:var(--font-display);font-size:13px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--text3);margin-bottom:20px}
 .rest-ring-wrap{position:relative;width:130px;height:130px;margin:0 auto 20px}
 .rest-countdown{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:38px;font-weight:800;letter-spacing:1px}
 .rest-sub{font-size:13px;color:var(--text3);margin-bottom:24px;line-height:1.5}
 .rest-skip{background:none;border:1px solid var(--border);color:var(--text2);border-radius:8px;padding:10px 20px;font-family:var(--font-body);font-size:14px;cursor:pointer;transition:all .15s}
 .rest-skip:hover{background:var(--surface2);color:var(--text)}
 .coach-view{display:flex;flex-direction:column;min-height:calc(100vh - 49px)}
 .coach-header{padding:16px 20px 0;background:var(--surface);border-bottom:1px solid var(--border)}
 .coach-brand{display:flex;align-items:center;gap:8px;font-family:var(--font-display);font-size:13px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:12px}
 .brand-dot{width:8px;height:8px;border-radius:50%;background:var(--gold);box-shadow:0 0 8px var(--gold)}
 .coach-tabs{display:flex}
 .ctab{flex:1;padding:12px;background:none;border:none;border-bottom:2px solid transparent;color:var(--text3);font-family:var(--font-display);font-size:16px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .15s}
 .ctab.active{color:var(--gold);border-bottom-color:var(--gold)}
 .ctab:hover:not(.active){color:var(--text2)}
 .tab-content{padding:20px;flex:1}
 .tab-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
 .tab-topbar h2{font-family:var(--font-display);font-size:26px;font-weight:700;display:flex;align-items:center;gap:10px}
 .count-badge{background:var(--gold-dim);color:var(--gold);padding:2px 10px;border-radius:20px;font-size:16px}
 .btn-primary{display:flex;align-items:center;gap:6px;padding:10px 16px;border-radius:8px;background:var(--gold);color:#000;border:none;font-family:var(--font-display);font-size:14px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;transition:background .15s}
 .btn-primary:hover{background:var(--gold2)}
 .btn-primary.sm{padding:8px 14px;font-size:13px}
 .btn-save{display:flex;align-items:center;gap:6px;padding:12px 24px;border-radius:8px;background:var(--gold);color:#000;border:none;font-family:var(--font-display);font-size:16px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;cursor:pointer}
 .btn-ghost{padding:10px 16px;border-radius:8px;background:none;border:1px solid var(--border);color:var(--text2);font-family:var(--font-body);font-size:14px;cursor:pointer;transition:all .15s}
 .btn-sync{display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:linear-gradient(135deg,rgba(245,197,24,0.12),rgba(245,197,24,0.04));border:1px solid rgba(245,197,24,0.35);color:var(--gold);font-family:var(--font-body);font-size:12.5px;font-weight:600;cursor:pointer;transition:all .2s}
 .btn-sync:hover:not(:disabled){background:linear-gradient(135deg,rgba(245,197,24,0.2),rgba(245,197,24,0.08));border-color:var(--gold)}
 .btn-sync:disabled{opacity:.7;cursor:default}
 .btn-sync .sync-icon{display:flex;transition:transform .2s}
 .btn-sync.spinning .sync-icon{animation:syncSpin 1s linear infinite}
 .spin-icon{animation:syncSpin 1s linear infinite}
 @keyframes syncSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
 .btn-ghost:hover{background:var(--surface2)}
 .btn-ghost.sm{padding:8px 12px;font-size:13px}
 .btn-icon{padding:8px;border-radius:8px;background:var(--surface3);border:1px solid var(--border);color:var(--text2);cursor:pointer;display:flex;transition:all .15s}
 .btn-icon:hover{background:var(--surface2);color:var(--text)}
 .btn-icon.danger:hover{background:rgba(224,62,62,.15);color:var(--red);border-color:var(--red)}
 .btn-icon.sm{padding:5px}
 .btn-danger{padding:10px 16px;border-radius:8px;background:var(--red);color:#fff;border:none;font-family:var(--font-body);font-size:14px;font-weight:600;cursor:pointer}
 .btn-toggle{padding:8px;border-radius:8px;cursor:pointer;display:flex;border:1px solid;transition:all .2s}
 .btn-toggle.on{background:rgba(62,207,142,.12);border-color:var(--green);color:var(--green)}
 .btn-toggle.off{background:rgba(224,62,62,.1);border-color:var(--red);color:var(--red)}
 .users-grid{display:flex;flex-direction:column;gap:10px}
 .user-card{background:var(--surface);border-radius:12px;border:1px solid var(--border);overflow:hidden}
 .user-card.inactive{opacity:.65}
 .uc-top{display:flex;align-items:center;gap:12px;padding:14px}
 .uc-info{flex:1;min-width:0}
 .uc-name{font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .uc-status{font-size:12px;margin-top:2px;font-weight:500}
 .uc-status.on{color:var(--green)}
 .uc-status.off{color:var(--red)}
 .uc-actions{display:flex;gap:8px}
 .uc-routine{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--surface2);border-top:1px solid var(--border)}
 .uc-rlabel{font-size:12px;color:var(--text3);white-space:nowrap}
 .uc-rselect{flex:1;background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:6px 10px;font-size:13px;font-family:var(--font-body);outline:none}
 .uc-rselect:focus{border-color:var(--gold)}
 .new-user-form{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:16px;display:flex;flex-direction:column;gap:10px;animation:slideUp .2s ease}
 .nu-input,.nu-select{background:var(--surface2);border:1.5px solid var(--border);color:var(--text);border-radius:8px;padding:10px 14px;font-size:15px;font-family:var(--font-body);outline:none}
 .nu-input:focus,.nu-select:focus{border-color:var(--gold)}
 .nu-actions{display:flex;gap:8px}
 .routines-list{display:flex;flex-direction:column;gap:8px}
 .routine-row{background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:16px;display:flex;align-items:center;gap:12px}
 .rr-info{flex:1}
 .rr-name{font-weight:600;font-size:16px;margin-bottom:4px}
 .rr-meta{font-size:12px;color:var(--text3);display:flex;gap:6px;align-items:center;flex-wrap:wrap}
 .rr-actions{display:flex;gap:8px}
 .routine-editor{padding:20px;flex:1;overflow-y:auto;background:var(--bg);animation:slideUp .2s ease}
 .re-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
 .re-header h2{font-family:var(--font-display);font-size:24px;font-weight:700}
 .re-name-input{width:100%;background:var(--surface);border:1.5px solid var(--border);color:var(--text);border-radius:8px;padding:12px 14px;font-size:16px;font-family:var(--font-display);font-weight:600;outline:none;margin-bottom:16px}
 .re-name-input:focus{border-color:var(--gold)}
 .validation-toast{margin-bottom:14px;padding:11px 16px;background:rgba(224,62,62,0.12);border:1px solid rgba(224,62,62,0.4);border-radius:10px;color:#f08080;font-size:13px;font-weight:500;animation:slideUp .2s ease}
 .re-day-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
 .re-day-tab{padding:8px 16px;border-radius:8px;background:var(--surface2);border:1px solid var(--border);color:var(--text3);font-family:var(--font-display);font-size:14px;font-weight:600;letter-spacing:.5px;cursor:pointer;transition:all .15s;text-transform:uppercase}
 .re-day-tab.active{background:var(--gold-dim);border-color:var(--gold);color:var(--gold)}
 .re-day-tab:hover:not(.active):not(:disabled){background:var(--surface3);color:var(--text2)}
 .re-day-tab.add{border-style:dashed;font-size:13px}
 .re-day-tab:disabled{opacity:.35;cursor:not-allowed}
  .re-day{background:var(--surface);border-radius:12px;border:1px solid var(--border);padding:14px;margin-bottom:12px}
 .re-day-header{display:flex;align-items:center;gap:8px;margin-bottom:12px}
 .re-day-name{flex:1;background:var(--surface2);border:1px solid var(--border);color:var(--gold);border-radius:6px;padding:8px 12px;font-family:var(--font-display);font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;outline:none;cursor:pointer;appearance:none}
 .re-day-name:focus{border-color:var(--gold)}
 .re-day-name option{background:#1f1f1f;color:#f0f0f0;font-family:sans-serif;font-size:15px;text-transform:none;letter-spacing:0;font-weight:normal}
 .re-day-name option:disabled{color:#555}
 .re-block{border-radius:10px;border:1px solid var(--border);overflow:hidden;margin-bottom:10px}
 .re-block-warmup{border-color:rgba(167,139,250,0.35);background:rgba(167,139,250,0.03)}
 .re-block-header{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--surface2);border-bottom:1px solid var(--border)}
 .re-block-warmup .re-block-header{background:rgba(167,139,250,0.08)}
 .re-block-icon{display:flex;color:var(--text3);flex-shrink:0}
 .re-block-warmup .re-block-icon{color:var(--purple)}
 .re-block-name-input{flex:1;background:none;border:none;outline:none;color:var(--text2);font-family:var(--font-display);font-size:14px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;padding:2px 4px;border-bottom:1px solid transparent;transition:border-color .15s}
 .re-block-warmup .re-block-name-input{color:var(--purple)}
 .re-block-name-input:focus{border-bottom-color:var(--gold)}
 .re-block-name-input::placeholder{color:var(--text3);text-transform:none;letter-spacing:0;font-weight:normal}
 .re-exercise{background:var(--surface2);border-radius:0;border:none;border-top:1px solid var(--border);padding:10px 12px}
 .re-ex-row{display:flex;gap:8px;align-items:center;margin-bottom:6px}
 .re-ex-row.nums{flex-wrap:wrap}
 .re-ex-row.nums label{display:flex;flex-direction:column;gap:3px;font-size:11px;color:var(--text3);font-weight:600;text-transform:uppercase;letter-spacing:.5px;flex:1;min-width:70px}
 .re-field{background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:8px 10px;font-size:14px;font-family:var(--font-body);outline:none;width:100%}
 .re-field.name{flex:1}
 .re-field.notes{font-style:italic;color:var(--text2)}
 .re-field:focus{border-color:var(--gold)}
 .re-ex-row.nums label input{background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:7px 10px;font-size:14px;font-family:var(--font-body);outline:none;width:100%}
 .re-ex-row.nums label input:focus{border-color:var(--gold)}
 .meas-select{background:var(--surface3);border:1px solid var(--border);color:var(--text);border-radius:6px;padding:7px 10px;font-size:13px;font-family:var(--font-body);outline:none;width:100%;cursor:pointer;appearance:none}
 .meas-select:focus{border-color:var(--gold)}
 .meas-select option{background:#1f1f1f}
 .btn-block-done{width:100%;padding:12px;background:var(--gold);color:#000;border:none;font-family:var(--font-display);font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.5px;transition:background .15s}
 .btn-block-done:hover{background:var(--gold2)}
  .btn-add-ex{width:100%;padding:8px;border-radius:0;background:none;border:none;border-top:1px dashed var(--border);color:var(--text3);font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .15s}
 .btn-add-ex:hover{background:rgba(245,197,24,0.05);color:var(--gold)}
 .block-max-note{padding:8px 12px;font-size:12px;color:var(--text3);text-align:center;border-top:1px solid var(--border);font-style:italic}
 .btn-add-block{width:100%;padding:10px;border-radius:8px;background:none;border:1.5px dashed rgba(245,197,24,0.3);color:rgba(245,197,24,0.6);font-family:var(--font-display);font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .15s;margin-top:10px}
 .btn-add-block:hover{border-color:var(--gold);color:var(--gold)}

 .btn-add-day:hover:not(:disabled){border-color:var(--gold);color:var(--gold)}
 .btn-add-day:disabled{opacity:.35;cursor:not-allowed}
 .re-footer{display:flex;gap:10px}
 .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px}
 .modal-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;max-width:320px;width:100%;animation:slideUp .2s ease}
 .modal-box p{font-size:15px;line-height:1.5;margin-bottom:16px}
 .modal-actions{display:flex;gap:10px}
 .pin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px}
 .pin-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;max-width:300px;width:100%;text-align:center;animation:slideUp .2s ease}
 .pin-box h3{font-family:var(--font-display);font-size:22px;margin-bottom:6px}
 .pin-box p{font-size:13px;color:var(--text3);margin-bottom:16px}
 .pin-input{width:100%;background:var(--surface2);border:1.5px solid var(--border);color:var(--text);border-radius:8px;padding:12px;font-size:22px;text-align:center;letter-spacing:8px;outline:none;font-family:monospace;margin-bottom:8px}
 .pin-input:focus{border-color:var(--gold)}
 .pin-error{font-size:12px;color:var(--red);margin-bottom:12px;height:16px}
 .pin-actions{display:flex;gap:8px}
 .empty-state{text-align:center;padding:40px 20px;color:var(--text3);display:flex;flex-direction:column;align-items:center;gap:12px}
 .ml-empty{text-align:center;padding:32px 20px;color:var(--text3);font-size:14px}
      `}</style>
      <AppInner />
    </>
  );
}

const KEYS = { users: "gg_users", routines: "gg_routines", photos: "gg_photos", log: "gg_log", pins: "gg_pins", info: "gg_info", device: "gg_device", weekReset: "gg_week_reset" };

const mkWeek = ()=>({reps:"",kg:""});
const mkEx = (o={}) => ({ name:"", sets:3, measType:"reps", reps:"", secs:"", rest:"60s", notes:"", weeks:[mkWeek(),mkWeek(),mkWeek(),mkWeek()], rpe:["","","",""], ...o });
const mkBlock = (type="block", name="") => ({ id: Date.now()+Math.random(), type, name, exercises:[mkEx()] });
const mkWarmup = () => ({ id: Date.now()+Math.random(), type:"warmup", name:"Entrada en calor / Movilidad", exercises:[mkEx()] });
// Reads the value for a given program week (1-4), falling back to the old flat
// reps/secs fields for exercises created before the weekly-progression feature.
function getWeekData(ex, weekNum){
  const idx = Math.min(4, Math.max(1, weekNum||1)) - 1;
  const w = ex.weeks && ex.weeks[idx];
  if(w && (w.reps || w.kg)) return w;
  return { reps: ex.measType==="secs" ? ex.secs : ex.reps, kg:"" };
}
function getWeekRPE(ex, weekNum){
  const idx = Math.min(4, Math.max(1, weekNum||1)) - 1;
  return (ex.rpe && ex.rpe[idx]) || "";
}

const defaultUsers = [{"id": 1, "name": "NATALIA AMARILLA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 1000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90-90 Piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Rotaciones tronco en mesa", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 1001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto rumano KB", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 1002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1 mano", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 1100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov muñeca en cajón", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 1101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Agarre disco c/ caída", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 1102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Estocadas fijas MC", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over c/disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 1200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 1201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 1202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Sentadilla", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Curl bíceps sentado MC", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 2, "name": "PULPO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 2000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Pasaje valla cuadrúpedia lateral", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pall off c/ rotación", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 2001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Tirón + cargada", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": "Técnica olímpica"}, {"name": "Caída pies asimétricos", "sets": 4, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Saltos entre cajones", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 2002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Sentadilla", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 2003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Peso muerto paloma MC", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 2100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Pasaje de valla 1P frontal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pall off arriba", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 2101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Salto de arr + arr", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": "Potencia"}, {"name": "Drop jump +40cm", "sets": 4, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Saltos 1P al cajón", "sets": 4, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 2102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press plano", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 2103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Peso muerto", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl de bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 2200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cuadríceps de rodillas", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica D", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Abs elevación cadera en rack", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 2201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "2do tiempo potencia", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Salto 1P desde búlgara", "sets": 4, "measType": "reps", "reps": "3+3", "secs": "", "rest": "90s", "notes": ""}, {"name": "Freno 1P PTE cadera", "sets": 4, "measType": "reps", "reps": "4+4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 2202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pte cadera en cajón 1P", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 2203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 3, "name": "FACUNDO MARINOVICH", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 22000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 22001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 22002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 22003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón lateral", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 22100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 22101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over DC", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 22102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 22103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps acostado", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Buenos días DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 22200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra + gigantes", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90 + piramidal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 22201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla sumo", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 22202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Aperturas de pecho MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bajadas al podio", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 22203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Push ups", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto paloma", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 4, "name": "ANDREA DORZAGARAY", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 21000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 21001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 21002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 21003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón lateral", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 21100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera bastón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 21101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Push ups BR baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 21102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 21103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales alternadas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Escaladores en pared", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 21200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 21201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Puente cadera en piso", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar BR chica", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 21202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras en TRX", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 21203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps + hombro", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 5, "name": "FEDERICO MALTES", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 5000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Plancha prona", "sets": 1, "measType": "time", "reps": "", "secs": "10", "rest": "60s", "notes": ""}, {"name": "Plancha lateral + abd", "sets": 1, "measType": "time", "reps": "", "secs": "10", "rest": "60s", "notes": ""}]}, {"id": 5001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Caídas 2P cajón", "sets": 4, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pogos 2P MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sent con salto", "sets": 4, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 5002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Sentadilla a cajón", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 5003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente de cadera 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 5100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Spiderman", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90 + Piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Plancha c/ vuelos", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 5101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Saltos tijera entre steps", "sets": 3, "measType": "reps", "reps": "20", "secs": "", "rest": "60s", "notes": ""}, {"name": "Saltos 1P desde búlgara", "sets": 3, "measType": "reps", "reps": "3+3", "secs": "", "rest": "60s", "notes": ""}, {"name": "Push press", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 5102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Peso muerto sumo", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 5103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}, {"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}]}]}]}, {"id": 6, "name": "MAIA GONZALEZ", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 49000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov dorsal sobre BR", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Metidas en tijera", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 49001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 49002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo BR en punta", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Puente cadera 1P en cajón", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 49100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov torácica sobre med ball DC", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pasaje de codos", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 49101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto convencional", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas asistidas en cajón", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 49102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press BR punta", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Sentadilla skater", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 49200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica T y D", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera 1P arrodillada", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto toma arranque", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 49201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sumo", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 49202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Búlgaras BR", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 7, "name": "LEON", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 48000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 48100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 48200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 48203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 8, "name": "SELENE BALLON", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 26000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 26001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 26002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 26003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 26100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 26101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Subidas al cajón KB", "sets": 4, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 26102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps MC+BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Jalón a la cara BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 26200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov cadera desde cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pasaje de valla piernas ext", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en D", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 26201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos laterales", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 26202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 9, "name": "TOMAS DUARTE", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 37000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 37100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 37200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 37203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 10, "name": "JULIAN STURTZ", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 9000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 rotación int", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Piramidal en cajón", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Extensión dorsal en rack", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Cuadríceps de rodillas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 9001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Tirón de hombros + cargada S3", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": "Levantamiento olímpico"}, {"name": "Tirón envión", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 9002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press banca", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 9003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Remo 1B KB", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas cajón KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pte cadera cajón", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 9100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 + Piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal c/ peso", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Buda", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 9101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Tirón de hombros + arrq", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Tirón arranque", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 9102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo Pendlay", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 9103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto paloma", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps + hombros", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 9200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 + elevación cadera", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Espinales c/ bastón flex-ext", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 9201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "2do tiempo de potencia", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 9202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Sentadilla", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones de rodillas", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 9203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Fondos en paralelas c/ 1P apoyado", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 11, "name": "STELLA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 12000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión frontal + ext isquio", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 12001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla sumo", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 12002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo al mentón", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 12100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera 1P", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 12101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla al cajón", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 12102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo Pendlay", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Puente cadera cajón 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 12200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica T y D", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Spiderman", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 12201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto convencional", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 12202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press plano BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bíceps MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 12, "name": "KAREN G.", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 6000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bicho muerto alternado", "sets": 1, "measType": "time", "reps": "", "secs": "10", "rest": "60s", "notes": ""}, {"name": "Plancha lateral + abd", "sets": 1, "measType": "time", "reps": "", "secs": "10", "rest": "60s", "notes": ""}]}, {"id": 6001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": "Observar que no se levanten talones"}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 6002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente de cadera 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Curl de bíceps MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 6003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 6100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Spiderman", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90 c/ bisagra de cadera", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bicho muerto completo", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 6101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 6102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 6103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas atrás", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 6200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Buenos días + sent prof bastón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press palloff c/ rotación", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 6201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 6202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo barra en punta", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocada lateral", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 6203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Pistols", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 13, "name": "FACHA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 16000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Rotación torácica en cuadrúpedia", "sets": 1, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha alta c/ arrastre", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sentadilla + rotación torácica", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 16001, "type": "block", "name": "Potencia", "exercises": [{"name": "Envión", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sentadilla c/ salto MC", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Salto skater", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 16002, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Puente cadera 1P BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 16003, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Búlgaras BR", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 16100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Bisagra cadera + buda BR", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "2do tiempo a fuerza", "sets": 1, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 16101, "type": "block", "name": "Potencia", "exercises": [{"name": "2do tiempo", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Salto tijera en cajones", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Salto 1P a cajón", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 16102, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla a cajón", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo horizontal TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 16103, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Curl bíceps BR", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Buenos días Zercher", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 16200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Expansión torácica sobre med ball DC", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas c/ BD", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Abs reloj piernas extendidas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 16201, "type": "block", "name": "Potencia", "exercises": [{"name": "2do tiempo tijera", "sets": 3, "measType": "reps", "reps": "3", "secs": "", "rest": "90s", "notes": ""}, {"name": "Salto cajón exc MC", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pogos 1P lateral", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 16202, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto sumo", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 16203, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Curl bíceps MC BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales inclinados", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pistol", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 14, "name": "MORE", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 18000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "ALO c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 18001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla al cajón", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo Pendlay", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 18002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 18003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón lateral", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 18100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 18101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over DC", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 18102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 18103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps acostado", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Buenos días DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 18200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra + gigantes", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90 + piramidal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 18201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla sumo", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 18202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Aperturas de pecho MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bajadas al podio", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 18203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Push ups", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto paloma", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 15, "name": "SANDRA ÑAÑEZ", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 20000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 20001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 20002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 20003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón lateral", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 20100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 20101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo invertido supino", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 20102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 20103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 20200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 20201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje cadera en cajón", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 20202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 20203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 16, "name": "CAMILO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 28000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 28001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 28002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 28003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 28100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 28101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over DC", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 28102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 28103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps acostado", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Buenos días DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 28200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra + gigantes", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90 + piramidal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 28201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla sumo", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 28202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Aperturas pecho MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bajadas al podio", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 28203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Push ups", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto paloma", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 17, "name": "MELANY COBER", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 17000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 17001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 17002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera cajón 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 17003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 17100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 17101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo invertido supino piernas flex", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 17102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 17103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 17200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 17201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje cadera en cajón", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 17202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 17203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 18, "name": "RUBEN", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 27000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 27100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 27200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 27203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 19, "name": "BENJAMIN GOMEZ 10", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 35000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 35100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 35200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 35203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 20, "name": "RODRIGO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 10000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Flexo-extensión rodilla acostado", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Abducción acostado", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Mov torácica sobre med ball c/ disco", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 10001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 10002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 10003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl de bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 10100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bisagra de cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 10101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 10102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 10103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Extensión de tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 10200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Reloj controlado", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 10201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 10202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje de cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 10203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 21, "name": "LIZI", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 23000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 23001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 23002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 23003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 23100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 23101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo invertido supino piernas flex", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 23102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 23103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 23200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 23201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje cadera en cajón", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 23202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 23203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 22, "name": "MICAELA DALLURA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 13000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Dorsiflexión tobillo frontal c/carga", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra + sentadilla profunda", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Halo en estocada", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 13001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas barra baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 13002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Buenos días BR asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ext tríceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Flexo-extensiones de rodillas", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 13100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 13101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Subidas al cajón KB", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 13102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps MC+BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Jalón a la cara BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 13200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov cadera desde cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pasaje de valla piernas ext", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en D", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 13201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 13202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 23, "name": "LUIS VELAZQUEZ", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 50000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 bisagra de cadera", "sets": 1, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Elevación de gemelos en estocada step", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodilla", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 50001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano cerrado MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 50002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bajadas al podio DC", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocada lateral", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 50100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov dorsal en rack", "sets": 1, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Elevación gemelos unipodal déficit step", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 50101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto agarre de arranque", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Aperturas", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 50102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Puente cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 50200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Bisagra cadera 1P arrodillado", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Rotaciones de tronco en cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha copenaghe + abd", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 50201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla frontal", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas supinas", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 50202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Push ups", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pistol en cajón", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 24, "name": "CAMILA COSENTINO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 3000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Spiderman", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 3001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla copa al cajón alto", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": "Con pesa rusa, máximo rango de movilidad"}, {"name": "Remo TRX (más parado)", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 3002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente de cadera en piso a un pie", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 3003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Extensión de tríceps DC de pie", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 3100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 3101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera en piso KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 3102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Pistol TRX", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano MC en suelo", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 3103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl de bíceps MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 25, "name": "ALE ROCA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 15000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Sentadilla de arranque c/ banda", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90 elevación cadera", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Caminata granjero", "sets": 1, "measType": "reps", "reps": "10 pasos", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 15001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla al cajón bajo", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas supinas", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 15002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Peso muerto paloma KB", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps BR", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press barra en punta", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 15100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera en cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 15101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Aperturas", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 15102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón c/carga", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 15200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Buda dinámico", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera de rodilla 1P c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90 rot int", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 15201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sumo", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 15202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas fijas BR", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 26, "name": "MAXI MARITANO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 8000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra + gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Sentadilla + mov torácica", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Plancha lateral + vuelos", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 8001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Saltos al cajón", "sets": 4, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pogos 2P c/ carga", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Frenos desde estocada", "sets": 4, "measType": "reps", "reps": "3+3", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 8002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Peso muerto", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over BCO plano disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 8003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 8100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Abs inferiores alternados", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 8101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "2do tiempo barra en punta", "sets": 2, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Skaters med ball", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Drop + salto lateral", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 8102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 8103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Peso muerto paloma", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo invertido", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 8200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 + Piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press Palloff", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 8201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Tirón hombro + cargada", "sets": 2, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Caída desde cajón 2P", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pogos tijera", "sets": 4, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 8202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Subidas al cajón KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 8203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera 1P pie en cajón", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Sumo", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 27, "name": "CANDELA ROSALES", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 33000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 33001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 33002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 33003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 33100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 33101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Subidas al cajón KB", "sets": 4, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 33102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps MC+BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Jalón a la cara BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 33200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov cadera desde cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pasaje de valla piernas ext", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en D", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 33201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos laterales", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 33202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 28, "name": "BRENDA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 34000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 34001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 34002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 34003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 34100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 34101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Push ups BR baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 34102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 34103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales alternadas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Escaladores en pared", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 34200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 34201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Puente cadera en piso", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar BR chica", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 34202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras en TRX", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 34203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps + hombro", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 29, "name": "YASMIN GENTILE", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 36000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 36001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 36002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 36003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 36100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 36101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Push ups BR baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 36102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 36103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales alternadas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Escaladores en pared", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 36200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 36201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje cadera en cajón", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 36202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 36203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 30, "name": "JULIETA ÑAÑEZ", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 4000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bisagra de cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 4001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla copa al cajón alto", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX (más parado)", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 4002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente de cadera en piso a un pie", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 4003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Flexo-extensiones de rodillas", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 4100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90 + Piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 4101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press plano MC", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 4102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Estocadas fijas MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 4103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Pull over en piso DC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Jalón a la cada BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 31, "name": "ORNELA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 25000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 25001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 25002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 25003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 25100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Gigantes", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 25101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over DC", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 25102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 25103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps acostado", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Buenos días DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 25200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra + gigantes", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90 + piramidal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 25201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla sumo", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 25202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Aperturas pecho MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bajadas al podio", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 25203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Push ups", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto paloma", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 32, "name": "MIGUEL", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 11000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Flexo-extensión rodilla acostado", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Abducción acostado", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Mov torácica sobre med ball", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 11001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 11002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 11003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl de bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 11100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Bisagra de cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 11101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 11102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 11103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Extensión de tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 11200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 11201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 11202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje de cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 11203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 33, "name": "FRANCO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 38000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 38100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 38200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 38203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 34, "name": "SANTIAGO y BENJA LAGO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 47000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90-90", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Spiderman + rotación", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha lateral rodilla al pecho", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 47001, "type": "block", "name": "Potencia", "exercises": [{"name": "Drop 1P", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pogos 1P lateral desde estocada", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "2do tiempo de potencia", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 47002, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla a cajón", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 47003, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Bajadas al podio", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 47100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Budas + rotaciones", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha construcciones", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 47101, "type": "block", "name": "Potencia", "exercises": [{"name": "Tirón + cargadas BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Saltos al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Arranque + sentadilla bastón", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 47102, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto rumano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press banca plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 47103, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Vitalizaciones cadera", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Puente cadera ISO + press 1M", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 47200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha lateral + vuelos", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 47201, "type": "block", "name": "Potencia", "exercises": [{"name": "Tirón arranque + arranque", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Salto 1P desde búlgara", "sets": 3, "measType": "reps", "reps": "3+3", "secs": "", "rest": "60s", "notes": ""}, {"name": "Freno de pie a 1P c/ MC", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 47202, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla Zercher", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 47203, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Buenos días asimétrico BR", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Push ups", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 35, "name": "BELEN", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 19000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 19001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla frontal", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 19002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Peso muerto 1P", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 19003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Vuelos combinados", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 19100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Pasaje de vallas DC 1P", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90 rot int", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press pallof salto tijera", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 19101, "type": "block", "name": "Potencia", "exercises": [{"name": "Arranque tirón hombro + arr", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Saltos 1P desde búlgara", "sets": 4, "measType": "reps", "reps": "3+3", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pogos 1P desde búlgara", "sets": 4, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 19102, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Remo barra", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 19103, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Fondos en paralelas", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas atrás + técnica carrera", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 19200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra + gigantes", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sentadilla + rotación torácica", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Perro-pájaro", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 19201, "type": "block", "name": "Potencia", "exercises": [{"name": "2do tiempo de potencia", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Drop 1/2", "sets": 4, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Saltos 1P al cajón", "sets": 4, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 19202, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 19203, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Push ups", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 36, "name": "LUCAS", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 24000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90-90", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Spiderman + rotación", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha lateral rodilla al pecho", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 24001, "type": "block", "name": "Potencia", "exercises": [{"name": "Drop 1P", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pogos 1P lateral desde estocada", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "2do tiempo de potencia", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 24002, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla a cajón", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 24003, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Peso muerto asimétrico BR punta", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 24100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Budas + rotaciones", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha construcciones", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 24101, "type": "block", "name": "Potencia", "exercises": [{"name": "Tirón + cargadas BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Saltos al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Arranque + sentadilla bastón", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 24102, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto rumano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press banca plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 24103, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Tríceps francés DC", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pullover DC", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 24200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha lateral + vuelos", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 24201, "type": "block", "name": "Potencia", "exercises": [{"name": "Tirón arranque + arranque", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Salto 1P desde búlgara", "sets": 3, "measType": "reps", "reps": "3+3", "secs": "", "rest": "60s", "notes": ""}, {"name": "Freno de pie a 1P c/ MC", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 24202, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla Zercher", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 24203, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Vuelos combinados", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocada laterales copa profundas", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 37, "name": "OLIVIA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 46000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 46001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 46002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 46003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 46100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 46101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Subidas al cajón KB", "sets": 4, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 46102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps MC+BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Jalón a la cara BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 46200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov cadera desde cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pasaje de valla piernas ext", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en D", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 46201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos laterales", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 46202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 38, "name": "LARA ÑAÑEZ", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 39000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 39001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 39002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 39003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 39100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 39101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Push ups BR baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 39102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 39103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales alternadas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Escaladores en pared", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 39200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 39201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje cadera en cajón", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 39202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 39203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 39, "name": "ROMAN Y GONZALO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 32000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 32100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 32200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 32203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 40, "name": "MARY LUPO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 29000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 29001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 29002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 29003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 29100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 29101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Push ups BR baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 29102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 29103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales alternadas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Escaladores en pared", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 29200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo en cajón", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 29201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Puente cadera en piso", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar BR chica", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 29202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras en TRX", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 29203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps + hombro", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 41, "name": "ESTEBAN", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 40000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 40100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 40200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 40203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 42, "name": "SANTIAGO BUDASSI", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 41000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90-90", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Spiderman + rotación", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha lateral rodilla al pecho", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 41001, "type": "block", "name": "Potencia", "exercises": [{"name": "Drop 1P", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pogos 1P lateral desde estocada", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "2do tiempo de potencia", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 41002, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla a cajón", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 41003, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Bajadas al podio", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 41100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Budas + rotaciones", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha construcciones", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 41101, "type": "block", "name": "Potencia", "exercises": [{"name": "Tirón + cargadas BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Saltos al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Arranque + sentadilla bastón", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 41102, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto rumano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press banca plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 41103, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Tríceps francés DC", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pullover DC", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 41200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Plancha lateral + vuelos", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 41201, "type": "block", "name": "Potencia", "exercises": [{"name": "Tirón arranque + arranque", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}, {"name": "Salto 1P desde búlgara", "sets": 3, "measType": "reps", "reps": "3+3", "secs": "", "rest": "60s", "notes": ""}, {"name": "Freno de pie a 1P c/ MC", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 41202, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla Zercher", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dominadas", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 41203, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Vuelos combinados", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocada laterales copa profundas", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 43, "name": "CLAUDIA GIORGETTI", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 7000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Gigantes solo piernas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "90/90 pecho a la rodilla", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo frontal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 7001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": "Observar profundidad de sentadilla"}, {"name": "Remo 1B MC", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 7002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Buenos días asimétrico DC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo Pendlay", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 7003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Push ups arrodillada", "sets": 3, "measType": "reps", "reps": "12", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 7100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 rot int", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 7101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar 1B sentado", "sets": 4, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 7102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 4, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press plano", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 7103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Fondos en paralelas", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pte cadera en piso c/ carga", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 7200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Piramidal", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Rana 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Sent c/ rotación torácica", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 7201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pull over BCO", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 7202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas MC", "sets": 4, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 7203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Sent sumo KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press francés MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Martes", "blocks": [{"id": 7300, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Piramidal en cajón", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Mov dorsal de rodillas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 7301, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla Zercher", "sets": 4, "measType": "reps", "reps": "12", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo invertido", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 7302, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Peso muerto asimétrico", "sets": 4, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Extensión de tríceps disco parado", "sets": 4, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Jueves", "blocks": [{"id": 7400, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Buda dinámico", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Ext torácica sobre med ball", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Peso muerto paloma", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 7401, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sumo BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Curl de bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 7402, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Push ups", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pistol en cajón", "sets": 4, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 44, "name": "NOVIA DE YOKO", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 42000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 42001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 42002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 42003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 42100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 42101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Subidas al cajón KB", "sets": 4, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 42102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P BR", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Curl bíceps MC+BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Jalón a la cara BD", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 42200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Mov cadera desde cuadrúpedia", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Pasaje de valla piernas ext", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en D", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 42201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje de cadera", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos laterales", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 42202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar BR", "sets": 3, "measType": "reps", "reps": "4", "secs": "", "rest": "60s", "notes": ""}, {"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Estocadas laterales profundas", "sets": 3, "measType": "reps", "reps": "4+4", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 45, "name": "NADA", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 43000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 43001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 43002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 43003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 43100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 43101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Push ups BR baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 43102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 43103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales alternadas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Escaladores en pared", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 43200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 43201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje cadera en cajón", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 43202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 43203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 46, "name": "SANTIAGO GOMEZ 13", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 44000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Peso muerto asimétrico", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos laterales", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 44100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "90/90 c/ piramidal", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en T", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto KB", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Flexo-extensiones", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Remo 1B MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Estocadas fijas", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Ext tríceps c/ disco", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos frontales", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 44200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Apertura torácica en cruz", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Dorsiflexión tobillo lateral", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Ranas", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Press plano", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Sumo KB", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Empuje cadera 1P", "sets": 3, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 44203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocada lateral fija copa", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Pull over DC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 47, "name": "MAYLEN ARRARAS", "active": true, "cuota": true, "days": [{"day": "Lunes", "blocks": [{"id": 45000, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Cobra", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "90/90", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Bisagra cadera c/ disco", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 45001, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Sentadilla profunda", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Remo TRX", "sets": 4, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 45002, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Puente cadera en piso 1P", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press militar MC", "sets": 3, "measType": "reps", "reps": "8+8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 45003, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Curl bíceps MC", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}, {"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "5", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Miércoles", "blocks": [{"id": 45100, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Ranas 1P", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica piernas en cruz", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Cuádriceps de rodillas", "sets": 1, "measType": "reps", "reps": "5+5", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 45101, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Peso muerto BR", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}, {"name": "Push ups BR baja", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 45102, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Subidas al cajón", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Press bca MC", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 45103, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Estocadas laterales alternadas", "sets": 3, "measType": "reps", "reps": "5+5", "secs": "", "rest": "60s", "notes": ""}, {"name": "Escaladores en pared", "sets": 3, "measType": "reps", "reps": "10", "secs": "", "rest": "60s", "notes": ""}]}]}, {"day": "Viernes", "blocks": [{"id": 45200, "type": "warmup", "name": "Movilidad / Activación", "exercises": [{"name": "Perro-gato", "sets": 1, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Mov cadera piernas ext", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}, {"name": "Apertura torácica en suelo", "sets": 1, "measType": "reps", "reps": "10+10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 45201, "type": "block", "name": "Bloque 1", "exercises": [{"name": "Empuje cadera en cajón", "sets": 4, "measType": "reps", "reps": "6", "secs": "", "rest": "90s", "notes": ""}, {"name": "Press militar MC", "sets": 4, "measType": "reps", "reps": "10", "secs": "", "rest": "90s", "notes": ""}]}, {"id": 45202, "type": "block", "name": "Bloque 2", "exercises": [{"name": "Búlgaras", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Vuelos posteriores", "sets": 3, "measType": "reps", "reps": "8", "secs": "", "rest": "60s", "notes": ""}]}, {"id": 45203, "type": "block", "name": "Bloque 3", "exercises": [{"name": "Puente cadera asimétrico", "sets": 3, "measType": "reps", "reps": "6+6", "secs": "", "rest": "60s", "notes": ""}, {"name": "Remo 1B", "sets": 3, "measType": "reps", "reps": "6", "secs": "", "rest": "60s", "notes": ""}]}]}]}, {"id": 48, "name": "BENJAMIN LAGO", "active": true, "cuota": true, "days": []}];
// Local storage (device-specific: pins, biometrics, device binding)
async function loadData(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
async function saveData(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Supabase REST helpers
const db = {
  getUsers: () => supa("users?select=*&order=name"),
  updateUser: (id, data) => supa(`users?id=eq.${id}`, {method:"PATCH",body:JSON.stringify(data)}),
  createUser: (data) => supa("users", {method:"POST",body:JSON.stringify(data)}),
  deleteUser: (id) => supa(`users?id=eq.${id}`, {method:"DELETE"}),
  getProgress: (userId, weekKey) => supa(`progress?user_id=eq.${userId}&week_key=eq.${weekKey}&select=day_index,block_index`),
  saveProgress: (data) => supa("progress", {method:"POST",headers:{Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(data)}),
  deleteProgress: (userId, weekKey) => supa(`progress?user_id=eq.${userId}&week_key=eq.${weekKey}`, {method:"DELETE"}),
  getGymInfo: () => supa("gym_info?select=*&limit=1").then(r=>r?.[0]||{}),
  updateGymInfo: (data) => supa("gym_info?id=eq.1", {method:"PATCH",body:JSON.stringify(data)}),
  getTrainingLogAll: () => supa("training_log?select=user_id,date"),
  markTrained: (userId, date) => supa("training_log", {method:"POST", headers:{Prefer:"resolution=merge-duplicates,return=representation"}, body:JSON.stringify({user_id:userId, date})}),
  bulkUpsertUsers: (rows) => supa("users?on_conflict=id", {method:"POST", headers:{Prefer:"resolution=merge-duplicates,return=representation"}, body:JSON.stringify(rows)}),
  bulkDeleteUsers: (ids) => supa(`users?id=in.(${ids.join(",")})`, {method:"DELETE"}),
};



function isLikelyHeic(file){
  const type=(file.type||"").toLowerCase();
  const name=(file.name||"").toLowerCase();
  return type.includes("heic") || type.includes("heif") || /\.hei[cf]$/.test(name);
}

async function toDecodableBlob(file){
  if(!isLikelyHeic(file)) return file;
  // HEIC/HEIF (default iPhone photo format) can't be decoded by <img>/canvas in
  // most browsers, so convert it to JPEG first using a lazy-loaded decoder.
  try {
    const heic2any = (await import("heic2any")).default;
    const converted = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
    return Array.isArray(converted) ? converted[0] : converted;
  } catch(e){
    console.error("No se pudo convertir HEIC (¿sin conexión para bajar el conversor?), probando con el archivo original.", e);
    return file; // last-ditch fallback: some browsers can still decode HEIC natively
  }
}

function compressImage(file, maxSize=96, q=0.6) {
  return new Promise(async (res,rej) => {
    try {
      const blob = await toDecodableBlob(file);
      const img=new Image(), url=URL.createObjectURL(blob);
      img.onload=()=>{
        URL.revokeObjectURL(url);
        const c=document.createElement("canvas");
        const r=Math.min(maxSize/img.width,maxSize/img.height,1);
        c.width=Math.round(img.width*r); c.height=Math.round(img.height*r);
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        res(c.toDataURL("image/jpeg",q));
      };
      img.onerror=()=>rej(new Error("El navegador no pudo abrir esta imagen"));
      img.src=url;
    } catch(e){ rej(e); }
  });
}

function formatTime(secs) {
  const s=parseInt(secs)||0;
  if(s<60) return `${s}s`;
  const m=Math.floor(s/60),r=s%60;
  return r>0?`${m}m ${r}s`:`${m}m`;
}

function playBeep() {
  try {
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    [0,0.3,0.6].forEach((t,i)=>{
      const osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value=520+i*180; osc.type="sine";
      gain.gain.setValueAtTime(0,ctx.currentTime+t);
      gain.gain.linearRampToValueAtTime(0.4,ctx.currentTime+t+0.05);
      gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.35);
      osc.start(ctx.currentTime+t); osc.stop(ctx.currentTime+t+0.4);
    });
  } catch {}
}

const Icon=({d,size=20})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);
const IconUser=()=><Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>;
const IconDumbbell=()=><Icon d="M6 5v14M18 5v14M6 12h12M3 7l3-2M3 17l3 2M21 7l-3-2M21 17l-3 2"/>;
const IconPlus=()=><Icon d="M12 5v14M5 12h14"/>;
const IconTrash=()=><Icon d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>;
const IconEdit=()=><Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>;
const IconCheck=()=><Icon d="M20 6L9 17l-5-5"/>;
const IconX=()=><Icon d="M18 6L6 18M6 6l12 12"/>;
const IconLogout=()=><Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;
const IconArrowLeft=()=><Icon d="M19 12H5M12 19l-7-7 7-7"/>;
const IconLock=()=><Icon d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4"/>;
const IconEye=()=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>);
const IconEyeOff=()=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>);
const IconRefresh=({size=16})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>);
const IconCamera=()=><Icon d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>;
const IconClock=()=><Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2"/>;
const IconPlay=()=><Icon d="M5 3l14 9-14 9V3z"/>;
const IconPause=()=><Icon d="M6 4h4v16H6zM14 4h4v16h-4z"/>;
const IconReset=()=><Icon d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/>;
const IconFire=()=><Icon d="M12 2c0 0-4 4-4 8a4 4 0 0 0 8 0c0-4-4-8-4-8z M8.5 14c-.5 2 .5 4 3.5 4s4-2 3.5-4"/>;
const IconMove=()=><Icon d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>;

function todayKey() {
  const d = new Date();
  const p = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
}

// ---- Google Sheets -> routine JSON parser (mirrors the validated prototype) ----
const DRIVE_SECTION_HEADERS = new Set([
  "MOVILIDAD","ACTIVACION","ACTIVACIÓN","CORE Y ACTIVACION","CORE Y ACTIVACIÓN",
  "CORE + ACTIVACION","CORE + ACTIVACIÓN","FUERZA ESTRUCTURA","FUERZA ESPECÍFICA",
  "ACCESORIOS","CIRCUITO FINALIZADOR","CIRCUITO 1","CIRCUITO 2","BLOQUE FINALIZADOR",
  "ACONDICIONAMIENTO FINAL","CARRERAS POR TIEMPO","CALENTAMIENTO"
]);
const DRIVE_SKIP_PREFIXES = ["PAUSA","X2 VUELTAS","X3 VUELTAS","X4 VUELTAS","FORMATO","INTENSIDAD/CARGA","OBSERVACIONES","SIN PAUSA"];
const DRIVE_WEEKDAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

function driveTitleCase(s){
  return s.toLowerCase().replace(/(^|\s|-)([a-záéíóúñ])/g,(m,sep,ch)=>sep+ch.toUpperCase());
}
function driveRowLabel(cells){
  for(let i=0;i<Math.min(3,cells.length);i++){ if(cells[i] && cells[i].trim()) return cells[i].trim(); }
  return "";
}
// Turns a Sheets API sheet object ({data:[{rowData}], merges}) into a plain 2D
// string grid, duplicating each merged range's top-left value across the whole
// range (so downstream parsing sees the same "repeated" cells a human would).
function buildGridFromSheet(sheet){
  const rowData = (sheet.data && sheet.data[0] && sheet.data[0].rowData) || [];
  const grid = rowData.map(r=>(r.values||[]).map(v=>(v && v.formattedValue) || ""));
  const nCols = grid.reduce((m,r)=>Math.max(m,r.length),0);
  grid.forEach(r=>{ while(r.length<nCols) r.push(""); });
  (sheet.merges||[]).forEach(m=>{
    const val = (grid[m.startRowIndex] && grid[m.startRowIndex][m.startColumnIndex]) || "";
    for(let r=m.startRowIndex;r<m.endRowIndex;r++){
      if(!grid[r]) continue;
      for(let c=m.startColumnIndex;c<m.endColumnIndex;c++) grid[r][c]=val;
    }
  });
  return grid;
}
// rows here are {idx, cells} — idx = absolute row number in the sheet (0-based),
// kept around so we can later write values back to the exact same cells without
// touching the sheet's existing structure/formatting/merges at all.
function driveParseDayBlocks(rows){
  const blocks=[]; let curBlock=null; let hasWeekCols=false; let groupStart=0;
  for(const {idx,cells} of rows){
    const label=driveRowLabel(cells);
    if(!label) continue;
    const upper=label.toUpperCase();
    const rest=cells.slice(3);
    if(DRIVE_SECTION_HEADERS.has(upper) || /^BLOQUE\s*\d*$/.test(upper)){
      curBlock={name:driveTitleCase(label), type:(upper.includes("MOVILIDAD")||upper.includes("CALENTAMIENTO"))?"warmup":"block", exercises:[]};
      blocks.push(curBlock);
      hasWeekCols = !!(cells[3] && cells[3].toUpperCase().startsWith("SEMANA 1"));
      groupStart=0;
      continue;
    }
    if(cells[3] && cells[3].toUpperCase().startsWith("SEMANA 1")){ hasWeekCols=true; continue; }
    if(upper.startsWith("INTENSIDAD/CARGA")){
      // Apply this RPE row to every exercise added since the last RPE/group marker
      if(curBlock){
        const rpeVals=[0,1,2,3].map(wi=>{
          const cell=rest[wi*2]||"";
          const m=cell.match(/(\d+)/);
          return m?m[1]:"";
        });
        for(let k=groupStart;k<curBlock.exercises.length;k++){ curBlock.exercises[k].rpe=rpeVals; curBlock.exercises[k]._rpeRow=idx; }
        groupStart=curBlock.exercises.length;
      }
      continue;
    }
    if(DRIVE_SKIP_PREFIXES.some(p=>upper.startsWith(p))){
      if(curBlock){
        let tag=null, text="";
        if(upper.startsWith("PAUSA")){ tag="⏱ Pausa"; text=label; }
        else if(upper.startsWith("OBSERVACIONES")){ tag="📋 Nota"; text=rest.find(c=>c&&c.trim())||""; }
        else if(upper.startsWith("FORMATO")){ tag="🔁 Formato"; text=rest.find(c=>c&&c.trim())||""; }
        if(tag&&text){
          curBlock.exercises.push({name:tag,sets:1,measType:"reps",reps:text,secs:"",rest:"",notes:"",weeks:[mkWeek(),mkWeek(),mkWeek(),mkWeek()],rpe:["","","",""]});
          groupStart=curBlock.exercises.length; // notes/pauses close out the current group
        }
      }
      continue;
    }
    if(!curBlock){ curBlock={name:"Bloque",type:"block",exercises:[]}; blocks.push(curBlock); }
    const weeks=[0,1,2,3].map(wi=>{
      let r=(rest[wi*2]||"").trim();
      let kg=(hasWeekCols?(rest[wi*2+1]||""):"").trim();
      if(kg===r) kg="";
      if(kg==="-") kg="";
      return {reps:r, kg};
    });
    const repsW1=weeks[0].reps;
    const isSecs=repsW1.includes('"');
    curBlock.exercises.push({
      name:driveTitleCase(label), sets:3, measType:isSecs?"secs":"reps",
      reps:isSecs?"":repsW1, secs:isSecs?repsW1.replace(/"/g,""):"", rest:"60s",
      notes:"", weeks, rpe:["","","",""], _row:idx, _hasWeekCols:hasWeekCols
    });
  }
  return blocks;
}
function driveSplitDays(rows){
  const days=[]; let cur=null;
  const dayRe=/^D[IÍ]A\s+(\d+|UNO|DOS|TRES|CUATRO|CINCO|SEIS|SIETE)$/i;
  for(const r of rows){
    const label=driveRowLabel(r.cells);
    if(dayRe.test(label)){ if(cur) days.push(cur); cur=[]; continue; }
    if(cur) cur.push(r);
  }
  if(cur) days.push(cur);
  return days;
}
function parseRoutineFromGrid(name, grid){
  const indexedRows = grid.map((cells,idx)=>({idx,cells})).filter(o=>o.cells.some(c=>c&&c.trim()));
  const dayChunks=driveSplitDays(indexedRows);
  const days=dayChunks.map((dayRows,idx)=>({day:DRIVE_WEEKDAYS[idx]||`Día ${idx+1}`, blocks:driveParseDayBlocks(dayRows)}));
  return {name:name.trim(), days};
}

const PSEUDO_TAG_LABELS = {"⏱ Pausa":"PAUSA", "📋 Nota":"OBSERVACIONES", "🔁 Formato":"FORMATO"};
// Builds an 11-column grid of plain strings from a routine, ready to write via
// the Sheets API. Mirrors driveParseDayBlocks in reverse (no real cell-merging,
// just repeats values across the name/week columns like a merge would show).
function buildGridFromRoutine(routine){
  const rows=[];
  const fill=(vals)=>{ const r=Array(11).fill(""); vals.forEach((v,i)=>{ if(i<11) r[i]=v; }); return r; };
  const rep3=(text)=>[text,text,text];
  routine.days.forEach((day,di)=>{
    rows.push(fill([...rep3(`DIA ${di+1}`), "DIA","DIA","DIA","DIA","DIA","DIA","DIA","DIA"]));
    (day.blocks||[]).forEach(block=>{
      const hasWeeks = block.type!=="warmup";
      const headerExtra = hasWeeks ? ["SEMANA 1","kg","SEMANA 2","kg","SEMANA 3","kg","SEMANA 4","KG"] : ["","","","","","","",""];
      rows.push(fill([...rep3(block.name.toUpperCase()), ...headerExtra]));
      (block.exercises||[]).forEach(ex=>{
        if(PSEUDO_TAG_LABELS[ex.name]){
          const lbl=PSEUDO_TAG_LABELS[ex.name];
          if(lbl==="PAUSA"){
            rows.push(fill(rep3(ex.reps||"PAUSA")));
          } else {
            rows.push(fill([...rep3(lbl), ex.reps||"", ex.reps||"", ex.reps||"", ex.reps||"", ex.reps||"", ex.reps||"", ex.reps||"", ex.reps||""]));
          }
          return;
        }
        const weeks = ex.weeks || [mkWeek(),mkWeek(),mkWeek(),mkWeek()];
        const weekVals=[];
        weeks.forEach(w=>{ weekVals.push(w.reps||""); weekVals.push(w.kg||""); });
        rows.push(fill([...rep3(ex.name.toUpperCase()), ...weekVals]));
        if(ex.rpe && ex.rpe.some(v=>v)){
          const rpeVals=[];
          ex.rpe.forEach(v=>{ const t=v?`RPE ${v}`:""; rpeVals.push(t); rpeVals.push(t); });
          rows.push(fill([...rep3("INTENSIDAD/CARGA (RPE)"), ...rpeVals]));
        }
        if(ex.notes){
          rows.push(fill([...rep3("OBSERVACIONES"), ex.notes,ex.notes,ex.notes,ex.notes,ex.notes,ex.notes,ex.notes,ex.notes]));
        }
      });
    });
  });
  return rows;
}

function MemberView({ users, setUsers, photos, setPhotos, gymInfo, onInsideChange }) {
  const [selected, setSelected] = useState(null);
  useEffect(()=>{ onInsideChange?.(!!selected); },[selected]);
  const [activeDay, setActiveDay] = useState(0);
  const [done, setDone] = useState({});
  const getSundayKey=()=>{
    const now=new Date();
    const sunday=new Date(now);
    sunday.setDate(now.getDate()-now.getDay());
    sunday.setHours(0,0,0,0);
    return `${sunday.getFullYear()}-${sunday.getMonth()+1}-${sunday.getDate()}`;
  };
  useEffect(()=>{
    if(selected){
      db.getProgress(selected.id, getSundayKey()).then(rows=>{
        const d={};
        (rows||[]).forEach(r=>{ d[`${r.day_index}-${r.block_index}`]=true; });
        setDone(d);
      }).catch(e=>{ console.error('No se pudo cargar el progreso de la nube', e); setDone({}); });
    }
  },[selected?.id]);
  const [restTimer, setRestTimer] = useState(null);
  const [trainLog, setTrainLog] = useState({});
  const [loginFlow, setLoginFlow] = useState(null);
  const autoBioTriedRef = useRef(null);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginPass2, setLoginPass2] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [showPwOld, setShowPwOld] = useState(false);
  const [showPwNew, setShowPwNew] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [entering, setEntering] = useState(false);
  const [deviceUser, setDeviceUser] = useState(null);
  const [deviceLoaded, setDeviceLoaded] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [biometricAsked, setBiometricAsked] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  useEffect(()=>{
    if(loginFlow?.mode==='login' && biometricRegistered && biometricAvailable && autoBioTriedRef.current!==loginFlow.user.id){
      autoBioTriedRef.current = loginFlow.user.id;
      handleBiometricLogin();
    }
    if(!loginFlow) autoBioTriedRef.current = null;
  },[loginFlow, biometricRegistered, biometricAvailable]);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsView, setSettingsView] = useState('main'); // 'main' | 'password'
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [newPass3, setNewPass3] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [showNovedadPopup, setShowNovedadPopup] = useState(false);
  const [novedadPopupText, setNovedadPopupText] = useState("");
  const novedadCheckedRef = useRef(false);
  const photoRef = useRef(null);
  const restRef = useRef(null);

  useEffect(()=>{
    db.getTrainingLogAll().then(rows=>{
      if(!rows){ loadData(KEYS.log,{}).then(setTrainLog); return; }
      const log={};
      rows.forEach(r=>{ (log[r.user_id]=log[r.user_id]||{})[r.date]=true; });
      setTrainLog(log);
    }).catch(()=>{ loadData(KEYS.log,{}).then(setTrainLog); });
  },[]);

  // Show a one-time popup when the coach posts a new novedad
  useEffect(()=>{
    const novedad = (gymInfo?.novedad||"").trim();
    if(!novedad || novedadCheckedRef.current) return;
    novedadCheckedRef.current = true;
    loadData('novedad_seen','').then(seen=>{
      if(seen !== novedad){
        setNovedadPopupText(novedad);
        setShowNovedadPopup(true);
      }
    });
  },[gymInfo]);

  useEffect(()=>{
    // Check if WebAuthn is available
    if(window.PublicKeyCredential){
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(ok=>setBiometricAvailable(ok))
        .catch(()=>setBiometricAvailable(false));
    }
    loadData('gg_biometric_registered',false).then(v=>setBiometricRegistered(!!v));
    loadData('gg_biometric_asked',false).then(v=>setBiometricAsked(!!v));
  },[]);
  const sessionRestoredRef = useRef(false);
  useEffect(()=>{
    loadData(KEYS.device,null).then(async d=>{
      setDeviceUser(d);
      setDeviceLoaded(true);
    });
  },[]);
  useEffect(()=>{
    if(sessionRestoredRef.current) return;
    if(!deviceLoaded || !deviceUser) return;
    if(!users.length) return;
    (async()=>{
      const session = await loadData('gg_session', null);
      if(session && session.userId === deviceUser.id){
        const elapsed = Date.now() - session.ts;
        const THREE_HOURS = 3 * 60 * 60 * 1000;
        if(elapsed < THREE_HOURS){
          const u = users.find(x=>x.id===deviceUser.id);
          if(u && u.pin){
            sessionRestoredRef.current = true;
            setSelected(u);
            if(typeof session.activeDay === 'number') setActiveDay(session.activeDay);
          }
        }
      }
    })();
  },[deviceLoaded, deviceUser, users]);

  // Reset done state every Sunday at 00:00
  useEffect(()=>{
    const checkWeekReset = async () => {
      const now = new Date();
      // Get the most recent Sunday (start of current week)
      const day = now.getDay(); // 0=Sun, 1=Mon...
      const sunday = new Date(now);
      sunday.setDate(now.getDate() - day);
      sunday.setHours(0,0,0,0);
      const sundayKey = `${sunday.getFullYear()}-${sunday.getMonth()+1}-${sunday.getDate()}`;

      const lastReset = await loadData(KEYS.weekReset, null);
      const lastResetKey = lastReset ? lastReset.value || lastReset : null;

      if(lastResetKey !== sundayKey) {
        // New week — reset progress
        setDone({});
        await saveData(KEYS.weekReset, sundayKey);
      }
    };
    checkWeekReset();

    // Also check every hour in case app stays open across midnight
    const interval = setInterval(checkWeekReset, 3600000);
    return () => clearInterval(interval);
  },[]);

  useEffect(()=>{
    if(!selected||!routine) return;
    const day=routine.days[activeDay];
    if(!day) return;
    const finished=day.blocks.length>0 && day.blocks.every((_,bi)=>isBlockDone(activeDay,bi));
    if(finished){
      const today=todayKey();
      setTrainLog(prev=>{
        const entry={...prev,[selected.id]:{...prev[selected.id],[today]:true}};
        saveData(KEYS.log,entry);
        return entry;
      });
      db.markTrained(selected.id, today).catch(e=>console.error('No se pudo guardar el entrenamiento en Supabase',e));
    }
  },[done]);

  useEffect(()=>{
    if(restTimer&&restTimer.running&&restTimer.remaining>0){
      restRef.current=setInterval(()=>{
        setRestTimer(prev=>{
          if(!prev||prev.remaining<=1){ clearInterval(restRef.current); return null; }
          return {...prev,remaining:prev.remaining-1};
        });
      },1000);
    }
    return ()=>clearInterval(restRef.current);
  },[restTimer?.running]);

  const startRest=(restStr)=>{
    let secs=60;
    if(restStr&&restStr!=="-"){
      const mm=restStr.match(/(\d+)m/), sm=restStr.match(/(\d+)s/);
      secs=(mm?parseInt(mm[1])*60:0)+(sm?parseInt(sm[1]):0)||60;
    }
    clearInterval(restRef.current);
    setRestTimer({secs,remaining:secs,running:true});
  };

  const getCurrentWeek=(u)=>{
    if(!u?.startDate) return 1;
    const start=new Date(u.startDate+'T00:00:00');
    const days=Math.floor((Date.now()-start.getTime())/86400000);
    return Math.min(4, Math.max(1, Math.floor(days/7)+1));
  };

  useEffect(()=>{
    if(selected){
      loadData('gg_session',null).then(s=>{
        if(s && s.userId===selected.id) saveData('gg_session', {...s, activeDay});
      });
    }
  },[activeDay, selected?.id]);

  const doLogin=(u)=>{
    // Bind this device to the user (first login)
    if(!deviceUser){ setDeviceUser(u); saveData(KEYS.device,u); }
    // Save session timestamp (3 hours)
    saveData('gg_session', {userId: u.id, ts: Date.now()});
    // First-ever login: this becomes Día/Semana 1 for this member
    if(!u.startDate){
      const start=todayKey();
      db.updateUser(u.id, {start_date:start}).catch(e=>console.error('No se pudo guardar la fecha de inicio',e));
      u={...u, startDate:start};
      setUsers(prev=>prev.map(x=>x.id===u.id?{...x,startDate:start}:x));
    }
    setEntering(true);
    setTimeout(()=>{
      setSelected(u);setLoginFlow(null);setLoginPass("");setLoginPass2("");setLoginUser("");setLoginError("");
      setActiveDay(0);setDone({});
      setTimeout(()=>setEntering(false),50);
      // Offer biometric only once
      if(biometricAvailable&&!biometricRegistered&&!biometricAsked){ setTimeout(()=>setShowBiometricPrompt(true),800); }
    },400);
  };

  const unlinkDevice=()=>{
    setDeviceUser(null);
    saveData(KEYS.device,null);
    setSelected(null);setLoginFlow(null);setLoginPass("");setLoginError("");setDone({});
  };
  const strToUint8 = s => new TextEncoder().encode(s);
  const uint8ToBase64 = arr => btoa(String.fromCharCode(...arr));
  const base64ToUint8 = s => Uint8Array.from(atob(s), c=>c.charCodeAt(0));

  const registerBiometric = async (user) => {
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "GG Training House", id: location.hostname||"localhost" },
          user: { id: strToUint8(String(user.id)), name: user.name, displayName: user.name },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
          timeout: 60000,
        }
      });
      // Save credential ID for later verification
      const credId = uint8ToBase64(new Uint8Array(credential.rawId));
      await saveData('gg_biometric_credid', credId);
      await saveData('gg_biometric_registered', true);
      await saveData('gg_biometric_asked', true);
      setBiometricAsked(true);
      await saveData('gg_biometric_userid', user.id);
      setBiometricRegistered(true);
      setShowBiometricPrompt(false);
    } catch(e) {
      console.error('Error al registrar biometría', e);
      setSettingsMsg('No se pudo activar. Probá de nuevo y confirmá con tu cara o huella cuando te lo pida.');
    }
  };

  const authenticateBiometric = async () => {
    try {
      const credIdB64 = await loadData('gg_biometric_credid', null);
      if(!credIdB64) return false;
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{ id: base64ToUint8(credIdB64.value||credIdB64), type: "public-key" }],
          userVerification: "required",
          timeout: 60000,
        }
      });
      return true;
    } catch(e) { return false; }
  };

  const handleBiometricLogin = async () => {
    const ok = await authenticateBiometric();
    if(ok && boundUser) doLogin(boundUser);
    else setLoginError("Biometría fallida, usá tu PIN");
  };

  const routine=selected&&selected.days&&selected.days.length?{name:selected.name, days:selected.days}:null;
  const isDone=(di,bi,ei)=>!!done[key(di,bi,ei)];
  const [geoError, setGeoError] = useState("");

  const isBlockDone=(di,bi)=>!!done[`${di}-${bi}`];

  const allDone=routine&&routine.days[activeDay]&&routine.days[activeDay].blocks.length
    ?routine.days[activeDay].blocks.every((_,bi)=>isBlockDone(activeDay,bi))
    :false;

  const dayDoneCheck=(di)=>routine&&routine.days[di]&&routine.days[di].blocks.length
    ?routine.days[di].blocks.every((_,bi)=>isBlockDone(di,bi))
    :false;

  const allWeekDone=routine?routine.days.every((_,di)=>dayDoneCheck(di)):false;

  const nextSundayStr=(()=>{
    const now=new Date();
    const daysUntilSunday=(7-now.getDay())%7||7;
    const sunday=new Date(now);
    sunday.setDate(now.getDate()+daysUntilSunday);
    sunday.setHours(0,0,0,0);
    return sunday.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'});
  })();

  const checkGymAndComplete=(dayIdx,blockIdx,blockRest)=>{
    setGeoError("");
    if(!navigator.geolocation){
      setGeoError("⚠️ Tu dispositivo no soporta geolocalización");
      setTimeout(()=>setGeoError(""),4000);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        const {latitude:lat,longitude:lng}=pos.coords;
        const R=6371000;
        const dLat=(lat-GYM_LAT)*Math.PI/180;
        const dLng=(lng-GYM_LNG)*Math.PI/180;
        const a=Math.sin(dLat/2)**2+Math.cos(GYM_LAT*Math.PI/180)*Math.cos(lat*Math.PI/180)*Math.sin(dLng/2)**2;
        const dist=R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
        if(dist<=GYM_RADIUS_M){
          completBlock(dayIdx,blockIdx,blockRest);
        } else {
          setGeoError(`📍 Debés estar en el gym para registrar el entrenamiento (estás a ${Math.round(dist)}m)`);
          setTimeout(()=>setGeoError(""),5000);
        }
      },
      ()=>{
        setGeoError("📍 Para usar la app debés permitir la ubicación");
        setTimeout(()=>setGeoError(""),5000);
      },
      {enableHighAccuracy:true,timeout:8000}
    );
  };

  const completBlock=(dayIdx,blockIdx,blockRest)=>{
    setDone(prev=>({...prev,[`${dayIdx}-${blockIdx}`]:true}));
    if(selected){
      db.saveProgress({user_id:selected.id, week_key:getSundayKey(), day_index:dayIdx, block_index:blockIdx})
        .catch(e=>console.error('No se pudo guardar el progreso en la nube', e));
    }
    startRest(blockRest);
  };

  // If device is bound to a user and no one is selected, show only that user's login
  const boundUser = deviceUser ? users.find(u=>u.id===deviceUser.id) : null;
  // If bound user exists but has no PIN, treat as unbound (allow re-registration)
  const effectiveBoundUser = boundUser && users.find(x=>x.id===boundUser.id)?.pin ? boundUser : null;

  return (
    <div className={`member-view${selected?" member-view--training":""}`}>
      {showNovedadPopup&&(
        <div className="rest-overlay" onClick={()=>{}}>
          <div className="rest-box" style={{width:"90%",maxWidth:340,padding:22,textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:34,marginBottom:8}}>📢</div>
            <div className="rest-label" style={{margin:"0 0 10px"}}>NOVEDAD</div>
            <p style={{fontSize:14,color:"var(--text2)",lineHeight:1.5,marginBottom:20,whiteSpace:"pre-wrap"}}>{novedadPopupText}</p>
            <button className="login-btn" onClick={async()=>{
              await saveData('novedad_seen', novedadPopupText);
              setShowNovedadPopup(false);
            }}>De acuerdo</button>
          </div>
        </div>
      )}
      {entering&&<div className="login-fade-overlay"/>}

      <div className={`member-hero${selected?" member-hero--active":""}`}>
        {selected?(
          <>
            <div className="tap-effect" style={{position:"relative",display:"inline-block",marginBottom:10,zIndex:2,cursor:"pointer"}} onClick={()=>setShowSettings(true)}>
              <div className="hero-active-avatar" style={{cursor:"pointer",margin:0}}>
                {photos[selected.id]
                  ?<img src={photos[selected.id]} className="hero-active-photo" alt=""/>
                  :<IconUser/>}
              </div>
              <div style={{position:"absolute",bottom:-2,right:-6,width:22,height:22,borderRadius:"50%",background:"var(--surface3)",border:"1.5px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,zIndex:2}}>⚙</div>
            </div>
            <div className="hero-active-name">{selected.name}</div>
            <div className="hero-active-tag">{routine?routine.name:"Sin rutina asignada"}{routine?` · Semana ${getCurrentWeek(selected)}`:""}</div>
          </>
        ):(
          <>
            <img src="/gg-logo.png" className="hero-logo" alt="GG Training House" />
            <p className="hero-sub">Tu entrenamiento, tu método</p>
          </>
        )}
      </div>

      {!selected&&!loginFlow&&(()=>{
        const novedad=gymInfo.novedad||"";
        const horario=gymInfo.horario||"";
        if(!novedad&&!horario) return null;
        return(
          <div className="info-panel">
            {novedad&&(<div className="info-novedad"><span className="info-tag">📢 Novedades</span><p className="info-text">{novedad}</p></div>)}
            {horario&&(<div className="info-horario"><span className="info-tag">🕐 Horarios</span><p className="info-text">{horario}</p></div>)}
          </div>
        );
      })()}

      {!selected&&loginFlow&&loginFlow.mode==='login'&&(
        <div className="login-card">
          <div className="login-avatar">{photos[loginFlow.user.id]?<img src={photos[loginFlow.user.id]} className="ml-photo" alt=""/>:<IconUser/>}</div>
          <div className="login-name">{loginFlow.user.name}</div>
          {biometricRegistered&&biometricAvailable&&(
            <button className="login-btn" style={{background:"var(--surface2)",color:"var(--text)",border:"1px solid var(--border)",marginBottom:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={handleBiometricLogin}>
              🔐 Entrar con Face ID / Huella
            </button>
          )}
          <div className="pw-wrap">
            <input className="login-input" type={showLoginPass?"text":"password"} inputMode="numeric" placeholder="Contraseña (4 dígitos)" maxLength={4}
              value={loginPass} onChange={e=>{const v=e.target.value.replace(/\D/g,"").slice(0,4);setLoginPass(v);setLoginError("");}}
              autoFocus onKeyDown={e=>{if(e.key==='Enter'){
                if(loginPass===loginFlow.user.pin){ doLogin(loginFlow.user); }
                else setLoginError("Contraseña incorrecta");
              }}}/>
            <button type="button" className="pw-eye" onClick={()=>setShowLoginPass(v=>!v)} tabIndex={-1}>{showLoginPass?<IconEyeOff/>:<IconEye/>}</button>
          </div>
          {loginError&&<p className="login-error">{loginError}</p>}
          <button className="login-btn" onClick={()=>{
            if(loginPass===loginFlow.user.pin){ doLogin(loginFlow.user); }
            else setLoginError("Contraseña incorrecta");
          }}>Entrar</button>
          <button className="login-cancel" onClick={()=>{setLoginFlow(null);setLoginPass("");setLoginError("");}}>Cancelar</button>
        </div>
      )}

      {!selected&&loginFlow&&loginFlow.mode==='unlink'&&(
        <div className="login-card">
          <div className="login-avatar"><IconUser/></div>
          <div className="login-title" style={{alignSelf:"center",textAlign:"center"}}>¿Cambiar de cuenta?</div>
          <p style={{fontSize:13,color:"var(--text2)",textAlign:"center",lineHeight:1.5,marginBottom:4}}>
            Este dispositivo va a dejar de estar vinculado a {effectiveBoundUser?.name||"este alumno"}. La próxima persona que inicie sesión acá quedará vinculada en su lugar.
          </p>
          <button className="login-btn" onClick={unlinkDevice}>Sí, cambiar cuenta</button>
          <button className="login-cancel" onClick={()=>setLoginFlow(null)}>Cancelar</button>
        </div>
      )}

      {!selected&&loginFlow&&loginFlow.mode==='register'&&(()=>{
        const unregistered=users.filter(u=>u.active!==false&&!u.pin);
        return(
          <div className="login-card">
            <div className="login-title">Crear cuenta</div>
            <select className="login-input" value={loginUser} onChange={e=>{setLoginUser(e.target.value);setLoginError("");}}>
              <option value="">Elegí tu nombre</option>
              {unregistered.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <div className="pw-wrap">
              <input className="login-input" type={showRegPass?"text":"password"} inputMode="numeric" placeholder="Elegí 4 dígitos" maxLength={4}
                value={loginPass} onChange={e=>{setLoginPass(e.target.value.replace(/\D/g,"").slice(0,4));setLoginError("");}}/>
              <button type="button" className="pw-eye" onClick={()=>setShowRegPass(v=>!v)} tabIndex={-1}>{showRegPass?<IconEyeOff/>:<IconEye/>}</button>
            </div>
            <div className="pw-wrap">
              <input className="login-input" type={showRegPass?"text":"password"} inputMode="numeric" placeholder="Repetí los 4 dígitos" maxLength={4}
                value={loginPass2} onChange={e=>{setLoginPass2(e.target.value.replace(/\D/g,"").slice(0,4));setLoginError("");}}/>
              <button type="button" className="pw-eye" onClick={()=>setShowRegPass(v=>!v)} tabIndex={-1}>{showRegPass?<IconEyeOff/>:<IconEye/>}</button>
            </div>
            {loginError&&<p className="login-error">{loginError}</p>}
            <button className="login-btn" onClick={async()=>{
              if(!loginUser){setLoginError("Elegí tu nombre");return;}
              if(loginPass.length!==4){setLoginError("Ingresá exactamente 4 dígitos");return;}
              if(loginPass!==loginPass2){setLoginError("Las contraseñas no coinciden");return;}
              const uid=isNaN(loginUser)?loginUser:Number(loginUser);
              const u=users.find(x=>x.id===uid);
              if(u && u.pin){ setLoginError("Este alumno ya tiene una cuenta creada. Usá 'Iniciar sesión' en vez de crear una nueva."); return; }
              try{ await db.updateUser(uid, {pin: loginPass}); } catch(e){ console.error(e); }
              setUsers(us=>us.map(x=>x.id===uid?{...x,pin:loginPass}:x));
              doLogin({...u, pin:loginPass});
            }}>Crear cuenta</button>
            <button className="login-cancel" onClick={()=>{setLoginFlow(null);setLoginPass("");setLoginPass2("");setLoginUser("");setLoginError("");}}>Cancelar</button>
          </div>
        );
      })()}

      {!selected&&!loginFlow&&(()=>{
        // Top 5 leaderboard
        const weekLog = trainLog;
        const scores = users
          .filter(u=>u.active!==false)
          .map(u=>{
            const log = weekLog[u.id]||{};
            const count = Object.values(log).filter(Boolean).length;
            return {id:u.id, name:u.name, count};
          })
          .filter(u=>u.count>0)
          .sort((a,b)=>b.count-a.count)
          .slice(0,5);
        const medals=['🥇','🥈','🥉','4️⃣','5️⃣'];
        return (
          <div style={{margin:"12px 16px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"10px 14px",background:"var(--surface2)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>🏆</span>
              <span style={{fontFamily:"var(--font-display)",fontSize:14,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",color:"var(--gold)"}}>Top entrenamientos</span>
            </div>
            {!scores.length&&(
              <div style={{padding:"16px 14px",textAlign:"center",fontSize:13,color:"var(--text3)"}}>Todavía no hay entrenamientos esta semana</div>
            )}
            {scores.map((u,i)=>(
              <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderBottom:i<scores.length-1?"1px solid var(--border)":"none"}}>
                <span style={{fontSize:18,width:28,textAlign:"center"}}>{medals[i]}</span>
                <span style={{flex:1,fontSize:14,fontWeight:600,color:i===0?"var(--gold)":"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{u.name}</span>
                <span style={{fontSize:13,color:"var(--text3)",fontWeight:600}}>{u.count} {u.count===1?"día":"días"}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {!selected&&!loginFlow&&(
        <div className="member-list">
          {!deviceLoaded ? (
            <p className="ml-empty">Cargando...</p>
          ) : effectiveBoundUser ? (
            // Device bound: show only this user
            <>
              <button className="member-list-item" onClick={()=>{setLoginFlow({mode:'login',user:effectiveBoundUser});setLoginPass("");setLoginError("");}}>
                <div className="ml-avatar">
                  {photos[effectiveBoundUser.id]?<img src={photos[effectiveBoundUser.id]} className="ml-photo" alt=""/>:<IconUser/>}
                  {trainLog[effectiveBoundUser.id]&&trainLog[effectiveBoundUser.id][todayKey()]&&<span className="ml-done-badge">✓</span>}
                </div>
                <div className="ml-info">
                  <span className="ml-name">{effectiveBoundUser.name}</span>
                  <span className="ml-routine">{effectiveBoundUser.days&&effectiveBoundUser.days.length?"Rutina asignada":"Sin rutina"}</span>
                </div>
                <span className="ml-arrow">›</span>
              </button>
              <div style={{padding:"12px 20px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:8}}>
                <button style={{background:"none",border:"none",color:"var(--gold)",fontSize:12,fontWeight:600,cursor:"pointer",padding:0}} onClick={()=>setLoginFlow({mode:'pickOther'})}>
                  Iniciar sesión con otro alumno
                </button>
                <button style={{background:"none",border:"none",color:"var(--text3)",fontSize:12,cursor:"pointer",padding:0}} onClick={()=>setLoginFlow({mode:'unlink'})}>
                  ¿No sos {effectiveBoundUser.name}? Cambiar cuenta
                </button>
              </div>
            </>
          ) : (
            // No device binding: show full list + register
            <>
              {users.filter(u=>u.active!==false&&u.pin).map(u=>{
                const hasRoutine=u.days&&u.days.length;
                const trainedToday=trainLog[u.id]&&trainLog[u.id][todayKey()];
                return(
                  <button key={u.id} className="member-list-item" onClick={()=>{setLoginFlow({mode:'login',user:u});setLoginPass("");setLoginError("");}}>
                    <div className="ml-avatar">
                      {photos[u.id]?<img src={photos[u.id]} className="ml-photo" alt=""/>:<IconUser/>}
                      {trainedToday&&<span className="ml-done-badge">✓</span>}
                    </div>
                    <div className="ml-info">
                      <span className="ml-name">{u.name}</span>
                      <span className="ml-routine">{hasRoutine?"Rutina asignada":"Sin rutina"}</span>
                    </div>
                    <span className="ml-arrow">›</span>
                  </button>
                );
              })}
              {users.filter(u=>u.active!==false&&!u.pin).length>0&&(
                <button className="member-list-add" onClick={()=>{setLoginFlow({mode:'register'});setLoginPass("");setLoginPass2("");setLoginUser("");setLoginError("");}}>
                  <span className="ml-add-icon">+</span>
                  <span className="ml-add-txt">Soy nuevo — crear cuenta</span>
                </button>
              )}
              {users.filter(u=>u.active!==false).length===0&&(<p className="ml-empty">No hay alumnos activos</p>)}
            </>
          )}
        </div>
      )}

      {!selected&&loginFlow&&loginFlow.mode==='pickOther'&&(
        <div className="member-list">
          <div style={{padding:"10px 16px",borderBottom:"1px solid var(--border)"}}>
            <button style={{background:"none",border:"none",color:"var(--gold)",fontSize:13,fontWeight:600,cursor:"pointer",padding:0}} onClick={()=>setLoginFlow(null)}>← Volver</button>
          </div>
          {users.filter(u=>u.active!==false&&u.pin).map(u=>{
            const hasRoutine=u.days&&u.days.length;
            const trainedToday=trainLog[u.id]&&trainLog[u.id][todayKey()];
            return(
              <button key={u.id} className="member-list-item" onClick={()=>{setLoginFlow({mode:'login',user:u});setLoginPass("");setLoginError("");}}>
                <div className="ml-avatar">
                  {photos[u.id]?<img src={photos[u.id]} className="ml-photo" alt=""/>:<IconUser/>}
                  {trainedToday&&<span className="ml-done-badge">✓</span>}
                </div>
                <div className="ml-info">
                  <span className="ml-name">{u.name}</span>
                  <span className="ml-routine">{hasRoutine?"Rutina asignada":"Sin rutina"}</span>
                </div>
                <span className="ml-arrow">›</span>
              </button>
            );
          })}
          {users.filter(u=>u.active!==false&&!u.pin).length>0&&(
            <button className="member-list-add" onClick={()=>{setLoginFlow({mode:'register'});setLoginPass("");setLoginPass2("");setLoginUser("");setLoginError("");}}>
              <span className="ml-add-icon">+</span>
              <span className="ml-add-txt">Soy nuevo — crear cuenta</span>
            </button>
          )}
        </div>
      )}

      {selected&&(
        <div className="routine-card">
          <div className="routine-header">
            <button className="exit-btn" style={{marginBottom:16}} onClick={()=>{setSelected(null);setDone({});setActiveDay(0);saveData("gg_session",null);}}><IconArrowLeft/> Salir</button>
          </div>
          {selected&&users.find(u=>u.id===selected.id)?.cuota===false?(
            <div className="no-routine" style={{gap:16}}>
              <div style={{fontSize:48}}>🔒</div>
              <p style={{fontSize:18,fontWeight:700,color:"var(--red)"}}>Cuota pendiente</p>
              <p style={{fontSize:14,color:"var(--text3)",textAlign:"center",lineHeight:1.6}}>Tu cuota no está al día.<br/>Hablá con el profe para regularizar.</p>
            </div>
          ) : !routine?(
            <div className="no-routine"><IconDumbbell/><p>No tenés rutina asignada todavía.<br/>Hablá con tu profe.</p></div>
          ):(
            <>
              <div className="day-tabs">
                {routine.days.map((d,i)=>(
                  <button key={i} className={`day-tab ${activeDay===i?"active":""} ${dayDoneCheck(i)?"tab-done":""}`} onClick={()=>setActiveDay(i)}>
                    DÍA {i+1}{dayDoneCheck(i)?" ✓":""}
                  </button>
                ))}
              </div>
              {allWeekDone?(
                <div className="day-complete-banner" style={{background:"rgba(245,197,24,0.1)",borderColor:"var(--gold)",color:"var(--gold)"}}>
                  🏆 ¡Semana completa! ¡Excelente trabajo!<br/>
                  <span style={{fontSize:12,fontWeight:400,opacity:.8}}>Se reinicia el {nextSundayStr}</span>
                </div>
              ):allDone?(
                <div className="day-complete-banner">🔥 ¡Día completado! ¡Excelente entrenamiento!</div>
              ):null}
              <div className="blocks-list">
                {routine.days[activeDay].blocks.map((block,bi)=>{
                  const isWarmup=block.type==="warmup";
                  const blockDone=!!done[`${activeDay}-${bi}`];
                  const prevBlockDone=bi===0||!!done[`${activeDay}-${bi-1}`];
                  const locked=!prevBlockDone;
                  // get rest from first exercise with a rest value
                  const blockRest=block.exercises.find(e=>e.rest&&e.rest!=="-")?.rest||"90s";
                  return (
                    <div key={block.id||bi} className={`member-block ${isWarmup?"warmup-block":""} ${blockDone?"block-done":""} ${locked?"ex-locked":""}`}>
                      <div className="member-block-header">
                        <span className="member-block-icon">{isWarmup?<IconMove/>:<IconFire/>}</span>
                        <span className="member-block-name">{block.name||`Bloque ${bi+1}`}</span>
                        {blockDone&&<span className="block-done-badge">✓</span>}
                      </div>
                      <div className="exercises-list">
                        {block.exercises.map((ex,ei)=>{
                          const isTime=ex.measType==="time"||ex.measType==="secs";
                          const wk=getCurrentWeek(selected);
                          const wd=getWeekData(ex,wk);
                          const rpe=getWeekRPE(ex,wk);
                          return (
                            <div key={ei} className={`exercise-item ${block.exercises.length>1?"combo-ex":""} ${blockDone?"ex-completed":""}`}>
                              <div className="ex-num-inner" style={{width:32,height:32,borderRadius:"50%",background:"var(--surface3)",border:"2px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"var(--text3)",fontSize:13,fontWeight:700}}>{ei+1}</div>
                              <div className="ex-body">
                                <div className="ex-name">{ex.name}</div>
                                <div className="ex-meta">
                                  <span className="ex-pill">{ex.sets} series</span>
                                  <span className={`ex-pill ${isTime?"time-pill":""}`}>
                                    {isTime?<><IconClock/> {formatTime(wd.reps)}</>:`${wd.reps} reps`}
                                  </span>
                                  {wd.kg&&<span className="ex-pill">🏋 {wd.kg} kg</span>}
                                  {rpe&&<span className="ex-pill">RPE {rpe}</span>}
                                  {ex.rest&&ex.rest!=="-"&&<span className="ex-pill">⏱ {ex.rest}</span>}
                                </div>
                                {ex.notes&&<div className="ex-notes">{ex.notes}</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {!locked&&!blockDone&&(
                        <>
                          {geoError&&<div style={{padding:"8px 12px",fontSize:12,color:"#ff8c42",textAlign:"center",borderTop:"1px solid var(--border)"}}>{geoError}</div>}
                          <button className="btn-block-done" onClick={()=>checkGymAndComplete(activeDay,bi,blockRest)}>
                            <IconCheck/> Bloque completo
                          </button>
                        </>
                      )}
                      {locked&&<div style={{padding:"10px 12px",fontSize:12,color:"var(--text3)",display:"flex",alignItems:"center",gap:6}}><IconLock/> Completá el bloque anterior primero</div>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {showSettings&&selected&&(
        <div className="rest-overlay" onClick={()=>{setShowSettings(false);setSettingsView("main");setNewPass("");setNewPass2("");setNewPass3("");setSettingsMsg("");}}>
          <div className="rest-box" style={{width:"90%",maxWidth:320,padding:20}} onClick={e=>e.stopPropagation()}>

            {/* Header */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              {settingsView==="password"?(
                <button style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:13,fontWeight:600,padding:0,letterSpacing:.5}} onClick={()=>{setSettingsView("main");setNewPass("");setNewPass2("");setNewPass3("");setSettingsMsg("");}}>← Volver</button>
              ):(
                <div className="rest-label" style={{margin:0}}>AJUSTES</div>
              )}
              <button style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:20,lineHeight:1}} onClick={()=>{setShowSettings(false);setSettingsView("main");setNewPass("");setNewPass2("");setNewPass3("");setSettingsMsg("");}}>✕</button>
            </div>

            {/* VISTA PRINCIPAL */}
            {settingsView==="main"&&(
              <>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,paddingBottom:16,borderBottom:"1px solid var(--border)"}}>
                  <div className="tap-effect" style={{width:56,height:56,borderRadius:"50%",border:"2px solid var(--gold)",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--surface2)",color:"var(--gold)",flexShrink:0,cursor:"pointer"}} onClick={()=>photoRef.current.click()}>
                    {photos[selected.id]?<img src={photos[selected.id]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<IconUser/>}
                  </div>
                  <div>
                    <div style={{fontSize:14,fontWeight:600,marginBottom:6}}>{selected.name}</div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={{background:"none",border:"1px solid var(--border)",color:"var(--text2)",borderRadius:6,padding:"5px 10px",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}} onClick={()=>photoRef.current.click()}><IconCamera/> Cambiar foto</button>
                      {photos[selected.id]&&(
                        <button style={{background:"none",border:"1px solid var(--border)",color:"#ff5c5c",borderRadius:6,padding:"5px 10px",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:6}} onClick={()=>{
                          const p={...photos}; delete p[selected.id];
                          setPhotos(p); saveData(KEYS.photos,p);
                          setSettingsMsg("✓ Foto eliminada");
                        }}><IconTrash/> Eliminar</button>
                      )}
                    </div>
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                    const file=e.target.files[0]; if(!file) return;
                    try {
                      const url=await compressImage(file);
                      const p={...photos,[selected.id]:url};
                      setPhotos(p); saveData(KEYS.photos,p);
                      setSettingsMsg("✓ Foto actualizada");
                    } catch(err){
                      console.error('Error al procesar la foto', err);
                      setSettingsMsg(`No se pudo usar esa foto (${err&&err.message?err.message:"error desconocido"}). Probá con otra o revisá tu conexión.`);
                    }
                    e.target.value="";
                  }}/>
                </div>
                <button style={{width:"100%",padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}} onClick={()=>{setSettingsView("password");setSettingsMsg("");}}>
                  <span>🔑 Cambiar contraseña</span><span style={{color:"var(--text3)"}}>›</span>
                </button>
                {biometricAvailable&&(
                  <button style={{width:"100%",padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",color:biometricRegistered?"var(--green)":"var(--text)",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}} onClick={async()=>{
                    if(biometricRegistered){
                      await saveData("gg_biometric_registered",false);
                      await saveData("gg_biometric_asked",true);
                      await saveData("gg_biometric_credid",null);
                      setBiometricRegistered(false);
                      setSettingsMsg("Biometría desactivada");
                    } else {
                      registerBiometric(selected);
                    }
                  }}>
                    <span>{biometricRegistered?"✓ Face ID / Huella activo":"🔐 Activar Face ID / Huella"}</span><span style={{color:"var(--text3)"}}>›</span>
                  </button>
                )}
                {!biometricAvailable&&(
                  <div style={{padding:"10px 12px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,fontSize:13,color:"var(--text3)",marginBottom:10}}>
                    ⚠️ Biometría no disponible en este dispositivo o navegador
                  </div>
                )}
                <div style={{marginTop:6}}>
                  <div style={{fontSize:11,color:"var(--text3)",letterSpacing:1,textTransform:"uppercase",fontWeight:600,marginBottom:8}}>Historial reciente</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {(()=>{
                      const log=trainLog[selected.id]||{};
                      if(!selected.startDate){
                        const days=Object.keys(log).filter(k=>log[k]).sort().reverse().slice(0,14);
                        if(!days.length) return <span style={{fontSize:13,color:"var(--text3)"}}>Sin entrenamientos registrados</span>;
                        return days.map(d=>(<span key={d} style={{padding:"3px 8px",background:"rgba(62,207,142,0.12)",border:"1px solid rgba(62,207,142,0.3)",borderRadius:6,fontSize:11,color:"var(--green)"}}>{d}</span>));
                      }
                      // Show every day since the member's start date, crossing out the ones they missed
                      const p=n=>String(n).padStart(2,'0');
                      const start=new Date(selected.startDate+'T00:00:00');
                      const today=new Date(); today.setHours(0,0,0,0);
                      const allDays=[];
                      for(let d=new Date(today); d>=start; d.setDate(d.getDate()-1)){
                        allDays.push(`${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`);
                      }
                      const shown=allDays.slice(0,14);
                      return shown.map(d=>{
                        const done=!!log[d];
                        return (
                          <span key={d} style={done
                            ?{padding:"3px 8px",background:"rgba(62,207,142,0.12)",border:"1px solid rgba(62,207,142,0.3)",borderRadius:6,fontSize:11,color:"var(--green)"}
                            :{padding:"3px 8px",background:"rgba(255,255,255,0.03)",border:"1px solid var(--border)",borderRadius:6,fontSize:11,color:"var(--text3)",textDecoration:"line-through"}
                          }>{d}</span>
                        );
                      });
                    })()}
                  </div>
                </div>
                {settingsMsg&&<p style={{textAlign:"center",fontSize:13,color:"var(--gold)",marginTop:12}}>{settingsMsg}</p>}
              </>
            )}

            {/* VISTA CAMBIAR CONTRASEÑA */}
            {settingsView==="password"&&(
              <>
                <div style={{fontSize:13,color:"var(--text3)",marginBottom:14,textAlign:"center"}}>Ingresá tu contraseña actual y la nueva</div>
                <div className="pw-wrap">
                  <input className="login-input" type={showPwOld?"text":"password"} inputMode="numeric" placeholder="Contraseña anterior (4 dígitos)" maxLength={4} value={newPass} onChange={e=>setNewPass(e.target.value.replace(/\D/g,"").slice(0,4))} style={{marginBottom:10}} autoFocus/>
                  <button type="button" className="pw-eye" onClick={()=>setShowPwOld(v=>!v)} tabIndex={-1}>{showPwOld?<IconEyeOff/>:<IconEye/>}</button>
                </div>
                <div className="pw-wrap">
                  <input className="login-input" type={showPwNew?"text":"password"} inputMode="numeric" placeholder="Nueva contraseña (4 dígitos)" maxLength={4} value={newPass2} onChange={e=>setNewPass2(e.target.value.replace(/\D/g,"").slice(0,4))} style={{marginBottom:10}}/>
                  <button type="button" className="pw-eye" onClick={()=>setShowPwNew(v=>!v)} tabIndex={-1}>{showPwNew?<IconEyeOff/>:<IconEye/>}</button>
                </div>
                <div className="pw-wrap">
                  <input className="login-input" type={showPwNew?"text":"password"} inputMode="numeric" placeholder="Repetir nueva contraseña" maxLength={4} value={newPass3} onChange={e=>setNewPass3(e.target.value.replace(/\D/g,"").slice(0,4))} style={{marginBottom:12}}/>
                  <button type="button" className="pw-eye" onClick={()=>setShowPwNew(v=>!v)} tabIndex={-1}>{showPwNew?<IconEyeOff/>:<IconEye/>}</button>
                </div>
                {settingsMsg&&<p style={{textAlign:"center",fontSize:13,color:settingsMsg.startsWith("✓")?"var(--gold)":"#ff5c5c",marginBottom:10}}>{settingsMsg}</p>}
                <button className="login-btn" onClick={async()=>{
                  if(newPass!==selected.pin){setSettingsMsg("Contraseña anterior incorrecta");return;}
                  if(newPass2.length!==4){setSettingsMsg("La nueva contraseña debe tener 4 dígitos");return;}
                  if(newPass2!==newPass3){setSettingsMsg("Las contraseñas no coinciden");return;}
                  try{ await db.updateUser(selected.id, {pin: newPass2}); } catch(e){ console.error(e); }
                  setUsers(us=>us.map(x=>x.id===selected.id?{...x,pin:newPass2}:x));
                  setNewPass("");setNewPass2("");setNewPass3("");
                  setSettingsMsg("✓ Contraseña actualizada");
                  setTimeout(()=>setSettingsView("main"),1200);
                }}>Guardar contraseña</button>
              </>
            )}

          </div>
        </div>
      )}

      {showBiometricPrompt&&selected&&(
        <div className="rest-overlay" onClick={()=>{setShowBiometricPrompt(false);setSettingsMsg("");}}>
          <div className="rest-box" onClick={e=>e.stopPropagation()} style={{textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:12}}>🔐</div>
            <div className="rest-label" style={{marginBottom:8}}>ACTIVAR BIOMETRÍA</div>
            <p style={{fontSize:14,color:"var(--text2)",marginBottom:20,lineHeight:1.5}}>¿Querés usar Face ID o huella para entrar más rápido la próxima vez?</p>
            {settingsMsg&&<p style={{fontSize:13,color:"#ff5c5c",marginBottom:14}}>{settingsMsg}</p>}
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <button className="login-btn" onClick={()=>registerBiometric(selected)}>Activar Face ID / Huella</button>
              <button className="rest-skip" onClick={async()=>{await saveData("gg_biometric_asked",true);setBiometricAsked(true);setShowBiometricPrompt(false);setSettingsMsg("");}}>Ahora no</button>
            </div>
          </div>
        </div>
      )}

      {restTimer&&(
        <div className="rest-overlay" onClick={()=>{clearInterval(restRef.current);setRestTimer(null);}}>
          <div className="rest-box" onClick={e=>e.stopPropagation()}>
            <div className="rest-label">DESCANSO</div>
            <div className="rest-ring-wrap">
              {(()=>{
                const pct=restTimer.secs>0?(restTimer.remaining/restTimer.secs)*100:0;
                const R=54,circ=2*Math.PI*R,dash=(pct/100)*circ;
                const col=pct>50?"#3ecfcf":pct>20?"#f5c518":"#e03e3e";
                return(<>
                  <svg width="130" height="130" viewBox="0 0 130 130">
                    <circle cx="65" cy="65" r={R} fill="none" stroke="#2a2a2a" strokeWidth="7"/>
                    <circle cx="65" cy="65" r={R} fill="none" stroke={col} strokeWidth="7"
                      strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                      transform="rotate(-90 65 65)" style={{transition:"stroke-dasharray 0.8s linear,stroke 0.4s"}}/>
                  </svg>
                  <div className="rest-countdown" style={{color:col}}>{restTimer.remaining}s</div>
                </>);
              })()}
            </div>
            <div className="rest-sub">Preparate para el siguiente ejercicio</div>
            <button className="rest-skip" onClick={()=>{clearInterval(restRef.current);setRestTimer(null);}}>Saltar descanso</button>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoUploadBtn({ userId, currentPhoto, onSave }) {
  const fileRef=useRef();
  const [loading,setLoading]=useState(false);
  const handleFile=async(e)=>{
    const file=e.target.files[0]; if(!file) return;
    setLoading(true);
    try{ onSave(userId,await compressImage(file)); }
    catch(err){ console.error('Error al procesar la foto', err); alert('No se pudo usar esa foto. Probá con otra.'); }
    setLoading(false); e.target.value="";
  };
  return(
    <div className="photo-upload-btn tap-effect" onClick={()=>fileRef.current.click()} title="Cambiar foto">
      {currentPhoto?<img src={currentPhoto} className="uc-photo-img" alt=""/>:<span className="uc-photo-icon"><IconUser/></span>}
      <span className="photo-overlay">{loading?"…":<IconCamera/>}</span>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
    </div>
  );
}

function CoachView({ users,setUsers,photos,setPhotos,gymInfo,setGymInfo,
  showCoachSettings,setShowCoachSettings,coachSettingsMsg,setCoachSettingsMsg,
  coachNewPin,setCoachNewPin,coachNewPin2,setCoachNewPin2,PIN,setPIN,
  coachBioAvailable,coachBioRegistered,setCoachBioRegistered,registerCoachBio,onExit }) {
  const [tab,setTab]=useState("users");
  const [editRoutine,setEditRoutine]=useState(null);
  const [userSearch,setUserSearch]=useState("");
  const [selectedUser,setSelectedUser]=useState(null);
  const [showUserMenu,setShowUserMenu]=useState(false);
  const [infoNovedad,setInfoNovedad]=useState(gymInfo.novedad||"");
  const [infoHorario,setInfoHorario]=useState(gymInfo.horario||"");
  const [infoSaved,setInfoSaved]=useState(false);
  const [infoSaveStatus,setInfoSaveStatus]=useState(null); // null | 'saving' | 'done'
  const [showNewUser,setShowNewUser]=useState(false);
  const [newUserName,setNewUserName]=useState("");
  const [confirmDelete,setConfirmDelete]=useState(null);
  const [validationMsg,setValidationMsg]=useState("");
  const [editDayIdx,setEditDayIdx]=useState(0);
  const validationTimer=useRef(null);
  const selectedUserCardRef=useRef(null);
  const [syncing,setSyncing]=useState(false);
  const [syncMsg,setSyncMsg]=useState('');
  const [coachSettingsView,setCoachSettingsView]=useState('main');

  useEffect(()=>{
    if(selectedUser && selectedUserCardRef.current){
      setTimeout(()=>selectedUserCardRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),80);
    }
  },[selectedUser]);

  const switchTab=(t)=>{
    setConfirmDelete(null);
    setShowNewUser(false);
    setShowUserMenu(false);
    setTab(t);
  };

  const syncWithDrive = async () => {
    if(!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('TU_CLIENT_ID')){
      setSyncMsg('⚠️ Falta configurar el Client ID de Google (ver comentario junto a GOOGLE_CLIENT_ID en el código).');
      setTimeout(()=>setSyncMsg(''),6000);
      return;
    }
    setSyncing(true);
    setSyncMsg('Conectando con Google Drive...');
    try {
      const token = await getDriveToken();

      setSyncMsg('Buscando planillas...');
      const listResp = await fetch(
        driveFilesListUrl(),
        {headers:{Authorization:`Bearer ${token}`}}
      );
      const listData = await listResp.json();
      if(listData.error){
        setSyncMsg(`⚠️ Error de Google Drive: ${listData.error.message||JSON.stringify(listData.error)}`);
        setTimeout(()=>setSyncMsg(''),15000);
        setSyncing(false); return;
      }
      const files = (listData.files||[]).filter(f=>!/protocolo/i.test(f.name));
      if(!files.length){ setSyncMsg('No se encontraron planillas en la carpeta.'); setSyncing(false); return; }

      const failed=[];
      const CONCURRENCY=10; // just Sheets API reads here — cheap, but leave headroom for Google's rate limits
      let doneCount=0;
      const parsedResults=[]; // {file, routine} for successfully parsed sheets

      const fetchAndParse = async(file)=>{
        if(file.mimeType==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
          return {ok:false, reason:"es un Excel (.xlsx), convertilo a Google Sheets para poder leerlo"};
        }
        const sheetResp = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${file.id}?includeGridData=true&fields=sheets(data(rowData(values(formattedValue))),merges)`,
          {headers:{Authorization:`Bearer ${token}`}}
        );
        if(sheetResp.status===429 || sheetResp.status>=500){
          throw Object.assign(new Error(`HTTP ${sheetResp.status}`), {retryable:true});
        }
        const sheetJson = await sheetResp.json();
        if(sheetJson.error){
          throw Object.assign(new Error(sheetJson.error.message||"Error de Sheets API"), {retryable:sheetJson.error.code===429});
        }
        const sheet = sheetJson.sheets && sheetJson.sheets[0];
        if(!sheet) return {ok:false, reason:null};
        const grid = buildGridFromSheet(sheet);
        const routine = parseRoutineFromGrid(file.name, grid);
        if(!routine.days.length) return {ok:false, reason:"sin días detectados"};
        return {ok:true, routine};
      };

      let pending = files.slice();
      for(let attempt=1; attempt<=3 && pending.length; attempt++){
        if(attempt>1){
          setSyncMsg(`Reintentando ${pending.length} planilla(s)...`);
          await new Promise(r=>setTimeout(r, 2000*attempt)); // back off a bit before retrying
        }
        const stillPending=[];
        for(let b=0;b<pending.length;b+=CONCURRENCY){
          const batch=pending.slice(b,b+CONCURRENCY);
          await Promise.all(batch.map(async(file)=>{
            try{
              const result = await fetchAndParse(file);
              if(result.ok){
                parsedResults.push({file, routine:result.routine});
              } else if(attempt===3 || !result.reason){
                // non-retryable outcome, or we're out of attempts
                failed.push(result.reason?`${file.name} (${result.reason})`:file.name);
              } else {
                failed.push(`${file.name} (${result.reason})`); // e.g. "sin días detectados" — retrying won't fix content issues, keep as final
              }
            } catch(e){
              if(e.retryable && attempt<3){
                stillPending.push(file);
              } else {
                console.error(e);
                failed.push(file.name);
              }
            } finally {
              doneCount++;
              setSyncMsg(`Leyendo planillas... ${Math.min(doneCount,files.length)}/${files.length}`);
            }
          }));
        }
        pending = stillPending;
      }

      // Build one single bulk upsert instead of one request per alumno.
      // Every row must have the SAME set of columns or PostgREST silently
      // rejects the whole batch — so we always include id/name/active/cuota,
      // generating a client-side id for brand-new alumnos instead of omitting it.
      setSyncMsg('Guardando cambios...');
      let createdCount=0, updatedCount=0;
      const rows=[];
      parsedResults.forEach(({file,routine})=>{
        const matchedUser = users.find(u=>u.name.trim().toLowerCase()===file.name.trim().toLowerCase());
        if(matchedUser){
          rows.push({id:matchedUser.id, name:matchedUser.name, active:matchedUser.active, cuota:matchedUser.cuota, days:routine.days, drive_file_id:file.id});
          updatedCount++;
        } else {
          rows.push({id:crypto.randomUUID(), name:routine.name.trim(), active:true, cuota:true, days:routine.days, drive_file_id:file.id});
          createdCount++;
        }
      });

      if(rows.length){
        try{
          const upsertResp = await fetch(`${SUPA_URL}/rest/v1/users?on_conflict=id`, {
            method:'POST',
            headers:{
              apikey: SUPA_KEY, Authorization:`Bearer ${SUPA_KEY}`, 'Content-Type':'application/json',
              Prefer:'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify(rows)
          });
          const rawText = await upsertResp.text();
          if(!upsertResp.ok){
            throw new Error(`HTTP ${upsertResp.status}: ${rawText.slice(0,300)}`);
          }
          let saved;
          try { saved = JSON.parse(rawText); } catch(e){ throw new Error(`Respuesta no-JSON: ${rawText.slice(0,300)}`); }
          if(!Array.isArray(saved) || saved.length !== rows.length){
            throw new Error(`La base devolvió ${Array.isArray(saved)?saved.length:0} de ${rows.length} filas esperadas. Respuesta: ${rawText.slice(0,300)}`);
          }
          setUsers(us=>{
            const byId=new Map(us.map(u=>[u.id,u]));
            saved.forEach(r=>{
              byId.set(r.id, {
                id:r.id, name:r.name, active:r.active, cuota:r.cuota,
                photo:byId.get(r.id)?.photo||null, startDate:r.start_date||byId.get(r.id)?.startDate||null,
                days:r.days, driveFileId:r.drive_file_id, pin:r.pin!==undefined?r.pin:byId.get(r.id)?.pin
              });
            });
            return Array.from(byId.values());
          });
        } catch(e){
          console.error(e);
          failed.push(`⚠️ No se guardó nada en la base (${e.message||e})`);
          createdCount=0; updatedCount=0;
        }
      }

      // Full mirror: any alumno in the app that no longer has a matching Drive
      // file gets removed too (Google Sheets is the single source of truth).
      const seenNames = new Set(files.map(f=>f.name.trim().toLowerCase()));
      const orphans = users.filter(u=>!seenNames.has(u.name.trim().toLowerCase()));
      if(orphans.length){
        try{
          await db.bulkDeleteUsers(orphans.map(o=>o.id));
          setUsers(us=>us.filter(u=>!orphans.some(o=>o.id===u.id)));
        } catch(e){ console.error('No se pudo borrar alumnos huérfanos', e); }
      }

      setSyncMsg(`✓ Listo: ${createdCount} alumno(s) nuevo(s), ${updatedCount} rutinas actualizadas`
        + `${orphans.length?`, ${orphans.length} alumno(s) borrado(s) (${orphans.map(o=>o.name).join(', ')})`:''}`
        + `${failed.length?` — ⚠️ ${failed.length} con error: ${failed.join(', ')}`:''}`);
      setTimeout(()=>setSyncMsg(''), (failed.length||orphans.length) ? 20000 : 8000);
    } catch(e) {
      console.error(e);
      setSyncMsg('Error al sincronizar. Verificá el Client ID y los permisos de Drive.');
      setTimeout(()=>setSyncMsg(''),5000);
    }
    setSyncing(false);
  };

  const [pushingDrive,setPushingDrive]=useState(false);
  const driveTokenRef=useRef({token:null, expiresAt:0});
  const getDriveToken=async()=>{
    if(driveTokenRef.current.token && Date.now()<driveTokenRef.current.expiresAt) return driveTokenRef.current.token;
    if(!window.google || !window.google.accounts){
      await new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src='https://accounts.google.com/gsi/client';
        s.onload=res; s.onerror=rej;
        document.head.appendChild(s);
      });
    }
    const token = await new Promise((res,rej)=>{
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
        callback: (t) => t.error ? rej(t.error) : res(t.access_token),
      });
      client.requestAccessToken();
    });
    driveTokenRef.current = {token, expiresAt: Date.now()+55*60*1000}; // Google tokens last ~1h; refresh a bit early
    return token;
  };

  // Auto-sync once an hour, silently — never prompts a Google login popup on
  // its own. If there's no valid cached token yet, it just skips that hour.
  useEffect(()=>{
    const interval = setInterval(()=>{
      if(driveTokenRef.current.token && Date.now()<driveTokenRef.current.expiresAt){
        syncWithDrive();
      }
    }, 60*60*1000);
    return ()=>clearInterval(interval);
  },[]);
  const pushRoutineToDrive = async (routine) => {
    setPushingDrive(true);
    setSyncMsg('Sincronizando con Drive...');
    try {
      const token = await getDriveToken();

      let fileId = routine.driveFileId;
      let skippedNew = 0;

      if(!fileId){
        // No Drive file yet for this routine (created directly in the app) -> create
        // a brand-new one. There's no existing layout to preserve here, so this is
        // the one case where we write a plain (unmerged) grid.
        const createResp = await fetch('https://www.googleapis.com/drive/v3/files', {
          method:'POST',
          headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'},
          body: JSON.stringify({ name: routine.name, mimeType:'application/vnd.google-apps.spreadsheet', parents:[DRIVE_FOLDER_ID] })
        });
        const created = await createResp.json();
        fileId = created.id;
        if(!fileId) throw new Error('No se pudo crear la planilla en Drive');
        await db.updateUser(routine.id, {drive_file_id: fileId});
        setUsers(us=>us.map(u=>u.id===routine.id?{...u,driveFileId:fileId}:u));

        const grid = buildGridFromRoutine(routine);
        await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values/A1?valueInputOption=RAW`, {
          method:'PUT',
          headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'},
          body: JSON.stringify({ range:'A1', majorDimension:'ROWS', values: grid })
        });
      } else {
        // Existing Drive file: update ONLY the specific cells that hold reps/kg/RPE
        // for exercises we know the exact row of (from the last read). Everything
        // else — headers, merges, colors, notes — is left completely untouched.
        const metaResp = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}?fields=sheets.properties.title`, {
          headers:{Authorization:`Bearer ${token}`}
        });
        const meta = await metaResp.json();
        const sheetTitle = meta?.sheets?.[0]?.properties?.title || null;
        const rangePrefix = sheetTitle ? `'${sheetTitle.replace(/'/g,"''")}'!` : '';

        const data=[];
        routine.days.forEach(day=>(day.blocks||[]).forEach(block=>(block.exercises||[]).forEach(ex=>{
          if(PSEUDO_TAG_LABELS[ex.name]) return; // notes/pausas/formato: left as-is on purpose
          if(ex._row==null){ skippedNew++; return; }
          const weeks = ex.weeks || [mkWeek(),mkWeek(),mkWeek(),mkWeek()];
          let rowVals;
          if(ex._hasWeekCols){
            rowVals=[]; weeks.forEach(w=>{ rowVals.push(w.reps||""); rowVals.push(w.kg||""); });
          } else {
            const v = weeks[0].reps || "";
            rowVals = Array(8).fill(v);
          }
          data.push({ range:`${rangePrefix}D${ex._row+1}:K${ex._row+1}`, values:[rowVals] });
          if(ex._rpeRow!=null && ex.rpe && ex.rpe.some(v=>v)){
            const rpeVals=[]; ex.rpe.forEach(v=>{ const t=v?`RPE ${v}`:""; rpeVals.push(t); rpeVals.push(t); });
            data.push({ range:`${rangePrefix}D${ex._rpeRow+1}:K${ex._rpeRow+1}`, values:[rpeVals] });
          }
        })));

        if(data.length){
          await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${fileId}/values:batchUpdate`, {
            method:'POST',
            headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'},
            body: JSON.stringify({ valueInputOption:'RAW', data })
          });
        }
      }
      setSyncMsg(`✓ Sincronizado con Drive${skippedNew?` (${skippedNew} ejercicio(s) nuevo(s) sin sincronizar — agregalos a mano en Drive)`:''}`);
      setTimeout(()=>setSyncMsg(''),6000);
    } catch(e) {
      console.error(e);
      setSyncMsg('⚠️ No se pudo sincronizar con Drive (se guardó igual en la app).');
      setTimeout(()=>setSyncMsg(''),6000);
    }
    setPushingDrive(false);
  };

  const showValidation=(msg)=>{ setValidationMsg(msg); clearTimeout(validationTimer.current); validationTimer.current=setTimeout(()=>setValidationMsg(""),3000); };
  const toggleUser=(id)=>{ const u=users.map(x=>x.id===id?{...x,active:!x.active}:x); setUsers(u); db.updateUser(id,{active:!users.find(x=>x.id===id).active}); };
  const toggleCuota=(id)=>{ const u=users.map(x=>x.id===id?{...x,cuota:x.cuota===false?true:false}:x); setUsers(u); db.updateUser(id,{cuota:users.find(x=>x.id===id).cuota===false?true:false}); };
  const addUser=()=>{
    if(!newUserName.trim()) return;
    const u=[...users,{id:Date.now(),name:newUserName.trim(),active:true,cuota:true,days:[]}];
    db.createUser({name:newUserName.trim(),active:true,cuota:true}).then(r=>{ if(r?.[0]) setUsers([...users,{id:r[0].id,name:r[0].name,active:true,cuota:true,days:[]}]); });
    setNewUserName(""); setShowNewUser(false);
  };
  const deleteUser=(id)=>{
    const u=users.filter(x=>x.id!==id); setUsers(u); db.deleteUser(id);
    const p={...photos}; delete p[id]; setPhotos(p); saveData(KEYS.photos,p);
    setConfirmDelete(null);
  };
  const savePhoto=(uid,url)=>{ const p={...photos,[uid]:url}; setPhotos(p); saveData(KEYS.photos,p); };
  const startNewRoutine=(user)=>{
    setEditRoutine({ userId:user.id, name:user.name, days: user.days&&user.days.length?user.days:[{ day:"Lunes", blocks:[mkWarmup()] }], driveFileId:user.driveFileId||null });
    setEditDayIdx(0);
  };
  const saveRoutine=()=>{
    if(!editRoutine.userId) return;
    db.updateUser(editRoutine.userId, {days:editRoutine.days});
    setUsers(us=>us.map(u=>u.id===editRoutine.userId?{...u,days:editRoutine.days}:u));
    pushRoutineToDrive({id:editRoutine.userId, name:editRoutine.name, days:editRoutine.days, driveFileId:editRoutine.driveFileId}); // fire-and-forget: keeps Drive in sync automatically
    setEditRoutine(null);
  };

  const WEEK_DAYS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const addDay=()=>{
    const ex=editRoutine.days.map(d=>d.day), next=WEEK_DAYS.find(d=>!ex.includes(d));
    if(!next) return;
    setEditRoutine({...editRoutine,days:[...editRoutine.days,{day:next,blocks:[mkWarmup()]}]});
  };
  const removeDay=(di)=>setEditRoutine({...editRoutine,days:editRoutine.days.filter((_,i)=>i!==di)});
  const updateDayName=(di,v)=>{ const days=editRoutine.days.map((d,i)=>i===di?{...d,day:v}:d); setEditRoutine({...editRoutine,days}); };
  const addBlock=(di)=>{
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:[...d.blocks,mkBlock("block",`Bloque ${d.blocks.length}`)]}:d);
    setEditRoutine({...editRoutine,days});
  };
  const removeBlock=(di,bi)=>{
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:d.blocks.filter((_,j)=>j!==bi)}:d);
    setEditRoutine({...editRoutine,days});
  };
  const updateBlockName=(di,bi,v)=>{
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:d.blocks.map((b,j)=>j===bi?{...b,name:v}:b)}:d);
    setEditRoutine({...editRoutine,days});
  };
  const addExercise=(di,bi)=>{
    const block=editRoutine.days[di].blocks[bi];
    if(block.exercises.length>=8){ showValidation("Máximo 8 ejercicios por bloque."); return; }
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:d.blocks.map((b,j)=>j===bi?{...b,exercises:[...b.exercises,mkEx()]}:b)}:d);
    setEditRoutine({...editRoutine,days});
  };
  const removeExercise=(di,bi,ei)=>{
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:d.blocks.map((b,j)=>j===bi?{...b,exercises:b.exercises.filter((_,k)=>k!==ei)}:b)}:d);
    setEditRoutine({...editRoutine,days});
  };
  const updateExercise=(di,bi,ei,f,v)=>{
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:d.blocks.map((b,j)=>j===bi?{...b,exercises:b.exercises.map((ex,k)=>k===ei?{...ex,[f]:v}:ex)}:b)}:d);
    setEditRoutine({...editRoutine,days});
  };
  const handleRepsChange=(di,bi,ei,val)=>{
    const s=val.replace(/\D/g,"");
    if(s===""){updateExercise(di,bi,ei,"reps","");return;}
    const n=parseInt(s);
    if(n<1||n>50){ showValidation("Las repeticiones deben ser un número entre 1 y 50."); updateExercise(di,bi,ei,"reps",String(Math.min(Math.max(n,1),50))); }
    else updateExercise(di,bi,ei,"reps",s);
  };
  const handleSecsChange=(di,bi,ei,val)=>updateExercise(di,bi,ei,"secs",val.replace(/\D/g,""));
  const updateExerciseWeek=(di,bi,ei,wi,field,v)=>{
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:d.blocks.map((b,j)=>j===bi?{...b,exercises:b.exercises.map((ex,k)=>{
      if(k!==ei) return ex;
      const weeks=(ex.weeks||[mkWeek(),mkWeek(),mkWeek(),mkWeek()]).map((w,idx)=>idx===wi?{...w,[field]:v}:w);
      return {...ex,weeks};
    })}:b)}:d);
    setEditRoutine({...editRoutine,days});
  };
  const updateExerciseRPE=(di,bi,ei,wi,v)=>{
    const days=editRoutine.days.map((d,i)=>i===di?{...d,blocks:d.blocks.map((b,j)=>j===bi?{...b,exercises:b.exercises.map((ex,k)=>{
      if(k!==ei) return ex;
      const rpe=(ex.rpe||["","","",""]).map((r,idx)=>idx===wi?v:r);
      return {...ex,rpe};
    })}:b)}:d);
    setEditRoutine({...editRoutine,days});
  };
  const [expandedWeeks,setExpandedWeeks]=useState({});
  const toggleWeeks=(key)=>setExpandedWeeks(prev=>({...prev,[key]:!prev[key]}));

  return (
    <div className="coach-view">
      <div className="coach-header">
        <div className="coach-brand" style={{justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span className="brand-dot"/><span>Panel Profe</span></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button className="exit-btn" style={{padding:"7px 14px",fontSize:13}} onClick={onExit}><IconLogout/> Salir</button>
            <button style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:18,padding:0}} onClick={()=>{setShowCoachSettings(true);setCoachSettingsView('main');setCoachSettingsMsg("");setCoachNewPin("");setCoachNewPin2("");}}>⚙</button>
          </div>
        </div>
        <div className="coach-tabs">
          <button className={`ctab ${tab==="users"?"active":""}`} onClick={()=>switchTab("users")}><IconUser/> Alumnos</button>
          <button className={`ctab ${tab==="info"?"active":""}`} onClick={()=>switchTab("info")}>📢 Info</button>
        </div>
      </div>

      {showCoachSettings&&(
        <div className="rest-overlay" onClick={()=>{setShowCoachSettings(false);setCoachSettingsView('main');setCoachNewPin("");setCoachNewPin2("");setCoachSettingsMsg("");}}>
          <div className="rest-box" style={{width:"90%",maxWidth:320,padding:20}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              {coachSettingsView==="password"?(
                <button style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:13,fontWeight:600,padding:0,letterSpacing:.5}} onClick={()=>{setCoachSettingsView("main");setCoachNewPin("");setCoachNewPin2("");setCoachSettingsMsg("");}}>← Volver</button>
              ):(
                <div className="rest-label" style={{margin:0}}>AJUSTES PROFE</div>
              )}
              <button style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:20}} onClick={()=>{setShowCoachSettings(false);setCoachSettingsView('main');setCoachNewPin("");setCoachNewPin2("");setCoachSettingsMsg("");}}>✕</button>
            </div>

            {/* VISTA PRINCIPAL */}
            {coachSettingsView==="main"&&(
              <>
                <button style={{width:"100%",padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}} onClick={()=>{setCoachSettingsView("password");setCoachSettingsMsg("");}}>
                  <span>🔑 Cambiar PIN</span><span style={{color:"var(--text3)"}}>›</span>
                </button>

                {coachBioAvailable&&(
                  <button style={{width:"100%",padding:"12px 16px",background:"var(--surface2)",border:"1px solid var(--border)",color:coachBioRegistered?"var(--green)":"var(--text)",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}} onClick={async()=>{
                    if(coachBioRegistered){
                      await saveData('coach_bio_registered',false);
                      setCoachBioRegistered(false);
                      setCoachSettingsMsg("Biometría desactivada");
                    } else {
                      registerCoachBio();
                    }
                  }}>
                    <span>{coachBioRegistered?"✓ Face ID / Huella activo":"🔐 Activar Face ID / Huella"}</span><span style={{color:"var(--text3)"}}>›</span>
                  </button>
                )}
                {!coachBioAvailable&&(
                  <div style={{padding:"10px 12px",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,fontSize:13,color:"var(--text3)",marginBottom:10}}>
                    ⚠️ Biometría no disponible en este dispositivo o navegador
                  </div>
                )}

                {coachSettingsMsg&&<p style={{textAlign:"center",fontSize:13,color:coachSettingsMsg.startsWith("✓")?"var(--gold)":"#ff5c5c",marginTop:8}}>{coachSettingsMsg}</p>}
              </>
            )}

            {/* VISTA CAMBIAR PIN */}
            {coachSettingsView==="password"&&(
              <>
                <div style={{fontSize:13,color:"var(--text3)",marginBottom:14,textAlign:"center"}}>Ingresá el PIN actual y el nuevo</div>
                <input className="login-input" type="tel" inputMode="numeric" placeholder="PIN actual (4 dígitos)" maxLength={4} autoFocus
                  value={coachNewPin} onChange={e=>setCoachNewPin(e.target.value.replace(/\D/g,"").slice(0,4))} style={{marginBottom:10}}/>
                <input className="login-input" type="tel" inputMode="numeric" placeholder="Nuevo PIN (4 dígitos)" maxLength={4}
                  value={coachNewPin2} onChange={e=>setCoachNewPin2(e.target.value.replace(/\D/g,"").slice(0,4))} style={{marginBottom:12}}/>
                {coachSettingsMsg&&<p style={{textAlign:"center",fontSize:13,color:coachSettingsMsg.startsWith("✓")?"var(--gold)":"#ff5c5c",marginBottom:10}}>{coachSettingsMsg}</p>}
                <button className="login-btn" onClick={async()=>{
                  if(coachNewPin!==PIN){setCoachSettingsMsg("PIN actual incorrecto");return;}
                  if(coachNewPin2.length!==4){setCoachSettingsMsg("El nuevo PIN debe tener 4 dígitos");return;}
                  await saveData('coach_pin',coachNewPin2);
                  setPIN(coachNewPin2);
                  setCoachNewPin("");setCoachNewPin2("");
                  setCoachSettingsMsg("✓ PIN actualizado");
                  setTimeout(()=>setCoachSettingsView("main"),1200);
                }}>Guardar PIN</button>
              </>
            )}
          </div>
        </div>
      )}

      {confirmDelete&&(
        <div className="modal-overlay" onClick={()=>setConfirmDelete(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            {confirmDelete.type==="resetpin"?(
              <>
                <p>¿Blanquear la contraseña de <strong>{confirmDelete.name}</strong>? La próxima vez que entre, va a tener que crear una contraseña nueva.</p>
                <div className="modal-actions">
                  <button className="btn-danger" onClick={async()=>{
                    try{ await db.updateUser(confirmDelete.id, {pin:null}); } catch(e){ console.error(e); }
                    setUsers(us=>us.map(x=>x.id===confirmDelete.id?{...x,pin:null}:x));
                    setConfirmDelete(null);
                  }}>Blanquear</button>
                  <button className="btn-ghost" onClick={()=>setConfirmDelete(null)}>Cancelar</button>
                </div>
              </>
            ):(
              <>
                <p>¿Seguro que querés eliminar <strong>{confirmDelete.name}</strong>?</p>
                <div className="modal-actions">
                  <button className="btn-danger" onClick={()=>deleteUser(confirmDelete.id)}>Eliminar</button>
                  <button className="btn-ghost" onClick={()=>setConfirmDelete(null)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab==="users"&&editRoutine&&(
        <div className="routine-editor">
          <div className="re-header">
            <h2>Rutina de {editRoutine.name}</h2>
            <button className="btn-ghost" onClick={()=>setEditRoutine(null)}><IconX/></button>
          </div>
          {validationMsg&&<div className="validation-toast">⚠ {validationMsg}</div>}

          {/* Day selector tabs */}
          <div className="re-day-tabs">
            {editRoutine.days.map((day,di)=>(
              <button key={di} className={`re-day-tab ${editDayIdx===di?"active":""}`} onClick={()=>setEditDayIdx(di)}>
                {day.day}
              </button>
            ))}
            <button className="re-day-tab add" onClick={()=>{ addDay(); setEditDayIdx(editRoutine.days.length); }} disabled={editRoutine.days.length>=7}>
              + Día
            </button>
          </div>

          {/* Active day editor */}
          {(()=>{
            const di=editDayIdx;
            const day=editRoutine.days[di];
            if(!day) return null;
            return (
              <div className="re-day">
                <div className="re-day-header">
                  <select className="re-day-name" value={day.day} onChange={e=>updateDayName(di,e.target.value)}>
                    {WEEK_DAYS.map(d=>(<option key={d} value={d} disabled={d!==day.day&&editRoutine.days.some((dd,idx)=>idx!==di&&dd.day===d)}>{d}</option>))}
                  </select>
                  {editRoutine.days.length>1&&(
                    <button className="btn-icon danger" onClick={()=>{ removeDay(di); setEditDayIdx(Math.max(0,di-1)); }}><IconTrash/></button>
                  )}
                </div>
                {day.blocks.map((block,bi)=>{
                  const isWarmup=block.type==="warmup";
                  return (
                    <div key={block.id||bi} className={`re-block ${isWarmup?"re-block-warmup":""}`}>
                      <div className="re-block-header">
                        <span className="re-block-icon">{isWarmup?<IconMove/>:<IconFire/>}</span>
                        <input className="re-block-name-input" value={block.name} placeholder={isWarmup?"Entrada en calor / Movilidad":`Bloque ${bi+1}`} onChange={e=>updateBlockName(di,bi,e.target.value)}/>
                        {!isWarmup&&day.blocks.length>2&&(<button className="btn-icon danger sm" onClick={()=>removeBlock(di,bi)}><IconTrash/></button>)}
                      </div>
                      {block.exercises.map((ex,ei)=>(
                        <div key={ei} className="re-exercise">
                          <div className="re-ex-row main">
                            <input className="re-field name" placeholder="Ejercicio" value={ex.name} onChange={e=>updateExercise(di,bi,ei,"name",e.target.value)}/>
                            {block.exercises.length>1&&(<button className="btn-icon danger sm" onClick={()=>removeExercise(di,bi,ei)}><IconTrash/></button>)}
                          </div>
                          <div className="re-ex-row nums">
                            <label>Series<select className="meas-select" value={ex.sets} onChange={e=>updateExercise(di,bi,ei,"sets",Number(e.target.value))}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
                            <label>Medición<select className="meas-select" value={ex.measType} onChange={e=>updateExercise(di,bi,ei,"measType",e.target.value)}><option value="reps">Repeticiones</option><option value="time">Tiempo (seg)</option></select></label>
                            {ex.measType==="reps"
                              ?<label>Reps (1–50)<input type="number" min="1" max="50" value={ex.reps} placeholder="xx" onChange={e=>handleRepsChange(di,bi,ei,e.target.value)}/></label>
                              :<label>Segundos<input inputMode="numeric" value={ex.secs} placeholder="xx" onChange={e=>handleSecsChange(di,bi,ei,e.target.value)}/></label>
                            }
                            <label>Descanso<select className="meas-select" value={ex.rest} onChange={e=>updateExercise(di,bi,ei,"rest",e.target.value)}>
                              <option value="-">Sin descanso</option><option value="30s">30s</option><option value="45s">45s</option><option value="60s">60s</option><option value="90s">90s</option><option value="120s">120s</option><option value="150s">150s</option><option value="180s">180s</option>
                            </select></label>
                          </div>
                          <input className="re-field notes" placeholder="Notas (opcional)" value={ex.notes} onChange={e=>updateExercise(di,bi,ei,"notes",e.target.value)}/>
                          {(()=>{
                            const wKey=`${di}-${bi}-${ei}`;
                            const weeks=ex.weeks||[mkWeek(),mkWeek(),mkWeek(),mkWeek()];
                            const rpe=ex.rpe||["","","",""];
                            const isSecsEx=ex.measType!=="reps";
                            return (
                              <div style={{marginTop:8}}>
                                <button type="button" onClick={()=>toggleWeeks(wKey)} style={{background:"none",border:"none",color:"var(--gold)",fontSize:12,fontWeight:600,cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:4}}>
                                  📅 Progresión semanal {expandedWeeks[wKey]?"▲":"▼"}
                                </button>
                                {expandedWeeks[wKey]&&(
                                  <div style={{marginTop:8,display:"flex",flexDirection:"column",gap:6,background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:10}}>
                                    {[0,1,2,3].map(wi=>(
                                      <div key={wi} style={{display:"grid",gridTemplateColumns:"64px 1fr 1fr 70px",gap:6,alignItems:"center"}}>
                                        <span style={{fontSize:11,color:"var(--text3)",fontWeight:700,textTransform:"uppercase"}}>Sem {wi+1}</span>
                                        <input className="re-field" placeholder={isSecsEx?"Segundos":"Reps"} value={weeks[wi].reps} onChange={e=>updateExerciseWeek(di,bi,ei,wi,"reps",e.target.value)} style={{margin:0}}/>
                                        <input className="re-field" placeholder="Kg" value={weeks[wi].kg} onChange={e=>updateExerciseWeek(di,bi,ei,wi,"kg",e.target.value)} style={{margin:0}}/>
                                        <input className="re-field" placeholder="RPE" value={rpe[wi]} onChange={e=>updateExerciseRPE(di,bi,ei,wi,e.target.value)} style={{margin:0}}/>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      ))}
                      {block.exercises.length<8&&(<button className="btn-add-ex" onClick={()=>addExercise(di,bi)}><IconPlus/> Agregar ejercicio al bloque {block.exercises.length>0?`(${block.exercises.length}/8)`:""}</button>)}
                      {block.exercises.length===8&&(<div className="block-max-note">Máximo de ejercicios por bloque alcanzado (8/8)</div>)}
                    </div>
                  );
                })}
                <button className="btn-add-block" onClick={()=>addBlock(di)}><IconPlus/> Agregar bloque</button>
              </div>
            );
          })()}

          <div className="re-footer">
            <button className="btn-save" onClick={saveRoutine}><IconCheck/> Guardar rutina</button>
            <button className="btn-ghost" onClick={()=>setEditRoutine(null)}>Cancelar</button>
          </div>
        </div>
      )}

      {tab==="users"&&!editRoutine&&(
        <div className="tab-content">
          <div className="tab-topbar">
            <h2>Alumnos <span className="count-badge">{users.length}</span></h2>
            <button className="btn-primary" onClick={()=>setShowNewUser(v=>!v)}><IconPlus/> Nuevo</button>
          </div>
          <div style={{marginBottom:14}}>
            <button className={`btn-sync${syncing?" spinning":""}`} disabled={syncing} onClick={syncWithDrive}>
              <span className="sync-icon"><IconRefresh/></span> {syncing?"Sincronizando...":"Sincronizar con Drive"}
            </button>
          </div>
          {syncMsg&&<div style={{fontSize:13,color:"var(--gold)",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",marginBottom:12}}>{syncMsg}</div>}

          {showNewUser&&(
            <div className="new-user-form">
              <input className="nu-input" placeholder="Nombre completo (tiene que coincidir con el nombre de la planilla en Drive)" value={newUserName} onChange={e=>setNewUserName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addUser()}/>
              <div className="nu-actions">
                <button className="btn-primary sm" onClick={addUser}><IconCheck/> Agregar</button>
                <button className="btn-ghost sm" onClick={()=>setShowNewUser(false)}>Cancelar</button>
              </div>
            </div>
          )}

          {/* Search bar */}
          <div style={{position:"relative",marginBottom:12}}>
            <input
              className="nu-input"
              placeholder="Buscar alumno..."
              value={userSearch}
              onChange={e=>{setUserSearch(e.target.value);setSelectedUser(null);setShowUserMenu(true);}}
              onFocus={e=>{ setShowUserMenu(true); const el=e.target; setTimeout(()=>el.scrollIntoView({behavior:"smooth",block:"center"}),300); }}
              onBlur={()=>setTimeout(()=>setShowUserMenu(false),150)}
              style={{width:"100%",boxSizing:"border-box"}}
            />
            {showUserMenu&&(
              <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:50,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,marginTop:4,maxHeight:220,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,.4)"}}>
                {users.filter(u=>u.name.toLowerCase().includes(userSearch.toLowerCase())).length===0&&(
                  <div style={{padding:"12px 16px",color:"var(--text3)",fontSize:13}}>Sin resultados</div>
                )}
                {users.filter(u=>u.name.toLowerCase().includes(userSearch.toLowerCase())).map(u=>(
                  <button key={u.id} style={{width:"100%",background:"none",border:"none",borderBottom:"1px solid var(--border)",padding:"11px 16px",textAlign:"left",cursor:"pointer",display:"flex",alignItems:"center",gap:10,color:"var(--text)"}}
                    onClick={()=>{setSelectedUser(u);setUserSearch('');setShowUserMenu(false);}}>
                    <div style={{width:32,height:32,borderRadius:"50%",overflow:"hidden",flexShrink:0,background:"var(--surface2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text3)"}}>
                      {photos[u.id]?<img src={photos[u.id]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<IconUser/>}
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:600}}>{u.name}</div>
                      <div style={{fontSize:11,color:u.active?"var(--green)":"var(--red)"}}>{u.active?"Activo":"Inactivo"}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected user card */}
          {selectedUser&&(()=>{
            const u=users.find(x=>x.id===selectedUser.id)||selectedUser;
            return(
              <div ref={selectedUserCardRef} className={`user-card ${u.active?"active":"inactive"}`}>
                <div className="uc-top">
                  <PhotoUploadBtn userId={u.id} currentPhoto={photos[u.id]} onSave={savePhoto}/>
                  <div className="uc-info">
                    <div className="uc-name">{u.name}</div>
                    <div className={`uc-status ${u.active?"on":"off"}`}>{u.active?"Activo":"Inactivo"}</div>
                  </div>
                  <div className="uc-actions">
                    <button className={`btn-toggle ${u.active?"on":"off"}`} onClick={()=>toggleUser(u.id)}>{u.active?<IconCheck/>:<IconLock/>}</button>
                    <button className="btn-icon danger" onClick={()=>setConfirmDelete({id:u.id,name:u.name,type:"user"})}><IconTrash/></button>
                  </div>
                </div>
                <div className="uc-routine" style={{flexDirection:"column",alignItems:"stretch",gap:8}}>
                  <span className="uc-rlabel">Rutina:</span>
                  {u.days&&u.days.length?(()=>{
                    const totalEx=u.days.reduce((a,d)=>a+d.blocks.reduce((b,bl)=>b+bl.exercises.length,0),0);
                    const totalBlocks=u.days.reduce((a,d)=>a+d.blocks.length,0);
                    return (
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
                        <div style={{fontSize:12,color:"var(--text3)"}}>{u.days.length} días · {totalBlocks} bloques · {totalEx} ejercicios</div>
                        <button className="btn-icon" onClick={()=>startNewRoutine(u)}><IconEdit/></button>
                      </div>
                    );
                  })():(
                    <button className="btn-ghost sm" onClick={()=>startNewRoutine(u)}><IconPlus/> Crear rutina</button>
                  )}
                </div>
                <div className="uc-routine" style={{justifyContent:"space-between"}}>
                  <span className="uc-rlabel">Cuota:</span>
                  <button className={`btn-toggle ${u.cuota!==false?"on":"off"}`} onClick={()=>toggleCuota(u.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",fontSize:12,fontWeight:700}}>
                    {u.cuota!==false?<><IconCheck/> Al día</>:<><IconX/> Debe cuota</>}
                  </button>
                </div>
                <div className="uc-routine" style={{justifyContent:"space-between"}}>
                  <span className="uc-rlabel">Contraseña:</span>
                  {u.pin?(
                    <button style={{background:"none",border:"1px solid var(--border)",color:"#ff5c5c",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6}} onClick={()=>setConfirmDelete({id:u.id,name:u.name,type:"resetpin"})}>
                      <IconLock/> Blanquear
                    </button>
                  ):(
                    <span style={{fontSize:12,color:"var(--text3)"}}>Sin registrar todavía</span>
                  )}
                </div>
              </div>
            );
          })()}

          {!selectedUser&&!userSearch&&(
            <div className="empty-state" style={{padding:"32px 0"}}>
              <IconUser/>
              <p>Buscá un alumno para ver su información</p>
            </div>
          )}
        </div>
      )}

      {tab==="info"&&(
        <div className="tab-content">
          <div className="tab-topbar"><h2>Info para alumnos</h2></div>
          <div style={{padding:"0 4px"}}>
            <label style={{display:"block",fontSize:12,color:"var(--text3)",letterSpacing:.5,marginBottom:6,textTransform:"uppercase",fontWeight:600}}>📢 Novedades</label>
            <textarea value={infoNovedad} onChange={e=>{setInfoNovedad(e.target.value);setInfoSaved(false);}} placeholder="Ej: Hoy el gimnasio permanece cerrado." rows={4}
              style={{width:"100%",boxSizing:"border-box",padding:"11px 14px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontSize:14,outline:"none",resize:"vertical",marginBottom:16,fontFamily:"inherit"}}/>
            <label style={{display:"block",fontSize:12,color:"var(--text3)",letterSpacing:.5,marginBottom:6,textTransform:"uppercase",fontWeight:600}}>🕐 Horarios</label>
            <textarea value={infoHorario} onChange={e=>{setInfoHorario(e.target.value);setInfoSaved(false);}} placeholder={"Ej:\nLunes a viernes: 7hs a 22hs\nSábados: 9hs a 14hs"} rows={4}
              style={{width:"100%",boxSizing:"border-box",padding:"11px 14px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface2)",color:"var(--text)",fontSize:14,outline:"none",resize:"vertical",marginBottom:16,fontFamily:"inherit"}}/>
            <button className="btn-primary" style={{width:"100%",justifyContent:"center"}} disabled={infoSaveStatus==='saving'} onClick={async()=>{
              setInfoSaveStatus('saving');
              const updated={novedad:infoNovedad,horario:infoHorario};
              setGymInfo(updated);
              try {
                await db.updateGymInfo({novedad:infoNovedad,horario:infoHorario});
                setInfoSaved(true);
                setInfoSaveStatus('done');
              } catch(e){
                console.error(e);
                setInfoSaveStatus(null);
              }
              setTimeout(()=>setInfoSaveStatus(null), 1300);
            }}>Guardar</button>
            {infoSaved&&infoSaveStatus===null&&<p style={{textAlign:"center",color:"var(--gold)",fontSize:13,marginTop:10}}>✓ Guardado</p>}
          </div>
        </div>
      )}

      {infoSaveStatus&&(
        <div className="rest-overlay">
          <div className="rest-box" style={{width:"80%",maxWidth:260,padding:28,textAlign:"center"}}>
            {infoSaveStatus==='saving'?(
              <>
                <div className="spin-icon" style={{display:"inline-flex",marginBottom:14,color:"var(--gold)"}}><IconRefresh size={34}/></div>
                <div style={{fontWeight:700,fontSize:15}}>Enviando...</div>
              </>
            ):(
              <>
                <div style={{fontSize:40,marginBottom:10,color:"var(--gold)"}}>✓</div>
                <div style={{fontWeight:700,fontSize:15}}>Enviado</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SplashScreen({ loaded }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      setProgress(p);
      if (p >= 100) clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, []);

  const R = 54, circ = 2 * Math.PI * R, rawDash = (progress / 100) * circ, dash = progress >= 100 ? circ + 1 : rawDash;

  return (
    <div style={{position:"fixed",inset:0,background:"linear-gradient(180deg,#1a1200 0%,#0d0d0d 60%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <img src="/gg-logo.png" alt="GG Training House" style={{width:"70%",maxWidth:280,height:"auto",marginBottom:40,animation:"splashLogoIn 0.8s cubic-bezier(.34,1.26,.64,1) both",filter:"drop-shadow(0 4px 24px rgba(180,130,30,0.5)) drop-shadow(0 0 40px rgba(245,197,24,0.3))",mixBlendMode:"screen"}}/>
      <div style={{position:"relative",width:128,height:128}}>
        <div style={{position:"absolute",inset:-16,borderRadius:"50%",background:"radial-gradient(circle, rgba(245,197,24,0.18) 0%, transparent 70%)",animation:"haloGlow 1.6s ease-in-out infinite"}}/>
        <svg width="128" height="128" viewBox="0 0 128 128" style={{position:"relative"}}>
          <circle cx="64" cy="64" r={R} fill="none" stroke="#1e1a0e" strokeWidth="7"/>
          <circle cx="64" cy="64" r={R} fill="none" stroke="url(#goldGrad)" strokeWidth="7" strokeDasharray={`${dash} ${circ}`} strokeLinecap="butt" transform="rotate(-90 64 64)" style={{transition:"stroke-dasharray 0.4s ease",filter:"drop-shadow(0 0 6px rgba(245,197,24,0.7))"}}/>
          <defs><linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#b8860b"/><stop offset="100%" stopColor="#f5c518"/></linearGradient></defs>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700,color:"#f5c518",letterSpacing:1}}>{Math.round(progress)}%</div>
      </div>
      <p style={{marginTop:20,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:3,textTransform:"uppercase",color:"#555",fontWeight:600}}>Cargando...</p>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&display=swap'); @keyframes splashLogoIn{from{opacity:0;transform:scale(0.82) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}} @keyframes haloGlow{0%,100%{opacity:0.4;transform:scale(0.92)}50%{opacity:1;transform:scale(1.08)}}`}</style>
    </div>
  );
}

function AppInner() {
  const [mode,setMode]=useState("member");
  const [users,setUsers]=useState([]);
  const [photos,setPhotos]=useState({});
  const [gymInfo,setGymInfo]=useState({});
  const [loaded,setLoaded]=useState(false);
  const [coachPin,setCoachPin]=useState("");
  const [pinError,setPinError]=useState(false);
  const [showPinModal,setShowPinModal]=useState(false);
  const [memberInside,setMemberInside]=useState(false);
  const [splashDone,setSplashDone]=useState(false);
  const splashStartTime=useRef(Date.now());
  const [PIN, setPIN] = useState("1234");
  const [showCoachSettings, setShowCoachSettings] = useState(false);
  const [coachBioAvailable, setCoachBioAvailable] = useState(false);
  const [coachBioRegistered, setCoachBioRegistered] = useState(false);
  const [coachNewPin, setCoachNewPin] = useState("");
  const [coachNewPin2, setCoachNewPin2] = useState("");
  const [coachSettingsMsg, setCoachSettingsMsg] = useState("");
  const [showCoachBioPrompt, setShowCoachBioPrompt] = useState(false);
  const [coachSessionTs, setCoachSessionTs] = useState(null);
  const COACH_SESSION_MS = 6*60*60*1000;

  useEffect(()=>{
    // If this is a fresh deploy (build id changed since last visit), reset any
    // "stay logged in" state so the app starts clean instead of jumping into
    // whatever tab/session was active before the update.
    try {
      const currentBuild = typeof __APP_BUILD__ !== "undefined" ? __APP_BUILD__ : null;
      const lastBuild = localStorage.getItem('app_build');
      if(currentBuild && lastBuild !== currentBuild){
        localStorage.removeItem('coach_session');
        localStorage.setItem('app_build', currentBuild);
      }
    } catch(e){}

    // Load coach PIN and biometric state
    loadData('coach_pin','1234').then(p=>setPIN(p));
    loadData('coach_bio_registered',false).then(v=>setCoachBioRegistered(!!v));
    if(window.PublicKeyCredential){
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(ok=>setCoachBioAvailable(ok)).catch(()=>{});
    }
    // Restore coach session if < 6 hours old
    loadData('coach_session', null).then(session=>{
      if(session && Date.now()-session.ts < COACH_SESSION_MS){
        setMode("coach");
        setCoachSessionTs(session.ts);
      } else if(session){
        saveData('coach_session', null);
      }
    });
  },[]);

  const startCoachSession=()=>{ const ts=Date.now(); saveData('coach_session', {ts}); setCoachSessionTs(ts); };
  const coachSessionValid=()=> coachSessionTs && (Date.now()-coachSessionTs < COACH_SESSION_MS);

  useEffect(()=>{
    (async()=>{
      const timeout = (ms)=>new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),ms));
      try {
        // Load from Supabase (bounded to 8s so the splash never hangs forever)
        const [supaUsers, supaGymInfo] = await Promise.race([
          Promise.all([ db.getUsers(), db.getGymInfo() ]),
          timeout(8000)
        ]);
        setUsers(supaUsers?.length ? supaUsers.map(u=>({
          id: u.id, name: u.name, active: u.active, cuota: u.cuota,
          photo: u.photo, startDate: u.start_date, days: u.days||[], driveFileId: u.drive_file_id, pin: u.pin
        })) : defaultUsers);
        setGymInfo(supaGymInfo || {});
      } catch(e) {
        console.error("No se pudo conectar con Supabase, usando datos por defecto.", e);
        setUsers(defaultUsers);
        setGymInfo({});
      }
      try { setPhotos(await loadData(KEYS.photos,{})); } catch(e) { setPhotos({}); }
      setLoaded(true);
    })();
  },[]);

  useEffect(()=>{
    if(loaded){
      // Wait for bar to finish (100 steps × 55ms = 5500ms) then extra pause
      setTimeout(()=>setSplashDone(true), 6000);
    }
  },[loaded]);

  const enterCoach=()=>{
    if(coachPin===PIN){
      setMode("coach");setShowPinModal(false);setCoachPin("");setPinError(false);
      startCoachSession();
      if(coachBioAvailable && !coachBioRegistered) setShowCoachBioPrompt(true);
    }
    else setPinError(true);
  };

  const enterCoachBio = async () => {
    try {
      const credIdB64 = await loadData('coach_bio_credid', null);
      if(!credIdB64) { setPinError(true); return; }
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      await navigator.credentials.get({
        publicKey: {
          challenge,
          allowCredentials: [{ id: Uint8Array.from(atob(credIdB64), c=>c.charCodeAt(0)), type: "public-key" }],
          userVerification: "required", timeout: 60000,
        }
      });
      setMode("coach"); setShowPinModal(false); setCoachPin(""); setPinError(false);
      startCoachSession();
    } catch(e) { setPinError(true); }
  };

  const registerCoachBio = async () => {
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const cred = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "GG Training House", id: location.hostname||"localhost" },
          user: { id: new TextEncoder().encode("coach"), name: "Profe", displayName: "Profe GG" },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
          authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
          timeout: 60000,
        }
      });
      const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
      await saveData('coach_bio_credid', credId);
      await saveData('coach_bio_registered', true);
      setCoachBioRegistered(true);
      setCoachSettingsMsg("✓ Biometría activada");
      setShowCoachBioPrompt(false);
    } catch(e) { setCoachSettingsMsg("Error al registrar biometría"); setShowCoachBioPrompt(false); }
  };

  if(!splashDone) return <SplashScreen loaded={loaded}/>;

  return(
    <>
      {showPinModal&&(
        <div className="pin-overlay">
          <div className="pin-box">
            <h3>Acceso Profe</h3>
            <p>Ingresá el PIN para continuar</p>
            {coachBioRegistered&&coachBioAvailable&&(
              <button style={{width:"100%",padding:"10px",background:"var(--surface2)",border:"1px solid var(--border)",color:"var(--text2)",borderRadius:8,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:10}} onClick={enterCoachBio}>
                🔐 Entrar con Face ID / Huella
              </button>
            )}
            <input className="pin-input" type="password" maxLength={4} value={coachPin}
              onChange={e=>{setCoachPin(e.target.value);setPinError(false)}}
              onKeyDown={e=>e.key==="Enter"&&enterCoach()} autoFocus placeholder="••••"/>
            <div className="pin-error">{pinError?"PIN incorrecto":""}</div>
            <div className="pin-actions">
              <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={enterCoach}>Entrar</button>
              <button className="btn-ghost" onClick={()=>{setShowPinModal(false);setCoachPin("");setPinError(false)}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {showCoachBioPrompt&&(
        <div className="pin-overlay">
          <div className="pin-box">
            <h3>Activar Face ID / Huella</h3>
            <p>¿Querés activar el acceso biométrico para entrar más rápido la próxima vez?</p>
            <div className="pin-actions">
              <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={registerCoachBio}>🔐 Activar ahora</button>
              <button className="btn-ghost" onClick={()=>setShowCoachBioPrompt(false)}>Ahora no</button>
            </div>
          </div>
        </div>
      )}
      <div className="app-shell">
        {!(mode==="coach" || (mode==="member" && memberInside)) && (
          <nav className="app-nav">
            <button className={`nav-btn ${mode==="member"?"active":""}`} onClick={()=>setMode("member")}><IconUser/> Mi Rutina</button>
            <button className={`nav-btn ${mode==="coach"?"active":""}`} onClick={()=>{if(mode==="coach")return; if(coachSessionValid()){setMode("coach");return;} setShowPinModal(true)}}><IconLock/> Panel Profe</button>
          </nav>
        )}
        {mode==="member"&&<MemberView users={users} setUsers={setUsers} photos={photos} setPhotos={setPhotos} gymInfo={gymInfo} onInsideChange={setMemberInside}/>}
        {mode==="coach"&&<CoachView users={users} setUsers={setUsers} photos={photos} setPhotos={setPhotos} gymInfo={gymInfo} setGymInfo={setGymInfo}
          showCoachSettings={showCoachSettings} setShowCoachSettings={setShowCoachSettings}
          coachSettingsMsg={coachSettingsMsg} setCoachSettingsMsg={setCoachSettingsMsg}
          coachNewPin={coachNewPin} setCoachNewPin={setCoachNewPin}
          coachNewPin2={coachNewPin2} setCoachNewPin2={setCoachNewPin2}
          PIN={PIN} setPIN={setPIN}
          coachBioAvailable={coachBioAvailable} coachBioRegistered={coachBioRegistered} setCoachBioRegistered={setCoachBioRegistered}
          registerCoachBio={registerCoachBio}
          onExit={()=>setMode("member")}
        />}
      </div>
    </>
  );
}

export default GGApp;
