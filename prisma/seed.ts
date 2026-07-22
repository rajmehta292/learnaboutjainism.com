import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database: Full-Stack Jainism Platform...')

  // 1. Seed Ghatiya Karmas (Destructive)
  const jnanaAvaraniya = await prisma.karmaCategory.upsert({
    where: { id: 'jnana-avaraniya' },
    update: {},
    create: {
      id: 'jnana-avaraniya',
      name: 'Knowledge-Obscuring Karma',
      transliteration: 'Jnanavaraniya',
      type: 'Ghatiya',
      descriptionL1: 'This karma hides our soul\'s natural ability to know everything, like a blindfold over our eyes.',
      descriptionL3: 'Jnanavaraniya karma obscures the soul\'s inherent attribute of infinite knowledge (Ananta Jnana). It is bound by disrespecting knowledge or those who possess it.',
      descriptionL5: 'According to the Tattvartha Sutra (8.6), Jnanavaraniya is the first of the 8 primary karmas. It has 5 sub-types (prakritis) corresponding to the five types of knowledge: Mati (sensory), Shruta (scriptural), Avadhi (clairvoyance), Manahparyaya (telepathy), and Kevala (omniscience).',
      subtypes: {
        create: [
          { id: 'mati-jnana-avaraniya', name: 'Sensory Knowledge Obscuring', description: 'Obscures knowledge gained through the five senses and mind.' },
          { id: 'shruta-jnana-avaraniya', name: 'Scriptural Knowledge Obscuring', description: 'Obscures knowledge gained through words, signs, and scriptures.' }
        ]
      },
      citations: {
        create: [
          { citationText: 'Tattvartha Sutra, Chapter 8, Verse 6', confidenceLevel: 'Verified', url: 'https://jainworld.com/scriptures/tattvartha-sutra/' }
        ]
      }
    }
  })

  const darshanaAvaraniya = await prisma.karmaCategory.upsert({
    where: { id: 'darshana-avaraniya' },
    update: {},
    create: {
      id: 'darshana-avaraniya',
      name: 'Perception-Obscuring Karma',
      transliteration: 'Darshanavaraniya',
      type: 'Ghatiya',
      descriptionL1: 'This karma prevents us from perceiving things clearly, like a guard at the door who doesn\'t let you see who is outside.',
      descriptionL3: 'Darshanavaraniya karma obscures the soul\'s inherent attribute of infinite perception (Ananta Darshana). It affects general awareness before detailed knowledge occurs.',
      descriptionL5: 'The Tattvartha Sutra (8.7) details 9 subtypes of this karma, including four related to perception (visual, non-visual, clairvoyant, omniscient) and five related to sleep (light sleep, deep sleep, somnambulism, etc).',
      subtypes: {
        create: [
          { id: 'chakshu-darshana-avaraniya', name: 'Visual Perception Obscuring', description: 'Obscures perception through the eyes.' },
          { id: 'nidra-nidra', name: 'Deep Sleep', description: 'A state of intense slumber that obscures awareness.' }
        ]
      },
      citations: {
        create: [
          { citationText: 'Tattvartha Sutra, Chapter 8, Verse 7', confidenceLevel: 'Verified' }
        ]
      }
    }
  })

  // Add more as needed for the vertical slice
  
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
