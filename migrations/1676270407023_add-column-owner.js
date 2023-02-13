exports.up = (pgm) => {
  pgm.addColumn('category', {
    owner: {
      type: 'VARCHAR(50)'
    }
  })

  pgm.addColumn('products', {
    owner: {
      type: 'VARCHAR(50)'
    }
  })
}

exports.down = (pgm) => {
  pgm.dropColumn('category', 'owner')
  pgm.dropColumn('products', 'owner')
}
