FROM longday/node:14.15.1-stretch
ENV NODE_ENV=development
ENV HOST 0.0.0.0
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
CMD ["npm", "start"]
