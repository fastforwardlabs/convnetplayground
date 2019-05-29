
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
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
import numpy as np



def get_model(model_name="vgg16"):
  if (model_name == "vgg16"):
    model = VGG16(weights='imagenet', include_top=False)
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
 

def get_features(image_path, model): 
  img = image.load_img(image_path, target_size=(224, 224))
  img_data = image.img_to_array(img) 
  img_data = np.expand_dims(img_data, axis=0)
  img_data = preprocess_input(img_data)
  extracted_feature = model.predict(img_data)
  del img, img_data #free up memory
  return extracted_feature

def save_features(dataset_path, model):
  image_list = os.listdir(dataset_path) 
  image_list = image_list[:10]
  feature_holder = []
  for i,img in enumerate(image_list):
    extracted_feature = get_features(os.path.join(dataset_path, str(i) + ".jpg"), model)
    extracted_feature = np.array(extracted_feature).flatten()
    gc.collect()   #free up memory
#     print("extracting feature", str(i), img)
    feature_holder.append(extracted_feature)
  tf.logging.info("  >> Finished saving extracted features for " + str(len(feature_holder)) + " images. " + model.layers[len(model.layers)-1].name )
    
  return feature_holder

def save_embeddings(embedding_dir, embedding_name, embedding):
  f_utils.mkdir(embedding_dir)
  with open(os.path.join(embedding_dir,embedding_name) + ".pickle", 'wb') as f:
    pickle.dump(embedding, f)

def generate_embeddings(model_name, dataset_name, dataset_path):
  tf.logging.info(" >> Generating embeddings for model " +  model_name, " on " + dataset_name + " dataset")  
  embedding_output_path = os.path.join("embeddings", model_name, dataset_name) 
  model = get_model(model_name)
  layer_list = get_model_layer_names(model, model_name) 
  intermediate_models = get_intermediate_models(model,layer_list)
   
  for imodel in intermediate_models:
    feature_holder = save_features(dataset_path, imodel["model"] )
    save_embeddings(embedding_output_path,imodel["name"], feature_holder) 
    


# Compute similiarity between a feature and an entire feature matrix
def compute_distance_matrix(feat, feat_matrix, distance_metric = "cosine"):
    cosine_dist_matrix = spatial.distance.cdist(
        feat_matrix, feat.reshape(1, -1), distance_metric).reshape(-1, 1)
    return 1 - cosine_dist_matrix
  
def save_similarity_scores(similarity_dir, embedding_name, similarity_scores):
 
  f_utils.mkdir(similarity_dir)
  with open(os.path.join(similarity_dir,embedding_name) + ".json", 'w') as f:
    json.dump(similarity_scores, f)
    
  tf.logging.info("  >> Finished saving similarity record for " + embedding_name)
  
def generate_similarity_scores():
  tf.logging.info(" >> Generating similarity scores ...")
  embedding_base_path = "embeddings/vgg16/cifar100"
  emb_path_split = embedding_base_path.split("/")
  model_name, dataset_name = emb_path_split[1], emb_path_split[2]
  similarity_output_path = os.path.join("similarity", model_name, dataset_name) 
  embedding_paths = os.listdir(embedding_base_path)
  for embedding_path in embedding_paths:  
    full_embedding_path = os.path.join(embedding_base_path, embedding_path)
    if ("pickle" in full_embedding_path):
      layer_name = embedding_path.split(".")[0]
      with open(full_embedding_path, "rb") as f:
          extracted_features = pickle.load(f) 
          similarity_holder = {}
          for i in range(len(extracted_features)):
            distance_matrix = compute_distance_matrix(extracted_features[i], extracted_features)
            similarity_score_indexes = distance_matrix.flatten().argsort()[::-1]
            similarity_scores = distance_matrix[similarity_score_indexes].flatten()
            similarity_scores = np.around(similarity_scores, decimals=3)
            similarity_holder[i] = [list(similarity_score_indexes.astype(np.str)), list(similarity_scores.astype(np.str))]
          save_similarity_scores(similarity_output_path, layer_name, similarity_holder) 



    
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
