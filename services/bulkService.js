const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const { Product } = require('../models/index');

/**
 * Export all products to a CSV string.
 */
const exportProductsToCSV = async () => {
  const products = await Product.findAll({ raw: true });
  
  if (products.length === 0) return '';

  const fields = [
    'id', 'name', 'description', 'price', 'compare_price', 
    'category_id', 'sku', 'barcode', 'quantity', 'low_stock_threshold', 
    'is_active', 'is_featured'
  ];
  
  const json2csvParser = new Parser({ fields });
  return json2csvParser.parse(products);
};

/**
 * Import products from a CSV file path.
 * Supports creating new products or updating existing ones by SKU.
 */
const importProductsFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          const summary = { created: 0, updated: 0, errors: 0 };
          
          for (const row of results) {
            try {
              // Basic mapping and validation
              const productData = {
                name: row.name,
                description: row.description,
                price: parseFloat(row.price) || 0,
                compare_price: parseFloat(row.compare_price) || null,
                category_id: parseInt(row.category_id) || 1,
                sku: row.sku,
                barcode: row.barcode,
                quantity: parseInt(row.quantity) || 0,
                low_stock_threshold: parseInt(row.low_stock_threshold) || 5,
                is_active: row.is_active === 'true' || row.is_active === '1',
                is_featured: row.is_featured === 'true' || row.is_featured === '1'
              };

              if (row.sku) {
                const [product, created] = await Product.findOrCreate({
                  where: { sku: row.sku },
                  defaults: productData
                });

                if (created) {
                  summary.created++;
                } else {
                  await product.update(productData);
                  summary.updated++;
                }
              } else {
                summary.errors++;
              }
            } catch (err) {
              summary.errors++;
            }
          }
          resolve(summary);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => reject(error));
  });
};

module.exports = {
  exportProductsToCSV,
  importProductsFromCSV
};
