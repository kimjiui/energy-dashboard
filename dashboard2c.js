// ════ PAGE 5: 뉴스 ════
const NEWS_CHANNELS=[
  {id:'news1',icon:'⚡',title:'전력수급 관련 뉴스',color:'#F59E0B',mainQuery:'전력수급 에너지믹스',
   topics:[{label:'전력수급 현황',query:'전력수급 에너지믹스'},{label:'전기요금 동향',query:'전기요금 인상 2025'},{label:'원전 정책',query:'원자력발전 원전 정책'},{label:'11차 전기본',query:'11차 전력수급기본계획'},{label:'LNG 발전',query:'LNG 발전 가스 에너지'},{label:'에너지 안보',query:'에너지안보 전력 수급'},{label:'반도체 전력',query:'반도체 팹 전력 수요'},{label:'탄소중립',query:'탄소중립 에너지 전환'},{label:'전력 예비율',query:'전력 예비율 블랙아웃'},{label:'송전망',query:'345kV 송전망 변전소'}]},
  {id:'news2',icon:'🌿',title:'재생에너지 관련 뉴스',color:'#10B981',mainQuery:'재생에너지 태양광 풍력',
   topics:[{label:'태양광 발전',query:'태양광 발전 설치 보급'},{label:'해상풍력',query:'해상풍력 발전 인허가'},{label:'RE100',query:'RE100 재생에너지 기업'},{label:'수소 에너지',query:'수소 청정수소 에너지'},{label:'ESS 배터리',query:'ESS 에너지저장 배터리'},{label:'재생에너지 계통',query:'재생에너지 계통 접속'},{label:'PPA 전력구매',query:'PPA 전력구매계약'},{label:'RPS·REC',query:'RPS REC 재생에너지 인증'},{label:'태양광 폐기물',query:'태양광 폐패널 재활용'},{label:'글로벌 동향',query:'글로벌 재생에너지 투자 동향'}]},
  {id:'news3',icon:'💧',title:'용수 관련 뉴스',color:'#38BDF8',mainQuery:'댐 저수율 가뭄 용수',
   topics:[{label:'댐 저수율',query:'댐 저수율 현황 가뭄'},{label:'가뭄 대응',query:'가뭄 용수 공급 제한'},{label:'초순수·반도체',query:'초순수 반도체 용수 공업'},{label:'보령댐',query:'보령댐 가뭄 충남 용수'},{label:'주암댐',query:'주암댐 저수율 전남 여수'},{label:'K-water',query:'K-water 용수 공급 사업'},{label:'국가수도계획',query:'국가수도기본계획 물관리'},{label:'수질 관리',query:'하천 수질 오염 현황'},{label:'기후 수자원',query:'기후변화 수자원 강수량'},{label:'공업용수',query:'공업용수 산업단지 공급'}]}
];

const SAMPLE_TITLES={
  '전력수급 에너지믹스':['올해 전력 예비율 역대 최저... 정부 대책 마련 착수','에너지믹스 전환 속도... 11차 전기본 이행 현황은','여름 전력 수요 급증 전망... 냉방 예비력 확보','LNG 발전 비중 늘었지만... 가스가격 변동성 리스크','전력수급계획 재생에너지 목표 달성 불투명','수도권 전력 부족 심화... 송전망 증설 시급'],
  '전기요금 인상 2025':['전기요금 2분기 동결... 하반기 인상 가능성','산업용 전기요금 인상 요인... 제조업 부담 가중','가정용 누진제 개편 검토... 소비자 부담 완화'],
  '댐 저수율 현황 가뭄':['주요 댐 저수율 60% 이하... 여름 가뭄 우려','보령댐 40% 미만 지속... 충남 용수 비상','K-water 가뭄 비상대책반... 절수 캠페인 실시','소양강댐 수위 평년 대비 낮아... 수도권 영향','전국 다목적댐 현황... 낙동강권역 가장 심각','기후변화로 봄 가뭄 상시화... 댐 추가 건설 논의'],
  '초순수 반도체 용수 공업':['삼성 반도체 팹 하루 수만 톤 용수... 초순수 확보','SK하이닉스 용인 클러스터 용수 공급 계획','초순수 기술 국산화... K-water 반도체 사업 확대'],
  '보령댐 가뭄 충남 용수':['보령댐 저수율 38%... 충남 서부 제한 급수 임박','보령댐 심각 가뭄 재현 우려... 대체 수원 필요','충남 공업단지 용수 불안... 기업 입지 재검토'],
};

function initNews(){document.getElementById('newsGrid').innerHTML=NEWS_CHANNELS.map(ch=>buildNewsBoard(ch)).join('');}

function buildNewsBoard(ch){
  const topicBtns=ch.topics.map((t,i)=>`<button class="ntb" data-query="${t.query}" data-ch="${ch.id}" onclick="selectTopic(this,'${ch.id}')" style="padding:5px 11px;border-radius:6px;font-size:12px;cursor:pointer;border:1px solid ${i===0?ch.color:'var(--border)'};background:${i===0?ch.color+'22':'transparent'};color:${i===0?ch.color:'var(--muted)'};font-family:'Noto Sans KR',sans-serif;font-weight:600;transition:all .15s;white-space:nowrap;" onmouseover="if(!this.classList.contains('on')){this.style.borderColor='${ch.color}';this.style.color='${ch.color}';this.style.background='${ch.color}11';}" onmouseout="if(!this.classList.contains('on')){this.style.borderColor='var(--border)';this.style.color='var(--muted)';this.style.background='transparent';}">${t.label}</button>`).join('');
  const firstTopic=ch.topics[0];
  return `<div class="news-board" style="border-radius:12px;overflow:hidden;">
    <div class="news-header" style="background:${ch.color}18;border-bottom:2px solid ${ch.color}44;padding:14px 18px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <span style="font-size:24px">${ch.icon}</span>
        <div><div style="font-size:15px;font-weight:900;color:#F1F5F9;">${ch.title}</div><div style="font-size:11px;color:var(--muted);font-family:'DM Mono',monospace;margin-top:1px;">주제 선택 → 기사 클릭 시 네이버 뉴스로 이동</div></div>
        <a href="https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(ch.mainQuery)}&sort=1" target="_blank" style="margin-left:auto;padding:6px 14px;background:${ch.color};color:#0A0F1E;border-radius:20px;font-size:12px;font-weight:700;text-decoration:none;white-space:nowrap;">전체 보기 →</a>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">${topicBtns}</div>
    </div>
    <div class="news-board-inner">
      <div id="${ch.id}-list" style="border-right:1px solid var(--border);">${buildArticleList(ch,firstTopic)}</div>
      <div id="${ch.id}-preview" style="background:#0D1117;padding:16px;overflow-y:auto;max-height:380px;">${buildPreview(ch,firstTopic)}</div>
    </div>
  </div>`;
}

function buildArticleList(ch,topic){
  const enc=encodeURIComponent(topic.query);
  const url=`https://search.naver.com/search.naver?where=news&query=${enc}&sort=1`;
  const titles=SAMPLE_TITLES[topic.query]||[`"${topic.label}" 최신 뉴스 검색하기`,`${topic.label} 정책 동향`,`${topic.label} 전문가 분석`];
  const today=new Date();
  const dates=[0,1,1,2,2,3].map(d=>{const dt=new Date(today);dt.setDate(dt.getDate()-d);return `${dt.getMonth()+1}/${String(dt.getDate()).padStart(2,'0')}`;});
  const sources=['연합뉴스','한국경제','매일경제','에너지경제','전기신문','조선일보'];
  return titles.slice(0,6).map((title,i)=>`<div class="news-item" onclick="window.open('${url}','_blank')">
    <span style="font-size:11px;color:${ch.color};font-family:'DM Mono',monospace;min-width:22px;margin-top:2px;font-weight:700;">${String(i+1).padStart(2,'0')}</span>
    <div style="flex:1;"><div class="news-item-title" style="font-size:12px;">${title}</div><div class="news-item-meta">${sources[i]||'네이버뉴스'} · ${dates[i]||dates[0]}</div></div>
    <span style="color:${ch.color};font-size:12px;margin-top:2px;">↗</span>
  </div>`).join('');
}

function buildPreview(ch,topic){
  const enc=encodeURIComponent(topic.query);
  const url=`https://search.naver.com/search.naver?where=news&query=${enc}&sort=1`;
  const related={
    '전력수급 에너지믹스':['전력 예비율 현황','에너지믹스 변화','전력 수급 계획'],
    '댐 저수율 현황 가뭄':['보령댐 저수율','소양강댐 현황','가뭄 단계 발령'],
    '초순수 반도체 용수 공업':['초순수 수처리','반도체 클러스터','공업용수 요금'],
    '보령댐 가뭄 충남 용수':['충남 서부 용수','보령댐 역대 가뭄','대체 취수원'],
  };
  const rel=related[topic.query]||[`${topic.label} 현황`,`${topic.label} 정책`,`${topic.label} 전망`];
  return `<div style="text-align:center;padding:4px 0 12px;"><div style="font-size:11px;color:var(--muted);margin-bottom:10px;font-family:'DM Mono',monospace;">📌 "${topic.label}" 검색 결과</div>
    <a href="${url}" target="_blank" style="display:block;padding:11px 16px;background:${ch.color};color:#0A0F1E;border-radius:10px;font-size:13px;font-weight:700;text-decoration:none;margin-bottom:14px;" onmouseover="this.style.opacity='.82'" onmouseout="this.style.opacity='1'">🔍 네이버 뉴스에서 열기</a></div>
  <div style="background:#111827;border:1px solid var(--border);border-radius:8px;padding:12px;">
    <div style="font-size:11px;color:${ch.color};font-family:'DM Mono',monospace;margin-bottom:8px;font-weight:700;">🔗 관련 추가 검색어</div>
    ${rel.map(q=>`<a href="https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(q)}&sort=1" target="_blank" style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;font-size:12px;color:var(--muted);text-decoration:none;border-bottom:1px solid var(--border);transition:color .15s;" onmouseover="this.style.color='${ch.color}'" onmouseout="this.style.color='var(--muted)'"><span>🔍 ${q}</span><span style="font-size:11px;">↗</span></a>`).join('')}
  </div>
  <div style="margin-top:10px;background:#111827;border:1px solid var(--border);border-radius:8px;padding:10px;">
    <a href="${url}" target="_blank" style="display:block;font-size:12px;color:${ch.color};text-decoration:none;padding:4px 0;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">최신 뉴스 순으로 보기 →</a>
    <a href="https://search.naver.com/search.naver?where=news&query=${enc}&sort=0" target="_blank" style="display:block;font-size:12px;color:var(--muted);text-decoration:none;padding:4px 0;" onmouseover="this.style.color='${ch.color}'" onmouseout="this.style.color='var(--muted)'">관련도 순으로 보기 →</a>
  </div>`;
}

function selectTopic(btn,channelId){
  const ch=NEWS_CHANNELS.find(c=>c.id===channelId);
  const query=btn.dataset.query;
  const topic=ch.topics.find(t=>t.query===query);
  btn.closest('.news-board').querySelectorAll('.ntb').forEach(b=>{b.classList.remove('on');b.style.borderColor='var(--border)';b.style.background='transparent';b.style.color='var(--muted)';});
  btn.classList.add('on');btn.style.borderColor=ch.color;btn.style.background=ch.color+'22';btn.style.color=ch.color;
  document.getElementById(channelId+'-list').innerHTML=buildArticleList(ch,topic);
  document.getElementById(channelId+'-preview').innerHTML=buildPreview(ch,topic);
}

init();
