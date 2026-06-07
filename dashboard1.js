const TTP={backgroundColor:'#1E293B',borderColor:'rgba(255,255,255,.1)',borderWidth:1};
const DATA_URL="./data/dashboard_data.json";

// ════ 댐 메타 ════
const DAM_META={
  '소양강':{basin:'han',cap:2900,industrial:false,drought:['2015경계','2017주의'],note:'수도권 최대 용수원',svgX:67,svgY:22},
  '충주':  {basin:'han',cap:2750,industrial:true, drought:['2015경계'],note:'수도권·충청 공업용수',svgX:61,svgY:32},
  '횡성':  {basin:'han',cap:87,  industrial:true, drought:[],note:'강원 공업용수',svgX:64,svgY:27},
  '안동':  {basin:'nak',cap:1248,industrial:true, drought:['2022경계','2023경계'],note:'경북 공업단지 수원',svgX:75,svgY:36},
  '합천':  {basin:'nak',cap:790, industrial:false,drought:['2022주의'],note:'경남 농업·생활용수',svgX:66,svgY:47},
  '남강':  {basin:'nak',cap:309, industrial:true, drought:[],note:'창원·진주 공업용수',svgX:64,svgY:52},
  '밀양':  {basin:'nak',cap:74,  industrial:true, drought:[],note:'밀양·양산',svgX:76,svgY:50},
  '대청':  {basin:'geum',cap:1490,industrial:true,drought:['2015경계','2022주의'],note:'대전·충청 산단 수원',svgX:55,svgY:38},
  '보령':  {basin:'geum',cap:116,industrial:true,drought:['2015심각','2016심각','2022경계'],note:'⚠️ 반복 가뭄 취약',svgX:43,svgY:40},
  '용담':  {basin:'geum',cap:815,industrial:true,drought:['2022주의'],note:'군산·익산 공업',svgX:56,svgY:45},
  '주암':  {basin:'sum', cap:457,industrial:true,drought:['2022경계','2023심각'],note:'⚠️ 광양·여수 산단',svgX:50,svgY:59},
  '섬진강':{basin:'sum', cap:467,industrial:false,drought:['2022경계'],note:'남해안 농업용수',svgX:52,svgY:52},
};
const DAM_HIST={
  '소양강':{2018:52,2019:48,2020:61,2021:67,2022:55,2023:63,2024:71},
  '충주':  {2018:58,2019:51,2020:66,2021:72,2022:59,2023:68,2024:74},
  '안동':  {2018:45,2019:38,2020:52,2021:58,2022:42,2023:60,2024:67},
  '대청':  {2018:55,2019:48,2020:62,2021:68,2022:50,2023:65,2024:69},
  '보령':  {2018:44,2019:35,2020:50,2021:55,2022:28,2023:47,2024:38},
  '주암':  {2018:58,2019:50,2020:63,2021:69,2022:40,2023:52,2024:71},
  '합천':  {2018:50,2019:44,2020:57,2021:62,2022:46,2023:55,2024:64},
  '남강':  {2018:60,2019:55,2020:68,2021:73,2022:58,2023:66,2024:70},
  '용담':  {2018:62,2019:55,2020:68,2021:74,2022:54,2023:67,2024:72},
  '섬진강':{2018:55,2019:48,2020:60,2021:65,2022:38,2023:54,2024:68},
  '횡성':  {2018:72,2019:68,2020:75,2021:80,2022:65,2023:74,2024:78},
  '밀양':  {2018:65,2019:58,2020:70,2021:75,2022:60,2023:68,2024:72},
};

// ════ 국내 가뭄 사례 ════
const DROUGHT_CASES=[
  {year:'2022~2023',level:'severe',region:'전남(주암·섬진강댐)',
   desc:'2022년 주암댐 저수율 40% → 역대 최저. 2023년 광양·여수 산단 용수 비상. 섬진강댐 연속 2년 경계 이하.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'2022',level:'warn',region:'충남(보령댐)·경북(안동댐)',
   desc:'보령댐 경계 단계 발령. 안동댐 저수율 42%로 급락. 충남 서부 공업단지 용수 공급 일부 제한.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'2015~2016',level:'severe',region:'충남(보령댐) 심각',
   desc:'보령댐 저수율 14.3% 역대 최저(2015.11). 충남 서부 6개 시군 제한급수. 정부 비상대책위 가동. 피해액 추정 수천억 원.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'2014~2015',level:'warn',region:'전국(강원·경기·충청 중심)',
   desc:'장기 가뭄으로 소양강댐 저수율 30%대. 농업용수 부족 심화. 일부 지역 생활용수 제한 공급.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'2012',level:'warn',region:'남부(낙동강 수계)',
   desc:'낙동강 수계 댐 저수율 평균 45% 이하. 합천·남강댐 주의 단계. 경남 농업용수 공급 차질.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'2009',level:'warn',region:'전남·경남(섬진강 수계)',
   desc:'섬진강댐 저수율 급감. 남해안 농업용수 부족. 기후변화에 따른 봄 가뭄 반복 패턴 본격화.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'2001',level:'severe',region:'전국 (역대 최대 피해)',
   desc:'전국 가뭄 역대 최대 피해. 농경지 57만ha 피해. 1,600억 원 재산 피해. 저수지 고갈로 제한급수 전국 확산. 국가재난사태 준하는 대응.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'1994~1995',level:'severe',region:'전국 (100년 만의 가뭄)',
   desc:'"100년 만의 가뭄". 전국 댐 평균 저수율 25% 이하. 서울 제한급수 실시. 농경지 40만ha 이상 피해. 경제손실 1조 원 이상.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
  {year:'1982',level:'warn',region:'남부지방',
   desc:'남부지방 중심 가뭄. 낙동강 수계 저수율 급락. 식수 및 농업용수 부족.',
   link:'https://www.drought.go.kr/menu/m30/m32.do?menu_mode=1'},
];

// ════ 수질 데이터 ════
const WQ_ITEMS={
  BOD:{unit:'mg/L',name:'BOD(생물화학적산소요구량)',grades:[1,2,3,5,8,10]},
  COD:{unit:'mg/L',name:'COD(화학적산소요구량)',grades:[2,4,5,7,9,11]},
  TOC:{unit:'mg/L',name:'TOC(총유기탄소)',grades:[2,3,4,5,6,8]},
  SS: {unit:'mg/L',name:'SS(부유물질)',grades:[1,5,15,15,35,35]},
  TN: {unit:'mg/L',name:'TN(총질소)',grades:[0.2,0.4,0.6,1.0,1.5,2.0]},
  TP: {unit:'mg/L',name:'TP(총인)',grades:[0.01,0.02,0.03,0.05,0.10,0.15]},
  pH: {unit:'',name:'pH(수소이온농도)',grades:[0,0,0,0,0,0]},
};
const MONTHS=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
// 댐별 월별 수질 데이터 (MyWater 물정보포털 기반 추정값, 단위 mg/L)
const WQ_DATA={
  '소양강':{
    BOD:{2024:[0.7,0.8,1.0,1.2,1.1,1.3,1.5,1.6,1.4,1.1,0.9,0.8],2023:[0.8,0.9,1.1,1.3,1.2,1.4,1.6,1.7,1.5,1.2,1.0,0.9],2022:[1.0,1.1,1.3,1.5,1.4,1.6,1.9,2.0,1.7,1.4,1.1,1.0]},
    COD:{2024:[3.2,3.5,4.0,4.5,4.3,4.8,5.2,5.5,5.0,4.3,3.8,3.4],2023:[3.5,3.8,4.3,4.8,4.6,5.1,5.5,5.8,5.3,4.6,4.1,3.7]},
    TOC:{2024:[1.8,2.0,2.4,2.8,2.6,3.1,3.5,3.7,3.2,2.7,2.2,1.9],2023:[2.0,2.2,2.6,3.0,2.8,3.3,3.7,3.9,3.4,2.9,2.4,2.1]},
    TN:{2024:[1.2,1.3,1.5,1.8,1.7,2.0,2.2,2.3,2.1,1.8,1.5,1.3],2023:[1.3,1.4,1.6,1.9,1.8,2.1,2.3,2.4,2.2,1.9,1.6,1.4]},
    TP:{2024:[0.010,0.012,0.015,0.018,0.017,0.022,0.028,0.032,0.025,0.018,0.013,0.011],2023:[0.012,0.014,0.017,0.020,0.019,0.024,0.030,0.035,0.027,0.020,0.015,0.013]},
    pH:{2024:[7.4,7.5,7.6,7.8,7.9,8.0,8.2,8.1,7.9,7.7,7.5,7.4],2023:[7.3,7.4,7.5,7.7,7.8,7.9,8.1,8.0,7.8,7.6,7.4,7.3]},
    SS:{2024:[1.5,1.8,2.5,3.2,2.8,3.5,5.2,5.8,4.2,2.9,2.1,1.7],2023:[1.8,2.1,2.8,3.5,3.1,3.8,5.5,6.1,4.5,3.2,2.4,2.0]},
  },
  '보령':{
    BOD:{2024:[1.5,1.7,2.0,2.3,2.2,2.6,3.1,3.4,2.9,2.3,1.9,1.6],2023:[1.8,2.0,2.4,2.8,2.7,3.1,3.7,4.0,3.5,2.8,2.3,2.0]},
    COD:{2024:[4.5,5.0,5.8,6.5,6.2,7.0,8.2,8.8,7.8,6.5,5.5,4.8]},
    TOC:{2024:[2.8,3.2,3.8,4.4,4.2,4.9,5.8,6.2,5.5,4.4,3.6,3.0]},
    TN:{2024:[2.1,2.3,2.7,3.1,3.0,3.4,3.9,4.2,3.7,3.1,2.6,2.2]},
    TP:{2024:[0.025,0.030,0.038,0.045,0.042,0.052,0.065,0.072,0.060,0.045,0.035,0.028]},
    pH:{2024:[7.2,7.3,7.5,7.7,7.8,7.9,8.1,8.0,7.8,7.6,7.4,7.2]},
    SS:{2024:[3.2,3.8,5.2,6.5,6.0,7.2,10.5,11.8,9.2,6.8,4.8,3.5]},
  },
  '대청':{
    BOD:{2024:[1.0,1.1,1.4,1.7,1.6,1.9,2.3,2.5,2.2,1.7,1.3,1.1],2023:[1.1,1.3,1.6,1.9,1.8,2.1,2.6,2.8,2.4,1.9,1.5,1.2]},
    COD:{2024:[3.8,4.2,5.0,5.8,5.5,6.3,7.5,8.0,7.1,5.8,4.8,4.1]},
    TOC:{2024:[2.2,2.5,3.1,3.7,3.5,4.1,5.0,5.4,4.8,3.7,2.9,2.4]},
    TN:{2024:[1.8,2.0,2.4,2.8,2.7,3.1,3.6,3.9,3.4,2.8,2.2,1.9]},
    TP:{2024:[0.015,0.018,0.023,0.028,0.026,0.033,0.042,0.048,0.038,0.028,0.020,0.016]},
    pH:{2024:[7.3,7.4,7.6,7.8,7.9,8.0,8.2,8.1,7.9,7.7,7.5,7.3]},
    SS:{2024:[2.1,2.5,3.5,4.5,4.2,5.2,7.8,8.5,6.8,4.8,3.2,2.3]},
  },
};
// 나머지 댐은 소양강 데이터 기반 변형
['충주','안동','합천','남강','밀양','용담','주암','섬진강','횡성'].forEach(n=>{
  WQ_DATA[n]={};
  const base=WQ_DATA['소양강'];
  const factor=n==='주암'?1.3:n==='안동'?1.1:n==='합천'?1.05:0.95;
  Object.keys(base).forEach(item=>{
    WQ_DATA[n][item]={};
    Object.keys(base[item]).forEach(yr=>{
      WQ_DATA[n][item][yr]=base[item][yr].map(v=>Math.round(v*factor*100)/100);
    });
  });
});

// ════ 전역 상태 ════
let planData,damsData,regionalData;
let view='gen',selYr=2023,active;
let rMode='both',selRYr=2024,selBasin='all',selDam=null;
let wqView='BOD';
let charts={};
let inited={mix:true,region:false,water:false,wq:false,news:false};

const GEN_SRCS=[{id:'nuclear',lbl:'원자력',clr:'#3B82F6'},{id:'coal',lbl:'석탄',clr:'#6B7280'},{id:'lng',lbl:'LNG',clr:'#F59E0B'},{id:'renew',lbl:'재생e',clr:'#10B981'},{id:'shin',lbl:'신e·수소',clr:'#A78BFA'},{id:'other',lbl:'기타',clr:'#94A3B8'}];
const CAP_SRCS=[...GEN_SRCS.slice(0,5),{id:'pumped',lbl:'양수',clr:'#06B6D4'},{id:'other',lbl:'기타',clr:'#94A3B8'}];
const RC={수도권:'#38BDF8',충남:'#F472B6',경북:'#FB923C',경남:'#FBBF24',전남:'#34D399',부산:'#EF4444',울산:'#A78BFA',강원:'#06B6D4',전북:'#10B981',충북:'#94A3B8',대구:'#F59E0B',제주:'#4ADE80',광주:'#3B82F6',대전:'#6B7280'};
const FALLBACK_PLAN={source:"제11차 전력수급기본계획",unit:"TWh",actual_until:2023,years:[2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038],generation:{nuclear:[127.1,138.8,152.6,158.0,176.1,180.5,182.8,185.1,188.1,191.1,195.1,199.2,204.2,210.9,217.7,224.4,231.2,236.0,239.1,242.2,248.3],coal:[239.2,227.4,196.4,200.2,198.4,184.9,171.6,158.3,152.0,145.8,139.5,125.0,110.5,104.3,98.2,93.6,89.0,88.9,83.2,77.5,70.9],lng:[152.6,144.4,145.8,168.5,171.9,157.7,157.9,158.1,159.3,160.4,161.5,161.3,161.0,152.3,143.6,131.9,116.1,101.1,90.0,83.1,74.3],renew:[36.9,44.5,51.8,63.1,74.7,49.4,62.5,75.6,89.9,104.2,113.4,117.2,120.9,133.1,145.3,157.5,168.7,179.9,185.2,192.5,205.7],shin:[5.8,6.2,6.5,7.1,7.0,7.2,11.6,15.9,19.0,22.1,25.5,29.8,34.2,38.8,43.4,47.9,52.5,57.1,60.9,64.7,70.3],other:[8.5,8.2,8.0,8.1,8.2,8.3,9.4,10.4,10.8,11.2,11.5,11.7,11.8,15.6,19.3,22.1,25.3,28.5,30.1,31.7,34.9]},capacity_gw:{nuclear:[22.5,23.1,23.3,24.7,25.4,24.7,25.1,26.1,26.8,27.4,28.0,28.5,28.9,29.9,30.9,31.7,32.1,32.4,32.9,34.0,35.2],coal:[37.0,36.8,36.9,36.3,36.8,39.2,40.3,40.8,38.6,36.5,34.3,33.0,31.7,30.6,29.5,28.8,28.4,28.1,26.0,24.0,22.2],lng:[41.3,41.7,41.5,43.6,43.0,43.2,44.7,47.3,49.7,52.1,54.5,56.7,58.8,60.5,62.2,63.5,64.1,64.7,66.0,67.5,69.2],renew:[14.5,19.4,24.0,29.3,37.6,30.0,33.8,39.0,49.2,59.4,65.7,71.8,78.0,84.6,91.2,97.8,102.8,107.8,112.5,117.0,121.9],pumped:[4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.7,4.8,4.9,5.0,5.1,5.2,5.8,6.4,7.0,7.5,7.9,8.5,9.5,10.4],shin:[1.0,1.1,1.2,1.3,1.3,1.4,1.5,1.8,2.1,2.3,2.5,2.7,2.9,3.1,3.2,3.4,3.5,3.6,3.7,3.9,4.0],other:[1.3,1.3,1.3,1.3,1.3,1.3,1.2,1.2,1.1,1.0,0.9,0.8,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7]}};
const FALLBACK_REGIONAL={generation:{"2024":{"서울":5.8,"인천":49.7,"경기":88.9,"강원":26.1,"경남":45.7,"경북":99.8,"광주":0.9,"대구":3.0,"대전":0.3,"부산":37.1,"울산":33.0,"전남":71.7,"전북":15.9,"제주":4.7,"충남":103.6,"충북":4.4},"2023":{"서울":6.0,"인천":51.1,"경기":87.2,"강원":27.8,"경남":44.3,"경북":103.5,"광주":0.8,"대구":3.1,"대전":0.3,"부산":38.2,"울산":33.2,"전남":72.4,"전북":14.4,"제주":4.5,"충남":116.8,"충북":4.3}},demand:{"2024":{"서울":46.2,"인천":29.1,"경기":121.4,"강원":16.8,"경남":37.2,"경북":36.8,"광주":13.9,"대구":21.5,"대전":15.6,"부산":29.4,"울산":26.2,"전남":31.8,"전북":21.3,"제주":6.0,"충남":51.2,"충북":24.1},"2023":{"서울":46.5,"인천":28.8,"경기":119.2,"강원":16.5,"경남":36.8,"경북":36.2,"광주":13.6,"대구":21.2,"대전":15.3,"부산":29.1,"울산":25.8,"전남":31.2,"전북":20.8,"제주":5.9,"충남":49.8,"충북":23.5}}};

// ════ 초기화 ════
async function init(){
  try{
    const res=await fetch(DATA_URL+"?t="+Date.now());
    const raw=res.ok?await res.json():null;
    planData=raw?.plan||FALLBACK_PLAN;
    damsData=raw?.dams||{};
    regionalData=raw?.regional||FALLBACK_REGIONAL;
    document.getElementById('updateBadge').textContent='최종 업데이트: '+(raw?.meta?.updated_at||'내장 데이터');
  }catch(e){
    planData=FALLBACK_PLAN; damsData={}; regionalData=FALLBACK_REGIONAL;
    document.getElementById('updateBadge').textContent='오프라인 모드';
  }
  active=new Set(GEN_SRCS.map(s=>s.id));
  initSrcBtns(); onSlide(5);
  drawTrend(); drawStack(); drawCap(); drawRenew();
}

function switchPage(id,el){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('on'));
  document.getElementById('pg-'+id).classList.add('on'); el.classList.add('on');
  if(!inited[id]){
    if(id==='region')initRegion();
    if(id==='water')initWater();
    if(id==='wq')initWQ();
    if(id==='news')initNews();
    inited[id]=true;
  }
}

// ════ PAGE 1 ════
function initSrcBtns(){const w=document.getElementById('srcs');w.innerHTML='';GEN_SRCS.forEach(s=>{const b=document.createElement('button');b.className='sb on';b.textContent=s.lbl;b.style.background=s.clr;b.style.borderColor=s.clr;b.onclick=()=>toggleSrc(s.id,b,s.clr);w.appendChild(b);});}
function toggleSrc(id,btn,clr){if(active.has(id)){if(active.size===1)return;active.delete(id);btn.classList.remove('on');btn.style.background='transparent';btn.style.color=clr;}else{active.add(id);btn.classList.add('on');btn.style.background=clr;btn.style.color='#0A0F1E';}redrawMix();}
function setView(v,el){view=v;document.querySelectorAll('#pg-mix .tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');redrawMix();}
function onSlide(i){const yrs=planData.years;selYr=yrs[+i];document.getElementById('sl').style.setProperty('--pct',(+i/(yrs.length-1)*100)+'%');document.getElementById('yrDisp').textContent=selYr;const isA=selYr<=planData.actual_until;const b=document.getElementById('yrBadge');b.textContent=isA?'● 실적':'◆ 전망';b.className='badge '+(isA?'act':'pln');drawKPI();drawSnap();}
function pct(v,t){return t>0?(v/t*100).toFixed(1)+'%':'-';}
function getG(id){return planData.generation[id]||[];}
function getC(id){return planData.capacity_gw?.[id]||[];}
function getChartData(){if(view==='gen')return{data:Object.fromEntries(GEN_SRCS.map(s=>[s.id,getG(s.id)])),unit:'TWh'};if(view==='cap')return{data:Object.fromEntries(CAP_SRCS.map(s=>[s.id,getC(s.id)])),unit:'GW'};const tots=planData.years.map((_,i)=>GEN_SRCS.reduce((a,s)=>a+(getG(s.id)[i]||0),0));const d={};GEN_SRCS.forEach(s=>{d[s.id]=planData.years.map((_,i)=>tots[i]>0?+((getG(s.id)[i]||0)/tots[i]*100).toFixed(1):0);});return{data:d,unit:'%'};}
function drawKPI(){const yi=planData.years.indexOf(selYr);const gen=Object.fromEntries(GEN_SRCS.map(s=>[s.id,getG(s.id)[yi]||0]));const tot=GEN_SRCS.filter(s=>active.has(s.id)).reduce((a,s)=>a+gen[s.id],0);document.getElementById('kpis').innerHTML=[{lbl:'총 발전량',val:tot.toFixed(1)+' TWh',sub:selYr+'년',clr:'#38BDF8',ico:'⚡'},{lbl:'원자력',val:(gen.nuclear||0).toFixed(1)+' TWh',sub:pct(gen.nuclear,tot),clr:'#3B82F6',ico:'⚛️'},{lbl:'석탄',val:(gen.coal||0).toFixed(1)+' TWh',sub:pct(gen.coal,tot),clr:'#6B7280',ico:'🏭'},{lbl:'LNG',val:(gen.lng||0).toFixed(1)+' TWh',sub:pct(gen.lng,tot),clr:'#F59E0B',ico:'🔥'},{lbl:'재생e',val:(gen.renew||0).toFixed(1)+' TWh',sub:pct(gen.renew,tot),clr:'#10B981',ico:'🌿'}].map(it=>`<div class="kpi" style="border-top:2px solid ${it.clr}"><div class="kpi-ico">${it.ico}</div><div class="kpi-lbl">${it.lbl}</div><div class="kpi-val" style="color:${it.clr}">${it.val}</div><div class="kpi-sub">${it.sub}</div></div>`).join('');}
function drawSnap(){const yi=planData.years.indexOf(selYr),isA=selYr<=planData.actual_until;document.getElementById('snapTitle').textContent=selYr+'년 에너지원별 구성';document.getElementById('snapSub').textContent=isA?'EPSIS 확정치':'제11차 전력수급기본계획 전망치';const{data,unit}=getChartData();const sl=view==='cap'?CAP_SRCS:GEN_SRCS.filter(s=>active.has(s.id));const vals=sl.map(s=>+(data[s.id]?.[yi]||0).toFixed(1));const tot=vals.reduce((a,b)=>a+b,0);if(charts.pie)charts.pie.destroy();charts.pie=new Chart(document.getElementById('pieC').getContext('2d'),{type:'doughnut',data:{labels:sl.map(s=>s.lbl),datasets:[{data:vals,backgroundColor:sl.map(s=>s.clr),borderColor:'#111827',borderWidth:3}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{label:c=>{const p=(c.raw/tot*100).toFixed(1);return` ${c.label}: ${(+c.raw).toFixed(1)} ${unit} (${p}%)`;}}}}}});document.getElementById('pieVal').textContent=tot.toFixed(1);document.getElementById('pieLbl').textContent='합계 '+unit;const sorted=[...sl.map((s,i)=>({...s,v:vals[i]}))].sort((a,b)=>b.v-a.v),mx=sorted[0]?.v||1;document.getElementById('barList').innerHTML=sorted.map(d=>`<div><div class="bar-row-lbl"><span class="bar-name" style="color:${d.clr}">${d.lbl}</span><span class="bar-val">${d.v.toFixed(1)} ${unit} · ${(d.v/tot*100).toFixed(1)}%</span></div><div class="bar-bg"><div class="bar-fg" style="width:${(d.v/mx*100).toFixed(1)}%;background:${d.clr}"></div></div></div>`).join('');}
function drawTrend(){const{data,unit}=getChartData(),si=planData.years.indexOf(planData.actual_until);const sl=view==='cap'?CAP_SRCS:GEN_SRCS.filter(s=>active.has(s.id));if(charts.trend)charts.trend.destroy();charts.trend=new Chart(document.getElementById('trendC').getContext('2d'),{type:'line',data:{labels:planData.years,datasets:sl.map(s=>[{label:s.lbl+'(실적)',data:planData.years.map((_,i)=>i<=si?data[s.id]?.[i]??null:null),borderColor:s.clr,backgroundColor:s.clr+'20',borderWidth:2.5,pointRadius:0,pointHoverRadius:4,tension:0.3,fill:false,spanGaps:false},{label:s.lbl+'(전망)',data:planData.years.map((_,i)=>i>=si?data[s.id]?.[i]??null:null),borderColor:s.clr,borderDash:[5,4],borderWidth:2,backgroundColor:'transparent',pointRadius:0,pointHoverRadius:4,tension:0.3,fill:false,spanGaps:false}]).flat()},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{title:c=>c[0].label+'년',label:c=>c.raw===null?null:` ${c.dataset.label}: ${(+c.raw).toFixed(1)} ${unit}`},filter:c=>c.raw!==null}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:11}},title:{display:true,text:unit,color:'#64748B',font:{size:10}}}}}});document.getElementById('trendSub').innerHTML=`단위: ${unit} &nbsp;|&nbsp; 실적 <span class="gn">━</span> (2018~${planData.actual_until}) &nbsp;·&nbsp; 전망 <span class="bl">╌</span> (~2038)`;document.getElementById('leg').innerHTML=sl.map(s=>`<div class="leg-item"><div class="leg-dot" style="background:${s.clr}"></div>${s.lbl}</div>`).join('');}
function drawStack(){const act=GEN_SRCS.filter(s=>active.has(s.id));if(charts.stack)charts.stack.destroy();charts.stack=new Chart(document.getElementById('stackC').getContext('2d'),{type:'bar',data:{labels:planData.years,datasets:act.map(s=>({label:s.lbl,data:planData.years.map((_,i)=>{const t=GEN_SRCS.reduce((a,ss)=>a+(getG(ss.id)[i]||0),0);return t>0?+((getG(s.id)[i]||0)/t*100).toFixed(1):0;}),backgroundColor:s.clr+'CC',borderColor:'transparent',borderWidth:0}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{title:c=>c[0].label+'년',label:c=>` ${c.dataset.label}: ${c.raw}%`}}},scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#64748B',font:{family:'DM Mono',size:9},maxTicksLimit:7}},y:{stacked:true,max:100,grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:9},callback:v=>v+'%'}}}}});}
function drawCap(){const si=planData.years.indexOf(planData.actual_until);if(charts.cap)charts.cap.destroy();charts.cap=new Chart(document.getElementById('capC').getContext('2d'),{type:'bar',data:{labels:planData.years,datasets:CAP_SRCS.map(s=>({label:s.lbl,data:planData.years.map((_,i)=>+(getC(s.id)[i]||0).toFixed(1)),backgroundColor:planData.years.map((_,i)=>i<=si?s.clr+'CC':s.clr+'55'),borderColor:'transparent',borderWidth:0,stack:'cap'}))},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{title:c=>c[0].label+'년',label:c=>` ${c.dataset.label}: ${(+c.raw).toFixed(1)} GW`,afterBody:c=>{const t=c.reduce((a,b)=>a+(+b.raw),0);return['──────',` 합계: ${t.toFixed(1)} GW`];}}}},scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#64748B',font:{family:'DM Mono',size:9},maxTicksLimit:7}},y:{stacked:true,grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:9},callback:v=>v+' GW'}}}}});}
function drawRenew(){const si=planData.years.indexOf(planData.actual_until);const rv=planData.years.map((_,i)=>+((getG('renew')[i]||0)+(getG('shin')[i]||0)).toFixed(1));const rp=planData.years.map((_,i)=>{const t=GEN_SRCS.reduce((a,s)=>a+(getG(s.id)[i]||0),0);return t>0?+(rv[i]/t*100).toFixed(1):0;});if(charts.renew)charts.renew.destroy();charts.renew=new Chart(document.getElementById('renewC').getContext('2d'),{type:'bar',data:{labels:planData.years,datasets:[{type:'bar',label:'재생e+신e',data:rv,backgroundColor:planData.years.map((_,i)=>i<=si?'#10B98177':'#A78BFA55'),yAxisID:'y'},{type:'line',label:'비중',data:rp,borderColor:'#F59E0B',backgroundColor:'transparent',borderWidth:2,pointRadius:0,tension:0.3,yAxisID:'y2'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{title:c=>c[0].label+'년',label:c=>` ${c.dataset.label}: ${(+c.raw).toFixed(1)}`}}},scales:{x:{grid:{display:false},ticks:{color:'#64748B',font:{family:'DM Mono',size:9},maxTicksLimit:7}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#10B981',font:{family:'DM Mono',size:9},callback:v=>v+' TWh'},position:'left'},y2:{grid:{display:false},ticks:{color:'#F59E0B',font:{family:'DM Mono',size:9},callback:v=>v+'%'},position:'right'}}}});}
function redrawMix(){drawKPI();drawSnap();drawTrend();drawStack();drawCap();drawRenew();}

// ════ PAGE 2 ════
function mergeMetro(raw){const out={};for(const[k,v]of Object.entries(raw))if(!['서울','인천','경기'].includes(k))out[k]=v;out['수도권']=(raw['서울']||0)+(raw['인천']||0)+(raw['경기']||0);return out;}
function initRegion(){const yrs=Object.keys(regionalData.generation).map(Number).sort((a,b)=>b-a);selRYr=yrs[0];const w=document.getElementById('rYrBtns');yrs.forEach(y=>{const b=document.createElement('button');b.className='yr-btn'+(y===selRYr?' on':'');b.textContent=y+'년';b.onclick=()=>{selRYr=y;document.querySelectorAll('.yr-btn').forEach(x=>x.classList.remove('on'));b.classList.add('on');drawRegion();};w.appendChild(b);});drawRegion();}
function setRMode(m,el){rMode=m;document.querySelectorAll('#pg-region .tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');drawRegion();}
function drawRegion(){const gen=mergeMetro(regionalData.generation[selRYr]||{});const dem=mergeMetro(regionalData.demand[selRYr]||{});const sorted=Object.keys(gen).sort((a,b)=>gen[b]-gen[a]);const totG=Object.values(gen).reduce((a,b)=>a+b,0),totD=Object.values(dem).reduce((a,b)=>a+b,0);document.getElementById('rMainTitle').textContent=`${selRYr}년 지역별 발전량 vs 수요`;document.getElementById('rPieTitle').textContent=rMode==='gen'?'발전량 비중':'수요 비중';document.getElementById('rKpis').innerHTML=[{lbl:'전국 발전량',val:totG.toFixed(1)+' TWh',sub:selRYr+'년',clr:'#38BDF8'},{lbl:'전국 수요',val:totD.toFixed(1)+' TWh',sub:'판매전력량',clr:'#10B981'},{lbl:'수도권 발전',val:(gen['수도권']||0).toFixed(1)+' TWh',sub:'서울+인천+경기',clr:'#38BDF8'},{lbl:'수도권 수요',val:(dem['수도권']||0).toFixed(1)+' TWh',sub:`자립도 ${(gen['수도권']/dem['수도권']*100||0).toFixed(0)}%`,clr:'#10B981'}].map(it=>`<div class="kpi" style="border-top:2px solid ${it.clr}"><div class="kpi-lbl">${it.lbl}</div><div class="kpi-val" style="color:${it.clr}">${it.val}</div><div class="kpi-sub">${it.sub}</div></div>`).join('');let ds=[];if(rMode==='both'||rMode==='gen')ds.push({label:'발전량(TWh)',data:sorted.map(r=>+(gen[r]||0).toFixed(1)),backgroundColor:'#38BDF877',borderColor:'#38BDF8',borderWidth:1.5,borderRadius:3});if(rMode==='both'||rMode==='dem')ds.push({label:'수요(TWh)',data:sorted.map(r=>+(dem[r]||0).toFixed(1)),backgroundColor:'#10B98177',borderColor:'#10B981',borderWidth:1.5,borderRadius:3});if(charts.rMain)charts.rMain.destroy();charts.rMain=new Chart(document.getElementById('rMainC').getContext('2d'),{type:'bar',data:{labels:sorted,datasets:ds},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:true,labels:{color:'#94A3B8',font:{family:'Noto Sans KR',size:11},boxWidth:12}},tooltip:{...TTP,callbacks:{title:c=>c[0].label,label:c=>` ${c.dataset.label}: ${(+c.raw).toFixed(1)} TWh`}}},scales:{x:{grid:{display:false},ticks:{color:'#F1F5F9',font:{family:'Noto Sans KR',size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:10},callback:v=>v+' TWh'}}}}});const pcts=sorted.map(r=>{const d=dem[r]||0;return d>0?+((gen[r]||0)/d*100).toFixed(1):0;});if(charts.rGap)charts.rGap.destroy();charts.rGap=new Chart(document.getElementById('rGapC').getContext('2d'),{type:'bar',data:{labels:sorted,datasets:[{label:'자립도',data:pcts,backgroundColor:pcts.map(v=>v>=100?'#10B98199':'#EF444499'),borderColor:pcts.map(v=>v>=100?'#10B981':'#EF4444'),borderWidth:1.5,borderRadius:3}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{label:c=>`  ${(+c.raw).toFixed(1)}% ${+c.raw>=100?'(공급초과)':'(부족)'}`}}},scales:{x:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:10},callback:v=>v+'%'},afterDataLimits(s){s.max=Math.max(s.max,120);}},y:{grid:{display:false},ticks:{color:'#F1F5F9',font:{family:'Noto Sans KR',size:10}}}}}});const useD=rMode==='gen'?gen:dem,useT=Object.values(useD).reduce((a,b)=>a+b,0);if(charts.rPie)charts.rPie.destroy();charts.rPie=new Chart(document.getElementById('rPieC').getContext('2d'),{type:'doughnut',data:{labels:sorted,datasets:[{data:sorted.map(r=>+(useD[r]||0).toFixed(1)),backgroundColor:sorted.map(r=>RC[r]||'#64748B'),borderColor:'#111827',borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,cutout:'50%',plugins:{legend:{display:true,position:'right',labels:{color:'#94A3B8',font:{family:'Noto Sans KR',size:10},boxWidth:9,padding:5}},tooltip:{...TTP,callbacks:{label:c=>{const p=(c.raw/useT*100).toFixed(1);return` ${c.label}: ${(+c.raw).toFixed(1)} TWh (${p}%)`;}}}}}});}

