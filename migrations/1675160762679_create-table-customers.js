exports.up = (pgm) => {
  pgm.createTable('customers', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    customer_name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    address: {
      type: 'TEXT'
    },
    phone_number: {
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
}

exports.down = (pgm) => {
  pgm.dropTable('customers')
}
