# AI 뉴스 브리핑 웹앱

뉴스 수집부터 임베딩·군집화, GPT 요약 생성, 데이터베이스 저장까지 연결한 파이프라인과 React·Express 웹앱을 담은 팀 프로젝트입니다.

여러 기사에서 같은 주제의 뉴스를 묶고, 요약된 기사를 웹에서 검색하고 읽는 흐름을 구현합니다. 이 저장소에는 데이터 처리 코드, API 서버, 사용자 화면이 함께 있습니다.

[포트폴리오](https://dpwld.github.io/) · [파이프라인 진입점](model/main.py) · [API 서버](backend/src/index.ts)

## 주요 구성

| 영역 | 내용 | 코드 |
| --- | --- | --- |
| 뉴스 처리 | 뉴스 수집 → 임베딩·군집화 → GPT 요약 생성 → DB 저장 | [model/main_pipeline](model/main_pipeline) |
| API | 기사·검색·사용자·마이페이지·커뮤니티 라우트 | [backend/src/routes](backend/src/routes) |
| 웹 화면 | 기사 목록·상세, 검색, 북마크, 커뮤니티, 계정 화면 | [frontend/src/pages](frontend/src/pages) |
| 데이터 | MySQL 스키마와 데이터 저장 모듈 | [backend/db.sql](backend/db.sql), [database_saver.py](model/main_pipeline/database_saver.py) |

## 데이터 흐름

```text
뉴스 수집
  → 임베딩 및 군집화
  → GPT 요약 생성
  → MySQL 저장
  → Express API
  → React 웹앱
```

[`model/main.py`](model/main.py)가 네 단계를 순서대로 실행하며 단계별 상태를 출력합니다. 요약 단계는 `OPENAI_API_KEY`가 없으면 중단하고, 파이프라인 오류는 상위 호출로 전달합니다.

프론트엔드는 API 요청에 인증 토큰을 붙이고, 401 응답을 받으면 토큰 재발급 후 한 번 다시 요청합니다. [인증 요청 처리](frontend/src/api/axiosInstance.ts)

## 기술 스택

- 웹: React, TypeScript, React Router, Zustand, Axios
- API: Express, TypeScript, MySQL, JWT, Swagger
- 데이터 처리: Python, Sentence Transformers, scikit-learn, HDBSCAN, OpenAI API
- DB 연결: PyMySQL 또는 Google Cloud SQL Connector

## 디렉터리

```text
backend/    Express API와 MySQL 스키마
frontend/   React 웹앱
model/      뉴스 처리 파이프라인
```

## 개발 명령

실행 전 MySQL 연결 설정, 뉴스 수집에 필요한 설정, OpenAI API 키를 준비해야 합니다. 아래 명령은 각 구성 요소를 시작하는 진입점입니다.

```bash
git clone https://github.com/dpwld/Summer_Project.git
cd Summer_Project

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

npm ci --prefix backend
npm ci --prefix frontend

cp backend/.env.example backend/.env
```

`backend/.env`에 로컬 DB 연결 정보와 서로 다른 두 JWT 비밀값을 입력합니다. DB를 사용하는 두 진입점은 같은 환경변수 기반 연결 풀을 공유합니다. 뉴스 처리의 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`, `OPENAI_API_KEY`와 DB 환경변수는 Python 실행 환경에도 별도로 설정해야 합니다. `.env`와 생성 데이터는 Git에 포함하지 않습니다.

각 프로세스는 별도 터미널에서 실행합니다.

```bash
# 뉴스 수집·군집화·요약·저장
python model/main.py

# API 서버: 기본 http://localhost:8080
npm run dev --prefix backend

# 웹앱: 기본 http://localhost:3000
npm start --prefix frontend
```

프론트엔드 API 기본 주소는 `http://localhost:8080/api`이며 `REACT_APP_API_URL`로 설정할 수 있습니다. 서버의 Swagger 경로는 `/api-docs`입니다.

## 빌드와 검사

```bash
# TypeScript 컴파일 + Swagger YAML 복사 + 외부 연결 없는 구성 검사
npm test --prefix backend

# 생성된 서버 실행 (먼저 backend/.env 설정)
npm start --prefix backend

# 프론트엔드 빌드와 외부 요청 없는 홈·로그인 경로 검사
npm run build --prefix frontend
CI=true npm test --prefix frontend -- --watchAll=false --runInBand
```

`backend/dist/`는 빌드 결과이므로 Git에서 관리하지 않습니다. 빌드 시
`backend/src/swagger/*.yaml`도 함께 복사됩니다. Python의 `model/results/` 역시
실행 시 생성됩니다.

`model/test.py`와 `model/test_pipeline/`은 과거 실험용 파이프라인입니다.
`model/main.py`와 일부 처리 방식이 달라 연구 기록으로 유지합니다.
이름에 `test`가 있지만 외부 뉴스 API·LLM·DB를 사용하는 실행 코드이며,
오프라인 단위 테스트가 아닙니다.

## 현재 범위

이 저장소는 팀 프로젝트의 구현 기록입니다. 실행에는 외부 뉴스 소스, LLM API와 데이터베이스 연결이 필요합니다. 저장소에 있는 코드만으로 운영 성과나 요약 정확도를 보장하지 않으며, 서비스 적용 시 실제 입력을 이용한 평가가 필요합니다.

