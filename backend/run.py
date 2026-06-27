import sys
import subprocess
from pathlib import Path

# Re-launch using the venv Python if not already in it
venv_python = Path(__file__).parent / ".venv" / "Scripts" / "python.exe"
if venv_python.exists() and sys.executable != str(venv_python.resolve()):
    subprocess.run([str(venv_python), __file__] + sys.argv[1:])
    sys.exit()

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
