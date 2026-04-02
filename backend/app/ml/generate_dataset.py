import pandas as pd
import random

data = []

def add_rows(career, base_skills, interest, cgpa_range, proj_range, n_rows):
    for _ in range(n_rows):
        row = [
            random.choice(base_skills.get("python",[0])),
            random.choice(base_skills.get("java",[0])),
            random.choice(base_skills.get("ml",[0])),
            random.choice(base_skills.get("sql",[0])),
            random.choice(base_skills.get("web_dev",[0])),
            interest,
            round(random.uniform(*cgpa_range), 1),
            random.randint(*proj_range),
            career
        ]
        data.append(row)

# FRONTEND
add_rows("Frontend Developer", {"web_dev":[1], "python":[0]}, 1, (6.5,9.0), (1,5), 400)
add_rows("UI/UX Designer", {"web_dev":[1]}, 1, (6.0,8.5), (1,4), 300)

# FULL STACK / BACKEND
add_rows("Full Stack Developer", {"python":[1], "java":[1], "sql":[1], "web_dev":[1]}, 1, (7.0,9.5), (2,6), 400)
add_rows("Backend Developer", {"python":[1], "sql":[1]}, 1, (6.5,9.0), (2,5), 300)

# MOBILE
add_rows("Mobile App Developer", {"java":[1]}, 1, (6.5,9.0), (2,5), 300)
add_rows("Android Developer", {"java":[1]}, 1, (6.0,8.5), (1,4), 200)
add_rows("iOS Developer", {"python":[1]}, 1, (6.0,8.5), (1,4), 200)

# AI / ML
add_rows("AI Engineer", {"python":[1], "ml":[1]}, 1, (7.5,9.5), (3,6), 400)
add_rows("Machine Learning Engineer", {"python":[1], "ml":[1]}, 1, (7.0,9.0), (2,5), 300)

# DATA
add_rows("Data Scientist", {"python":[1], "ml":[1], "sql":[1]}, 1, (7.5,9.5), (3,6), 400)
add_rows("Data Analyst", {"sql":[1]}, 1, (6.0,8.0), (1,4), 300)
add_rows("Database Administrator", {"sql":[1]}, 1, (6.0,8.0), (1,3), 200)

# CYBER SECURITY
add_rows("Cyber Security Analyst", {"python":[0], "java":[0]}, 1, (6.5,9.0), (2,5), 300)
add_rows("Ethical Hacker", {"python":[1]}, 1, (7.0,9.0), (2,5), 200)

# CLOUD / DEVOPS
add_rows("Cloud Engineer", {"python":[1]}, 1, (7.0,9.0), (2,5), 300)
add_rows("DevOps Engineer", {"python":[1]}, 1, (7.0,9.0), (2,5), 300)

# SOFTWARE / SYSTEM
add_rows("Software Engineer", {"python":[1], "java":[1]}, 1, (6.5,9.0), (2,5), 400)
add_rows("System Engineer", {"java":[1]}, 1, (6.0,8.5), (1,4), 300)

# GAME DEV
add_rows("Game Developer", {"java":[1]}, 1, (6.5,9.0), (2,5), 300)

columns = ["python","java","ml","sql","web_dev","interest","cgpa","projects","career"]
df = pd.DataFrame(data, columns=columns)

df.to_csv("career_data.csv", index=False)
print(f"✅ Dataset created with {len(df)} rows and realistic variation")
