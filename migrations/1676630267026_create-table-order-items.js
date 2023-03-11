exports.up = pgm => {
	pgm.createTable('order_items', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
			notNull: true
		},
		order_id: {
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
		'order_items',
		'fk_order_items.order_id_orders.id',
		'FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE'
	)

	pgm.addConstraint(
		'order_items',
		'fk_order_items.product_id_products.id',
		'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE'
	)
}

exports.down = pgm => {
	pgm.dropTable('order_items')
}
