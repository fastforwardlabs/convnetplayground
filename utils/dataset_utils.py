# -*- coding: utf-8 -*-
# This code snippet has functions to generate datasets
# List of supported datasets
    # * cifar100 - /datasets/cifar100
    # * iconicxK - /datasets/iconicxK 


import tensorflow as tf 
from tensorflow.keras.datasets import cifar100 
import os 
import utils.file_utils as f_utils
from PIL import Image
   
      
def save_files(directory_path, images):
    """[Save a list of image files to a given dataset filepath]

    Arguments:
        directory_path {string} -- [file path to save dataset]
        images {list string} -- [description]
    """

    if not os.path.exists(directory_path):
        f_utils.mkdir(directory_path)
        for i,img in enumerate(images): 
            img = Image.fromarray(images[i], 'RGB')
            img.save( directory_path + "/" + str(i) + '.jpg')
        tf.logging.info("  >> Finished saving images to path " + directory_path)


def generate_dataset(dataset_params): 
    if dataset_params["name"] == "cifar100":
        dataset_root_dir = dataset_params["path"]
        train_path = os.path.join(dataset_root_dir, "train")
        test_path = os.path.join(dataset_root_dir, "test")
   
#   download CIFAR100 files from the keras dataset repo 
        (x_train, y_train), (x_test, y_test) = cifar100.load_data(label_mode='fine')
        
        # creating train and test folder
        save_files(train_path,x_train)
        save_files(test_path,x_test) 
        
        tf.logging.info("  >> Cifar images saved to  datasets directory " + dataset_root_dir)



