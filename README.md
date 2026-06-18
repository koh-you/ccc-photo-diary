# CCC 로컬 MVP

CCC는 Capture, Crop, Carving의 약자입니다.

- Capture: 사진과 순간을 붙잡기
- Crop: 필요한 맥락을 잘라내어 정리하기
- Carving: 정보와 감상을 깎아 아카이브로 남기기

## 현재 화면 구조

첫 화면은 입력 폼을 숨기고, 전체 흐름만 보여줍니다.

1. 전체 개요
2. 큰 `사진 촬영` 영역
3. 음식, 와인, 문화예술, 수학문제 앨범

사진을 찍거나 선택하면 작성 화면으로 이동합니다. 각 앨범에 들어가면 과거 기록 목록을 먼저 보고, 필요할 때 사진을 추가하거나 기존 기록을 수정할 수 있습니다.

## 실행 방법

### 가장 쉬운 실행

아래 파일을 더블클릭하세요.

```text
start-ccc-server.cmd
```

이제 저장된 API 키가 없어도 서버가 켜집니다. API 키는 CCC 작성 화면에 입력할 수 있습니다.

실행되면 PC 브라우저가 자동으로 열립니다.

브라우저에 `ERR_CONNECTION_REFUSED`가 보이면 서버가 꺼져 있는 상태입니다. `start-ccc-server.cmd`를 다시 실행하고, 창을 닫지 않은 채 새로고침하세요.

### 직접 실행

로컬 서버로 실행해야 iPhone에서 접속하고 AI 프록시도 사용할 수 있습니다.

```powershell
cd C:\Users\force\Documents\Codex\2026-06-10\1-2-3-4-ai-ai\outputs\photo-diary-local-app
node server.js
```

PC에서 확인:

```text
http://127.0.0.1:8080
```

iPhone에서 확인:

```text
http://PC의-WiFi-IP:8080
```

예:

```text
http://172.30.1.18:8080
```

## AI 호출 실행

AI 호출은 브라우저가 직접 Claude/OpenAI에 접속하지 않고, 로컬 Node 서버나 Vercel 서버 함수가 대신 호출합니다. 기본 제공자는 Claude API입니다.

### 가장 쉬운 방법: 앱에 한 번 저장

PowerShell에 긴 API 키를 붙여넣기 어렵다면 이 방식을 쓰세요.

1. `node server.js`로 서버만 실행합니다.
2. iPhone 또는 브라우저에서 CCC를 엽니다.
3. 작성 화면에서 `AI 제공자`를 고르고, Claude는 `sk-ant-...`, OpenAI는 `sk-...` 전체 키를 붙여넣습니다.
4. `이 기기에 API 키 저장`을 체크합니다.
5. 이후부터는 같은 브라우저/PWA에서 자동으로 키가 입력됩니다.

이 방식은 개인 iPhone 또는 개인 브라우저에서만 쓰는 것을 권장합니다. 저장된 키를 지우려면 `저장된 키 삭제`를 누르세요.

AI가 안 되면 작성 화면의 `서버 확인` 버튼을 먼저 누르세요.

- 서버 연결 정상 여부
- 서버 환경변수 API 키 유무
- 현재 서버 기본 모델

을 확인할 수 있습니다.

### 선택: 키를 Windows에 암호화 저장하고 더블클릭 실행

PowerShell 대신 더블클릭 파일을 쓰고 싶다면 이 방식도 가능합니다.

1. Anthropic 또는 OpenAI API key 전체를 복사합니다. Claude는 `sk-ant-`, OpenAI는 `sk-`로 시작해야 합니다.
2. `setup-openai-key.cmd`를 더블클릭합니다.
3. 저장 완료 메시지가 나오면 닫습니다.
4. 이후부터는 `start-ccc-server.cmd`만 더블클릭합니다.

이 방식은 키 원문을 저장하지 않고, Windows DPAPI로 현재 Windows 사용자 계정에 묶어 암호화 저장합니다.

서버가 켜진 뒤 PC에서는 아래 주소로 확인합니다.

```text
http://127.0.0.1:8080
```

iPhone에서는 같은 Wi-Fi에서 PC의 Wi-Fi IP로 접속합니다.

```text
http://172.30.1.18:8080/?v=6
```

### 직접 PowerShell에서 실행

서버 실행 전에 기본 Claude용 `ANTHROPIC_API_KEY` 환경변수를 설정하세요. OpenAI를 선택 제공자로 쓰려면 `OPENAI_API_KEY`도 설정할 수 있습니다.

```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."
node server.js
```

모델은 기본값으로 Claude `claude-sonnet-4-6`을 사용합니다. 바꾸고 싶으면 `ANTHROPIC_MODEL`을 지정합니다. OpenAI 선택 시에는 `OPENAI_MODEL`을 사용합니다.

```powershell
$env:ANTHROPIC_API_KEY="sk-ant-..."
$env:ANTHROPIC_MODEL="claude-sonnet-4-6"
node server.js
```

앱에서는 사진을 찍거나 선택한 뒤 작성 화면의 `AI 호출` 버튼을 누릅니다.

서버 환경변수 설정이 번거로우면 작성 화면의 API 키 칸에 선택한 제공자의 키를 직접 입력해도 됩니다.

```text
앱 화면 API 키 입력
-> 로컬 Node 서버로 전달
-> 로컬 Node 서버가 선택한 AI API 호출
```

이 키는 앱이 자동 저장하지 않습니다. 다만 같은 Wi-Fi의 다른 사람이 앱에 접근할 수 있는 환경에서는 API 키 입력 방식을 쓰지 않는 것이 좋습니다.

브라우저에서 AI API를 완전히 직접 호출하는 방식은 CORS와 API 키 노출 문제 때문에 권장하지 않습니다. Claude/ChatGPT 웹 화면을 우회해서 제출하는 방식도 공식 API가 아니어서 안정적으로 만들기 어렵습니다.

현재 AI 흐름:

- 와인: 라벨 사진을 보고 와인명, 생산지, 품종, 빈티지 후보와 테이스팅 노트 초안 생성
- 수학문제: 단원, 문제 유형, 풀이 핵심, 막힌 부분, 설명 보완 포인트 정리
- 문화예술: 작품/공간/건축물의 배경정보 초안과 감상 정리 키워드 제안
- 음식: 음식명, 맛 메모, 장소 맥락 초안 생성

`AI 초안 반영`을 눌러야 입력칸에 들어갑니다. 반영 후에도 사용자가 직접 고칠 수 있습니다.

## 여러 사진 기록

같은 음식, 와인, 전시, 수학문제에 사진을 여러 장 붙일 수 있습니다.

- `사진 촬영/추가`: 카메라로 한 장씩 추가
- `사진 선택/추가`: 사진 보관함에서 여러 장 선택 가능
- 썸네일 클릭: 대표 사진으로 설정
- 썸네일의 `×`: 해당 사진만 제거

목록과 앨범 커버는 대표 사진을 사용합니다. 상세 화면, 백업, PDF에는 여러 사진이 반영됩니다.

## 구현된 기능

- 홈/앨범/작성 화면 분리
- 전체 개요 데이터를 첫 화면 최상단에 배치
- 큰 사진 촬영 영역
- 카테고리별 앨범 진입
- 앨범 안에서 과거 기록 보기
- 사진 촬영/선택 후 작성 화면 이동
- Claude 기본, OpenAI 선택 가능한 AI 프록시 엔드포인트
- AI 초안 생성과 수동 반영
- 여러 사진 저장
- 여러 사진 대표 사진 선택
- 여러 사진 상세 갤러리 표시
- 사진 원본 Blob을 IndexedDB에 저장
- 앱 내부에서 사진 압축 없음
- AI 호출용 이미지만 별도 축소본 사용, 최대 4장 전송
- JPEG EXIF에서 촬영일/GPS 자동 추출
- 휴지통, 복원, 완전 삭제
- JSON 백업 내보내기/가져오기
- 상세 기록 PDF 저장
- 원본 사진 저장/공유

## iPhone 사진 앱 저장 제한

PWA나 일반 웹앱은 보안 정책 때문에 사진을 촬영한 뒤 iPhone의 사진 앱에 자동으로 조용히 저장할 수 없습니다.

현재 MVP에서는 앱 내부에 원본 Blob을 저장하고, 상세 화면의 `원본 사진 저장/공유` 버튼으로 iPhone 공유 시트에서 `이미지 저장`을 선택하는 방식입니다.

완전 자동 저장은 Swift/SwiftUI, React Native, Capacitor 같은 iOS 앱 구현이 필요합니다.

## 참고한 AI 공식 문서

- Images and vision: 이미지 입력은 Responses API에서 `input_image`를 사용할 수 있습니다.
- Structured Outputs: JSON Schema 형식으로 구조화된 응답을 받을 수 있습니다.
