import { faker } from '@faker-js/faker';
import { PrescriptionStatusType, PrismaClient } from '@prisma/client';

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

async function prescriptionSeeder() {
  console.log(`🚀 start prescription seeder`);

  const prescriptions = [];
  for (let i = 1; i <= 50; i++) {
    const prescription = {
      patientName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      clinicName: `${faker.science
        .chemicalElement()
        .name.toUpperCase()} CLINIC`,
      doctorName: `Dr. ${faker.person.firstName()} ${faker.person.lastName()} S.Ked`,
      totalPrice: 500000,
      status: PrescriptionStatusType.Created,
      userID: faker.helpers.rangeToNumber({ min: 1, max: 15 }),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };

    prescriptions.push(prescription);
  }

  return await prisma.prescription.createMany({ data: prescriptions });
}

async function prescriptionDetailSeeder() {
  console.log(`🚀 start prescription detail seeder`);

  let no = 1;
  const prescriptionDetails = [];
  for (let i = 1; i < 50; i++) {
    // const maxDetail = faker.helpers.rangeToNumber({ min: 3, max: 5 });
    // for (let j = 1; j <= maxDetail; j++) {
    const prescriptionDetail = {
      id: no,
      prescriptionID: i,
      productID: i + 10,
      qty: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      name: '-',
      originalPrice: parseInt(faker.commerce.price({ min: 5000, max: 100000 })),
      priceConfig: faker.number.int({ min: 1, max: 2 }),
      includingTaxes: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    };

    prescriptionDetails.push(prescriptionDetail);
    no++;
    // }
  }

  return await prisma.prescriptionDetail.createMany({
    data: prescriptionDetails,
  });
}

async function main() {
  userSeeder();
  productSeeder();
  // prescriptionSeeder();
  // prescriptionDetailSeeder();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
