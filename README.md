# AnimoConcepto

Lightweight backend for generating Manim scenes via a generative model and storing rendered videos.

## Requirements

- Python 3.12, 3.11, 3.10 (system Python recommended) 
- See `backend/requirements.txt` for Python packages

## Environment

Create a `.env` file in the `backend/` folder (this project ignores root `.env`):

- `MONGO_URL` — MongoDB connection string
- `GEMINI_API_KEY` — Google Gemini API key
- `GEMINI_MODEL` — (optional) model name, e.g. `gemini-2.0-flash`

## Install

From the `backend/` folder:

```bash
python -m pip install -r requirements.txt
```

If you plan to render locally, install Manim's optional system dependencies per the Manim docs.

## Run

Start the FastAPI app:

```bash
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API exposes endpoints for registration, login, conversation and generation. Video media is saved under `backend/media/`.

## Notes

- The service uses Google Generative AI (Gemini). Ensure `GEMINI_API_KEY` is valid.
- The server calls `python -m manim` to render generated scenes; ensure `manim` is installed and available to the same Python interpreter.

**Work To Be Done**

- **Update system architecture:** migrate to Docker containers and deploy on Kubernetes for scalable rendering and API hosting.
- **Frontend:** build a dedicated frontend (SPA) for login, conversation management, prompt editing, and video playback.
- **CI/CD & storage:** add image build pipelines and move media storage to object storage (S3/GCS) or use PersistentVolumes.

**System Architecture (Docker + Kubernetes) — Plan**

- Containerize the `backend/` service with a `Dockerfile` and publish images to a registry.
- Deploy backend as a Kubernetes Deployment with a Service and Ingress; run heavy Manim renders as Kubernetes Jobs or a worker pool.
- Use object storage for media (S3/GCS) and Kubernetes Secrets for credentials. Add monitoring and autoscaling.