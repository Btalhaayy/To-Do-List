# To Do List Application

## Features

* Add Tasks
* Edit Tasks
* Delete Tasks
* Mark as Complete
* Filter Tasks
* Calendar View
* List View

## Technologies

* **Frontend:** React, TypeScript, JavaScript, HTML, CSS 
* **Backend:** Node.js, Express.js 
* **Database:** MySQL 


## Installation

1. Clone the repository: `git clone https://github.com/Btalhaayy/To-Do-List.git`
2. `cd To-Do-List`
3. `cd src && npm install`
4. `cd server && npm install`
5. Create `server/.env` based on `server/.env.example` (not present in the repository, create it) and fill in your database credentials.
6. `cd server && npm run dev` (Backend - Port 5000 -  You'll need to confirm this or adjust based on your server setup)
7. `cd src && npm start` (Frontend - Port 3000 - Assumed based on typical React setup)

## Database Connection

**server/.env.example (Create this file):**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=[Database Password]
DB_NAME=todos'''
