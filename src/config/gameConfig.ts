/**
 * ==============================================================================
 * 🌟 MEME LAB — ЕДИНЫЙ ГЛАВНЫЙ КОНФИГУРАЦИОННЫЙ ФАЙЛ (MASTER GAME CONFIG)
 * ==============================================================================
 * 
 * В этом файле собраны абсолютно все параметры баланса, таймеров, экономики,
 * случайных событий и фиче-флагов игры. Изменяйте значения прямо здесь для
 * быстрой и удобной настройки всей игровой системы.
 * 
 * Разработано командой: G3R
 * Версия: Meme Lab V 1.0
 * ==============================================================================
 */

export interface MasterGameConfig {
  /** Метаданные и брендинг */
  meta: {
    appName: string;
    version: string;
    author: string;
    description: string;
  };

  /** Фиче-флаги (включение / выключение функционала) */
  features: {
    enableAdminPanel: boolean;  // Включение/отключение вкладки Админки в настройках
    enableAnalytics: boolean;   // Включение/отключение логирования и вкладки Аналитики
    enableRandomEvents: boolean;// Включение/отключение автоматических случайных ивентов
    enableAutoSave: boolean;    // Включение автосохранения в LocalStorage
  };

  /** Экономика, прокачка и прогрессия */
  economy: {
    starterCoins: number;               // Начальный баланс монет для новой игры
    priceMultiplier: number;            // Множитель цены улучшения уровня (basePrice * priceMultiplier^(lvl-1))
    incomeMultiplier: number;           // Прирост дохода за уровень (baseIncome * (1 + (lvl-1)*incomeMultiplier))
    offlineMaxHours: number;            // Максимум часов накопления оффлайн-дохода
    coinMagnetBonusMultiplier: number;  // Бонус перка "Мемный магнит" (+25% = 1.25)
    happyFlaskBonusMultiplier: number;  // Бонус перка "Колба мудрости" (+50% XP = 1.5)
    goldenTouchClickMultiplier: number; // Бонус перка "Ласковая лапа" (x5 монет за клик)
    repeatMixXpBase: number;            // Базовый опыт за повторное скрещивание
    levelXpBase: number;                // Базовый XP для расчета уровня игрока
    levelXpMultiplier: number;          // Экспонента роста требуемого опыта на уровень
  };

  /** Появление и исчезновение предметов на полянке (Ground Items) */
  groundItems: {
    despawnSeconds: number;             // Время жизни предмета на земле до исчезновения (15 сек)
    regularSpawnIntervalSec: number;    // Обычный интервал спавна предметов на карте (8 сек)
    fastSpawnIntervalSec: number;       // Ускоренный интервал спавна при активном бустере (4 сек)
    maxGroundItems: number;             // Максимум предметов на полянке одновременно
    autoCollectorDelayMs: number;       // Задержка автосборщика дрона перед вакуумированием (мс)
    availablePool: string[];            // Пул базовых ингредиентов, появляющихся на полянке
  };

  /** Случайные игровые события (Random Events) */
  randomEvents: {
    initialMinDelayMs: number;          // Минимальная задержка до 1-го события после запуска (мс)
    initialMaxDelayMs: number;          // Максимальная задержка до 1-го события после запуска (мс)
    cycleMinDelayMs: number;            // Минимальный интервал между регулярными событиями (мс)
    cycleMaxDelayMs: number;            // Максимальный интервал между регулярными событиями (мс)
    buffDurationMinutes: number;        // Длительность баффов из ивентов (2 минуты)
    debuffDurationMinutes: number;      // Длительность дебаффов из ивентов (2 минуты)
    carnivalIncomeMultiplier: number;   // Множитель дохода во время баффа "Карнавал" (x2.0)
    sleepyFogIncomeMultiplier: number;  // Множитель дохода во время дебаффа "Сонный туман" (0.7 = -30%)
  };

  /** Бустеры и спонсорские награды */
  boosters: {
    activeBoosterDurationSec: number;   // Длительность временных бустеров (300 сек = 5 минут)
    adRewardCooldownHours: number;      // Кулдаун бесплатной награды 1000 монет (3 часа)
    adRewardCoins: number;              // Количество монет за 3-часовую награду
  };

  /** Мемное Колесо Фортуны */
  wheel: {
    cooldownHours: number;              // Кулдаун между бесплатными вращениями (24 часа)
    spinDurationMs: number;             // Длительность вращения анимации (мс)
    jackpotCoins: number;               // Количество монет в джекпоте
    jackpotXp: number;                  // Опыт в джекпоте
  };

  /** Звуковые настройки по умолчанию */
  audio: {
    defaultSoundEnabled: boolean;       // Включены ли звуковые эффекты по умолчанию
    defaultMusicEnabled: boolean;       // Включена ли фоновая музыка по умолчанию
    defaultVolume: number;              // Громкость по умолчанию (0 - 100)
  };
}

/**
 * ГЛАВНЫЙ ЭКЗЕМПЛЯР КОНФИГУРАЦИИ
 * Редактируйте параметры ниже для мгновенной настройки баланса и поведения игры:
 */
export const GAME_CONFIG: MasterGameConfig = {
  meta: {
    appName: 'Meme Lab',
    version: 'V 1.0',
    author: 'Разработано командой G3R',
    description:
      'Браузерная 2D игра в жанре merge & idle simulator, где игроки комбинируют животных, фрукты и предметы для создания абсурдных мемов-существ.',
  },

  features: {
    enableAdminPanel: false,  // Установите в false, чтобы полностью скрыть Админку
    enableAnalytics: false,   // Установите в false, чтобы отключить аналитику и скрыть вкладку
    enableRandomEvents: true, // Включение автоматических ивентов
    enableAutoSave: true,     // Сохранение состояния в браузере
  },

  economy: {
    starterCoins: 200,
    priceMultiplier: 1.25,
    incomeMultiplier: 0.25,
    offlineMaxHours: 8,
    coinMagnetBonusMultiplier: 1.25,
    happyFlaskBonusMultiplier: 1.5,
    goldenTouchClickMultiplier: 5,
    repeatMixXpBase: 5,
    levelXpBase: 750,
    levelXpMultiplier: 1.5,
  },

  groundItems: {
    despawnSeconds: 15,
    regularSpawnIntervalSec: 8,
    fastSpawnIntervalSec: 4,
    maxGroundItems: 6,
    autoCollectorDelayMs: 600,
    availablePool: [
      'banana',
      'apple',
      'strawberry',
      'cat',
      'dog',
      'orange',
      'watermelon',
      'coffee',
    ],
  },

  randomEvents: {
    initialMinDelayMs: 8000,          // 8 секунд
    initialMaxDelayMs: 14000,         // 14 секунд
    cycleMinDelayMs: 35000,           // 35 секунд
    cycleMaxDelayMs: 75000,           // 75 секунд
    buffDurationMinutes: 2,           // 2 минуты
    debuffDurationMinutes: 2,         // 2 минуты
    carnivalIncomeMultiplier: 2.0,    // x2 Доход
    sleepyFogIncomeMultiplier: 0.7,   // -30% Доход
  },

  boosters: {
    activeBoosterDurationSec: 300,    // 5 минут
    adRewardCooldownHours: 3,         // 3 часа
    adRewardCoins: 10000,             // 10 000 монет
  },

  wheel: {
    cooldownHours: 24,                // 24 часа
    spinDurationMs: 4500,             // 4.5 секунды
    jackpotCoins: 15000,              // 15 000 монет
    jackpotXp: 1000,                  // 1 000 опыта
  },

  audio: {
    defaultSoundEnabled: true,
    defaultMusicEnabled: true,
    defaultVolume: 75,
  },
};
