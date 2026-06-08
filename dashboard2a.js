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
  // 상세한 한국 SVG 지도 (권역별 색상 구분)
  mapEl.innerHTML=`
  <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <defs>
      <filter id="glow2"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.4"/></filter>
    </defs>

    <!-- 배경 -->
    <rect width="200" height="260" fill="#0A0F1E"/>

    <!-- 한국 본토 상세 윤곽 (한강/낙동강/금강/섬진강 권역 구분) -->
    <!-- 경기·강원 (한강 수계) -->
    <path d="M75,14 L82,10 L92,11 L100,14 L108,13 L115,16 L122,20 L126,26 L128,32 L126,40 L122,46 L118,52 L120,58 L118,64 L113,68 L106,72 L100,75 L94,72 L88,68 L82,65 L76,62 L70,58 L68,52 L72,46 L74,40 L72,34 L73,28 Z" fill="#1E3A5F" stroke="#38BDF8" stroke-width="0.6" opacity="0.9"/>
    <!-- 충청 (금강 수계) -->
    <path d="M60,72 L70,68 L82,65 L88,68 L94,72 L100,75 L106,72 L113,68 L116,74 L114,82 L110,88 L106,92 L100,95 L94,92 L88,88 L80,86 L72,84 L64,80 L58,76 Z" fill="#1A2E40" stroke="#38BDF8" stroke-width="0.5" opacity="0.85"/>
    <!-- 전라 (섬진강 수계) -->
    <path d="M48,88 L58,84 L64,80 L72,84 L80,86 L88,88 L94,92 L100,95 L100,102 L96,108 L90,114 L84,118 L78,122 L70,126 L62,128 L54,124 L48,118 L44,112 L44,104 L46,96 Z" fill="#152835" stroke="#38BDF8" stroke-width="0.5" opacity="0.85"/>
    <!-- 경상 (낙동강 수계) -->
    <path d="M100,75 L106,72 L113,68 L118,64 L122,68 L126,74 L128,82 L126,90 L122,96 L118,102 L116,108 L114,114 L110,120 L106,126 L100,130 L96,126 L90,122 L90,114 L96,108 L100,102 L100,95 Z" fill="#1E2D40" stroke="#38BDF8" stroke-width="0.5" opacity="0.85"/>
    <!-- 남부해안 -->
    <path d="M62,128 L70,126 L78,128 L84,132 L90,134 L96,136 L100,138 L104,136 L110,132 L114,128 L116,122 L114,128 L110,134 L104,140 L96,144 L88,146 L80,144 L72,140 L64,136 L58,132 Z" fill="#152232" stroke="#38BDF8" stroke-width="0.5" opacity="0.8"/>
    <!-- 동해안 라인 -->
    <path d="M122,20 L128,26 L132,34 L134,42 L132,50 L130,58 L128,66 L126,74 L128,82" fill="none" stroke="#1E3A5F" stroke-width="0.4"/>

    <!-- 해안선 강조 -->
    <path d="M75,14 L82,10 L92,11 L100,14 L108,13 L115,16 L122,20 L126,26 L128,32 L126,40 L122,46 L118,52 L120,58 L118,64 L122,68 L126,74 L128,82 L126,90 L122,96 L118,102 L116,108 L114,114 L110,120 L114,128 L116,122 L114,128 L110,132 L104,136 L100,138 L96,136 L90,134 L84,132 L78,128 L72,140 L64,136 L58,132 L62,128 L54,124 L48,118 L44,112 L44,104 L46,96 L48,88 L58,84 L58,76 L60,72 L68,52 L72,46 L74,40 L72,34 L73,28 L75,14Z" fill="none" stroke="#38BDF8" stroke-width="0.8" opacity="0.6"/>

    <!-- 주요 강 -->
    <path d="M100,75 L90,68 L80,60 L72,54 L66,46" fill="none" stroke="#38BDF855" stroke-width="1.2"/>
    <path d="M100,95 L108,102 L114,108 L118,116 L116,124" fill="none" stroke="#38BDF844" stroke-width="1.0"/>
    <path d="M80,86 L70,92 L60,96 L54,104" fill="none" stroke="#38BDF844" stroke-width="0.9"/>

    <!-- 권역 레이블 -->
    <text x="96" y="44" text-anchor="middle" font-size="7" fill="#38BDF888" font-family="sans-serif">한강</text>
    <text x="80" y="84" text-anchor="middle" font-size="6.5" fill="#38BDF877" font-family="sans-serif">금강</text>
    <text x="68" y="108" text-anchor="middle" font-size="6.5" fill="#38BDF877" font-family="sans-serif">섬진강</text>
    <text x="114" y="95" text-anchor="middle" font-size="6.5" fill="#38BDF877" font-family="sans-serif">낙동강</text>

    <!-- 제주도 -->
    <ellipse cx="84" cy="168" rx="16" ry="7" fill="#152232" stroke="#38BDF8" stroke-width="0.6" opacity="0.8"/>
    <text x="84" y="170" text-anchor="middle" font-size="5.5" fill="#38BDF877" font-family="sans-serif">제주</text>

    <!-- 댐 마커 -->
    <g id="damMarkers2"></g>

    <!-- 범례 -->
    <rect x="4" y="180" width="80" height="72" fill="#111827CC" rx="6" stroke="#21262D" stroke-width="0.5"/>
    <text x="10" y="192" font-size="6.5" fill="#64748B" font-family="sans-serif" font-weight="bold">저수율 범례</text>
    <circle cx="14" cy="202" r="5" fill="#10B981" opacity="0.85"/>
    <text x="23" y="205" font-size="6" fill="#94A3B8" font-family="sans-serif">60% 이상 (안정)</text>
    <circle cx="14" cy="216" r="5" fill="#F59E0B" opacity="0.85"/>
    <text x="23" y="219" font-size="6" fill="#94A3B8" font-family="sans-serif">40~60% (주의)</text>
    <circle cx="14" cy="230" r="5" fill="#EF4444" opacity="0.85"/>
    <text x="23" y="233" font-size="6" fill="#94A3B8" font-family="sans-serif">40% 미만 (위험)</text>
    <text x="10" y="246" font-size="5.5" fill="#38BDF8" font-family="sans-serif">🏭= 공업용수 공급댐</text>
  </svg>`;
  // 댐 마커 추가
  const svg=mapEl.querySelector('svg');
  const markersG=mapEl.querySelector('#damMarkers2');
  const filtered=Object.keys(DAM_META).filter(n=>selBasin==='all'||DAM_META[n].basin===selBasin);
  filtered.forEach(name=>{
    const meta=DAM_META[name];
    const rate=getBestRate(name);
    const clr=getRateColor(rate||50);
    // SVG viewBox 200x260 기준
    const x=meta.svgX*200/100;
    const y=meta.svgY*260/100;
    const isSel=selDam===name;
    const g=document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','dam-marker');
    g.style.cursor='pointer';

    const outerCircle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    outerCircle.setAttribute('cx',x); outerCircle.setAttribute('cy',y);
    outerCircle.setAttribute('r',isSel?12:9);
    outerCircle.setAttribute('fill',clr); outerCircle.setAttribute('opacity','0.25');

    const innerCircle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    innerCircle.setAttribute('cx',x); innerCircle.setAttribute('cy',y);
    innerCircle.setAttribute('r',isSel?8:6);
    innerCircle.setAttribute('fill',clr); innerCircle.setAttribute('opacity','0.9');
    innerCircle.setAttribute('filter','url(#glow2)');
    if(isSel){innerCircle.setAttribute('stroke','#fff');innerCircle.setAttribute('stroke-width','1.5');}

    const rateText=document.createElementNS('http://www.w3.org/2000/svg','text');
    rateText.setAttribute('x',x); rateText.setAttribute('y',y+2.5);
    rateText.setAttribute('text-anchor','middle');
    rateText.setAttribute('font-size','5'); rateText.setAttribute('fill','#fff');
    rateText.setAttribute('font-weight','bold');
    rateText.textContent=rate?rate+'%':'?';

    const nameText=document.createElementNS('http://www.w3.org/2000/svg','text');
    nameText.setAttribute('x',x); nameText.setAttribute('y',y-12);
    nameText.setAttribute('text-anchor','middle');
    nameText.setAttribute('font-size','5.5'); nameText.setAttribute('fill','#CBD5E1');
    nameText.textContent=name;

    // 공업용수 표시
    if(meta.industrial){
      const indText=document.createElementNS('http://www.w3.org/2000/svg','text');
      indText.setAttribute('x',x+10); indText.setAttribute('y',y-5);
      indText.setAttribute('font-size','6'); indText.setAttribute('fill','#F59E0B');
      indText.textContent='🏭';
      g.appendChild(indText);
    }

    g.appendChild(outerCircle); g.appendChild(innerCircle);
    g.appendChild(rateText); g.appendChild(nameText);

    g.addEventListener('click',()=>selectDam(name));
    g.addEventListener('mouseenter',(e)=>{
      const rect=mapEl.getBoundingClientRect();
      const tt=document.getElementById('damTooltip');
      tt.innerHTML=`<b style="font-size:13px">${name}댐</b><br>저수율: <b style="color:${clr};font-size:14px">${rate||'?'}%</b><br><span style="font-size:11px;color:#94A3B8">${meta.cap.toLocaleString()}백만㎥</span><br><span style="font-size:10px;color:#64748B">${meta.note}</span>`;
      const svgRect=mapEl.querySelector('svg').getBoundingClientRect();
      const scaleX=svgRect.width/200, scaleY=svgRect.height/260;
      tt.style.left=(x*scaleX+20)+'px'; tt.style.top=(y*scaleY-30)+'px';
      tt.classList.add('show');
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

