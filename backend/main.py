from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os, sys, datetime
from supabase import create_client, Client
from dotenv import load_dotenv

# Load .env from the same directory as this script
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)

# Supabase Setup
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    print(f"Warning: SUPABASE_URL or SUPABASE_KEY missing in {env_path}")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="Cal AI API")

@app.get("/")
async def root():
    return {"message": "Cal AI API is running", "status": "healthy"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        token = authorization.split(" ")[1]
        user_res = supabase.auth.get_user(token)
        if not user_res.user:
            print("Auth error: Invalid user for provided token")
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_res.user
    except IndexError:
        print("Auth error: Malformed authorization header")
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    except Exception as e:
        print(f"Auth error: {str(e)}")
        raise HTTPException(status_code=401, detail="Authentication failed")

@app.get("/")
async def root():
    return {"message": "Cal AI API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    # Basic health check that also verifies Supabase client
    try:
        # Just a dummy call to see if client is alive
        supabase.table('recipes').select('id').limit(1).execute()
        db_status = "connected"
    except Exception as e:
        print(f"Health check DB failure: {e}")
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "environment": "configured"
    }

@app.get('/api/v1/user/profile')
async def get_profile(user = Depends(get_current_user)):
    res = supabase.table('profiles').select('*').eq('user_id', user.id).single().execute()
    return res.data

@app.get('/api/v1/user/goals')
async def get_goals(user = Depends(get_current_user)):
    res = supabase.table('daily_goals').select('*').eq('user_id', user.id).single().execute()
    return res.data

@app.post('/api/v1/user/goals')
async def update_goals(goals: dict, user = Depends(get_current_user)):
    res = supabase.table('daily_goals').upsert({**goals, 'user_id': user.id}, on_conflict='user_id').execute()
    return res.data[0] if res.data else {}

@app.get('/api/v1/meals/today')
async def get_today_meals(user = Depends(get_current_user)):
    today = datetime.date.today().isoformat()
    res = supabase.table('meal_logs').select('*').eq('user_id', user.id).gte('logged_at', today).order('logged_at', desc=True).execute()
    return res.data

@app.post('/api/v1/meals')
async def log_meal(meal: dict, user = Depends(get_current_user)):
    res = supabase.table('meal_logs').insert({**meal, 'user_id': user.id}).execute()
    return res.data[0] if res.data else {}

@app.delete('/api/v1/meals/{meal_id}')
async def delete_meal(meal_id: str, user = Depends(get_current_user)):
    res = supabase.table('meal_logs').delete().eq('id', meal_id).eq('user_id', user.id).execute()
    return {"status": "success"}

@app.post('/api/v1/ai/scan')
async def ai_scan(request: dict, user = Depends(get_current_user)):
    text = request.get('text', "Unknown meal")
    import random
    return {
        "name": text.capitalize(),
        "meal_type": "Other",
        "calories": random.randint(200, 600),
        "protein": random.randint(10, 40),
        "carbs": random.randint(20, 80),
        "fat": random.randint(5, 25)
    }

@app.get('/api/v1/recipes')
async def get_recipes():
    res = supabase.table('recipes').select('*').execute()
    return res.data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
