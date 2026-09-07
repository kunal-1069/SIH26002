FROM node:20-alpine

WORKDIR /app

# Argument for Google Maps API key during Next.js static page generation
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDkis0HFmgKNF_RuBS6rHZz-aUxVkqUyd4
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
