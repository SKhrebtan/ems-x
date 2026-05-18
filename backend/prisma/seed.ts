import { PrismaClient, EventCategory } from '@prisma/client';

const prisma = new PrismaClient();

const demoEvents = [
  {
    title: 'Dublin Tech Summit 2026',
    description:
      'Annual gathering of software engineers and product leaders across Ireland. Talks on AI, cloud-native, and developer experience.',
    date: new Date('2026-06-15T09:00:00Z'),
    location: 'Convention Centre Dublin, Spencer Dock, Dublin 1',
    latitude: 53.3478,
    longitude: -6.2418,
    category: EventCategory.CONFERENCE,
  },
  {
    title: 'NextJS & React Workshop',
    description:
      'Hands-on workshop covering App Router, Server Components, and Server Actions. Bring a laptop with Node 20 installed.',
    date: new Date('2026-06-22T13:00:00Z'),
    location: 'Dogpatch Labs, CHQ Building, Custom House Quay, Dublin 1',
    latitude: 53.3479,
    longitude: -6.2495,
    category: EventCategory.WORKSHOP,
  },
  {
    title: 'Galway Indie Game Devs Meetup',
    description:
      'Monthly meetup for hobbyist and indie game developers. Show-and-tell, networking, and pizza.',
    date: new Date('2026-06-05T18:30:00Z'),
    location: 'PorterShed, Eyre Square, Galway',
    latitude: 53.2741,
    longitude: -9.0493,
    category: EventCategory.MEETUP,
  },
  {
    title: 'Electric Picnic 2026',
    description:
      'Three-day music and arts festival featuring international and Irish acts across multiple stages.',
    date: new Date('2026-09-04T15:00:00Z'),
    location: 'Stradbally Hall Estate, Co. Laois',
    latitude: 52.9966,
    longitude: -7.1474,
    category: EventCategory.CONCERT,
  },
  {
    title: 'All-Ireland Football Final',
    description:
      'Climax of the GAA football season at Croke Park. Always a sell-out, expect a packed atmosphere.',
    date: new Date('2026-07-26T15:30:00Z'),
    location: "Croke Park, Jones' Road, Drumcondra, Dublin 3",
    latitude: 53.3607,
    longitude: -6.2511,
    category: EventCategory.SPORTS,
  },
  {
    title: 'Modern Irish Painters Exhibition',
    description:
      'Curated retrospective of post-2000 Irish painters at the National Gallery. Free entry, runs all summer.',
    date: new Date('2026-06-01T10:00:00Z'),
    location: 'National Gallery of Ireland, Merrion Square West, Dublin 2',
    latitude: 53.3408,
    longitude: -6.2519,
    category: EventCategory.EXHIBITION,
  },
  {
    title: 'Cork Startup Pitch Night',
    description:
      'Monthly demo evening where early-stage startups pitch to a panel of investors and the audience.',
    date: new Date('2026-06-18T18:00:00Z'),
    location: 'Republic of Work, South Mall, Cork',
    latitude: 51.8979,
    longitude: -8.4707,
    category: EventCategory.MEETUP,
  },
  {
    title: 'Belfast AI Conference',
    description:
      'One-day conference focused on applied machine learning, MLOps, and responsible AI in industry.',
    date: new Date('2026-06-12T09:30:00Z'),
    location: 'ICC Belfast, 2 Lanyon Place, Belfast',
    latitude: 54.5996,
    longitude: -5.9197,
    category: EventCategory.CONFERENCE,
  },
  {
    title: 'Limerick Trail Running Cup',
    description:
      'Off-road 10K through Curragh Chase. All abilities welcome, chip-timed, post-race refreshments.',
    date: new Date('2026-07-04T10:00:00Z'),
    location: 'Curragh Chase Forest Park, Kilcornan, Co. Limerick',
    latitude: 52.6164,
    longitude: -8.8003,
    category: EventCategory.SPORTS,
  },
  {
    title: 'TypeScript Patterns Workshop',
    description:
      'Deep-dive workshop on advanced TypeScript: conditional types, template literals, and type-safe APIs.',
    date: new Date('2026-06-29T13:00:00Z'),
    location: 'Huckletree D2, Pearse Street, Dublin 2',
    latitude: 53.3437,
    longitude: -6.2517,
    category: EventCategory.WORKSHOP,
  },
];

async function main() {
  console.log('Seeding database...');
  await prisma.event.deleteMany();
  for (const ev of demoEvents) {
    await prisma.event.create({ data: ev });
  }
  console.log(`Seeded ${demoEvents.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
