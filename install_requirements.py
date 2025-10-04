# install_requirements.py
import subprocess
import sys

def install_packages():
    packages = [
        "flask==2.3.3",
        "flask-cors==4.0.0", 
        "transformers==4.35.0",
        "torch==2.1.0",
        "peft==0.7.1",
        "accelerate==0.24.1",
        "bitsandbytes==0.41.3"
    ]
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ {package} installed successfully")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {package}: {e}")

if __name__ == "__main__":
    print("Installing required packages for TinyLlama QLoRA API...")
    install_packages()
    print("✅ All packages installed!")