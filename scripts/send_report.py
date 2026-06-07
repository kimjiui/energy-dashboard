import smtplib
import json
import os
import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# ── 환경변수 ────────────────────────────────────────
GMAIL_USER = os.environ.get("GMAIL_USER", "")
GMAIL_PW   = os.environ.get("GMAIL_APP_PW", "")
TO         = os.environ.get("REPORT_TO", "")
DASHBOARD  = "https://kimjiui.github.io/energy-dashboard"
TODAY      = datetime.date.today()
WEEK       = TODAY.isocalendar()[1]

if not GMAIL_USER or not GMAIL_PW or not TO:
    print("❌ 환경변수 없음: GMAIL_USER / GMAIL_APP_PW / REPORT_TO 확인")
    exit(1)

# ── 데이터 읽기 ──────────────────────────────────────
try:
    with open("data/dashboard_data.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    updated      = data.get("meta", {}).get("updated_at", str(TODAY))
    dams         = data.get("dams", {})
    plan         = data.get("plan", {})
except Exception as e:
    print(f"⚠️  data 파일 읽기 실패: {e}")
    updated = str(TODAY)
    dams    = {}
    plan    = {}

# ── 댐 저수율 ────────────────────────────────────────
dam_rows    = ""
danger_dams = []

for name, info in dams.items():
    rate = info.get("rate")
    if rate is None:
        continue
    if rate >= 60:
        color  = "#10B981"
        status = "안정"
    elif rate >= 40:
        color  = "#F59E0B"
        status = "주의"
    else:
        color  = "#EF4444"
        status = "⚠️ 위험"
        danger_dams.append(f"{name}댐({rate}%)")

    dam_rows += f"""
        <tr>
          <td style="padding:8px 14px;font-weight:600;border-bottom:1px solid #F1F5F9">{name}댐</td>
          <td style="padding:8px 14px;color:{color};font-weight:800;font-family:monospace;border-bottom:1px solid #F1F5F9">{rate}%</td>
          <td style="padding:8px 14px;color:{color};border-bottom:1px solid #F1F5F9">{status}</td>
        </tr>"""

# ── 발전량 최신 실적 ─────────────────────────────────
gen          = plan.get("generation", {})
years        = plan.get("years", [])
actual_until = plan.get("actual_until", 2023)

yi = years.index(actual_until) if actual_until in years else -1

def gwh(src):
    v = gen.get(src, [])
    return f"{v[yi]:.1f}" if 0 <= yi < len(v) else "—"

nuclear_gwh = gwh("nuclear")
coal_gwh    = gwh("coal")
lng_gwh     = gwh("lng")
renew_gwh   = gwh("renew")

# ── 위험 댐 알림 박스 ────────────────────────────────
alert_box = ""
if danger_dams:
    names = ", ".join(danger_dams)
    alert_box = f"""
    <div style="background:#FEF2F2;border-left:4px solid #EF4444;
      padding:14px 18px;margin:0 0 24px;border-radius:6px;">
      <strong style="color:#EF4444">⚠️ 긴급 알림 — 저수율 40% 미만 댐</strong><br>
      <span style="color:#7F1D1D;margin-top:6px;display:block;font-size:13px">{names}</span>
    </div>"""

# ── HTML 메일 본문 ────────────────────────────────────
html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F1F5F9;
  font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,sans-serif;">

<div style="max-width:620px;margin:32px auto;border-radius:14px;
  overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.12);">

  <!-- 헤더 -->
  <div style="background:linear-gradient(135deg,#0A0F1E 0%,#1E3A5F 100%);padding:32px;">
    <div style="color:#38BDF8;font-size:11px;font-weight:700;
      letter-spacing:2px;margin-bottom:8px">
      WEEKLY ENERGY REPORT &nbsp;·&nbsp; {WEEK}주차
    </div>
    <div style="color:#F1F5F9;font-size:24px;font-weight:900;line-height:1.3;margin-bottom:8px">
      🇰🇷 대한민국 에너지 Mix<br>주간 현황 리포트
    </div>
    <div style="color:#64748B;font-size:12px;">
      {TODAY.strftime('%Y년 %m월 %d일')} (월) &nbsp;·&nbsp; 데이터 기준: {updated}
    </div>
  </div>

  <!-- 본문 -->
  <div style="background:#ffffff;padding:32px;">

    {alert_box}

    <!-- 대시보드 버튼 -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="{DASHBOARD}"
        style="display:inline-block;padding:14px 36px;background:#38BDF8;
          color:#0A0F1E;border-radius:8px;font-weight:800;font-size:14px;
          text-decoration:none;letter-spacing:.5px;">
        📊 대시보드 바로 열기 →
      </a>
      <div style="color:#94A3B8;font-size:10px;margin-top:8px;
        font-family:monospace">{DASHBOARD}</div>
    </div>

    <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 28px;">

    <!-- 에너지 Mix -->
    <div style="margin-bottom:28px;">
      <div style="font-size:15px;font-weight:800;color:#1E293B;margin-bottom:4px;">
        ⚡ 에너지 Mix 현황
      </div>
      <div style="font-size:11px;color:#94A3B8;margin-bottom:14px;">
        {actual_until}년 실적 (단위: TWh) &nbsp;·&nbsp; EPSIS 한국전력통계
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="background:#F8FAFC;">
          <th style="padding:9px 14px;text-align:left;font-size:11px;
            color:#64748B;font-weight:600;border-bottom:2px solid #E2E8F0">에너지원</th>
          <th style="padding:9px 14px;text-align:right;font-size:11px;
            color:#64748B;font-weight:600;border-bottom:2px solid #E2E8F0">발전량 (TWh)</th>
        </tr>
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #F1F5F9">⚛️ 원자력</td>
          <td style="padding:10px 14px;text-align:right;font-weight:700;
            color:#3B82F6;font-family:monospace;border-bottom:1px solid #F1F5F9">{nuclear_gwh}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #F1F5F9">🏭 석탄</td>
          <td style="padding:10px 14px;text-align:right;font-weight:700;
            color:#6B7280;font-family:monospace;border-bottom:1px solid #F1F5F9">{coal_gwh}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #F1F5F9">🔥 LNG</td>
          <td style="padding:10px 14px;text-align:right;font-weight:700;
            color:#F59E0B;font-family:monospace;border-bottom:1px solid #F1F5F9">{lng_gwh}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;">🌿 재생에너지</td>
          <td style="padding:10px 14px;text-align:right;font-weight:700;
            color:#10B981;font-family:monospace">{renew_gwh}</td>
        </tr>
      </table>
    </div>

    <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 28px;">

    <!-- 댐 저수율 -->
    <div style="margin-bottom:28px;">
      <div style="font-size:15px;font-weight:800;color:#1E293B;margin-bottom:4px;">
        💧 주요 댐 저수율 현황
      </div>
      <div style="font-size:11px;color:#94A3B8;margin-bottom:14px;">
        K-water 한국수자원공사 기준
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <tr style="background:#F8FAFC;">
          <th style="padding:9px 14px;text-align:left;font-size:11px;
            color:#64748B;font-weight:600;border-bottom:2px solid #E2E8F0">댐명</th>
          <th style="padding:9px 14px;text-align:left;font-size:11px;
            color:#64748B;font-weight:600;border-bottom:2px solid #E2E8F0">저수율</th>
          <th style="padding:9px 14px;text-align:left;font-size:11px;
            color:#64748B;font-weight:600;border-bottom:2px solid #E2E8F0">상태</th>
        </tr>
        {dam_rows if dam_rows else
         '<tr><td colspan="3" style="padding:14px;color:#94A3B8;text-align:center">데이터 없음</td></tr>'}
      </table>
      <div style="font-size:11px;color:#94A3B8;margin-top:10px;line-height:1.8;">
        🟢 60% 이상: 안정 &nbsp;·&nbsp;
        🟡 40~60%: 주의 &nbsp;·&nbsp;
        🔴 40% 미만: 위험
      </div>
    </div>

    <hr style="border:none;border-top:1px solid #E2E8F0;margin:0 0 24px;">

    <!-- 출처 -->
    <div style="font-size:11px;color:#94A3B8;line-height:1.9;">
      📋 <strong style="color:#64748B">데이터 출처</strong><br>
      · 발전량 실적: EPSIS 전력통계정보시스템 (epsis.kpx.or.kr)<br>
      · 전망 데이터: 제11차 전력수급기본계획 (산업통상자원부, 2025.02)<br>
      · 댐 저수율: K-water 한국수자원공사<br>
      · 자동 수집: GitHub Actions 매일 09:00 KST 실행
    </div>
  </div>

  <!-- 푸터 -->
  <div style="background:#F8FAFC;padding:18px 32px;text-align:center;
    border-top:1px solid #E2E8F0;">
    <div style="font-size:11px;color:#94A3B8;line-height:1.8;">
      이 메일은 매주 월요일 오전 8시에 자동 발송됩니다.<br>
      <a href="{DASHBOARD}" style="color:#38BDF8;text-decoration:none;">{DASHBOARD}</a>
    </div>
  </div>

</div>
</body>
</html>"""

# ── 메일 발송 ─────────────────────────────────────────
subject = f"[에너지 대시보드] {TODAY.strftime('%m/%d')} 주간 전력·용수 현황 리포트"

msg = MIMEMultipart("alternative")
msg["Subject"] = subject
msg["From"]    = f"에너지 대시보드 <{GMAIL_USER}>"
msg["To"]      = TO
msg.attach(MIMEText(html, "html", "utf-8"))

print(f"📧 발송 대상: {TO}")
print(f"📋 제목: {subject}")

try:
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(GMAIL_USER, GMAIL_PW)
        server.sendmail(GMAIL_USER, TO, msg.as_bytes())
    print("✅ 메일 발송 완료!")
except smtplib.SMTPAuthenticationError:
    print("❌ Gmail 인증 실패 — 앱 비밀번호 확인 필요")
    print("   myaccount.google.com → 보안 → 앱 비밀번호")
    raise
except Exception as e:
    print(f"❌ 발송 실패: {e}")
    raise
