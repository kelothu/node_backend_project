const { sequelize, Category, Product, User } = require('../models/index');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // 1. Sync the models (don't force wipe unless you want to start fresh)
    await sequelize.sync({ force: false });
    console.log('--- Database Synced ---');

    // 2. Create Sample Categories
    const categories = await Category.bulkCreate([
      { name: 'Engine Components', description: 'Internal and external engine parts.', is_active: true },
      { name: 'Brake Systems', description: 'Pads, rotors, and calipers.', is_active: true },
      { name: 'Lighting & Electrical', description: 'Headlights, bulbs, and wiring.', is_active: true },
      { name: 'Tires & Wheels', description: 'Performance and standard sets.', is_active: true }
    ], { ignoreDuplicates: true });
    
    console.log(`--- ${categories.length} Categories Created ---`);

    // 3. Create Sample Products
    const engineCat = await Category.findOne({ where: { name: 'Engine Components' } });
    const brakeCat = await Category.findOne({ where: { name: 'Brake Systems' } });

    if (engineCat && brakeCat) {
      const products = await Product.bulkCreate([
        {
          name: 'V6 Turbocharger Kit',
          description: 'High-performance turbo kit for V6 engines.',
          price: 1299.99,
          sku: 'TRB-V6-001',
          category_id: engineCat.id,
          quantity: 15,
          is_featured: true,
          specifications: { boost: '15psi', material: 'Stainless Steel' }
        },
        {
          name: 'Ceramic Brake Pad Set',
          description: 'Low-dust, high-heat ceramic brake pads (Front & Rear).',
          price: 89.99,
          sku: 'BRK-CER-99',
          category_id: brakeCat.id,
          quantity: 50,
          is_featured: false,
          specifications: { material: 'Ceramic', heat_range: 'Up to 600C' }
        },
        {
            name: 'Synthetic Oil Filter',
            description: 'Long-life oil filter for synthetic oils.',
            price: 12.50,
            sku: 'OIL-FLT-SYN',
            category_id: engineCat.id,
            quantity: 100,
            is_featured: false
        }
      ], { ignoreDuplicates: true });

      console.log(`--- ${products.length} Products Created ---`);
    }

    // 4. Create a Default Admin (if it doesn't exist)
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '0000000000',
        role: 'admin'
      });
      console.log('--- Default Admin Created (admin@example.com / admin123) ---');
    }

    console.log('✅ Seeding Completed Successfully!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
  }
};

seedDatabase();
