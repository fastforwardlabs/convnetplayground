from keras import backend as K
import tensorflow as tf
from utils import dataset_utils as d_utils
from utils import model_utils as m_utils
from utils import feature_utils as feat_utils
from utils import visualization_utils as v_utils
from utils import file_utils as f_utils

import os
from datetime import datetime


tf.logging.set_verbosity(tf.logging.INFO)
base_path = "app/public/assets/semsearch"
base_path_public_models = "app/public/assets/models"
base_path_src_models = "app/src/assets/models"
base_path_public = "app/public/assets/semsearch"
base_path_src = "app/src/assets/semsearch"
base_path_local = ""

"""[Generate dataset]
"""


def generate_datasets(dataset_size):
    dataset_output_path = os.path.join(base_path_public, "datasets/cifar10")
    create_dataset_params = {"path": dataset_output_path,
                             "name": "cifar10", "dataset_size": dataset_size}
    d_utils.generate_dataset(create_dataset_params)


"""[Generate embeddings]
"""


def generate_embeddings(dataset_params):
    model_details = m_utils.get_supported_models()
    similarity_metrics = feat_utils.list_distance_metrics()
    for model_detail in model_details:
        tf.logging.info(
            " >>   >>> " + model_detail["name"] + " >>   >>> ")
        dataset_input_path = os.path.join(
            base_path_public, dataset_params["path"])
        model_params = {"name": model_detail["name"]}

        embedding_output_path = os.path.join(
            base_path_local, "embeddings", dataset_params["name"], model_params["name"])
        embeddings_output_params = {"path":  embedding_output_path}

        model, preprocess_input = m_utils.get_model(model_detail["name"])
        layer_list = m_utils.get_model_layer_names(model_detail["name"])
        intermediate_models = m_utils.get_intermediate_models(
            model, layer_list)

        for intermediate_model in intermediate_models:
            extracted_features = feat_utils.extract_features(
                dataset_params, intermediate_model["model"], preprocess_input)

            for similarity_metric in similarity_metrics:
                tf.logging.info(
                    " >> >> Generating similarity scores for " + similarity_metric)
                similarity_output_path = os.path.join(
                    base_path_public, "similarity", dataset_params["name"], model_params["name"], similarity_metric)
                similarity_params = {"output_path": similarity_output_path,
                                     "layer_name": intermediate_model["name"],  "similarity_metric": similarity_metric}
                feat_utils.generate_similarity_scores(
                    similarity_params, extracted_features)


def generate_model_details():
    model_details = m_utils.get_all_model_details()
    dataset_details = d_utils.get_supported_datasets()
    semsearch_details = {"models": model_details, "datasets": dataset_details,
                         "metrics": feat_utils.list_distance_metrics()}
    # print(semsearch_details)
    semsearch_details_save_path = os.path.join(base_path_src, "details.json")
    f_utils.save_json_file(semsearch_details_save_path, semsearch_details)
    tf.logging.info(">> Finished saving model dteails " +
                    semsearch_details_save_path)


def visualize_similarity():
    """[Load and visualized saved similarity metric]
    """

    similarity_data = feat_utils.get_similarity_data(
        model_name="vgg16", similarity_base_path=base_path + "/similarity", layer_name="block5_pool",  similarity_metric="minkowski")
    selected_image = "4"
    max_display = 20
    # print(similarity_data)
    dataset_output_path = os.path.join(base_path, "datasets/cifar10")
    v_utils.plot_similar(selected_image, dataset_output_path,
                         similarity_data[selected_image], max_display)


def generate_model_viz_details():

    model_params = {"model_dir": base_path_public_models,
                    "output_path": os.path.join(base_path_src_models, "models.json")}
    m_utils.get_model_viz_details(model_params)


def compute_scores():
    model_name = "vgg16"
    dataset_name = "iconic200"
    metric_name = "cosine"
    layer_name = "block1_conv1"
    topx = 15

    sim_base_path = "app/public/assets/semsearch/similarity"
    score_base_path = "app/public/assets/semsearch/scores"

    similarity_metrics = feat_utils.list_distance_metrics()

    model_architectures = m_utils.get_supported_models()
    dataset_details = d_utils.get_supported_datasets()
    dataset_result_holder = {}
    for dataset_detail in dataset_details:
        dataset_name = dataset_detail["name"]
        model_result_holder = {}
        for model_detail in model_architectures:
            model_name = model_detail["name"]
            metric_holder = {}
            for metric_name in similarity_metrics:
                layer_names = m_utils.get_model_layer_names(model_name)
                layer_score_holder = {}
                score_path = os.path.join(score_base_path, dataset_name,
                                          model_name)
                f_utils.mkdir(score_path)
                score_path = os.path.join(score_path, metric_name + ".json")

                for layer_name in layer_names:
                    class_details = m_utils.get_class_details(dataset_name)
                    sim_path = os.path.join(sim_base_path, dataset_name,
                                            model_name, metric_name, layer_name + ".json")

                    print(sim_path)
                    sim_details = f_utils.load_json_file(sim_path)
                    model_score_per_image_holder = []
                    for i in range(len(sim_details)):
                        main_image = str(i)
                        each_sim = sim_details[main_image][1:topx + 1]
                        model_score = m_utils.compute_performance(
                            each_sim, main_image, class_details)
                        model_score_per_image_holder.append(model_score*100)

                    # model_score_per_image_holder
                    layer_score_holder[layer_name] = model_score_per_image_holder

                metric_holder[metric_name] = layer_score_holder
                f_utils.save_json_file(score_path, layer_score_holder)
            model_result_holder[model_name] = metric_holder
        dataset_result_holder[dataset_name] = model_result_holder
    print("Score generation complete")
    score_save_path = "app/src/assets/semsearch/modelscores.json"
    f_utils.save_json_file(score_save_path, dataset_result_holder)
# start_time = datetime.now()
# supported_datasets = d_utils.get_supported_datasets()
# for dataset in supported_datasets:
#     K.clear_session()
#     dataset_params = {"name": dataset["name"],   "path": os.path.join(base_path_public,
#                                                                       "datasets/" + dataset["name"]), "dataset_size": 200}
#     generate_embeddings(dataset_params)
# print("Time taken:", datetime.now() - start_time)

# d_utils.rename_files(os.path.join(base_path_public, "datasets/tinyimagenet"))

# generate_embeddings(50)
# generate_similarity_metrics()
# generate_model_details()
# generate_model_viz_details()
# visualize_similarity()

# d_utils.process_comparisons()

# f_utils.compress_files(base_path)
# f_utils.compress_files(base_path_public_models)

# d_utils.curate_interesting()


# print(m_utils.get_all_model_details())
# d_utils.process_dataset(os.path.join(base_path_public, "datasets/fashion200"))

# d_utils.process_dataset_labels()


# Generate all model comparison scores
compute_scores()
