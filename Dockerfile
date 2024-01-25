FROM node:18.17.0

# RUN mkdir /app

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# ENV PORT 80

EXPOSE 80

# VOLUME [ "/app/data" ]

CMD ["npm", "run", "dev"]