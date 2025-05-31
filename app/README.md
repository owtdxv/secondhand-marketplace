# React + TypeScript + Vite 프로젝트 구조

이 프로젝트는 **React + TypeScript + Vite** 기반으로 구성되어 있으며,  
모든 개발 작업은 `src` 폴더 내에서 진행합니다.

---

## 📁 디렉토리 구조

### assets/

정적 리소스 파일 저장소입니다.

- assets/font  
  폰트 파일 저장 (예: Pretendard 등)
- assets/icon  
  개발에 필요한 아이콘 저장
- 기타 이미지, 파일 등은 assets 하위에 자유롭게 추가

---

### components/

공통 컴포넌트들을 저장합니다.

- components/headers  
  헤더 관련 컴포넌트
- components/buttons  
  버튼 관련 컴포넌트
- components/input, components/modal 등  
  역할별로 폴더를 생성하여 사용 가능

---

### pages/

페이지 단위로 UI를 구성하며, Container + View 구조를 따릅니다.

예시: pages/main

pages/
├── main/
│ ├── Main.tsx # View 컴포넌트 (UI 구현)
│ └── container/
│ └── index.tsx # Container 컴포넌트 (로직 처리)

- View 파일명: 화면명 (예: Main.tsx)
- Container 파일명: index.tsx
- Container 함수명: 화면명 + Container (예: MainContainer)

---

### styles/

CSS 모듈 파일을 저장합니다.

- styles/components  
  컴포넌트별 스타일
- styles/pages  
  페이지별 스타일 (페이지명.module.css 형식)

사용 예시:

import styles from "@/styles/pages/Main.module.css";

<div className={styles.wrap}></div>

---

### types/

공통적으로 사용하는 타입 정의 파일을 저장합니다.

- 폴더 구조 예시:

types/
├── user/
│ └── index.d.ts

- 타입별로 하위 폴더를 만들어 정리 (예: user, product, auth 등)

---

## ✅ 개발 시 유의사항

- 모든 개발은 src/ 내부에서 진행
- 폴더/파일은 역할별로 정확히 분리
- CSS는 \*.module.css 형식 사용
- Container와 View를 분리하여 개발
