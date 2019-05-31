import matplotlib.pyplot as plt
import os
from PIL import Image
import math

def plot_similar(selected_image_index, image_base_path, similarity, max_display):
    similarity_images_index = similarity[0]
    similarity_images_index = similarity_images_index[:max_display]
    similarity_scores = similarity[1]
    f_image = Image.open(os.path.join(image_base_path, str(selected_image_index) + ".jpg"))
    fig = plt.figure(figsize=(10, 10))
    columns = rows = math.sqrt(len(similarity_images_index)) + 1
    # rows = column
    ax = fig.add_subplot(rows, columns, 1)
    ax.set_title("Main Image " + selected_image_index + ".jpg", fontweight="bold",
                 size=10)
    plt.imshow(f_image)

    for i in range(0, len(similarity_images_index)):
        ax = fig.add_subplot(rows, columns, i+2)
        ax.set_title(similarity_images_index[i] + ".jpg " + "[" + similarity_scores[i] + "]" )
        curr_img = Image.open(os.path.join(image_base_path, str(similarity_images_index[i]) + ".jpg"))
        plt.imshow(curr_img)
    fig.tight_layout()
    plt.show()

