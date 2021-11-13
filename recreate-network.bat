docker network rm jenkins
docker network create -d bridge jenkins --subnet 172.16.1.7/24