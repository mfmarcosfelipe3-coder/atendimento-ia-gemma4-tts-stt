from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
import io
import wave
import os

# Define o caminho base para os modelos que será montado via volume Docker
MODELS_DIR = "/models"

app = FastAPI(title="Piper TTS HTTP Wrapper")

# Dicionário de vozes em cache para não carregar toda vez
voices_cache = {}

class SynthesizeRequest(BaseModel):
    text: str
    voice: str = "pt_BR-faber-medium" # Voice by default
    
def load_voice(voice_name):
    # This requires the python piper-tts package installed, which exposes piper.PiperVoice
    # Assuming standard installation provides PiperVoice.
    # Note: If piper-tts package is tricky, an alternative is to wrap the piper CLI.
    # For this project, we'll try to import PiperVoice or fallback to CLI if needed.
    try:
        from piper import PiperVoice
        model_path = os.path.join(MODELS_DIR, f"{voice_name}.onnx")
        config_path = os.path.join(MODELS_DIR, f"{voice_name}.onnx.json")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model {voice_name}.onnx not found in {MODELS_DIR}")
            
        voice = PiperVoice.load(model_path, config_path=config_path)
        return voice
    except ImportError:
        raise Exception("piper-tts python package is not installed correctly.")

@app.post("/synthesize")
async def synthesize(request: SynthesizeRequest):
    try:
        # Load voice if not in cache
        if request.voice not in voices_cache:
            voices_cache[request.voice] = load_voice(request.voice)
            
        voice = voices_cache[request.voice]
        
        # Generate audio
        audio_buffer = io.BytesIO()
        with wave.open(audio_buffer, 'wb') as wav:
            voice.synthesize(request.text, wav)
            
        return Response(content=audio_buffer.getvalue(), media_type="audio/wav")
        
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "models_dir": MODELS_DIR}
