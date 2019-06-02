
# -*- coding: utf-8 -*-
# This code snippet has functions to generate embeddings and similarity scores for datasets
# The generated date files (json) are consumed by the front end application
    # * datasets - /datasets
    # * embeddings - /embeddings
    # * similarity - /embeddings
import tensorflow as tf 
import numpy as np
import os
import gc
import pickle
from scipy import spatial
import json 
import utils.file_utils as f_utils

 
from tensorflow.keras.models import Model
from tensorflow.keras.applications.vgg16 import VGG16
import numpy as np



def get_model(model_name="vgg16"):
    if (model_name == "vgg16"):
        from tensorflow.keras.applications.vgg16 import preprocess_input
        model = VGG16(weights='imagenet', include_top=False)
        return (model, preprocess_input)
    elif (model_name == "resnet50"):
        from tensorflow.keras.applications.resnet50 import ResNet50
        from tensorflow.keras.applications.resnet50 import preprocess_input
        model = ResNet50(weights="imagenet", include_top=False)
        return (model, preprocess_input)


def get_supported_models():
    model_architectures = [{"name": "vgg16"},
                            {"name": "resnet50"},
                            {"name": "resnet50"},
                            {"name": "resnet50"},
                            {"name": "resnet50"},
                            {"name": "resnet50"},

                            ]
    return  model_architectures

def get_all_layer_details(model, layer_list):
    layer_details = {}
    for i,layer in enumerate(model.layers): 
        layer_details[layer.name] = {"name": layer.name, "type":layer.__class__.__name__, "paremtercount":layer.count_params(), "layer_index":i , "totallayers": len(model.layers)}
    
    detailed_layer_list = []
    for layer in layer_list:
        detailed_layer_list.append(layer_details[layer])
    return detailed_layer_list


def get_all_model_details():
    model_architectures = get_supported_models()
    model_details = []
    for model_detail in model_architectures:
        model, preprocess = get_model(model_name=model_detail["name"])
        layer_names = get_model_layer_names(model, model_detail["name"])
        model_details.append({"name": model_detail["name"], "layers":get_all_layer_details(model, layer_names)})

    return model_details

    

  
# get_all_layer_details(model, ["block1_pool"])

    
def get_model_layer_names (model, model_name):
    layer_list = []
    #   for vgg layers only select pool layers
    if (model_name == "vgg16"):
        for layer in model.layers: 
            if ("pool" in layer.name):
                layer_list.append(layer.name)
        layer_list = ["block1_conv1", "block1_pool",  "block3_conv1", "block3_pool",  "block4_conv1", "block4_pool",  "block5_conv1","block5_pool"]
        return layer_list
    elif (model_name == "resnet50"):
        # for layer in model.layers:
        #     if("activation" in layer.name):
        #         layer_list.append(layer.name)
        layer_list = ["res2a_branch2a", "res2b_branch2a",  "res3b_branch2a", "res4a_branch2a",  "res4e_branch2a", "res4c_branch2a", "res5a_branch2a",  "res5c_branch2c"]
        return layer_list

def get_intermediate_models(model,layer_list):
    intermediate_model_list = []
    for layer_name in layer_list:
        intermediate_model = Model(inputs=model.input, outputs=model.get_layer(layer_name).output)
        intermediate_model_list.append({"model": intermediate_model, "name": layer_name}) 
    
    # tf.logging.info("  >> Finished generating " + str(len(intermediate_model_list)) + " intermediate models")
    return intermediate_model_list

model_architectures = ["densenet121","densenet169","densenet201",
                       "inceptionresnet","inceptionv3",
                       "mobilenet","mobilenetv2",
                       "nasnet",
                       "resnet50","resnet101","resnet152",
                       "resnet50v2","resnet101v2","resnet152v2",
                       "resnext50","resnext101",
                       "vgg16","vgg19", "xception"]
 
    
