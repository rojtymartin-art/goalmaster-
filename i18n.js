// =============================================================================
// GOALMASTER PRO – JAZYKOVÝ MODUL: 30 JAZYKOV (i18n.js)
// Podporuje UI preklady, šablóny pre 1 500+ dynamických otázok aj RTL (arabčina)
// =============================================================================

window.GM_I18N = (function () {
  const LANGS = {
    sk: {
      name: "🇸🇰 Slovenčina", rtl: false,
      home: "Domov", packs: "Balíčky", pass: "Pas", shop: "Obchod", profile: "Profil",
      play: "Hrať", back: "Späť", next: "Ďalej →", guess: "Tipnúť", ok: "Správne!", err: "Nesprávne!",
      free: "ZADARMO", vip: "VIP", daily: "Denná výzva", gift: "Denný darček", streak: "Séria", rank: "Hodnosť",
      mQuiz: "Futbalový Kvíz", mDet: "Detektív prestupov", mHL: "Vyššie alebo Nižšie", mPres: "Prezident Klubu",
      mPen: "Penaltový rozstrel", mGrid: "Futbalová mriežka 3×3", mXI: "Chýbajúca XI", mDeal: "Vyjednávací stôl",
      qClub: "Za ktorý z týchto klubov hral {player}?",
      qNotClub: "Za ktorý z týchto klubov NIKDY nehral {player}?",
      qBothClubs: "Ktorý hráč pôsobil v kluboch {c1} aj {c2}?",
      qMoreGoals: "Ktorý z týchto hráčov má na konte VIAC gólov?",
      qHigherVal: "Ktorý hráč dosiahol najvyššiu trhovú hodnotu (€M)?",
      qCountry: "Ktorú krajinu reprezentoval {player}?"
    },
    cz: {
      name: "🇨🇿 Čeština", rtl: false,
      home: "Domů", packs: "Balíčky", pass: "Pass", shop: "Obchod", profile: "Profil",
      play: "Hrát", back: "Zpět", next: "Další →", guess: "Tipnout", ok: "Správně!", err: "Špatně!",
      free: "ZDARMA", vip: "VIP", daily: "Denní výzva", gift: "Denní dárek", streak: "Série", rank: "Hodnost",
      mQuiz: "Fotbalový Kvíz", mDet: "Detektiv přestupů", mHL: "Vyšší nebo Nižší", mPres: "Prezident Klubu",
      mPen: "Penaltový rozstřel", mGrid: "Fotbalová mřížka 3×3", mXI: "Chybějící XI", mDeal: "Vyjednávací stůl",
      qClub: "Za který z těchto klubů hrál {player}?",
      qNotClub: "Za který z těchto klubů NIKDY nehrál {player}?",
      qBothClubs: "Který hráč působil v klubech {c1} i {c2}?",
      qMoreGoals: "Který z těchto hráčů vstřelil VÍCE gólů?",
      qHigherVal: "Který hráč dosáhl nejvyšší tržní hodnoty (€M)?",
      qCountry: "Kterou zemi reprezentoval {player}?"
    },
    en: {
      name: "🇬🇧 English", rtl: false,
      home: "Home", packs: "Packs", pass: "Pass", shop: "Shop", profile: "Profile",
      play: "Play", back: "Back", next: "Next →", guess: "Guess", ok: "Correct!", err: "Wrong!",
      free: "FREE", vip: "VIP", daily: "Daily Challenge", gift: "Daily Gift", streak: "Streak", rank: "Rank",
      mQuiz: "Football Quiz", mDet: "Transfer Detective", mHL: "Higher or Lower", mPres: "Club President",
      mPen: "Penalty Shootout", mGrid: "Football Grid 3×3", mXI: "Missing XI", mDeal: "Deal Table",
      qClub: "Which of these clubs did {player} play for?",
      qNotClub: "Which of these clubs did {player} NEVER play for?",
      qBothClubs: "Which player played for both {c1} and {c2}?",
      qMoreGoals: "Which of these players scored MORE career goals?",
      qHigherVal: "Which player reached the highest peak market value (€M)?",
      qCountry: "Which country did {player} represent?"
    },
    de: {
      name: "🇩🇪 Deutsch", rtl: false,
      home: "Start", packs: "Packs", pass: "Pass", shop: "Shop", profile: "Profil",
      play: "Spielen", back: "Zurück", next: "Weiter →", guess: "Raten", ok: "Richtig!", err: "Falsch!",
      free: "GRATIS", vip: "VIP", daily: "Tages-Challenge", gift: "Tagesgeschenk", streak: "Serie", rank: "Rang",
      mQuiz: "Fußball-Quiz", mDet: "Transfer-Detektiv", mHL: "Höher oder Niedriger", mPres: "Vereinspräsident",
      mPen: "Elfmeterschießen", mGrid: "Fußball-Grid 3×3", mXI: "Fehlende Elf", mDeal: "Transfer-Verhandlung",
      qClub: "Für welchen dieser Vereine spielte {player}?",
      qNotClub: "Für welchen dieser Vereine spielte {player} NIE?",
      qBothClubs: "Welcher Spieler spielte für {c1} und {c2}?",
      qMoreGoals: "Welcher dieser Spieler erzielte MEHR Karrieretore?",
      qHigherVal: "Welcher Spieler erreichte den höchsten Marktwert (€M)?",
      qCountry: "Welches Land vertrat {player}?"
    },
    es: {
      name: "🇪🇸 Español", rtl: false,
      home: "Inicio", packs: "Sobres", pass: "Pase", shop: "Tienda", profile: "Perfil",
      play: "Jugar", back: "Volver", next: "Siguiente →", guess: "Adivinar", ok: "¡Correcto!", err: "¡Incorrecto!",
      free: "GRATIS", vip: "VIP", daily: "Desafío Diario", gift: "Regalo Diario", streak: "Racha", rank: "Rango",
      mQuiz: "Quiz de Fútbol", mDet: "Detective de Fichajes", mHL: "Mayor o Menor", mPres: "Presidente del Club",
      mPen: "Tanda de Penaltis", mGrid: "Cuadrícula 3×3", mXI: "Once Perdido", mDeal: "Mesa de Fichajes",
      qClub: "¿En cuál de estos clubes jugó {player}?",
      qNotClub: "¿En cuál de estos clubes NUNCA jugó {player}?",
      qBothClubs: "¿Qué jugador militó tanto en {c1} como en {c2}?",
      qMoreGoals: "¿Cuál de estos jugadores marcó MÁS goles?",
      qHigherVal: "¿Qué jugador alcanzó el mayor valor de mercado (€M)?",
      qCountry: "¿A qué país representó {player}?"
    },
    fr: {
      name: "🇫🇷 Français", rtl: false,
      home: "Accueil", packs: "Packs", pass: "Pass", shop: "Boutique", profile: "Profil",
      play: "Jouer", back: "Retour", next: "Suivant →", guess: "Valider", ok: "Correct !", err: "Faux !",
      free: "GRATUIT", vip: "VIP", daily: "Défi du Jour", gift: "Cadeau du Jour", streak: "Série", rank: "Rang",
      mQuiz: "Quiz Football", mDet: "Détective Transferts", mHL: "Plus ou Moins", mPres: "Président de Club",
      mPen: "Tirs au But", mGrid: "Grille Foot 3×3", mXI: "Onze Manquant", mDeal: "Table des Transferts",
      qClub: "Pour lequel de ces clubs {player} a-t-il joué ?",
      qNotClub: "Pour lequel de ces clubs {player} n'a-t-il JAMAIS joué ?",
      qBothClubs: "Quel joueur a porté le maillot de {c1} et de {c2} ?",
      qMoreGoals: "Lequel de ces joueurs a marqué le PLUS de buts ?",
      qHigherVal: "Quel joueur a atteint la plus haute valeur marchande (€M) ?",
      qCountry: "Quel pays {player} a-t-il représenté ?"
    },
    it: {
      name: "🇮🇹 Italiano", rtl: false,
      home: "Home", packs: "Pacchetti", pass: "Pass", shop: "Negozio", profile: "Profilo",
      play: "Gioca", back: "Indietro", next: "Avanti →", guess: "Indovina", ok: "Esatto!", err: "Sbagliato!",
      free: "GRATIS", vip: "VIP", daily: "Sfida del Giorno", gift: "Regalo Giornaliero", streak: "Serie", rank: "Grado",
      mQuiz: "Quiz Calcio", mDet: "Detective Mercato", mHL: "Più o Meno", mPres: "Presidente Club",
      mPen: "Calci di Rigore", mGrid: "Griglia 3×3", mXI: "Formazione XI", mDeal: "Tavolo Trattative",
      qClub: "In quale di questi club ha giocato {player}?",
      qNotClub: "In quale di questi club NON ha mai giocato {player}?",
      qBothClubs: "Quale calciatore ha giocato sia nel {c1} che nel {c2}?",
      qMoreGoals: "Chi ha segnato PIÙ gol in carriera?",
      qHigherVal: "Quale giocatore ha raggiunto il valore di mercato più alto (€M)?",
      qCountry: "Quale nazionale ha rappresentato {player}?"
    },
    pt: {
      name: "🇵🇹 Português", rtl: false,
      home: "Início", packs: "Pacotes", pass: "Passe", shop: "Loja", profile: "Perfil",
      play: "Jogar", back: "Voltar", next: "Próximo →", guess: "Palpitar", ok: "Correto!", err: "Errado!",
      free: "GRÁTIS", vip: "VIP", daily: "Desafio Diário", gift: "Presente Diário", streak: "Sequência", rank: "Nível",
      mQuiz: "Quiz de Futebol", mDet: "Detetive Transferências", mHL: "Maior ou Menor", mPres: "Presidente do Clube",
      mPen: "Disputa de Pênaltis", mGrid: "Grade 3×3", mXI: "Escalação XI", mDeal: "Mesa de Negociação",
      qClub: "Por qual destes clubes {player} jogou?",
      qNotClub: "Por qual destes clubes {player} NUNCA jogou?",
      qBothClubs: "Qual jogador atuou por {c1} e {c2}?",
      qMoreGoals: "Qual destes jogadores marcou MAIS gols?",
      qHigherVal: "Qual jogador atingiu o maior valor de mercado (€M)?",
      qCountry: "Qual seleção {player} representou?"
    },
    pl: {
      name: "🇵🇱 Polski", rtl: false,
      home: "Start", packs: "Paczki", pass: "Karnet", shop: "Sklep", profile: "Profil",
      play: "Graj", back: "Wróć", next: "Dalej →", guess: "Zgaduj", ok: "Dobrze!", err: "Źle!",
      free: "DARMOWE", vip: "VIP", daily: "Wyzwanie Dnia", gift: "Prezent Dnia", streak: "Seria", rank: "Ranga",
      mQuiz: "Quiz Piłkarski", mDet: "Detektyw Transferowy", mHL: "Wyżej czy Niżej", mPres: "Prezes Klubu",
      mPen: "Rzuty Karne", mGrid: "Siatka 3×3", mXI: "Brakująca XI", mDeal: "Stół Negocjacyjny",
      qClub: "W którym z tych klubów grał {player}?",
      qNotClub: "W którym z tych klubów {player} NIGDY nie grał?",
      qBothClubs: "Który piłkarz grał zarówno w {c1}, jak i w {c2}?",
      qMoreGoals: "Który z tych piłkarzy strzelił WIĘCEJ goli?",
      qHigherVal: "Który gracz osiągnął najwyższą wartość rynkową (€M)?",
      qCountry: "Jaki kraj reprezentował {player}?"
    },
    nl: {
      name: "🇳🇱 Nederlands", rtl: false,
      home: "Home", packs: "Packs", pass: "Pas", shop: "Winkel", profile: "Profiel",
      play: "Spelen", back: "Terug", next: "Volgende →", guess: "Gokken", ok: "Goed!", err: "Fout!",
      free: "GRATIS", vip: "VIP", daily: "Dagelijkse Uitdaging", gift: "Dagelijks Cadeau", streak: "Reeks", rank: "Rang",
      mQuiz: "Voetbalquiz", mDet: "Transfer Detective", mHL: "Hoger of Lager", mPres: "Clubpresident",
      mPen: "Strafschoppen", mGrid: "Voetbalraster 3×3", mXI: "Ontbrekende XI", mDeal: "Onderhandelingstafel",
      qClub: "Voor welke van deze clubs speelde {player}?",
      qNotClub: "Voor welke van deze clubs speelde {player} NOOIT?",
      qBothClubs: "Welke speler speelde voor zowel {c1} als {c2}?",
      qMoreGoals: "Welke speler scoorde MEER doelpunten?",
      qHigherVal: "Welke speler bereikte de hoogste marktwaarde (€M)?",
      qCountry: "Welk land vertegenwoordigde {player}?"
    },
    hr: {
      name: "🇭🇷 Hrvatski", rtl: false,
      home: "Početna", packs: "Paketi", pass: "Propusnica", shop: "Trgovina", profile: "Profil",
      play: "Igraj", back: "Natrag", next: "Dalje →", guess: "Pogodi", ok: "Točno!", err: "Netočno!",
      free: "BESPLATNO", vip: "VIP", daily: "Dnevni Izazov", gift: "Dnevni Poklon", streak: "Niz", rank: "Rang",
      mQuiz: "Nogometni Kviz", mDet: "Detektiv Transfera", mHL: "Više ili Niže", mPres: "Predsjednik Kluba",
      mPen: "Jedanaesterci", mGrid: "Nogometna Mreža 3×3", mXI: "Nedostajućih XI", mDeal: "Pregovarački Stol",
      qClub: "Za koji od ovih klubova je igrao {player}?",
      qNotClub: "Za koji od ovih klubova {player} NIKADA nije igrao?",
      qBothClubs: "Koji je igrač nastupao i za {c1} i za {c2}?",
      qMoreGoals: "Koji je od ovih igrača zabio VIŠE golova?",
      qHigherVal: "Koji je igrač dosegao najveću tržišnu vrijednost (€M)?",
      qCountry: "Koju je reprezentaciju predstavljao {player}?"
    },
    tr: {
      name: "🇹🇷 Türkçe", rtl: false,
      home: "Ana Sayfa", packs: "Paketler", pass: "Bilet", shop: "Mağaza", profile: "Profil",
      play: "Oyna", back: "Geri", next: "Sonraki →", guess: "Tahmin", ok: "Doğru!", err: "Yanlış!",
      free: "ÜCRETSİZ", vip: "VIP", daily: "Günlük Görev", gift: "Günlük Hediye", streak: "Seri", rank: "Rütbe",
      mQuiz: "Futbol Bilgi Yarışması", mDet: "Transfer Dedektifi", mHL: "Yüksek veya Düşük", mPres: "Kulüp Başkanı",
      mPen: "Penaltı Atışları", mGrid: "Futbol Tablosu 3×3", mXI: "Eksik 11", mDeal: "Pazarlık Masası",
      qClub: "{player} bu kulüplerden hangisinde oynadı?",
      qNotClub: "{player} bu kulüplerden hangisinde HİÇ oynamadı?",
      qBothClubs: "Hem {c1} hem de {c2} forması giyen futbolcu kim?",
      qMoreGoals: "Bu oyunculardan hangisi DAHA FAZLA gol attı?",
      qHigherVal: "En yüksek piyasa değerine (€M) hangi oyuncu ulaştı?",
      qCountry: "{player} hangi milli takımda oynadı?"
    },
    hu: {
      name: "🇭🇺 Magyar", rtl: false,
      home: "Főoldal", packs: "Csomagok", pass: "Bérlet", shop: "Bolt", profile: "Profil",
      play: "Játék", back: "Vissza", next: "Következő →", guess: "Tipp", ok: "Helyes!", err: "Helytelen!",
      free: "INGYENES", vip: "VIP", daily: "Napi Kihívás", gift: "Napi Ajándék", streak: "Sorozat", rank: "Rang",
      mQuiz: "Focikvíz", mDet: "Átigazolási Detektív", mHL: "Több vagy Kevesebb", mPres: "Klubelnök",
      mPen: "Büntetőpárbaj", mGrid: "Focirács 3×3", mXI: "Hiányzó XI", mDeal: "Tárgyalóasztal",
      qClub: "Melyik klubban játszott {player}?",
      qNotClub: "Melyik klubban NEM játszott soha {player}?",
      qBothClubs: "Melyik játékos szerepelt a(z) {c1} és a(z) {c2} csapatában is?",
      qMoreGoals: "Melyik játékos szerzett TÖBB gólt karrierje során?",
      qHigherVal: "Melyik játékos érte el a legmagasabb piaci értéket (€M)?",
      qCountry: "Melyik válogatottban játszott {player}?"
    },
    ro: {
      name: "🇷🇴 Română", rtl: false,
      home: "Acasă", packs: "Pachete", pass: "Permis", shop: "Magazin", profile: "Profil",
      play: "Joacă", back: "Înapoi", next: "Următorul →", guess: "Ghicește", ok: "Corect!", err: "Greșit!",
      free: "GRATUIT", vip: "VIP", daily: "Provocarea Zilei", gift: "Cadou Zilnic", streak: "Serie", rank: "Rang",
      mQuiz: "Quiz Fotbal", mDet: "Detectiv Transferuri", mHL: "Mai Mare sau Mai Mic", mPres: "Președinte Club",
      mPen: "Lovituri de Departajare", mGrid: "Grilă Fotbal 3×3", mXI: "Primul 11 Lipsă", mDeal: "Masa Negocierilor",
      qClub: "La care dintre aceste cluburi a jucat {player}?",
      qNotClub: "La care dintre aceste cluburi NU a jucat niciodată {player}?",
      qBothClubs: "Care jucător a evoluat atât la {c1}, cât și la {c2}?",
      qMoreGoals: "Care dintre acești jucători a marcat MAI MULTE goluri?",
      qHigherVal: "Care jucător a atins cea mai mare cotă de piață (€M)?",
      qCountry: "Ce țară a reprezentat {player}?"
    },
    sr: {
      name: "🇷🇸 Srpski", rtl: false,
      home: "Početna", packs: "Paketi", pass: "Propusnica", shop: "Prodavnica", profile: "Profil",
      play: "Igraj", back: "Nazad", next: "Sledeće →", guess: "Pogodi", ok: "Tačno!", err: "Netačno!",
      free: "BESPLATNO", vip: "VIP", daily: "Dnevni Izazov", gift: "Dnevni Poklon", streak: "Niz", rank: "Rang",
      mQuiz: "Fudbalski Kviz", mDet: "Detektiv Transfera", mHL: "Više ili Niže", mPres: "Predsednik Kluba",
      mPen: "Penal Serija", mGrid: "Fudbalska Mreža 3×3", mXI: "Nedostajućih XI", mDeal: "Pregovarački Sto",
      qClub: "Za koji od ovih klubova je igrao {player}?",
      qNotClub: "Za koji od ovih klubova {player} NIKADA nije igrao?",
      qBothClubs: "Koji igrač je igrao i za {c1} i za {c2}?",
      qMoreGoals: "Koji od ovih igrača je postigao VIŠE golova?",
      qHigherVal: "Koji igrač je dostigao najveću tržišnu vrednost (€M)?",
      qCountry: "Koju reprezentaciju je predstavljao {player}?"
    },
    bg: {
      name: "🇧🇬 Български", rtl: false,
      home: "Начало", packs: "Пакети", pass: "Пропуск", shop: "Магазин", profile: "Профил",
      play: "Играй", back: "Назад", next: "Напред →", guess: "Познай", ok: "Вярно!", err: "Грешно!",
      free: "БЕЗПЛАТНО", vip: "VIP", daily: "Дневно Предизвикателство", gift: "Дневен Подарък", streak: "Серия", rank: "Ранг",
      mQuiz: "Футболен Куиз", mDet: "Трансферен Детектив", mHL: "Повече или По-малко", mPres: "Президент на Клуб",
      mPen: "Дузпи", mGrid: "Футболна Мрежа 3×3", mXI: "Липсващите XI", mDeal: "Маса за Преговори",
      qClub: "За кой от тези клубове е играл {player}?",
      qNotClub: "За кой от тези клубове {player} НИКОГА не е играл?",
      qBothClubs: "Кой футболист е играл и за {c1}, и за {c2}?",
      qMoreGoals: "Кой от тези играчи е вкарал ПОВЕЧЕ голове?",
      qHigherVal: "Кой играч достигна най-висока пазарна стойност (€M)?",
      qCountry: "Коя държава представляваше {player}?"
    },
    uk: {
      name: "🇺🇦 Українська", rtl: false,
      home: "Головна", packs: "Паки", pass: "Перепустка", shop: "Магазин", profile: "Профіль",
      play: "Грати", back: "Назад", next: "Далі →", guess: "Вгадати", ok: "Вірно!", err: "Помилка!",
      free: "БЕЗКОШТОВНО", vip: "VIP", daily: "Щоденний Виклик", gift: "Подарунок Дня", streak: "Серія", rank: "Ранг",
      mQuiz: "Футбольна Вікторина", mDet: "Детектив Трансферів", mHL: "Вище чи Нижче", mPres: "Президент Клубу",
      mPen: "Серія Пенальті", mGrid: "Футбольна Сітка 3×3", mXI: "Зникла XI", mDeal: "Стіл Переговорів",
      qClub: "За який із цих клубів грав {player}?",
      qNotClub: "За який із цих клубів {player} НІКОЛИ не грав?",
      qBothClubs: "Який гравець виступав і за {c1}, і за {c2}?",
      qMoreGoals: "Хто з цих гравців забив БІЛЬШЕ голів?",
      qHigherVal: "Хто досяг найвищої ринкової вартості (€M)?",
      qCountry: "Яку збірну представляв {player}?"
    },
    ru: {
      name: "🇷🇺 Русский", rtl: false,
      home: "Главная", packs: "Паки", pass: "Пропуск", shop: "Магазин", profile: "Профиль",
      play: "Играть", back: "Назад", next: "Далее →", guess: "Угадать", ok: "Верно!", err: "Неверно!",
      free: "БЕСПЛАТНО", vip: "VIP", daily: "Вызов Дня", gift: "Подарок Дня", streak: "Серия", rank: "Ранг",
      mQuiz: "Футбольный Квиз", mDet: "Детектив Трансферов", mHL: "Выше или Ниже", mPres: "Президент Клуба",
      mPen: "Серия Пенальти", mGrid: "Футбольная Сетка 3×3", mXI: "Пропавший Состав", mDeal: "Стол Переговоров",
      qClub: "За какой из этих клубов играл {player}?",
      qNotClub: "За какой из этих клубов {player} НИКОГДА не играл?",
      qBothClubs: "Какой игрок выступал и за {c1}, и за {c2}?",
      qMoreGoals: "Кто из этих игроков забил БОЛЬШЕ голов?",
      qHigherVal: "Кто достиг самой высокой рыночной стоимости (€M)?",
      qCountry: "За какую сборную играл {player}?"
    },
    sv: {
      name: "🇸🇪 Svenska", rtl: false,
      home: "Hem", packs: "Paket", pass: "Pass", shop: "Butik", profile: "Profil",
      play: "Spela", back: "Tillbaka", next: "Nästa →", guess: "Gissa", ok: "Rätt!", err: "Fel!",
      free: "GRATIS", vip: "VIP", daily: "Dagens Utmaning", gift: "Daglig Gåva", streak: "Svit", rank: "Rang",
      mQuiz: "Fotbollsquiz", mDet: "Transferdetektiv", mHL: "Högre eller Lägre", mPres: "Klubbpresident",
      mPen: "Straffläggning", mGrid: "Fotbollsrutnät 3×3", mXI: "Saknad Elva", mDeal: "Förhandlingsbord",
      qClub: "För vilken av dessa klubbar spelade {player}?",
      qNotClub: "För vilken av dessa klubbar spelade {player} ALDRIG?",
      qBothClubs: "Vilken spelare spelade för både {c1} och {c2}?",
      qMoreGoals: "Vilken av dessa spelare gjorde FLER mål?",
      qHigherVal: "Vilken spelare nådde högst marknadsvärde (€M)?",
      qCountry: "Vilket land representerade {player}?"
    },
    no: {
      name: "🇳🇴 Norsk", rtl: false,
      home: "Hjem", packs: "Pakker", pass: "Pass", shop: "Butikk", profile: "Profil",
      play: "Spill", back: "Tilbake", next: "Neste →", guess: "Gjett", ok: "Riktig!", err: "Feil!",
      free: "GRATIS", vip: "VIP", daily: "Daglig Utfordring", gift: "Daglig Gave", streak: "Rekke", rank: "Rang",
      mQuiz: "Fotballquiz", mDet: "Overgangsdetektiv", mHL: "Høyere eller Lavere", mPres: "Klubbpresident",
      mPen: "Straffespark", mGrid: "Fotballrutenett 3×3", mXI: "Manglende XI", mDeal: "Forhandlingsbord",
      qClub: "Hvilken av disse klubbene spilte {player} for?",
      qNotClub: "Hvilken av disse klubbene spilte {player} ALDRI for?",
      qBothClubs: "Hvilken spiller har spilt for både {c1} og {c2}?",
      qMoreGoals: "Hvilken av disse spillerne scoret FLEST mål?",
      qHigherVal: "Hvilken spiller nådde høyest markedsverdi (€M)?",
      qCountry: "Hvilket land representerte {player}?"
    },
    da: {
      name: "🇩🇰 Dansk", rtl: false,
      home: "Hjem", packs: "Pakker", pass: "Pas", shop: "Butik", profile: "Profil",
      play: "Spil", back: "Tilbage", next: "Næste →", guess: "Gæt", ok: "Rigtigt!", err: "Forkert!",
      free: "GRATIS", vip: "VIP", daily: "Daglig Udfordring", gift: "Daglig Gave", streak: "Stime", rank: "Rang",
      mQuiz: "Fodboldquiz", mDet: "Transferdetektiv", mHL: "Højere eller Lavere", mPres: "Klubpræsident",
      mPen: "Straffespark", mGrid: "Fodboldgitter 3×3", mXI: "Manglende XI", mDeal: "Forhandlingsbord",
      qClub: "Hvilken af disse klubber spillede {player} for?",
      qNotClub: "Hvilken af disse klubber spillede {player} ALDRIG for?",
      qBothClubs: "Hvilken spiller har spillet for både {c1} og {c2}?",
      qMoreGoals: "Hvem af disse spillere scorede FLEST mål?",
      qHigherVal: "Hvilken spiller nåede den højeste markedsværdi (€M)?",
      qCountry: "Hvilket land repræsenterede {player}?"
    },
    fi: {
      name: "🇫🇮 Suomi", rtl: false,
      home: "Koti", packs: "Paketit", pass: "Passi", shop: "Kauppa", profile: "Profiili",
      play: "Pelaa", back: "Takaisin", next: "Seuraava →", guess: "Arvaa", ok: "Oikein!", err: "Väärin!",
      free: "ILMAINEN", vip: "VIP", daily: "Päivän Haaste", gift: "Päivän Lahja", streak: "Putki", rank: "Taso",
      mQuiz: "Jalkapallovisa", mDet: "Siirtoetsivä", mHL: "Enemmän vai Vähemmän", mPres: "Seuran Johtaja",
      mPen: "Rangaistuspotkut", mGrid: "Ruudukko 3×3", mXI: "Puuttuva XI", mDeal: "Neuvottelupöytä",
      qClub: "Missä näistä seuroista {player} pelasi?",
      qNotClub: "Missä näistä seuroista {player} EI KOSKAAN pelannut?",
      qBothClubs: "Kuka pelaaja edusti sekä seuraa {c1} että {c2}?",
      qMoreGoals: "Kuka näistä pelaajista teki ENEMMÄN maaleja?",
      qHigherVal: "Kuka pelaaja saavutti korkeimman markkina-arvon (€M)?",
      qCountry: "Mitä maata {player} edusti?"
    },
    el: {
      name: "🇬🇷 Ελληνικά", rtl: false,
      home: "Αρχική", packs: "Πακέτα", pass: "Πάσο", shop: "Κατάστημα", profile: "Προφίλ",
      play: "Παίξε", back: "Πίσω", next: "Επόμενο →", guess: "Μάντεψε", ok: "Σωστό!", err: "Λάθος!",
      free: "ΔΩΡΕΑΝ", vip: "VIP", daily: "Ημερήσια Πρόκληση", gift: "Δώρο Ημέρας", streak: "Σερί", rank: "Βαθμός",
      mQuiz: "Κουίζ Ποδοσφαίρου", mDet: "Ντετέκτιβ Μεταγραφών", mHL: "Πάνω ή Κάτω", mPres: "Πρόεδρος Ομάδας",
      mPen: "Πέναλτι", mGrid: "Πλέγμα 3×3", mXI: "Χαμένη Ενδεκάδα", mDeal: "Τραπέζι Διαπραγμάτευσης",
      qClub: "Σε ποια από αυτές τις ομάδες έπαιξε ο {player};",
      qNotClub: "Σε ποια από αυτές τις ομάδες ΔΕΝ έπαιξε ποτέ ο {player};",
      qBothClubs: "Ποιος παίκτης έπαιξε τόσο στη {c1} όσο και στη {c2};",
      qMoreGoals: "Ποιος από αυτούς τους παίκτες πέτυχε ΠΕΡΙΣΣΟΤΕΡΑ γκολ;",
      qHigherVal: "Ποιος παίκτης έφτασε τη μεγαλύτερη χρηματιστηριακή αξία (€M);",
      qCountry: "Ποια χώρα εκπροσώπησε ο {player};"
    },
    ar: {
      name: "🇸🇦 العربية", rtl: true,
      home: "الرئيسية", packs: "الباقات", pass: "التذكرة", shop: "المتجر", profile: "الملف",
      play: "العب", back: "رجوع", next: "التالي ←", guess: "تخمين", ok: "صحيح!", err: "خطأ!",
      free: "مجاني", vip: "VIP", daily: "تحدي اليوم", gift: "هدية اليوم", streak: "سلسلة", rank: "الرتبة",
      mQuiz: "اختبار كرة القدم", mDet: "محقق الانتقالات", mHL: "أعلى أم أقل", mPres: "رئيس النادي",
      mPen: "ركلات الترجيح", mGrid: "شبكة 3×3", mXI: "التشكيلة المفقودة", mDeal: "طاولة المفاوضات",
      qClub: "لأي من هذه الأندية لعب {player}؟",
      qNotClub: "أي من هذه الأندية لم يلعب له {player} أبداً؟",
      qBothClubs: "أي لاعب مثل كلاً من {c1} و {c2}؟",
      qMoreGoals: "أي من هؤلاء اللاعبين سجل أهدافاً أكثر؟",
      qHigherVal: "أي لاعب وصل إلى أعلى قيمة سوقية (€M)؟",
      qCountry: "أي منتخب مثّل اللاعب {player}؟"
    },
    ja: {
      name: "🇯🇵 日本語", rtl: false,
      home: "ホーム", packs: "パック", pass: "パス", shop: "ショップ", profile: "プロフィール",
      play: "プレイ", back: "戻る", next: "次へ →", guess: "回答", ok: "正解！", err: "不正解！",
      free: "無料", vip: "VIP", daily: "デイリー挑戦", gift: "デイリーギフト", streak: "連勝", rank: "ランク",
      mQuiz: "サッカークイズ", mDet: "移籍探偵", mHL: "ハイ＆ロー", mPres: "クラブ会長",
      mPen: "PK戦", mGrid: "3×3グリッド", mXI: "伝説のスタメン", mDeal: "移籍交渉",
      qClub: "{player}が所属したクラブはどれ？",
      qNotClub: "{player}が一度も所属していないクラブはどれ？",
      qBothClubs: "{c1}と{c2}の両方でプレーした選手は？",
      qMoreGoals: "通算ゴール数が最も多い選手は？",
      qHigherVal: "最高市場価値(€M)が最も高かった選手は？",
      qCountry: "{player}が代表を務めた国は？"
    },
    ko: {
      name: "🇰🇷 한국어", rtl: false,
      home: "홈", packs: "카드팩", pass: "패스", shop: "상점", profile: "프로필",
      play: "플레이", back: "뒤로", next: "다음 →", guess: "정답 확인", ok: "정답!", err: "오답!",
      free: "무료", vip: "VIP", daily: "일일 챌린지", gift: "출석 선물", streak: "연속", rank: "등급",
      mQuiz: "축구 퀴즈", mDet: "이적 탐정", mHL: "업 앤 다운", mPres: "구단주 모드",
      mPen: "승부차기", mGrid: "축구 빙고 3×3", mXI: "베스트 11 맞추기", mDeal: "이적 협상",
      qClub: "{player} 선수가 뛰었던 구단은?",
      qNotClub: "{player} 선수가 한 번도 뛴 적 없는 구단은?",
      qBothClubs: "{c1}와(과) {c2} 모두에서 뛴 선수는?",
      qMoreGoals: "통산 득점이 더 많은 선수는?",
      qHigherVal: "최고 시장 가치(€M)가 가장 높았던 선수는?",
      qCountry: "{player} 선수의 국가대표팀은?"
    },
    zh: {
      name: "🇨🇳 中文", rtl: false,
      home: "首页", packs: "卡包", pass: "通行证", shop: "商店", profile: "个人",
      play: "开始", back: "返回", next: "下一题 →", guess: "猜一猜", ok: "回答正确！", err: "回答错误！",
      free: "免费", vip: "VIP", daily: "每日挑战", gift: "每日礼包", streak: "连胜", rank: "段位",
      mQuiz: "足球问答", mDet: "转会侦探", mHL: "更高或更低", mPres: "俱乐部主席",
      mPen: "点球大战", mGrid: "足球九宫格", mXI: "经典首发XI", mDeal: "转会谈判桌",
      qClub: "{player}曾效力于以下哪家俱乐部？",
      qNotClub: "{player}从未效力过以下哪家俱乐部？",
      qBothClubs: "哪位球员同时效力过{c1}和{c2}？",
      qMoreGoals: "以下哪位球员生涯进球数更多？",
      qHigherVal: "哪位球员巅峰身价(€M)最高？",
      qCountry: "{player}代表哪个国家队出战？"
    },
    hi: {
      name: "🇮🇳 हिन्दी", rtl: false,
      home: "होम", packs: "पैक्स", pass: "पास", shop: "दुकान", profile: "प्रोफ़ाइल",
      play: "खेलें", back: "वापस", next: "अगला →", guess: "अनुमान", ok: "सही!", err: "गलत!",
      free: "मुफ़्त", vip: "VIP", daily: "दैनिक चुनौती", gift: "दैनिक उपहार", streak: "लगातार", rank: "रैंक",
      mQuiz: "फ़ुटबॉल क्विज़", mDet: "ट्रांसफ़र डिटेक्टिव", mHL: "ज्यादा या कम", mPres: "क्लब अध्यक्ष",
      mPen: "पेनल्टी शूटआउट", mGrid: "फ़ुटबॉल ग्रिड 3×3", mXI: "मिसिंग XI", mDeal: "डील टेबल",
      qClub: "{player} इनमें से किस क्लब के लिए खेले?",
      qNotClub: "{player} इनमें से किस क्लब के लिए कभी नहीं खेले?",
      qBothClubs: "किस खिलाड़ी ने {c1} और {c2} दोनों के लिए खेला?",
      qMoreGoals: "इनमें से किस खिलाड़ी ने अधिक गोल किए?",
      qHigherVal: "किस खिलाड़ी का बाज़ार मूल्य (€M) सबसे अधिक रहा?",
      qCountry: "{player} ने किस देश का प्रतिनिधित्व किया?"
    },
    id: {
      name: "🇮🇩 Bahasa Indonesia", rtl: false,
      home: "Beranda", packs: "Paket", pass: "Pass", shop: "Toko", profile: "Profil",
      play: "Main", back: "Kembali", next: "Lanjut →", guess: "Tebak", ok: "Benar!", err: "Salah!",
      free: "GRATIS", vip: "VIP", daily: "Tantangan Harian", gift: "Hadiah Harian", streak: "Beruntun", rank: "Peringkat",
      mQuiz: "Kuis Sepak Bola", mDet: "Detektif Transfer", mHL: "Lebih Tinggi / Rendah", mPres: "Presiden Klub",
      mPen: "Adu Penalti", mGrid: "Kotak Bola 3×3", mXI: "Starting XI Hilang", mDeal: "Meja Negosiasi",
      qClub: "Di klub mana {player} pernah bermain?",
      qNotClub: "Di klub mana {player} TIDAK PERNAH bermain?",
      qBothClubs: "Pemain mana yang pernah membela {c1} dan {c2}?",
      qMoreGoals: "Siapa yang mencetak LEBIH BANYAK gol sepanjang karier?",
      qHigherVal: "Siapa yang mencapai nilai pasar tertinggi (€M)?",
      qCountry: "Negara mana yang dibela oleh {player}?"
    },
    vi: {
      name: "🇻🇳 Tiếng Việt", rtl: false,
      home: "Trang chủ", packs: "Gói thẻ", pass: "Thẻ mùa", shop: "Cửa hàng", profile: "Hồ sơ",
      play: "Chơi", back: "Quay lại", next: "Tiếp →", guess: "Đoán", ok: "Chính xác!", err: "Sai rồi!",
      free: "MIỄN PHÍ", vip: "VIP", daily: "Thử Thách Ngày", gift: "Quà Hàng Ngày", streak: "Chuỗi", rank: "Hạng",
      mQuiz: "Đố Vui Bóng Đá", mDet: "Thám Tử Chuyển Nhượng", mHL: "Cao Hơn Hay Thấp Hơn", mPres: "Chủ Tịch CLB",
      mPen: "Đá Luân Lưu", mGrid: "Lưới Bóng Đá 3×3", mXI: "Đội Hình Huyền Thoại", mDeal: "Bàn Đàm Phán",
      qClub: "{player} đã từng thi đấu cho CLB nào sau đây?",
      qNotClub: "{player} CHƯA TỪNG thi đấu cho CLB nào sau đây?",
      qBothClubs: "Cầu thủ nào từng khoác áo cả {c1} và {c2}?",
      qMoreGoals: "Ai là người ghi NHIỀU bàn thắng hơn?",
      qHigherVal: "Cầu thủ nào đạt giá trị thị trường cao nhất (€M)?",
      qCountry: "{player} thi đấu cho đội tuyển quốc gia nào?"
    }
  };

  let currentLang = localStorage.getItem("gm_lang") || "";
  if (!LANGS[currentLang]) {
    const nav = (navigator.language || "sk").slice(0, 2).toLowerCase();
    currentLang = LANGS[nav] ? nav : (nav === "cs" ? "cz" : "en");
  }

  function setLang(code) {
    if (!LANGS[code]) return;
    currentLang = code;
    localStorage.setItem("gm_lang", code);
    document.documentElement.lang = code === "cz" ? "cs" : code;
    document.documentElement.dir = LANGS[code].rtl ? "rtl" : "ltr";
    applyDOM();
  }

  function getLang() {
    return currentLang;
  }

  // Preklad kľúča s podporou premenných napr. t("qClub", { player: "Messi" })
  function t(key, vars = {}) {
    let str = (LANGS[currentLang] && LANGS[currentLang][key]) || LANGS.en[key] || key;
    Object.keys(vars).forEach(k => {
      str = str.replaceAll(`{${k}}`, vars[k]);
    });
    return str;
  }

  // Automatické prepísanie všetkých prvkov s atribútom data-i18n="..."
  function applyDOM() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });
  }

  // Zoznam pre <select> prepínač jazykov
  function getOptionsHTML() {
    return Object.keys(LANGS)
      .map(code => `<option value="${code}" ${code === currentLang ? "selected" : ""}>${LANGS[code].name}</option>`)
      .join("");
  }

  // Inicializácia smeru textu pri načítaní
  document.documentElement.dir = LANGS[currentLang].rtl ? "rtl" : "ltr";

  return { LANGS, setLang, getLang, t, applyDOM, getOptionsHTML };
})();
