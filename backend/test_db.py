import os
from sqlalchemy import create_engine, inspect
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    url = os.getenv("DATABASE_URL")
    print(f"Testing connection to: {url.split('@')[-1] if url else 'None'}")
    
    try:
        engine = create_engine(url)
        with engine.connect() as conn:
            print("✅ Database connection successful!")
            
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            print(f"Tables found: {tables}")
            
            # Check for specific tables from models.py
            expected_tables = ['users', 'profiles', 'daily_goals', 'meal_logs', 'weight_history', 'water_logs', 'recipes']
            missing = [t for t in expected_tables if t not in tables]
            
            if missing:
                print(f"⚠️ Missing tables: {missing}")
            else:
                print("✅ All expected tables are present.")
                
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
