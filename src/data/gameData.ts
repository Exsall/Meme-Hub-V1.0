import { BoosterItem, Creature, GameConfig, Ingredient, MysteryBox, Quest, Rarity, Zone } from '../types/game';
import { GAME_CONFIG } from '../config/gameConfig';

export const RARITY_CONFIG: Record<
  Rarity,
  { label: string; color: string; bgBadge: string; border: string; glow: string; text: string }
> = {
  common: {
    label: 'Обычный',
    color: '#94a3b8',
    bgBadge: 'bg-slate-700 text-slate-200',
    border: 'border-slate-500',
    glow: 'shadow-[0_0_15px_rgba(148,163,184,0.3)]',
    text: 'text-slate-300',
  },
  uncommon: {
    label: 'Необычный',
    color: '#22c55e',
    bgBadge: 'bg-emerald-800 text-emerald-100',
    border: 'border-emerald-500',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]',
    text: 'text-emerald-400',
  },
  rare: {
    label: 'Редкий',
    color: '#3b82f6',
    bgBadge: 'bg-blue-800 text-blue-100',
    border: 'border-blue-500',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.5)]',
    text: 'text-blue-400',
  },
  epic: {
    label: 'Эпический',
    color: '#a855f7',
    bgBadge: 'bg-purple-800 text-purple-100',
    border: 'border-purple-500',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
    text: 'text-purple-400',
  },
  legendary: {
    label: 'Легендарный',
    color: '#f97316',
    bgBadge: 'bg-amber-800 text-amber-100',
    border: 'border-amber-500',
    glow: 'shadow-[0_0_35px_rgba(249,115,22,0.7)]',
    text: 'text-amber-400',
  },
  secret: {
    label: 'Секретный',
    color: '#ec4899',
    bgBadge: 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white',
    border: 'border-pink-500',
    glow: 'shadow-[0_0_40px_rgba(236,72,153,0.8)] animate-pulse',
    text: 'text-pink-300',
  },
};

export const DEFAULT_CONFIG: GameConfig = {
  priceMultiplier: GAME_CONFIG.economy.priceMultiplier,
  incomeMultiplier: GAME_CONFIG.economy.incomeMultiplier,
  offlineMaxHours: GAME_CONFIG.economy.offlineMaxHours,
  mapSpawnIntervalSec: GAME_CONFIG.groundItems.regularSpawnIntervalSec,
};

export const INGREDIENTS: Ingredient[] = [
  // Animals (8)
  {
    id: 'cat',
    name: 'Кот',
    category: 'animals',
    rarity: 'common',
    emoji: '🐱',
    color: '#f59e0b',
    description: 'Мурлычет, спит 20 часов в день и готов стать мемом.',
    cost: 100,
    unlockLevel: 1,
  },
  {
    id: 'dog',
    name: 'Собака',
    category: 'animals',
    rarity: 'common',
    emoji: '🐶',
    color: '#d97706',
    description: 'Преданный пёсик, обожающий бегать за хвостом.',
    cost: 120,
    unlockLevel: 1,
  },
  {
    id: 'chicken',
    name: 'Курица',
    category: 'animals',
    rarity: 'common',
    emoji: '🐔',
    color: '#ea580c',
    description: 'Кудахчет и всегда куда-то торопится.',
    cost: 150,
    unlockLevel: 1,
  },
  {
    id: 'crocodile',
    name: 'Крокодил',
    category: 'animals',
    rarity: 'uncommon',
    emoji: '🐊',
    color: '#16a34a',
    description: 'Опасный хищник с неожиданно добрыми глазами.',
    cost: 350,
    unlockLevel: 2,
  },
  {
    id: 'shark',
    name: 'Акула',
    category: 'animals',
    rarity: 'uncommon',
    emoji: '🦈',
    color: '#0284c7',
    description: 'Грозный морской пловец в поисках приключений.',
    cost: 400,
    unlockLevel: 2,
  },
  {
    id: 'penguin',
    name: 'Пингвин',
    category: 'animals',
    rarity: 'rare',
    emoji: '🐧',
    color: '#334155',
    description: 'Элегантная птица в смокинге с любовью к снегу.',
    cost: 800,
    unlockLevel: 3,
  },
  {
    id: 'capybara',
    name: 'Капибара',
    category: 'animals',
    rarity: 'rare',
    emoji: '🦫',
    color: '#78350f',
    description: 'Абсолютный дзен и спокойствие этого мира.',
    cost: 950,
    unlockLevel: 3,
  },
  {
    id: 'axolotl',
    name: 'Аксолотль',
    category: 'animals',
    rarity: 'epic',
    emoji: '🦎',
    color: '#ec4899',
    description: 'Милейшее розовое существо с постоянной улыбкой.',
    cost: 2200,
    unlockLevel: 4,
  },
  {
    id: 'hamster',
    name: 'Хомяк',
    category: 'animals',
    rarity: 'common',
    emoji: '🐹',
    color: '#d97706',
    description: 'Щёчки полны семечек, готов крутить колесо фортуны.',
    cost: 130,
    unlockLevel: 1,
  },
  {
    id: 'duck',
    name: 'Утка',
    category: 'animals',
    rarity: 'common',
    emoji: '🦆',
    color: '#059669',
    description: 'Крякает, чиллит в пруду и обожает хлебные крошки.',
    cost: 140,
    unlockLevel: 1,
  },
  {
    id: 'frog',
    name: 'Лягушка',
    category: 'animals',
    rarity: 'uncommon',
    emoji: '🐸',
    color: '#16a34a',
    description: 'Знаменитая мемная жабка. По средам приносит удвоенный позитив!',
    cost: 360,
    unlockLevel: 2,
  },
  {
    id: 'monkey',
    name: 'Обезьяна',
    category: 'animals',
    rarity: 'uncommon',
    emoji: '🐒',
    color: '#b45309',
    description: 'Настоящий Монке: обожает суету, прыжки и бананы.',
    cost: 420,
    unlockLevel: 2,
  },
  {
    id: 'panda',
    name: 'Панда',
    category: 'animals',
    rarity: 'rare',
    emoji: '🐼',
    color: '#1e293b',
    description: 'Кушает бамбук, перекатывается с боку на бок и источает дзен.',
    cost: 900,
    unlockLevel: 3,
  },
  {
    id: 'fox',
    name: 'Лиса',
    category: 'animals',
    rarity: 'rare',
    emoji: '🦊',
    color: '#ea580c',
    description: 'Хитрая рыжая мордочка с пушистым хвостом и тысячей уловок.',
    cost: 1050,
    unlockLevel: 3,
  },

  // Fruits (7)
  {
    id: 'banana',
    name: 'Банан',
    category: 'fruits',
    rarity: 'common',
    emoji: '🍌',
    color: '#eab308',
    description: 'Жёлтый, изогнутый и чрезвычайно богатый калием.',
    cost: 80,
    unlockLevel: 1,
  },
  {
    id: 'apple',
    name: 'Яблоко',
    category: 'fruits',
    rarity: 'common',
    emoji: '🍎',
    color: '#ef4444',
    description: 'Сочное красное яблоко прямо с мультяшной яблони.',
    cost: 90,
    unlockLevel: 1,
  },
  {
    id: 'watermelon',
    name: 'Арбуз',
    category: 'fruits',
    rarity: 'uncommon',
    emoji: '🍉',
    color: '#10b981',
    description: 'Гигантская сладкая полосатая ягода.',
    cost: 250,
    unlockLevel: 2,
  },
  {
    id: 'strawberry',
    name: 'Клубника',
    category: 'fruits',
    rarity: 'uncommon',
    emoji: '🍓',
    color: '#f43f5e',
    description: 'Ароматная ягодка с мелкими семенами.',
    cost: 280,
    unlockLevel: 2,
  },
  {
    id: 'pineapple',
    name: 'Ананас',
    category: 'fruits',
    rarity: 'rare',
    emoji: '🍍',
    color: '#ca8a04',
    description: 'Колючий снаружи, но восхитительный внутри.',
    cost: 650,
    unlockLevel: 3,
  },
  {
    id: 'kiwi',
    name: 'Киви',
    category: 'fruits',
    rarity: 'uncommon',
    emoji: '🥝',
    color: '#65a30d',
    description: 'Зелёный мохнатый фрукт с приятной кислинкой.',
    cost: 320,
    unlockLevel: 2,
  },
  {
    id: 'orange',
    name: 'Апельсин',
    category: 'fruits',
    rarity: 'common',
    emoji: '🍊',
    color: '#f97316',
    description: 'Солнечный цитрус, заряженный витамином C.',
    cost: 110,
    unlockLevel: 1,
  },
  {
    id: 'cherry',
    name: 'Вишня',
    category: 'fruits',
    rarity: 'common',
    emoji: '🍒',
    color: '#e11d48',
    description: 'Сладкая пара спелых вишен с сочным рубиновым соком.',
    cost: 95,
    unlockLevel: 1,
  },
  {
    id: 'avocado',
    name: 'Авокадо',
    category: 'fruits',
    rarity: 'uncommon',
    emoji: '🥑',
    color: '#65a30d',
    description: 'Полезный суперфуд и основа мемного правильного питания.',
    cost: 310,
    unlockLevel: 2,
  },

  // Objects (12)
  {
    id: 'sneakers',
    name: 'Кроссовки',
    category: 'objects',
    rarity: 'uncommon',
    emoji: '👟',
    color: '#3b82f6',
    description: 'Стильные турбо-хайповые кроссы для быстрого бега.',
    cost: 300,
    unlockLevel: 2,
  },
  {
    id: 'sunglasses',
    name: 'Очки',
    category: 'objects',
    rarity: 'uncommon',
    emoji: '🕶️',
    color: '#1e293b',
    description: 'Придают +100 к крутости любому существу.',
    cost: 380,
    unlockLevel: 2,
  },
  {
    id: 'pizza',
    name: 'Пицца',
    category: 'objects',
    rarity: 'uncommon',
    emoji: '🍕',
    color: '#ea580c',
    description: 'Горячий кусок пепперони с тянущимся сыром — любимец мемов.',
    cost: 330,
    unlockLevel: 2,
  },
  {
    id: 'burger',
    name: 'Бургер',
    category: 'objects',
    rarity: 'uncommon',
    emoji: '🍔',
    color: '#b45309',
    description: 'Сочный двойной чизбургер прямо с кухни быстрого питания.',
    cost: 350,
    unlockLevel: 2,
  },
  {
    id: 'coffee',
    name: 'Кофе',
    category: 'objects',
    rarity: 'uncommon',
    emoji: '☕',
    color: '#78350f',
    description: 'Бодрящий эспрессо. Без него капибара и коты не просыпаются.',
    cost: 370,
    unlockLevel: 2,
  },
  {
    id: 'skateboard',
    name: 'Скейтборд',
    category: 'objects',
    rarity: 'rare',
    emoji: '🛹',
    color: '#8b5cf6',
    description: 'Для сумасшедших трюков и уличного флекса.',
    cost: 750,
    unlockLevel: 3,
  },
  {
    id: 'guitar',
    name: 'Гитара',
    category: 'objects',
    rarity: 'rare',
    emoji: '🎸',
    color: '#dc2626',
    description: 'Электрогитара для хард-роковых запилов и соло на поляне.',
    cost: 850,
    unlockLevel: 3,
  },
  {
    id: 'gamepad',
    name: 'Геймпад',
    category: 'objects',
    rarity: 'rare',
    emoji: '🎮',
    color: '#6366f1',
    description: 'Джойстик победы для киберспортивных побед без лагов.',
    cost: 920,
    unlockLevel: 3,
  },
  {
    id: 'crown',
    name: 'Корона',
    category: 'objects',
    rarity: 'epic',
    emoji: '👑',
    color: '#eab308',
    description: 'Золотой царский убор для истинных мемных монархов.',
    cost: 2500,
    unlockLevel: 4,
  },
  {
    id: 'diamond',
    name: 'Алмаз',
    category: 'objects',
    rarity: 'epic',
    emoji: '💎',
    color: '#06b6d4',
    description: 'Сверкающий драгоценный камень, переливающийся на солнце.',
    cost: 2700,
    unlockLevel: 4,
  },
  {
    id: 'rocket',
    name: 'Ракета',
    category: 'objects',
    rarity: 'rare',
    emoji: '🚀',
    color: '#ef4444',
    description: 'Реактивное сопло для полёта к звёздам!',
    cost: 1100,
    unlockLevel: 3,
  },
  {
    id: 'backpack',
    name: 'Рюкзак',
    category: 'objects',
    rarity: 'uncommon',
    emoji: '🎒',
    color: '#059669',
    description: 'Вмещает кучу полезного лута и воспоминаний.',
    cost: 340,
    unlockLevel: 2,
  },

  // Elements (8)
  {
    id: 'fire',
    name: 'Огонь',
    category: 'elements',
    rarity: 'rare',
    emoji: '🔥',
    color: '#dc2626',
    description: 'Обжигающая энергия страсти и пламени.',
    cost: 1200,
    unlockLevel: 3,
  },
  {
    id: 'ice',
    name: 'Лёд',
    category: 'elements',
    rarity: 'rare',
    emoji: '🧊',
    color: '#38bdf8',
    description: 'Морозная свежесть, охлаждающая пыл.',
    cost: 1250,
    unlockLevel: 3,
  },
  {
    id: 'bubble',
    name: 'Пузырь',
    category: 'elements',
    rarity: 'rare',
    emoji: '🫧',
    color: '#0ea5e9',
    description: 'Лёгкий переливающийся мыльный шар, летящий на ветру.',
    cost: 1150,
    unlockLevel: 3,
  },
  {
    id: 'electricity',
    name: 'Молния',
    category: 'elements',
    rarity: 'epic',
    emoji: '⚡',
    color: '#eab308',
    description: 'Тысячи вольт чистого искрящегося заряда!',
    cost: 2600,
    unlockLevel: 4,
  },
  {
    id: 'laser',
    name: 'Лазер',
    category: 'elements',
    rarity: 'epic',
    emoji: '🔮',
    color: '#a855f7',
    description: 'Неоновый луч чистой концентрированной энергии.',
    cost: 2750,
    unlockLevel: 4,
  },
  {
    id: 'toxic',
    name: 'Токсин',
    category: 'elements',
    rarity: 'epic',
    emoji: '🧪',
    color: '#84cc16',
    description: 'Зелёный светящийся мутаген из секретной лабы.',
    cost: 2800,
    unlockLevel: 4,
  },
  {
    id: 'space',
    name: 'Космос',
    category: 'elements',
    rarity: 'legendary',
    emoji: '🌌',
    color: '#6366f1',
    description: 'Загадочные космические глубины и звёздная пыль.',
    cost: 6500,
    unlockLevel: 5,
  },
  {
    id: 'rainbow',
    name: 'Радуга',
    category: 'elements',
    rarity: 'secret',
    emoji: '🌈',
    color: '#ec4899',
    description: 'Волшебный спектр счастья и безграничной магии.',
    cost: 15000,
    unlockLevel: 6,
  },
];

export const CREATURES: Creature[] = [
  // COMMON
  {
    id: 'bananacat',
    name: 'Бананокот',
    rarity: 'common',
    emoji: '🐱🍌',
    visualType: 'banana_cat',
    ingredients: ['banana', 'cat'],
    baseIncome: 12,
    baseUpgradePrice: 150,
    maxLevel: 25,
    hint: 'Жёлтый фрукт + пушистый любитель мяукать.',
    description: 'Плачет, когда ему грустно, но приносит отличные монеты!',
  },
  {
    id: 'applepup',
    name: 'Яблопёс',
    rarity: 'common',
    emoji: '🐶🍎',
    visualType: 'apple_pup',
    ingredients: ['apple', 'dog'],
    baseIncome: 14,
    baseUpgradePrice: 180,
    maxLevel: 25,
    hint: 'Хрустящий красный фрукт + преданный щенок.',
    description: 'Весело катится по траве и радостно лает на прохожих.',
  },
  {
    id: 'berrycat',
    name: 'Клубникот',
    rarity: 'common',
    emoji: '🐱🍓',
    visualType: 'berry_cat',
    ingredients: ['strawberry', 'cat'],
    baseIncome: 16,
    baseUpgradePrice: 200,
    maxLevel: 25,
    hint: 'Сладкая красная ягода + кошачья мордочка.',
    description: 'Пахнет летом и оставляет сладкие следы на полянке.',
  },
  {
    id: 'kiwichicken',
    name: 'Кивикурица',
    rarity: 'common',
    emoji: '🐔🥝',
    visualType: 'kiwi_chicken',
    ingredients: ['kiwi', 'chicken'],
    baseIncome: 13,
    baseUpgradePrice: 160,
    maxLevel: 25,
    hint: 'Мохнатый зелёный фрукт + домашняя птица.',
    description: 'Не летает, зато умеет смешно кудахтать и катиться.',
  },
  {
    id: 'orangepup',
    name: 'Апельсинопёс',
    rarity: 'common',
    emoji: '🐶🍊',
    visualType: 'orange_pup',
    ingredients: ['orange', 'dog'],
    baseIncome: 15,
    baseUpgradePrice: 190,
    maxLevel: 25,
    hint: 'Круглый цитрус + игривый пёс.',
    description: 'Брызжет цитрусовым позитивом и гоняется за мячиком.',
  },

  // UNCOMMON
  {
    id: 'melodile',
    name: 'Арбузодил',
    rarity: 'uncommon',
    emoji: '🐊🍉',
    visualType: 'melodile',
    ingredients: ['watermelon', 'crocodile'],
    baseIncome: 35,
    baseUpgradePrice: 420,
    maxLevel: 30,
    hint: 'Полосатая сладкая ягода + зубастый болотный хищник.',
    description: 'Его броня сделана из толстой арбузной корки. Очень сочный!',
  },
  {
    id: 'pineshark',
    name: 'Ананакула',
    rarity: 'uncommon',
    emoji: '🦈🍍',
    visualType: 'pine_shark',
    ingredients: ['pineapple', 'shark'],
    baseIncome: 42,
    baseUpgradePrice: 500,
    maxLevel: 30,
    hint: 'Колючий тропический фрукт + морская гроза.',
    description: 'Острый ананасовый плавник рассекает волны с тропическим шиком.',
  },
  {
    id: 'coolcat',
    name: 'Крутокот',
    rarity: 'uncommon',
    emoji: '🐱🕶️',
    visualType: 'cool_cat',
    ingredients: ['cat', 'sunglasses'],
    baseIncome: 30,
    baseUpgradePrice: 380,
    maxLevel: 30,
    hint: 'Кот + стильный тёмный аксессуар.',
    description: 'Никогда не смотрит на взрыв и шагает в замедленной съёмке.',
  },
  {
    id: 'sneakerdog',
    name: 'Сникердог',
    rarity: 'uncommon',
    emoji: '🐶👟',
    visualType: 'sneaker_dog',
    ingredients: ['dog', 'sneakers'],
    baseIncome: 38,
    baseUpgradePrice: 460,
    maxLevel: 30,
    hint: 'Собака + модная спортивная обувь.',
    description: 'Флексит в оригинальных кроссах и развивает сверхзвуковую скорость.',
  },
  {
    id: 'chickyrocket',
    name: 'Турбо-Курица',
    rarity: 'uncommon',
    emoji: '🐔🚀',
    visualType: 'chicky_rocket',
    ingredients: ['chicken', 'rocket'],
    baseIncome: 45,
    baseUpgradePrice: 550,
    maxLevel: 30,
    hint: 'Курица + космическая тяга.',
    description: 'Первая курица, преодолевшая звуковой барьер!',
  },

  // RARE
  {
    id: 'rocketpenguin',
    name: 'Ракетопингвин',
    rarity: 'rare',
    emoji: '🐧🚀',
    visualType: 'rocket_penguin',
    ingredients: ['penguin', 'rocket'],
    baseIncome: 95,
    baseUpgradePrice: 1100,
    maxLevel: 35,
    hint: 'Птица антарктических льдов + реактивная ракета.',
    description: 'Пингвины не летают? Скажите это его ракетному ранцу!',
  },
  {
    id: 'skaterbara',
    name: 'Скейтобара',
    rarity: 'rare',
    emoji: '🦫🛹',
    visualType: 'skaterbara',
    ingredients: ['capybara', 'skateboard'],
    baseIncome: 110,
    baseUpgradePrice: 1300,
    maxLevel: 35,
    hint: 'Самое спокойное животное + доска на колёсиках.',
    description: 'Делает кикфлип с абсолютно невозмутимым лицом.',
  },
  {
    id: 'sharkboarder',
    name: 'Скейт-Акула',
    rarity: 'rare',
    emoji: '🦈🛹',
    visualType: 'sharkboarder',
    ingredients: ['shark', 'skateboard'],
    baseIncome: 115,
    baseUpgradePrice: 1350,
    maxLevel: 35,
    hint: 'Акула + скейтборд для крутых виражей.',
    description: 'Плывёт прямо по асфальту под уличный хип-хоп.',
  },
  {
    id: 'chilligator',
    name: 'Чиллегатор',
    rarity: 'rare',
    emoji: '🐊🕶️',
    visualType: 'chilligator',
    ingredients: ['crocodile', 'sunglasses'],
    baseIncome: 90,
    baseUpgradePrice: 1050,
    maxLevel: 35,
    hint: 'Зубастый крокодил + стильные солнцезащитные очки.',
    description: 'Загорает на солнышке и раздаёт автографы фанатам.',
  },
  {
    id: 'icecat',
    name: 'Айс-Кот',
    rarity: 'rare',
    emoji: '🐱🧊',
    visualType: 'ice_cat',
    ingredients: ['cat', 'ice'],
    baseIncome: 105,
    baseUpgradePrice: 1250,
    maxLevel: 35,
    hint: 'Кот + ледяная стихия.',
    description: 'Хрустит снежинками и охлаждает атмосферу вокруг себя.',
  },

  // EPIC
  {
    id: 'crownodile',
    name: 'Коронодил',
    rarity: 'epic',
    emoji: '🐊👑',
    visualType: 'crownodile',
    ingredients: ['crocodile', 'crown'],
    baseIncome: 280,
    baseUpgradePrice: 3200,
    maxLevel: 40,
    hint: 'Болотный зверь + золотой символ власти.',
    description: 'Повелитель всех рек и болот. Требует поклонения и пиццу!',
  },
  {
    id: 'astroaxolotl',
    name: 'Астро-Аксолотль',
    rarity: 'epic',
    emoji: '🦎🌌',
    visualType: 'astro_axolotl',
    ingredients: ['axolotl', 'space'],
    baseIncome: 360,
    baseUpgradePrice: 4200,
    maxLevel: 40,
    hint: 'Розовый земноводный милаш + бескрайний космос.',
    description: 'Парит в невесомости и генерирует звёздную пыль.',
  },
  {
    id: 'cybercapy',
    name: 'Кибер-Капибара',
    rarity: 'epic',
    emoji: '🦫⚡',
    visualType: 'cyber_capy',
    ingredients: ['capybara', 'electricity'],
    baseIncome: 340,
    baseUpgradePrice: 3900,
    maxLevel: 40,
    hint: 'Капибара + электрический разряд.',
    description: 'Питается от розетки, излучает неоновые молнии и умиротворение.',
  },
  {
    id: 'fireshark',
    name: 'Огненная Акула',
    rarity: 'epic',
    emoji: '🦈🔥',
    visualType: 'fire_shark',
    ingredients: ['shark', 'fire'],
    baseIncome: 380,
    baseUpgradePrice: 4500,
    maxLevel: 40,
    hint: 'Морской хищник + палящее пламя.',
    description: 'Кипятит воду вокруг себя и освещает глубочайшие бездны.',
  },

  // LEGENDARY
  {
    id: 'cosmicpenguin',
    name: 'Космический Пингвин',
    rarity: 'legendary',
    emoji: '🐧🌌',
    visualType: 'cosmic_penguin',
    ingredients: ['penguin', 'space'],
    baseIncome: 850,
    baseUpgradePrice: 10000,
    maxLevel: 50,
    hint: 'Пингвин + космическая пустота.',
    description: 'Создал собственную галактику из замороженной рыбы.',
  },
  {
    id: 'phoenixchicken',
    name: 'Курица-Феникс',
    rarity: 'legendary',
    emoji: '🐔🔥',
    visualType: 'phoenix_chicken',
    ingredients: ['chicken', 'fire'],
    baseIncome: 780,
    baseUpgradePrice: 9000,
    maxLevel: 50,
    hint: 'Курица + вечное пламя перерождения.',
    description: 'Возрождается из горячего пепла ещё более мемной!',
  },
  {
    id: 'kingcat',
    name: 'Император Кот',
    rarity: 'legendary',
    emoji: '🐱👑',
    visualType: 'king_cat',
    ingredients: ['cat', 'crown'],
    baseIncome: 920,
    baseUpgradePrice: 11000,
    maxLevel: 50,
    hint: 'Кот + королевская корона.',
    description: 'Все мы лишь слуги в его безграничной кошачьей империи.',
  },

  // SECRET
  {
    id: 'gigacapy',
    name: 'Гигачад Капибара',
    rarity: 'secret',
    emoji: '🦫👑',
    visualType: 'giga_capy',
    ingredients: ['capybara', 'crown'],
    baseIncome: 2500,
    baseUpgradePrice: 30000,
    maxLevel: 50,
    hint: 'Секретная королевская комбинация вселенского спокойствия.',
    description: 'Истинный владыка мемов. Его чилл превосходит законы физики.',
  },
  {
    id: 'rainbowcat',
    name: 'Радужный Нян',
    rarity: 'secret',
    emoji: '🐱🌈',
    visualType: 'rainbow_cat',
    ingredients: ['cat', 'rainbow'],
    baseIncome: 3500,
    baseUpgradePrice: 40000,
    maxLevel: 50,
    hint: 'Кот + волшебный спектр бесконечной радуги.',
    description: 'Летит сквозь пространство, оставляя бесконечный сладкий след!',
  },

  // NEW CREATURES
  // Common
  {
    id: 'duckbanana',
    name: 'Бананоутка',
    rarity: 'common',
    emoji: '🦆🍌',
    visualType: 'duck_banana',
    ingredients: ['duck', 'banana'],
    baseIncome: 15,
    baseUpgradePrice: 170,
    maxLevel: 25,
    hint: 'Жёлтый банан + крякающая утка.',
    description: 'Крякает банановым голосом и весело плавает в фруктовом соке.',
  },
  {
    id: 'cherrycat',
    name: 'Вишнекот',
    rarity: 'common',
    emoji: '🐱🍒',
    visualType: 'cherry_cat',
    ingredients: ['cat', 'cherry'],
    baseIncome: 14,
    baseUpgradePrice: 160,
    maxLevel: 25,
    hint: 'Сладкая вишня + пушистый котик.',
    description: 'Две милые кошачьи мордочки на одной веточке!',
  },
  {
    id: 'duckapple',
    name: 'Яблоутка',
    rarity: 'common',
    emoji: '🦆🍎',
    visualType: 'duck_apple',
    ingredients: ['duck', 'apple'],
    baseIncome: 16,
    baseUpgradePrice: 190,
    maxLevel: 25,
    hint: 'Красное яблоко + весёлая утка.',
    description: 'Хрустящая утка с бодрым яблочным настроением.',
  },

  // Uncommon
  {
    id: 'pizzacat',
    name: 'Пиццакот',
    rarity: 'uncommon',
    emoji: '🐱🍕',
    visualType: 'pizza_cat',
    ingredients: ['cat', 'pizza'],
    baseIncome: 36,
    baseUpgradePrice: 440,
    maxLevel: 30,
    hint: 'Кот + горячий кусок пиццы с сыром.',
    description: 'Охотится за коробками от пиццы и сладко спит прямо на сыре.',
  },
  {
    id: 'burgerdog',
    name: 'Бургердог',
    rarity: 'uncommon',
    emoji: '🐶🍔',
    visualType: 'burger_dog',
    ingredients: ['dog', 'burger'],
    baseIncome: 39,
    baseUpgradePrice: 480,
    maxLevel: 30,
    hint: 'Собака + сочный аппетитный бургер.',
    description: 'Самый вкусный мальчик на районе. Обожает кунжутные булочки.',
  },
  {
    id: 'chillduck',
    name: 'Чиллутка',
    rarity: 'uncommon',
    emoji: '🦆🕶️',
    visualType: 'chill_duck',
    ingredients: ['duck', 'sunglasses'],
    baseIncome: 32,
    baseUpgradePrice: 400,
    maxLevel: 30,
    hint: 'Утка + тёмные солнцезащитные очки.',
    description: 'Невозмутимо скользит по волнам, раздавая крякающий стиль.',
  },
  {
    id: 'coffeecapy',
    name: 'Кофебара',
    rarity: 'uncommon',
    emoji: '🦫☕',
    visualType: 'coffee_capy',
    ingredients: ['capybara', 'coffee'],
    baseIncome: 46,
    baseUpgradePrice: 560,
    maxLevel: 30,
    hint: 'Капибара + бодрящая чашка кофе.',
    description: 'Единственная в мире капибара на кофеине, готовая флексить 24/7!',
  },
  {
    id: 'monkeyskate',
    name: 'Монке-Скейтер',
    rarity: 'uncommon',
    emoji: '🐒🛹',
    visualType: 'monkey_skate',
    ingredients: ['monkey', 'skateboard'],
    baseIncome: 44,
    baseUpgradePrice: 530,
    maxLevel: 30,
    hint: 'Обезьянка + скейтборд для трюков.',
    description: 'Крутит сальто на доске и улюлюкает от восторга.',
  },
  {
    id: 'frogavocado',
    name: 'Авокадо-Жабка',
    rarity: 'uncommon',
    emoji: '🐸🥑',
    visualType: 'frog_avocado',
    ingredients: ['frog', 'avocado'],
    baseIncome: 38,
    baseUpgradePrice: 470,
    maxLevel: 30,
    hint: 'Зелёная лягушка + спелое авокадо.',
    description: 'Идеально зелёная и полезная жаба для питательного чилла.',
  },

  // Rare
  {
    id: 'rockhamster',
    name: 'Рок-Хомяк',
    rarity: 'rare',
    emoji: '🐹🎸',
    visualType: 'rock_hamster',
    ingredients: ['hamster', 'guitar'],
    baseIncome: 100,
    baseUpgradePrice: 1200,
    maxLevel: 35,
    hint: 'Хомячок + звонкая электрогитара.',
    description: 'Лапками выдаёт соло на 200 BPM прямо в своём колесе!',
  },
  {
    id: 'gamerfrog',
    name: 'Геймер-Пепе',
    rarity: 'rare',
    emoji: '🐸🎮',
    visualType: 'gamer_frog',
    ingredients: ['frog', 'gamepad'],
    baseIncome: 110,
    baseUpgradePrice: 1300,
    maxLevel: 35,
    hint: 'Лягушка + игровой геймпад.',
    description: 'Никогда не проигрывает мид и стримит на все пруды округи.',
  },
  {
    id: 'avocadopanda',
    name: 'Пандавокадо',
    rarity: 'rare',
    emoji: '🐼🥑',
    visualType: 'avocado_panda',
    ingredients: ['panda', 'avocado'],
    baseIncome: 120,
    baseUpgradePrice: 1400,
    maxLevel: 35,
    hint: 'Неуклюжая панда + полезное авокадо.',
    description: 'Косточка авокадо заменяет ей любимый мячик для игр.',
  },
  {
    id: 'firefox',
    name: 'Огнелис',
    rarity: 'rare',
    emoji: '🦊🔥',
    visualType: 'fire_fox',
    ingredients: ['fox', 'fire'],
    baseIncome: 130,
    baseUpgradePrice: 1500,
    maxLevel: 35,
    hint: 'Рыжая лисичка + пылающее пламя.',
    description: 'Легендарный браузерный мем во плоти! Согревает всю поляну.',
  },
  {
    id: 'duckrocket',
    name: 'Турбо-Селезень',
    rarity: 'rare',
    emoji: '🦆🚀',
    visualType: 'duck_rocket',
    ingredients: ['duck', 'rocket'],
    baseIncome: 125,
    baseUpgradePrice: 1450,
    maxLevel: 35,
    hint: 'Утка + реактивная ракета.',
    description: 'Перелёт на юг за доли секунды с космическим кряканьем!',
  },

  // Epic
  {
    id: 'diamondfox',
    name: 'Алмазный Лис',
    rarity: 'epic',
    emoji: '🦊💎',
    visualType: 'diamond_fox',
    ingredients: ['fox', 'diamond'],
    baseIncome: 320,
    baseUpgradePrice: 3800,
    maxLevel: 40,
    hint: 'Хитрый лис + сверкающий алмаз.',
    description: 'Блестит так ярко, что его видно с околоземной орбиты.',
  },
  {
    id: 'bubbleaxolotl',
    name: 'Пузырьковый Аксолотль',
    rarity: 'epic',
    emoji: '🦎🫧',
    visualType: 'bubble_axolotl',
    ingredients: ['axolotl', 'bubble'],
    baseIncome: 350,
    baseUpgradePrice: 4100,
    maxLevel: 40,
    hint: 'Розовый аксолотль + невесомый пузырь.',
    description: 'Парит внутри огромного переливающегося пузыря и пускает сердечки.',
  },
  {
    id: 'laserhamster',
    name: 'Лазерный Хомяк',
    rarity: 'epic',
    emoji: '🐹🔮',
    visualType: 'laser_hamster',
    ingredients: ['hamster', 'laser'],
    baseIncome: 370,
    baseUpgradePrice: 4300,
    maxLevel: 40,
    hint: 'Хомяк + лазерный заряд.',
    description: 'Его щёки стреляют концентрированными пучками мемной плазмы!',
  },
  {
    id: 'cyberfrog',
    name: 'Кибер-Жаба',
    rarity: 'epic',
    emoji: '🐸⚡',
    visualType: 'cyber_frog',
    ingredients: ['frog', 'electricity'],
    baseIncome: 340,
    baseUpgradePrice: 3900,
    maxLevel: 40,
    hint: 'Лягушка + мощный электрический разряд.',
    description: 'Посылает гипертекстовые кваканья по оптическим кабелям.',
  },

  // Legendary
  {
    id: 'pandarock',
    name: 'Панда-Рокер',
    rarity: 'legendary',
    emoji: '🐼🎸',
    visualType: 'panda_rock',
    ingredients: ['panda', 'guitar'],
    baseIncome: 880,
    baseUpgradePrice: 10500,
    maxLevel: 50,
    hint: 'Панда + стадионная рок-гитара.',
    description: 'Собирает полные стадионы зверей и ломает бамбуковые медиаторы.',
  },
  {
    id: 'spacefox',
    name: 'Космолис',
    rarity: 'legendary',
    emoji: '🦊🌌',
    visualType: 'space_fox',
    ingredients: ['fox', 'space'],
    baseIncome: 950,
    baseUpgradePrice: 11500,
    maxLevel: 50,
    hint: 'Лиса + бесконечные звёздные глубины.',
    description: 'Хранит созвездия в своём хвосте и бегает между галактиками.',
  },

  // Secret
  {
    id: 'diamondcapy',
    name: 'Алмазный Капибарон',
    rarity: 'secret',
    emoji: '🦫💎',
    visualType: 'diamond_capy',
    ingredients: ['capybara', 'diamond'],
    baseIncome: 3000,
    baseUpgradePrice: 35000,
    maxLevel: 50,
    hint: 'Абсолютный дзен капибары + чистейший вечный алмаз.',
    description: 'Самый богатый и спокойный джентльмен во всей мемной вселенной.',
  },

  // ==========================================
  // 🧬 HYBRID & MEGA-FUSION CREATURES (Скрещивание существ)
  // ==========================================
  {
    id: 'bananacat_applepup',
    name: 'Фруктовый Мяу-Пёс',
    rarity: 'uncommon',
    emoji: '🐱🍎',
    visualType: 'bananacat_applepup',
    ingredients: ['bananacat', 'applepup'],
    baseIncome: 30,
    baseUpgradePrice: 360,
    maxLevel: 30,
    hint: 'Скрести Бананокота 🍌 и Яблопса 🐶',
    description: 'Вечный спор кошатников и собачников решён в сладкой фруктовой гармонии!',
    isFusion: true,
    fusionParents: ['bananacat', 'applepup'],
  },
  {
    id: 'duckbanana_frogavocado',
    name: 'Авокадо-Уткожаб',
    rarity: 'uncommon',
    emoji: '🦆🥑',
    visualType: 'duckbanana_frogavocado',
    ingredients: ['duckbanana', 'frogavocado'],
    baseIncome: 42,
    baseUpgradePrice: 500,
    maxLevel: 30,
    hint: 'Скрести Бананоутку 🍌 и Авокадо-Жабку 🥑',
    description: 'Крякает и квакает на питательной бананово-авокадной диете!',
    isFusion: true,
    fusionParents: ['duckbanana', 'frogavocado'],
  },
  {
    id: 'coolcat_rockhamster',
    name: 'Рок-Кот в Очках',
    rarity: 'rare',
    emoji: '🐱🎸',
    visualType: 'coolcat_rockhamster',
    ingredients: ['coolcat', 'rockhamster'],
    baseIncome: 95,
    baseUpgradePrice: 1100,
    maxLevel: 35,
    hint: 'Скрести Крутокота 🕶️ и Рок-Хомяка 🎸',
    description: 'Фронтмен главной мем-рок группы на полянке. Собирает полные стадионы!',
    isFusion: true,
    fusionParents: ['coolcat', 'rockhamster'],
  },
  {
    id: 'burgerdog_pizzacat',
    name: 'Фастфуд Кот-и-Пёс',
    rarity: 'rare',
    emoji: '🐶🍕',
    visualType: 'burgerdog_pizzacat',
    ingredients: ['burgerdog', 'pizzacat'],
    baseIncome: 110,
    baseUpgradePrice: 1300,
    maxLevel: 35,
    hint: 'Скрести Бургердога 🍔 и Пиццакота 🍕',
    description: 'Пиццакот верхом на бургердоге: сытно, вкусно и прибыльно!',
    isFusion: true,
    fusionParents: ['burgerdog', 'pizzacat'],
  },
  {
    id: 'sneakerdog_monkeyskate',
    name: 'Турбо-Стрит Догги',
    rarity: 'rare',
    emoji: '🐶🛹',
    visualType: 'sneakerdog_monkeyskate',
    ingredients: ['sneakerdog', 'monkeyskate'],
    baseIncome: 120,
    baseUpgradePrice: 1400,
    maxLevel: 35,
    hint: 'Скрести Сникердога 👟 и Монке-Скейтера 🛹',
    description: 'Флексит в кроссовках на доске, собирая лайки со всей мемной полянки!',
    isFusion: true,
    fusionParents: ['sneakerdog', 'monkeyskate'],
  },
  {
    id: 'coolcat_avocadopanda',
    name: 'Авокадо-Крутокот',
    rarity: 'epic',
    emoji: '🐱🥑',
    visualType: 'coolcat_avocadopanda',
    ingredients: ['coolcat', 'avocadopanda'],
    baseIncome: 360,
    baseUpgradePrice: 4200,
    maxLevel: 40,
    hint: 'Скрести Крутокота 🕶️ и Пандавокадо 🥑',
    description: 'Крутокот одолжил очки у авокадо-панды: супер-чилл, стиль и отличные доходы!',
    isFusion: true,
    fusionParents: ['coolcat', 'avocadopanda'],
  },
  {
    id: 'melodile_pineshark',
    name: 'Арбузо-Акулодил',
    rarity: 'epic',
    emoji: '🐊🍍',
    visualType: 'melodile_pineshark',
    ingredients: ['melodile', 'pineshark'],
    baseIncome: 390,
    baseUpgradePrice: 4500,
    maxLevel: 40,
    hint: 'Скрести Арбузодила 🍉 и Ананакулу 🦈',
    description: 'Двойной тропический хищник в арбузной броне и с ананасовым плавником!',
    isFusion: true,
    fusionParents: ['melodile', 'pineshark'],
  },
  {
    id: 'coffeecapy_rockhamster',
    name: 'Кофе-Рок Капибара',
    rarity: 'epic',
    emoji: '🦫🎸',
    visualType: 'coffeecapy_rockhamster',
    ingredients: ['coffeecapy', 'rockhamster'],
    baseIncome: 410,
    baseUpgradePrice: 4700,
    maxLevel: 40,
    hint: 'Скрести Кофебару ☕ и Рок-Хомяка 🎸',
    description: 'Капибара на тройном эспрессо с электрогитарой выдаёт легендарное рок-соло!',
    isFusion: true,
    fusionParents: ['coffeecapy', 'rockhamster'],
  },
  {
    id: 'avocadopanda_coffeecapy',
    name: 'Дзен-Панда Кофебара',
    rarity: 'epic',
    emoji: '🐼☕',
    visualType: 'avocadopanda_coffeecapy',
    ingredients: ['avocadopanda', 'coffeecapy'],
    baseIncome: 380,
    baseUpgradePrice: 4400,
    maxLevel: 40,
    hint: 'Скрести Пандавокадо 🥑 и Кофебару ☕',
    description: 'Идеальный баланс: питается авокадо, пьёт кофе и излучает вселенский дзен.',
    isFusion: true,
    fusionParents: ['avocadopanda', 'coffeecapy'],
  },
  {
    id: 'chickyrocket_skaterbara',
    name: 'Турбо-Скейтокурица',
    rarity: 'epic',
    emoji: '🐔🛹',
    visualType: 'chickyrocket_skaterbara',
    ingredients: ['chickyrocket', 'skaterbara'],
    baseIncome: 420,
    baseUpgradePrice: 4800,
    maxLevel: 40,
    hint: 'Скрести Турбо-Курицу 🚀 и Скейтобару 🛹',
    description: 'Несётся на реактивном скейте со скоростью света, исполняя безумные трюки!',
    isFusion: true,
    fusionParents: ['chickyrocket', 'skaterbara'],
  },
  {
    id: 'diamondfox_cyberfrog',
    name: 'Кибер-Алмазная Лиса',
    rarity: 'legendary',
    emoji: '🦊⚡',
    visualType: 'diamondfox_cyberfrog',
    ingredients: ['diamondfox', 'cyberfrog'],
    baseIncome: 890,
    baseUpgradePrice: 10500,
    maxLevel: 50,
    hint: 'Скрести Алмазного Лиса 💎 и Кибер-Жабу ⚡',
    description: 'Неоновая лисица с алмазными кристаллами, генерирующая коины прямо из сети!',
    isFusion: true,
    fusionParents: ['diamondfox', 'cyberfrog'],
  },
  {
    id: 'laserhamster_pineshark',
    name: 'Лазерная Мега-Акула',
    rarity: 'legendary',
    emoji: '🦈🔮',
    visualType: 'laserhamster_pineshark',
    ingredients: ['laserhamster', 'pineshark'],
    baseIncome: 920,
    baseUpgradePrice: 11000,
    maxLevel: 50,
    hint: 'Скрести Лазерного Хомяка 🐹 и Ананакулу 🦈',
    description: 'Стреляет плазменными лучами из ананасового плавника под бодрый мемный бит!',
    isFusion: true,
    fusionParents: ['laserhamster', 'pineshark'],
  },
  {
    id: 'bubbleaxolotl_icecat',
    name: 'Ледяной Пузырекотль',
    rarity: 'legendary',
    emoji: '🦎🧊',
    visualType: 'bubbleaxolotl_icecat',
    ingredients: ['bubbleaxolotl', 'icecat'],
    baseIncome: 940,
    baseUpgradePrice: 11200,
    maxLevel: 50,
    hint: 'Скрести Пузырькового Аксолотля 🫧 и Айс-Кота 🧊',
    description: 'Пускает морозные светящиеся пузыри со звонким хрустальным мурлыканьем!',
    isFusion: true,
    fusionParents: ['bubbleaxolotl', 'icecat'],
  },
  {
    id: 'firefox_chilligator',
    name: 'Пламенный Чиллегатор',
    rarity: 'legendary',
    emoji: '🐊🔥',
    visualType: 'firefox_chilligator',
    ingredients: ['firefox', 'chilligator'],
    baseIncome: 900,
    baseUpgradePrice: 10800,
    maxLevel: 50,
    hint: 'Скрести Огнелиса 🔥 и Чиллегатора 🕶️',
    description: 'Греется в лучах славы, попивая холодный лимонад посреди языков пламени!',
    isFusion: true,
    fusionParents: ['firefox', 'chilligator'],
  },
  {
    id: 'astroaxolotl_cosmicpenguin',
    name: 'Звёздный Пингво-Аксолотль',
    rarity: 'legendary',
    emoji: '🦎🐧',
    visualType: 'astroaxolotl_cosmicpenguin',
    ingredients: ['astroaxolotl', 'cosmicpenguin'],
    baseIncome: 980,
    baseUpgradePrice: 11800,
    maxLevel: 50,
    hint: 'Скрести Астро-Аксолотля 🌌 и Космического Пингвина 🐧',
    description: 'Парят в невесомости, создавая новые созвездия из космических кристаллов!',
    isFusion: true,
    fusionParents: ['astroaxolotl', 'cosmicpenguin'],
  },
  {
    id: 'bananacat_diamondcapy',
    name: 'Алмазный Банано-Капи',
    rarity: 'secret',
    emoji: '🦫🍌',
    visualType: 'bananacat_diamondcapy',
    ingredients: ['bananacat', 'diamondcapy'],
    baseIncome: 2800,
    baseUpgradePrice: 32000,
    maxLevel: 50,
    hint: 'Скрести Бананокота 🍌 и Алмазного Капибарона 💎',
    description: 'Вместо слёз плачет чистейшими алмазами и осыпает поляну золотом!',
    isFusion: true,
    fusionParents: ['bananacat', 'diamondcapy'],
  },
  {
    id: 'spacefox_rainbowcat',
    name: 'Галактический Радуголис',
    rarity: 'secret',
    emoji: '🦊🌈',
    visualType: 'spacefox_rainbowcat',
    ingredients: ['spacefox', 'rainbowcat'],
    baseIncome: 3600,
    baseUpgradePrice: 42000,
    maxLevel: 50,
    hint: 'Скрести Космолиса 🌌 и Радужного Няна 🌈',
    description: 'Летит сквозь галактики, оставляя бесконечный радужно-звёздный шлейф!',
    isFusion: true,
    fusionParents: ['spacefox', 'rainbowcat'],
  },
  {
    id: 'kingcat_gigacapy',
    name: 'Император Гига-Мемов',
    rarity: 'secret',
    emoji: '🦫👑',
    visualType: 'kingcat_gigacapy',
    ingredients: ['kingcat', 'gigacapy'],
    baseIncome: 4200,
    baseUpgradePrice: 50000,
    maxLevel: 50,
    hint: 'Скрести Императора Кота 👑 и Гигачад Капибару 👑',
    description: 'Абсолютный верховный правитель вселенной мемов. Непревзойдённая мощь!',
    isFusion: true,
    fusionParents: ['kingcat', 'gigacapy'],
  },
];

export const ZONES: Zone[] = [
  {
    id: 1,
    name: 'Зелёная Поляна',
    price: 0,
    requiredLevel: 1,
    maxCreatures: 5,
    backgroundTheme: 'from-emerald-900/60 to-slate-900',
    description: 'Уютная полянка перед лабораторией (5 мест для существ на старте).',
  },
  {
    id: 2,
    name: 'Тропическое Побережье',
    price: 2500,
    requiredLevel: 3,
    maxCreatures: 5,
    backgroundTheme: 'from-teal-900/70 to-emerald-950',
    description: 'Песчаный пляж с пальмами и шумом прибоя (+5 мест для существ).',
  },
  {
    id: 3,
    name: 'Неоновый Киберпарк',
    price: 12000,
    requiredLevel: 5,
    maxCreatures: 5,
    backgroundTheme: 'from-purple-950 to-indigo-950',
    description: 'Светящиеся вывески, синтезаторные волны и стиль будущего (+5 мест для существ).',
  },
  {
    id: 4,
    name: 'Лавовые Земли',
    price: 35000,
    requiredLevel: 7,
    maxCreatures: 5,
    backgroundTheme: 'from-orange-950 via-red-950 to-slate-950',
    description: 'Пылающие магматические гейзеры и огненные скалы (+5 мест для существ).',
  },
  {
    id: 5,
    name: 'Космический Оазис',
    price: 75000,
    requiredLevel: 9,
    maxCreatures: 5,
    backgroundTheme: 'from-violet-950 via-slate-950 to-blue-950',
    description: 'Плавучая станция среди звёзд (+5 мест для существ, максимум 25 мест).',
  },
];

export const MYSTERY_BOXES: MysteryBox[] = [
  {
    id: 'basic_box',
    name: 'Обычная Коробка',
    cost: 500,
    icon: '📦',
    color: '#3b82f6',
    chances: {
      common: 0.75,
      uncommon: 0.25,
    },
    guaranteedCount: 1,
    description: 'Содержит 1-2 случайных базовых ингредиента.',
  },
  {
    id: 'super_box',
    name: 'Супер Коробка',
    cost: 2500,
    icon: '🎁',
    color: '#a855f7',
    chances: {
      uncommon: 0.55,
      rare: 0.38,
      epic: 0.07,
    },
    guaranteedCount: 2,
    description: 'Повышенный шанс на редкие и эпические ингредиенты!',
  },
  {
    id: 'mega_box',
    name: 'Мега Коробка',
    cost: 10000,
    icon: '💎',
    color: '#f97316',
    chances: {
      rare: 0.4,
      epic: 0.48,
      legendary: 0.12,
    },
    guaranteedCount: 3,
    description: '3 ценных ингредиента с шансом на космические элементы!',
  },
  {
    id: 'cosmic_box',
    name: 'Космическая Коробка',
    cost: 40000,
    icon: '🌌',
    color: '#ec4899',
    chances: {
      epic: 0.5,
      legendary: 0.38,
      secret: 0.12,
    },
    guaranteedCount: 3,
    description: 'Легендарные силы и единственный путь к Радуге!',
  },
];

export const BOOSTERS: BoosterItem[] = [
  {
    id: 'double_income',
    name: 'Золотой свисток (x2 Доход)',
    emoji: '⚡',
    type: 'active_timer',
    durationSec: 300, // 5 minutes per ad watch
    cost: 0,
    requiredLevel: 1,
    isAdReward: true,
    bonusBadge: 'x2 Доход (5 мин)',
    description: 'Посмотри короткую рекламу спонсора и удвой прибыль всех существ на 5 минут! Можно продлевать.',
  },
  {
    id: 'fast_spawn',
    name: 'Энергетик спавна (x3 частота)',
    emoji: '🧪',
    type: 'active_timer',
    durationSec: 300, // 5 minutes per ad watch
    cost: 0,
    requiredLevel: 1,
    isAdReward: true,
    bonusBadge: 'Спавн каждые 5 сек (5 мин)',
    description: 'Посмотри короткую рекламу спонсора: дикие ингредиенты появляются на полянке в 3 раза быстрее на 5 минут!',
  },
  {
    id: 'super_lucky',
    name: 'Мемная Удача (x2 Редкость)',
    emoji: '🍀',
    type: 'active_timer',
    durationSec: 300, // 5 minutes per ad watch
    cost: 0,
    requiredLevel: 1,
    isAdReward: true,
    bonusBadge: 'x2 Шанс мутаций (5 мин)',
    description: 'Посмотри короткую рекламу спонсора: повышенный шанс редких мутантов и ценных открытий в Лаборатории на 5 минут!',
  },
  {
    id: 'auto_collector',
    name: 'Дрон-Автосборщик',
    emoji: '🤖',
    type: 'permanent',
    cost: 5000,
    requiredLevel: 2,
    bonusBadge: 'Автосбор 24/7',
    description: 'Автоматически и мгновенно собирает все предметы и фрукты, появляющиеся на полянке. Ни один ингредиент не пропадёт!',
  },
  {
    id: 'golden_touch',
    name: 'Ласковая лапа (x5 за клик)',
    emoji: '🐾',
    type: 'permanent',
    cost: 3500,
    requiredLevel: 1,
    bonusBadge: 'x5 за поглаживание',
    description: 'Каждое поглаживание и тап по существу на полянке приносит в 5 раз больше золотых монет!',
  },
  {
    id: 'happy_flask',
    name: 'Колба мудрости (+50% Опыта)',
    emoji: '✨',
    type: 'permanent',
    cost: 7500,
    requiredLevel: 3,
    bonusBadge: '+50% XP за синтез',
    description: 'Даёт +50% дополнительного опыта аккаунта за каждое скрещивание мемов в лаборатории!',
  },
  {
    id: 'coin_magnet',
    name: 'Мемный магнит (+25% Доход)',
    emoji: '🧲',
    type: 'permanent',
    cost: 12000,
    requiredLevel: 4,
    bonusBadge: '+25% к пассивному доходу',
    description: 'Увеличивает пассивную добычу монет всех существ на +25% навсегда на всех локациях!',
  },
];

export const QUESTS: Quest[] = [
  {
    id: 'q1_first_meme',
    title: 'Первый Эксперимент',
    description: 'Скрести 2 ингредиента в Лаборатории',
    type: 'mix_count',
    target: 1,
    category: 'beginner',
    icon: '🧪',
    reward: { coins: 250, xp: 15 },
  },
  {
    id: 'q2_collect_fruits',
    title: 'Охотник за лутом',
    description: 'Подбери 5 диких ингредиентов на полянке',
    type: 'pick_map_item',
    target: 5,
    category: 'beginner',
    icon: '🍎',
    reward: { coins: 350, xp: 20, boxId: 'basic_box' },
  },
  {
    id: 'q3_three_memes',
    title: 'Начинающий заводчик',
    description: 'Открой 3 уникальных существа в коллекции',
    type: 'creature_count',
    target: 3,
    category: 'beginner',
    icon: '🐱',
    reward: { coins: 500, xp: 25 },
  },
  {
    id: 'q4_pet_creature',
    title: 'Ласковые лапки',
    description: 'Погладь существ на полянке 10 раз (кликни по ним)',
    type: 'pet_count',
    target: 10,
    category: 'beginner',
    icon: '🐾',
    reward: { coins: 350, xp: 20 },
  },
  {
    id: 'q5_upgrade_creature',
    title: 'Турбо Прокачка',
    description: 'Прокачай уровень любого существа до 3 уровня',
    type: 'upgrade_level',
    target: 3,
    category: 'beginner',
    icon: '⚡',
    reward: { coins: 500, xp: 25 },
  },
  {
    id: 'q6_five_memes',
    title: 'Мемное поселение',
    description: 'Размести не менее 5 существ на территории',
    type: 'placed_count',
    target: 5,
    category: 'territory',
    icon: '🏕️',
    reward: { coins: 700, xp: 30 },
  },
  {
    id: 'q7_open_box',
    title: 'Таинственный Сюрприз',
    description: 'Открой любую коробку с сюрпризом в Магазине',
    type: 'open_box',
    target: 1,
    category: 'beginner',
    icon: '📦',
    reward: { coins: 600, xp: 25, boxId: 'basic_box' },
  },
  {
    id: 'q8_watch_ad',
    title: 'Спонсорский друг',
    description: 'Посмотри рекламный ролик для буста или монет',
    type: 'ad_watch',
    target: 1,
    category: 'beginner',
    icon: '📺',
    reward: { coins: 500, xp: 20 },
  },
  {
    id: 'q9_ten_mixes',
    title: 'Серийный Алхимик',
    description: 'Проведи 10 скрещиваний в Лаборатории',
    type: 'mix_count',
    target: 10,
    category: 'alchemy',
    icon: '⚗️',
    reward: { coins: 900, xp: 35 },
  },
  {
    id: 'q10_ten_creatures',
    title: 'Зоолог Меметики',
    description: 'Открой 10 уникальных существ в каталоге',
    type: 'creature_count',
    target: 10,
    category: 'alchemy',
    icon: '📖',
    reward: { coins: 1200, xp: 40, boxId: 'super_box' },
  },
  {
    id: 'q11_pet_master',
    title: 'Любимец питомцев',
    description: 'Погладь существ на полянке 50 раз',
    type: 'pet_count',
    target: 50,
    category: 'territory',
    icon: '💖',
    reward: { coins: 800, xp: 30 },
  },
  {
    id: 'q12_collect_25_items',
    title: 'Пылесос ингредиентов',
    description: 'Подбери 25 диких предметов на полянке',
    type: 'pick_map_item',
    target: 25,
    category: 'territory',
    icon: '🍄',
    reward: { coins: 1000, xp: 35 },
  },
  {
    id: 'q13_creature_level_5',
    title: 'Элита Фауны',
    description: 'Прокачай уровень любого питомца до 5 уровня',
    type: 'upgrade_level',
    target: 5,
    category: 'territory',
    icon: '⭐',
    reward: { coins: 1100, xp: 40 },
  },
  {
    id: 'q14_unlock_zone_2',
    title: 'Покоритель Побережья',
    description: 'Разблокируй вторую локацию (Тропическое Побережье) — получи +5 мест',
    type: 'zone_count',
    target: 2,
    category: 'territory',
    icon: '🏖️',
    reward: { coins: 1500, xp: 45 },
  },
  {
    id: 'q15_open_3_boxes',
    title: 'Охотник за сундуками',
    description: 'Открой 3 коробки с сюрпризом',
    type: 'open_box',
    target: 3,
    category: 'master',
    icon: '🎁',
    reward: { coins: 1400, xp: 40 },
  },
  {
    id: 'q16_watch_3_ads',
    title: 'Энергетический бафф',
    description: 'Активируй 3 буста или бонуса за рекламу',
    type: 'ad_watch',
    target: 3,
    category: 'master',
    icon: '🔥',
    reward: { coins: 1000, xp: 35 },
  },
  {
    id: 'q17_ten_placed',
    title: 'Мегаполис Покемемов',
    description: 'Засели 10 существ на своих территориях',
    type: 'placed_count',
    target: 10,
    category: 'territory',
    icon: '🏰',
    reward: { coins: 1600, xp: 45 },
  },
  {
    id: 'q18_twenty_creatures',
    title: 'Магистр Селекции',
    description: 'Открой 20 уникальных существ в каталоге',
    type: 'creature_count',
    target: 20,
    category: 'alchemy',
    icon: '🏆',
    reward: { coins: 2500, xp: 60, boxId: 'mega_box' },
  },
  {
    id: 'q19_twenty_five_mixes',
    title: 'Безумный Учёный',
    description: 'Проведи 25 скрещиваний в Лаборатории',
    type: 'mix_count',
    target: 25,
    category: 'alchemy',
    icon: '🔮',
    reward: { coins: 2000, xp: 50 },
  },
  {
    id: 'q20_earn_coins_10k',
    title: 'Золотой Накопитель',
    description: 'Накопи 10 000 золотых монет на балансе',
    type: 'earn_coins',
    target: 10000,
    category: 'master',
    icon: '💰',
    reward: { coins: 2000, xp: 55 },
  },
  {
    id: 'q21_unlock_zone_3',
    title: 'Покоритель Неона',
    description: 'Разблокируй третью локацию (Неоновый Киберпарк) — получи +5 мест',
    type: 'zone_count',
    target: 3,
    category: 'territory',
    icon: '🌃',
    reward: { coins: 3000, xp: 65 },
  },
  {
    id: 'q22_creature_level_10',
    title: 'Легендарный Питомец',
    description: 'Прокачай существо до 10 уровня',
    type: 'upgrade_level',
    target: 10,
    category: 'territory',
    icon: '👑',
    reward: { coins: 3000, xp: 70 },
  },
  {
    id: 'q23_pet_150',
    title: 'Абсолютный Друг Мемесов',
    description: 'Погладь существ на полянке 150 раз',
    type: 'pet_count',
    target: 150,
    category: 'territory',
    icon: '🌟',
    reward: { coins: 2500, xp: 50 },
  },
  {
    id: 'q24_thirty_creatures',
    title: 'Легенда Каталога',
    description: 'Открой 30 уникальных видов в Лаборатории',
    type: 'creature_count',
    target: 30,
    category: 'alchemy',
    icon: '💎',
    reward: { coins: 5000, xp: 85 },
  },
  {
    id: 'q25_unlock_zone_4',
    title: 'Повелитель Вселенной',
    description: 'Разблокируй все 5 локаций (достигни Космического Оазиса и лимита 25 мест)',
    type: 'zone_count',
    target: 5,
    category: 'master',
    icon: '🚀',
    reward: { coins: 6000, xp: 100, boxId: 'mega_box' },
  },
  {
    id: 'q26_spin_wheel_1',
    title: 'Первый Спин Фортуны',
    description: 'Покрути Мемное Колесо Фортуны 1 раз',
    type: 'spin_wheel',
    target: 1,
    category: 'beginner',
    icon: '🎡',
    reward: { coins: 1000, xp: 50 },
  },
  {
    id: 'q27_spin_wheel_3',
    title: 'Азартный Исследователь',
    description: 'Покрути Колесо Фортуны 3 раза',
    type: 'spin_wheel',
    target: 3,
    category: 'master',
    icon: '🎰',
    reward: { coins: 2500, xp: 120, boxId: 'super_box' },
  },
  {
    id: 'q28_spin_wheel_7',
    title: 'Любимчик Фортуны',
    description: 'Покрути Колесо Фортуны 7 раз',
    type: 'spin_wheel',
    target: 7,
    category: 'master',
    icon: '👑',
    reward: { coins: 6000, xp: 250, boxId: 'mega_box' },
  },
  {
    id: 'q29_spin_wheel_15',
    title: 'Король Джекпотов',
    description: 'Покрути Колесо Фортуны 15 раз',
    type: 'spin_wheel',
    target: 15,
    category: 'master',
    icon: '💎',
    reward: { coins: 15000, xp: 500, boxId: 'mega_box' },
  },
];

export const DAILY_REWARDS = [
  { day: 1, label: '500 Монет', reward: { coins: 500, xp: 100 }, icon: '🪙' },
  { day: 2, label: 'Обычная Коробка', reward: { boxId: 'basic_box', xp: 150 }, icon: '📦' },
  { day: 3, label: '1 500 Монет', reward: { coins: 1500, xp: 200 }, icon: '🪙' },
  { day: 4, label: 'Супер Коробка', reward: { boxId: 'super_box', xp: 300 }, icon: '🎁' },
  { day: 5, label: 'Редкий Ингредиент', reward: { ingredientId: 'rocket', xp: 400 }, icon: '🚀' },
  { day: 6, label: '3 500 Монет', reward: { coins: 3500, xp: 500 }, icon: '💰' },
  { day: 7, label: 'Мега Коробка!', reward: { boxId: 'mega_box', coins: 5000, xp: 1000 }, icon: '💎' },
];

export function getXpForNextLevel(currentLevel: number): number {
  return Math.floor(GAME_CONFIG.economy.levelXpBase * Math.pow(GAME_CONFIG.economy.levelXpMultiplier, currentLevel - 1));
}

// Alternative intuitive recipe combinations for rich gameplay
export const ALTERNATIVE_RECIPES: Record<string, [string, string][]> = {
  // Cats
  bananacat: [
    ['apple', 'cat'],
    ['banana', 'cat'],
  ],
  berrycat: [
    ['strawberry', 'cat'],
    ['kiwi', 'cat'],
  ],
  coolcat: [
    ['cat', 'sneakers'],
    ['cat', 'backpack'],
  ],
  icecat: [
    ['cat', 'ice'],
    ['cat', 'watermelon'],
  ],
  kingcat: [['cat', 'crown']],
  rainbowcat: [['cat', 'rainbow']],

  // Dogs
  applepup: [
    ['apple', 'dog'],
    ['banana', 'dog'],
  ],
  orangepup: [
    ['orange', 'dog'],
    ['strawberry', 'dog'],
    ['kiwi', 'dog'],
  ],
  sneakerdog: [
    ['dog', 'sneakers'],
    ['dog', 'sunglasses'],
    ['dog', 'skateboard'],
  ],

  // Chickens
  kiwichicken: [
    ['kiwi', 'chicken'],
    ['apple', 'chicken'],
    ['orange', 'chicken'],
    ['banana', 'chicken'],
  ],
  chickyrocket: [
    ['chicken', 'rocket'],
    ['chicken', 'sneakers'],
  ],
  phoenixchicken: [
    ['chicken', 'fire'],
    ['chicken', 'electricity'],
  ],

  // Crocodiles
  melodile: [
    ['watermelon', 'crocodile'],
    ['banana', 'crocodile'],
    ['strawberry', 'crocodile'],
  ],
  chilligator: [
    ['crocodile', 'sunglasses'],
    ['crocodile', 'skateboard'],
  ],
  crownodile: [
    ['crocodile', 'crown'],
    ['crocodile', 'backpack'],
  ],

  // Sharks
  pineshark: [
    ['pineapple', 'shark'],
    ['watermelon', 'shark'],
    ['orange', 'shark'],
  ],
  sharkboarder: [
    ['shark', 'skateboard'],
    ['shark', 'sneakers'],
  ],
  fireshark: [
    ['shark', 'fire'],
    ['shark', 'electricity'],
  ],

  // Penguins
  rocketpenguin: [
    ['penguin', 'rocket'],
    ['penguin', 'sneakers'],
    ['penguin', 'ice'],
  ],
  cosmicpenguin: [
    ['penguin', 'space'],
    ['penguin', 'backpack'],
  ],

  // Capybaras
  skaterbara: [
    ['capybara', 'skateboard'],
    ['capybara', 'sunglasses'],
    ['capybara', 'sneakers'],
  ],
  cybercapy: [
    ['capybara', 'electricity'],
    ['capybara', 'fire'],
  ],
  gigacapy: [['capybara', 'crown']],

  // Axolotl
  astroaxolotl: [
    ['axolotl', 'space'],
    ['axolotl', 'rainbow'],
    ['axolotl', 'ice'],
    ['axolotl', 'electricity'],
  ],
  bubbleaxolotl: [
    ['axolotl', 'bubble'],
    ['axolotl', 'ice'],
  ],

  // New Animals & Items Recipes
  duckbanana: [
    ['duck', 'banana'],
    ['duck', 'orange'],
  ],
  duckapple: [
    ['duck', 'apple'],
    ['duck', 'cherry'],
  ],
  chillduck: [
    ['duck', 'sunglasses'],
    ['duck', 'sneakers'],
  ],
  duckrocket: [
    ['duck', 'rocket'],
    ['duck', 'fire'],
  ],
  cherrycat: [
    ['cat', 'cherry'],
    ['cat', 'strawberry'],
  ],
  pizzacat: [
    ['cat', 'pizza'],
    ['cat', 'burger'],
  ],
  burgerdog: [
    ['dog', 'burger'],
    ['dog', 'pizza'],
  ],
  coffeecapy: [
    ['capybara', 'coffee'],
    ['capybara', 'backpack'],
  ],
  diamondcapy: [
    ['capybara', 'diamond'],
    ['capybara', 'crown'],
  ],
  monkeyskate: [
    ['monkey', 'skateboard'],
    ['monkey', 'sneakers'],
    ['monkey', 'banana'],
  ],
  frogavocado: [
    ['frog', 'avocado'],
    ['frog', 'kiwi'],
  ],
  gamerfrog: [
    ['frog', 'gamepad'],
    ['frog', 'sunglasses'],
  ],
  cyberfrog: [
    ['frog', 'electricity'],
    ['frog', 'laser'],
  ],
  rockhamster: [
    ['hamster', 'guitar'],
    ['hamster', 'gamepad'],
  ],
  laserhamster: [
    ['hamster', 'laser'],
    ['hamster', 'electricity'],
  ],
  avocadopanda: [
    ['panda', 'avocado'],
    ['panda', 'banana'],
  ],
  pandarock: [
    ['panda', 'guitar'],
    ['panda', 'gamepad'],
  ],
  firefox: [
    ['fox', 'fire'],
    ['fox', 'laser'],
  ],
  diamondfox: [
    ['fox', 'diamond'],
    ['fox', 'crown'],
  ],
  spacefox: [
    ['fox', 'space'],
    ['fox', 'rainbow'],
  ],
};

export function getItemMeta(id: string): {
  id: string;
  name: string;
  emoji: string;
  rarity: Rarity;
  isCreature: boolean;
  color: string;
  cost?: number;
  description: string;
} {
  const ing = INGREDIENTS.find((i) => i.id === id);
  if (ing) {
    return {
      id: ing.id,
      name: ing.name,
      emoji: ing.emoji,
      rarity: ing.rarity,
      isCreature: false,
      color: ing.color,
      cost: ing.cost,
      description: ing.description,
    };
  }
  const creat = CREATURES.find((c) => c.id === id);
  if (creat) {
    const avatar = getCreaturePetAndItem(creat);
    return {
      id: creat.id,
      name: creat.name,
      emoji: avatar.petEmoji,
      rarity: creat.rarity,
      isCreature: true,
      color: RARITY_CONFIG[creat.rarity].color,
      cost: creat.baseUpgradePrice,
      description: creat.description,
    };
  }
  return {
    id,
    name: id,
    emoji: '✨',
    rarity: 'common',
    isCreature: false,
    color: '#94a3b8',
    description: '',
  };
}

export function findCreatureByIngredients(idA: string, idB: string): Creature | null {
  // 1. Check primary recipe (ingredients or fusion parents)
  const primary = CREATURES.find((c) => {
    const [i1, i2] = c.ingredients;
    return (i1 === idA && i2 === idB) || (i1 === idB && i2 === idA);
  });
  if (primary) return primary;

  // 2. Check alternative recipes
  for (const [creatureId, altPairs] of Object.entries(ALTERNATIVE_RECIPES)) {
    const matches = altPairs.some(
      ([i1, i2]) => (i1 === idA && i2 === idB) || (i1 === idB && i2 === idA)
    );
    if (matches) {
      const found = CREATURES.find((c) => c.id === creatureId);
      if (found) return found;
    }
  }

  return null;
}

// Compute mixing result with smart mutations, supporting ingredient-ingredient, creature-creature, and creature-ingredient
export function computeMixResult(
  idA: string,
  idB: string,
  discoveredCreatureIds: string[]
): { creature: Creature; isMutation: boolean } {
  // 1. Direct or alternative recipe match (100% guarantee)
  const exact = findCreatureByIngredients(idA, idB);
  if (exact) {
    return { creature: exact, isMutation: false };
  }

  const metaA = getItemMeta(idA);
  const metaB = getItemMeta(idB);

  const rarityRank: Record<Rarity, number> = {
    common: 1,
    uncommon: 2,
    rare: 3,
    epic: 4,
    legendary: 5,
    secret: 6,
  };

  const rankA = rarityRank[metaA.rarity] || 1;
  const rankB = rarityRank[metaB.rarity] || 1;
  const maxRank = Math.max(rankA, rankB);

  // 2. If mixing Creature + Creature (HYPER-FUSION MODE)
  if (metaA.isCreature && metaB.isCreature) {
    // Target rank progression based on parents:
    // Common(1)+Common(1) -> Target Rank 2 (Uncommon)
    // Common(1)+Uncommon(2) -> Target Rank 2 or 3 (Uncommon/Rare)
    // Uncommon(2)+Uncommon(2) -> Target Rank 3 (Rare)
    // Rare(3)+Rare(3) -> Target Rank 4 (Epic)
    // Epic(4)+Epic(4) -> Target Rank 5 (Legendary)
    // Legendary(5)+Legendary(5) -> Target Rank 6 (Secret)
    const targetRank = Math.min(6, maxRank + (rankA === rankB ? 1 : 0));
    const minAcceptableRank = Math.max(1, targetRank - 1);

    const fusionCandidates = CREATURES.filter(
      (c) => c.isFusion && rarityRank[c.rarity] >= minAcceptableRank && rarityRank[c.rarity] <= targetRank
    );

    const validFusions =
      fusionCandidates.length > 0
        ? fusionCandidates
        : CREATURES.filter((c) => c.isFusion && rarityRank[c.rarity] <= targetRank);

    if (validFusions.length > 0) {
      const undiscoveredFusions = validFusions.filter((c) => !discoveredCreatureIds.includes(c.id));
      if (undiscoveredFusions.length > 0 && Math.random() < 0.9) {
        const chosen = undiscoveredFusions[Math.floor(Math.random() * undiscoveredFusions.length)];
        return { creature: chosen, isMutation: true };
      }
      const chosen = validFusions[Math.floor(Math.random() * validFusions.length)];
      return { creature: chosen, isMutation: true };
    }
  }

  // 3. Genetic Affinity: Find creatures related to either parent or ingredient within reasonable rank tier
  const allowedMaxRank = Math.min(6, maxRank + 1);
  const partialMatches = CREATURES.filter((c) => {
    if (rarityRank[c.rarity] > allowedMaxRank) return false;
    const [i1, i2] = c.ingredients;
    const alts = ALTERNATIVE_RECIPES[c.id] || [];
    const hasInPrimary = i1 === idA || i2 === idA || i1 === idB || i2 === idB;
    const hasInAlt = alts.some(([a1, a2]) => a1 === idA || a2 === idA || a1 === idB || a2 === idB);
    return hasInPrimary || hasInAlt;
  });

  if (partialMatches.length > 0) {
    const undiscovered = partialMatches.filter((c) => !discoveredCreatureIds.includes(c.id));

    // 85% priority given to undiscovered memes so player gets progression!
    if (undiscovered.length > 0 && Math.random() < 0.85) {
      const chosen = undiscovered[Math.floor(Math.random() * undiscovered.length)];
      return { creature: chosen, isMutation: true };
    }

    const chosen = partialMatches[Math.floor(Math.random() * partialMatches.length)];
    return { creature: chosen, isMutation: true };
  }

  // 4. Fallback: select random creature closely aligned with rarity tier
  let tierCandidates = CREATURES.filter((c) => {
    const cRank = rarityRank[c.rarity];
    return cRank <= allowedMaxRank && Math.abs(cRank - maxRank) <= 1;
  });

  if (tierCandidates.length === 0) {
    tierCandidates = CREATURES.filter((c) => rarityRank[c.rarity] <= allowedMaxRank);
  }
  if (tierCandidates.length === 0) {
    tierCandidates = CREATURES;
  }

  const undiscoveredTier = tierCandidates.filter((c) => !discoveredCreatureIds.includes(c.id));
  if (undiscoveredTier.length > 0 && Math.random() < 0.85) {
    const chosen = undiscoveredTier[Math.floor(Math.random() * undiscoveredTier.length)];
    return { creature: chosen, isMutation: true };
  }

  const chosen = tierCandidates[Math.floor(Math.random() * tierCandidates.length)];
  return { creature: chosen, isMutation: true };
}

export function calculateCreatureIncome(creature: Creature, level: number): number {
  return Math.floor(creature.baseIncome * (1 + (level - 1) * DEFAULT_CONFIG.incomeMultiplier));
}

export function calculateUpgradeCost(creature: Creature, level: number): number {
  return Math.floor(creature.baseUpgradePrice * Math.pow(DEFAULT_CONFIG.priceMultiplier, level - 1));
}

export const FUSION_AVATAR_MAP: Record<
  string,
  { petEmoji: string; itemEmoji: string; itemName: string; petId: string; itemId: string }
> = {
  bananacat_applepup: { petEmoji: '🐱', itemEmoji: '🍎', itemName: 'Сладкое Яблоко', petId: 'cat', itemId: 'apple' },
  duckbanana_frogavocado: { petEmoji: '🦆', itemEmoji: '🥑', itemName: 'Спелое Авокадо', petId: 'duck', itemId: 'avocado' },
  coolcat_rockhamster: { petEmoji: '🐱', itemEmoji: '🎸', itemName: 'Рок-Гитара', petId: 'cat', itemId: 'guitar' },
  burgerdog_pizzacat: { petEmoji: '🐶', itemEmoji: '🍕', itemName: 'Пицца-Слайс', petId: 'dog', itemId: 'pizza' },
  sneakerdog_monkeyskate: { petEmoji: '🐶', itemEmoji: '🛹', itemName: 'Мемный Скейт', petId: 'dog', itemId: 'skateboard' },
  coolcat_avocadopanda: { petEmoji: '🐼', itemEmoji: '🕶️', itemName: 'Крутые Очки', petId: 'panda', itemId: 'sunglasses' },
  melodile_pineshark: { petEmoji: '🐊', itemEmoji: '🍍', itemName: 'Ананас', petId: 'croc', itemId: 'pineapple' },
  coffeecapy_rockhamster: { petEmoji: '🦫', itemEmoji: '🎸', itemName: 'Электрогитара', petId: 'capybara', itemId: 'guitar' },
  avocadopanda_coffeecapy: { petEmoji: '🐼', itemEmoji: '☕', itemName: 'Ароматный Кофе', petId: 'panda', itemId: 'coffee' },
  chickyrocket_skaterbara: { petEmoji: '🐔', itemEmoji: '🚀', itemName: 'Турбо-Ракета', petId: 'chicken', itemId: 'rocket' },
  diamondfox_cyberfrog: { petEmoji: '🦊', itemEmoji: '⚡', itemName: 'Кибер-Энергия', petId: 'fox', itemId: 'lightning' },
  laserhamster_pineshark: { petEmoji: '🦈', itemEmoji: '🔮', itemName: 'Плазменная Сфера', petId: 'shark', itemId: 'crystal' },
  bubbleaxolotl_icecat: { petEmoji: '🦎', itemEmoji: '🧊', itemName: 'Ледяной Кристалл', petId: 'axolotl', itemId: 'ice' },
  firefox_chilligator: { petEmoji: '🐊', itemEmoji: '🔥', itemName: 'Вечный Огонь', petId: 'croc', itemId: 'fire' },
  astroaxolotl_cosmicpenguin: { petEmoji: '🐧', itemEmoji: '🌌', itemName: 'Космическая Туманность', petId: 'penguin', itemId: 'galaxy' },
  bananacat_diamondcapy: { petEmoji: '🦫', itemEmoji: '🍌', itemName: 'Алмазный Банан', petId: 'capybara', itemId: 'banana' },
  spacefox_rainbowcat: { petEmoji: '🦊', itemEmoji: '🌈', itemName: 'Радужный Шлейф', petId: 'fox', itemId: 'rainbow' },
  kingcat_gigacapy: { petEmoji: '🦫', itemEmoji: '👑', itemName: 'Корона Всевластия', petId: 'capybara', itemId: 'crown' },
};

export function getCreaturePetAndItem(creature: Creature): {
  petEmoji: string;
  itemEmoji: string;
  itemName: string;
  petId: string;
  itemId: string;
} {
  // 1. If explicit fusion map exists
  if (FUSION_AVATAR_MAP[creature.id]) {
    return FUSION_AVATAR_MAP[creature.id];
  }

  // 2. If it's a dynamic fusion creature
  if (creature.isFusion) {
    const emojis = Array.from(creature.emoji);
    const petEmoji = emojis[0] || '🐱';
    const itemEmoji = emojis[1] || '✨';
    return {
      petEmoji,
      itemEmoji,
      itemName: 'Гибридный артефакт',
      petId: 'cat',
      itemId: 'fusion',
    };
  }

  const ingA = INGREDIENTS.find((i) => i.id === creature.ingredients[0]);
  const ingB = INGREDIENTS.find((i) => i.id === creature.ingredients[1]);

  const petIng = ingA?.category === 'animals' ? ingA : ingB?.category === 'animals' ? ingB : ingA;
  const itemIng = petIng === ingA ? ingB : ingA;

  return {
    petEmoji: petIng?.emoji || '🐱',
    itemEmoji: itemIng?.emoji || '✨',
    itemName: itemIng?.name || 'Предмет',
    petId: petIng?.id || 'cat',
    itemId: itemIng?.id || '',
  };
}

export const WHEEL_SECTORS: import('../types/game').WheelSector[] = [
  {
    id: 'coins_1500',
    label: '1,500',
    sublabel: 'монет',
    icon: '🪙',
    color: '#f59e0b', // amber
    textColor: '#ffffff',
    rarity: 'common',
    reward: { coins: 1500 },
    weight: 26,
  },
  {
    id: 'ingredient_banana',
    label: 'x3 Банана',
    sublabel: 'для крафта',
    icon: '🍌',
    color: '#eab308', // yellow
    textColor: '#0f172a',
    rarity: 'uncommon',
    reward: { ingredientId: 'banana', ingredientCount: 3 },
    weight: 20,
  },
  {
    id: 'booster_double',
    label: 'x2 Доход',
    sublabel: 'на 10 мин',
    icon: '⚡',
    color: '#3b82f6', // blue
    textColor: '#ffffff',
    rarity: 'rare',
    reward: { boosterId: 'double_income', boosterDurationSec: 600 },
    weight: 14,
  },
  {
    id: 'ingredient_cat',
    label: 'x3 Котика',
    sublabel: 'для крафта',
    icon: '🐱',
    color: '#10b981', // emerald
    textColor: '#ffffff',
    rarity: 'uncommon',
    reward: { ingredientId: 'cat', ingredientCount: 3 },
    weight: 18,
  },
  {
    id: 'coins_5000',
    label: '5,000',
    sublabel: 'монет + опыт',
    icon: '💰',
    color: '#ec4899', // pink
    textColor: '#ffffff',
    rarity: 'rare',
    reward: { coins: 5000, xp: 200 },
    weight: 12,
  },
  {
    id: 'booster_lucky',
    label: 'x2 Удача',
    sublabel: 'на 10 мин',
    icon: '🍀',
    color: '#8b5cf6', // purple
    textColor: '#ffffff',
    rarity: 'rare',
    reward: { boosterId: 'super_lucky', boosterDurationSec: 600 },
    weight: 12,
  },
  {
    id: 'box_epic',
    label: 'Эпик Бокс',
    sublabel: 'мистический лут',
    icon: '📦',
    color: '#6366f1', // indigo
    textColor: '#ffffff',
    rarity: 'epic',
    reward: { boxId: 'box_epic', xp: 350 },
    weight: 8,
  },
  {
    id: 'jackpot',
    label: 'ДЖЕКПОТ!',
    sublabel: '15,000🪙 + 1000✨',
    icon: '👑',
    color: '#f97316', // orange gold
    textColor: '#ffffff',
    rarity: 'legendary',
    reward: { coins: 15000, xp: 1000 },
    weight: 5,
  },
];

export function pickWheelWinnerSector(): import('../types/game').WheelSector {
  const totalWeight = WHEEL_SECTORS.reduce((sum, s) => sum + s.weight, 0);
  let randomVal = Math.random() * totalWeight;

  for (const sector of WHEEL_SECTORS) {
    if (randomVal < sector.weight) {
      return sector;
    }
    randomVal -= sector.weight;
  }
  return WHEEL_SECTORS[0];
}
