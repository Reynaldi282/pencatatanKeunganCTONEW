import { PrismaClient, CategoryType } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  { name: 'Salary', type: CategoryType.INCOME, description: 'Wages, salaries, and paychecks' },
  { name: 'Bonus', type: CategoryType.INCOME, description: 'Bonuses and performance incentives' },
  { name: 'Interest', type: CategoryType.INCOME, description: 'Interest income from savings or investments' },
  { name: 'Investments', type: CategoryType.INCOME, description: 'Investment gains and dividends' },
  { name: 'Gifts Received', type: CategoryType.INCOME, description: 'Gifts and windfalls received' },
  { name: 'Other Income', type: CategoryType.INCOME, description: 'Miscellaneous income sources' },
  { name: 'Rent or Mortgage', type: CategoryType.EXPENSE, description: 'Housing payments' },
  { name: 'Utilities', type: CategoryType.EXPENSE, description: 'Electricity, water, gas, and similar services' },
  { name: 'Groceries', type: CategoryType.EXPENSE, description: 'Food and household essentials' },
  { name: 'Transportation', type: CategoryType.EXPENSE, description: 'Public transit, fuel, ride sharing, and parking' },
  { name: 'Entertainment', type: CategoryType.EXPENSE, description: 'Movies, concerts, subscriptions, and leisure' },
  { name: 'Healthcare', type: CategoryType.EXPENSE, description: 'Medical, dental, and pharmacy expenses' },
  { name: 'Insurance', type: CategoryType.EXPENSE, description: 'Home, auto, and other insurance premiums' },
  { name: 'Education', type: CategoryType.EXPENSE, description: 'Education and training costs' },
  { name: 'Dining Out', type: CategoryType.EXPENSE, description: 'Restaurants, cafes, and takeout' },
  { name: 'Savings', type: CategoryType.EXPENSE, description: 'Contributions to savings or investments' },
];

async function main() {
  await prisma.category.createMany({
    data: defaultCategories,
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
