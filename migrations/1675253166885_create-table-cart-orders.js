exports.up = (pgm) => {
  pgm.createTable('cart', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    product_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    qty: {
      type: 'INTEGER',
      notNull: true
    },
    order_date: {
      type: 'BIGINT',
      notNull: true
    }
  })

  pgm.addConstraint(
    'cart_orders',
    'fk_cart_orders.product_id_products.id',
    'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropTable('cart_orders')
}
