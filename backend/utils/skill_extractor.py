import spacy 

nlp = spacy.load("en_core_web_sm")

SKILLS = [
    "python",
    "java",
    "c++",
    "react",
    "node",
    "sql",
    "postgresql",
    "machine learning",
    "data science",
    "fastapi",
    "django",
    "flask",
    "javascript",
    "html",
    "css",
    "git",
    "github"
]

def extract_skills(text):

    doc = nlp(text.lower())

    found_skills = set()

    for token in doc:
        if token.text in SKILLS:
            found_skills.add(token.text)

    # also check full phrases
    for skill in SKILLS:
        if skill in text.lower():
            found_skills.add(skill)

    return list(found_skills)