exports.up = pgm => {
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
			type: 'TIMESTAMPTZ',
			notNull: true,
			default: pgm.func('current_timestamp')
		},
		updated_at: {
			type: 'TIMESTAMPTZ',
			notNull: true,
			default: pgm.func('current_timestamp')
		}
	})
}

exports.down = pgm => {
	pgm.dropTable('categories')
}
