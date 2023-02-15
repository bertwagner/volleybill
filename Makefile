# Upload the static website and invalidate the CloudFront cache so that changes can be seen without waiting
website:
	aws s3 cp app/website/ s3://volleybill.com --recursive	
	#invalidate cloudfront cache. need to programmatically grab distribution id in the future
	aws cloudfront create-invalidation --distribution-id E91WKTTKKZ185 --paths "/*" 2>&1 > /dev/null

# Upload application code for lambda functions
lambdas:
	(cd app/lambda/insert_game && 7z a -tzip ../insert_game.zip *)
	aws s3 cp app/lambda/insert_game.zip s3://volleybill.com-lambda-functions
	aws lambda update-function-code --function-name volleybill-insert-game --s3-bucket volleybill.com-lambda-functions --s3-key insert_game.zip > /dev/null
	
	(cd app/lambda/get_player_stats && 7z a -tzip ../get_player_stats.zip *)
	aws s3 cp app/lambda/get_player_stats.zip s3://volleybill.com-lambda-functions
	aws lambda update-function-code --function-name volleybill-get-player-stats --s3-bucket volleybill.com-lambda-functions --s3-key get_player_stats.zip > /dev/null

	(cd app/lambda/insert_payment && 7z a -tzip ../insert_payment.zip *)
	aws s3 cp app/lambda/insert_payment.zip s3://volleybill.com-lambda-functions
	aws lambda update-function-code --function-name volleybill-insert-payment --s3-bucket volleybill.com-lambda-functions --s3-key insert_payment.zip > /dev/null

	(cd app/lambda/get_payment_stats && 7z a -tzip ../get_payment_stats.zip *)
	aws s3 cp app/lambda/get_payment_stats.zip s3://volleybill.com-lambda-functions
	aws lambda update-function-code --function-name volleybill-get-payment-stats --s3-bucket volleybill.com-lambda-functions --s3-key get_payment_stats.zip > /dev/null

filter_coco_images:
	# python ml/src/data/filter_coco_images.py "models/coco2017-full/annotations/train_filtered.json" "models/coco2017-full/train" "models/coco2017-partial/train"
	python ml/src/data/filter_coco_images.py "models/coco2017-full/annotations/val_filtered.json" "models/coco2017-full/val" "models/coco2017-partial/val"

video_data:
	ffmpeg -i ml/data/raw/GP050269.MP4 -ss 00:00:00.0 -t 00:00:7.0 -vf "lenscorrection=cx=0.5:cy=0.5:k1=-0.255:k2=-0.022" ml/data/processed/GP050269_undistorted_10s.mp4