docker build . -f Dockerfile.dictionary_updater -t jma-dictionary-updater
docker run --rm -v %CD%:/workspace/project --network="jenkins" jma-dictionary-updater