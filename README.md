# 프로젝트명
TripMate

## 개요
여행 스케줄링 플랫폼 (TripMate)

## 기술 스택
- Front: React
- Back: Spring Boot
- DB: H2 (test), MySQL (prod)

## 협업 규칙
- 브랜치 전략: main / dev / feature/*
- 브랜치 할떄는 무조건 dev!
- master은 배포용으로 쓸거라 쓰지 마세요

## 개발 시 commit 방법
- ex) 로그인 기능 개발 시
- git checkout dev                   # 항상 dev 기준으로
- git checkout -b feature/login      # 브랜치 생성
- [작업 후]
- git add .
- git commit -m "[feat] 로그인 기능 구현"
- git push origin feature/login

- * 여기서 feature 브랜치란
    -> 동시에 작업시 각 기능이 있잖아요?
    -> 이걸 기능 단위로 작업하고 병합할때 좀 더 편하게 할려고 하는거니깐 꼭 브랜치 설정 꼭 잘 해주세요
    예를들어 A는 로그인, B는 게시판, C는 여행지 추천...
    -> 그래서 feature/[자기가 맡은 부분]
    - feature/login => 로그인개발
    - feature/post => 게시판 개발
    - feature/recommend => 여행지 추천 기능 개발
  => 이게 다 끝내면 dev로 가서 pull Request로 보내 병합할거라 무조건! feature로 브랜치 하세요
