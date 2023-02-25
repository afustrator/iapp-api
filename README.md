<p align="center">
  <img src="https://drive.google.com/uc?export=view&id=19suoXiPVp0ttdJkcJqrVCmrWRHfal9dS" alt="Iapp-logo" width="240" />

  <p align="center">The open source RESTful API Point Of Sales</p>
</p>

---

## Features

- Category Product Management
- Product Management
- Authentication and Authorization
- Add Order and Get Order
- Pagination in Product and Order

## Tech Stack

![](https://img.shields.io/badge/Node.js-19.2.0-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/npm-8.19.3-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![](https://img.shields.io/badge/PostgreSQL-14-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![](https://img.shields.io/badge/JWT-3.1.0-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## Documentation

### Instalation in local

Clone this repository in your local directory

```sh
git clone https://github.com/afustrator/iapp-api.git
```

Next, go to the directory `pos-hapi-postgre` and install all dependencies using
`npm`.

```sh
cd pos-hapi-postgre
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

Run the server and it was ready to use at `http://localhost:3001`.

```
npm run dev
```
