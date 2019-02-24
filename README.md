# kiam
Kavalus Identity and Access Management

### Steps to configure and Start the KIAM on your local machine

####   start each step in seperate commandLine window !

1.  **cd to Mongo Bin folder** _port:27017_ <br>
    `|==> ./mongod --dbpath path/to/the/db/folder-of-the-project --auth`
2.  **cd to engine** _port:4300_ <br> 
    `|==> npm install` <br>
    `|==> npm start` 
3.  **cd to codeBase/server** _port:3000_<br>
    `|==> npm install` <br>
    `|==> npm start`  
4.  **cd to codeBase/angular-src** _port:4200_ <br>
    `|==> npm install` <br>
    `|==> ng serve`
5.  **open Browser with address http://localhost:4200/** <br>
    default  : `username: admin` , `password:admin123`.


### Steps to access multifactor Protected Resource
1.  **cd to Mongo Bin folder** _port:27017_ <br>
    `|==> ./mongod --dbpath path/to/the/db/folder-of-the-project `
2.  **cd to /codeBase/am_engine** _port:4000_ 
    `|==> npm install` 
    `|==> node app.js` 
3.  **cd to /codeBase/node_proxy_last** _port:3000_ 
    `|==> npm install` 
    `|==> node server.js` 

