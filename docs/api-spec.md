# API 명세서

## 1. 개요

- 목적: 사용자의 수입/지출 내역을 관리하고, 데이터를 기반으로 프론트엔드에서 재정 분석을 수행하는 가계부 서비스 API
- 버전: v1.0
- 호스트 URL: http://localhost:3000

---

## 2. 인증

- 방식: 없음 (json-server 기반 Mock API)
- 설명: 본 프로젝트는 인증 없이 API를 호출합니다.
- 헤더 예시: Content-Type: application/json

---

## 3. 공통 응답 코드

- 200: 성공
- 201: 생성 성공
- 400: 잘못된 요청
- 404: 리소스 없음
- 500: 서버 오류

---

## 4. API 엔드포인트 명세

## 4.1 거래 내역 등록

- URL: /transactions
- 메소드: POST

- 요청 Body:

```json
{
  "date": "2026-04-07",
  "amount": 15000,
  "category": "식비",
  "memo": "점심 식사",
  "type": "expense"
}
```

- 응답 (성공):

```json
{
  "id": 1,
  "date": "2026-04-07",
  "amount": 15000,
  "category": "식비",
  "memo": "점심 식사",
  "type": "expense"
}
```

- 응답 (오류):

```json
{
  "error": "잘못된 요청입니다."
}
```

---

## 4.2 거래 내역 전체 조회

- URL: /transactions
- 메소드: GET

- Query 파라미터:
  - date_gte: 시작 날짜
  - date_lte: 종료 날짜
  - category: 카테고리
  - type: income / expense
  - \_sort: 정렬 기준 (date, amount)
  - \_order: asc / desc

- 예시:

```
GET /transactions?type=expense&_sort=date&_order=desc
```

- 응답:

```json
[
  {
    "id": 1,
    "date": "2026-04-07",
    "amount": 15000,
    "category": "식비",
    "memo": "점심 식사",
    "type": "expense"
  }
]
```

---

## 4.3 거래 내역 상세 조회

- URL: /transactions/{id}
- 메소드: GET

- 응답:

```json
{
  "id": 1,
  "date": "2026-04-07",
  "amount": 15000,
  "category": "식비",
  "memo": "점심 식사",
  "type": "expense"
}
```

---

## 4.4 거래 내역 수정

- URL: /transactions/{id}
- 메소드: PUT

- 요청 Body:

```json
{
  "date": "2026-04-07",
  "amount": 20000,
  "category": "식비",
  "memo": "저녁 식사",
  "type": "expense"
}
```

- 응답:

```json
{
  "id": 1,
  "date": "2026-04-07",
  "amount": 20000,
  "category": "식비",
  "memo": "저녁 식사",
  "type": "expense"
}
```

---

## 4.5 거래 내역 삭제

- URL: /transactions/{id}
- 메소드: DELETE

- 응답:

```json
{
  "message": "삭제되었습니다."
}
```

---

## 4.6 예산 등록

- URL: /budgets
- 메소드: POST

- 요청 Body:

```json
{
  "month": "2026-04",
  "amount": 2000000
}
```

- 응답:

```json
{
  "id": 1,
  "month": "2026-04",
  "amount": 2000000
}
```

---

## 4.7 예산 조회

- URL: /budgets
- 메소드: GET

- Query 파라미터:
  - month: YYYY-MM

- 응답:

```json
[
  {
    "id": 1,
    "month": "2026-04",
    "amount": 2000000
  }
]
```

---

## 4.8 예산 수정

- URL: /budgets/{id}
- 메소드: PUT

- 요청 Body:

```json
{
  "month": "2026-04",
  "amount": 2500000
}
```

- 응답:

```json
{
  "id": 1,
  "month": "2026-04",
  "amount": 2500000
}
```

---

## 5. 프론트엔드 계산 로직

※ 아래 기능들은 API가 아닌 프론트엔드(Vue)에서 처리

- 월별 재정 요약
  - 총 수입 = type이 income인 금액 합계
  - 총 지출 = type이 expense인 금액 합계
  - 순이익 = 총 수입 - 총 지출

- 카테고리별 소비 통계
  - expense 데이터만 필터링 후 category 기준 그룹화

- 예산 사용률
  - 사용금액 = 해당 월 expense 합계
  - 사용률 = (사용금액 / 예산) \* 100
  - 초과 시 경고 처리

---

## 6. 데이터 구조

거래

```json
{
  "id": number,
  "date": string,
  "amount": number,
  "category": string,
  "memo": string,
  "type": "income" | "expense"
}
```

예산

```json
{
  "id": number,
  "month": "YYYY-MM",
  "amount": number
}
```
