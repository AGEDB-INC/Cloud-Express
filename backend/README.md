# AGViewer Backend

### UPDATES

- Sequelize is used for defining our database schemas and creating new APIs. Sequelize is a  Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

## STEPS TO RUN BACKEND MYSQL SERVER

- Run `npm install` to install all the node_module dependencies.

### SETTING UP MYSQL DATABASE WITH SEQUELIZE 

    - In the `backend/config/config.js` file, add your database credentials to connect with: 

    ```
        "username": "your_userName",
        "password": "your_password",
        "database": "database_to_connect_to",
        "host": "localhost",
        "dialect": "mysql"
    ```

### .ENV File
    -Create a `.env` file in the `backend` directory and add the following fields in it: 
    ```
        PORT = port_number (example: 3000) 
        SECRET_KEY=your_secret_key_here     // Secret key for JsonWebToken(Jwt) 
    ```
    