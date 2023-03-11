exports.up = pgm => {
	pgm.createTable(
		'products',
		{
			id: {
				type: 'VARCHAR(50)',
				primaryKey: true,
				notNull: true
			},
			barcode: {
				type: 'VARCHAR(255)',
				notNull: true
			},
			name: {
				type: 'VARCHAR(255)',
				notNull: true
			},
			price: {
				type: 'INTEGER',
				notNull: true
			},
			category_id: {
				type: 'VARCHAR(50)'
			},
			expire_date: {
				type: 'TIMESTAMPTZ',
				notNull: true
			},
			input_date: {
				type: 'TIMESTAMPTZ',
				notNull: true,
				default: pgm.func('current_timestamp')
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
		},
		{
			constraint: {
				foreignKeys: [
					{
						references: 'categories(id)',
						columns: 'category_id',
						onDelete: 'CASCADE'
					}
				]
			}
		}
	)

	pgm.createTable(
		'stocks',
		{
			id: {
				type: 'VARCHAR(50)',
				primaryKey: true,
				notNull: true
			},
			product_id: {
				type: 'VARCHAR(50)',
				notNull: true
			},
			stock: {
				type: 'INTEGER',
				notNull: false
			},
			sale: {
				type: 'INTEGER',
				notNull: false
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
		},
		{
			constraint: {
				foreignKeys: [
					{
						references: 'products(id)',
						columns: 'product_id',
						onDelete: 'CASCADE'
					}
				]
			}
		}
	)
}

exports.down = pgm => {
	pgm.dropTable('products')
	pgm.dropTable('stocks')
}
