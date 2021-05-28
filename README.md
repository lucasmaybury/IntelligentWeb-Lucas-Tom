# COM3504 Intelligent Web Assignemnt

# Startup Instructions

## Devlopment
For regular use:
run `node ./bin/www` in `Project/central/` and `Project/db/`   
The API runs on `localhost:3000`  
The Database runs on `localhost:3001`  

During development, [Nodemon](https://www.npmjs.com/package/nodemon) is used to update live, after changes are made:
run `npm run dev` in `Project/central/` and `Project/db/`   
The API runs on `localhost:3000`  
The Database runs on `localhost:3001`  

## Production
run `npm run start` in `Project/central/` and `Project/db/`

# Authors:
Lucas Maybury lmaybury1@sheffield.ac.uk  
Thomas Eso teso1@sheffield.ac.uk

# Work Split
Thomas: socket.io, service worker, the chat/annotation interface  
Lucas: nodeJS server (excluding socket.io), IndexedDb, MongoDB
