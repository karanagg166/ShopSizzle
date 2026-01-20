import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const categories = [
    { name: "Men", keywords: ["men", "clothing", "fashion"] },
    { name: "Women", keywords: ["women", "dress", "fashion"] },
    { name: "Kids", keywords: ["kids", "clothing", "happy"] },
    { name: "Accessories", keywords: ["watch", "glasses", "bag", "accessory"] },
    { name: "Shoes", keywords: ["shoes", "sneakers", "boots"] },
];

const adjectives = ["Premium", "Classic", "Modern", "Elegant", "Urban", "Vintage", "Luxury", "Essential", "Sleek", "Comfort"];
const nouns = {
    Men: ["Shirt", "Jacket", "Trousers", "Suit", "Coat", "Sweater", "Jeans", "Blazer", "Hoodie", "Polo"],
    Women: ["Dress", "Blouse", "Skirt", "Gown", "Top", "Cardigan", "Jumpsuit", "Leggings", "Scarf", "Tunic"],
    Kids: ["T-Shirt", "Shorts", "Overall", "Romper", "Pyjamas", "Hoodie", "Jacket", "Outfit", "Dress", "Set"],
    Accessories: ["Watch", "Sunglasses", "Bag", "Wallet", "Belt", "Hat", "Scarf", "Necklace", "Bracelet", "Ring"],
    Shoes: ["Sneakers", "Boots", "Loafers", "Heels", "Sandals", "Oxfords", "Trainers", "Slippers", "Flats", "Wedges"],
};
const descriptions = [
    "Crafted from the finest materials for ultimate comfort and style.",
    "A perfect blend of modern design and timeless elegance.",
    "Elevate your wardrobe with this essential piece.",
    "Designed for the contemporary individual who values quality.",
    "Experience luxury in every detail with this premium item.",
    "Versatile and stylish, perfect for any occasion.",
    "Make a statement with this bold and unique design.",
    "Uncompromising quality meets sophisticated aesthetics."
];

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const GET = async () => {
    try {
        // Delete existing products
        await prisma.product.deleteMany({});
        console.log("Deleted existing products");

        const productsToCreate = [];

        for (const category of categories) {
            for (let i = 0; i < 10; i++) {
                const nounList = nouns[category.name as keyof typeof nouns];
                const noun = nounList[i % nounList.length]; // Ensure variety
                const adjective = getRandomElement(adjectives);

                const productName = `${adjective} ${noun}`;
                const basePrice = category.name === "Accessories" ? 49 : category.name === "Shoes" ? 89 : 59;
                const price = Math.floor(basePrice + Math.random() * 100) + 0.99;

                // Unsplash source URL with specific keywords and index to get somewhat different images
                // Note: Real Cloudinary IDs would be better, but for seeding Unsplash is fine as requested.
                // Adding a random sig to prevent caching same image
                const image = `https://images.unsplash.com/photo-${getRandomInt(1500000000000, 1600000000000)}?w=800&q=80&auto=format&fit=crop`;
                // Actually, let's use source.unsplash.com equivalent logic or just search terms if possible?
                // No, source.unsplash is deprecated. Let's use specific IDs or keywords.
                // Let's rely on a list of good IDs to avoid broken links, OR use a service that redirects.
                // Better: Use a reliable set of ~50 unsplash IDs. 

                // Let's just use a simple keyword based url which might redirect but let's try to be safer.
                // I'll use a fixed list of reliable IDs for "premium" look.

                const stock = getRandomInt(10, 100);
                const rating = Number((3.5 + Math.random() * 1.5).toFixed(1));
                const numReviews = getRandomInt(5, 500);

                productsToCreate.push({
                    name: productName,
                    description: getRandomElement(descriptions),
                    price: price,
                    image: getImageUrl(category.name, i),
                    images: [getImageUrl(category.name, i + 10), getImageUrl(category.name, i + 20)],
                    category: category.name.toLowerCase(),
                    brand: "Shop Sizzle Premium",
                    stock,
                    rating,
                    numReviews,
                    isFeatured: i < 2, // First 2 of each category featured
                });
            }
        }

        await prisma.product.createMany({
            data: productsToCreate,
        });

        const count = await prisma.product.count();

        return NextResponse.json({
            success: true,
            message: "Database seeded successfully",
            count,
            categories: categories.map(c => c.name)
        });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to seed database", details: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}

function getImageUrl(category: string, index: number): string {
    // A small curated list of fashion images to ensure they look good
    const images: Record<string, string[]> = {
        Men: [
            "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
            "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59",
            "https://images.unsplash.com/photo-1516257984881-1d546a5851b2",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
            "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35",
            "https://images.unsplash.com/photo-1504593811423-6dd665756598",
            "https://images.unsplash.com/photo-1593032465175-481ac7f401a0",
            "https://images.unsplash.com/photo-1617137968427-85924c809a22",
        ],
        Women: [
            "https://images.unsplash.com/photo-1483985988355-763728e1935b",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
            "https://images.unsplash.com/photo-1529139574466-a302c2d3e1a4",
            "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956",
            "https://images.unsplash.com/photo-1551163943-3f6a29e39bb5",
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
            "https://images.unsplash.com/photo-1550614000-4b9519873d42",
            "https://images.unsplash.com/photo-1509319117193-51043f653489",
            "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5",
        ],
        Kids: [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7",
            "https://images.unsplash.com/photo-1622290291314-ec15e966ce44",
            "https://images.unsplash.com/photo-1519241047957-be31d7379a5d",
            "https://images.unsplash.com/photo-1471286129110-83706121455e",
            "https://images.unsplash.com/photo-1503919545837-3312e37f07e5",
            "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6",
            "https://images.unsplash.com/photo-1519457431-44ccd64a579b",
            "https://images.unsplash.com/photo-1503919545837-3312e37f07e5",
            "https://images.unsplash.com/photo-1621452773781-0f992fd0f5d0",
            "https://images.unsplash.com/photo-1577909388147-7585b42d501d",
        ],
        Accessories: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            "https://images.unsplash.com/photo-1509941943102-10c232535736",
            "https://images.unsplash.com/photo-1611591437281-460bfbe1220a",
            "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d",
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908",
            "https://images.unsplash.com/photo-1599643478518-17488fbbcd75",
            "https://images.unsplash.com/photo-1611085583191-a3b181a88401",
        ],
        Shoes: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
            "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
            "https://images.unsplash.com/photo-1562183241-b937e95585b6",
            "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111",
            "https://images.unsplash.com/photo-1595341888016-a392ef81b7de",
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
        ]
    };

    const list = images[category as keyof typeof images] || images.Men;
    const url = list[index % list.length];
    return `${url}?w=800&q=80&auto=format&fit=crop`; // Append query params for optimization
}
