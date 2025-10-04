# qlora_legal_api.py
import sys
import os

# Add error handling for imports
try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    print("✅ Flask and CORS imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Flask: {e}")
    print("Please install Flask: pip install flask flask-cors")
    sys.exit(1)

try:
    from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
    from peft import PeftModel
    import torch
    print("✅ Transformers and PyTorch imported successfully")
except ImportError as e:
    print(f"❌ Failed to import AI libraries: {e}")
    print("Please install: pip install transformers torch peft accelerate bitsandbytes")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

class QLoRALegalAI:
    def __init__(self, base_model_name, adapter_path):
        try:
            # Configure quantization
            bnb_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.float16
            )
            
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(base_model_name)
            self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load base model
            print("Loading base model...")
            base_model = AutoModelForCausalLM.from_pretrained(
                base_model_name,
                quantization_config=bnb_config,
                device_map="auto",
                trust_remote_code=True,
            )
            
            # Load LoRA adapters
            print("Loading LoRA adapters...")
            self.model = PeftModel.from_pretrained(base_model, adapter_path)
            
            print("✅ TinyLlama QLoRA Legal AI initialized successfully")
            
        except Exception as e:
            print(f"❌ Failed to initialize TinyLlama QLoRA: {e}")
            self.model = None
            self.tokenizer = None
        
    def generate_answer(self, question):
        if self.model is None or self.tokenizer is None:
            return "AI model not available. Please check if the model files are properly loaded."
        
        try:
            prompt = f"Question: {question}\nAnswer:"
            
            inputs = self.tokenizer(prompt, return_tensors="pt")
            # Move inputs to the same device as model
            inputs = {k: v.to(self.model.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_length=400,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                    repetition_penalty=1.1,
                    top_p=0.9
                )
            
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            answer = response.replace(prompt, "").strip()
            return answer
            
        except Exception as e:
            print(f"Error generating answer: {e}")
            return f"Error processing request: {str(e)}"

# Initialize QLoRA legal AI with error handling
print("Initializing TinyLlama QLoRA Legal AI...")
try:
    legal_ai = QLoRALegalAI(
        base_model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        adapter_path="./tinyllama-indian-legal-qlora"
    )
except Exception as e:
    print(f"Failed to initialize AI: {e}")
    legal_ai = None

@app.route('/api/health', methods=['GET'])
def health_check():
    status = "healthy" if legal_ai is not None and legal_ai.model is not None else "model_not_loaded"
    message = "QLoRA Legal AI API is running" if status == "healthy" else "AI model not loaded"
    return jsonify({"status": status, "message": message})

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        if legal_ai is None or legal_ai.model is None:
            return jsonify({
                "error": "TinyLlama model not loaded", 
                "message": "Please ensure the model files are available and try again"
            }), 503
            
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        question = data.get('question', '').strip()
        
        if not question:
            return jsonify({"error": "No question provided"}), 400
        
        answer = legal_ai.generate_answer(question)
        
        return jsonify({
            "question": question,
            "answer": answer,
            "status": "success"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/sample-questions', methods=['GET'])
def sample_questions():
    questions = [
        "What is Section 420 of IPC?",
        "Explain fundamental rights in Indian Constitution",
        "What are essential elements of a valid contract?",
        "How does consumer protection work in India?",
        "What is Corporate Social Responsibility?",
        "What are grounds for divorce under Hindu Marriage Act?",
        "Explain the Transfer of Property Act",
        "What is the Limitation Act 1963?",
        "How does Insolvency and Bankruptcy Code work?",
        "What are the punishments for murder under IPC?"
    ]
    return jsonify({"questions": questions})

@app.route('/api/info', methods=['GET'])
def api_info():
    return jsonify({
        "name": "TinyLlama QLoRA Legal AI API",
        "version": "1.0.0",
        "status": "running" if legal_ai and legal_ai.model else "model_not_loaded",
        "endpoints": {
            "health": "/api/health",
            "chat": "/api/chat",
            "sample_questions": "/api/sample-questions",
            "info": "/api/info"
        }
    })

if __name__ == '__main__':
    print("🚀 Starting TinyLlama QLoRA Legal AI API...")
    print("📝 Available endpoints:")
    print("   - GET  /api/health")
    print("   - POST /api/chat")
    print("   - GET  /api/sample-questions")
    print("   - GET  /api/info")
    print("🔗 API will be available at: http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=False)