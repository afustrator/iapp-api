exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    barcode: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    stock: {
      type: 'INTEGER',
      notNull: true
    },
    price: {
      type: 'INTEGER',
      notNull: true
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
    owner: {
      type: 'VARCHAR(50)'
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
    'fk_products.category_id_categories.id',
    'FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropTable('products')
}
