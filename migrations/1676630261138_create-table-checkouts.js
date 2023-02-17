exports.up = (pgm) => {
  pgm.createTable('checkouts', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)'
    },
    invoice: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    amount: {
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
    'checkouts',
    'fk_checkouts.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropTable('checkouts')
}
