exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true
    },
    username: {
      type: 'VARCHAR(255)',
      unique: true,
      notNull: true
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    fullname: {
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

exports.down = (pgm) => {}
