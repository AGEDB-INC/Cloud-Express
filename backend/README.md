# AGViewer Backend
There are two separate backend servers for Cloud-Express project. One server is used to communicate with local postgres database. This server runs automatically via a script when you run `npm run start`.
The second server is an online MongoDB server used for Login/SignUp and other User and Project related opearations and functionalities. 

## STEPS TO RUN Backend MongoDB SERVER
### 1. Create a .env File
    -Create a `.env` file in the `backend` directory and add the following fields in it: 
    ```
    PORT = 4000
    SECRET_KEY = ApacheAgeViewer
    MONGO_URI = mongodb+srv://safi50:cloudExpress@cloud-express.le2yrog.mongodb.net/cloud-express-users?retryWrites=true&w=majority
    ```
    - Secret Key is used to encrypt JWT Token
    - MONGO_URI contains the string to connect to our online Database cluster. It will be replaced with an official production string once development is complete.

### 2. Run the MongoDB server in a new terminal
```
    cd backend
    npm install     // to install node_module dependencies if you haven't already
    node index    // to run the backend mongodb server
```


