#!/usr/bin/env python3
"""리모션 영상 교차 검수 — Gemini 2.5 Pro Vision으로 영상 프레임/스크린샷 검수

사용법:
    python3 scripts/cross_review.py <이미지경로> [추가기준텍스트]
    python3 scripts/cross_review.py output/frame_01.png
    python3 scripts/cross_review.py output/frame_01.png output/frame_02.png output/frame_03.png

결과: JSON 형태로 stdout 출력 (Claude Code가 파싱해서 판정)
"""

from __future__ import annotations

import os
import sys
import json
import base64
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
import requests as req

load_dotenv(Path(__file__).parent.parent / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-3.1-pro-preview"  # 항상 최고 모델

# 리모션 영상 검수 기준 (remotion-study/CLAUDE.md 기반)
REVIEW_CRITERIA = """당신은 보험 교육 영상 프레임의 품질 검수 전문가입니다.
아래 기준으로 영상 프레임(스크린샷)을 엄격하게 검수하세요. 문제가 없으면 "없음"이라고만 답하세요.

## 검수 기준

### 1. 텍스트
- 모든 텍스트가 충분히 크고 읽기 쉬운가? (최소 폰트 52px 기준)
- 화면에 텍스트가 너무 많지 않은가? (키워드 중심이어야 함)
- 텍스트가 잘리거나 겹치는 부분이 있는가?
- 상단에 두괄식 헤드라인이 있는가?

### 2. 레이아웃
- 요소들이 중앙축 정렬되어 있는가?
- Safe Zone을 침범하는 요소가 있는가? (세로: 상150 하170 좌우60)
- 빈 공간이 과도하게 남아있는가?
- 요소 간 간격이 적절한가?

### 3. 색상 일관성
- 5색 팔레트(배경/카드/본문/보조/강조)가 지켜지고 있는가?
- 원색이 남발되고 있지 않은가?
- 강조색이 1~2곳에만 쓰이고 있는가?
- 배경에 깊이감(그라데이션)이 있는가?

### 4. 정보 전달
- 핵심 메시지가 즉시 눈에 들어오는가?
- 한 프레임에 메시지가 하나로 집중되어 있는가?
- 숫자가 충분히 크게 강조되고 있는가?
- 3D 아이콘/이모지가 메시지와 관련 있는가?

## 응답 형식 (반드시 JSON)
{
    "issues": [
        {
            "category": "텍스트|레이아웃|색상|전달력",
            "severity": "심각|경고|참고",
            "description": "구체적 문제 설명",
            "frame": "해당 프레임 파일명 (여러 장일 때)"
        }
    ],
    "overall": "통과|수정필요|재생성필요",
    "summary": "한줄 요약"
}

문제가 없으면: {"issues": [], "overall": "통과", "summary": "검수 통과"}
"""


def encode_image(image_path: str) -> dict:
    """이미지를 Gemini API 파트로 변환"""
    with open(image_path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return {"inlineData": {"mimeType": "image/png", "data": data}}


def review_frames(image_paths: List[str], additional_criteria: Optional[str] = None) -> dict:
    """프레임 이미지 검수 (1장 또는 여러 장)"""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
    }

    prompt = REVIEW_CRITERIA
    if additional_criteria:
        prompt += f"\n\n## 추가 검수 기준\n{additional_criteria}"

    if len(image_paths) > 1:
        prompt += """

## 시리즈 추가 검수
여러 프레임입니다. 개별 검수 외에 추가로:
- 전체 프레임에서 색상 팔레트가 동일한가?
- 레이아웃 패턴이 일관적인가?
- 텍스트 스타일(폰트, 크기, 위치)이 통일되어 있는가?
- 시각적 흐름이 자연스러운가?
"""

    # parts 구성: 프레임 이미지들 + 프롬프트
    parts = []
    for i, path in enumerate(image_paths):
        if not os.path.exists(path):
            continue
        parts.append({"text": f"--- 프레임 {i+1}: {os.path.basename(path)} ---"})
        parts.append(encode_image(path))
    parts.append({"text": prompt})

    data = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 4000,
        },
    }

    resp = req.post(url, headers=headers, json=data)
    result = resp.json()

    if "error" in result:
        return {"error": result["error"]["message"], "model": MODEL}

    raw = ""
    for part in result["candidates"][0]["content"]["parts"]:
        if "text" in part:
            raw += part["text"]

    # JSON 파싱
    try:
        clean = raw.strip()
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0].strip()
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0].strip()
        parsed = json.loads(clean)
    except (json.JSONDecodeError, IndexError):
        parsed = {"raw_response": raw, "parse_error": True}

    parsed["images"] = image_paths
    parsed["model"] = MODEL
    return parsed


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("사용법: python3 scripts/cross_review.py <프레임이미지> [프레임2] [프레임3] ...")
        sys.exit(1)

    image_paths = []
    additional = None

    for arg in sys.argv[1:]:
        if os.path.exists(arg):
            image_paths.append(arg)
        else:
            additional = arg

    if not image_paths:
        print(f"[에러] 유효한 이미지 파일이 없습니다: {sys.argv[1:]}")
        sys.exit(1)

    result = review_frames(image_paths, additional)
    print(json.dumps(result, ensure_ascii=False, indent=2))
