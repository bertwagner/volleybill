# -*- coding: utf-8 -*-
import click
import logging
from pathlib import Path
import json
import os
import shutil
from tqdm import tqdm
import cv2


@click.command()
@click.argument('input_video_filepath')
@click.argument('output_image_folderpath')
@click.argument('number_of_images_to_generate')
def main(input_video_filepath, output_image_folderpath, number_of_images_to_generate):
    """ Convert a video to pictures for training. 
    Pass in number_of_images_generate=-1 to convert the full video, or any other number to sample the video.
    """
    logger = logging.getLogger(__name__)
    logger.info('create image training data')

    input_filepath = os.path.join(project_dir,input_video_filepath)
    
    vidcap = cv2.VideoCapture(input_filepath)
    total_frames = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
    success,image = vidcap.read()

    image_counter = 1
    outputted_counter = 0

    rate=total_frames/int(number_of_images_to_generate)

    while success:

        if (image_counter % int(rate)) == 0 or int(number_of_images_to_generate) == -1:
            color_image = image 
            resized = _resize_image(color_image,max_width=640,max_height=640)
            output_path=os.path.join(project_dir,output_image_folderpath,f'{image_counter:05d}.png')
            cv2.imwrite(output_path, resized)
            outputted_counter = outputted_counter + 1
            if outputted_counter ==  int(number_of_images_to_generate):
                break
        
        image_counter = image_counter + 1
        success,image = vidcap.read()

    

def _resize_image(img, max_width = None, max_height = None, inter = cv2.INTER_AREA):
    f1 = max_width / img.shape[1]
    f2 = max_height / img.shape[0]
    f = min(f1, f2)  # resizing factor
    dim = (int(img.shape[1] * f), int(img.shape[0] * f))
    resized = cv2.resize(img, dim)
    return resized

if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    # not used in this stub but often useful for finding various files
    project_dir = Path(__file__).resolve().parents[2]

    main(["data/processed/GP050269_undistored_60s.MP4","data/processed/frames-200","800"])
    #main()
