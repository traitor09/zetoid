import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Zetoid database...');

  // Clear existing tasks
  await prisma.task.deleteMany({});

  const sampleTasks = [
    {
      title: 'Review project architecture and AI pipeline setup',
      priority: 1,
      tags: JSON.stringify(['dev', 'architecture']),
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      done: false,
    },
    {
      title: 'Call team sync about natural language task feature',
      priority: 1,
      tags: JSON.stringify(['meeting', 'urgent']),
      dueDate: new Date(), // Today
      done: false,
    },
    {
      title: 'Buy groceries for the week (fruits, oats, coffee)',
      priority: 3,
      tags: JSON.stringify(['personal', 'shopping']),
      dueDate: new Date(Date.now() + 172800000), // In 2 days
      done: false,
    },
    {
      title: 'Read Next.js 15 Server Actions best practices',
      priority: 3,
      tags: JSON.stringify(['learning']),
      dueDate: null,
      done: true,
    },
    {
      title: 'Schedule dentist checkup for next month',
      priority: 5,
      tags: JSON.stringify(['health']),
      dueDate: null,
      done: false,
    },
  ];

  for (const task of sampleTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('Database seeded successfully with sample tasks!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
