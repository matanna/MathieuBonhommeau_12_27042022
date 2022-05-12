# MathieuBonhommeau_12_27042022

## Project 12 OC - DA Javascript / React

----------------
### Project description

React Application for display a dashboard with graphics that are built with D3.js.

----------------
### Prerequisites

NodeJS >= 14

npm >= 6


----------------
### Installation

**Frontend App :** 

Clone the repo with this command in a terminal in the folder of your choice :

```git clone https://github.com/matanna/MathieuBonhommeau_12_27042022.git```

Go to the folder juste created and install dependencies :

```npm install```


**Backend API :**

Go to this repo and follow the instructions for install the project :

https://github.com/OpenClassrooms-Student-Center/P9-front-end-dashboard

---------------

### Start the application

**Solution 1 : With mock datas, without api**

In the frontend app, change the variable for ```ENV=test``` in ```/.env``` file and start the application with this command :

```npm start```

Then, the app works with mock datas.

**Solution 2 : With API**

First, start the backend application. 

After, in the frontend app, change the variable for ```ENV=prod``` in ```/.env``` file and start the application with this command :

```npm start```

Then, the app works with the api

----------------

### Dashboard page

The dashboard is visible at the following address : 

```/profil/${userId}```

There are only 2 users for the moment with ids 12 and 18

Exemple : 

    1. http://localhost:3001/profil/12
    2. http://localhost:3001/profil/18

---------------

### Documentation

The documentation is visible in ```/docs``` folder. Start the ```/docs/index.html``` in a browser and that's all
