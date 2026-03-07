import sys
import os

def verify():
    print("--- Environment Verification ---")
    print(f"Python Executable: {sys.executable}")
    print(f"Python Version: {sys.version}")
    
    try:
        import sqlalchemy
        print(f"✅ SQLAlchemy is successfully imported.")
        print(f"   Version: {sqlalchemy.__version__}")
        print(f"   Location: {os.path.dirname(sqlalchemy.__file__)}")
    except ImportError as e:
        print(f"❌ SQLAlchemy import FAILED: {e}")
        print("\nSearch Paths (sys.path):")
        for path in sys.path:
            print(f"  - {path}")
            
    try:
        from database import Base
        print(f"✅ 'database.Base' imported successfully.")
    except Exception as e:
        print(f"❌ Failed to import from 'database.py': {e}")

if __name__ == "__main__":
    verify()
