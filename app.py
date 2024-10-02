from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, storage
from io import BytesIO
import os
import zipfile
from werkzeug.utils import secure_filename
import cv2
import logging
import os
import time
import json
import re
import logging
import requests
from flask import Flask, request, jsonify
from collections import defaultdict
import google.generativeai as genai

# Import generative AI library
import google.generativeai as genai
import requests

# Set up logging for better debugging and progress tracking
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set up the API Key and configure generative AI
api_key = ""  # Replace with your actual API Key
genai.configure(api_key=api_key)

app = Flask(__name__)

# Load Firebase credentials and initialize Firebase Admin SDK
cred = credentials.Certificate("labelens.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'label-lens-63cb7.appspot.com'
})

# Initialize Firestore
db = firestore.client()

# Enable CORS
CORS(app)

# Define the directory where the images will be stored
UPLOAD_FOLDER = 'uploaded_images'  # Directory to save extracted images
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    try:
        user_data = {
            'name': data['name'],
            'age': data['age'],
            'email': data['email'],
            'phone': data['phone'],
            'weight': data['weight'],
            'height': data['height'],
        }

        db.collection("users").document().set(user_data)
        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    phone = data['phone']


    if not email or not phone:
        return jsonify({'status': 'error', 'message': 'Email and phone number are required'}), 400

    try:
        users_ref = db.collection('users')
        query = users_ref.where('email', '==', email).where('phone', '==', phone).stream()

        user = None
        for doc in query:
            user = doc.to_dict()

        if user:
            return jsonify({'status': 'success', 'user': user}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invalid email or phone number'}), 401

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/get-recent-images', methods=['GET'])
def get_recent_images():
    try:
        # Initialize Firebase Storage bucket
        bucket = storage.bucket()

        # List all the blobs (files) in the 'images' folder
        blobs = list(bucket.list_blobs(prefix="images/"))

        if not blobs:
            return jsonify({"error": "No images found"}), 404

        # Sort blobs by the time they were uploaded (newest first)
        blobs.sort(key=lambda blob: blob.time_created, reverse=True)

        # Get the most recent blob's timestamp
        recent_timestamp = blobs[0].time_created

        # Filter all blobs that have the same timestamp as the most recent one
        recent_blobs = [blob for blob in blobs if blob.time_created == recent_timestamp]

        # If there are no recent blobs, return a message
        if not recent_blobs:
            return jsonify({"error": "No recent images found"}), 404

        # Create a zip file in memory
        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zip_file:
            for blob in recent_blobs:
                # Download the image data into memory
                image_data = blob.download_as_bytes()
                # Add each image to the zip file with its original name
                zip_file.writestr(blob.name, image_data)

        # Ensure the pointer is at the start of the buffer
        zip_buffer.seek(0)

        # Unzip the images and store them individually
        unzip_and_store_images(zip_buffer)

        return jsonify({"message": "Recent images and images with the same timestamp successfully unzipped and stored"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def unzip_and_store_images(zip_buffer):
    try:
        # Open the zip file from the buffer
        with zipfile.ZipFile(zip_buffer, 'r') as zip_file:
            # Iterate through the files in the zip archive
            for file_info in zip_file.infolist():
                # Ensure the filename is secure to avoid any security vulnerabilities
                filename = secure_filename(file_info.filename)

                # Define the file path to store the image
                file_path = os.path.join(UPLOAD_FOLDER, filename)

                # Extract the file and save it to the specified path
                with open(file_path, 'wb') as f:
                    f.write(zip_file.read(file_info.filename))

    except Exception as e:
        print(f"Error while unzipping and storing images: {e}")

def is_image_blurry(image_file):
    image = cv2.imread(image_file)
    if image is None:
        logging.warning(f"Cannot read image {image_file}.")
        return True

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use Laplacian to detect blur
    variance_of_laplacian = cv2.Laplacian(gray, cv2.CV_64F).var()
    threshold = 0  # Define a threshold for blurriness; adjust if needed
    if variance_of_laplacian < threshold:
        return True
    return False

# Improved image validation and preprocessing
def validate_and_preprocess_images():
    valid_images = []
    # List all image files in the uploaded_images folder
    for image_file in os.listdir(UPLOAD_FOLDER):
        full_path = os.path.join(UPLOAD_FOLDER, image_file)
        if os.path.exists(full_path) and image_file.lower().endswith(('.png', '.jpg', '.jpeg')):
            if is_image_blurry(full_path):
                logging.warning(f"Image {full_path} is blurry. Please provide a clear image.")
            else:
                valid_images.append(full_path)
        else:
            logging.warning(f"File {full_path} is not a valid image or does not exist.")
    return valid_images

@app.route('/process-images', methods=['GET'])
def process_images():
    try:
        image_files = validate_and_preprocess_images()
        
        if not image_files:
            return jsonify({"error": "No valid images to process."}), 404
        
        # Here you can add code to utilize the valid_images list as needed
        # For example, sending them to the generative AI API or further processing
        logging.info(f"Valid images for processing: {image_files}")

        # Add your generative AI processing logic here
        # Example: response = genai.some_processing_function(image_files)

        return jsonify({"message": "Images processed successfully", "images": image_files}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def fetch_nutritional_info_from_images(image_files):
    if not image_files:
        logging.error("No valid images found for processing.")
        return None

    model = genai.GenerativeModel(model_name="gemini-1.5-pro")
    
    # List to store uploaded file data
    uploaded_images = []
    
    # Upload images with error handling
    for image_file in image_files:
        try:
            uploaded_image = genai.upload_file(path=image_file, display_name=os.path.basename(image_file))
            uploaded_images.append(uploaded_image)
            time.sleep(2)  # Delay for rate limiting
        except Exception as e:
            logging.error(f"Error uploading {image_file}: {e}")
    
    if not uploaded_images:
        logging.error("No images were successfully uploaded.")
        return None
    
    # Prompt for Gemini API to fetch nutritional data
    prompt = """
    Fetch nutritional information from the product images. Provide Product Name, Brand Name, Quantity, Weightage (g/ml), Nutritional Info per serving, Ingredients, Category, and any Proprietary Claims on the label.
    """
    
    try:
        # Fetch the response with error handling
        response = model.generate_content([prompt] + uploaded_images)
        return response.text
    except Exception as e:
        logging.error(f"Error fetching response from API: {e}")
        return None

# Function to parse fetched nutritional and product info with improved regex
def parse_nutritional_info(text_data):
    patterns = {
        "product_name": r"Product Name[:\s]+([^\n]+)",
        "brand_name": r"Brand Name[:\s]+([^\n]+)",
        "quantity": r"Quantity[:\s]+([^\n]+)",
        "weightage": r"Weightage[:\s]+([^\n]+)",
        "ingredients": r"Ingredients[:\s]+([^\n]+)",
        "category": r"Category[:\s]+([^\n]+)",
        "nutritional_info": r"Nutritional Info per serving[:\s]+([\s\S]*?)(?=Ingredients|Category|Proprietary Claims)",
        "proprietary_claims": r"Proprietary Claims[:\s]+([\s\S]*?)(?=Note|Ingredients|Category|$)"
    }
    
    extracted_data = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, text_data, re.IGNORECASE)
        extracted_data[key] = match.group(1).strip() if match else None

    return extracted_data

# Function to classify nutrients with better handling of units
def classify_nutrients(nutritional_info):
    macronutrients = {}
    micronutrients = {}
    excessive_nutrients = {}

    # Expanded lists of keywords for nutrient classification
    macronutrient_keywords = ['calories', 'fat', 'protein', 'carbohydrate', 'fibre', 'sugars']
    micronutrient_keywords = ['vitamin', 'calcium', 'iron', 'magnesium', 'potassium', 'phosphorus', 'zinc', 'selenium', 'folate', 'omega-3', 'omega-6']
    excessive_nutrient_keywords = ['sodium', 'trans fat', 'cholesterol', 'saturated fat', 'added sugar', 'high fructose corn syrup', 'artificial sweeteners']

    # Extract values from the nutritional info text
    nutrient_values = re.findall(r'([\w\s]+):\s*([\d.]+[a-zA-Z%]*)', nutritional_info, re.IGNORECASE)
    
    for nutrient, value in nutrient_values:
        nutrient_lower = nutrient.lower().strip()

        # Classify based on keyword matching
        if any(keyword in nutrient_lower for keyword in macronutrient_keywords):
            macronutrients[nutrient] = value
        elif any(keyword in nutrient_lower for keyword in micronutrient_keywords):
            micronutrients[nutrient] = value
        elif any(keyword in nutrient_lower for keyword in excessive_nutrient_keywords):
            excessive_nutrients[nutrient] = value

    return macronutrients, micronutrients, excessive_nutrients

# Function to check harmful ingredients
def check_harmful_ingredients(ingredients):
    harmful_ingredients_db = [
        'e102', 'e110', 'e129', 'aspartame', 'saccharin', 'sucralose', 
        'msg', 'nitrates', 'nitrites', 'high fructose corn syrup', 'bha', 'bht',
        'sodium benzoate', 'potassium sorbate', 'addictives'
    ]
    
    harmful_ingredients_found = []
    for ingredient in ingredients.split(','):
        ingredient = ingredient.strip().lower()
        if any(harmful in ingredient for harmful in harmful_ingredients_db):
            harmful_ingredients_found.append(ingredient)

    return harmful_ingredients_found

# Function to parse proprietary claims
def parse_proprietary_claims(proprietary_text):
    claims = re.split(r'\\s', proprietary_text.strip()) if proprietary_text else []
    return [claim.strip() for claim in claims]

# Function to save the analysis results into a JSON structure
def save_analysis_results(comprehensive_data):
    output_file = 'analysis2.json'
    try:
        with open(output_file, 'w') as json_file:
            json.dump(comprehensive_data, json_file, indent=4)
        logging.info(f"Enhanced nutritional analysis saved to {output_file}")
    except Exception as e:
        logging.error(f"Failed to save data to {output_file}: {e}")

# Function to analyze claims and ingredients
def analyze_claims_and_ingredients(analysis):
    try:
        url = "https://cwbackend-a3332a655e1f.herokuapp.com/claims/analyze"
        # Assuming analysis is a dictionary with 'proprietary_claims' and 'ingredients' as keys
        params = {
            "claim": ', '.join(analysis.get("proprietary_claims", [])),
            "ingredients": analysis.get("ingredients", "")
        }
        
        # Sending GET request
        api_response = requests.get(url, params=params)

        # Checking if the request was successful
        if api_response.status_code == 200:
            return api_response.json()  # Return the response as JSON
        else:
            logging.error(f"API request failed with status code {api_response.status_code}")
            return None
    except Exception as e:
        logging.error(f"Error while sending API request: {e}")
        return None

# Flask route to handle image uploads and analysis
@app.route('/analyze', methods=['POST'])
def analyze():
    image_files = request.files.getlist('images')
    
    # Step 1: Automatically fetch nutritional info from images
    fetched_data = fetch_nutritional_info_from_images(image_files)
    if not fetched_data:
        logging.error("No data fetched from images.")
        return jsonify({"error": "No data fetched from images."}), 400
    
    logging.info("Fetched Nutritional Info:\n" + fetched_data)

    # Parsing fetched text data
    nutritional_data = parse_nutritional_info(fetched_data or "")

    # Get the classified nutrients
    macronutrients, micronutrients, excessive_nutrients = classify_nutrients(nutritional_data.get("nutritional_info", ""))

    # Check for harmful ingredients
    ingredients = nutritional_data.get("ingredients", "")
    harmful_ingredients = check_harmful_ingredients(ingredients)

    # Parsing proprietary claims
    proprietary_claims = parse_proprietary_claims(nutritional_data.get("proprietary_claims", ""))

    # Save the data into a comprehensive JSON structure
    comprehensive_data = {
        "product_name": nutritional_data.get("product_name", "").strip('*').strip(),
        "brand_name": nutritional_data.get("brand_name", "").strip('*').strip(),
        "quantity": nutritional_data.get("quantity", "").strip('*').strip(),
        "weight_in_grams": re.search(r'(\d+\.?\d*)\s*grams', nutritional_data.get("quantity", ""), re.IGNORECASE).group(1) if re.search(r'(\d+\.?\d*)\s*grams', nutritional_data.get("quantity", ""), re.IGNORECASE) else None,
        "macronutrients": macronutrients,
        "micronutrients": micronutrients,
        "excessive_nutrients": excessive_nutrients,
        "ingredients": ingredients.strip('*').strip(),
        "harmful_ingredients": harmful_ingredients,
        "category": nutritional_data.get("category", "").strip('*').strip(),
        "proprietary_claims": proprietary_claims
    }

    # Save the data
    save_analysis_results(comprehensive_data)

    # Analyze claims and ingredients
    analysis_result = analyze_claims_and_ingredients(comprehensive_data)
    if analysis_result:
        comprehensive_data['claims_analysis'] = analysis_result
        save_analysis_results(comprehensive_data)  # Save updated data

    return jsonify(comprehensive_data), 200

@app.route('/analyze-images', methods=['POST'])
def analyze_images():
    image_files = request.files.getlist('images')
    
    # Call the functions sequentially
    fetched_data = fetch_nutritional_info_from_images(image_files)
    if not fetched_data:
        return jsonify({"error": "No data fetched from images."}), 400
    
    nutritional_data = parse_nutritional_info(fetched_data)
    image_files = validate_and_preprocess_images()
    
    # Process the images
    process_images(image_files)
    
    # Rest of your analysis logic...
    
    comprehensive_data = {
        # Your comprehensive data here...
    }
    
    save_analysis_results(comprehensive_data)
    
    analysis_result = analyze_claims_and_ingredients(comprehensive_data)
    if analysis_result:
        comprehensive_data['claims_analysis'] = analysis_result
        save_analysis_results(comprehensive_data)
    
    return jsonify(comprehensive_data), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)