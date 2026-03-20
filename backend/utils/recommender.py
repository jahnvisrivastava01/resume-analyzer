from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def recommend_jobs(resume_text):

    job_descriptions = {
        "Full Stack Developer":
            "python react sql html css javascript flask backend frontend api development",

        "Frontend Developer":
            "html css javascript react frontend ui ux web design",

        "Machine Learning Engineer":
            "python machine learning deep learning tensorflow data science ai neural networks",

        "Backend Developer":
            "python django flask sql database api backend development"
    }

    # Combine resume text + all job descriptions
    documents = [resume_text] + list(job_descriptions.values())

    # Convert text → TF-IDF vectors
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Compute cosine similarity
    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    results = []

    for i, (job_title, _) in enumerate(job_descriptions.items()):
        score = round(similarity_scores[i] * 100, 2)
        results.append({
            "title": job_title,
            "match_score": score
        })

    # Sort by highest similarity
    results.sort(key=lambda x: x["match_score"], reverse=True)

    return results