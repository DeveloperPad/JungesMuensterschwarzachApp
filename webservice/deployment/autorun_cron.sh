endpoints=$(jq -r ".BaseUrls.WEBSERVICE" /var/data/secrets/jma/app.json)
echo "*/1 * * * * curl $endpoints/cron.php" > crontab
supercronic crontab