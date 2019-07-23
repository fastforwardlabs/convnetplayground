
import gc
import os
from PIL import Image
import numpy as np
import keras
import keras.backend as K
from efficientnet import EfficientNetB5
import lucid.optvis.param as param
import lucid.optvis.transform as transform

from lucid4keras import prepare_model, keras_render_vis
from lucid4keras import objectives as keras_objectives

import matplotlib.pyplot as plt


def mkdir(directory_path):
    """[Create a directory (if it does not exist)]

    Arguments:
        directory_path {[string]} -- [path to create]
    """
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
#         tf.logging.info("  >> Directory created at " +  directory_path)


def save_image(images, model_params):
    model_name, layer_name, neuron_index = model_params[
        "model_name"], model_params["layer_name"], model_params["neuron_index"]
    directory_path = os.path.join(
        "models", model_name, layer_name.replace("/", "_"))
    mkdir(directory_path)
    save_path = directory_path + "/" + str(neuron_index) + '.jpg'
    fig = plt.imshow(images[0][0])
    fig.axes.get_xaxis().set_visible(False)
    fig.axes.get_yaxis().set_visible(False)
    plt.savefig(save_path, bbox_inches='tight',
                transparent=False, pad_inches=0)


found_new = False


def generate_model_images(model_params):
    K.clear_session()
    model = EfficientNetB5(weights='imagenet')

    try:
        model = prepare_model(model, layer_name=model_params["layer_name"])
    except Exception as e:
        #     print(" >> error occurred", model_params, e)
        return
    num_neurons = model.layers[len(model.layers)-1].output_shape
    num_neurons = num_neurons[len(num_neurons)-1]
    counter = 0
    counter_ups = int(num_neurons / min(num_neurons, 30))
#   print(" >> generating ", num_neurons , "images for layer " , model_params["layer_name"], num_neurons, counter)

    # print(num_neurons)

    def param_f(): return param.image(model_params["image_size"])
    while counter < num_neurons:
        i = counter
        file_path = os.path.join(
            "models", model_params["model_name"], model_params["layer_name"], str(i) + ".jpg")
        print(file_path)
        if file_path not in file_holder:
            try:
                found_new = True
                images = keras_render_vis(model, i, param_f, thresholds=[256])
                model_params["neuron_index"] = i
                save_image(images, model_params)
#         print("  >> saving ", file_path)
            except Exception as e:
                print(" >> Error while generating image", e)

#     else:
#       print("file already generated")
        counter = counter + counter_ups
#     print("            >> processing image ", counter, " of ", num_neurons  )


def get_layer_list(model):
    layer_list = []
    for layer in model.layers:

        if (layer.count_params() > 0 and "Conv2D" in layer.__class__.__name__):
            layer_list.append(layer.name)
#       print(layer.__class__.__name__, layer.name)

    return layer_list


priority = ["conv2d_1", "conv2d_15",  "conv2d_50", "conv2d_78",
            "conv2d_99", "conv2d_100", "conv2d_130", "conv2d_155"]

K.clear_session()
model = EfficientNetB5(weights='imagenet')
# !rm -rf models/efficientnet
#
#
for layer in get_layer_list(model):
    if layer in priority:
        model_params = {"layer_name": layer,
                        "model_name": "efficientnetb0", "image_size": 128}
        print("Trying layer ", layer)
        generate_model_images(model_params)

#
