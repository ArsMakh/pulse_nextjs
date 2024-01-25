# build:
# 	docker build -t arsmakh/pulse:develop --no-cache=True .
# run:
# 	docker run -it -p 80:80 --rm --env-file .env --name pulse arsmakh/pulse:develop
# stop:
# 	docker stop pulse

# docker-compose
# build:
#     docker compose up --build
# run:
#     docker compose up
# stop:
#     docker compose down