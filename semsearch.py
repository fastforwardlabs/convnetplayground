


import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
import numpy as np



def load_model(model_type):

    # laod imagenet pretrained weights
    model = VGG16(weights='imagenet', include_top=False)

    return model


def get_intermediate_model(model, layer_name):
    return Model(input=model.input, outputs= model.get_layer(layer_name).output)