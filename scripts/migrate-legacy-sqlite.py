#!/usr/bin/env python3
"""One-time migration from the private legacy SQLite backup into managed MySQL.

Run with DATABASE_URL in the environment and an absolute SQLite backup path.
This script prints counts only; never store a database export or credentials in Git.
Repeated runs skip matching records, and conflicting email/mobile identities abort.
"""
import os
import re
import sqlite3
import sys
import uuid
from datetime import datetime, timezone
from urllib.parse import unquote, urlparse

import pymysql


def millis(value):
    try:
        return int(datetime.fromisoformat(str(value).replace("Z", "+00:00")).timestamp() * 1000)
    except (ValueError, TypeError):
        return int(datetime.now(timezone.utc).timestamp() * 1000)


def mobile(value):
    digits = re.sub(r"\D", "", str(value or ""))
    if len(digits) == 10:
        return "+91" + digits
    if len(digits) == 12 and digits.startswith("91"):
        return "+" + digits
    if not 10 <= len(digits) <= 15:
        raise ValueError("Invalid legacy mobile number; migration stopped")
    return "+" + digits


def main():
    if len(sys.argv) != 2 or not os.path.isabs(sys.argv[1]):
        raise SystemExit("Usage: migrate-legacy-sqlite.py /absolute/private/backup.sqlite3")
    source = sqlite3.connect(f"file:{sys.argv[1]}?mode=ro", uri=True)
    source.row_factory = sqlite3.Row
    u = urlparse(os.environ["DATABASE_URL"])
    dest = pymysql.connect(
        host=u.hostname, port=u.port or 3306, user=unquote(u.username or ""),
        password=unquote(u.password or ""), database=u.path.lstrip("/"),
        charset="utf8mb4", autocommit=False, cursorclass=pymysql.cursors.DictCursor,
    )
    copied = {"admins": 0, "students": 0, "attempts": 0, "tests": 0, "questions": 0}
    try:
        with dest.cursor() as q:
            for row in source.execute("SELECT * FROM admins ORDER BY id"):
                username = row["username"].strip().lower()
                if not username or not row["password_hash"]:
                    raise ValueError("Invalid legacy admin; migration stopped")
                q.execute("SELECT id FROM admin_accounts WHERE username=%s", (username,))
                if q.fetchone():
                    continue
                q.execute("""INSERT INTO admin_accounts (username,password_hash,role,status,created_at,last_login_at)
                  VALUES (%s,%s,%s,%s,%s,%s)""",
                  (username,row["password_hash"],row["role"],row["status"].lower(),millis(row["created_at"]),millis(row["last_login"]) if row["last_login"] else None))
                copied["admins"] += 1
            for row in source.execute("SELECT * FROM students ORDER BY id"):
                email = row["email"].strip().lower()
                number = mobile(row["mobile"])
                if not row["password_hash"]:
                    raise ValueError("Legacy student has no password hash; migration stopped")
                q.execute("SELECT id, student_code, email, mobile FROM students WHERE email=%s OR mobile=%s OR student_code=%s", (email, number, row["student_id"]))
                existing = q.fetchall()
                if existing:
                    if len(existing) != 1 or existing[0]["email"] != email or existing[0]["mobile"] != number or existing[0]["student_code"] != row["student_id"]:
                        raise ValueError("Conflicting email/mobile identity; migration stopped without duplicating an account")
                    continue
                q.execute("""INSERT INTO students
                  (student_code,email,mobile,password_hash,full_name,date_of_birth,gender,education_level,defence_entry,target_exam,attempt_year,previous_ssb_experience,state,city,status,consent_at,created_at,last_login_at)
                  VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                  (row["student_id"],email,number,row["password_hash"],row["full_name"],row["date_of_birth"],row["gender"],row["education_level"],row["defence_entry"],row["target_exam"],row["attempt_year"],row["previous_ssb_experience"],row["state"],row["city"],row["profile_status"],millis(row["registration_date"]),millis(row["registration_date"]),millis(row["last_login"]) if row["last_login"] else None))
                copied["students"] += 1
            for row in source.execute("SELECT * FROM tests ORDER BY id"):
                q.execute("SELECT id FROM managed_tests WHERE slug=%s", (row["slug"],))
                if q.fetchone(): continue
                q.execute("""INSERT INTO managed_tests (id,slug,title,description,duration,difficulty,status,created_at,updated_at)
                  VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                  (row["id"],row["slug"],row["title"],row["description"],row["duration"],row["difficulty"],row["status"],millis(row["created_at"]),millis(row["updated_at"])))
                copied["tests"] += 1
            for row in source.execute("SELECT * FROM questions ORDER BY id"):
                q.execute("SELECT id FROM managed_questions WHERE id=%s", (row["id"],))
                if q.fetchone(): continue
                q.execute("""INSERT INTO managed_questions
                  (id,test_id,prompt,question_type,format_label,options,correct_answer,explanation,category,difficulty,status,created_at)
                  VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                  (row["id"],row["test_id"],row["prompt"],row["question_type"],row["format_label"],row["options"],row["correct_answer"],row["explanation"],row["category"],row["difficulty"],row["status"],millis(row["created_at"])))
                copied["questions"] += 1
            for row in source.execute("SELECT * FROM assessment_attempts ORDER BY id"):
                legacy = source.execute("SELECT student_id FROM students WHERE id=?", (row["student_id"],)).fetchone()
                if not legacy: raise ValueError("Orphaned assessment attempt")
                attempt_id = str(uuid.uuid5(uuid.NAMESPACE_URL, "learnerspark-legacy-attempt-" + str(row["id"])))
                q.execute("SELECT id FROM assessment_attempts WHERE attempt_id=%s", (attempt_id,))
                if q.fetchone(): continue
                q.execute("SELECT id FROM students WHERE student_code=%s", (legacy["student_id"],))
                student = q.fetchone()
                if not student: raise ValueError("Missing student for assessment attempt")
                q.execute("""INSERT INTO assessment_attempts
                  (attempt_id,student_id,test_slug,test_name,score,percentage,status,created_at)
                  VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                  (attempt_id,student["id"],row["test_slug"],row["test_name"],round(row["score"]),round(row["percentage"]),row["status"],millis(row["attempt_date"])))
                copied["attempts"] += 1
        dest.commit()
        print("MIGRATION_OK", copied)
    except Exception:
        dest.rollback()
        raise
    finally:
        source.close()
        dest.close()


if __name__ == "__main__":
    main()
