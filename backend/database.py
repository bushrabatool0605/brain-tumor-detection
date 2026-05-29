import sqlite3
import hashlib
import os

# 1. Base directory nikaal lein (backend folder ka absolute path)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. Hamesha database ko backend folder ke andar hi rakhein (Docker ho ya Local laptop)
# Is se permission ka masla Hugging Face par 100% khatam ho jata hai.
DB_NAME = os.path.join(BASE_DIR, "/brain_tumor.db")


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_db():
    # SQLite ab bina kisi error ke is clean absolute path ko open karega
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    conn = sqlite3.connect(DB_NAME)  # database connection
    cursor = conn.cursor()

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            email      TEXT    UNIQUE NOT NULL,
            password   TEXT    NOT NULL,
            role       TEXT    NOT NULL DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Migration: add role column if it doesn't exist (for existing DBs)
    existing_user_cols = [row[1] for row in cursor.execute("PRAGMA table_info(users)")]
    if "role" not in existing_user_cols:
        cursor.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'")
        print("Migrated: added role column to users.")

    # Scan history table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scan_history (
            id                TEXT PRIMARY KEY,
            patient_name      TEXT NOT NULL,
            patient_age       TEXT,
            patient_gender    TEXT,
            result_label      TEXT,
            result_confidence REAL, 
            result_severity   TEXT,
            result_location   TEXT,
            result_notes      TEXT,
            tumor_detected    TEXT,
            image_base64      TEXT,
            gradcam_base64    TEXT,
            saved_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)  # REAL means decimal numbers

    existing_cols = [row[1] for row in cursor.execute("PRAGMA table_info(scan_history)")]
    if "gradcam_base64" not in existing_cols:
        cursor.execute("ALTER TABLE scan_history ADD COLUMN gradcam_base64 TEXT")
        print("Migrated: added gradcam_base64 column.")

    # Default admin user
    cursor.execute("SELECT * FROM users WHERE email = ?", ("admin123@gmail.com",))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            ("admin123@gmail.com", hash_password("admin123"), "admin")
        )
        print("Default admin user created.")

    conn.commit()
    conn.close()


if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")