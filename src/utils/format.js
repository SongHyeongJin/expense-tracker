// 날짜나 숫자 등을 화면에 쓰기 좋은 형식으로 변경하는 함수 모음

// date 매개변수가 없으면 기본값으로 현재 날짜 사용
export function toDateInputValue(date = new Date()) {
  // 현재 사용자의 로컬 시간을 계산하기 위해 타임존 오프셋(분)를 가져옴  타임존 오프셋-현재 지역과 UTC의 차이(분 단위)
  // 밀리초로 변환하기 위해 60000을 곱함(1분 = 60000ms)
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset) //현재 시간(단위:ms)에서 타임존 오프셋을 빼서 로컬 시간 기준으로 보정된 Date 객체를 생성
    .toISOString() //날짜를 ISO 문자열로 변환(형식: 2026-04-09T09:00:00.000Z)
    .slice(0, 10); //문자열 앞에서부터 10자리를 자르기. YYYY-MM-DD 가 잘린 결과
}
