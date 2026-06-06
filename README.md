# chart-demo

다양한 API 응답 구조(시리즈/리스트 형태 등)를 Recharts로 시각화하는 방식을 실험하는 Next.js 차트 데모 프로젝트입니다. "외지인 거래량" 데이터를 라인 차트와 피벗 테이블로 렌더링하며, 여러 응답 포맷을 차트용 wide-format으로 변환하는 패턴을 비교합니다.

> 학습/실험용 데모입니다. 완성된 제품이 아니며 페이지마다 데이터 소스와 구현 방식이 다릅니다.

## 기술 스택

코드(`package.json`)에서 확인한 버전입니다.

- **Next.js** 16.0.3 (App Router)
- **React** 19.2.0 / React DOM 19.2.0
- **TypeScript** 5
- **Recharts** 3.4.1 (차트 렌더링)
- **Tailwind CSS** 4 (`@tailwindcss/postcss`)
- **axios** 1.13 (의존성에 포함)

## 시작하기

개발 서버를 실행합니다.

```bash
npm run dev
# 또는 yarn dev / pnpm dev / bun dev
```

브라우저에서 아래 경로 중 하나를 엽니다. 이 프로젝트에는 루트 페이지(`app/page.tsx`)가 없으므로 `http://localhost:3000/`은 동작하지 않습니다.

| 경로 | 데이터 소스 | 설명 |
| --- | --- | --- |
| `/after-series` | `public/data/after-series.json` (정적) | `{ periods, labels, series }` 시리즈 기반 응답을 라인 차트 + 피벗 테이블로 렌더링 |
| `/before-series` | `public/data/before-series.json` (정적) | `data.list` 리스트 기반 응답을 같은 방식으로 렌더링 (이전 응답 구조) |
| `/test2` | `public/data/price.json` (정적) | `data.prices` 구조 실험 |
| `/test3` | `public/data/response4.json` (정적) | 시리즈 구조 실험 |
| `/trade/outsider` | — | 미완성 (아래 참고) |

## 사용 가능한 스크립트

```bash
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드
npm run start   # 빌드된 앱 실행
npm run lint    # ESLint
```

## 프로젝트 구조

```
app/
  after-series/page.tsx     # 시리즈 기반 응답 렌더링
  before-series/page.tsx    # 리스트 기반 응답 렌더링
  test2/page.tsx            # price.json 실험
  test3/page.tsx            # response4.json 실험
  trade/outsider/page.tsx   # 외지인 거래량 페이지 (미완성)
  layout.tsx
components/
  charts/OutsiderBarChart.tsx    # 평균 기준선이 포함된 막대 차트
  tables/OutsiderPivotTable.tsx  # 기간별 피벗 테이블
hooks/useOutsiderVolume.ts       # 외지인 데이터 로드/매핑 훅
libs/api/outsiderApi.ts          # 백엔드 API 호출
utils/mapOutsiderResponse.ts     # API 응답 -> wide/pivot 변환
types/                           # chart, outsider, location 타입
public/data/                     # 데모용 정적 JSON 응답
```

## 데이터 소스 참고

- `/after-series`, `/before-series`, `/test2`, `/test3` 페이지는 **`public/data/`의 정적 JSON 파일**을 `fetch`로 읽어 렌더링하므로 별도 백엔드 없이 동작합니다.
- `libs/api/outsiderApi.ts`는 `http://localhost:8080/v1/trade/volume/outsider`로 요청하는 **외부 백엔드**를 가정합니다. 해당 백엔드는 이 저장소에 포함되어 있지 않습니다.

## 알려진 상태 / 한계

- `/trade/outsider` 페이지는 현재 `OutsiderPivotTable`을 복사한 형태이며, `useOutsiderVolume` 훅이나 `OutsiderBarChart`를 사용하지 않습니다. 즉 `outsiderApi` → `useOutsiderVolume` → `mapOutsiderResponse` → `OutsiderBarChart`로 이어지는 파이프라인을 실제로 렌더링하는 화면은 아직 없습니다.
- `app/layout.tsx`의 메타데이터는 기본값("Create Next App")이 그대로 남아 있습니다.
- 페이지별로 스타일링 방식(인라인 스타일 / Tailwind)과 데이터 구조가 제각각입니다. 이는 응답 포맷 실험 과정의 흔적입니다.
