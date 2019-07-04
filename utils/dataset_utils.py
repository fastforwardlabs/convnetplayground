# -*- coding: utf-8 -*-
# This code snippet has functions to generate datasets
# List of supported datasets
# * cifar100 - /datasets/cifar100
# * iconicxK - /datasets/iconicxK


import tensorflow as tf
from tensorflow.keras.datasets import cifar100, cifar10
import os
import utils.file_utils as f_utils
import utils.model_utils as m_utils
import utils.feature_utils as feat_utils
from PIL import Image
from shutil import copyfile


def save_files(directory_path, images):
    """[Save a list of image files to a given dataset filepath]

    Arguments:
        directory_path {string} -- [file path to save dataset]
        images {list string} -- [description]
    """

    if not os.path.exists(directory_path):
        f_utils.mkdir(directory_path)
        for i, img in enumerate(images):
            img = Image.fromarray(images[i], 'RGB')
            img.save(directory_path + "/" + str(i) + '.jpg')
        tf.logging.info(
            "  >> Finished saving images to path " + directory_path)


def generate_dataset(dataset_params):
    if dataset_params["name"] == "cifar100":
        dataset_root_dir = dataset_params["path"]
        train_path = os.path.join(dataset_root_dir, "train")
        test_path = os.path.join(dataset_root_dir, "test")

        #   download CIFAR100 files from the keras dataset repo
        (x_train, y_train), (x_test, y_test) = cifar100.load_data(label_mode='fine')

        # creating train and test folder
        save_files(train_path, x_train)
        save_files(test_path, x_test)

        tf.logging.info(
            "  >> Cifar images saved to  datasets directory " + dataset_root_dir)
    elif dataset_params["name"] == "cifar10":
        class_details = []
        (x_train, y_train), (x_test, y_test) = cifar10.load_data()

        category_counter = {}
        num_per_category = round(dataset_params["dataset_size"] / 10)
        c_counter = 0
        f_utils.mkdir(dataset_params["path"])

        for i, val in enumerate(list(y_train)):
            val = val[0]
            if (val in category_counter.keys()):
                if(category_counter[val] < num_per_category):
                    class_details.append({str(c_counter): str(val)})
                    category_counter[val] = category_counter[val] + 1
                    img = Image.fromarray(x_train[i], 'RGB')
                    img.save(dataset_params["path"] +
                             "/" + str(c_counter) + '.jpg')
                    c_counter += 1
                    if c_counter >= dataset_params["dataset_size"]:
                        break
            else:
                category_counter[val] = 0

        f_utils.save_json_file(os.path.join(
            dataset_params["path"], "classes.json"), class_details)

        tf.logging.info(
            "  >> Cifar10 images saved to  datasets directory " + dataset_params["path"])


def get_supported_datasets():
    supported_datasets = [
        {"name": "iconic200", "icon": "icon.jpg",
            "description": "A dataset of 200 images across 10 categories (20 images per category) crawled from the Flickr API."},
        {"name": "fashion200", "icon": "fashion.jpg",
            "description": "A collection of 200 images (10 categories, 20 images per category) of real fashion models from the Kaggle Fashion Product Images Dataset. Images have a max width of 300px."},
        {"name": "tinyimagenet", "icon": "imagenet.jpg",
            "description": "A subset of the tinyimagenet dataset with 200 images across 10 classes (20 images per category). Each image is 64px by 64px."},
        {"name": "cifar10", "icon": "cifar.jpg",
            "description": "A subset of the CIFAR10 dataset, 200 images across 10 classes (20 images per category). Each image is 32px by 32px."}
    ]
    return supported_datasets


def rename_files(dataset_path):
    tf.logging.info(">> Renaming files in the directory " + dataset_path)
    image_files = os.listdir(dataset_path)
    image_files.sort()
    for i, image_file in enumerate(image_files):
        os.rename(os.path.join(dataset_path, image_file),
                  os.path.join(dataset_path, str(i-1) + ".jpg"))


def process_dataset(dataset_path):
    class_names = os.listdir(dataset_path)
    path_holder = []
    print(class_names)
    for class_name in class_names:
        if class_name != ".DS_Store":
            f_path = (os.path.join(dataset_path, class_name))
            f_names = os.listdir(f_path)
            for f_name in f_names:
                if f_name != ".DS_Store":
                    path = os.path.join(f_path, f_name)
                    path_holder.append({"path": path, "class": class_name})

    print(len(path_holder))
    class_details = []
    numer_holder = [(i) for i in range(len(path_holder))]
    for i, path in enumerate(path_holder):
        class_details.append({i: path["class"]})
        copyfile(path["path"], os.path.join(dataset_path, str(i) + ".jpg"))

    f_utils.save_json_file(os.path.join(
        dataset_path, "classes.json"), class_details)


def process_dataset_labels():
    dataset_path = "app/public/assets/semsearch/datasets"
    dataset_names = os.listdir(dataset_path)
    main_holder = {}
    all_holder = {}
    all_main_dict_holder = {}
    dict_list_holder = {}
    for dataset_name in dataset_names:
        if (dataset_name != ".DS_Store"):
            print(dataset_name)
            class_detail_holder = {}
            class_main_dict = {}
            class_details = f_utils.load_json_file(
                os.path.join(dataset_path, dataset_name, "classes.json"))

            for detail in class_details:

                class_name = list(detail.items())[0][1]
                class_member = list(detail.items())[0][0]
                class_main_dict[class_member] = class_name
                # print(class_name)
                if class_name not in class_detail_holder:
                    class_detail_holder[class_name] = [class_member]
                else:
                    temp = class_detail_holder[class_name]
                    temp.append(class_member)
                    class_detail_holder[class_name] = temp

            # print(class_main_dict)
            all_holder[dataset_name] = class_detail_holder
            all_main_dict_holder[dataset_name] = class_main_dict
            class_list = list(class_detail_holder.keys())
            class_list.sort()
            dict_list_holder[dataset_name] = class_list
    print(dict_list_holder)
    out_path = "app/src/assets/semsearch/"
    main_holder["classes"] = all_holder
    main_holder["dictionary"] = all_main_dict_holder
    main_holder["classlist"] = dict_list_holder

    f_utils.save_json_file(os.path.join(
        out_path, "datasetdictionary.json"), main_holder)
    tf.logging.info(" >> Fininshed generating class dictionaries")


def process_comparisons():
    sim_base_path = "app/public/assets/semsearch/similarity"
    dsets = get_supported_datasets()
    models = m_utils.get_supported_models()
    # for dataset in dsets:
    #     for model in models:
    #         metrics = feat_utils.list_distance_metrics()
    #         for metric in metrics:
    #             layers = m_utils.get_model_layer_names(model["name"])
    #             for layer in layers:
    #                 print(dataset["name"], model["name"], metric, layer)

    sim_path = os.path.join(sim_base_path, "fashion200",
                            "vgg16", "cosine", "block1_conv1" + ".json")
    data = f_utils.load_json_file(sim_path)
    print(data[:20])
