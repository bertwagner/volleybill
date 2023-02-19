# -*- coding: utf-8 -*-
import click
import logging
from pathlib import Path
import json
import os
import shutil
from tqdm import tqdm


@click.command()
@click.argument('filtered_json_filepath')
@click.argument('source_filepath')
@click.argument('output_filepath')
@click.argument('number_of_images')
def main(filtered_json_filepath, source_filepath, output_filepath,number_of_images):
    """ Uses a filtered.json file (generated with https://github.com/immersive-limit/coco-manager) to copy
        a subset of training and validation images from the full coco dataset
        python filter.py --input_json coco2017-full\annotations\instances_train2017.json --output_json coco2017-full\annotations\train_filtered.json --categories person
        python filter.py --input_json coco2017-full\annotations\instances_val2017.json --output_json coco2017-full\annotations\val_filtered.json --categories person
    """
    logger = logging.getLogger(__name__)
    logger.info('making final data set from raw data')

    full_path = os.path.join(project_dir,filtered_json_filepath)
    
    with open(full_path, 'r') as f:
        data=f.read()
    raw_json = json.loads(data)
    filtered_images = raw_json['images']
    if number_of_images == None:
        number_of_images = -1
    if int(number_of_images)==-1:
        pass
    else:
        filtered_images = filtered_images[:int(number_of_images)]
    filtered_annotations = raw_json['annotations']

    for image in tqdm(filtered_images):
        source_image = os.path.join(project_dir,source_filepath,"images",image["file_name"])
        dest_path = os.path.join(project_dir,output_filepath,"images")
        shutil.copy2(source_image,dest_path)
    
    for a in tqdm(filtered_annotations):
        image_id = a['image_id']
        x = a['bbox'][0]
        y = a['bbox'][1]
        width = a['bbox'][2]
        height = a['bbox'][3]
        filename=str(image_id).rjust(12,'0')
        try:
            image_lookup = list(filter(lambda image: image['file_name'].split('.')[0] == filename, filtered_images))[0]
            image_width = image_lookup['width']
            image_height = image_lookup['height']

            nx,ny,nw,nh = _normalize_xywh(x,y,width,height,image_width,image_height)

            # write out to text file
            dest_path = os.path.join(project_dir,output_filepath,"labels",filename+".txt")
            with open(dest_path, "a+") as myfile:
                myfile.write(f"\n0 {nx} {ny} {nw} {nh}")
        except:
            continue

def _normalize_xywh(x,y,w,h,image_w,image_h):
    x_center = w/2.0 + x
    y_center = h/2.0 + y

    n_x = x_center/image_w
    n_y = y_center/image_h
    n_w = w/image_w
    n_h = h/image_h

    return n_x, n_y, n_w, n_h

if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    # not used in this stub but often useful for finding various files
    project_dir = Path(__file__).resolve().parents[2]

    #main(["models/coco2017-full/annotations/train_filtered.json","models/coco2017-full/train","models/coco2017-2000/train","2000"])
    #main(["models/coco2017-full/annotations/val_filtered.json","models/coco2017-full/val","models/coco2017-2000/val", "200"])
    main()
