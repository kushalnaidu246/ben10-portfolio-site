// Comprehensive canonical Ben 10 original aliens database

export const ALIENS_DATA = [
  {
    id: 'heatblast',
    number: '01',
    name: 'HEATBLAST',
    species: 'Pyronite',
    homePlanet: 'Pyros',
    themeColor: '#ff5500',
    accentColor: '#ffaa00',
    glowColor: 'rgba(255, 85, 0, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(255, 68, 0, 0.28) 0%, rgba(10, 5, 2, 0.95) 75%)',
    image: 'assets/alien_01_heatblast.webp',
    particleType: 'fire',
    powers: [
      'Fire Generation',
      'Heat & Thermal Control',
      'Pyrokinetic Flight',
      'Terrakinetic Magma Surfing'
    ],
    description: 'A powerful fire-based alien capable of generating and controlling intense heat and flames. Heatblast can shoot scorching fireballs, ride airborne columns of flame, and melt stone with molten radiance.',
    stats: {
      strength: 78,
      speed: 70,
      durability: 84,
      energy: 98,
      intellect: 65
    },
    voiceQuote: '"Time to turn up the heat!"',
    badge: 'PYRO-01'
  },
  {
    id: 'fourarms',
    number: '02',
    name: 'FOUR ARMS',
    species: 'Tetramand',
    homePlanet: 'Khoros',
    themeColor: '#e62222',
    accentColor: '#ff6b4a',
    glowColor: 'rgba(230, 34, 34, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(200, 20, 20, 0.26) 0%, rgba(12, 4, 4, 0.95) 75%)',
    image: 'assets/alien_02_fourarms.webp',
    particleType: 'shockwave',
    powers: [
      'Superhuman Strength',
      'Sonic Clap Shockwaves',
      'Enhanced Leaping',
      'Armored Armadillo Hide'
    ],
    description: 'A towering four-armed behemoth possessing staggering physical might. By slamming his four palms together, Four Arms can unleash concussive sonic claps that flatten armored tanks.',
    stats: {
      strength: 100,
      speed: 55,
      durability: 96,
      energy: 40,
      intellect: 52
    },
    voiceQuote: '"You want some of this? I got four hands for ya!"',
    badge: 'TETRA-02'
  },
  {
    id: 'diamondhead',
    number: '03',
    name: 'DIAMONDHEAD',
    species: 'Petrosapien',
    homePlanet: 'Petropia',
    themeColor: '#00e5a3',
    accentColor: '#5cfde0',
    glowColor: 'rgba(0, 229, 163, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(0, 210, 160, 0.24) 0%, rgba(2, 10, 8, 0.95) 75%)',
    image: 'assets/alien_03_diamondhead.webp',
    particleType: 'crystal',
    powers: [
      'Crystalline Weapon Projection',
      'Energy Refraction & Redirection',
      'Near-Indestructible Density',
      'Crystal Construct Genesis'
    ],
    description: 'Composed of ultra-dense silicon-based organic crystal, Diamondhead can morph his limbs into razor-sharp blades, launch deadly crystal volleys, and refract laser blasts back at attackers.',
    stats: {
      strength: 82,
      speed: 60,
      durability: 98,
      energy: 88,
      intellect: 70
    },
    voiceQuote: '"Harder than diamond, sharper than steel!"',
    badge: 'PETRO-03'
  },
  {
    id: 'xlr8',
    number: '04',
    name: 'XLR8',
    species: 'Kineceleran',
    homePlanet: 'Kinet',
    themeColor: '#00c3ff',
    accentColor: '#6ee7ff',
    glowColor: 'rgba(0, 195, 255, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(0, 180, 255, 0.25) 0%, rgba(3, 8, 14, 0.95) 75%)',
    image: 'assets/alien_04_xlr8.webp',
    particleType: 'speed',
    powers: [
      'Hypersonic Running (500+ mph)',
      'Friction Zero Manipulation',
      'Hyper-Accelerated Reflexes',
      'Tornado & Vortex Creation'
    ],
    description: 'A velociraptor-like speedster gliding atop frictionless spherical wheel orbs. XLR8 can manipulate friction, run on water and vertically up skyscrapers, and perceive time in slow motion.',
    stats: {
      strength: 58,
      speed: 100,
      durability: 62,
      energy: 72,
      intellect: 75
    },
    voiceQuote: '"Blink and you\'ll miss me!"',
    badge: 'KINET-04'
  },
  {
    id: 'upgrade',
    number: '05',
    name: 'UPGRADE',
    species: 'Galvanic Mechamorph',
    homePlanet: 'Galvan B',
    themeColor: '#00ff66',
    accentColor: '#88ffaa',
    glowColor: 'rgba(0, 255, 102, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(0, 255, 102, 0.22) 0%, rgba(2, 10, 4, 0.95) 75%)',
    image: 'assets/alien_05_upgrade.webp',
    particleType: 'tech',
    powers: [
      'Techno-Organic Fusion',
      'Cybernetic Hyper-Enhancement',
      'Optic Plasma Laser Beam',
      'Liquid Metal Shape Alteration'
    ],
    description: 'A bio-synthetic sentient nano-colony that can merge seamlessly into any machine or vehicle, instantly upgrading it far past its technological limits while firing lethal optic laser beams.',
    stats: {
      strength: 70,
      speed: 68,
      durability: 86,
      energy: 94,
      intellect: 90
    },
    voiceQuote: '"System upgraded to Galvanic perfection."',
    badge: 'MECHA-05'
  },
  {
    id: 'wildmutt',
    number: '06',
    name: 'WILDMUTT',
    species: 'Vulpimancer',
    homePlanet: 'Vulpin',
    themeColor: '#ff8800',
    accentColor: '#ffb24d',
    glowColor: 'rgba(255, 136, 0, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(220, 110, 0, 0.24) 0%, rgba(12, 6, 2, 0.95) 75%)',
    image: 'assets/alien_06_wildmutt.webp',
    particleType: 'spore',
    powers: [
      '360° Thermographic Gill Sensing',
      'Hyper-Auditory Echolocation',
      'Predatory Agility & Acrobatics',
      'Diamond-Piercing Fangs & Claws'
    ],
    description: 'An eyeless apex predator using sensory neck gills for real-time 3D thermographic radar and echolocation. Wildmutt tracks prey invisibly through obstacles and strikes with lethal feral speed.',
    stats: {
      strength: 84,
      speed: 80,
      durability: 76,
      energy: 35,
      intellect: 45
    },
    voiceQuote: '*Primal predatory roar & sonic growl*',
    badge: 'VULP-06'
  },
  {
    id: 'cannonbolt',
    number: '07',
    name: 'CANNONBOLT',
    species: 'Arburian Pelarota',
    homePlanet: 'Arburia',
    themeColor: '#e0aa00',
    accentColor: '#ffe066',
    glowColor: 'rgba(224, 170, 0, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(210, 160, 0, 0.22) 0%, rgba(10, 8, 2, 0.95) 75%)',
    image: 'assets/alien_07_cannonbolt.webp',
    particleType: 'kinetic',
    powers: [
      'Kinetic Armor Shell',
      'High-Velocity Ricochet Bowling',
      'Impact Immunity & Atmospheric Reentry',
      'Shockwave Kinetic Release'
    ],
    description: 'An armored juggernaut capable of curling into a virtually impenetrable sphere. In ball mode, Cannonbolt bounces off terrain with exponential momentum, obliterating fortified obstacles.',
    stats: {
      strength: 92,
      speed: 88,
      durability: 100,
      energy: 50,
      intellect: 58
    },
    voiceQuote: '"Let\'s roll and bowl!"',
    badge: 'ARBUR-07'
  },
  {
    id: 'greymatter',
    number: '08',
    name: 'GREY MATTER',
    species: 'Galvan',
    homePlanet: 'Galvan Prime',
    themeColor: '#70ffb0',
    accentColor: '#a6ffd0',
    glowColor: 'rgba(112, 255, 176, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(80, 220, 140, 0.22) 0%, rgba(2, 10, 6, 0.95) 75%)',
    image: 'assets/alien_08_greymatter.webp',
    particleType: 'dna',
    powers: [
      'Off-Scale Cosmic Intellect',
      'Micro-Mechanical Engineering',
      'Neurological Anatomy Insight',
      'Sub-Component Infiltration'
    ],
    description: 'A diminutive five-inch alien genius possessing the intellect of the creators of the Omnitrix itself. Grey Matter can dismantle complex starships with spare wire and outsmart entire galactic fleets.',
    stats: {
      strength: 15,
      speed: 40,
      durability: 25,
      energy: 65,
      intellect: 100
    },
    voiceQuote: '"Technically speaking, this is elementary physics."',
    badge: 'GALVAN-08'
  },
  {
    id: 'stinkfly',
    number: '09',
    name: 'STINKFLY',
    species: 'Lepidopterran',
    homePlanet: 'Lepidopterra',
    themeColor: '#9acd32',
    accentColor: '#ccff33',
    glowColor: 'rgba(154, 205, 50, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(140, 190, 30, 0.22) 0%, rgba(6, 10, 2, 0.95) 75%)',
    image: 'assets/alien_09_stinkfly.webp',
    particleType: 'acid',
    powers: [
      '360° Aerial Acrobatics',
      'Corrosive Acid & Slime Streams',
      'Flammable Methane Chemical Mist',
      'Prehensile Blade Stinger'
    ],
    description: 'A winged aerial insectoid who can maneuver in any vector with zero turning radius. Stinkfly expels highly pressurized streams of scorching adhesive mucus or corrosive acidic venom from his eyes.',
    stats: {
      strength: 62,
      speed: 85,
      durability: 60,
      energy: 82,
      intellect: 64
    },
    voiceQuote: '"Smells like trouble... just how I like it!"',
    badge: 'LEPID-09'
  },
  {
    id: 'ripjaws',
    number: '10',
    name: 'RIPJAWS',
    species: 'Piscciss Volann',
    homePlanet: 'Piscciss',
    themeColor: '#00aaff',
    accentColor: '#5cd6ff',
    glowColor: 'rgba(0, 170, 255, 0.65)',
    bgHaze: 'radial-gradient(circle at 35% 50%, rgba(0, 140, 220, 0.24) 0%, rgba(2, 6, 12, 0.95) 75%)',
    image: 'assets/alien_10_ripjaws.webp',
    particleType: 'abyss',
    powers: [
      'Steel-Crushing Hydraulic Jaws',
      'Aquatic Tail-Fin High Velocity',
      'Bioluminescent Angler Lure',
      'Underwater Depth Pressure Immunity'
    ],
    description: 'An amphibious deep-trench leviathan equipped with hinged jaws that bite through solid titanium hulls. Underwater, Ripjaws locks into an aerodynamic torpedo form capable of outpacing submarines.',
    stats: {
      strength: 85,
      speed: 92,
      durability: 75,
      energy: 60,
      intellect: 62
    },
    voiceQuote: '"Down here in the dark, I\'m at the top of the food chain."',
    badge: 'PISCC-10'
  }
];
