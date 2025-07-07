## 사용
프로젝트에 사용된 모든 API키들을 삭제 또는 그에 준하는 작업을 수행했습니다.
키를 재 발급 받지 않는 이상 사용이 불가합니다.

## 의존성 설치

프로젝트의 루트 경로(현재 README.md파일이 있는 위치)에서 아래 명령어를 순서대로 입력합니다.

```
npm install
npm run install-all
```

## 실행

아래 명령어를 입력합니다. 3개 프로젝트가 동시에 실행됩니다.

```
npm run dev
```

이후 아래 주소로 접속합니다

```
http://localhost:5173
```

참고로 다른 두 프로젝트는 각각 `8080(nestjs), 8000(express)`포트에서 실행됩니다.

## 실행2 (docker)

프로젝트의 루트 경로(현재 README.md파일이 있는 위치)에서 아래 명령어를 순서대로 입력합니다.

```
docker-compose build --no-cache

# 빌드가 완료된 후
docker compose up
```

이후 아래 주소로 접속합니다

```
http://localhost
```
