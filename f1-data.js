/* Grid Dynasty – static data: nationalities, categories, real teams/drivers (2026 snapshot) */
(function (root) {
  const NATS = {
    GB: { f: '🇬🇧', n: 'England / GB', first: ['Oliver','Jack','Harry','Callum','Freddie','Theo','Luke','Max'], last: ['Hartley','Whitmore','Calloway','Prescott','Ashworth','Thornton','Barlow','Fenwick'] },
    IT: { f: '🇮🇹', n: 'Italy', first: ['Luca','Matteo','Andrea','Marco','Giulio','Lorenzo','Davide','Enzo'], last: ['Ferretti','Bellandi','Rossetti','Moretti','Cattaneo','Valenti','Bruni','Sartori'] },
    DE: { f: '🇩🇪', n: 'Germany', first: ['Jonas','Lukas','Felix','Moritz','Tim','Niklas','Paul','Leon'], last: ['Brandt','Vogel','Keller','Hofmann','Richter','Lang','Becker','Sommer'] },
    FR: { f: '🇫🇷', n: 'France', first: ['Hugo','Louis','Theo','Nathan','Enzo','Arthur','Lucas','Maxime'], last: ['Laurent','Dubois','Marchand','Girard','Fontaine','Roche','Perrin','Chevalier'] },
    ES: { f: '🇪🇸', n: 'Spain', first: ['Pablo','Mateo','Hugo','Alvaro','Diego','Iker','Jorge','Dani'], last: ['Navarro','Ortega','Castillo','Herrera','Molina','Vidal','Serrano','Cabrera'] },
    NL: { f: '🇳🇱', n: 'Netherlands', first: ['Daan','Sem','Milan','Thijs','Bram','Luuk','Noah','Finn'], last: ['de Vries','van Dijk','Bakker','Visser','Smit','Mulder','Jansen','Hendriks'] },
    BR: { f: '🇧🇷', n: 'Brazil', first: ['Gabriel','Pedro','Lucas','Rafael','Thiago','Enzo','Caio','Felipe'], last: ['Souza','Almeida','Carvalho','Teixeira','Moreira','Pires','Barros','Campos'] },
    US: { f: '🇺🇸', n: 'USA', first: ['Cole','Tyler','Mason','Logan','Hunter','Colton','Jake','Ryan'], last: ['Mitchell','Bishop','Hayes','Sullivan','Gardner','Wells','Crawford','Dalton'] },
    JP: { f: '🇯🇵', n: 'Japan', first: ['Haruki','Ren','Sota','Kaito','Yuto','Riku','Takumi','Daiki'], last: ['Sato','Kobayashi','Nakamura','Hayashi','Ishikawa','Ogawa','Fujita','Tanaka'] },
    AU: { f: '🇦🇺', n: 'Australia', first: ['Jacob','Noah','Liam','Mitch','Tom','Will','Archie','Zac'], last: ['Gallagher','Kelly','Brennan','Hollis','Webb','Mercer','Doyle','Tate'] },
    IN: { f: '🇮🇳', n: 'India', first: ['Arjun','Rohan','Kabir','Aditya','Vihaan','Dev','Aarav','Karan'], last: ['Mehta','Sharma','Kapoor','Reddy','Chopra','Iyer','Bhatia','Nair'] },
    MX: { f: '🇲🇽', n: 'Mexico', first: ['Santiago','Mateo','Diego','Emiliano','Sebastian','Leo','Rodrigo','Alonso'], last: ['Aguilar','Ibarra','Salinas','Cortez','Mendoza','Rojas','Zamora','Villarreal'] },
    SE: { f: '🇸🇪', n: 'Sweden / Nordics', first: ['Oskar','Elias','Viktor','Axel','Emil','Linus','Noel','Kasper'], last: ['Lindqvist','Bergstrom','Nyberg','Holm','Strand','Dahl','Falk','Sjoberg'] },
  };

  // points tables
  const PF1 = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  const PSPR = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const PF2S = [10, 8, 6, 5, 4, 3, 2, 1];
  const PKART = [25, 20, 16, 13, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  const PIND = [50, 40, 35, 32, 30, 28, 26, 24, 22, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 5, 5, 5, 5, 5];

  const KB = ['Tony Kart Racing Team', 'Kart Republic', 'Birel ART Racing', 'CRG Racing', 'Parolin Motorsport', 'Ricciardo Kart', 'Exprit Racing', 'LN Kart Racing'];
  const KO = [5, 4, 3, 1, 0, -1, -3, -5];
  const kteams = () => KB.map((n, i) => [n, KO[i], '']);
  const R = n => Array.from({ length: n }, (_, i) => 'Round ' + (i + 1));

  const CATS = {
    kart1: { id: 'kart1', name: 'Mini Kart · Regional', short: 'Regional Karting', tier: 0, lvl: 46, rounds: 8, rpr: 1, dpt: 3, pay: true, cost: [4, 12], titleName: 'Regional Karting Champion',
      rf: [{ n: 'Final', pts: PKART, grid: 'q' }], names: R(8), teams: kteams() },
    kart2: { id: 'kart2', name: 'Cadet / Mini · National', short: 'National Karting', tier: 0, lvl: 55, rounds: 8, rpr: 1, dpt: 3, pay: true, cost: [10, 28], titleName: 'National Karting Champion',
      rf: [{ n: 'Final', pts: PKART, grid: 'q' }], names: R(8), teams: kteams() },
    kart3: { id: 'kart3', name: 'OK-Junior · European / World', short: 'OK-Junior', tier: 0, lvl: 61, rounds: 6, rpr: 1, dpt: 3, pay: true, cost: [25, 70], titleName: 'Karting European Champion',
      rf: [{ n: 'Final', pts: PKART, grid: 'q' }], names: ['Euro R1', 'Euro R2', 'Euro R3', 'Euro R4', 'Euro R5', 'World Championship'], kartWC: true, teams: kteams() },
    kart4: { id: 'kart4', name: 'OK · European / World', short: 'OK Karting', tier: 0, lvl: 67, rounds: 6, rpr: 1, dpt: 3, pay: true, cost: [40, 110], titleName: 'Karting European Champion',
      rf: [{ n: 'Final', pts: PKART, grid: 'q' }], names: ['Euro R1', 'Euro R2', 'Euro R3', 'Euro R4', 'Euro R5', 'World Championship'], kartWC: true, teams: kteams() },

    f4: { id: 'f4', name: 'British F4', short: 'F4', tier: 1, lvl: 68, rounds: 8, rpr: 3, dpt: 4, pay: true, cost: [90, 230], titleName: 'F4 Champion',
      rf: [{ n: 'R1', pts: PF1, grid: 'q' }, { n: 'R2', pts: PF1, grid: 'rev6' }, { n: 'R3', pts: PF1, grid: 'prev' }],
      names: ['Donington Park', 'Brands Hatch Indy', 'Oulton Park', 'Thruxton', 'Snetterton', 'Silverstone', 'Croft', 'Brands Hatch GP'],
      teams: [
        ['Rodin Motorsport', 4, 'Dries Van Langendonck|Alfie Slater|Chiara Bättig|Theo Palmer'],
        ['Fortec Motorsport', 3, 'Kit Belofsky|Cash Felber|Roman Felber|Ethan Carney'],
        ['Argenti Motorsport', 2, 'Ethan Jeff-Hall|León Hedfors|Vegard Klemetsen|Sun Anzhe'],
        ['Xcel Motorsport', 1, 'Cole Hewetson|Mate Kobakhidze|Jaber Alsabah|Jackson Wolny'],
        ['JHR Developments', 0, 'Lewis Wherrell|Timo Jüngling|Cameron Nelson|Haarni Sadiq'],
        ['Virtuosi Racing', -1.5, 'Joseph Smith|Jarrett Clark|George Proudford-Nalder'],
        ['Chris Dittmann Racing', -3.5, 'Tommy Harfield|Henry Mercier'],
      ] },
    f3: { id: 'f3', name: 'FIA Formula 3', short: 'F3', tier: 2, lvl: 73, rounds: 10, rpr: 2, dpt: 3, pay: true, cost: [450, 950], titleName: 'F3 Champion',
      rf: [{ n: 'Sprint', pts: PSPR, grid: 'rev10' }, { n: 'Feature', pts: PF1, grid: 'q' }],
      names: ['Melbourne', 'Sakhir', 'Imola', 'Monaco', 'Barcelona', 'Spielberg', 'Silverstone', 'Spa', 'Budapest', 'Monza'],
      teams: [
        ['Campos Racing', 4, 'Ugo Ugochukwu|Théophile Naël|Ernesto Rivera'],
        ['Prema Racing', 3.5, 'James Wharton|Louis Sharp|Enzo Deligny'],
        ['Trident', 2.5, 'Noah Strømsted|Freddie Slater|Matteo De Palo'],
        ['ART Grand Prix', 2, 'Taito Kato|Maciej Gładysz|Kanato Le'],
        ['MP Motorsport', 1.5, 'Mattia Colnaghi|Tuukka Taponen|Alessandro Giusti'],
        ['Hitech TGR', 0.5, 'Fionn McLaughlin|Michael Shin|Jin Nakamura'],
        ['Rodin Motorsport', -0.5, 'Brando Badoer|Christian Ho|Pedro Clerot'],
        ['Van Amersfoort Racing', -1.5, 'Jesse Carrasquedo'],
        ['AIX Racing', -2.5, 'Brad Benavides|Fernando Barrichello|Yevan David'],
        ['DAMS', -3.5, ''],
      ] },
    f2: { id: 'f2', name: 'FIA Formula 2', short: 'F2', tier: 3, lvl: 78, rounds: 14, rpr: 2, dpt: 2, pay: true, cost: [1400, 2900], titleName: 'F2 Champion',
      rf: [{ n: 'Sprint', pts: PF2S, grid: 'rev10' }, { n: 'Feature', pts: PF1, grid: 'q' }],
      names: ['Melbourne', 'Sakhir', 'Jeddah', 'Imola', 'Monaco', 'Barcelona', 'Spielberg', 'Silverstone', 'Spa', 'Budapest', 'Monza', 'Baku', 'Lusail', 'Yas Marina'],
      teams: [
        ['Prema Racing', 4, 'Sebastián Montoya|Mari Boya'],
        ['ART Grand Prix', 3.5, 'Kush Maini|Tasanapol Inthraphuvasak'],
        ['Campos Racing', 3, 'Noel León|Nikola Tsolov'],
        ['Hitech', 2, 'Ritomo Miyata|Colton Herta'],
        ['DAMS Lucas Oil', 1.5, 'Dino Beganovic|Roman Bilinski'],
        ['Invicta Racing', 1, 'Rafael Câmara|Joshua Dürksen'],
        ['MP Motorsport', 0, 'Gabriele Minì|Oliver Goethe'],
        ['Trident', -0.5, 'Laurens van Hoepen|John Bennett'],
        ['Rodin Motorsport', -1.5, 'Martinius Stenshorne|Alexander Dunne'],
        ['AIX Racing', -2.5, 'Emerson Fittipaldi|Cian Shields'],
        ['Van Amersfoort Racing', -3.5, 'Nicolás Varrone|Rafael Villagómez'],
      ] },
    f1: { id: 'f1', name: 'Formula 1', short: 'F1', tier: 4, lvl: 84, rounds: 24, rpr: 1, dpt: 2, pay: false, sal: [900, 24000], titleName: 'F1 World Champion',
      rf: [{ n: 'Grand Prix', pts: PF1, grid: 'q' }],
      names: ['Australia', 'China', 'Japan', 'Bahrain', 'Saudi Arabia', 'Miami', 'Canada', 'Monaco', 'Barcelona', 'Austria', 'Great Britain', 'Belgium', 'Hungary', 'Netherlands', 'Italy', 'Madrid', 'Azerbaijan', 'Singapore', 'United States', 'Mexico City', 'Brazil', 'Las Vegas', 'Qatar', 'Abu Dhabi'],
      special: { 7: 'Monaco GP win' },
      teams: [
        ['Mercedes', 7, 'George Russell|Kimi Antonelli'],
        ['McLaren', 6, 'Lando Norris|Oscar Piastri'],
        ['Ferrari', 5.5, 'Charles Leclerc|Lewis Hamilton'],
        ['Red Bull Racing', 4.5, 'Max Verstappen|Isack Hadjar'],
        ['Williams', 0.5, 'Alex Albon|Carlos Sainz'],
        ['Racing Bulls', 0, 'Liam Lawson|Arvid Lindblad'],
        ['Aston Martin', -1, 'Fernando Alonso|Lance Stroll'],
        ['Alpine', -1.5, 'Pierre Gasly|Franco Colapinto'],
        ['Haas', -2, 'Esteban Ocon|Oliver Bearman'],
        ['Audi', -3, 'Nico Hülkenberg|Gabriel Bortoleto'],
        ['Cadillac', -5, 'Sergio Pérez|Valtteri Bottas'],
      ],
      boost: { 'Max Verstappen': 9, 'Lando Norris': 7, 'Oscar Piastri': 6, 'George Russell': 6, 'Charles Leclerc': 7, 'Lewis Hamilton': 5, 'Fernando Alonso': 5, 'Kimi Antonelli': 3, 'Carlos Sainz': 3, 'Alex Albon': 2, 'Pierre Gasly': 1 } },

    /* lateral categories (real team names; drivers partly real, rest generated) */
    frec: { id: 'frec', name: 'Formula Regional Europe', short: 'FRECA', tier: 1, lvl: 70, rounds: 10, rpr: 2, dpt: 3, pay: true, cost: [350, 720], titleName: 'FRECA Champion',
      rf: [{ n: 'R1', pts: PF1, grid: 'q' }, { n: 'R2', pts: PF1, grid: 'rev6' }],
      names: ['Monza', 'Misano', 'Paul Ricard', 'Spa', 'Hungaroring', 'Imola', 'Zandvoort', 'Barcelona', 'Mugello', 'Red Bull Ring'],
      teams: [['Prema Racing', 4, ''], ['R-ace GP', 3, ''], ['ART Grand Prix', 2, ''], ['Trident', 1, ''], ['MP Motorsport', 0, ''], ['Van Amersfoort Racing', -1, ''], ['Saintéloc Racing', -2.5, ''], ['Monolite Racing', -4, '']] },
    gt4: { id: 'gt4', name: 'GT4 European Series', short: 'GT4', tier: 1, lvl: 66, rounds: 12, rpr: 1, dpt: 2, pay: true, cost: [90, 210], titleName: 'GT4 Champion',
      rf: [{ n: 'Race', pts: PF1, grid: 'q' }], names: ['Monza', 'Misano', 'Spa', 'Paul Ricard', 'Hockenheim', 'Zandvoort', 'Nürburgring', 'Barcelona', 'Imola', 'Mugello', 'Hungaroring', 'Valencia'],
      teams: [['Comtoyou Racing', 3, ''], ['AF Corse', 2.5, ''], ['Team Spirit', 1, ''], ['Hofor Racing', 0, ''], ['Racing Spirit of Léman', -1, ''], ['Team Speedcar', -3, '']] },
    sfl: { id: 'sfl', name: 'Super Formula Lights', short: 'SF Lights', tier: 2, lvl: 71, rounds: 14, rpr: 1, dpt: 2, pay: true, cost: [150, 360], titleName: 'Super Formula Lights Champion',
      rf: [{ n: 'Race', pts: PF1, grid: 'q' }], names: ['Fuji', 'Suzuka', 'Motegi', 'Autopolis', 'Sugo', 'Okayama', 'Suzuka II', 'Fuji II', 'Motegi II', 'Autopolis II', 'Sugo II', 'Okayama II', 'Fuji III', 'Suzuka III'],
      teams: [['TOM\'S', 4, ''], ['B-Max Racing', 3, ''], ['Toda Racing', 2, ''], ['Rn-sports', 0.5, ''], ['Hitotsuyama Racing', -1, ''], ['Modulo Nakajima', -2, ''], ['Team Goh', -3, ''], ['Cerumo INGING', -4, '']] },
    nxt: { id: 'nxt', name: 'Indy NXT', short: 'Indy NXT', tier: 2, lvl: 73, rounds: 14, rpr: 1, dpt: 3, pay: true, cost: [500, 1150], titleName: 'Indy NXT Champion',
      rf: [{ n: 'Race', pts: PF1, grid: 'q' }], names: ['St. Petersburg', 'Barber', 'Indianapolis GP', 'Road America', 'Mid-Ohio', 'Iowa', 'Toronto', 'Laguna Seca', 'Portland', 'Milwaukee', 'Nashville', 'Gateway', 'Detroit', 'Long Beach'],
      teams: [['Andretti Global', 4, ''], ['HMD Motorsports', 3, ''], ['Juncos Hollinger Racing', 1.5, ''], ['Abel Motorsports', 0, ''], ['Cape Motorsports', -2, ''], ['Jonathan Byrd\'s Racing', -3.5, '']] },
    gt3: { id: 'gt3', name: 'GT World Challenge Europe', short: 'GT3', tier: 2, lvl: 73, rounds: 12, rpr: 1, dpt: 2, pay: true, cost: [200, 520], titleName: 'GT3 Champion',
      rf: [{ n: 'Race', pts: PF1, grid: 'q' }], names: ['Paul Ricard', 'Monza', 'Brands Hatch', 'Spa 24h', 'Nürburgring', 'Misano', 'Zandvoort', 'Barcelona', 'Hockenheim', 'Imola', 'Valencia', 'Mugello'],
      teams: [['AF Corse', 4, ''], ['Team WRT', 3.5, ''], ['Akkodis ASP Team', 2, ''], ['Rowe Racing', 1, ''], ['Winward Racing', 0, ''], ['Emil Frey Racing', -1, ''], ['Tresor Orange1', -2, ''], ['Comtoyou Racing', -3, ''], ['Boutsen VDS', -4, '']] },
    sf: { id: 'sf', name: 'Super Formula', short: 'Super Formula', tier: 3, lvl: 77, rounds: 9, rpr: 2, dpt: 2, pay: false, sal: [140, 480], titleName: 'Super Formula Champion',
      rf: [{ n: 'R1', pts: PF1, grid: 'q' }, { n: 'R2', pts: PF1, grid: 'rev6' }], names: ['Motegi', 'Fuji', 'Suzuka', 'Autopolis', 'Sugo', 'Okayama', 'Fuji II', 'Motegi II', 'Suzuka II'],
      teams: [['TOM\'S', 4, ''], ['Team Mugen', 3.5, ''], ['ITOCHU ENEOS Team Impul', 2.5, ''], ['Docomo Team Dandelion Racing', 1.5, ''], ['TGM Grand Prix', 0.5, ''], ['Kondo Racing', -0.5, ''], ['Nakajima Racing', -1.5, ''], ['Team Goh', -2.5, ''], ['KCMG', -3.5, ''], ['Cerumo INGING', -4.5, '']] },
    indy: { id: 'indy', name: 'IndyCar Series', short: 'IndyCar', tier: 3, lvl: 79, rounds: 17, rpr: 1, dpt: 2, pay: false, sal: [300, 3000], titleName: 'IndyCar Champion',
      rf: [{ n: 'Race', pts: PIND, grid: 'q' }], special: { 5: 'Indy 500 win' },
      names: ['St. Petersburg', 'Phoenix', 'Long Beach', 'Barber', 'Indianapolis GP', 'Indianapolis 500', 'Detroit', 'Road America', 'Mid-Ohio', 'Toronto', 'Iowa', 'Laguna Seca', 'Portland', 'Milwaukee', 'Nashville', 'Gateway', 'Markham'],
      teams: [
        ['Chip Ganassi Racing', 4.5, 'Alex Palou|Scott Dixon'],
        ['Team Penske', 4, 'Josef Newgarden|Scott McLaughlin'],
        ['Arrow McLaren', 3, 'Pato O\'Ward|Christian Lundgaard'],
        ['Andretti Global', 2, 'Kyle Kirkwood'],
        ['Meyer Shank Racing', 0.5, ''], ['Rahal Letterman Lanigan', -1, ''], ['Ed Carpenter Racing', -1.5, ''],
        ['Prema Racing', -2, ''], ['Juncos Hollinger Racing', -2.5, ''], ['A.J. Foyt Racing', -3, ''], ['Dale Coyne Racing', -4, ''],
      ] },
    wec: { id: 'wec', name: 'WEC Hypercar', short: 'WEC', tier: 3, lvl: 78, rounds: 8, rpr: 1, dpt: 3, pay: false, sal: [200, 1400], titleName: 'WEC Hypercar Champion',
      rf: [{ n: 'Race', pts: PF1, grid: 'q' }], special: { 3: '24 Hours of Le Mans win' },
      names: ['Qatar 1812km', 'Imola 6h', 'Spa 6h', '24 Hours of Le Mans', 'São Paulo 6h', 'COTA 6h', 'Fuji 6h', 'Bahrain 8h'],
      teams: [['Toyota Gazoo Racing', 4, ''], ['Ferrari AF Corse', 4, ''], ['Porsche Penske Motorsport', 3, ''], ['Cadillac Hertz Team Jota', 2.5, ''], ['BMW M Team WRT', 2, ''], ['Alpine Endurance Team', 0, ''], ['Peugeot TotalEnergies', -0.5, ''], ['Aston Martin THOR Team', -1, ''], ['Genesis Magma Racing', -1.5, '']] },
    fe: { id: 'fe', name: 'Formula E', short: 'Formula E', tier: 3, lvl: 78, rounds: 16, rpr: 1, dpt: 2, pay: false, sal: [250, 1900], titleName: 'Formula E Champion',
      rf: [{ n: 'E-Prix', pts: PF1, grid: 'q' }],
      names: ['São Paulo', 'Mexico City', 'Miami', 'Jeddah', 'Madrid', 'Berlin', 'Monaco', 'Sanya', 'Shanghai', 'Tokyo', 'London', 'Portland', 'Misano', 'Jakarta', 'Seoul', 'Cape Town'],
      teams: [['Jaguar TCS Racing', 4, 'Mitch Evans|Nick Cassidy'], ['Porsche Formula E Team', 4, 'Pascal Wehrlein'], ['Nissan Formula E Team', 2, ''], ['DS Penske', 1, ''], ['Mahindra Racing', 0, ''], ['Citroën Racing', -0.5, ''], ['Envision Racing', -1, ''], ['Andretti Formula E', -1.5, ''], ['Cupra Kiro', -2.5, ''], ['Lola Yamaha ABT', -3, '']] },
  };

  const ACADEMIES = [
    { n: 'Red Bull Junior Team', f1: ['Red Bull Racing', 'Racing Bulls'] },
    { n: 'Ferrari Driver Academy', f1: ['Ferrari', 'Haas'] },
    { n: 'Mercedes Junior Team', f1: ['Mercedes'] },
    { n: 'McLaren Driver Development Programme', f1: ['McLaren'] },
    { n: 'Alpine Academy', f1: ['Alpine'] },
    { n: 'Williams Driver Academy', f1: ['Williams'] },
    { n: 'Aston Martin Driver Development', f1: ['Aston Martin'] },
  ];

  // ladder logic
  const PROMO = { f4: ['f3'], frec: ['f3'], gt4: ['gt3'], f3: ['f2'], sfl: ['sf'], nxt: ['indy'], gt3: ['wec'], f2: ['f1'], sf: ['f1'], indy: ['f1'], wec: ['f1'], fe: ['f1'] };
  const LATERAL = { f4: ['frec', 'gt4'], frec: ['gt4'], gt4: ['frec'], f3: ['sfl', 'nxt', 'gt3'], sfl: ['nxt', 'gt3'], nxt: ['sfl', 'gt3'], gt3: ['sfl', 'nxt'], f2: ['indy', 'sf', 'wec', 'fe'] };
  const STUCK_CATS = ['f4', 'frec', 'gt4', 'f3', 'sfl', 'nxt', 'gt3', 'f2'];
  const TIER3_SIDE = ['sf', 'indy', 'wec', 'fe'];
  const STATS = ['PAC', 'QUA', 'RAC', 'CON', 'WET', 'TYR', 'FIT', 'MEN'];
  const STAT_NAMES = { PAC: 'Pace', QUA: 'Qualifying', RAC: 'Racecraft', CON: 'Consistency', WET: 'Wet weather', TYR: 'Tyre mgmt', FIT: 'Fitness', MEN: 'Mentality' };

  const D = { NATS, CATS, ACADEMIES, PROMO, LATERAL, STUCK_CATS, TIER3_SIDE, STATS, STAT_NAMES };
  if (typeof module !== 'undefined' && module.exports) module.exports = D; else root.F1D = D;
})(typeof window !== 'undefined' ? window : globalThis);
