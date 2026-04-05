from fastapi import APIRouter
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import uuid

# Load env
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

router = APIRouter(prefix="/practice", tags=["Practice"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CX = os.getenv("GOOGLE_CX")


# 🔥 CLEAN TEXT
def clean_text(text):
    return text.replace("*", "").strip()


# 🔥 GENERATE IMAGE QUERY USING GROQ
def generate_image_query(topic, subject):
    prompt = f"""
    Convert this into a perfect educational image search query.

    Topic: {topic}
    Subject: {subject}

    Add words like diagram, chart, structure.

    Only return query.
    """

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": prompt}]
        }
    )

    result = response.json()

    if "choices" in result:
        return result["choices"][0]["message"]["content"].strip()

    return topic


# 🔥 GET IMAGE FROM GOOGLE
def get_image(topic, subject):
    query = generate_image_query(topic, subject)

    url = "https://www.googleapis.com/customsearch/v1"

    params = {
        "q": query,
        "cx": GOOGLE_CX,
        "key": GOOGLE_API_KEY,
        "searchType": "image",
        "num": 1
    }

    res = requests.get(url, params=params).json()

    if "items" in res:
        return res["items"][0]["link"]

    print("IMAGE ERROR:", res)
    return None


# 🔥 GENERATE NOTES
@router.post("/generate-notes")
def generate_notes(data: dict):
    subject = data.get("subject")
    topic = data.get("topic")

    prompt = f"""
    Create clean structured notes.

    Subject: {subject}
    Topic: {topic}

    Format:
    Definition:
    Key Points:
    Example:
    Summary:

    No stars or markdown.
    """

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": prompt}]
        }
    )

    result = response.json()

    if "choices" not in result:
        print("ERROR:", result)
        return {"notes": "Error generating notes", "image_url": None}

    notes = clean_text(result["choices"][0]["message"]["content"])
    image_url = get_image(topic, subject)

    return {
        "notes": notes,
        "image_url": image_url
    }


# 🔥 DOWNLOAD PDF
@router.post("/download-pdf")
def download_pdf(data: dict):
    subject = data.get("subject")
    topic = data.get("topic")
    notes = data.get("notes")

    file_name = f"{uuid.uuid4()}.pdf"
    file_path = f"temp_{file_name}"

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()

    content = []

    content.append(Paragraph(f"<b>{subject} - {topic}</b>", styles["Title"]))
    content.append(Spacer(1, 20))

    for line in notes.split("\n"):
        content.append(Paragraph(line, styles["Normal"]))
        content.append(Spacer(1, 10))

    doc.build(content)

    return FileResponse(file_path, filename="Notes.pdf", media_type="application/pdf")

print("API KEY:", GOOGLE_API_KEY)
print("CX:", GOOGLE_CX)