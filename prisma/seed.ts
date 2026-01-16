import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'PhD', color: '#4F46E5', isDefault: true },
  { name: 'Math', color: '#059669', isDefault: true },
  { name: 'Programming', color: '#EA580C', isDefault: true },
  { name: 'Outschool Content', color: '#7C3AED', isDefault: true },
];

async function main() {
  console.log('Seeding default categories...');

  for (const category of defaultCategories) {
    // Check if default category already exists (userId is null)
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        userId: null,
        isDefault: true,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          color: category.color,
          isDefault: category.isDefault,
          userId: null,
        },
      });
      console.log(`  ✓ Created ${category.name}`);
    } else {
      console.log(`  - ${category.name} already exists`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
