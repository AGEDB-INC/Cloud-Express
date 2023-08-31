[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
  <a href="https://github.com/apache/age/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/apache/age-viewer"/>
  <a href="https://github.com/apache/age/stargazers">
    <img src="https://img.shields.io/github/stars/apache/age-viewer"/>
</p>

# What is Apache-Age Viewer
Cloud-express is an innovative web application that aims to bridge the gap between users and Apache Age, a cutting-edge database management system. With Cloud-express, users can now access Apache Age online through a user-friendly web interface. Gone are the days of offline access – Cloud-express offers a seamless experience, allowing users to harness the power of Apache Age's advanced capabilities directly from their web browsers.

This is a sub-project of [the Apache AGE project](https://age.apache.org/#).

# Recommend Node Version & install module

- Node version - ^14.16.0

- Node Module - pm2 

Install latest **pm2** with :
``` npm i pm2 ```


> [pm2](https://www.npmjs.com/package/pm2) is an NPM module to run the project in production mode, and hence is optional for getting started with setting up development environment for Cloud express. 

# Running Cloud-express.

 - To run frontend:
   Install the required node modules using  :  
	```npm run setup```
- Run cloud-express frontend using : 
```npm run start```
- To run Backend
  use ```node index.js``` in backend folder


>This will start the Cloud-express frontend on http://localhost:3000 and backend on http://localhost:4000 if these ports are free.


# How to build using command

- Build the front-end : 
```npm run build-front ```

- Build the back-end :
``` npm run build-back```

- Start the project in production mode :
  ``` 
	pm2 stop ag-viewer-develop

	pm2 delete ag-viewer-develop

	pm2 start ecosystem.config.js

	```

  # How to start using Cloud express
 - To start using Cloud express we need to have a running postgreSQL database server with Apache Age Extension 
	 ### Setting up the PostgreSQL server with AGE extension
	-  Easiest way  for Windows, Mac-OS and Linux Environment using **Docker**
  
	> Install docker in advance (https://www.docker.com/get-started), install the version compatible with your OS from the provided link.
	
	 **Run Using Docker** :
   
	- Get the docker image - 
	```docker pull apache/age ```
	
	- Create AGE docker container
	```bash
	docker run --name myPostgresDb -p 5455:5432 -e POSTGRES_USER=postgresUser \
	-e POSTGRES_PASSWORD=postgresPW -e POSTGRES_DB=postgresDB -d apache/age
	```
	
	| Docker variables| Description |
	|--|--|
	| ``--name`` | Assign a name to the container |
	|	`-p` |	Publish a container’s port(s) to the host|
	|	``-e``|	Set environment variables|
	|	``-d``|	Run container in background and print container ID|
- To Get the running log of the docker container created - 
`` docker logs --follow myPostgresDb``
- To Get into postgreSQL Shell (There are two ways this can be done) -
	- First get into docker shell using -	`` docker exec -it myPostgresDb bash`` 
	<br>Then get into postgreSQL shell using - `` psql -U postgresUser postgresDB``
	
	OR
	
	- Alternatively postgres shell can also be assessed directly (without getting into the docker shell) -
		`` psql -U postgresUser -d postgresDB -p 5455 -h localhost``
		and put in ``postgresPW`` when prompted for password.
- After logging into postgreSQL shell follow the [Post-Installation](https://github.com/apache/age#post-installation) instruction to create a graph in the database.
### Login into the web-app using your credentials.

![image](https://github.com/AGEDB-INC/Cloud-Express/assets/95052507/50c5f2c9-8653-4fbf-8273-b420f5436e76)

### Connect Apache cloud-express to PostgreSQL Database
**Initial Connection Layout**
![image](https://github.com/AGEDB-INC/Cloud-Express/assets/95052507/5be2e953-b3df-42c6-94a7-c633850ba6c7)

To Connect to postgreSQL server running from Docker Container
- Connect URL - localhost
- Connect Port - 5455 
- Database Name - postgresDB
- User Name - postgresUser
- Password - postgresPW
> The following field is same as used to make the docker container specified above as flags.

### Now you can create project for yourself or choose from predefined Projects.
![image](https://github.com/AGEDB-INC/Cloud-Express/assets/95052507/6b9866c5-2277-4e1a-a12e-70e367125ecc)

### After that you can go to the AGcloud dashboard and play around with your project
# License

Cloud express is also licensed under the Apache License, Version 2.0 same as Apache AGE Viewer. See LICENSE for the full license text.
