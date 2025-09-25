# ChristmasTest3


docker compose up --build

docker build -t lucky_app2:latest .
docker save -o lucky_app2.tar lucky_app2:latest

docker load -i lucky_app2.tar
docker run -p 8000:8000 lucky_app2:latest
docker run -it --rm lucky_app2:latest bash
或
docker run -d --name lucky_app_container lucky_app2:latest python3 backend/manage.py runserver 0.0.0.0:8000
docker exec -it lucky_app_container bash
查詢
python3 --version
 node --version


docker run 用來創建和啟動新容器。
docker exec 用來在已經運行的容器內部執行命令。
