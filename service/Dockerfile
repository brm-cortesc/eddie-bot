# Use Node v6 as the base image.
FROM node:6

# variable de slack
ENV TOKEN 


# Add everything in the current directory to our image, in the 'app' folder.
ADD . /app

# Install dependencies
RUN cd /app; \
    npm install --production

# Expose our server port.
EXPOSE 3000

# Run our app.
CMD ["node", "/app/server.js"]