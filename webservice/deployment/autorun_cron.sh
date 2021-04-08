endpoints=$(jq -r ".BaseUrls.WEBSERVICE" /var/data/secrets/jma/app.json)
echo "*/5 * * * * curl $endpoints/cron.php" > crontab
supercronic crontab