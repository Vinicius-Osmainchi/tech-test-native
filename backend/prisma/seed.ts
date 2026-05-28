import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, "customers.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const customersData = JSON.parse(rawData);

  const uniqueCities = [...new Set(customersData.map((c: any) => c.city))];

  for (const cityName of uniqueCities) {
    await prisma.city.upsert({
      where: { name: cityName as string },
      update: {},
      create: { name: cityName as string },
    });
  }

  const citiesInDb = await prisma.city.findMany();
  const cityMap = new Map(citiesInDb.map((c) => [c.name, c.id]));

  for (const customer of customersData) {
    await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        gender: customer.gender,
        company: customer.company,
        title: customer.title,
        city_id: cityMap.get(customer.city) as number,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
