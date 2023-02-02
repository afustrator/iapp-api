exports.up = (pgm) => {
  pgm.createTable('category', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    name: {
      type: 'VARCHAR(255)',
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
  pgm.dropTable('category')
}
