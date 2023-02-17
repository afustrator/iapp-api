exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    checkout_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    product_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    quantity: {
      type: 'INTEGER',
      notNull: true
    },
    price: {
      type: 'INTEGER',
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
    'orders',
    'fk_orders.checkout_id_checkouts.id',
    'FOREIGN KEY(checkout_id) REFERENCES checkouts(id) ON DELETE CASCADE'
  )

  pgm.addConstraint(
    'orders',
    'fk_orders.product_id_products.id',
    'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropTable('orders')
}
