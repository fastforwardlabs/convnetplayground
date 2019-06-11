
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
    tf.keras.backend.clear_session()
    if (model_name == "vgg16"):
        from tensorflow.keras.applications.vgg16 import preprocess_input
        model = VGG16(weights='imagenet', include_top=False)
        return (model, preprocess_input)
    elif (model_name == "vgg19"):
        return (tf.keras.applications.vgg19.VGG19(weights='imagenet', include_top=False), tf.keras.applications.vgg16.preprocess_input)
    elif (model_name == "resnet50"):
        return (tf.keras.applications.resnet50.ResNet50(weights="imagenet", include_top=False), tf.keras.applications.resnet50.preprocess_input)
    elif (model_name == "mobilenet"):
        return (tf.keras.applications.mobilenet.MobileNet(weights="imagenet", include_top=False), tf.keras.applications.mobilenet.preprocess_input)
    elif (model_name == "xception"):
        return (tf.keras.applications.xception.Xception(weights="imagenet", include_top=False), tf.keras.applications.xception.preprocess_input)
    elif (model_name == "densenet121"):
        return (tf.keras.applications.densenet.DenseNet121(weights="imagenet", include_top=False), tf.keras.applications.densenet.preprocess_input)
    elif (model_name == "inceptionv3"):
        return (tf.keras.applications.inception_v3.InceptionV3(weights="imagenet", include_top=False), tf.keras.applications.inception_v3.preprocess_input)
    

def get_supported_models():
    model_architectures = [
                            {"name": "vgg16"},
                            {"name": "vgg19"},
                            {"name": "resnet50"},
                            {"name": "mobilenet"},
                            {"name": "xception"},
                            {"name": "densenet121"},
                            {"name": "inceptionv3"},
                            ]
    return  model_architectures

def get_all_layer_details(model, layer_list):
    layer_details = {}
    for i,layer in enumerate(model.layers): 
        layer_details[layer.name] = {"name": layer.name, "type":layer.__class__.__name__, "parametercount":layer.count_params(), "layer_index":i , "totallayers": len(model.layers)}
    
    detailed_layer_list = []
    for layer in layer_list:
        detailed_layer_list.append(layer_details[layer])
    return detailed_layer_list


def get_all_model_details():
    model_architectures = get_supported_models()
    model_details = []
    
    layer_details = f_utils.load_json_file("app/src/assets/models/layer_details.json")
    for model_detail in model_architectures:
        layer_array = []
        model_layers_dict = layer_details[model_detail["name"]]
        layer_names = get_model_layer_names(model_detail["name"])
        for layer in layer_names:
            if layer in model_layers_dict:
                layer_array.append(model_layers_dict[layer])
        layer_array = sorted(layer_array, key  = lambda i: i["layer_index"])

        # model, preprocess = get_model(model_name=model_detail["name"])
        # layer_names = get_model_layer_names(model_detail["name"])
        model_details.append({"name": model_detail["name"], "layers":layer_array })

    return model_details

    

  
# get_all_layer_details(model, ["block1_pool"])

    
def get_model_layer_names (model_name):
    layer_list = []
    #   for vgg layers only select pool layers
    if (model_name == "vgg16"):
        layer_list = ["block1_conv1", "block1_conv2",  "block3_conv1", "block3_conv3",  "block4_conv1", "block4_conv3",  "block5_conv1","block5_conv3"]
    elif (model_name == "vgg19"):
        layer_list = ["block1_conv1", "block1_conv2",  "block3_conv1", "block3_conv4",  "block4_conv1", "block4_conv4",  "block5_conv1","block5_conv4"]
    elif (model_name == "resnet50"):
        layer_list = ["res2a_branch2a", "res2b_branch2a",  "res3b_branch2a", "res4a_branch2a",  "res4e_branch2a", "res4c_branch2a", "res5a_branch2a",  "res5c_branch2c"]
    elif (model_name == "mobilenet"):
        layer_list = ["conv1", "conv_pw_2",  "conv_dw_3", "conv_dw_4",  "conv_dw_6", "conv_dw_9", "conv_pw_12",  "conv_pw_13"]
    elif (model_name == "xception"):
        layer_list = ["block1_conv1", "block1_conv2",  "conv2d_1", "block3_sepconv1",  "conv2d_3", "block7_sepconv2", "block12_sepconv3",  "block14_sepconv2"]
    elif (model_name == "densenet121"):
        layer_list = ["pool1", "conv2_block1_1_conv",  "conv2_block6_2_conv", "conv3_block5_1_conv",  "conv4_block23_2_conv", "conv5_block13_2_conv", "conv5_block16_1_conv",  "conv5_block16_2_conv"]
    elif (model_name == "inceptionv3"):
        layer_list = ["conv2d_1", "conv2d_3",  "conv2d_23", "mixed6",  "conv2d_54", "conv2d_75", "conv2d_86",  "mixed10"]
        
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
 
    
def get_model_viz_details(model_params): 
    
    model_name = "vgg16"
    
    # print(layer_list, dir_path)
    layer_details = f_utils.load_json_file("app/src/assets/models/layer_details.json")
   
    model_holder = []
    all_detail_holder = {}
    model_dir_names = os.listdir(model_params["model_dir"])
    if (".DS_Store" in model_dir_names):
        model_dir_names.remove(".DS_Store")
    for model_name in model_dir_names:
        detail_holder={}
        model_layers_dict = layer_details[model_name]

        dir_path =   os.path.join(model_params["model_dir"],model_name)
        f_utils.mkdir(dir_path)
        layer_list = os.listdir(dir_path )
        # layer_list.sort()
        layer_array = []
        all_layer_array = []
        for layer in model_layers_dict.keys():
            rowval = model_layers_dict[layer]
            rowval["id"] = str(rowval["layer_index"]) + ""
            all_layer_array.append(rowval)
        for layer in layer_list:  
            if layer in model_layers_dict:
                layer_array.append(model_layers_dict[layer])
            neuron_list = os.listdir( os.path.join(dir_path,layer) )
            neuron_list = [x.split(".")[0] for x in neuron_list]

            neuron_list.sort(key=float)
            detail_holder[layer] = neuron_list
        layer_array = sorted(layer_array, key  = lambda i: i["layer_index"])
        all_layer_array = sorted(all_layer_array, key  = lambda i: i["layer_index"])
        model_holder.append({"name": model_name, "layers": layer_array, "numlayers": len(model_layers_dict), "all_layers": all_layer_array })
        all_detail_holder[model_name] = detail_holder
    model_holder = sorted(model_holder, key  = lambda i: i["numlayers"])
    model_holder = {"models": model_holder}
    f_utils.save_json_file("app/src/assets/models/model_details.json", model_holder)
   
    f_utils.save_json_file(model_params["output_path"], all_detail_holder)
    tf.logging.info("  >> Finished saving model and layer details" )