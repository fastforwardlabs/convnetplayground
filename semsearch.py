


import tensorflow as tf
from utils import dataset_utils as d_utils
from utils import model_utils as m_utils
from utils import feature_utils as feat_utils
from utils import visualization_utils as v_utils
from utils import file_utils as f_utils

import os


tf.logging.set_verbosity(tf.logging.INFO) 
base_path = "app/src/assets/semsearch"

"""[Generate dataset]
"""
def generate_datasets():
    dataset_output_path = os.path.join(base_path,"datasets/cifar100" )
    create_dataset_params = {"path": dataset_output_path, "name":"cifar100" }
    # d_utils.generate_dataset(create_dataset_params) 
 

"""[Generate embeddings]
"""
def generate_embeddings():
    dataset_output_path = os.path.join(base_path,"datasets/cifar100/train")
    dataset_params = {"name":"cifar100",   "path": dataset_output_path  , "dataset_size":100}
    model_params =  {"name": "vgg16"}

    embedding_output_path = os.path.join(base_path,"embeddings", dataset_params["name"],model_params["name"])
    embeddings_output_params= {"path":  embedding_output_path }
    # feat_utils.generate_embeddings(model_params,dataset_params, embeddings_output_params)

"""[Generate similarity scores]
"""
def generate_similarity_metrics():
    similarity_metrics = ["euclidean","cosine","hamming","jaccard","minkowski"]
    for similarity_metric in similarity_metrics:
        similarity_output_path =  os.path.join(base_path,"similarity", dataset_params["name"], model_params["name"])
        embedding_source_path = embeddings_output_params["path"]
        similarity_params= {"similarity_output_path":similarity_output_path, "embedding_source_path": embedding_source_path, "similarity_metric": similarity_metric }
        feat_utils.generate_similarity_scores(model_params,dataset_params,similarity_params)

def visualize_similarity():
    """[Load and visualized saved similarity metric]
    """

    similarity_data = feat_utils.get_similarity_data(similarity_base_path= base_path + "/similarity" ,layer_name="block5_pool",  similarity_metric="euclidean")
    selected_image = "2"
    max_display = 20
    # print(similarity_data)
    # v_utils.plot_similar(selected_image,dataset_params["path"], similarity_data[selected_image], max_display)
def generate_model_details():
    model_details = m_utils.get_all_model_details()
    dataset_details = d_utils.get_supported_datasets()
    semsearch_details = {"models":model_details, "datasets": dataset_details}
    print(semsearch_details)
    semsearch_details_save_path = os.path.join(base_path, "details.json")
    f_utils.save_json_file(semsearch_details_save_path, semsearch_details)
    tf.logging.info(">> Finished saving model dteails " + semsearch_details_save_path)

generate_model_details()

model , pre= m_utils.get_model("resnet50")
llist = m_utils.get_model_layer_names(model,"resnet50")
print(llist)