#!/usr/bin/env python3
"""End-to-end managed-account smoke test; all generated rows are removed on exit."""
import hashlib
import os
import sys
import time
import uuid
from urllib.parse import unquote, urlparse
import pymysql
import requests
from werkzeug.security import generate_password_hash

BASE = os.environ.get("SMOKE_BASE", "http://localhost:3000").rstrip("/")
TAG = uuid.uuid4().hex[:10]
EMAIL = f"qa.{TAG}@example.invalid"
MOBILE = "+91" + str(9000000000 + int(TAG[:7], 16) % 999999999)
PASSWORD = "QualityCheck-" + TAG
ADMIN_NAME = "qa_admin_" + TAG
SLUG = "qa-test-" + TAG


def api(session, action, payload=None):
    url = f"{BASE}/api/trpc/{action}"
    response = session.post(url, json={"json": payload}, timeout=25) if payload is not None else session.get(url, timeout=25)
    data = response.json()
    return response.status_code, data.get("result", {}).get("data", {}).get("json"), data.get("error", {}).get("json", {}).get("message", "")


def mysql():
    u = urlparse(os.environ["DATABASE_URL"])
    return pymysql.connect(host=u.hostname, port=u.port or 3306, user=unquote(u.username or ""), password=unquote(u.password or ""), database=u.path.lstrip("/"), autocommit=False)


def cleanup():
    conn = mysql()
    try:
        with conn.cursor() as q:
            q.execute("DELETE FROM students WHERE email=%s", (EMAIL,))
            q.execute("DELETE FROM admin_accounts WHERE username=%s", (ADMIN_NAME,))
            q.execute("SELECT id FROM managed_tests WHERE slug=%s", (SLUG,))
            row = q.fetchone()
            if row:
                q.execute("DELETE FROM managed_questions WHERE test_id=%s", (row[0],))
                q.execute("DELETE FROM managed_tests WHERE id=%s", (row[0],))
            for kind, identifier in (("student", EMAIL), ("student", MOBILE), ("admin", ADMIN_NAME)):
                key = hashlib.sha256(f"{kind}:{identifier.lower().strip()}".encode()).hexdigest()
                q.execute("DELETE FROM auth_rate_limits WHERE key_hash=%s", (key,))
            for table in ("students", "assessment_attempts", "admin_accounts", "managed_tests", "managed_questions"):
                q.execute(f"SELECT count(*) FROM {table}")
                print("remaining", table, q.fetchone()[0])
        conn.commit()
    finally:
        conn.close()


def main():
    anonymous = requests.Session()
    admin = requests.Session()
    student = requests.Session()
    conn = mysql()
    try:
        with conn.cursor() as q:
            q.execute("INSERT INTO admin_accounts (username,password_hash,role,status,created_at) VALUES (%s,%s,'admin','active',%s)", (ADMIN_NAME, generate_password_hash(PASSWORD, method="scrypt"), int(time.time()*1000)))
        conn.commit()
        code, _, _ = api(anonymous, "admin.dashboard")
        assert code == 403, f"anonymous admin access: {code}"
        body = dict(full_name="QA Test Aspirant", email=EMAIL, mobile=MOBILE, password=PASSWORD, date_of_birth="2000-01-01", gender="Other", education_level="Graduate", defence_entry="CDS", target_exam="CDS", attempt_year="2027", previous_ssb_experience="No", state="Test State", city="Test City", consent=True)
        code, profile, error = api(student, "student.register", body)
        assert code == 200, (code, error)
        assert profile["total_tests_attempted"] == 0
        assert api(student, "student.me")[1]["student_id"] == profile["student_id"]
        clone = dict(body, mobile="+919888888888")
        assert api(anonymous, "student.register", clone)[0] == 409, "duplicate email accepted"
        clone = dict(body, email="other." + EMAIL)
        assert api(anonymous, "student.register", clone)[0] == 409, "duplicate mobile accepted"
        assert api(anonymous, "student.login", {"identifier": EMAIL, "password": "not-the-password"})[0] == 401
        assert api(anonymous, "student.login", {"identifier": EMAIL, "password": PASSWORD})[0] == 200
        assert api(anonymous, "student.me")[1]["student_id"] == profile["student_id"]
        assert api(requests.Session(), "student.login", {"identifier": MOBILE[3:], "password": PASSWORD})[0] == 200
        attempt = {"attemptId": str(uuid.uuid4()), "testSlug": "csss", "testName": "CSSS Cognitive Battery", "score": 42, "percentage": 60}
        assert api(student, "student.saveAttempt", attempt)[1]["duplicate"] is False
        assert api(student, "student.saveAttempt", attempt)[1]["duplicate"] is True
        assert api(student, "student.me")[1]["total_tests_attempted"] == 1
        assert api(admin, "admin.login", {"username": ADMIN_NAME, "password": "wrong"})[0] == 401
        assert api(admin, "admin.login", {"username": ADMIN_NAME, "password": PASSWORD})[0] == 200
        assert api(admin, "admin.status")[1]["isAdmin"] is True
        metrics = api(admin, "admin.dashboard")[1]
        assert metrics["students"] >= 2 and metrics["attempts"] >= 1, metrics
        assert api(admin, "admin.students?input=%7B%22json%22%3A%7B%22search%22%3A%22%22%7D%7D")[0] == 200
        test = {"slug": SLUG, "title": "QA admin test", "description": "Smoke test, cleaned afterward", "duration": 90, "difficulty": "Mixed", "status": "draft"}
        code, saved, error = api(admin, "admin.saveTest", test); assert code == 200, (code,error)
        test_id = saved["id"]
        test["id"] = test_id; test["title"] = "QA updated test"
        assert api(admin, "admin.saveTest", test)[0] == 200
        q = {"testId": test_id, "prompt": "QA sample question?", "questionType": "multiple-choice", "formatLabel": "Standard", "options": "[]", "correctAnswer": "A", "explanation": "QA only", "category": "Reasoning", "difficulty": "Mixed", "status": "draft"}
        assert api(admin, "admin.saveQuestion", q)[0] == 200
        assert api(admin, "admin.logout", {})[0] == 200
        assert api(admin, "admin.dashboard")[0] == 403
        assert api(student, "student.logout", {})[0] == 200
        assert api(student, "student.me")[1] is None
        print("AUTH_SMOKE_PASS: student register/login(email+mobile)/one session/unique identity/attempt idempotency/admin login+CRUD/logout/403")
    finally:
        conn.close()
        cleanup()


if __name__ == "__main__":
    main()
