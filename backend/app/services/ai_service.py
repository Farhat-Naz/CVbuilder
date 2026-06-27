from typing import Optional, List, Dict, Any
from app.core.config import settings
import json


async def _call_ai(prompt: str) -> str:
    """Call AI provider - tries Anthropic first, falls back to OpenAI."""
    if settings.ANTHROPIC_API_KEY:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        message = await client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        return message.content[0].text
    elif settings.OPENAI_API_KEY:
        import openai
        client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024,
        )
        return response.choices[0].message.content
    else:
        return "AI service not configured. Please add ANTHROPIC_API_KEY or OPENAI_API_KEY."


async def generate_summary(job_title: str, experience_years: int, skills: List[str], industry: Optional[str]) -> str:
    skills_str = ", ".join(skills[:10])
    prompt = f"""Write a professional resume summary for a {job_title} with {experience_years} years of experience.
Skills: {skills_str}
{f'Industry: {industry}' if industry else ''}
Write 3-4 compelling sentences. Be specific, quantifiable where possible, and ATS-friendly. No bullet points."""
    return await _call_ai(prompt)


async def rewrite_resume(content: str, tone: str) -> str:
    prompt = f"""Rewrite the following resume content in a {tone} tone.
Make it more impactful, use strong action verbs, and ensure ATS compatibility.
Keep it concise and professional.

Content:
{content}

Rewritten version:"""
    return await _call_ai(prompt)


async def check_ats_score(resume_text: str, job_description: Optional[str]) -> Dict[str, Any]:
    jd_part = f"\nJob Description:\n{job_description}" if job_description else ""
    prompt = f"""Analyze this resume for ATS compatibility and return a JSON response.

Resume:
{resume_text[:2000]}{jd_part[:1000]}

Return JSON with:
{{
  "score": <0-100>,
  "grade": "<A/B/C/D/F>",
  "issues": ["list of issues"],
  "suggestions": ["list of improvements"],
  "keyword_matches": ["matched keywords"],
  "missing_keywords": ["missing important keywords"]
}}"""
    result = await _call_ai(prompt)
    try:
        start = result.find("{")
        end = result.rfind("}") + 1
        return json.loads(result[start:end])
    except Exception:
        return {"score": 75, "grade": "B", "issues": [], "suggestions": [], "keyword_matches": [], "missing_keywords": []}


async def fix_grammar(text: str) -> str:
    prompt = f"""Fix grammar, spelling, and punctuation in this resume text.
Keep the content and meaning exactly the same. Only fix errors.

Text:
{text}

Fixed text:"""
    return await _call_ai(prompt)


async def optimize_keywords(resume_text: str, job_description: str) -> Dict[str, Any]:
    prompt = f"""Compare this resume to the job description and identify keyword optimization opportunities.

Resume (excerpt):
{resume_text[:1500]}

Job Description:
{job_description[:1500]}

Return JSON:
{{
  "missing_keywords": ["important keywords from JD not in resume"],
  "present_keywords": ["keywords from JD already in resume"],
  "suggestions": ["specific suggestions to optimize"]
}}"""
    result = await _call_ai(prompt)
    try:
        start = result.find("{")
        end = result.rfind("}") + 1
        return json.loads(result[start:end])
    except Exception:
        return {"missing_keywords": [], "present_keywords": [], "suggestions": []}


async def generate_bullets(job_title: str, company: str, responsibilities: str) -> List[str]:
    prompt = f"""Generate 4-6 impactful resume bullet points for a {job_title} at {company}.
Based on these responsibilities: {responsibilities}
Use strong action verbs, quantify achievements where possible, be concise and ATS-friendly.
Return as a JSON array of strings."""
    result = await _call_ai(prompt)
    try:
        start = result.find("[")
        end = result.rfind("]") + 1
        return json.loads(result[start:end])
    except Exception:
        return [f"Led key initiatives as {job_title} at {company}"]


async def suggest_skills(job_title: str, current_skills: List[str]) -> List[str]:
    current = ", ".join(current_skills[:15])
    prompt = f"""Suggest 10 in-demand skills for a {job_title} position.
Current skills: {current}
Only suggest skills NOT already in the current list.
Return as a JSON array of skill strings."""
    result = await _call_ai(prompt)
    try:
        start = result.find("[")
        end = result.rfind("]") + 1
        return json.loads(result[start:end])
    except Exception:
        return []


async def generate_cover_letter_ai(data) -> str:
    prompt = f"""Write a professional cover letter for the following:

Company: {data.company_name}
Job Title: {data.job_title}
Hiring Manager: {data.hiring_manager or 'Hiring Manager'}
Tone: {data.tone}
Experience Level: {data.experience_level}
Job Description: {data.job_description[:1000] if data.job_description else 'Not provided'}
{f'Candidate Background: {data.user_background}' if data.user_background else ''}

Write a compelling, personalized cover letter with:
- Professional greeting
- Strong opening paragraph
- 2-3 body paragraphs highlighting relevant experience
- Closing paragraph with call to action
- Professional sign-off

Keep it under 400 words."""
    return await _call_ai(prompt)
