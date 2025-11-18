from flask import Flask, request, jsonify
from chatbot import askGeminai


app = Flask(__name__)

@app.route("/health")
def healthStatus():
    return {
        "status": "the server is running fine"
    }

@app.route("/api/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    
    if not data:
        return jsonify(
            {
                "error": "JSON body is required"
            }
        ), 400
    
    if "prompt" not in data:
        return jsonify(
            {
                "error": "promt is required"
            }
        ), 400

    prompt = data["prompt"]
    if not isinstance(prompt, str) or prompt.strip() == "":
        return jsonify({
            "error": "promt input invalid"
        }), 400
    

    return jsonify({
        "response": askGeminai(prompt)
    }), 200
    



if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
