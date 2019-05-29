
# -*- coding: utf-8 -*-
# This code snippet has functions to generate embeddings and similarity scores for datasets
# The generated date files (json) are consumed by the front end application
    # * datasets - /datasets
    # * embeddings - /embeddings
    # * similarity - /embeddings
import tensorflow as tf 
from PIL import Image
import numpy as np
import os
import matplotlib.pyplot as plt
import gc
import pickle
from scipy import spatial
import json
import math
import utils.file_utils as f_utils

 
from tensorflow.keras.models import Model

from tensorflow.keras.applications.vgg16 import VGG16

import numpy as np



def get_model(model_name="vgg16"):
  if (model_name == "vgg16"):
    from tensorflow.keras.applications.vgg16 import preprocess_input
    model = (VGG16(weights='imagenet', include_top=False), preprocess_input), 
  return model
  
def get_model_layer_names (model, model_name):
  layer_list = []
  #   for vgg layers only select pool layers
  if (model_name == "vgg16"):
    for layer in model.layers: 
      if ("pool" in layer.name):
        layer_list.append(layer.name)
  return layer_list

def get_intermediate_models(model,layer_list):
    intermediate_model_list = []
    for layer_name in layer_list:
        intermediate_model = Model(inputs=model.input, outputs=model.get_layer(layer_name).output)
        intermediate_model_list.append({"model": intermediate_model, "name": layer_name}) 
    
    tf.logging.info("  >> Finished generating " + str(len(intermediate_model_list)) + " intermediate models")
    return intermediate_model_list

model_architectures = ["densenet121","densenet169","densenet201",
                       "inceptionresnet","inceptionv3",
                       "mobilenet","mobilenetv2",
                       "nasnet",
                       "resnet50","resnet101","resnet152",
                       "resnet50v2","resnet101v2","resnet152v2",
                       "resnext50","resnext101",
                       "vgg16","vgg19", "xception"]
 
    
def plot_similar(image_index, image_base_path, similarity, max_display):
    similarity_images_index = similarity[0]
    similarity_images_index = similarity_images_index[:max_display]
    similarity_scores = similarity[1]
    f_image = Image.open(os.path.join(image_base_path, str(image_index) + ".jpg"))
    fig = plt.figure(figsize=(10, 10))
    columns = rows = math.sqrt(len(similarity_images_index)) + 1
    # rows = column
    ax = fig.add_subplot(rows, columns, 1)
    ax.set_title("Main Image " + image_index + ".jpg", fontweight="bold",
                 size=10)
    plt.imshow(f_image)

    for i in range(0, len(similarity_images_index)):
        ax = fig.add_subplot(rows, columns, i+2)
        ax.set_title(similarity_images_index[i] + ".jpg " + "[" + similarity_scores[i] + "]" )
        curr_img = Image.open(os.path.join(image_base_path, str(similarity_images_index[i]) + ".jpg"))
        plt.imshow(curr_img)
    fig.tight_layout()
    plt.show()

def run_plot(similarity_path="similarity/vgg16/cifar100/block1_pool.json", selected_image="0"):
    with open(similarity_path) as f:  
        data = json.load(f)    
        plot_similar(selected_image,"datasets/cifar100/test", data[selected_image], 20)
