import sys
import fitz  # PyMuPDF
import requests

# --------- STEP 1: Extract Text from Resume PDF ---------
def extract_resume_text(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


# --------- STEP 2: Detect Job Role Based on Keywords ---------
def extract_job_role(text):
    text_lower = text.lower()

    roles_keywords = {
        "Data Scientist": ["data analysis", "machine learning", "pandas", "regression", "data science"],
        "Machine Learning Engineer": ["scikit-learn", "model training", "deep learning", "tensorflow", "pytorch"],
        "Backend Developer": ["node.js", "express", "api", "database", "mongodb", "backend"],
        "Frontend Developer": ["react", "javascript", "html", "css", "frontend", "ui"],
        "AI/ML Intern": ["aws", "sagemaker", "rekognition", "lex", "comprehend", "ai/ml internship"],
        "Data Analyst": ["data visualization", "powerbi", "seaborn", "excel", "insight", "dashboard"]
    }

    for role, keywords in roles_keywords.items():
        for keyword in keywords:
            if keyword in text_lower:
                return role

    return "Unknown"


# --------- STEP 3: Fetch Top Live Jobs from Google Jobs API (GET) ---------
def fetch_live_jobs(role):
    url = "https://google-jobs-api.p.rapidapi.com/google-jobs"
    querystring = {
        "sites": "Indeed",
        "include": role,
        "location": "India",
        "language": "English"
    }

    headers = {
        "x-rapidapi-key": "API_KEY",  # 🔁 Use your valid API key here
        "x-rapidapi-host": "google-jobs-api.p.rapidapi.com"
    }

    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()
        jobs = data.get("jobs", [])[:3]
        return jobs
    except Exception as e:
        print(f"❌ Error fetching jobs: {e}")
        return []


# --------- STEP 4: Display Jobs Neatly ---------
def print_jobs(jobs):
    if not jobs:
        print("🚫 No jobs found.")
        return

    print("\n📋 Top Jobs:")
    for i, job in enumerate(jobs, 1):
        print(f"\n🔹 Job {i}")
        print(f"Title    : {job.get('title', 'N/A')}")
        print(f"Company  : {job.get('company', 'N/A')}")
        print(f"Location : {job.get('location', 'India')}")
        print(f"Apply    : {job.get('link', 'N/A')}")


# --------- MAIN FUNCTION ---------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("📌 Usage: python resume_parser.py <path_to_resume.pdf>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    resume_text = extract_resume_text(pdf_path)
    job_role = extract_job_role(resume_text)

    print(f"\n🎯 Detected Job Role: {job_role}")

    if job_role != "Unknown":
        print("\n🔍 Fetching top 3 live jobs in India...")
        top_jobs = fetch_live_jobs(job_role)
        print_jobs(top_jobs)
    else:
        print("❗ Could not detect job role. Try updating the keyword list or resume format.")
