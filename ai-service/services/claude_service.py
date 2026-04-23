"""Claude Service for LLM tasks (summarization, Q&A)"""

import os
from typing import Optional, List
from config import LLM_PROVIDER, ANTHROPIC_API_KEY

class ClaudeService:
    def __init__(self):
        self.provider = LLM_PROVIDER
        self.api_key = ANTHROPIC_API_KEY
        self.model = "claude-sonnet"
    
    async def summarize(
        self,
        transcript: str,
        max_sentences: Optional[int] = None,
        language: str = "id"
    ) -> dict:
        """
        Summarize transcript using Claude API
        
        Args:
            transcript: Full transcript text
            max_sentences: Maximum number of sentences
            language: Language code
        
        Returns:
            dict with summary text, key points, sections
        """
        try:
            from anthropic import AsyncAnthropic
            
            client = AsyncAnthropic(api_key=self.api_key)
            
            prompt = f"""Summarize the following transcript in {language} language.
            
Provide:
1. A concise summary (max {max_sentences or 5} sentences)
2. Key points (3-5 bullet points)
3. Main sections with subtopics

Transcript:
{transcript}

Format your response as:
SUMMARY: [summary here]
KEY POINTS:
- [point 1]
- [point 2]
...
"""
            
            message = await client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            response_text = message.content[0].text
            
            return {
                "summary": response_text,
                "key_points": self._extract_key_points(response_text),
                "sections": None,
            }
        except Exception as e:
            raise Exception(f"Claude summarization error: {str(e)}")
    
    async def generate_qa(
        self,
        transcript: str,
        question_count: int = 5,
        difficulty: str = "medium"
    ) -> dict:
        """Generate Q&A from transcript"""
        try:
            from anthropic import AsyncAnthropic
            
            client = AsyncAnthropic(api_key=self.api_key)
            
            prompt = f"""Generate {question_count} {difficulty} questions about the following transcript.
For each question, provide the correct answer.

Format as:
Q1: [question]
A1: [answer]
...

Transcript:
{transcript}
"""
            
            message = await client.messages.create(
                model=self.model,
                max_tokens=2048,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            response_text = message.content[0].text
            questions = self._parse_qa(response_text)
            
            return {
                "questions": questions,
                "total_generated": len(questions),
            }
        except Exception as e:
            raise Exception(f"Claude Q&A generation error: {str(e)}")
    
    @staticmethod
    def _extract_key_points(text: str) -> List[str]:
        """Extract key points from summary text"""
        points = []
        lines = text.split("\n")
        
        in_key_points = False
        for line in lines:
            if "KEY POINTS:" in line:
                in_key_points = True
                continue
            
            if in_key_points and line.strip().startswith("-"):
                points.append(line.strip()[1:].strip())
            elif in_key_points and line.strip() and not line.strip().startswith("-"):
                break
        
        return points
    
    @staticmethod
    def _parse_qa(text: str) -> List[dict]:
        """Parse Q&A from Claude response"""
        questions = []
        lines = text.split("\n")
        
        current_q = None
        current_a = None
        
        for line in lines:
            line = line.strip()
            if line.startswith("Q"):
                if current_q and current_a:
                    questions.append({
                        "question": current_q,
                        "answer": current_a
                    })
                current_q = line[line.index(":") + 1:].strip()
            elif line.startswith("A"):
                current_a = line[line.index(":") + 1:].strip()
        
        if current_q and current_a:
            questions.append({
                "question": current_q,
                "answer": current_a
            })
        
        return questions

# Singleton instance
claude_service = ClaudeService()
