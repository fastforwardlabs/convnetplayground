# -*- coding: utf-8 -*-
# This code snippet has functions to generate datasets
# List of supported datasets
# * cifar100 - /datasets/cifar100
# * iconicxK - /datasets/iconicxK


import tensorflow as tf
from tensorflow.keras.datasets import cifar100, cifar10
import os
import utils.file_utils as f_utils
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

        tf.logging.info("  >> Cifar images saved to  datasets directory " + dataset_root_dir)
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
                    class_details.append({str(c_counter):str(val)})
                    category_counter[val] = category_counter[val] + 1
                    img = Image.fromarray(x_train[i], 'RGB')
                    img.save(dataset_params["path"] + "/" + str(c_counter) + '.jpg')
                    c_counter += 1
                    if c_counter >= dataset_params["dataset_size"]:
                        break
            else:
                category_counter[val] = 0

        f_utils.save_json_file(os.path.join(dataset_params["path"],"classes.json"), class_details)   
        
        tf.logging.info("  >> Cifar10 images saved to  datasets directory " + dataset_params["path"])

def get_supported_datasets():
    supported_datasets = [
        {"name": "iconic200", "icon":"icon.jpg"},
        {"name": "tinyimagenet", "icon":"imagenet.jpg"},
        {"name": "cifar10", "icon":"cifar.jpg"},
        # {"name": "Iconic3k", "icon":"0.jpg"}
    ]
    return supported_datasets

def rename_files(dataset_path):
    tf.logging.info(">> Renaming files in the directory " + dataset_path)
    image_files = os.listdir(dataset_path)
    image_files.sort()
    for i,image_file in enumerate(image_files):
        os.rename(os.path.join(dataset_path, image_file), os.path.join(dataset_path, str(i-1) + ".jpg"))

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
                    path  = os.path.join(f_path, f_name) 
                    path_holder.append({"path": path, "class":class_name})

    print(len(path_holder))
    class_details = []
    numer_holder =   [(i) for i in range(len(path_holder)) ]
    for i,path in enumerate(path_holder):
        class_details.append({i: path["class"]})
        copyfile(path["path"], os.path.join(dataset_path, str(i) + ".jpg" ))

            
    f_utils.save_json_file(os.path.join(dataset_path,"classes.json"), class_details)   