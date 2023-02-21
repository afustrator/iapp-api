exports.up = (pgm) => {
  pgm.createTable(
    'products',
    {
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
    },
    {
      constraint: {
        foreignKeys: [
          {
            references: 'categories(id)',
            columns: 'category_id',
            onDelete: 'CASCADE'
          }
        ]
      }
    }
  )

  pgm.createTable(
    'stocks',
    {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
        notNull: true
      },
      product_id: {
        type: 'VARCHAR(50)',
        notNull: true
      },
      stock: {
        type: 'INTEGER',
        notNull: false
      },
      sale: {
        type: 'INTEGER',
        notNull: false
      },
      created_at: {
        type: 'BIGINT',
        notNull: true
      },
      updated_at: {
        type: 'BIGINT',
        notNull: true
      }
    },
    {
      constraint: {
        foreignKeys: [
          {
            references: 'products(id)',
            columns: 'product_id',
            onDelete: 'CASCADE'
          }
        ]
      }
    }
  )
}

exports.down = (pgm) => {
  pgm.dropTable('products')
  pgm.dropTable('stocks')
}
