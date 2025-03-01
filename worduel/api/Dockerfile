FROM node:lts-alpine3.18

WORKDIR /usr/src/api

# The package.json file is copied separately to avoid re-installing dependencies (using the cache).
# It could happen if the source code changes but not the dependencies.
COPY ./package.json .
RUN npm install

COPY . .

EXPOSE 4000

RUN npx prisma generate

CMD ["npm", "run", "watch", "--host", "0.0.0.0"]