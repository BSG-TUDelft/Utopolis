Utopolis server
===============

This is a simple RESTful webservice for the Utopolis game.

Building / running
------------------
You need to have maven installed and a MySQL database running.
To build the server run the following in the server root folder:

```
mvn clean install
```

To run the server locally run:

```
mvn exec:java
```

The API WADL description is exposed at:

```
http://localhost:8080/api/application.wadl
```

![alt tag](http://www.catb.org/hacker-emblem/hacker.png)
