---
date: 2026-04-02
source: cstudy 대화 — Remotion Prompt Showcase + 외부 가이드 분석
---

# 프롬프트 품질 기준 (Claude가 지켜야 할 것)

## 핵심 원칙

차장님은 방향과 판단을 내리고, Claude가 장면 스펙을 구체화한다.
"상세한 프롬프트"는 차장님이 쓰는 게 아니라, Claude가 내부적으로 만들어야 할 기술 스펙이다.

## 장면 스펙의 최소 구체성 기준

장면 하나를 코딩하기 전에, 아래 항목이 모두 정해져 있어야 한다.
모호하면 차장님한테 물어보거나, 선택지를 제시할 것.

```
- 장면 목적: 이 장면이 뭘 전달하는가
- 화면 텍스트: 정확한 문구
- 레이아웃: 요소 배치 (좌우split, 중앙, 상단헤드+하단본문 등)
- 애니메이션: 등장 방식 + spring 설정값
- 타이밍: 몇 초 (TTS 음성 길이 기준)
- 톤: 정돈/가벼움
```

## 쇼케이스 프롬프트에서 배운 구체성 예시

### 데이터 시각화 장면 (Bar+Line Chart 참고)
나쁜 예: "매출 데이터를 막대그래프로 보여줘"
좋은 예: "bars for revenue ($8K, $12K, $15K) that grow upward from baseline,
bars animate sequentially with slight overlap, spring-based timing over 120 frames"

### 키워드 강조 장면 (News Headline 참고)
나쁜 예: "핵심 단어를 강조해"
좋은 예: "rough.js로 '암특정치료비' 위에 형광펜 효과, 좌→우 진행,
형광펜은 텍스트 뒤 레이어"

### 등장 애니메이션 (Shape to Words 참고)
나쁜 예: "자연스럽게 등장"
좋은 예: "spring damping 14로 점프 등장, damping 300으로 와이프 퇴장"

## 프롬프트 스타일 2가지 — 상황별 사용

### B타입: 대화형 (컨셉/방향 결정 단계)
"3가지 버전을 먼저 보여주고, 하나 골라서 다듬자"
- 컨셉 제안, 스토리보드 초안에서 사용
- 차장님이 선택할 수 있게 선택지를 제공

### A타입: 상세 지시 (제�� 단계)
해상도, 색상코드, 수치, 애니메이션 방식, 프레임 수를 전부 명시
- Plan Mode에서 확정된 스펙을 기반으로 코딩할 때 사용
- 모호함 제로가 목표

## 참고 소스

### Remotion 공식
- Prompt Showcase: https://www.remotion.dev/prompts/ — 커뮤니티 프롬프트+결과물 갤러리
- Agent Skills 문서: https://www.remotion.dev/docs/ai/skills
- Claude Code 가이드: https://www.remotion.dev/docs/ai/claude-code

### 외부 가이드
- Creating Product Videos (Medium): 13개 장면 상세 체크리스트. "모호한 프롬프트 = 모호한 결과"
  https://favourkelvin17.medium.com/creating-product-videos-with-remotion-and-claude-code-ea48ed0cb5d3
- Generate Videos (Substack): 4단계 (계획→스토리보드→기술문서→구현), .md 파일로 스펙 전달
  https://zerofuturetech.substack.com/p/generate-videos-with-claude-code
- From Prompt to Video (Medium): 2단계 프롬프팅 (구조→디자인), 음악은 마지막에
  https://medium.com/@joyzoursky/from-prompt-to-video-why-remotion-skills-suddenly-matter-1927307dcf1f
- 5 Claude Code + Video Prompts (sabrina.dev): 5가지 프롬프트 템플릿 (교육/제품/리뷰/오버레이/데이터)
  https://www.sabrina.dev/p/5-insane-claude-code-video-prompts
- Claude + Remotion 튜토리얼 (sabrina.dev): 재사용 템플릿이 핵심, 브랜드 스타일 한번 잡으면 이후 빨라짐
  https://www.sabrina.dev/p/claude-just-changed-content-creation-remotion-video
