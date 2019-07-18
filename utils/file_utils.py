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
        tf.logging.info("  >> Directory created at " + directory_path)


def load_json_file(json_file_path):
    with open(json_file_path) as f:
        json_data = json.load(f)
        return json_data


def save_json_file(json_file_path, json_data):
    with open(json_file_path, 'w') as f:
        json.dump(json_data, f)


def compress_files(folder_name):
    file_names = os.listdir(folder_name)

    for path, subdirs, files in os.walk(folder_name):
        for name in files:
            ext = name.split(".")[1]
            if ext == "jpg":
                full_path = os.path.join(path, name)
                # print(full_path)
                os_command = "jpegoptim -f --max=85 " + full_path
                os.system(os_command)
