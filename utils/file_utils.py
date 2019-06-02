import os
import tensorflow as tf
import json

def mkdir(directory_path):
    """[Create a directory (if it does not exist)]

    Arguments:
        directory_path {[string]} -- [path to create]
    """
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
        tf.logging.info("  >> Directory created at " +  directory_path)
  
def load_json_file(json_file_path):
    with open(json_file_path) as f:  
        json_data = json.load(f)    
        return json_data

def save_json_file(json_file_path, json_data):
    with open(json_file_path, 'w') as f:
        json.dump(json_data, f)