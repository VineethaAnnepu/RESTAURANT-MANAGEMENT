const menuData = [
  // --- Appetizers ---
  {
    id: 1,
    name: 'Chicken Tikka',
    image: `/images/chickentikka.jpeg`, // Use absolute path
    price: 250,
    category: 'Appetizers',
    description: 'Smoky grilled chicken skewers marinated in yogurt and spices.',
  },
  {
    id: 2,
    name: 'Fish Tikka',
    image: `/images/fishtikka.jpeg`, // Use absolute path
    price: 320,
    category: 'Appetizers',
    description: 'Tender fish pieces marinated and grilled to perfection.',
  },
  {
    id: 3,
    name: 'Hara Bhara Kebab',
    image: `/images/harabhara.jpeg`, // Use absolute path
    price: 180,
    category: 'Appetizers',
    description: 'Spinach and green pea patties, spiced and shallow-fried.',
  },
  {
    id: 4,
    name: 'Pakora',
    image: `/images/pakora.jpeg`, // Use absolute path
    price: 120,
    category: 'Appetizers',
    description: 'Assorted vegetables dipped in gram flour batter and deep-fried.',
  },
  {
    id: 5,
    name: 'Paneer Tikka',
    image: `/images/paneertikka.jpeg`, // Use absolute path
    price: 220,
    category: 'Appetizers',
    description: 'Cottage cheese cubes marinated with spices and grilled in a tandoor.',
  },
  {
    id: 6,
    name: 'Stuffed Mushroom',
    image: `/images/stuffedmushroom.jpeg`, // Use absolute path
    price: 240,
    category: 'Appetizers',
    description: 'Mushrooms stuffed with cheese and herbs, baked golden.',
  },
  {
    id: 7,
    name: 'Tandoori Chicken',
    image: `/images/tandoorichicken.jpeg`, // Use absolute path
    price: 280,
    category: 'Appetizers',
    description: 'Classic tandoor-grilled chicken with a smoky flavour.',
  },
  {
    id: 47, // Mutton Seekh Kebab
    name: 'Mutton Seekh Kebab',
    image: `/images/muttonsheekkebab.jpeg`, // Use absolute path
    price: 350,
    category: 'Appetizers',
    description: 'Minced mutton skewers grilled to a smoky perfection.',
  },

  // --- Soups ---
  {
    id: 8,
    name: 'Chicken Noodle Soup',
    image: `/images/chickennoodlesoup.jpeg`, // Use absolute path
    price: 150,
    category: 'Soups',
    description: 'Comforting clear soup with shredded chicken and noodles.',
  },
  {
    id: 9,
    name: 'Lentil Soup',
    image: `/images/lentilsoup.jpeg`, // Use absolute path
    price: 115,
    category: 'Soups',
    description: 'A hearty and nutritious soup made from yellow lentils.',
  },
  {
    id: 10,
    name: 'Mushroom Soup',
    image: `/images/mushroomsoup.jpeg`, // Use absolute path
    price: 140,
    category: 'Soups',
    description: 'Rich and creamy soup made with fresh mushrooms.',
  },
  {
    id: 11,
    name: 'Tomato Basil Soup',
    image: `/images/tomatobasil.jpeg`, // Use absolute path
    price: 125,
    category: 'Soups',
    description: 'Classic roasted tomato soup with a hint of fresh basil.',
  },

  // --- Salads ---
  {
    id: 12,
    name: 'Asian Salad',
    image: `/images/asiansalad.jpeg`, // Use absolute path
    price: 190,
    category: 'Salads',
    description: 'Crisp greens with a tangy sesame-ginger dressing.',
  },
  {
    id: 13,
    name: 'Caesar Salad',
    image: `/images/caesarsalad.jpeg`, // Use absolute path
    price: 210,
    category: 'Salads',
    description: 'Fresh romaine, croutons, and parmesan in a creamy Caesar dressing.',
  },
  {
    id: 14,
    name: 'Caprese Salad',
    image: `/images/capresesalad.jpeg`, // Use absolute path
    price: 230,
    category: 'Salads',
    description: 'Slices of fresh mozzarella, tomatoes, and basil.',
  },
  {
    id: 15,
    name: 'Cobb Salad',
    image: `/images/cobbsalad.jpeg`, // Use absolute path
    price: 260,
    category: 'Salads',
    description: 'A loaded salad with chicken, bacon, egg, and avocado.',
  },
  {
    id: 16,
    name: 'Garden Salad',
    image: `/images/gardensalad.jpeg`, // Use absolute path
    price: 160,
    category: 'Salads',
    description: 'A mix of fresh garden vegetables with a light vinaigrette.',
  },
  {
    id: 17,
    name: 'Greek Salad',
    image: `/images/greeksalad.jpeg`, // Use absolute path
    price: 200,
    category: 'Salads',
    description: 'Cucumbers, tomatoes, olives, and feta cheese.',
  },
  {
    id: 18,
    name: 'Nicoise Salad',
    image: `/images/nicoisesalad.jpeg`, // Use absolute path
    price: 250,
    category: 'Salads',
    description: 'A classic French salad with tuna, potatoes, eggs, and green beans.',
  },
  {
    id: 19,
    name: 'Pasta Salad',
    image: `/images/pastasalad.jpeg`, // Use absolute path
    price: 180,
    category: 'Salads',
    description: 'Cold pasta salad with vegetables in an herb dressing.',
  },
  {
    id: 20,
    name: 'Quinoa Salad',
    image: `/images/quiniasalad.jpeg`, // Use absolute path (corrected filename)
    price: 220,
    category: 'Salads',
    description: 'Healthy salad with quinoa, chickpeas, and mixed veggies.',
  },
  {
    id: 21,
    name: 'Waldorf Salad',
    image: `/images/waldorfsalad.jpeg`, // Use absolute path
    price: 210,
    category: 'Salads',
    description: 'A classic salad with apples, celery, walnuts, and mayonnaise.',
  },

  // --- Burgers ---
  {
    id: 22,
    name: 'Chicken Burger',
    image: `/images/chickenburger.jpeg`, // Use absolute path
    price: 240,
    category: 'Burgers',
    description: 'Grilled chicken patty with lettuce, tomato, and cheese.',
  },
  {
    id: 23,
    name: 'Double Cheese Burger',
    image: `/images/doublecheeseburger.jpeg`, // Use absolute path
    price: 300,
    category: 'Burgers',
    description: 'Two beef patties, double cheese, and all the fixings.',
  },
  {
    id: 24,
    name: 'Mushroom Swiss Burger',
    image: `/images/mushroomswissburger.jpeg`, // Use absolute path
    price: 280,
    category: 'Burgers',
    description: 'Juicy beef patty topped with sautéed mushrooms and Swiss cheese.',
  },

  // --- Sandwiches & Wraps ---
  {
    id: 25,
    name: 'BLT Sandwich',
    image: `/images/bltsandwich.jpeg`, // Use absolute path
    price: 200,
    category: 'Sandwiches',
    description: 'The classic: bacon, lettuce, and tomato sandwich.',
  },
  {
    id: 26,
    name: 'Club Sandwich',
    image: `/images/clubsandwich.jpeg`, // Use absolute path
    price: 250,
    category: 'Sandwiches',
    description: 'A triple-decker sandwich with chicken, bacon, lettuce, and tomato.',
  },
  {
    id: 27,
    name: 'Falafel Wrap',
    image: `/images/falafelwrap.jpeg`, // Use absolute path
    price: 180,
    category: 'Wraps',
    description: 'Crispy falafel balls with hummus and veggies in a pita wrap.',
  },
  {
    id: 28,
    name: 'Grilled Veggie Wrap',
    image: `/images/grilledveggiwrap.jpeg`, // Use absolute path
    price: 190,
    category: 'Wraps',
    description: 'A warm wrap filled with grilled seasonal vegetables.',
  },

  // --- Pizza ---
  {
    id: 29,
    name: 'Capricciosa Pizza',
    image: `/images/capricciaspizza.jpeg`, // Use absolute path
    price: 350,
    category: 'Pizza',
    description: 'Topped with mushrooms, artichokes, ham, and olives.',
  },
  {
    id: 30,
    name: 'Marinara Pizza',
    image: `/images/marinarapizza.jpeg`, // Use absolute path
    price: 280,
    category: 'Pizza',
    description: 'A simple, classic pizza with tomato, garlic, oregano, and olive oil.',
  },
  {
    id: 31,
    name: 'Pepperoni Pizza',
    image: `/images/pepperoni.jpeg`, // Use absolute path
    price: 330,
    category: 'Pizza',
    description: 'Classic pizza topped with spicy pepperoni slices and mozzarella.',
  },
  {
    id: 32,
    name: 'Sicilian Pizza',
    image: `/images/sicilianpizza.jpeg`, // Use absolute path
    price: 360,
    category: 'Pizza',
    description: 'Thick crust pizza with anchovies, onions, and herbs.',
  },

  // --- Sides ---
  {
    id: 33,
    name: 'French Fries',
    image: `/images/frenchfries.jpeg`, // Use absolute path
    price: 100,
    category: 'Sides',
    description: 'Crispy, golden-brown french fries.',
  },

  // --- Desserts ---
  {
    id: 34,
    name: 'Apricot Delight',
    image: `/images/apricotdelight.jpeg`, // Use absolute path
    price: 160,
    category: 'Desserts',
    description: 'A rich dessert made with dried apricots and cream.',
  },
  {
    id: 35,
    name: 'Double Ka Meetha',
    image: `/images/doublekameetha.jpeg`, // Use absolute path
    price: 150,
    category: 'Desserts',
    description: 'A Hyderabadi bread pudding dessert with saffron and nuts.',
  },
  {
    id: 36,
    name: 'Gulab Jamun',
    image: `/images/gulabjamun.jpeg`, // Use absolute path
    price: 120,
    category: 'Desserts',
    description: 'Soft, spongy berry-sized balls soaked in rose-flavoured sugar syrup.',
  },
  {
    id: 37,
    name: 'Khubani Ka Meetha',
    image: `/images/khubaniameetha.jpeg`, // Use absolute path
    price: 170,
    category: 'Desserts',
    description: 'Another Hyderabadi special made from dried apricots.',
  },
  {
    id: 38,
    name: 'Mango Delight',
    image: `/images/mangodelight.jpeg`, // Use absolute path
    price: 180,
    category: 'Desserts',
    description: 'A creamy, delicious dessert made with fresh mango pulp.',
  },
  {
    id: 39,
    name: 'Rabdi',
    image: `/images/rabdi.jpeg`, // Use absolute path
    price: 140,
    category: 'Desserts',
    description: 'Sweet, condensed-milk-based dessert, thickened with nuts.',
  },
  {
    id: 40,
    name: 'Ras Malai',
    image: `/images/rasmalai.jpeg`, // Use absolute path
    price: 160,
    category: 'Desserts',
    description: 'Soft paneer balls soaked in chilled, creamy, sweetened milk.',
  },
  {
    id: 41,
    name: 'Russian Honey Cake',
    image: `/images/russianhoneycake.jpeg`, // Use absolute path
    price: 250,
    category: 'Desserts',
    description: 'A multi-layered honey cake with a sweet cream frosting.',
  },

  // --- Beverages ---
  {
    id: 42,
    name: 'Coca-Cola',
    image: `/images/cococola.jpeg`, // Use absolute path
    price: 60,
    category: 'Beverages',
    description: 'Classic cold drink.',
  },
  {
    id: 43,
    name: 'Lemonade',
    image: `/images/lemonade.jpeg`, // Use absolute path
    price: 90,
    category: 'Beverages',
    description: 'Freshly squeezed lemonade.',
  },
  {
    id: 44,
    name: 'Mirinda',
    image: `/images/mirinda.jpeg`, // Use absolute path
    price: 60,
    category: 'Beverages',
    description: 'Classic cold drink.',
  },
  {
    id: 45,
    name: 'Sprite',
    image: `/images/sprite.jpeg`, // Use absolute path
    price: 60,
    category: 'Beverages',
    description: 'Classic cold drink.',
  },
  {
    id: 46,
    name: 'Virgin Mojito',
    image: `/images/virginmojito.jpeg`, // Use absolute path
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