const PDFDocument = require('pdfkit-table');
const { Product } = require('../models/index');

/**
 * Generate a PDF report of the product inventory.
 * @returns {Promise<Buffer>}
 */
const generateProductInventoryPDF = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await Product.findAll({
        attributes: ['name', 'sku', 'price', 'quantity', 'low_stock_threshold'],
        order: [['name', 'ASC']]
      });

      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Add Title
      doc.fontSize(20).text('Product Inventory Report', { align: 'center' });
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Define Table
      const table = {
        title: "Current Stock Levels",
        subtitle: "Highlighting items that require reordering",
        headers: [
          { label: "Product Name", property: 'name', width: 200 },
          { label: "SKU", property: 'sku', width: 100 },
          { label: "Price", property: 'price', width: 70 },
          { label: "Stock", property: 'quantity', width: 70 },
          { label: "Alert", property: 'alert', width: 60 },
        ],
        datas: products.map(p => ({
          name: p.name,
          sku: p.sku,
          price: `$${parseFloat(p.price).toFixed(2)}`,
          quantity: p.quantity.toString(),
          alert: p.quantity <= p.low_stock_threshold ? "LOW" : "-",
          options: {
            columnColor: p.quantity <= p.low_stock_threshold ? "#FFEEEE" : null
          }
        })),
        rows: [] // Required by pdfkit-table if using datas
      };

      // Draw table
      await doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          doc.font("Helvetica").fontSize(9);
          // Highlight low stock rows in red
          if (row.alert === "LOW") {
            doc.addBackground(rectRow, 'red', 0.1);
          }
        },
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateProductInventoryPDF
};
