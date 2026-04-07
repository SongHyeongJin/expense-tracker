## **설치 및 실행 방법**

이 프로젝트를 로컬에서 실행하기 위해선 다음의 설치 및 실행 과정을 따라주세요:

1. **프로젝트 클론하기**

   ```bash
   git clone https://github.com/SongHyeongJin/expense-tracker.git
   ```

2. **디렉토리로 이동하기**

   ```bash
   cd expense-tracker
   ```

3. **패키지 설치**

   ```bash
   npm install
   ```

4. **JSON 서버 및 프로젝트 실행하기**

   ```bash
   # JSON 서버 실행 (mock API)
   npx json-server --watch db.json --port 3000
   ```

   새로운 bash 열기.

   ```bash
   # 개발 서버 실행
   npm run dev
   ```

5. **구동 후 확인하기**
   - 웹 브라우저를 열고 [http://localhost:5173](http://localhost:5173/) 에 접속해 확인합니다.
