


import tensorflow as tf
from utils import dataset_utils as d_utils
from utils import model_utils as m_utils
from utils import feature_utils as feat_utils
from utils import visualization_util as v_utils

import os


tf.logging.set_verbosity(tf.logging.INFO) 
base_path = "app/src/assets"

"""[Generate dataset]
"""
dataset_output_path = os.path.join(base_path,"datasets/cifar100" )
create_dataset_params = {"path": dataset_output_path, "name":"cifar100" }
# d_utils.generate_dataset(create_dataset_params) 
 

"""[Generate embeddings]
"""

dataset_output_path = os.path.join(base_path,"datasets/cifar100/train")
dataset_params = {"name":"cifar100",   "path": dataset_output_path  , "dataset_size":1000}
model_params =  {"name": "vgg16"}

embedding_output_path = os.path.join(base_path,"embeddings", dataset_params["name"],model_params["name"])
embeddings_output_params= {"path":  embedding_output_path }
feat_utils.generate_embeddings(model_params,dataset_params, embeddings_output_params)

"""[Generate similarity scores]
"""
similarity_metrics = ["euclidean","cosine","hamming","jaccard","minkowski"]
for similarity_metric in similarity_metrics:
    similarity_output_path =  os.path.join(base_path,"similarity", dataset_params["name"], model_params["name"])
    embedding_source_path = embeddings_output_params["path"]
    similarity_params= {"similarity_output_path":similarity_output_path, "embedding_source_path": embedding_source_path, "similarity_metric": similarity_metric }
    feat_utils.generate_similarity_scores(model_params,dataset_params,similarity_params)

"""[Load and visualized saved similarity metric]
"""

similarity_data = feat_utils.get_similarity_data(similarity_base_path= base_path + "/similarity" ,layer_name="block5_pool",  similarity_metric="euclidean")
selected_image = "44"
max_display = 20
# print(similarity_data)
v_utils.plot_similar(selected_image,dataset_params["path"], similarity_data[selected_image], max_display)