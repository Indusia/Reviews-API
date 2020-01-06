FROM node:10
RUN mkdir /reviews
ADD . /reviews
WORKDIR /reviews
RUN npm install

EXPOSE 8080
CMD [ "node", "server/index.js" ]