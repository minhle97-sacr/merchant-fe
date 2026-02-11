export const OPERATIONAL_CATEGORIES = [
    {
        name: 'Hotel / Resort',
        items: ['Hotel', 'Resort', 'Guesthouse', 'Hostel']
    },
    {
        name: 'Restaurant',
        items: ['Fine Dining', 'Casual', 'Quick Service', 'Bar / Pub', 'Club / Disco']
    },
    {
        name: 'Cafe / Bakery',
        items: ['Cafe', 'Canteen']
    },
    {
        name: 'Supplier',
        items: [
            { name: 'Alcohol', items: ['Beer', 'Domestic', 'Imported', 'Wine', 'All / Various'] },
            'Kitchen equipments',
            'Electronics Suppliers',
            'Service Providers',
            'Contractor',
            'Electrician',
            'Plumber'
        ]
    },
    {
        name: 'Bank & Insurance',
        items: ['Bank', 'Insurance']
    }
];

export const TABS = [
    'Business Info',
    'Tax Documents',
    'Location',
    'Visuals',
    'Owner / Primary Controller',
    'Financial',
    'Operational',
    'Payment Options',
    'Consent'
];

export const ALLOWED_GOOGLE_BUSINESS_TYPES = [
    // Core Commerce / Retail / HoReCa
    'bakery', 'bar', 'cafe', 'restaurant', 'meal_delivery', 'meal_takeaway',
    'supermarket', 'convenience_store', 'liquor_store', 'department_store',
    'clothing_store', 'shoe_store', 'jewelry_store', 'electronics_store',
    'hardware_store', 'home_goods_store', 'furniture_store', 'store',
    'shopping_mall', 'book_store', 'pet_store', 'pharmacy', 'drugstore',

    // Financial / Professional / Business Services
    'accounting', 'bank', 'insurance_agency', 'real_estate_agency', 'lawyer',

    // Health / Wellness / Medical
    'dentist', 'doctor', 'hospital', 'physiotherapist', 'veterinary_care',
    'gym', 'spa', 'beauty_salon', 'hair_care',

    // Hospitality / Travel
    'lodging', 'travel_agency', 'campground', 'rv_park',

    // Entertainment / Leisure
    'amusement_park', 'aquarium', 'art_gallery', 'museum', 'movie_theater',
    'movie_rental', 'casino', 'night_club', 'bowling_alley', 'stadium',
    'tourist_attraction',

    // Education / Knowledge
    'primary_school', 'secondary_school', 'school', 'university', 'library',

    // Transport / Auto / Mobility
    'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'taxi_stand',

    // Infrastructure / Utilities / Service Providers
    'plumber', 'electrician', 'painter', 'locksmith', 'roofing_contractor',
    'moving_company', 'storage', 'laundry', 'florist', 'funeral_home',

    // Transit / Transport Hubs
    'airport', 'bus_station', 'train_station', 'subway_station',
    'transit_station', 'light_rail_station'
];