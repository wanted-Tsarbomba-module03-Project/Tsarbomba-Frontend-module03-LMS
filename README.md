# 📚 강의 및 강좌 등록 도메인 구축 프로젝트

<br>

## 📁 파일 구조

```bash
[src]
 ├──[assets]               
 │    ├──[img]             
 │    └──[font]            
 │
 ├──[components]           
 │    ├──[common]          
 │    │    ├── TwoButtonModal.jsx   # [모달] 확인/취소 버튼형
 │    │    ├── OneButtonModal.jsx   # [모달] 확인 버튼형
 │    │    ├── DeleteModal.jsx      # [모달] 삭제 확인 전용
 │    │    ├── WarningModal.jsx     # [모달] 경고/에러 알림용
 │    │    ├── Searchbar.jsx        # [공통] 검색창
 │    │    └── PasswordForm.jsx     # [폼] 비밀번호 재확인
 │    ├──[layout]         
 │    │    ├── Header.jsx           # 헤더
 │    │    ├── CategoryNav.jsx      # 메인 카테고리 필터 바
 │    │    ├── Sidebar.jsx          # 마이페이지/관리자용 측면 메뉴 바
 │    │    └── Footer.jsx           # 하단 정보 바
 │    ├──[lecture]   
 │    │    ├── LectureForm.jsx      # 강의 등록 폼
 │    │    └── MyLectureItem.jsx    # 모드 (card | list)
 │    ├──[problem]         
 │    │    ├── ProblemList.jsx      # 문제 목록용 카드
 │    │    └── ProblemForm.jsx      # 문제 등록 폼
 │    └──[admin]           
 │         └── UserItem.jsx         # 회원 아이템
 ├──[hooks]                
 │    ├── useModal.jsx              # 모달 열고 닫는 로직 제어
 │    └── useAuth.jsx               # 로그인 상태 및 유저 권한(User/Admin) 체크
 │
 ├──[layouts]              
 │    ├── MainLayout.jsx            # 헤더 + 카테고리바가 있는 기본 틀
 │    ├── MypageLayout.jsx          # 헤더 + 마이페이지 사이드바가 있는 틀
 │    ├── AdminLayout.jsx           # 헤더 + 관리자 사이드바가 있는 틀
 │    └── EmptyLayout.jsx           # 로그인/에러페이지 등 최소 UI 틀
 │
 ├──[pages]                
 │    ├──[auth]           
 │    │    ├── LoginPage.jsx          # 로그인
 │    │    ├── SignupPage.jsx         # 회원가입
 │    │    ├── FindIdPage.jsx         # 아이디 찾기
 │    │    └── ResetPwPage.jsx        # 비밀번호 재설정
 │    ├──[common]         
 │    │    ├── HomePage.jsx           # 메인 페이지
 │    │    ├── LectureTotalPage.jsx   # 강의 전체 목록 조회
 │    │    ├── LectureDetailPage.jsx  # 강의 상세 정보 및 소개 / 수강 신청(user) / 수정 삭제 버튼(admin)
 │    │    ├── ProblemTotalPage.jsx   # 문제 전체 목록
 │    │    ├── ProblemDetailPage.jsx  # 문제 상세 정보 / 실제 문제 풀이(user)
 │    │    └── ErrorPage.jsx          # 통합 에러 페이지          
 │    ├──[user]         
 │    │    ├──[lecture]            
 │    │    │    └── LectureSolvePage.jsx   # 강의실 내 임시 문제풀이
 │    │    └──[mypage]              
 │    │         ├── MyLecturePage.jsx      # 내 강의실
 │    │         ├── MypageProfile.jsx      # 프로필 조회
 │    │         ├── ProfileEditPage.jsx    # 정보 수정 및 탈퇴
 │    │         └── AuthVerifyPage.jsx     # 비밀번호 재확인 관문
 │    └──[admin]          
 │         ├──[user]                
 │         │    ├── UserTotalPage.jsx      # 회원 전체 목록
 │         │    └── UserDetailPage.jsx     # 회원 상세 정보
 │         ├──[lecture]             
 │         │    └── LectureRegistPage.jsx  # 강의 등록/수정 폼
 │         └──[problem]             
 │              └── ProblemRegistPage.jsx  # 문제 등록/수정 폼
 │
 ├──[services]             # API 통신 로직 (Axios/Fetch 등)
 │    ├── authService.js      # 로그인/회원가입 관련 API
 │    ├── lectureService.js   # 강의 데이터 관련 API
 │    ├── problemService.js   # 문제 데이터 관련 API
 │    └── adminService.js     # 관리자 전용 데이터 API
 │
 └──[store]                # Redux Toolkit 상태 관리
      ├── store.js            # 중앙 저장소 설정
      ├── userSlice.js        # 유저 정보 및 권한(Role) 상태
      ├── modalSlice.js       # 전역 모달 열림/닫힘 상태
      └── problemSlice.js     # 문제 풀이 진행 상황 등 저장
```

<br>

## 🤝 협업 규칙

작업은 아래 순서에 따라 진행합니다.

| 단계 | 내용 |
|:---:|---|
| 1️⃣ | **Issue 작성** — 담당자, 라벨 필수 |
| 2️⃣ | **Branch 생성** — Branch 작성 규칙 확인 |
| 3️⃣ | **작업 시작** — Coding Convention 준수 |
| 4️⃣ | **Commit & Push** — Commit Message 규칙 확인 |
| 5️⃣ | **Pull Request** — 리뷰어, 담당자, 라벨 필수 |

<br>

## 📝 Issue 작성 규칙
설명 : 이슈 내용 기술
작업할 내용 : 작업할 내용 기술
기타 : 기타사항 기술

<br>

## 🌿 Branch 작성 규칙
기능 구현
feature/페이지

오류 수정
fix/페이지

> ⚠️ 세부 기능명 끝에 숫자가 들어갈 경우 이슈 번호와 혼동될 수 있으므로,
> 이슈 번호는 브랜치명 대신 **커밋 메시지**에 작성합니다.

<br>

## ✉️ Commit Message 작성 규칙

### PREFIX 정리

| PREFIX | 설명 |
|---|---|
| `[FEATURE]` | 새로운 기능 추가 |
| `[FIX]` | 오류를 고친 경우 |
| `[RENAME]` | 파일 혹은 폴더명을 수정하는 경우 |
| `[STYLE]` | 코드 변경 없이 자잘한 수정을 하는 경우 |

### 작성 형식
[PREFIX] 제목 ← 필수

상세 내용 ← 선택

### 작성 예시
예시 1 — 간단하게
[FEATURE] 회원가입 기능 추가

예시 2 — 상세하게
[FEATURE] 회원가입 기능 추가
회원가입 기능 중 아이디, 비밀번호 기능을 추가했습니다.

<br>

## 🔀 Pull Request 작성 규칙
관련 이슈 : 본인이 작성한 이슈 번호
작업 유형 : 작업 내용에 따라 유형 선택
작업 내용 : 작업한 내용 기술
변경 이유 : 변경 이유 기술
기타 : 작업내용, 변경이유 외 작성할 내용
스크린샷 : (선택 — 가급적 첨부 권장)

<br>

## 💻 Coding Convention

### 1. 네이밍 규칙


### 2. 포맷 규칙


### 3. 주석 작성법


### 4. 파일 코드 순서
