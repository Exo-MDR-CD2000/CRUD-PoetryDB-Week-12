# PoetryDB CRUD App
CRUD Project (without the update) using PoetryDB
## Description

The focus was on using API's to fetch for data, displaying data, deleting data, etc. The PoetryDB API was used in an attempt to display various poems from the PoetryDB database onto the page. The page can read poems from PoetryDB, save poems from the PoetryDB database, and be deleted from the local database. Users can also create poems and have them saved to the local databse. Json-server package as used to simulate a local backend without actually creating an entire back-end. 

The only issue that's noticeable is that the page refreshes upon saving a poem or deleting a poem. It's most likely the way the code is written or a lack of understanding the json-server package. Otherwise, the page works. Below are the instructions to install a local project repository. This also assumes that json-server is installed globally on your machine.

## Usage

To get a local copy up and running follow these simple steps:

1. **Clone the repo (SSH Method Below)**
    ```sh
    git clone git@github.com:Exo-MDR-CD2000/api-project-week-12.git
    ```
2. **Navigate to the project directory**
    ```sh
    cd api-project-week-12
    ```
3. **Install NPM packages**
    ```sh
    npm install
    ```
4. **Use VS Code Live Server**
    ```sh
    Open with live server
    ```
5. **Have another terminal window open for local db**
    ```sh
    Run this command to start local db: json-server --watch db/db.json
    The above command should be run inside the project repository.
    ```
6. **Test the page in your web browser**


## Link(s)

- Promineo Videos and Independent Research
- [Github Repo](https://github.com/Exo-MDR-CD2000/api-project-week-12)
- [Json-server docs](https://www.npmjs.com/package/json-server)
- [FreeCodeCamp: json-server tutorial](https://www.freecodecamp.org/news/json-server-for-frontend-development/)
- [PoetryDB Docs](https://poetrydb.org/index.html)