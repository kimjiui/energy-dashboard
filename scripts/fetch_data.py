"""
fetch_data.py
─────────────────────────────────────────────────────
대한민국 에너지 Mix 대시보드 — 자동 데이터 수집 스크립트
GitHub Actions에서 매일 자동 실행됨

수집 대상:
  1. EPSIS API   — 전원별 발전량 (월별 실적)
  2. K-water API — 댐별 저수율 (일별 현황)
  3. 11차 전기본  — 전망 데이터 (정적, 연 1회 갱신)
"""

import json, time, datetime, os, requests

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(DATA_DIR, exist_ok=True)

TODAY = datetime.date.today()
THIS_YEAR  = TODAY.year
THIS_MONTH = TODAY.month

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; EnergyDashboard/1.0)",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://epsis.kpx.or.kr/",
}

# ══════════════════════════════════════════════════════
# 1. EPSIS — 전원별 발전량 (월별)
#    공공데이터포털 API 키 필요 (무료 발급)
#    https://www.data.go.kr → '전원별발전량' 검색 → API 신청
# ══════════════════════════════════════════════════════
EPSIS_API_KEY = os.environ.get("EPSIS_API_KEY", "")  # GitHub Secret에 설정

def fetch_epsis_generation():
    """EPSIS 전원별 발전량 — 최근 12개월"""
    print("📡 EPSIS 발전량 수집 중...")

    # ── 방법 A: 공공데이터포털 REST API (API키 있을 때) ──
    if EPSIS_API_KEY:
        results = []
        for offset in range(12):
            d = TODAY.replace(day=1) - datetime.timedelta(days=offset*28)
            ym = d.strftime("%Y%m")
            url = (
                "https://apis.data.go.kr/B552016/electricity-generation-mix"
                f"?serviceKey={EPSIS_API_KEY}&pageNo=1&numOfRows=100"
                f"&bas_dt={ym}&type=json"
            )
            try:
                r = requests.get(url, headers=HEADERS, timeout=15)
                items = r.json().get("response", {}).get("body", {}).get("items", [])
                for item in items:
                    results.append({
                        "ym": ym,
                        "source": item.get("genSrcNm", ""),
                        "gen_gwh": round(float(item.get("genQnt", 0)) / 1_000_000, 1),
                    })
            except Exception as e:
                print(f"  ⚠️  {ym} 수집 실패: {e}")
            time.sleep(0.3)
        return results

    # ── 방법 B: EPSIS 웹 스크래핑 (API키 없을 때 fallback) ──
    # EPSIS는 Ajax 기반이라 Playwright 필요 → GitHub Actions에서 실행 가능
    print("  ℹ️  API키 없음 → 정적 전망 데이터 사용")
    return []


# ══════════════════════════════════════════════════════
# 2. K-water 수문정보 — 댐별 저수율
#    K-water Open API (무료, 별도 키 불필요)
#    https://www.kwater.or.kr → 데이터 개방 → 수문현황
# ══════════════════════════════════════════════════════
KWATER_DAMS = {
    "소양강": "1018680",
    "충주":   "1018350",
    "안동":   "5018250",
    "대청":   "4018920",
    "합천":   "9018700",
    "보령":   "4019710",
    "주암":   "8018960",
    "용담":   "4019200",
    "섬진강": "8018140",
    "남강":   "9018530",
}

def fetch_kwater_dams():
    """K-water 댐 저수율 현황"""
    print("💧 K-water 댐 저수율 수집 중...")
    results = {}
    base_url = "https://www.kwater.or.kr/api/dam/realtime"
    date_str = TODAY.strftime("%Y%m%d")

    for dam_name, dam_code in KWATER_DAMS.items():
        try:
            url = f"{base_url}?damCode={dam_code}&date={date_str}"
            r = requests.get(url, headers={**HEADERS, "Referer":"https://www.kwater.or.kr/"}, timeout=10)
            if r.status_code == 200:
                data = r.json()
                rate = data.get("storageRate") or data.get("rate") or data.get("저수율")
                level = data.get("waterLevel") or data.get("level") or data.get("수위")
                results[dam_name] = {
                    "rate": round(float(rate), 1) if rate else None,
                    "level": round(float(level), 2) if level else None,
                    "date": date_str,
                }
            else:
                results[dam_name] = {"rate": None, "level": None, "date": date_str}
        except Exception as e:
            print(f"  ⚠️  {dam_name}댐 실패: {e}")
            results[dam_name] = {"rate": None, "level": None, "date": date_str}
        time.sleep(0.2)

    # ── K-water 공개 API가 막혔을 경우: water.or.kr 웹에서 파싱 ──
    # fallback: requests + BeautifulSoup
    none_count = sum(1 for v in results.values() if v["rate"] is None)
    if none_count > len(KWATER_DAMS) // 2:
        print("  ⚠️  K-water API 응답 없음 → 웹 파싱 시도")
        results = _fetch_kwater_web(results)

    return results

def _fetch_kwater_web(existing):
    """K-water 웹 페이지에서 저수율 파싱 (fallback)"""
    try:
        from bs4 import BeautifulSoup
        url = "https://www.water.or.kr/kor/realtime/sumun/index.do?mode=yongsu&menuId=13_91_93_97"
        r = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "html.parser")
        # 테이블에서 댐명 + 저수율 파싱 (실제 HTML 구조에 맞게 조정 필요)
        table = soup.find("table", class_="tblList") or soup.find("table")
        if table:
            for row in table.find_all("tr")[1:]:
                cells = row.find_all("td")
                if len(cells) >= 4:
                    name = cells[0].get_text(strip=True)
                    rate_text = cells[3].get_text(strip=True).replace("%","")
                    for dam_name in existing:
                        if dam_name in name:
                            try:
                                existing[dam_name]["rate"] = round(float(rate_text), 1)
                            except:
                                pass
    except Exception as e:
        print(f"  ⚠️  웹 파싱 실패: {e}")
    return existing


# ══════════════════════════════════════════════════════
# 3. 전기본 전망 데이터 (정적 — 11차 기준, 연 1회 갱신)
#    새 전기본 발표 시 이 딕셔너리만 업데이트하면 됨
# ══════════════════════════════════════════════════════
PLAN_DATA = {
    "source": "제11차 전력수급기본계획 (산업통상자원부 공고 제2025-169호, 2025.02.21)",
    "unit": "TWh",
    "years": [2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038],
    "actual_until": 2023,
    "generation": {
        "nuclear": [127.1,138.8,152.6,158.0,176.1,180.5,None,None,None,None,None,None,204.2,None,None,None,None,236.0,None,None,248.3],
        "coal":    [239.2,227.4,196.4,200.2,198.4,184.9,None,None,None,None,None,None,110.5,None,None,None,None,88.9, None,None,70.9],
        "lng":     [152.6,144.4,145.8,168.5,171.9,157.7,None,None,None,None,None,None,161.0,None,None,None,None,101.1,None,None,74.3],
        "renew":   [36.9, 44.5, 51.8, 63.1, 74.7, 49.4, None,None,None,None,None,None,120.9,None,None,None,None,179.9,None,None,205.7],
        "shin":    [5.8,  6.2,  6.5,  7.1,  7.0,  7.2,  None,None,None,None,None,None,34.2, None,None,None,None,57.1, None,None,70.3],
        "other":   [8.5,  8.2,  8.0,  8.1,  8.2,  8.3,  None,None,None,None,None,None,11.8, None,None,None,None,28.5, None,None,34.9],
    },
    "capacity_gw": {
        "nuclear": [22.5,23.1,23.3,24.7,25.4,24.7,None,26.1,None,None,None,None,28.9,None,None,None,None,32.4,None,None,35.2],
        "coal":    [37.0,36.8,36.9,36.3,36.8,39.2,None,40.8,None,None,None,None,31.7,None,None,None,None,28.1,None,None,22.2],
        "lng":     [41.3,41.7,41.5,43.6,43.0,43.2,None,47.3,None,None,None,None,58.8,None,None,None,None,64.7,None,None,69.2],
        "renew":   [14.5,19.4,24.0,29.3,37.6,30.0,None,39.0,None,None,None,None,78.0,None,None,None,None,107.8,None,None,121.9],
    }
}

def interpolate_plan(plan):
    """None 값을 선형 보간으로 채움"""
    import copy
    result = copy.deepcopy(plan)
    for category in ["generation", "capacity_gw"]:
        for src, values in result[category].items():
            n = len(values)
            # 앵커 포인트 찾기
            anchors = [(i, v) for i, v in enumerate(values) if v is not None]
            for a in range(len(anchors)-1):
                i0, v0 = anchors[a]
                i1, v1 = anchors[a+1]
                for i in range(i0+1, i1):
                    t = (i-i0)/(i1-i0)
                    result[category][src][i] = round(v0*(1-t)+v1*t, 1)
    return result


# ══════════════════════════════════════════════════════
# 4. 지역별 발전·수요 (EPSIS 연간 확정치 — 연 1회 갱신)
#    매년 7~8월에 전년도 확정치 갱신
# ══════════════════════════════════════════════════════
REGIONAL_DATA = {
    "source": "EPSIS 한국전력통계 지역별 발전량·판매전력량",
    "unit": "TWh",
    "last_updated": "2024",
    "generation": {
        2024:{"서울":5.8,"인천":49.7,"경기":88.9,"강원":26.1,"경남":45.7,"경북":99.8,"광주":0.9,"대구":3.0,"대전":0.3,"부산":37.1,"울산":33.0,"전남":71.7,"전북":15.9,"제주":4.7,"충남":103.6,"충북":4.4},
        2023:{"서울":6.0,"인천":51.1,"경기":87.2,"강원":27.8,"경남":44.3,"경북":103.5,"광주":0.8,"대구":3.1,"대전":0.3,"부산":38.2,"울산":33.2,"전남":72.4,"전북":14.4,"제주":4.5,"충남":116.8,"충북":4.3},
        2022:{"서울":6.2,"인천":52.3,"경기":88.5,"강원":29.1,"경남":44.9,"경북":110.4,"광주":0.8,"대구":3.2,"대전":0.3,"부산":37.5,"울산":34.1,"전남":68.3,"전북":13.8,"제주":4.2,"충남":130.9,"충북":4.5},
    },
    "demand": {
        2024:{"서울":46.2,"인천":29.1,"경기":121.4,"강원":16.8,"경남":37.2,"경북":36.8,"광주":13.9,"대구":21.5,"대전":15.6,"부산":29.4,"울산":26.2,"전남":31.8,"전북":21.3,"제주":6.0,"충남":51.2,"충북":24.1},
        2023:{"서울":46.5,"인천":28.8,"경기":119.2,"강원":16.5,"경남":36.8,"경북":36.2,"광주":13.6,"대구":21.2,"대전":15.3,"부산":29.1,"울산":25.8,"전남":31.2,"전북":20.8,"제주":5.9,"충남":49.8,"충북":23.5},
    }
}


# ══════════════════════════════════════════════════════
# MAIN — 모든 데이터 수집 후 JSON 저장
# ══════════════════════════════════════════════════════
def main():
    print(f"\n🚀 데이터 수집 시작: {TODAY}\n{'='*50}")

    # 1. EPSIS 발전량
    epsis_gen = fetch_epsis_generation()

    # 2. K-water 댐 저수율
    dam_data = fetch_kwater_dams()

    # 3. 전기본 전망 (보간 포함)
    plan_data = interpolate_plan(PLAN_DATA)

    # 4. 지역별 데이터 (정적)
    regional_data = REGIONAL_DATA

    # ── 전체 통합 JSON 저장 ──────────────────────────
    output = {
        "meta": {
            "updated_at": TODAY.isoformat(),
            "updated_ts": int(time.time()),
        },
        "plan": plan_data,
        "epsis_monthly": epsis_gen,
        "dams": {
            name: {**info, "source": "K-water 수문정보"}
            for name, info in dam_data.items()
        },
        "regional": regional_data,
    }

    out_path = os.path.join(DATA_DIR, "dashboard_data.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"\n✅ 저장 완료: {out_path}")
    print(f"   댐 데이터: {len(dam_data)}개")
    print(f"   EPSIS 월별: {len(epsis_gen)}건")

if __name__ == "__main__":
    main()
