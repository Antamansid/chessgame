FROM node:18.14.0
EXPOSE 8002/tcp

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --loglevel verbose
COPY ./out/chess/src ./
CMD [ "node", "index.js" ]