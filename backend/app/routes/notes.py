from fastapi import APIRouter, HTTPException
import requests
import os
from dotenv import load_dotenv
from pathlib import Path
from fastapi.responses import FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import uuid
import json

# Load .env from backend root
backend_root = Path(__file__).resolve().parents[2]
env_path = backend_root / ".env"
load_dotenv(dotenv_path=env_path)

router = APIRouter(prefix="/practice", tags=["Practice"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@router.post("/generate-notes")
def generate_notes(data: dict):
    try:
        subject = data.get("subject", "").strip()
        topic = data.get("topic", "").strip()
        
        print(f"Received: subject={subject}, topic={topic}")  # Debug
        
        if not subject or not topic:
            return {
                "notes": "❌ Please enter both subject and topic",
                "image_url": None
            }
        
        if not GROQ_API_KEY:
            return {
                "notes": "❌ API key not configured. Please check .env file",
                "image_url": None
            }
        
        # ENHANCED PROMPT for detailed, comprehensive notes
        prompt = f"""Create DETAILED, COMPREHENSIVE educational notes for {topic} in {subject}.

Please provide a thorough explanation with the following structure:

📌 INTRODUCTION & OVERVIEW:
(Write 4-5 sentences explaining what {topic} is and why it's important in {subject})

🎯 CORE CONCEPTS & KEY POINTS:
• Point 1 with detailed explanation (2-3 sentences)
• Point 2 with detailed explanation (2-3 sentences)
• Point 3 with detailed explanation (2-3 sentences)
• Point 4 with detailed explanation (2-3 sentences)
• Point 5 with detailed explanation (2-3 sentences)

💡 PRACTICAL EXAMPLES:
Example 1: (Detailed real-world example with explanation)
Example 2: (Another practical example with step-by-step breakdown)

⚠️ COMMON MISTAKES TO AVOID:
• Mistake 1: (Explain why it's wrong and how to avoid it)
• Mistake 2: (Explain why it's wrong and how to avoid it)
• Mistake 3: (Explain why it's wrong and how to avoid it)

🔧 BEST PRACTICES & TIPS:
• Tip 1 with explanation
• Tip 2 with explanation
• Tip 3 with explanation

📝 PRACTICE QUESTIONS:
1. (Thought-provoking question with answer)
2. (Application-based question with answer)
3. (Problem-solving question with answer)

✅ QUICK REVISION SUMMARY:
(5-6 bullet points summarizing the most important takeaways)

Make the notes educational, detailed, and easy to understand. Aim for 800-1000 words total."""

        # Prepare the request properly
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama-3.1-8b-instant", 
            "messages": [
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 2000  # INCREASED for detailed notes (was 300)
        }
        
        print(f"Sending request to Groq API...")  # Debug
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60  # Increased timeout for longer response
        )
        
        print(f"Groq API Response Status: {response.status_code}")  # Debug
        
        if response.status_code == 200:
            result = response.json()
            api_response = result["choices"][0]["message"]["content"]
            
            # Add header and footer to the response
            notes = f"""═══════════════════════════════════════════════════════════
📚 STUDY NOTES: {topic.upper()} IN {subject.upper()}
═══════════════════════════════════════════════════════════

{api_response}

═══════════════════════════════════════════════════════════
💡 PRO TIP: 
Review these notes regularly and practice daily to master {topic}.

🎯 NEXT STEPS:
• Create flashcards for key concepts
• Solve additional practice problems
• Teach {topic} to someone else
• Connect with study groups for discussion
═══════════════════════════════════════════════════════════"""
            
            return {
                "notes": notes,
                "image_url": None
            }
        else:
            # Return detailed error
            error_msg = f"API Error {response.status_code}: {response.text}"
            print(error_msg)
            return {
                "notes": f"❌ {error_msg}\n\nPlease check your API key and try again.",
                "image_url": None
            }
            
    except requests.exceptions.Timeout:
        return {
            "notes": "❌ Request timed out. Please try again.",
            "image_url": None
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "notes": f"❌ Error: {str(e)}",
            "image_url": None
        }

@router.post("/download-pdf")
def download_pdf(data: dict):
    subject = data.get("subject", "Notes")
    topic = data.get("topic", "Document")
    notes = data.get("notes", "No content available")
    
    file_path = f"temp_{uuid.uuid4()}.pdf"
    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()
    
    content = [Paragraph(f"<b>{subject} - {topic}</b>", styles["Title"]), Spacer(1, 20)]
    
    # Split notes into lines and add to PDF
    for line in notes.split("\n"):
        if line.strip():
            # Handle special characters and formatting
            clean_line = line.replace("•", "•").replace("📌", "📌").replace("🎯", "🎯")
            content.append(Paragraph(clean_line, styles["Normal"]))
            content.append(Spacer(1, 8))
    
    doc.build(content)
    return FileResponse(file_path, filename=f"{subject}_{topic}_Notes.pdf", media_type="application/pdf")