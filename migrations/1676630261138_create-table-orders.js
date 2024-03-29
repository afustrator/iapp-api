exports.up = pgm => {
	pgm.createTable('orders', {
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
		name: {
			type: 'VARCHAR(100)',
			notNull: true
		},
		address: {
			type: 'TEXT',
			notNull: true
		},
		phone: {
			type: 'BIGINT'
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

	pgm.addConstraint(
		'orders',
		'fk_orders.user_id_users.id',
		'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
	)
}

exports.down = pgm => {
	pgm.dropTable('orders')
}
