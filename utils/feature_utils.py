
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
from keras import backend as K
from skimage.io import imread

from efficientnet import center_crop_and_resize, preprocess_input as effpreprocess
from tensorflow.keras.preprocessing import image as imageprep


def get_features(image_path, model, preprocess_input):
    # image_size = model.input_shape[1]
    # # img = image.load_img(image_path, target_size=(456, 456))
    # # img_data = image.img_to_array(img)
    # # img_data = np.expand_dims(img_data, axis=0)
    # # # if ("efficient" not in model.name):
    # # img_data = preprocess_input(img_data)
    # loaded_image = imread(image_path)
    # img = center_crop_and_resize(loaded_image, image_size=image_size)
    # img_data = effpreprocess(img)
    # img_data = np.expand_dims(img_data, axis=0)
    # # if ("efficient" not in model.name):

    # extracted_feature = model.predict(img_data)

    image_size = model.input_shape[1]
    img = imageprep.load_img(image_path, target_size=(image_size, image_size))
    img = imageprep.img_to_array(img)
    img_data = preprocess_input(img)
    img_data = np.expand_dims(img_data, axis=0)

    extracted_feature = model.predict(img_data)

    del img, img_data  # free up memory
    return extracted_feature


def extract_features(dataset_params, model, preprocess_input):
    dataset_path, dataset_size = dataset_params["path"], dataset_params["dataset_size"]
    image_list = os.listdir(dataset_path)
    image_list = image_list[:dataset_size]
    feature_holder = []
    for i, img in enumerate(image_list):
        extracted_feature = get_features(os.path.join(
            dataset_path, str(i) + ".jpg"), model, preprocess_input)
        extracted_feature = np.array(extracted_feature).flatten()
        gc.collect()  # free up memory
#     print("extracting feature", str(i), img)
        feature_holder.append(extracted_feature)
    tf.logging.info("  >> Finished extracting features for " + str(
        len(feature_holder)) + " images. " + model.layers[len(model.layers)-1].name)

    return feature_holder


def save_embeddings(embedding_output_dir, embedding_name, embedding):
    f_utils.mkdir(embedding_output_dir)
    json_file_path = os.path.join(
        embedding_output_dir, embedding_name) + ".json"
    f_utils.save_json_file(json_file_path, embedding)


# Compute similiarity between a feature and an entire feature matrix
def compute_distance_matrix(feat, feat_matrix, distance_metric="cosine"):
    cosine_dist_matrix = spatial.distance.cdist(
        feat_matrix, feat.reshape(1, -1), distance_metric).reshape(-1, 1)
    return 1 - cosine_dist_matrix


def compute_full_distance_matrix(feat, feat_matrix, distance_metric="cosine"):
    cosine_dist_matrix = spatial.distance.cdist(
        feat_matrix, feat, distance_metric).reshape(-1, 1)
    return 1 - cosine_dist_matrix


def save_similarity_scores(similarity_output_dir, layer_name, similarity_scores):

    f_utils.mkdir(similarity_output_dir)
    json_file_path = os.path.join(similarity_output_dir, layer_name) + ".json"
    f_utils.save_json_file(json_file_path, similarity_scores)
#   tf.logging.info("  >> Finished saving similarity record for " + layer_name)


def generate_similarity_scores(similarity_params, extracted_features):
    sim_holder = {}
    all_dist = compute_full_distance_matrix(
        extracted_features, extracted_features, similarity_params["similarity_metric"])
    all_dist = all_dist.reshape(-1, len(extracted_features))
    print("========")
    for i in range(len(all_dist)):
        distance_matrix = all_dist[i]
        similarity_score_indexes = distance_matrix.argsort()[::-1]
        similarity_scores = distance_matrix[similarity_score_indexes].flatten()
        similarity_scores = np.around(similarity_scores, decimals=3)
        sim_holder[i] = list(zip(list(similarity_score_indexes.astype(
            np.str)), list(similarity_scores.astype(np.str))))
    tf.logging.info(
        " >>>  >>>>  >>>> Distance computaton done, zipping and saving ...")
    save_similarity_scores(
        similarity_params["output_path"],  similarity_params["layer_name"], sim_holder)


def generate_umap_embeddings(umap_params, extracted_features):
    embedding = umap.UMAP().fit_transform(extracted_features)
    f_utils.mkdir(umap_params["output_dir"])
    json_file_path = os.path.join(
        umap_params["output_dir"], umap_params["layer_name"]) + ".json"
    f_utils.save_json_file(json_file_path, embedding)


def list_distance_metrics():
    metrics = ["braycurtis", "canberra", "chebyshev", "cityblock", "correlation", "cosine", "dice", "euclidean", "hamming", "jaccard", "jensenshannon", "kulsinski",
               "mahalanobis", "matching", "minkowski", "rogerstanimoto", "russellrao", "seuclidean", "sokalmichener", "sokalsneath", "sqeuclidean", "wminkowski", "yule"]
    metrics = ["cosine", "euclidean", "sqeuclidean", "minkowski"]
    # metrics = ["cosine"]
    return metrics


def get_similarity_data(similarity_base_path="similarity", dataset_name="cifar100", model_name="vgg16", layer_name="block1_pool", similarity_metric="cosine"):
    similarity_path = os.path.join(
        similarity_base_path, dataset_name, model_name, similarity_metric, layer_name) + ".json"
    return f_utils.load_json_file(similarity_path)
