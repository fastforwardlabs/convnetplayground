import os
import tensorflow as tf


def mkdir(directory_path):
    """[Create a directory (if it does not exist)]

    Arguments:
        directory_path {[string]} -- [path to create]
    """
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
        tf.logging.info("  >> Directory created at " +  directory_path)
  