
from tensorflow.keras.preprocessing import image
import numpy as np
import os
import gc
import tensorflow as tf
import pickle
import utils.file_utils as f_utils
import utils.model_utils as m_utils
from scipy import spatial
import json

def get_features(image_path, model, preprocess_input): 
  img = image.load_img(image_path, target_size=(224, 224))
  img_data = image.img_to_array(img) 
  img_data = np.expand_dims(img_data, axis=0)
  img_data = preprocess_input(img_data)
  extracted_feature = model.predict(img_data)
  del img, img_data #free up memory
  return extracted_feature

def extract_and_save_features(dataset_path, model, preprocess_input):
  image_list = os.listdir(dataset_path) 
  image_list = image_list[:10]
  feature_holder = []
  for i,img in enumerate(image_list):
    extracted_feature = get_features(os.path.join(dataset_path, str(i) + ".jpg"), model, preprocess_input)
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
  model, preprocess_input = m_utils.get_model(model_name)
  layer_list = m_utils.get_model_layer_names(model, model_name) 
  intermediate_models = m_utils.get_intermediate_models(model,layer_list)
   
  for imodel in intermediate_models:
    feature_holder = extract_and_save_features(dataset_path, imodel["model"], preprocess_input )
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
