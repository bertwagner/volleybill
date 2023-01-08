# Upload the static website and invalidate the CloudFront cache so that changes can be seen without waiting
website:
	aws s3 cp app/website/ s3://volleybill.com --recursive	
	#invalidate cloudfront cache. need to programmatically grab distribution id in the future
	aws cloudfront create-invalidation --distribution-id E91WKTTKKZ185 --paths "/*" 2>&1 > /dev/null

# Upload application code for lambda functions
lambdas:
	zip -rj app/lambda/insert_game.zip app/lambda/insert_game
	aws s3 cp app/lambda/insert_game.zip s3://volleybill.com-lambda-functions
	aws lambda update-function-code --function-name volleybill-insert-game --s3-bucket volleybill.com-lambda-functions --s3-key insert_game.zip > /dev/null

	(cd app/lambda/get_player_stats && pip install --upgrade -r requirements.txt --target ./package)
	(cd app/lambda/get_player_stats/package && zip -r ../../get_player_stats.zip .)
	(cd app/lambda/get_player_stats && zip -r ../get_player_stats.zip main.py)
	aws s3 cp app/lambda/get_player_stats.zip s3://volleybill.com-lambda-functions
	aws lambda update-function-code --function-name volleybill-get-player-stats --s3-bucket volleybill.com-lambda-functions --s3-key get_player_stats.zip > /dev/null