FROM node:20
# Install as development since CLI and Migration not exist on production mode
ENV NODE_ENV=development
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, yarn.lock to the working directory
COPY package*.json ./
COPY yarn.lock ./

# Install the application dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD [ "yarn" , "migrationandstart"]
