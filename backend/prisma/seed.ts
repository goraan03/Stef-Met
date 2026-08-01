import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@stef-mat.com' },
        update: {},
        create: {
            email: 'admin@stef-mat.com',
            passwordHash,
            name: 'stef-mat Admin',
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Lista svih kategorija sa slike
    const categoryList = [
        { name: 'Kompletne pekare', slug: 'kompletne-pekare' },
        { name: 'Pekarska prateca oprema', slug: 'pekarska-prateca-oprema' },
        { name: 'Kompletni mlinovi sa pratecom opremom', slug: 'kompletni-mlinovi' },
        { name: 'Silosi (žitarice, brasno i stocnu hranu)', slug: 'silosi' },
        { name: 'Tunelske peci (hleb, kolace)', slug: 'tunelske-peci' },
        { name: 'Kompletne linije (pasta, kroasani, kolace)', slug: 'kompletne-linije' },
        { name: 'Pekare', slug: 'pekare' },
        { name: 'Mlinove', slug: 'mlinove' },
        { name: 'Kolače', slug: 'kolace' },
        { name: 'Testenine', slug: 'testenine' },
        { name: 'Cisterne - Silosi', slug: 'cisterne-silosi' },
        { name: 'Hladnjače - Komore', slug: 'hladnjace-komore' },
        { name: 'Poslastičarnice', slug: 'poslasticarnice' },
        { name: 'Sladolede', slug: 'sladolede' },
        { name: 'Kasapnice', slug: 'kasapnice' },
        { name: 'Restorane', slug: 'restorane' },
        { name: 'Stočnu Hranu', slug: 'stocnu-hranu' },
        { name: 'Linije za Tečne Proizvode', slug: 'linije-za-tecne-proizvode' },
        { name: 'Sušare za Žito i Voće', slug: 'susare-za-zito-i-voce' },
        { name: 'Bombone', slug: 'bombone' },
        { name: 'Zrnaste Proizvode', slug: 'zrnaste-proizvode' },
        { name: 'Drvo', slug: 'drvo' },
        { name: 'Plastiku', slug: 'plastiku' },
        { name: 'Asfaltne Baze', slug: 'asfaltne-baze' },
        { name: 'Perionice', slug: 'perionice' },
        { name: 'Marketi', slug: 'marketi' },
        { name: 'Materijali', slug: 'materijali' }
    ];

    // Create categories dinamično
    const categories = await Promise.all(
        categoryList.map((cat, index) => 
            prisma.category.upsert({
                where: { slug: cat.slug },
                update: { name: cat.name, order: index + 1 },
                create: { name: cat.name, slug: cat.slug, order: index + 1 },
            })
        )
    );
    console.log('✅ Categories created/updated:', categories.length);

    // Mapiramo kategorije po slug-u radi lakšeg pronalaženja ID-ja
    const categoryMap = categories.reduce((acc, cat) => {
        acc[cat.slug] = cat.id;
        return acc;
    }, {} as Record<string, string>);

    // Proizvodi za svaku kategoriju
    const productsData = [
        // Pekare
        {
            name: 'Profesionalna rotaciona peć za hleb',
            slug: 'profesionalna-rotaciona-pec-za-hleb',
            description: 'Profesionalna rotaciona peć za pekare. Kapacitet 18 plehova, električno ili gasno grejanje, automatska kontrola temperature.',
            categoryId: categoryMap['kompletne-pekare'],
            visible: true,
        },
        {
            name: 'Spiralni mikser za testo',
            slug: 'spiralni-mikser-za-testo',
            description: 'Industrijski spiralni mikser za mešenje testa, kapacitet 50kg. Dvobrzinski rad sa tajmerom, idealan za pekare i picerije.',
            categoryId: categoryMap['pekarska-prateca-oprema'],
            visible: true,
        },
        // Poslastičarnice
        {
            name: 'Rashladna vitrina za kolače',
            slug: 'rashladna-vitrina-za-kolace',
            description: 'Moderna izložbena vitrina sa dinamičkim hlađenjem i LED rasvetom. Temperaturni opseg +2°C do +8°C.',
            categoryId: categoryMap['poslasticarnice'],
            visible: true,
        },
        // Mlinove
        {
            name: 'Kompaktni mlin za brašno',
            slug: 'kompaktni-mlin-za-brasno',
            description: 'Poluautomatski mlin za mlevenje pšenice i kukuruza. Visok prinos, niska potrošnja energije, robustan dizajn.',
            categoryId: categoryMap['kompletni-mlinovi'],
            visible: true,
        },
        // Sladolede
        {
            name: 'Aparat za soft sladoled',
            slug: 'aparat-za-soft-sladoled',
            description: 'Profesionalni stoni aparat za točeni sladoled sa tri ručke (dva ukusa + miks). Elektronska kontrola tvrdoće sladoleda.',
            categoryId: categoryMap['sladolede'],
            visible: true,
        },
        // Kasapnice
        {
            name: 'Industrijska mesoreznica',
            slug: 'industrijska-mesoreznica',
            description: 'Snažna profesionalna mesoreznica sa inox sečivom prečnika 350mm. Pogodna za stalni rad u mesarama.',
            categoryId: categoryMap['kasapnice'],
            visible: true,
        },
        // Restorane
        {
            name: 'Konvektomat 10 plehova',
            slug: 'konvektomat-10-plehova',
            description: 'Parokonvekcijska peć za restoranske kuhinje. Kombinovani režimi rada (para, topao vazduh), automatsko pranje.',
            categoryId: categoryMap['restorane'],
            visible: true,
        },
        // Kolače
        {
            name: 'Automatska linija za dekorisanje kolača',
            slug: 'automatska-linija-za-dekorisanje-kolaca',
            description: 'Linija za doziranje i dekorisanje kremova na torte i kolače. Visoka preciznost i ponovljivost.',
            categoryId: categoryMap['kompletne-linije'],
            visible: true,
        },
        // Testenine
        {
            name: 'Ekstruder za testeninu',
            slug: 'ekstruder-za-testeninu',
            description: 'Mašina za proizvodnju sveže i suve testenine različitih oblika. Ugrađen nož za sečenje i ventilator za sušenje.',
            categoryId: categoryMap['kompletne-linije'],
            visible: true,
        },
        // Stočnu Hranu
        {
            name: 'Peletirka za stočnu hranu',
            slug: 'peletirka-za-stocnu-hranu',
            description: 'Mašina za peletiranje stočne hrane i lucerke. Kapacitet 200-300 kg/h, optimalna gustina i čvrstoća peleta.',
            categoryId: categoryMap['stocnu-hranu'],
            visible: true,
        },
        // Linije za Tečne Proizvode
        {
            name: 'Automatska punilica za tečnosti',
            slug: 'automatska-punilica-za-tecnosti',
            description: 'Linija za punjenje sokova, ulja ili vode u staklenu i PET ambalažu sa automatskim zatvaranjem.',
            categoryId: categoryMap['linije-za-tecne-proizvode'],
            visible: true,
        },
        // Sušare za Žito i Voće
        {
            name: 'Tunelska sušara za voće i povrće',
            slug: 'tunelska-susara-za-voce-i-povrce',
            description: 'Sušara sa policama za dehidraciju šljiva, jabuka, kajsija i začinskog bilja. Kontrolisana vlaga i temperatura.',
            categoryId: categoryMap['susare-za-zito-i-voce'],
            visible: true,
        },
        // Cisterne - Silosi
        {
            name: 'Prohromska cisterna za mleko',
            slug: 'prohromska-cisterna-za-mleko',
            description: 'Izolovana cisterna od nerđajućeg čelika AISI 304 za transport ili skladištenje mleka, zapremina 5000L.',
            categoryId: categoryMap['cisterne-silosi'],
            visible: true,
        },
        // Hladnjače - Komore
        {
            name: 'Plusna rashladna komora',
            slug: 'plusna-rashladna-komora',
            description: 'Komora sa poliuretanskim panelima 80mm i rashladnim agregatom za čuvanje svežih namirnica na temperaturama oko 0°C.',
            categoryId: categoryMap['hladnjace-komore'],
            visible: true,
        },
        // Bombone
        {
            name: 'Mašina za izvlačenje bombonske mase',
            slug: 'masina-za-izvlacenje-bombonske-mase',
            description: 'Industrijska mašina za valjanje i izvlačenje mase za tvrde bombone i lizalice.',
            categoryId: categoryMap['bombone'],
            visible: true,
        },
        // Zrnaste Proizvode
        {
            name: 'Automatska pakerica za zrnaste proizvode',
            slug: 'automatska-pakerica-za-zrnaste-proizvode',
            description: 'Vertikalna pakerica za pakovanje pasulja, pirinča, lešnika u kesice sa težinskim dozatorom.',
            categoryId: categoryMap['zrnaste-proizvode'],
            visible: true,
        },
        // Drvo
        {
            name: 'CNC obradni centar za drvo',
            slug: 'cnc-obradni-centar-za-drvo',
            description: 'Troosna CNC mašina za sečenje, bušenje i glodanje drvenih panela i masiva. Visoka preciznost.',
            categoryId: categoryMap['drvo'],
            visible: true,
        },
        // Plastiku
        {
            name: 'Brizgalica za plastiku',
            slug: 'brizgalica-za-plastiku',
            description: 'Hidraulična mašina za brizganje plastičnih masa sa silom zatvaranja 150 tona. Kompaktna i energetski efikasna.',
            categoryId: categoryMap['plastiku'],
            visible: true,
        },
        // Asfaltne Baze
        {
            name: 'Automatski dozator mineralnog praha',
            slug: 'automatski-dozator-mineralnog-praha',
            description: 'Sistem za precizno doziranje aditiva i mineralnih komponenti na asfaltnim bazama.',
            categoryId: categoryMap['asfaltne-baze'],
            visible: true,
        },
        // Perionice
        {
            name: 'Samouslužni aparat za pranje automobila',
            slug: 'samousluzni-aparat-za-pranje-automobila',
            description: 'Sistem sa programima za toplo pranje, voskiranje i ispiranje osmozom. Inox kućište, žetonjera.',
            categoryId: categoryMap['perionice'],
            visible: true,
        },
        // Marketi
        {
            name: 'Zidna rashladna polica za markete',
            slug: 'zidna-rashladna-polica-za-markete',
            description: 'Rashladna polica sa spoljnim agregatom za izlaganje voća, povrća i pakovanih mesnih prerađevina.',
            categoryId: categoryMap['marketi'],
            visible: true,
        },
        // Materijali
        {
            name: 'Poliuretanski sendvič paneli',
            slug: 'poliuretanski-sendvic-paneli',
            description: 'Kvalitetni zidni i krovni paneli punjeni poliuretanom za brzu izgradnju skladišta i hladnjača.',
            categoryId: categoryMap['materijali'],
            visible: true,
        }
    ];

    // Create products dinamično
    const seededProducts = await Promise.all(
        productsData.map((prod) => 
            prisma.product.upsert({
                where: { slug: prod.slug },
                update: {
                    name: prod.name,
                    description: prod.description,
                    categoryId: prod.categoryId,
                    visible: prod.visible
                },
                create: {
                    name: prod.name,
                    slug: prod.slug,
                    description: prod.description,
                    categoryId: prod.categoryId,
                    visible: prod.visible
                }
            })
        )
    );
    console.log('✅ Products created/updated:', seededProducts.length);

    // Create settings
    const settings = await Promise.all([
        prisma.setting.upsert({
            where: { key: 'site_title' },
            update: {},
            create: {
                key: 'site_title',
                value: 'stef-mat - Industrijska oprema',
                type: 'text',
                description: 'Website title',
            },
        }),
        prisma.setting.upsert({
            where: { key: 'site_description' },
            update: {},
            create: {
                key: 'site_description',
                value: 'Import, export i prodaja industrijske opreme za prehrambenu industriju od 1994. godine.',
                type: 'text',
                description: 'Website description',
            },
        }),
        prisma.setting.upsert({
            where: { key: 'contact_email' },
            update: {},
            create: {
                key: 'contact_email',
                value: 'info@stef-mat.com',
                type: 'text',
                description: 'Contact email',
            },
        }),
        prisma.setting.upsert({
            where: { key: 'contact_phone' },
            update: {},
            create: {
                key: 'contact_phone',
                value: '+39 123 456 7890',
                type: 'text',
                description: 'Contact phone',
            },
        }),
        prisma.setting.upsert({
            where: { key: 'contact_address' },
            update: {},
            create: {
                key: 'contact_address',
                value: 'Via Roma 123, Milano, Italia',
                type: 'text',
                description: 'Contact address',
            },
        }),
        prisma.setting.upsert({
            where: { key: 'business_hours' },
            update: {},
            create: {
                key: 'business_hours',
                value: 'Pon-Pet: 09:00-18:00\nSub: 09:00-13:00',
                type: 'text',
                description: 'Business hours',
            },
        }),
    ]);
    console.log('✅ Settings created:', settings.length);

    console.log('✅ Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });