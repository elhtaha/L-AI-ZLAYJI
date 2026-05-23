from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Patrimoine Marocain API - Gemini Vision")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Use the gemini-2.5-flash model which is fast and supports multimodal inputs
# We specify response_mime_type="application/json" to force JSON output
model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})

class MediationResponse(BaseModel):
    object_name: str
    description: str
    historical_context: str
    confidence: float

@app.get("/")
def read_root():
    return {"message": "API Gemini Vision Patrimoine Marocain"}

@app.post("/api/recognize", response_model=MediationResponse)
async def recognize_object(file: UploadFile = File(...)):
    
    # Read the image
    image_bytes = await file.read()
    mime_type = file.content_type or "image/jpeg"

    # Prepare prompt for Gemini
    system_prompt = """Vous êtes un expert du patrimoine culturel marocain.
    Analysez l'image fournie et identifiez l'objet.
    IMPORTANT : Répondez TOUJOURS en français.
    
    RÈGLE CRITIQUE : Si l'image n'a absolument rien à voir avec le patrimoine culturel marocain (par ex. une capture d'écran de jeu vidéo, un gadget moderne, des objets sans rapport), vous DEVEZ la rejeter.
    Dans ce cas, retournez ce JSON exact :
    {
      "object_name": "Image non liée",
      "description": "Cette image ne semble pas être liée au patrimoine culturel marocain.",
      "historical_context": "N/A",
      "confidence": 0.0
    }
    
    Si l'image EST liée au patrimoine marocain, retournez un objet JSON correspondant à ce schéma exact :
    {
      "object_name": "string (nom de l'objet en français, par ex. 'Zellige Traditionnel')",
      "description": "string (une courte description de 1-2 phrases en français)",
      "historical_context": "string (bref contexte historique en français)",
      "confidence": float (un nombre entre 0.0 et 1.0 indiquant votre confiance)
    }
    """

    try:
        # Prepare the multimodal payload
        image_part = {
            "mime_type": mime_type,
            "data": image_bytes
        }

        # Generate content
        response = model.generate_content([system_prompt, image_part])
        
        # Parse the JSON response
        content = response.text
        data = json.loads(content)

        return MediationResponse(
            object_name=data.get("object_name", "Unknown Object"),
            description=data.get("description", "No description available."),
            historical_context=data.get("historical_context", "No historical context available."),
            confidence=float(data.get("confidence", 0.0))
        )

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return MediationResponse(
            object_name="Error",
            description="Failed to analyze image.",
            historical_context=str(e),
            confidence=0.0
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
