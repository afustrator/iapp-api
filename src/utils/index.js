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

const mapOrderDBToModel = ({ id, cashier, invoice, name, address, phone }) => ({
  id,
  cashier,
  invoice,
  customerName: name,
  customerAddress: address,
  customerPhone: phone
})

const mapOrderItemsDBToModel = ({
  id,
  barcode,
  name,
  expire_date,
  quantity,
  price,
  sub_total
}) => ({
  id,
  barcode,
  produkName: name,
  expireDate: expire_date,
  quantity,
  price,
  subTotal: sub_total
})

module.exports = {
  mapCategoryDBToModel,
  mapProductsDBToModel,
  mapProductDBToModel,
  mapOrderDBToModel,
  mapOrderItemsDBToModel
}
