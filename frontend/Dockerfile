# Use an official Node runtime as a parent image
FROM node:20.11-alpine3.18

# Set the working directory
WORKDIR /react-app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install 'serve' to serve the static files
RUN npm install -g serve

# Expose the port Cloud Run will use
EXPOSE 8080

# Use 'serve' to serve the built files on the port specified by the PORT environment variable
CMD ["sh", "-c", "serve -s build -l ${PORT}"]
