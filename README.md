# 🇰🇷 대한민국 에너지 Mix 인터랙티브 대시보드
> 자동 업데이트 + 공유 가능한 URL + 완전 무료

---

## 📐 전체 구조

```
공공 사이트               GitHub Actions          GitHub Pages / Netlify
(EPSIS, K-water)  ──→   (매일 오전 9시 자동)  ──→   https://yourname.github.io/energy-dashboard
                          Python 데이터 수집          대시보드 URL 공유 가능
```

---

## 🚀 설치 가이드 (30분 완성)

### STEP 1 — GitHub 저장소 만들기

1. [github.com](https://github.com) 로그인 (없으면 무료 가입)
2. 우측 상단 `+` → **New repository**
3. Repository name: `energy-dashboard`
4. **Public** 선택 (GitHub Pages 무료 사용 조건)
5. **Create repository** 클릭

### STEP 2 — 파일 업로드

이 폴더 전체를 GitHub에 업로드:
```
energy-dashboard/
├── index.html                       ← 대시보드 메인
├── requirements.txt                 ← Python 패키지 목록
├── scripts/
│   └── fetch_data.py               ← 데이터 수집 스크립트
├── data/
│   └── dashboard_data.json         ← 자동 생성됨 (첫 실행 후)
└── .github/
    └── workflows/
        └── update_data.yml         ← 자동 실행 스케줄
```

업로드 방법:
```bash
# 터미널에서 (Git 설치 필요)
git clone https://github.com/[내계정]/energy-dashboard.git
cd energy-dashboard
# 위 파일들 복사 후
git add .
git commit -m "첫 커밋"
git push
```

또는 GitHub 웹에서 파일 드래그앤드롭으로 업로드

### STEP 3 — GitHub Pages 활성화 (URL 생성)

1. 저장소 → **Settings** 탭
2. 왼쪽 메뉴 **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** / **/ (root)** 선택
5. **Save**
6. 약 1분 후 URL 생성: `https://[내계정].github.io/energy-dashboard`

→ **이 URL을 팀원과 공유하면 됩니다!**

### STEP 4 — API 키 등록 (선택사항, 실시간 발전량 데이터)

EPSIS 실시간 발전량 데이터를 원하면:
1. [공공데이터포털](https://www.data.go.kr) → 회원가입
2. `전원별 발전량` 검색 → API 활용 신청 (무료, 1~3일 승인)
3. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
4. **New repository secret** → Name: `EPSIS_API_KEY`, Value: 발급받은 키

> API 키 없어도 11차 전기본 전망 데이터 + K-water 댐 데이터는 작동합니다

### STEP 5 — 첫 데이터 수집 실행

1. GitHub 저장소 → **Actions** 탭
2. **Daily Data Update** 워크플로우 클릭
3. **Run workflow** → **Run workflow** 버튼
4. 초록 체크 표시 나오면 완료 ✅
5. `data/dashboard_data.json` 파일 자동 생성됨

이후 매일 오전 9시(KST)에 자동으로 데이터 갱신됩니다.

---

## 💰 비용

| 항목 | 비용 |
|---|---|
| GitHub 저장소 | 무료 (Public) |
| GitHub Actions | 무료 (월 2,000분, 하루 1회 실행 시 약 2분 사용) |
| GitHub Pages (URL 호스팅) | 무료 |
| 공공데이터 API | 무료 |
| **합계** | **완전 무료** |

---

## 🔄 데이터 업데이트 주기

| 데이터 | 원본 갱신 주기 | 대시보드 반영 |
|---|---|---|
| K-water 댐 저수율 | 실시간 | 매일 |
| EPSIS 발전량 (월별) | 매월 | 매일 확인, 신규분 반영 |
| 전력수급기본계획 전망 | 2년마다 (신 전기본 발표시) | 수동 업데이트 |
| 지역별 발전·수요 | 연 1회 (7~8월) | 연 1회 수동 |

---

## ❓ 자주 묻는 질문

**Q: K-water API가 막히면?**
A: `fetch_data.py`에 웹 스크래핑 fallback 있음. 실패 시 전년도 데이터 표시.

**Q: 데이터가 안 바뀌는 것 같으면?**
A: Actions 탭에서 워크플로우 실행 로그 확인. 에러 메시지 있으면 이슈 탭에 올려주세요.

**Q: 팀원이 데이터를 직접 수정하고 싶으면?**
A: `data/dashboard_data.json`을 직접 편집 후 커밋하면 즉시 반영됩니다.

**Q: 더 자주 업데이트하고 싶으면?**
A: `update_data.yml`의 cron 값 변경. 예: 6시간마다 → `0 */6 * * *`
