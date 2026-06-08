// ════ PAGE 3: 용수·댐 ════
function getBestRate(name){return damsData?.[name]?.rate||DAM_HIST[name]?.[2024]||null;}
function getRateColor(r){return r>=60?'#10B981':r>=40?'#F59E0B':'#EF4444';}

function initWater(){
  const dates=Object.values(damsData).map(d=>d?.date).filter(Boolean);
  const latestDate=dates.length?dates[0]:'2024-12-31(내장)';
  document.getElementById('damNotice').textContent=`💧 댐 저수율 기준: ${latestDate} · GitHub Actions 매일 자동 수집 · K-water 공공데이터포털`;
  renderKoreaMap(); renderDamList(); drawAllDam(); buildDamTable(); buildDroughtTimeline();
}

function renderKoreaMap(){
  const mapEl=document.getElementById('koreaMap');
  const DAM_COORDS={
    '소양강':{cx:210,cy:72},'충주':{cx:175,cy:108},'횡성':{cx:200,cy:88},
    '안동':{cx:232,cy:140},'합천':{cx:196,cy:198},'남강':{cx:182,cy:218},
    '밀양':{cx:228,cy:206},'대청':{cx:148,cy:150},'보령':{cx:108,cy:160},
    '용담':{cx:150,cy:172},'주암':{cx:148,cy:240},'섬진강':{cx:168,cy:212},
  };
  mapEl.innerHTML=`
  <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <defs><filter id="glow2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <rect width="300" height="380" fill="#0A0F1E"/>
    <path d="M100,20 L120,14 L145,15 L165,18 L185,16 L205,20 L222,28 L232,38 L238,52 L235,68 L228,82 L220,94 L215,108 L210,120 L200,128 L188,132 L175,130 L162,126 L150,128 L138,124 L126,118 L115,110 L105,100 L98,88 L95,74 L98,58 L100,42 Z" fill="#1A3050" stroke="#38BDF8" stroke-width="1" opacity="0.9"/>
    <path d="M95,100 L105,100 L115,110 L126,118 L138,124 L150,128 L162,126 L175,130 L188,132 L200,128 L210,120 L215,136 L212,152 L205,164 L195,172 L182,176 L168,174 L155,170 L140,168 L125,164 L110,158 L98,150 L90,138 L90,122 Z" fill="#152840" stroke="#38BDF8" stroke-width="0.8" opacity="0.88"/>
    <path d="M90,150 L98,150 L110,158 L125,164 L140,168 L155,170 L168,174 L168,190 L165,208 L158,224 L148,236 L135,246 L120,252 L105,254 L90,250 L78,242 L70,230 L68,216 L70,202 L75,188 L80,174 L84,162 Z" fill="#122535" stroke="#38BDF8" stroke-width="0.8" opacity="0.88"/>
    <path d="M175,130 L188,132 L200,128 L215,136 L225,148 L232,162 L235,178 L232,194 L225,208 L215,220 L208,232 L200,244 L190,252 L178,256 L165,254 L155,248 L148,236 L158,224 L165,208 L168,190 L168,174 L182,176 L195,172 L205,164 L212,152 L215,136 Z" fill="#162038" stroke="#38BDF8" stroke-width="0.8" opacity="0.88"/>
    <path d="M105,254 L120,252 L135,246 L148,236 L155,248 L165,254 L178,256 L190,252 L200,244 L205,258 L195,268 L180,274 L162,276 L145,274 L128,268 L114,262 Z" fill="#101E2E" stroke="#38BDF8" stroke-width="0.7" opacity="0.8"/>
    <path d="M100,20 L120,14 L145,15 L165,18 L185,16 L205,20 L222,28 L232,38 L238,52 L235,68 L228,82 L220,94 L225,108 L232,122 L238,138 L238,155 L235,172 L232,190 L228,208 L220,224 L210,238 L205,258 L195,268 L180,274 L162,276 L145,274 L128,268 L114,262 L105,254 L90,250 L78,242 L70,230 L68,216 L70,202 L75,188 L80,174 L84,162 L90,150 L90,138 L90,122 L95,100 L98,88 L95,74 L98,58 L100,42 Z" fill="none" stroke="#38BDF8" stroke-width="1.2" opacity="0.5"/>
    <path d="M175,130 L165,118 L150,104 L132,88 L115,72 L100,56" fill="none" stroke="#38BDF855" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M195,172 L205,190 L215,208 L220,226 L218,244" fill="none" stroke="#38BDF844" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M155,170 L138,182 L120,192 L105,200 L92,214" fill="none" stroke="#38BDF844" stroke-width="1.4" stroke-linecap="round"/>
    <text x="170" y="85" text-anchor="middle" font-size="11" fill="#38BDF866" font-family="sans-serif" font-weight="bold">한강</text>
    <text x="148" y="148" text-anchor="middle" font-size="10" fill="#38BDF855" font-family="sans-serif" font-weight="bold">금강</text>
    <text x="108" y="210" text-anchor="middle" font-size="10" fill="#38BDF855" font-family="sans-serif" font-weight="bold">섬진강</text>
    <text x="210" y="185" text-anchor="middle" font-size="10" fill="#38BDF855" font-family="sans-serif" font-weight="bold">낙동강</text>
    <ellipse cx="148" cy="316" rx="32" ry="14" fill="#122535" stroke="#38BDF8" stroke-width="0.8" opacity="0.85"/>
    <text x="148" y="318" text-anchor="middle" font-size="9" fill="#38BDF877" font-family="sans-serif">제주도</text>
    <g id="damMarkers2"></g>
    <rect x="6" y="288" width="115" height="82" fill="#111827DD" rx="8" stroke="#21262D" stroke-width="0.8"/>
    <text x="14" y="303" font-size="9.5" fill="#94A3B8" font-family="sans-serif" font-weight="bold">저수율 범례</text>
    <circle cx="20" cy="316" r="7" fill="#10B981" opacity="0.85"/>
    <text x="32" y="320" font-size="8.5" fill="#94A3B8" font-family="sans-serif">60% 이상 (안정)</text>
    <circle cx="20" cy="334" r="7" fill="#F59E0B" opacity="0.85"/>
    <text x="32" y="338" font-size="8.5" fill="#94A3B8" font-family="sans-serif">40~60% (주의)</text>
    <circle cx="20" cy="352" r="7" fill="#EF4444" opacity="0.85"/>
    <text x="32" y="356" font-size="8.5" fill="#94A3B8" font-family="sans-serif">40% 미만 (위험)</text>
    <text x="14" y="366" font-size="8" fill="#F59E0B" font-family="sans-serif">🏭 공업용수 공급댐</text>
  </svg>`;
  const markersG=mapEl.querySelector('#damMarkers2');
  const filtered=Object.keys(DAM_META).filter(n=>selBasin==='all'||DAM_META[n].basin===selBasin);
  filtered.forEach(name=>{
    const meta=DAM_META[name];
    const coords=DAM_COORDS[name];
    if(!coords) return;
    const rate=getBestRate(name);
    const clr=getRateColor(rate||50);
    const cx=coords.cx, cy=coords.cy;
    const isSel=selDam===name;
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.style.cursor='pointer';
    const outer=document.createElementNS('http://www.w3.org/2000/svg','circle');
    outer.setAttribute('cx',cx);outer.setAttribute('cy',cy);outer.setAttribute('r',isSel?16:12);outer.setAttribute('fill',clr);outer.setAttribute('opacity','0.2');
    const inner=document.createElementNS('http://www.w3.org/2000/svg','circle');
    inner.setAttribute('cx',cx);inner.setAttribute('cy',cy);inner.setAttribute('r',isSel?11:8);inner.setAttribute('fill',clr);inner.setAttribute('opacity','0.92');inner.setAttribute('filter','url(#glow2)');
    if(isSel){inner.setAttribute('stroke','#fff');inner.setAttribute('stroke-width','2');}
    const rt=document.createElementNS('http://www.w3.org/2000/svg','text');
    rt.setAttribute('x',cx);rt.setAttribute('y',cy+3.5);rt.setAttribute('text-anchor','middle');rt.setAttribute('font-size','7');rt.setAttribute('fill','#fff');rt.setAttribute('font-weight','bold');
    rt.textContent=rate?rate+'%':'?';
    const nt=document.createElementNS('http://www.w3.org/2000/svg','text');
    nt.setAttribute('x',cx);nt.setAttribute('y',cy-15);nt.setAttribute('text-anchor','middle');nt.setAttribute('font-size','7.5');nt.setAttribute('fill','#CBD5E1');nt.setAttribute('font-weight','600');
    nt.textContent=name;
    if(meta.industrial){const it=document.createElementNS('http://www.w3.org/2000/svg','text');it.setAttribute('x',cx+13);it.setAttribute('y',cy-7);it.setAttribute('font-size','9');it.setAttribute('fill','#F59E0B');it.textContent='🏭';g.appendChild(it);}
    g.appendChild(outer);g.appendChild(inner);g.appendChild(rt);g.appendChild(nt);
    g.addEventListener('click',()=>selectDam(name));
    g.addEventListener('mouseenter',()=>{
      const tt=document.getElementById('damTooltip');
      const svgRect=mapEl.querySelector('svg').getBoundingClientRect();
      const sx=svgRect.width/300, sy=svgRect.height/380;
      tt.innerHTML=`<b style="font-size:13px">${name}댐</b><br>저수율: <b style="color:${clr};font-size:15px">${rate||'?'}%</b><br><span style="font-size:11px;color:#94A3B8">${meta.cap.toLocaleString()}백만㎥</span><br><span style="font-size:10px;color:#64748B">${meta.note}</span>`;
      tt.style.left=(cx*sx+20)+'px';tt.style.top=Math.max(0,cy*sy-50)+'px';tt.classList.add('show');
    });
    g.addEventListener('mouseleave',()=>{document.getElementById('damTooltip').classList.remove('show');});
    markersG.appendChild(g);
  });
}

function renderDamList(){
  const filtered=Object.keys(DAM_META).filter(n=>selBasin==='all'||DAM_META[n].basin===selBasin);
  document.getElementById('damList').innerHTML=filtered.map(name=>{
    const meta=DAM_META[name];
    const r=getBestRate(name);
    const rc=getRateColor(r||50);
    const bc=r>=60?'db-ok':r>=40?'db-w':'db-d';
    const bt=r>=60?'안정':r>=40?'주의':'위험';
    const basinName=meta.basin==='han'?'한강':meta.basin==='nak'?'낙동강':meta.basin==='geum'?'금강':'섬진강';
    return `<div class="dam-item${selDam===name?' sel':''}" onclick="selectDam('${name}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div class="dam-item-name">${name}댐</div>
        <span style="font-size:10px;color:var(--muted)">${basinName}</span>
      </div>
      <div class="dam-item-rate" style="color:${rc}">${r!==null?r+'%':'—'}</div>
      <div class="dam-item-info">${meta.cap.toLocaleString()}백만㎥ · ${meta.note}</div>
      <div style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap;">
        <span class="dbadge ${bc}">${bt}</span>
        ${meta.industrial?'<span class="dbadge db-w">🏭공업</span>':''}
        ${meta.drought.length?'<span class="dbadge db-d">⚠️가뭄이력</span>':''}
      </div>
    </div>`;
  }).join('');
}

function setBasin(b,el){selBasin=b;document.querySelectorAll('#pg-water .tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');renderKoreaMap();renderDamList();}

function selectDam(name){selDam=name;renderKoreaMap();renderDamList();drawDamDetail(name);document.getElementById('damRateTitle').textContent=`${name}댐 — 연도별 저수율`;}

function drawDamDetail(name){
  const hist=DAM_HIST[name]||{};
  const live=damsData?.[name]?.rate;
  const yrs=Object.keys(hist).map(Number).sort((a,b)=>a-b);
  const vals=yrs.map(y=>hist[y]);
  const thisY=new Date().getFullYear();
  if(live&&!hist[thisY]){yrs.push(thisY);vals.push(live);}
  const colors=vals.map(v=>getRateColor(v)+'99');
  const borders=vals.map(v=>getRateColor(v));
  if(charts.damRate)charts.damRate.destroy();
  charts.damRate=new Chart(document.getElementById('damRateC').getContext('2d'),{type:'bar',data:{labels:yrs,datasets:[{data:vals,backgroundColor:colors,borderColor:borders,borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{label:c=>`  저수율: ${c.raw}%`}}},scales:{x:{grid:{display:false},ticks:{color:'#64748B',font:{family:'DM Mono',size:10}}},y:{grid:{color:'rgba(255,255,255,.04)'},max:100,ticks:{color:'#64748B',font:{family:'DM Mono',size:10},callback:v=>v+'%'}}}}});
}

function drawAllDam(){
  const major=['소양강','충주','안동','대청','보령','주암'];
  const cols=['#3B82F6','#10B981','#F59E0B','#A78BFA','#EF4444','#06B6D4'];
  if(charts.allDam)charts.allDam.destroy();
  charts.allDam=new Chart(document.getElementById('allDamC').getContext('2d'),{type:'bar',data:{labels:major,datasets:[{data:major.map(n=>getBestRate(n)||0),backgroundColor:major.map((n,i)=>cols[i]+'CC'),borderColor:major.map((n,i)=>cols[i]),borderWidth:1.5,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{label:c=>`  ${c.label}댐: ${c.raw}%`}}},scales:{x:{grid:{display:false},ticks:{color:'#F1F5F9',font:{family:'Noto Sans KR',size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},max:100,ticks:{color:'#64748B',font:{family:'DM Mono',size:10},callback:v=>v+'%'}}}}});
}

function buildDamTable(){
  const rows=Object.keys(DAM_META).map(name=>{
    const meta=DAM_META[name];
    const r=getBestRate(name);
    const rc=r>=60?'color:#10B981':r>=40?'color:#F59E0B':'color:#EF4444;font-weight:700';
    const hasDrought=meta.drought.length>0;
    const drought=hasDrought?meta.drought.map(d=>`<span class="dbadge ${d.includes('심각')?'db-d':'db-w'}">${d}</span>`).join(' '):'<span style="color:#10B981;font-size:10px">이력없음</span>';
    const searchBtn=`<button onclick="openNewsSearch('${name}')" style="padding:3px 9px;border-radius:12px;border:1px solid ${hasDrought?'#F59E0B':'#2A2E38'};background:${hasDrought?'rgba(245,158,11,.12)':'rgba(56,189,248,.06)'};color:${hasDrought?'#F59E0B':'#64748B'};font-size:10px;cursor:pointer;font-family:'Noto Sans KR',sans-serif;transition:all .2s;white-space:nowrap;" onmouseover="this.style.background='rgba(56,189,248,.15)';this.style.borderColor='#38BDF8';this.style.color='#38BDF8'" onmouseout="this.style.background='${hasDrought?'rgba(245,158,11,.12)':'rgba(56,189,248,.06)'}';this.style.borderColor='${hasDrought?'#F59E0B':'#2A2E38'}';this.style.color='${hasDrought?'#F59E0B':'#64748B'}'">🔍 관련 뉴스</button>`;
    return `<tr style="border-bottom:1px solid var(--border);transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.03)'" onmouseout="this.style.background='transparent'">
      <td style="padding:9px 10px;font-weight:700;font-size:12px">${name}댐${meta.industrial?' 🏭':''}</td>
      <td style="padding:9px 6px;font-size:12px">${meta.basin==='han'?'한강':meta.basin==='nak'?'낙동강':meta.basin==='geum'?'금강':'섬진강'}</td>
      <td style="padding:9px 6px;text-align:right;font-size:12px">${meta.cap.toLocaleString()}</td>
      <td style="padding:9px 6px;${rc};font-family:'DM Mono',monospace;font-weight:700;font-size:13px">${r!==null?r+'%':'—'}</td>
      <td style="padding:9px 6px">${drought}</td>
      <td style="padding:9px 6px">${searchBtn}</td>
    </tr>`;
  }).join('');
  document.getElementById('damTableWrap').innerHTML=`<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="background:rgba(56,189,248,.08);color:var(--accent)"><th style="padding:9px 10px;text-align:left">댐명</th><th style="padding:9px 6px">권역</th><th style="padding:9px 6px;text-align:right">총저수(백만㎥)</th><th style="padding:9px 6px">저수율</th><th style="padding:9px 6px;text-align:left">가뭄이력</th><th style="padding:9px 6px">뉴스</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function buildDroughtTimeline(){
  document.getElementById('droughtTimeline').innerHTML=`
    <div style="display:grid;grid-template-columns:100px 110px 1fr auto;gap:0;font-size:12px;font-weight:700;color:var(--muted);padding:8px 12px;border-bottom:2px solid var(--border);">
      <span>연도</span><span>수준</span><span>지역</span><span>출처</span>
    </div>
    ${DROUGHT_CASES.map(c=>`
    <div class="drought-row">
      <div class="drought-year">${c.year}</div>
      <div><span class="drought-level ${c.level==='severe'?'dl-severe':c.level==='warn'?'dl-warn':'dl-mild'}">${c.level==='severe'?'심각':c.level==='warn'?'경계·주의':'관심'}</span></div>
      <div>
        <div class="drought-region">${c.region}</div>
        <div class="drought-desc">${c.desc}</div>
      </div>
      <div><a href="${c.link}" target="_blank" class="drought-link">상세 →</a></div>
    </div>`).join('')}`;
}

function openNewsSearch(damName){
  const meta=DAM_META[damName];
  const query=`${damName}댐 가뭄`;
  const existing=document.getElementById('newsModal');
  if(existing)existing.remove();
  const modal=document.createElement('div');
  modal.id='newsModal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  const links=[
    {icon:'🔵',label:'네이버 뉴스',url:`https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(query)}&sort=1`,desc:'최신순 뉴스'},
    {icon:'🔴',label:'유튜브',url:`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,desc:'관련 영상'},
    {icon:'🌐',label:'구글 뉴스',url:`https://news.google.com/search?q=${encodeURIComponent(query)}&hl=ko`,desc:'구글 뉴스'},
    {icon:'💧',label:'K-water 보도자료',url:'https://www.kwater.or.kr/news/repoList.do?s_mid=36',desc:'K-water 공식'},
    {icon:'🌿',label:'기후에너지환경부',url:'https://www.mcee.go.kr/home/web/index.do?menuId=10525',desc:'기후부 보도자료'},
    {icon:'📊',label:'국가가뭄정보포털',url:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1',desc:'가뭄 통계·사례'},
  ];
  const r=getBestRate(damName);
  const clr=getRateColor(r||50);
  modal.innerHTML=`<div style="background:#111827;border:1px solid #21262D;border-radius:14px;width:100%;max-width:540px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.6)">
    <div style="background:#1E293B;padding:18px 20px;display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid #21262D">
      <div><div style="font-size:18px;font-weight:900;color:#F1F5F9;margin-bottom:4px">💧 ${damName}댐 가뭄 관련 뉴스</div><div style="font-size:11px;color:#64748B;font-family:monospace">검색어: ${query}</div><div style="margin-top:8px">${meta.drought.length?meta.drought.map(d=>`<span class="dbadge ${d.includes('심각')?'db-d':'db-w'}" style="font-size:11px;padding:3px 10px">${d}</span>`).join(' '):'<span style="color:#10B981;font-size:12px">가뭄이력 없음</span>'}</div></div>
      <button onclick="document.getElementById('newsModal').remove()" style="background:transparent;border:none;color:#64748B;font-size:20px;cursor:pointer;padding:0;line-height:1">✕</button>
    </div>
    ${meta.drought.length?`<div style="padding:12px 20px;background:rgba(239,68,68,.06);border-bottom:1px solid #21262D;font-size:12px;color:#94A3B8;line-height:1.6">📌 <b style="color:#F1F5F9">${damName}댐</b> · ${meta.cap.toLocaleString()}백만㎥ · 현재 저수율 <b style="color:${clr};font-size:13px">${r||'—'}%</b><br>${meta.note}</div>`:''}
    <div style="padding:12px 16px">${links.map(lk=>`<a href="${lk.url}" target="_blank" style="display:flex;align-items:center;gap:12px;padding:11px 14px;margin-bottom:6px;background:#1C2433;border:1px solid #21262D;border-radius:8px;text-decoration:none;transition:all .15s;" onmouseover="this.style.borderColor='#38BDF8';this.style.background='rgba(56,189,248,.07)'" onmouseout="this.style.borderColor='#21262D';this.style.background='#1C2433'"><span style="font-size:20px">${lk.icon}</span><div style="flex:1"><div style="font-size:13px;font-weight:700;color:#F1F5F9">${lk.label}</div><div style="font-size:10px;color:#64748B;margin-top:2px">${lk.desc}</div></div><span style="color:#38BDF8;font-size:12px">→</span></a>`).join('')}</div>
    <div style="padding:12px 20px;border-top:1px solid #21262D;text-align:center"><button onclick="document.getElementById('newsModal').remove()" style="padding:8px 24px;background:rgba(56,189,248,.1);border:1px solid rgba(56,189,248,.3);color:#38BDF8;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;font-family:'Noto Sans KR',sans-serif">닫기</button></div>
  </div>`;
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
  document.body.appendChild(modal);
}

