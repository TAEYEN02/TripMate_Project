# TripMate_Project

## ✈️ 소개
사용자 맞춤 여행 일정 자동 생성 & 지도 기반 여행 계획 플랫폼

## 🛠 기술 스택
- Front: React (tripmate/)
- Back: Spring Boot (trip/)
- DB: H2 (test) / MySQL (prod)

## 📂 폴더 구조
- trip/ : 백엔드(Spring)
- tripmate/ : 프론트엔드(React)

## 🔧 브랜치 전략
- `main`: 배포용
- `dev`: 개발 통합
- `feature/*`: 기능별 브랜치 (ex. feature/login)

## 🔑 커밋 컨벤션
=> 이건 커밋할 때 메시지로 넣는거입니다.
예를 들어  
git add .   
git commit -m "feat(auth): 로그인 기능 추가"  
git push/n  
이렇게요..  

- [feat] 기능 추가
- [fix] 버그 수정
- [refactor] 리팩토링

## ✏️ 협업 규칙
- 커밋 컨벤션: [feat/fix/refactor] 내용 (#이슈번호)
- feature 브랜치?
- 동시에 작업한다고 해보면 각각 기능을 맡는데 여기에
    - A는 로그인 기능
    - B는 게시판 기능
    - C는 여행지 추천 기능 ...  
브랜치 이름	            하는 일  
feature/login	          로그인 개발  
feature/post	          게시판 개발  
feature/recommend	      여행지 추천 기능 개발  

- 이렇게 해서 각자 개발하고 이 작업이 다 끝나면 페이지 대로 dev 브런치로 Pull Request 보내서 병합할거라 꼭 이렇게 push pull 해주세요!  

git checkout dev                    # 항상 dev 기준으로!  
git checkout -b feature/login       # 브랜치 생성  
git push origin feature/login       # 원격에 올리기   
=> origin은 목적지 원격 저장소 이름 / dev 나 feature/*이건 브랜치 이름  

## 🔁 작업 흐름 예시
1. 최신 dev 가져오기  
git checkout dev        # dev 브랜치로 이동해서, 여기서 새 브랜치를 만들 준비  
git pull origin dev     # GitHub에서 최신 내용 받아오기  
2. 기능 브랜치 만들기 (예: 로그인 기능)  
git checkout -b feature/login      # dev 기준으로 새로운 기능 브랜치 만들기  
3. 작업하고, 커밋하고, 푸시  
git add .  
git commit -m "[feat] 로그인 기능 구현"  
git push origin feature/login       #만든 브랜치를 GitHub로 올리기  

4. GitHub에서 Pull Request 보내기 (→ dev로!) => 우선 할 수 있으신분은 하되 잘 모르시겠으면 하지마새요! 
