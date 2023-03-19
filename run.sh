echo Executando containers docker
docker-compose up -d

echo Executando servidor front-end
cd ./tasks-app
yarn preview