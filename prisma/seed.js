// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Crea categorie
    const cat1 = await prisma.category.upsert({
        where: { slug: 'grandi-classici' },
        update: {},
        create: {
            name: 'Grandi classici',
            slug: 'grandi-classici',
        },
    });
    const cat2 = await prisma.category.upsert({
        where: { slug: 'nuova-collezione' },
        update: {},
        create: {
            name: 'Nuova collezione',
            slug: 'nuova-collezione',
        },
    });
    const cat3 = await prisma.category.upsert({
        where: { slug: 'piu-venduti' },
        update: {},
        create: {
            name: 'I più venduti',
            slug: 'piu-venduti',
        },
    });

    // Prodotti per “Grandi classici”
    await prisma.product.createMany({
        data: [
            {
                name: 'Vaso Ferrari',
                description: 'Ceramica tradizionale di alta qualità',
                price: 49.90,
                imageUrl: '/vasi/ferrari.jpg',
                categoryId: cat1.id,
            },
            {
                name: 'Vaso Leopardi',
                description: 'Design elegante ispirato alla natura',
                price: 59.50,
                imageUrl: '/vasi/leopardi.jpg',
                categoryId: cat1.id,
            },
            {
                name: 'Vaso Dante',
                description: 'Linee classiche e finiture pregiate',
                price: 39.00,
                imageUrl: '/vasi/dante.jpg',
                categoryId: cat1.id,
            },
        ],
    });

    // Prodotti per “Nuova collezione”
    await prisma.product.createMany({
        data: [
            {
                name: 'Vaso Moderno A',
                description: 'Forme geometriche audaci',
                price: 69.90,
                imageUrl: '/vasi/modernoa.jpg',
                categoryId: cat2.id,
            },
            {
                name: 'Vaso Moderno B',
                description: 'Colori vivaci e forme asimmetriche',
                price: 74.50,
                imageUrl: '/vasi/modernob.jpg',
                categoryId: cat2.id,
            },
            {
                name: 'Vaso Minimal',
                description: 'Essenziale e di tendenza',
                price: 54.00,
                imageUrl: '/vasi/minimal.jpg',
                categoryId: cat2.id,
            },
        ],
    });

    // Prodotti per “I più venduti”
    await prisma.product.createMany({
        data: [
            {
                name: 'Vaso Popolare 1',
                description: 'Il best seller di sempre',
                price: 45.00,
                imageUrl: '/vasi/pop1.jpg',
                categoryId: cat3.id,
            },
            {
                name: 'Vaso Popolare 2',
                description: 'Design amatissimo dai clienti',
                price: 52.75,
                imageUrl: '/vasi/pop2.jpg',
                categoryId: cat3.id,
            },
            {
                name: 'Vaso Popolare 3',
                description: 'Uno dei preferiti in offerta',
                price: 48.20,
                imageUrl: '/vasi/pop3.jpg',
                categoryId: cat3.id,
            },
        ],
    });

    console.log('✅ Seed eseguito con successo');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
