# Base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies first (leverage caching)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000 (default port for lite-server)
EXPOSE 3000

# Set the command to start the lite-server
CMD ["npm", "run", "dev"]
