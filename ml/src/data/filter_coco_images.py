# -*- coding: utf-8 -*-
import click
import logging
from pathlib import Path
import json
import os
import shutil


@click.command()
@click.argument('filtered_json_filepath')
@click.argument('source_filepath')
@click.argument('output_filepath')
def main(filtered_json_filepath, source_filepath, output_filepath):
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
    filtered_images = json.loads(data)['images']

    for image in filtered_images:
        source_image = os.path.join(project_dir,source_filepath,image["file_name"])
        dest_path = os.path.join(project_dir,output_filepath)
        shutil.copy2(source_image,dest_path)


if __name__ == '__main__':
    log_fmt = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    logging.basicConfig(level=logging.INFO, format=log_fmt)

    # not used in this stub but often useful for finding various files
    project_dir = Path(__file__).resolve().parents[2]

    #main(["models/coco2017-full/annotations/train_filtered.json","models/coco2017-full/train","models/coco2017-partial/train"])
    main()
