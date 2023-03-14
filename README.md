<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=19suoXiPVp0ttdJkcJqrVCmrWRHfal9dS" alt="Iapp-logo" width="700" />

  <p align="center">The open source RESTful API Point Of Sales</p>
</p>

---

## Features

- Create User without Role management
- Authentication and Authorization
- Category Management
  - Create Category
  - Get Categories
  - Get Category by ID which contains Products
  - Update Category
  - Delete Category
- Product Management
  - Create Product without Image
  - Get Products with Pagination
  - Get Product by ID
  - Update Product
  - Delete Product
- Orders
  - Create Order
  - Get Orders with Pagination
  - Get Order by ID

## Tech Stack

![](https://img.shields.io/badge/Node.js-19.2.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/npm-8.19.3-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![](https://img.shields.io/badge/PostgreSQL-14.6-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![](https://img.shields.io/badge/JWT-3.1.0-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![](https://img.shields.io/badge/Hapi.js-21.2.0-f59042?style=for-the-badge)

## Documentation

### Instalation in local

Clone this repository in your local directory

```sh
git clone https://github.com/afustrator/iapp-api.git
```

Next, go to the directory `iapp-api` and install all dependencies using `npm`.

```sh
cd iapp-api
npm install
```

Set up the `.env` file by following the code below.

```sh
NODE_ENV=development

# Server Configuration
HOST=localhost
PORT=5000

# Node Postgre Configuration
PGUSER= # Add local postgre username
PGPASSWORD= # Add local postgre password
PGDATABASE= # Add local postgre database
PGHOST= # Add local postgre host
PGPORT= # Add local postgre port

# JWT Token
ACCESS_TOKEN_KEY= # Add with a random string or whatever it is
REFRESH_TOKEN_KEY= # Add with a random string or whatever it is
ACCESS_TOKEN_AGE= # Add with number
```

After you setup the database and environment variable, run the migration table.

```sh
npm run migrate up
```

Run the server and it was ready to use at `http://localhost:5000`.

```
npm run dev
```

### API Documentation

Soon
