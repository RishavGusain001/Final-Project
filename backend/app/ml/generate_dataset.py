import pandas as pd

data = []

# FRONTEND
for _ in range(500):
    data.append([0,0,0,0,1,1,7.5,2,"Frontend Developer"])
    data.append([0,0,0,0,1,1,7.0,2,"UI/UX Designer"])

# WEB / FULL STACK
for _ in range(500):
    data.append([1,1,0,1,1,1,8.2,4,"Full Stack Developer"])
    data.append([0,1,0,1,1,1,7.8,3,"Backend Developer"])
    data.append([0,0,0,0,1,1,7.2,2,"Web Developer"])

# MOBILE
for _ in range(400):
    data.append([0,1,0,0,0,1,7.5,3,"Mobile App Developer"])
    data.append([0,1,0,0,0,1,7.2,3,"Android Developer"])
    data.append([0,1,0,0,0,1,7.3,3,"iOS Developer"])

# AI / ML
for _ in range(600):
    data.append([1,0,1,0,0,0,9.0,5,"AI Engineer"])
    data.append([1,0,1,0,0,0,8.5,4,"Machine Learning Engineer"])

# DATA
for _ in range(600):
    data.append([1,0,1,1,0,2,8.5,4,"Data Scientist"])
    data.append([0,0,0,1,0,2,7.2,2,"Data Analyst"])
    data.append([0,0,0,1,0,2,7.0,2,"Database Administrator"])

# CYBER SECURITY
for _ in range(500):
    data.append([0,0,0,0,0,3,7.5,2,"Cyber Security Analyst"])
    data.append([0,0,0,0,0,3,7.8,3,"Ethical Hacker"])

# CLOUD / DEVOPS
for _ in range(500):
    data.append([1,0,0,0,0,0,8.2,3,"Cloud Engineer"])
    data.append([1,0,0,0,0,0,8.0,3,"DevOps Engineer"])

# SOFTWARE / SYSTEM
for _ in range(500):
    data.append([1,1,0,0,0,0,8.0,3,"Software Engineer"])
    data.append([1,1,0,0,0,0,7.8,3,"System Engineer"])

# GAME DEV
for _ in range(300):
    data.append([0,1,0,0,0,1,7.5,3,"Game Developer"])

columns = [
    "python", "java", "ml", "sql", "web_dev",
    "interest", "cgpa", "projects", "career"
]

df = pd.DataFrame(data, columns=columns)

df.to_csv("career_data.csv", index=False)

print("✅ ADVANCED DATASET CREATED (10,000+ rows)")