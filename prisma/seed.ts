import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function userSeeder() {
  console.log(`🚀 start user seeder`);

  // default password: qweasd123
  const defaultPassword =
    '$2b$10$wLFWjswgw/hl75ukavSRlOMdrJvT9shNXelIX//OoKlnkpbTNcD9m';

  // user sample for demo purpose
  const users = [
    {
      name: 'ADMIN',
      email: 'admin@test.com',
      password: defaultPassword,
    },
  ];

  for (let i = 2; i <= 15; i++) {
    const user = {
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      email: faker.internet.email().toLowerCase(),
      password: defaultPassword,
    };

    users.push(user);
  }

  return await prisma.user.createMany({ data: users });
}

async function productSeeder() {
  console.log(`🚀 start product seeder`);

  const products = [];
  for (let i = 1; i <= 100; i++) {
    const product = {
      name: `${faker.science
        .chemicalElement()
        .name.toUpperCase()} ${faker.hacker
        .abbreviation()
        .toUpperCase()} ${faker.number.int(100)} ML`,
      sku: faker.finance.bic(),
      price: parseInt(faker.commerce.price({ min: 5000, max: 100000 })),
      stock: faker.number.int({ min: 5, max: 100 }),
      priceConfig: faker.number.int({ min: 1, max: 2 }),
      includingTaxes: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };

    products.push(product);
  }

  return await prisma.product.createMany({ data: products });
}

async function main() {
  userSeeder();
  productSeeder();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
