docker network rm jenkins
docker network create --subnet 172.16.1.7/24 --attachable -d bridge jenkins