const menuData = [
  // --- Appetizers ---
  {
    id: 1,
    name: 'Chicken Tikka',
    image: `${process.env.PUBLIC_URL}/images/chickentikka.jpeg`, // FIX: Removed hyphen
    price: 250, 
    category: 'Appetizers',
    description: 'Smoky grilled chicken skewers marinated in yogurt and spices.',
  },
  {
    id: 2,
    name: 'Fish Tikka',
    image: `${process.env.PUBLIC_URL}/images/fishtikka.jpeg`, // FIX: Removed hyphen
    price: 320,
    category: 'Appetizers',
    description: 'Tender fish pieces marinated and grilled to perfection.',
  },
  {
    id: 3,
    name: 'Hara Bhara Kebab',
    image: `${process.env.PUBLIC_URL}/images/harabhara.jpeg`, // FIX: Simplified to 'harabhara.jpeg'
    price: 180,
    category: 'Appetizers',
    description: 'Spinach and green pea patties, spiced and shallow-fried.',
  },
  {
    id: 4,
    name: 'Pakora',
    image: `${process.env.PUBLIC_URL}/images/pakora.jpeg`,
    price: 120,
    category: 'Appetizers',
    description: 'Assorted vegetables dipped in gram flour batter and deep-fried.',
  },
  {
    id: 5,
    name: 'Paneer Tikka',
    image: `${process.env.PUBLIC_URL}/images/paneertikka.jpeg`, // FIX: Removed hyphen
    price: 220,
    category: 'Appetizers',
    description: 'Cottage cheese cubes marinated with spices and grilled in a tandoor.',
  },
  {
    id: 6,
    name: 'Stuffed Mushroom',
    image: `${process.env.PUBLIC_URL}/images/stuffedmushroom.jpeg`, // FIX: Removed hyphen
    price: 240,
    category: 'Appetizers',
    description: 'Mushrooms stuffed with cheese and herbs, baked golden.',
  },
  {
    id: 7,
    name: 'Tandoori Chicken',
    image: `${process.env.PUBLIC_URL}/images/tandoorichicken.jpeg`, // FIX: Removed hyphen
    price: 280,
    category: 'Appetizers',
    description: 'Classic tandoor-grilled chicken with a smoky flavour.',
  },
  // 🆕 ADDED Mutton Seekh Kebab (was missing in original array)
  {
    id: 47,
    name: 'Mutton Seekh Kebab',
    image: `${process.env.PUBLIC_URL}/images/muttonsheekkebab.jpeg`, 
    price: 350,
    category: 'Appetizers',
    description: 'Minced mutton skewers grilled to a smoky perfection.',
  },


  // --- Soups ---
  {
    id: 8,
    name: 'Chicken Noodle Soup',
    image: `${process.env.PUBLIC_URL}/images/chickennoodlesoup.jpeg`, // FIX: Removed hyphen
    price: 150,
    category: 'Soups',
    description: 'Comforting clear soup with shredded chicken and noodles.',
  },
  {
    id: 9,
    name: 'Lentil Soup',
    image: `${process.env.PUBLIC_URL}/images/lentilsoup.jpeg`, // FIX: Removed hyphen
    price: 115,
    category: 'Soups',
    description: 'A hearty and nutritious soup made from yellow lentils.',
  },
  {
    id: 10,
    name: 'Mushroom Soup', // Name simplified in previous step
    image: `${process.env.PUBLIC_URL}/images/mushroomsoup.jpeg`, // FIX: Removed hyphen
    price: 140,
    category: 'Soups',
    description: 'Rich and creamy soup made with fresh mushrooms.',
  },
  {
    id: 11,
    name: 'Tomato Basil Soup',
    image: `${process.env.PUBLIC_URL}/images/tomatobasil.jpeg`, // FIX: Simplified to 'tomatobasil.jpeg'
    price: 125,
    category: 'Soups',
    description: 'Classic roasted tomato soup with a hint of fresh basil.',
  },

  // --- Salads ---
  {
    id: 12,
    name: 'Asian Salad',
    image: `${process.env.PUBLIC_URL}/images/asiansalad.jpeg`, // FIX: Removed hyphen
    price: 190,
    category: 'Salads',
    description: 'Crisp greens with a tangy sesame-ginger dressing.',
  },
  {
    id: 13,
    name: 'Caesar Salad',
    image: `${process.env.PUBLIC_URL}/images/caesarsalad.jpeg`, // FIX: Removed hyphen
    price: 210,
    category: 'Salads',
    description: 'Fresh romaine, croutons, and parmesan in a creamy Caesar dressing.',
  },
  {
    id: 14,
    name: 'Caprese Salad',
    image: `${process.env.PUBLIC_URL}/images/capresesalad.jpeg`, // FIX: Removed hyphen
    price: 230,
    category: 'Salads',
    description: 'Slices of fresh mozzarella, tomatoes, and basil.',
  },
  {
    id: 15,
    name: 'Cobb Salad',
    image: `${process.env.PUBLIC_URL}/images/cobbsalad.jpeg`, // FIX: Removed hyphen
    price: 260,
    category: 'Salads',
    description: 'A loaded salad with chicken, bacon, egg, and avocado.',
  },
  {
    id: 16,
    name: 'Garden Salad',
    image: `${process.env.PUBLIC_URL}/images/gardensalad.jpeg`, // FIX: Removed hyphen
    price: 160,
    category: 'Salads',
    description: 'A mix of fresh garden vegetables with a light vinaigrette.',
  },
  {
    id: 17,
    name: 'Greek Salad',
    image: `${process.env.PUBLIC_URL}/images/greeksalad.jpeg`, // FIX: Removed hyphen
    price: 200,
    category: 'Salads',
    description: 'Cucumbers, tomatoes, olives, and feta cheese.',
  },
  {
    id: 18,
    name: 'Nicoise Salad',
    // 🚨 FIX: Removed hyphen and apostrophe to match 'nicoisesalad.jpeg'
    image: `${process.env.PUBLIC_URL}/images/nicoisesalad.jpeg`, 
    price: 250,
    category: 'Salads',
    description: 'A classic French salad with tuna, potatoes, eggs, and green beans.',
  },
  {
    id: 19,
    name: 'Pasta Salad',
    image: `${process.env.PUBLIC_URL}/images/pastasalad.jpeg`, // FIX: Removed hyphen
    price: 180,
    category: 'Salads',
    description: 'Cold pasta salad with vegetables in an herb dressing.',
  },
  {
    id: 20,
    name: 'Quinoa Salad',
    image: `${process.env.PUBLIC_URL}/images/quiniasalad.jpeg`, // FIX: Corrected typo 'quinia' and removed hyphen
    price: 220,
    category: 'Salads',
    description: 'Healthy salad with quinoa, chickpeas, and mixed veggies.',
  },
  {
    id: 21,
    name: 'Waldorf Salad',
    image: `${process.env.PUBLIC_URL}/images/waldorfsalad.jpeg`, // FIX: Removed hyphen
    price: 210,
    category: 'Salads',
    description: 'A classic salad with apples, celery, walnuts, and mayonnaise.',
  },

  // --- Burgers ---
  {
    id: 22,
    name: 'Chicken Burger',
    image: `${process.env.PUBLIC_URL}/images/chickenburger.jpeg`, // FIX: Removed hyphen
    price: 240,
    category: 'Burgers',
    description: 'Grilled chicken patty with lettuce, tomato, and cheese.',
  },
  {
    id: 23,
    name: 'Double Cheese Burger',
    image: `${process.env.PUBLIC_URL}/images/doublecheeseburger.jpeg`, // FIX: Corrected path
    price: 300,
    category: 'Burgers',
    description: 'Two beef patties, double cheese, and all the fixings.',
  },
  {
    id: 24,
    name: 'Mushroom Swiss Burger',
    image: `${process.env.PUBLIC_URL}/images/mushroomswissburger.jpeg`, // FIX: Corrected path
    price: 280,
    category: 'Burgers',
    description: 'Juicy beef patty topped with sautéed mushrooms and Swiss cheese.',
  },

  // --- Sandwiches & Wraps ---
  {
    id: 25,
    name: 'BLT Sandwich',
    image: `${process.env.PUBLIC_URL}/images/bltsandwich.jpeg`, // FIX: Removed hyphen
    price: 200,
    category: 'Sandwiches',
    description: 'The classic: bacon, lettuce, and tomato sandwich.',
  },
  {
    id: 26,
    name: 'Club Sandwich',
    image: `${process.env.PUBLIC_URL}/images/clubsandwich.jpeg`, // FIX: Removed hyphen
    price: 250,
    category: 'Sandwiches',
    description: 'A triple-decker sandwich with chicken, bacon, lettuce, and tomato.',
  },
  {
    id: 27,
    name: 'Falafel Wrap',
    image: `${process.env.PUBLIC_URL}/images/falafelwrap.jpeg`, // FIX: Removed hyphen
    price: 180,
    category: 'Wraps',
    description: 'Crispy falafel balls with hummus and veggies in a pita wrap.',
  },
  {
    id: 28,
    name: 'Grilled Veggie Wrap',
    image: `${process.env.PUBLIC_URL}/images/grilledveggiwrap.jpeg`, // FIX: Removed hyphen
    price: 190,
    category: 'Wraps',
    description: 'A warm wrap filled with grilled seasonal vegetables.',
  },

  // --- Pizza ---
  {
    id: 29,
    name: 'Capricciosa Pizza',
    // 🚨 FIX: Corrected to match file name 'capricciaspizza.jpeg'
    image: `${process.env.PUBLIC_URL}/images/capricciaspizza.jpeg`, 
    price: 350,
    category: 'Pizza',
    description: 'Topped with mushrooms, artichokes, ham, and olives.',
  },
  {
    id: 30,
    name: 'Marinara Pizza',
    image: `${process.env.PUBLIC_URL}/images/marinarapizza.jpeg`, // FIX: Removed hyphen
    price: 280,
    category: 'Pizza',
    description: 'A simple, classic pizza with tomato, garlic, oregano, and olive oil.',
  },
  {
    id: 31,
    name: 'Pepperoni Pizza',
    image: `${process.env.PUBLIC_URL}/images/pepperoni.jpeg`, // FIX: Removed hyphen
    price: 330,
    category: 'Pizza',
    description: 'Classic pizza topped with spicy pepperoni slices and mozzarella.',
  },
  {
    id: 32,
    name: 'Sicilian Pizza',
    image: `${process.env.PUBLIC_URL}/images/sicilianpizza.jpeg`, // FIX: Removed hyphen
    price: 360,
    category: 'Pizza',
    description: 'Thick crust pizza with anchovies, onions, and herbs.',
  },

  // --- Sides ---
  {
    id: 33,
    name: 'French Fries',
    image: `${process.env.PUBLIC_URL}/images/frenchfries.jpeg`, // FIX: Removed hyphen
    price: 100,
    category: 'Sides',
    description: 'Crispy, golden-brown french fries.',
  },

  // --- Desserts ---
  {
    id: 34,
    name: 'Apricot Delight',
    image: `${process.env.PUBLIC_URL}/images/apricotdelight.jpeg`, // FIX: Removed hyphen
    price: 160,
    category: 'Desserts',
    description: 'A rich dessert made with dried apricots and cream.',
  },
  {
    id: 35,
    name: 'Double Ka Meetha',
    image: `${process.env.PUBLIC_URL}/images/doublekameetha.jpeg`, // FIX: Removed hyphen
    price: 150,
    category: 'Desserts',
    description: 'A Hyderabadi bread pudding dessert with saffron and nuts.',
  },
  {
    id: 36,
    name: 'Gulab Jamun',
    image: `${process.env.PUBLIC_URL}/images/gulabjamun.jpeg`, // FIX: Removed hyphen
    price: 120,
    category: 'Desserts',
    description: 'Soft, spongy berry-sized balls soaked in rose-flavoured sugar syrup.',
  },
  {
    id: 37,
    name: 'Khubani Ka Meetha',
    image: `${process.env.PUBLIC_URL}/images/khubaniameetha.jpeg`, // FIX: Corrected path
    price: 170,
    category: 'Desserts',
    description: 'Another Hyderabadi special made from dried apricots.',
  },
  {
    id: 38,
    name: 'Mango Delight',
    image: `${process.env.PUBLIC_URL}/images/mangodelight.jpeg`, // FIX: Removed hyphen
    price: 180,
    category: 'Desserts',
    description: 'A creamy, delicious dessert made with fresh mango pulp.',
  },
  {
    id: 39,
    name: 'Rabdi',
    image: `${process.env.PUBLIC_URL}/images/rabdi.jpeg`,
    price: 140,
    category: 'Desserts',
    description: 'Sweet, condensed-milk-based dessert, thickened with nuts.',
  },
  {
    id: 40,
    name: 'Ras Malai',
    image: `${process.env.PUBLIC_URL}/images/rasmalai.jpeg`, // FIX: Removed hyphen
    price: 160,
    category: 'Desserts',
    description: 'Soft paneer balls soaked in chilled, creamy, sweetened milk.',
  },
  {
    id: 41,
    name: 'Russian Honey Cake',
    image: `${process.env.PUBLIC_URL}/images/russianhoneycake.jpeg`, // FIX: Removed hyphen
    price: 250,
    category: 'Desserts',
    description: 'A multi-layered honey cake with a sweet cream frosting.',
  },

  // --- Beverages ---
  {
    id: 42,
    name: 'Coca-Cola',
    image: `${process.env.PUBLIC_URL}/images/cococola.jpeg`, // FIX: Corrected path
    price: 60,
    category: 'Beverages',
    description: 'Classic cold drink.',
  },
  {
    id: 43,
    name: 'Lemonade',
    image: `${process.env.PUBLIC_URL}/images/lemonade.jpeg`,
    price: 90,
    category: 'Beverages',
    description: 'Freshly squeezed lemonade.',
  },
  {
    id: 44,
    name: 'Mirinda',
    image: `${process.env.PUBLIC_URL}/images/mirinda.jpeg`,
    price: 60,
    category: 'Beverages',
    description: 'Classic cold drink.',
  },
  {
    id: 45,
    name: 'Sprite',
    image: `${process.env.PUBLIC_URL}/images/sprite.jpeg`,
    price: 60,
    category: 'Beverages',
    description: 'Classic cold drink.',
  },
  {
    id: 46,
    name: 'Virgin Mojito',
    image: `${process.env.PUBLIC_URL}/images/virginmojito.jpeg`, // FIX: Corrected path (no hyphen)
    price: 130,
    category: 'Beverages',
    description: 'A refreshing mocktail with mint and lime.',
  },
];

// --- EXPORT ALL DATA ---

export const INITIAL_MENU = menuData;

// Extract categories automatically to ensure no misses
export const categories = [
  ...new Set(menuData.map(item => item.category))
];

// --- INITIAL DATA FOR ADMIN PANEL ---

export const INITIAL_TABLES = [
  { id: 't1', number: 1, name: 'Window Seat', size: 4, status: 'Available' },
  { id: 't2', number: 2, name: 'Corner Booth', size: 6, status: 'Available' },
  { id: 't3', number: 3, name: 'Patio 1', size: 2, status: 'Available' },
];

export const INITIAL_ORDERS = []; 

export const INITIAL_CHEFS = [
  { id: 'c1', name: 'Chef Sharma', orders: 0 }, 
  { id: 'c2', name: 'Chef Maria', orders: 0 },
  { id: 'c3', name: 'Chef Ali', orders: 0 },   
];