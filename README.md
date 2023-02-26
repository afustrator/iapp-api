<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=1AqgKUhcUhh_AdOs1nfkgGC0N9kejly0k" alt="Iapp-logo" height="280" />

  <p align="center">The open source RESTful API Point Of Sales</p>
</p>

---

## Features

- Create User without Role management
- Authentication and Authorization
- Category Management
  - Create Category
  - Get Categories
  - Get Category by ID with Product List
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

Set up `.env` file by copying `.env.example` file.

```sh
cp .env.example .env
```

After you setup the database, run the migration table.

```sh
npm run migrate up
```

Run the server and it was ready to use at `http://localhost:3000`.

```
npm run dev
```

### API Documentation

Soon
