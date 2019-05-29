


import tensorflow as tf
from utils import dataset_utils as d_utils
from utils import model_utils as m_utils


tf.logging.set_verbosity(tf.logging.INFO)  

# m_utils.generate_embeddings("vgg16","cifar100","datasets/cifar100/test")
# m_utils.generate_similarity_scores()
m_utils.run_plot(similarity_path="similarity/vgg16/cifar100/block5_pool.json", selected_image="499")