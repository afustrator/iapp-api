/* eslint-disable camelcase */
const mapCategoryDBToModel = ({ id, name, created_at, updated_at }) => ({
  id,
  name,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapProductsDBToModel = ({
  id,
  product_code,
  product_name,
  brand,
  stock,
  capital_price,
  selling_price,
  discount,
  category_id,
  expire_date,
  input_date
}) => ({
  id,
  productCode: product_code,
  productName: product_name,
  brand,
  stock,
  capitalPrice: capital_price,
  sellingPrice: selling_price,
  discount,
  categoryId: category_id,
  expireDate: expire_date,
  inputDate: input_date
})

const mapProductDBToModel = ({
  id,
  product_code,
  product_name,
  brand,
  stock,
  capital_price,
  selling_price,
  discount,
  category_id,
  expire_date,
  input_date,
  created_at,
  updated_at
}) => ({
  id,
  productCode: product_code,
  productName: product_name,
  brand,
  stock,
  capitalPrice: capital_price,
  sellingPrice: selling_price,
  discount,
  categoryId: category_id,
  expireDate: expire_date,
  inputDate: input_date,
  createdAt: created_at,
  updatedAt: updated_at
})

const mapCustomerDBToModel = ({
  id,
  customer_name,
  address,
  phone_number,
  created_at,
  updated_at
}) => ({
  id,
  customerName: customer_name,
  address,
  phoneNumber: phone_number,
  createdAt: created_at,
  updatedAt: updated_at
})

module.exports = {
  mapCategoryDBToModel,
  mapProductsDBToModel,
  mapProductDBToModel,
  mapCustomerDBToModel
}
