from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from paddleocr import PaddleOCR
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your trained YOLO model
model = YOLO(r"C:\Users\soumy\OneDrive\Pictures\Documents\TBP\license_plate_detector.pt")

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')

@app.route('/extract_plate', methods=['POST'])
def extract_plate():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    print("Image successfully loaded and decoded")

    print("Running YOLO model to detect license plates...")
    results = model(img)
    plate_texts = []

    for result in results:
        for box in result.boxes.xyxy:
            x1, y1, x2, y2 = map(int, box)
            print(f"Found bounding box: x1={x1}, y1={y1}, x2={x2}, y2={y2}")
            plate = img[y1:y2, x1:x2]

            if plate.size == 0:
                print("Skipping empty crop.")
                continue

            print("Running PaddleOCR on cropped region...")
            ocr_result = ocr.ocr(plate, cls=True)

            for line in ocr_result:
                for box, (text, confidence) in line:
                    print(f"OCR Detected text: {text} (confidence: {confidence})")
                    plate_texts.append(text)

    if not plate_texts:
        print("License plate not detected or text unreadable.")
        return jsonify({'error': 'License plate not detected'}), 400

    final_plate = plate_texts[0]
    print(f"Returning detected plate number: {final_plate}")
    return jsonify({'plate_number': final_plate})

if __name__ == '__main__':
    app.run(debug=True, port=5000)