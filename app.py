import os
import sys
from PIL import Image
import multiprocessing
import threading

from flask import Flask, redirect, url_for, request, render_template, Response, jsonify, redirect
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

import tensorflow as tf
from tensorflow import keras

from tensorflow.keras.applications.imagenet_utils import preprocess_input, decode_predictions
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

import numpy as np
from util import base64_to_pil

app = Flask(__name__)


# Use pretrained model from Keras
# Check https://keras.io/applications/
# or https://www.tensorflow.org/api_docs/python/tf/keras/applications

from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2
model = MobileNetV2(weights='imagenet')

#from tensorflow.keras.applications import DeepLabV3
#model = DeepLabV3(weights='cityscapes', input_shape=(None, None, 3), classes=19)
print('Model loaded. Check http://127.0.0.1:5000/')


# Model saved with Keras model.save()
#MODEL_PATH = 'models/your_model.h5'

# LOAD OWN TRAINED MODEL
# model = load_model(MODEL_PATH)
# model._make_predict_function()  

# LOAD MULTIPLE MODELS
# MODEL_NAMES = ["test-model", "test-model", "test-model"]
# AMOUNT_OF_MODELS = len(MODEL_NAMES)
# def load_models():
#    for i in range(AMOUNT_OF_MODELS):
#        load_single_model("models/" + MODEL_NAMES[i] + ".h5")
#        print("\nModel ", str(i+1), " of ",  AMOUNT_OF_MODELS, " loaded.")
#    print('Ready to go! Visit -> http://127.0.0.1:5000/')   


  
# import multiprocessing
# import time
# def task():
#    print('Sleeping for 0.5 seconds')
#    time.sleep(0.5)
#    print('Finished sleeping')
# if __name__ == "__main__": 
#    start_time = time.perf_counter()
#    processes = []
    # Creates 10 processes then starts them
#    for i in range(10):
#        p = multiprocessing.Process(target = task)
#        p.start()
#        processes.append(p)
    # Joins all the processes 
#    for p in processes:
#        p.join()
#    finish_time = time.perf_counter()
#    print(f"Program finished in {finish_time-start_time} seconds")     

pred = []
#models = []

def model_predict(img, model, index):
    img = img.resize((224, 224))

    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)

    x = preprocess_input(x, mode='tf')

    #pred[index] = models[index].predict(x)
    temp = model.predict(x)
    pred.insert(index,temp)
    print('Hi from N2')

print('Hi from N1')


#Multi threading
def multimodel_predict(img, model):
    threads = []
    for i in range(4):
        t = threading.Thread(target = model_predict, args= (img, model, i))
        t.start()
        threads.append(t)
    for t in threads:
        t.join()
    
    return 1

@app.route('/', methods=['GET'])
def index():
    # Main
    return render_template('index.html')


print('Hi from N3')
@app.route('/predict1', methods=['GET', 'POST'])
def predict1():
    if request.method == 'POST':
        img = base64_to_pil(request.json)

        img.save("./uploads/image.png")

        success = multimodel_predict(img, model)

        preds = pred.pop(0)

        pred_proba = "{:.3f}".format(np.amax(preds))    
        pred_class = decode_predictions(preds, top=1)   

        result = str(pred_class[0][0][1])               
        result = result.replace('_', ' ').capitalize()
        
        return jsonify(result=result, probability=pred_proba)

    return None

@app.route('/predict2', methods=['GET', 'POST'])
def predict2():
    if request.method == 'POST':
        img = base64_to_pil(request.json)

        preds = pred.pop(0)

        pred_proba = "{:.3f}".format(np.amax(preds))    
        pred_class = decode_predictions(preds, top=1)   

        result = str(pred_class[0][0][1])               
        result = result.replace('_', ' ').capitalize()
        
        return jsonify(result=result, probability=pred_proba)

    return None

@app.route('/predict3', methods=['GET', 'POST'])
def predict3():
    if request.method == 'POST':
        img = base64_to_pil(request.json)

        preds = pred.pop(0)

        pred_proba = "{:.3f}".format(np.amax(preds))    
        pred_class = decode_predictions(preds, top=1)   

        result = str(pred_class[0][0][1])               
        result = result.replace('_', ' ').capitalize()
        
        return jsonify(result=result, probability=pred_proba)

    return None

@app.route('/predict4', methods=['GET', 'POST'])
def predict4():
    if request.method == 'POST':
        img = base64_to_pil(request.json)

        preds = pred.pop(0)

        pred_proba = "{:.3f}".format(np.amax(preds))    
        pred_class = decode_predictions(preds, top=1)   

        result = str(pred_class[0][0][1])               
        result = result.replace('_', ' ').capitalize()
        
        return jsonify(result=result, probability=pred_proba)

    return None








"""
# Mapping of class indices to color codes for visualization
color_mapping = [
    (128, 64, 128),  # road
    (244, 35, 232),  # sidewalk
    # Add more class colors here
    # (R, G, B)
]

# Preprocess the input image
def preprocess_image(image):
    image = image.resize((256, 256))  # Resize the image to a fixed size
    image = np.array(image)
    image = image / 255.0  # Normalize pixel values to [0, 1]
    return image

# Perform image segmentation on the preprocessed image
def segment_image(image):
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    segmentation = model.predict(image)[0]
    return segmentation

# Convert the segmentation to colored mask
def colorize_mask(segmentation):
    h, w, _ = segmentation.shape
    mask = np.zeros((h, w, 3), dtype=np.uint8)
    for class_idx, color in enumerate(color_mapping):
        mask[segmentation == class_idx] = color
    return mask

"""


"""
@app.route('/predict1', methods=['GET', 'POST'])
def predict1():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join("uploads", filename)
            file.save(file_path)
            
            image = Image.open(file_path)
            preprocessed_image = preprocess_image(image)
            segmentation = segment_image(preprocessed_image)
            colored_mask = colorize_mask(segmentation)
            
            # Save the segmented image
            segmented_image = Image.fromarray(colored_mask)
            output_path = os.path.join("uploads", filename, "model1", "output.png")
            segmented_image.save(output_path)
            
            return jsonify({'output_path': output_path})

    return None

@app.route('/predict2', methods=['GET', 'POST'])
def predict2():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join("uploads", filename)
            
            image = Image.open(file_path)
            preprocessed_image = preprocess_image(image)
            segmentation = segment_image(preprocessed_image)
            colored_mask = colorize_mask(segmentation)
            
            # Save the segmented image
            segmented_image = Image.fromarray(colored_mask)
            output_path = os.path.join("uploads", filename, "model2", "output.png")
            segmented_image.save(output_path)
            
            return jsonify({'output_path': output_path})

    return None

@app.route('/predict3', methods=['GET', 'POST'])
def predict3():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join("uploads", filename)
            
            image = Image.open(file_path)
            preprocessed_image = preprocess_image(image)
            segmentation = segment_image(preprocessed_image)
            colored_mask = colorize_mask(segmentation)
            
            # Save the segmented image
            segmented_image = Image.fromarray(colored_mask)
            output_path = os.path.join("uploads", filename, "model3", "output.png")
            segmented_image.save(output_path)
            
            return jsonify({'output_path': output_path})

    return None

@app.route('/predict4', methods=['GET', 'POST'])
def predict4():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'})
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'})
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join("uploads", filename)
            
            image = Image.open(file_path)
            preprocessed_image = preprocess_image(image)
            segmentation = segment_image(preprocessed_image)
            colored_mask = colorize_mask(segmentation)
            
            # Save the segmented image
            segmented_image = Image.fromarray(colored_mask)
            output_path = os.path.join("uploads", filename, "model4", "output.png")
            segmented_image.save(output_path)
            
            return jsonify({'output_path': output_path})


    return None

"""

if __name__ == '__main__':
    

    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()
