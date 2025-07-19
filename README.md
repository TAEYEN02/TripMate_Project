# TripMate_Project

## ✈️ 소개
사용자 맞춤 여행 일정 자동 생성 & 지도 기반 여행 계획 플랫폼

<br/>개발기간:(2025.06.30 ~ 2025.07.15)
<br/>배포기간:(2025.07.15 ~ 2025.07.19)

배포 웹 : https://app.tripmateweb.store/

## 🛠 기술 스택
<h4>Frontend</h4>
- React (tripmate/) : 사용자 인터페이스를 구성하는 데 사용되었으며, SPA(Single Page Application) 방식으로 구현하여 페이지 전환 시 새로고침 없이 부드러운 사용자 경험 제공
- Node.js : 프론트엔드 개발 및 패키지 관리를 위한 환경으로 활용
- JavaScript : 동적 웹 기능 구현 및 React 생태계 구성에 사용
<h4>Backend</h4>
- Spring Boot (trip/) : 안정성과 확장성이 뛰어난 Java 기반 웹 프레임워크로 백엔드 API 서버 구성
- DB: H2 (test) / MySQL (prod) : 개발 단계에서는 인메모리 DB(H2)를 사용하고, 운영 단계에서는 MySQL을 사용해 사용자 데이터를 영구 저장
- Spring Security, JWT(JSON Web Token) : 인증/인가 및 사용자 권한 관리를 위한 보안 프레임워크로, 안전한 API 접근을 보장
- Java : 서버 로직 및 데이터 처리 구현에 사용된 주요 언어
<h4>배포</h4>
- AWS Elastic Beanstalk : Spring Boot 백엔드와 React 프론트엔드 서버를 배포
- AWS EC2 : React와 Spring Boot가 구동되는 인스턴스 생성
- AWS Route 53 : 도메인 연결과 트래픽 라우팅
- AWS Aurora and RDS : MySQL 호환하는 데이터베이스 연결
<h4>협업 툴</h4>
- git : 형상 관리 및 협업을 위한 버전 관리 도구로, 브랜치 전략을 통해 안정적인 코드 관리 수행

## 📂 폴더 구조
- trip/ : 백엔드(Spring)
- tripmate/ : 프론트엔드(React)

## 🔧 브랜치 전략
- `main`: 배포용
- `dev`: 개발 통합

## 💻 프로젝트 설명
- 회원가입 / 로그인 페이지: JWT 기반 인증 처리
- 여행 일정 생성 페이지: 사용자 입력 기반으로 여행 일정을 등록
- 일정 리스트 및 상세 페이지: 사용자별 여행 일정을 조회하고 수정/삭제 가능
- 관리 기능 (예: 마이페이지): 사용자 정보 확인 및 관리 기능 포함

# 👊 역할 
- 김태연 : 전체 프론트(react)구성, 전체 백엔드(Spring)구성, 배포(AWS 전체)
- 이상욱 : 백엔드 오류 수정(기차,버스 부분 - 여행 출발시간, 도착시간 불러오는 부분), react 화면 구성(여행 계획 시작하기 ~ 기차 일정 불러오는 페이지)
