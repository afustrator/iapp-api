exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    product_code: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    product_name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    brand: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    stock: {
      type: 'INTEGER',
      notNull: true
    },
    capital_price: {
      type: 'INTEGER',
      notNull: true
    },
    selling_price: {
      type: 'INTEGER',
      notNull: true
    },
    discount: {
      type: 'SMALLINT'
    },
    category_id: {
      type: 'VARCHAR(50)'
    },
    expire_date: {
      type: 'BIGINT',
      notNull: true
    },
    input_date: {
      type: 'BIGINT',
      notNull: true
    },
    created_at: {
      type: 'BIGINT',
      notNull: true
    },
    updated_at: {
      type: 'BIGINT',
      notNull: true
    }
  })

  pgm.addConstraint(
    'products',
    'fk_products.category_id_category.id',
    'FOREIGN KEY(category_id) REFERENCES category(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropTable('products')
}
