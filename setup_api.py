# setup_api.py
import os
import subprocess
import sys

def check_installation():
    """Check if required packages are installed"""
    required_packages = [
        "flask",
        "flask_cors", 
        "transformers",
        "torch",
        "peft",
        "accelerate",
        "bitsandbytes"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == "flask_cors":
                __import__("flask_cors")
            else:
                __import__(package)
            print(f"✅ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} is missing")
    
    return missing_packages

def install_packages(missing_packages):
    """Install missing packages"""
    if not missing_packages:
        print("✅ All required packages are already installed!")
        return True
        
    print(f"Installing missing packages: {', '.join(missing_packages)}")
    
    for package in missing_packages:
        try:
            # Map import names to pip names
            pip_name = package
            if package == "flask_cors":
                pip_name = "flask-cors"
            elif package == "bitsandbytes":
                pip_name = "bitsandbytes"
                
            subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])
            print(f"✅ Successfully installed {pip_name}")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {pip_name}: {e}")
            return False
    
    return True

def check_model_files():
    """Check if model files exist"""
    model_path = "./tinyllama-indian-legal-qlora"
    if os.path.exists(model_path):
        print(f"✅ Model files found at: {model_path}")
        return True
    else:
        print(f"❌ Model files not found at: {model_path}")
        print("Please ensure the 'tinyllama-indian-legal-qlora' directory exists with the model files.")
        return False

def main():
    print("🔧 TinyLlama QLoRA Legal AI Setup")
    print("=" * 50)
    
    # Check installations
    print("\n1. Checking package installations...")
    missing_packages = check_installation()
    
    # Install missing packages
    if missing_packages:
        print("\n2. Installing missing packages...")
        success = install_packages(missing_packages)
        if not success:
            print("❌ Failed to install some packages. Please install them manually.")
            return
    
    # Check model files
    print("\n3. Checking model files...")
    model_available = check_model_files()
    
    if not model_available:
        print("\n⚠️  Model files not found. The API will start but won't be able to process requests.")
        print("   Please download the model files and place them in 'tinyllama-indian-legal-qlora' directory.")
    
    # Start the API
    print("\n4. Starting API server...")
    print("   The API will be available at: http://localhost:5000")
    print("   Press Ctrl+C to stop the server")
    
    try:
        # Import and run the Flask app
        from qlora_legal_api import app
        app.run(host='0.0.0.0', port=5000, debug=False)
    except KeyboardInterrupt:
        print("\n🛑 API server stopped")
    except Exception as e:
        print(f"❌ Failed to start API server: {e}")

if __name__ == '__main__':
    main()