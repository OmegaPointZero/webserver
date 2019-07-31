# Simple Web Server

This is just a simple web server for a customer-facing website for a web app development firm. It runs with Node.js, Express.js and MySQL as opposed to MongoDB. 

# Before Running

There needs to be a .env file, with the following variables:

PORT=port number to run the node app on
SQLHOST=host where the sql database is hosted
SQLUSER=user of the sql database
SQLPASS=password for sqldb user
SQLDB=name of the sql database
ADMINROUTE=route (ie, '/admin') for the admins to access the admin page
LOGINROUTE=route (ie, '/login') for admins to login
REGROUTE=route (ie, '/register') to register new admins (route commented out in routes.js by default)
SESSION_SECRET= Some session secret
