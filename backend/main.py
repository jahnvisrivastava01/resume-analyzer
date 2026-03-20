from fastapi import FastAPI, File, UploadFile
from utils.recommender import recommend_jobs
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
from models import Resume, Base
import shutil
import os


from utils.resume_parser import extract_text_from_file
from utils.skill_extractor import extract_skills



app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],

)

UPLOAD_FOLDER ="uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message":"Resume Analyzer Backend Running"}

@app.post("/upload-resume/")
def upload_resume(file: UploadFile = File(...)):

    allowed_extensions = [".pdf", ".docx"]
    file_extension = os.path.splitext(file.filename)[1].lower()

    if file_extension not in allowed_extensions:
        return {"error": "Only PDF and DOCX files are supported."}

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_file(file_path)
    print("EXTRACTED TEXT:")
    print(text)
    skills = extract_skills(text)
    recommendations = recommend_jobs(" ".join(skills))

    db = SessionLocal()
    resume = Resume(
        filename=file.filename,
        skills=", ".join(skills)
    )
    db.add(resume)
    db.commit()
    db.close()

    return {
        "filename": file.filename,
        "message": "Resume uploaded successfully",
        "recommended_jobs": recommendations,
        "skills_detected": skills
    }

@app.get("/all-resumes/")
def get_all_resumes():
    db = SessionLocal()
    resumes = db.query(Resume).all()
    db.close()

    result = []

    for r in resumes:
        result.append({
            "id": r.id,
            "filename": r.filename,
            "skills": r.skills
        })

    return result

@app.get("/resume-history/")
def get_resume_history():
    db = SessionLocal()
    resumes = db.query(Resume).all()
    db.close()

    result = []

    for r in resumes:
        recommendations = recommend_jobs(r.skills)

        score = (
            recommendations[0]["match_score"]
            if recommendations
            else 0
        )

        result.append({
            "id": r.id,
            "filename": r.filename,
            "skills": r.skills,
            "top_role": recommendations[0]["title"] if recommendations else "N/A",
            "score": score
        })

    return result


