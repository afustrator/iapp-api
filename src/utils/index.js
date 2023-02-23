/* eslint-disable camelcase */
const mapCategoryDBToModel = ({ id, name, owner, created_at, updated_at }) => ({
  id,
  name,
  owner,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapProductsDBToModel = ({
  id,
  name,
  stock,
  price,
  category_id,
  expire_date,
  input_date,
  created_at,
  updated_at
}) => ({
  id,
  name,
  stock,
  price,
  categoryId: category_id,
  expireDate: expire_date,
  inputDate: input_date,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapProductDBToModel = ({
  id,
  name,
  stock,
  price,
  category_id,
  expire_date,
  input_date
}) => ({
  id,
  name,
  stock,
  price,
  categoryId: category_id,
  expireDate: expire_date,
  inputDate: input_date
})

module.exports = {
  mapCategoryDBToModel,
  mapProductsDBToModel,
  mapProductDBToModel
}
