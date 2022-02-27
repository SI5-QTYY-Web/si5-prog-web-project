FROM node:lts-alpine
WORKDIR /app
COPY . .
ENV PORT=3333
EXPOSE ${PORT}
RUN npm install --production
CMD node ./main.js