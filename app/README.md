# React + TypeScript + Vite

- 파일구조 설명
* 개발 시  src 내에서 작업하시면 됩니다.

- assets : 개발 시 필요한 아이콘, 사진, 폰트 등의 파일을 넣어두는 폴더
- assets > font : 폰트 설정 폴더
- assets > icon : 개발에 사용되는 아이콘 저장 폴더
* 설명 외 파일은 전부 assets에 넣어두면 됨

- components : 개발시 공통되는 컴포넌트를 넣어두는 폴더
- components > headers : 헤더 종류 컴포넌트 저장 장소
- components > buttons : 버튼 종류 컴포넌트 저장 장소
* input 등의 이미 제작된 폴더 외의 기능을 하는 공통 컴포넌트도 해당 폴더를 만들고 그 안에 작업하면 됨.

- pages : 실제 화면을 제작하는 파일을 넣어두는 폴더
- pages > main : main 작업에 필요한 화면 파일 저장 장소
* 다른 페이지도 동일하게 작업하면 되며, 폴더 속은 view 페이지를 container 페이지가 감싸 container 폴더를 띄우고 있는 형태임
* 이름은 view 페이지의 경우 화면명 (ex. Main.tsx) container의 경우 index.tsx 로 제작하고 내부 함수명을 화면명+Container (ex.MainContainer)
* view 에서는 화면 구현을 Container에는 기능을 만들어주는 코드를 제작하면 됨.

- styles : css 파일을 넣어두는 폴더
- styles > components : 컴포넌트 제작 시 사용하는 css를 넣어두는 폴더
- styles > pages : 페이지 제작 시 사용하는 css를 넣어두는 폴더
* 페이지명.module.css 로 제작하며 css 가 들어가는 페이지에서 styles로 import 하여 사용
ex) import styles from "경로"
    <div className={styles.wrap}></div> 

- types : 공용적으로 사용하는 변수의 타입을 지정한 파일을 넣어두는 폴더
- types > user > index.d.ts 형식으로 폴더 구조를 만들어주면 되고 다른 종류의 타입이 필요하다면 꼭 폴더 제작 후 안에 파일을 넣어서 사용
