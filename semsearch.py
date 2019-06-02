


import tensorflow as tf
from utils import dataset_utils as d_utils
from utils import model_utils as m_utils
from utils import feature_utils as feat_utils
from utils import visualization_utils as v_utils
from utils import file_utils as f_utils

import os


tf.logging.set_verbosity(tf.logging.INFO) 
base_path = "app/public/assets/semsearch"
base_path_public = "app/public/assets/semsearch"
base_path_src = "app/src/assets/semsearch"
base_path_local = ""

"""[Generate dataset]
"""
def generate_datasets():
    dataset_output_path = os.path.join(base_path_public,"datasets/cifar100" )
    create_dataset_params = {"path": dataset_output_path, "name":"cifar100" }
    d_utils.generate_dataset(create_dataset_params) 
 

"""[Generate embeddings]
"""
def generate_embeddings():
    model_names = m_utils.get_supported_models()
    for model_name in model_names:
        dataset_input_path = os.path.join(base_path_public,"datasets/cifar100/train")
        dataset_params = {"name":"cifar100",   "path": dataset_input_path  , "dataset_size":10}
        model_params =  {"name": model_name["name"]}

        embedding_output_path = os.path.join(base_path_local,"embeddings", dataset_params["name"],model_params["name"])
        embeddings_output_params= {"path":  embedding_output_path }
        feat_utils.generate_embeddings(model_params,dataset_params, embeddings_output_params)

"""[Generate similarity scores]
"""
def generate_similarity_metrics():
    similarity_metrics = feat_utils.list_distance_metrics()

    model_names = m_utils.get_supported_models()
    for model_name in model_names:
        dataset_params= {"name":"cifar100"}
        model_params =  {"name": model_name["name"]}
        embedding_input_path = os.path.join(base_path_local,"embeddings", dataset_params["name"],model_params["name"])
        for similarity_metric in similarity_metrics:
            similarity_output_path =  os.path.join(base_path_public,"similarity", dataset_params["name"], model_params["name"])
            embedding_source_path = embedding_input_path
            similarity_params= {"similarity_output_path":similarity_output_path, "embedding_source_path": embedding_source_path, "similarity_metric": similarity_metric }
            feat_utils.generate_similarity_scores(model_params,dataset_params,similarity_params)


def generate_model_details():
    model_details = m_utils.get_all_model_details()
    dataset_details = d_utils.get_supported_datasets()
    semsearch_details = {"models":model_details, "datasets": dataset_details, "metrics": feat_utils.list_distance_metrics()}
    print(semsearch_details)
    semsearch_details_save_path = os.path.join(base_path_src, "details.json")
    f_utils.save_json_file(semsearch_details_save_path, semsearch_details)
    tf.logging.info(">> Finished saving model dteails " + semsearch_details_save_path)

def visualize_similarity():
    """[Load and visualized saved similarity metric]
    """

    similarity_data = feat_utils.get_similarity_data(model_name="vgg16", similarity_base_path= base_path + "/similarity" ,layer_name="block5_pool",  similarity_metric="minkowski")
    selected_image = "4"
    max_display = 20
    # print(similarity_data)
    dataset_output_path = os.path.join(base_path,"datasets/cifar100/train")
    v_utils.plot_similar(selected_image,dataset_output_path, similarity_data[selected_image], max_display)


# generate_datasets()
# generate_embeddings()
# generate_similarity_metrics()
# generate_model_details()
# model , pre= m_utils.get_model("resnet50")
# llist = m_utils.get_model_layer_names(model,"resnet50")
# print(llist)

visualize_similarity()