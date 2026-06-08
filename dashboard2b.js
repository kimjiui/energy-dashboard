// ════ PAGE 4: 수질 ════
function setWQView(v,el){wqView=v;document.querySelectorAll('#pg-wq .tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');drawWQ();}
function initWQ(){drawWQ();}

function drawWQ(){
  const dam=document.getElementById('wqDamSel').value;
  const year=+document.getElementById('wqYearSel').value;
  const item=wqView;
  const itemInfo=WQ_ITEMS[item];

  document.getElementById('wqChartTitle').textContent=`${dam}댐 ${itemInfo.name} 월별 추이 (${year})`;
  document.getElementById('wqCompTitle').textContent=`주요 댐 ${item} 비교 (${year}년 연평균)`;
  document.getElementById('wqTableTitle').textContent=`${dam}댐 수질 상세 현황 (${year})`;

  const data=WQ_DATA[dam]?.[item]?.[year]||WQ_DATA['소양강']?.[item]?.[2024]||[];
  const avg=data.length?+(data.reduce((a,b)=>a+b,0)/data.length).toFixed(3):0;
  const max=data.length?+(Math.max(...data)).toFixed(3):0;
  const min=data.length?+(Math.min(...data)).toFixed(3):0;

  // KPI
  const grade=item==='pH'?'정상':avg<=itemInfo.grades[0]?'Ia(매우좋음)':avg<=itemInfo.grades[1]?'Ib(좋음)':avg<=itemInfo.grades[2]?'II(약간좋음)':avg<=itemInfo.grades[3]?'III(보통)':avg<=itemInfo.grades[4]?'IV(약간나쁨)':'V이상(나쁨)';
  const gradeClr=avg<=itemInfo.grades[0]?'#10B981':avg<=itemInfo.grades[1]?'#34D399':avg<=itemInfo.grades[2]?'#38BDF8':avg<=itemInfo.grades[3]?'#F59E0B':avg<=itemInfo.grades[4]?'#F97316':'#EF4444';
  document.getElementById('wqKpis').innerHTML=[
    {lbl:`${year}년 연평균 ${item}`,val:(avg||0).toFixed(item==='TP'?3:2)+' '+(itemInfo.unit||''),sub:grade,clr:gradeClr},
    {lbl:'최고값',val:(max||0).toFixed(item==='TP'?3:2)+' '+(itemInfo.unit||''),sub:'연중 최고',clr:'#EF4444'},
    {lbl:'최저값',val:(min||0).toFixed(item==='TP'?3:2)+' '+(itemInfo.unit||''),sub:'연중 최저',clr:'#10B981'},
    {lbl:'수질 등급',val:grade,sub:'환경부 기준',clr:gradeClr},
  ].map(it=>`<div class="kpi" style="border-top:2px solid ${it.clr}"><div class="kpi-lbl">${it.lbl}</div><div class="kpi-val" style="color:${it.clr};font-size:16px">${it.val}</div><div class="kpi-sub">${it.sub}</div></div>`).join('');

  // 월별 추이 차트
  const barColors=data.map(v=>{
    if(item==='pH') return '#38BDF8CC';
    if(item==='SS') return v<=5?'#10B98199':v<=15?'#38BDF899':v<=25?'#F59E0B99':'#EF444499';
    return v<=(itemInfo.grades[0]||0)?'#10B98199':v<=(itemInfo.grades[1]||0)?'#34D39999':v<=(itemInfo.grades[2]||0)?'#38BDF899':v<=(itemInfo.grades[3]||0)?'#F59E0B99':'#EF444499';
  });
  if(charts.wqTrend)charts.wqTrend.destroy();
  charts.wqTrend=new Chart(document.getElementById('wqTrendC').getContext('2d'),{
    type:'bar',
    data:{labels:MONTHS,datasets:[
      {type:'line',label:'평균',data:Array(12).fill(avg),borderColor:'#38BDF888',borderDash:[4,3],borderWidth:1.5,pointRadius:0,tension:0},
      {type:'bar',label:item,data,backgroundColor:barColors,borderColor:barColors.map(c=>c.replace('99','FF')),borderWidth:1,borderRadius:3},
    ]},
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{title:c=>c[0].label,label:c=>` ${c.dataset.label}: ${(+c.raw).toFixed(item==='TP'?3:2)} ${itemInfo.unit||''}`}}},
      scales:{x:{grid:{display:false},ticks:{color:'#64748B',font:{family:'DM Mono',size:10}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:10}}}}}
  });

  // 댐별 비교 차트
  const dams2=['소양강','충주','안동','대청','보령','주암'];
  const compData=dams2.map(d=>{const arr=WQ_DATA[d]?.[item]?.[year]||WQ_DATA['소양강']?.[item]?.[2024]||[0];return +(arr.reduce((a,b)=>a+b,0)/(arr.length||12)).toFixed(item==='TP'?3:2);});
  const compColors=compData.map(v=>{
    if(item==='pH') return '#38BDF8CC';
    return +v<=(itemInfo.grades[0]||0)?'#10B98199':+v<=(itemInfo.grades[1]||0)?'#34D39999':+v<=(itemInfo.grades[2]||0)?'#38BDF899':+v<=(itemInfo.grades[3]||0)?'#F59E0B99':'#EF444499';
  });
  if(charts.wqComp)charts.wqComp.destroy();
  charts.wqComp=new Chart(document.getElementById('wqCompC').getContext('2d'),{
    type:'bar',
    data:{labels:dams2.map(d=>d+'댐'),datasets:[{data:compData,backgroundColor:compColors,borderColor:compColors.map(c=>c.replace('99','FF')),borderWidth:1.5,borderRadius:4}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TTP,callbacks:{label:c=>` 연평균 ${item}: ${(+c.raw).toFixed(item==='TP'?3:2)} ${itemInfo.unit||''}`}}},
      scales:{x:{grid:{display:false},ticks:{color:'#F1F5F9',font:{family:'Noto Sans KR',size:11}}},y:{grid:{color:'rgba(255,255,255,.04)'},ticks:{color:'#64748B',font:{family:'DM Mono',size:10}}}}}
  });

  // 수질 테이블
  const allItems=['BOD','COD','TOC','SS','TN','TP','pH'];
  const headerHtml=`<tr style="background:rgba(56,189,248,.08);color:var(--accent)"><th style="padding:9px 10px;text-align:left">월</th>${allItems.map(it=>`<th style="padding:9px 8px">${it}<br><span style="font-size:9px;font-weight:400;color:#64748B">${WQ_ITEMS[it].unit||''}</span></th>`).join('')}</tr>`;
  const bodyHtml=MONTHS.map((m,i)=>{
    const cells=allItems.map(it=>{
      const v=(WQ_DATA[dam]?.[it]?.[year]||WQ_DATA['소양강']?.[it]?.[2024]||[])[i];
      if(v===undefined) return `<td style="padding:7px 8px;color:var(--muted)">—</td>`;
      const formatted=it==='TP'?v.toFixed(3):v.toFixed(2);
      const iInfo=WQ_ITEMS[it];
      const cls=it==='pH'?'':+v<=(iInfo.grades[0]||0)?'wq-ok':+v<=(iInfo.grades[1]||0)?'':+v<=(iInfo.grades[2]||0)?'':'wq-warn';
      return `<td style="padding:7px 8px" class="${cls}">${formatted}</td>`;
    }).join('');
    return `<tr style="border-bottom:1px solid var(--border)"><td style="padding:7px 10px;font-weight:600;font-size:12px">${m}</td>${cells}</tr>`;
  }).join('');
  document.getElementById('wqTableWrap').innerHTML=`<table class="wq-table"><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`;
}

