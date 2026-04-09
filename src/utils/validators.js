// 입력값이 숫자가 아니거나 0이하면 null반환
// 입력값이 없어도 null반환
// 정상적인 양수면 숫자로 변환
export function parsePositiveNumber(value) {
  // 빈 값 체크  ''/null/undefined라면 null 반환
  if (value === '' || value === null || value === undefined) return null;
  // value를 숫자로 변환
  const amount = Number(value);
  // 변환한 값이 숫자가 아니거나 0 이하이면 null반환
  if (!Number.isFinite(amount) || amount <= 0) return null;
  // 숫자로 변환된 값 반환
  return amount;
}
// 값이 존재하고 Date 객체로 변환했을 때 유효한 날짜면 trueqksghks
export function isValiDate(value) {
  //값이 존재하는지 체크   날짜를 숫자로 변환하여 NAN인지 검사
  return Boolean(value) && !Number.isNaN(new Date(value).getTime());
}
