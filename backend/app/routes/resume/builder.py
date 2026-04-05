from fastapi import APIRouter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

router = APIRouter(prefix="/resume", tags=["Resume Builder"])

@router.post("/generate-pdf")
def generate_pdf(data: dict):
    file_path = "resume.pdf"

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()

    content = []

    # 🔥 NAME (BIG)
    content.append(Paragraph(f"<b>{data['name']}</b>", styles["Title"]))
    content.append(Spacer(1, 10))

    # 🔥 CONTACT
    contact = f"{data['email']} | {data['phone']} | {data['linkedin']} | {data['github']}"
    content.append(Paragraph(contact, styles["Normal"]))
    content.append(Spacer(1, 15))

    # 🔥 SUMMARY
    content.append(Paragraph("<b>Summary</b>", styles["Heading2"]))
    content.append(Paragraph(data["summary"], styles["Normal"]))
    content.append(Spacer(1, 12))

    # 🔥 SKILLS
    content.append(Paragraph("<b>Skills</b>", styles["Heading2"]))
    content.append(Paragraph(data["skills"], styles["Normal"]))
    content.append(Spacer(1, 12))

    # 🔥 EDUCATION
    content.append(Paragraph("<b>Education</b>", styles["Heading2"]))
    content.append(Paragraph(data["education"], styles["Normal"]))
    content.append(Spacer(1, 12))

    # 🔥 EXPERIENCE
    content.append(Paragraph("<b>Experience</b>", styles["Heading2"]))
    content.append(Paragraph(data["experience"], styles["Normal"]))
    content.append(Spacer(1, 12))

    # 🔥 PROJECTS
    content.append(Paragraph("<b>Projects</b>", styles["Heading2"]))
    content.append(Paragraph(data["projects"], styles["Normal"]))
    content.append(Spacer(1, 12))

    # 🔥 CERTIFICATIONS
    content.append(Paragraph("<b>Certifications</b>", styles["Heading2"]))
    content.append(Paragraph(data["certifications"], styles["Normal"]))

    doc.build(content)

    return {"message": "Professional Resume Generated"}