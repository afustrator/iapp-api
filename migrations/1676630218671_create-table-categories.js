exports.up = (pgm) => {
  pgm.createTable('categories', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    name: {
      type: 'VARCHAR(255)',
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
}

exports.down = (pgm) => {
  pgm.dropTable('categories')
}
