FROM node:20-alpine

WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
