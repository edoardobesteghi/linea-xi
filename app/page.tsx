"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Locale = "it" | "en" | "es";
type DevelopmentPath = "wonderkid" | "steady" | "late_bloomer" | "volatile" | "prodigy";
type Phase =
  | "intro"
  | "creator"
  | "scouting"
  | "market"
  | "sponsor"
  | "career"
  | "event"
  | "summary";
type Position =
  | "GK"
  | "RB"
  | "CB"
  | "LB"
  | "DM"
  | "CM"
  | "AM"
  | "RW"
  | "LW"
  | "SS"
  | "CF"
  | "ST";

type Copy = { it: string; en: string; es: string };
const L = (it: string, en: string, es: string): Copy => ({ it, en, es });

const UI = {
  skip: L("Vai al gioco", "Skip to game", "Ir al juego"),
  brandLine: L("SIMULATORE DI CARRIERA", "CAREER SIMULATOR", "SIMULADOR DE CARRERA"),
  noSave: L("Nessun account. Nessun salvataggio.", "No account. No save.", "Sin cuenta. Sin guardado."),
  introEyebrow: L("48 semestri. Una sola carriera.", "48 half-seasons. One career.", "48 semestres. Una carrera."),
  introTitleA: L("Ogni sei mesi,", "Every six months,", "Cada seis meses,"),
  introTitleB: L("una scelta.", "one decision.", "una decisión."),
  introBody: L(
    "Parti a 16 anni, valuta offerte, tratta lo stipendio e decidi quanto sei disposto a rischiare. La carriera finisce a 40: il resto dipende da te.",
    "Start at 16, compare offers, negotiate your salary and decide how much you are willing to risk. The career ends at 40; the rest is up to you.",
    "Empieza con 16 años, compara ofertas, negocia tu salario y decide cuánto estás dispuesto a arriesgar. La carrera termina a los 40; lo demás depende de ti."
  ),
  start: L("Inizia la carriera", "Start your career", "Empezar la carrera"),
  howItWorks: L("Come funziona", "How it works", "Cómo funciona"),
  pillar1: L("Vivi ogni semestre", "Live every half-season", "Vive cada semestre"),
  pillar1b: L("Una crescita diversa a ogni carriera: precoce, costante o tardiva.", "A different growth arc in every career: early, steady or late.", "Una progresión diferente en cada carrera: precoz, constante o tardía."),
  pillar2: L("Scegli il compromesso", "Choose the trade-off", "Elige el equilibrio"),
  pillar2b: L("36 club reali: più stipendio o più minuti?", "36 real clubs: more money or more minutes?", "36 clubes reales: ¿más salario o más minutos?"),
  pillar3: L("Affronta le conseguenze", "Face the consequences", "Afronta las consecuencias"),
  pillar3b: L("Gli eventi mostrano percentuali esatte e lasciano un segno.", "Events show exact odds and leave a mark.", "Los eventos muestran probabilidades exactas y dejan huella."),
  creatorEyebrow: L("DOSSIER GIOCATORE", "PLAYER DOSSIER", "DOSIER DEL JUGADOR"),
  creatorTitle: L("Chi vuoi diventare?", "Who do you want to become?", "¿Quién quieres llegar a ser?"),
  creatorBody: L(
    "Puoi cambiare posizione finché non confermi. Il ruolo scelto modifica minutaggio, crescita e statistiche.",
    "You can change position until you confirm. Your role affects minutes, growth and statistics.",
    "Puedes cambiar de posición hasta confirmar. Tu rol modifica los minutos, el crecimiento y las estadísticas."
  ),
  hiddenTrajectory: L("TRAIETTORIA NASCOSTA", "HIDDEN TRAJECTORY", "TRAYECTORIA OCULTA"),
  trajectoryOdds: L(
    "Il profilo viene sorteggiato all’inizio e si rivela solo quando la carriera lascia abbastanza indizi.",
    "Your profile is drawn at the start and is revealed only when your career leaves enough clues.",
    "El perfil se sortea al inicio y solo se revela cuando tu carrera deja suficientes pistas."
  ),
  playerName: L("Nome del giocatore", "Player name", "Nombre del jugador"),
  namePlaceholder: L("Es. Andrea Rossi", "E.g. Alex Stone", "Ej. Andrea Rossi"),
  nationality: L("Nazionalità", "Nationality", "Nacionalidad"),
  position: L("Posizione", "Position", "Posición"),
  foot: L("Piede preferito", "Preferred foot", "Pie preferido"),
  left: L("Sinistro", "Left", "Izquierdo"),
  right: L("Destro", "Right", "Derecho"),
  generate: L("Genera le offerte", "Generate offers", "Generar ofertas"),
  scouts: L("Gli osservatori stanno preparando il dossier…", "Scouts are preparing your file…", "Los ojeadores están preparando tu dosier…"),
  scoutingNetwork: L("RETE OSSERVATORI", "SCOUTING NETWORK", "RED DE OJEADORES"),
  marketEyebrow: L("FINESTRA DI MERCATO", "TRANSFER WINDOW", "MERCADO DE FICHAJES"),
  marketTitle: L("Scegli dove giocare", "Choose where to play", "Elige dónde jugar"),
  marketBody: L(
    "Confronta i termini oppure rilancia. Il minutaggio è una previsione: forma, infortuni e squalifiche possono cambiarlo.",
    "Compare terms or make a counteroffer. Minutes are an estimate: form, injuries and suspensions can change them.",
    "Compara las condiciones o presenta una contraoferta. Los minutos son una estimación: la forma, las lesiones y las sanciones pueden cambiarlos."
  ),
  currentClub: L("RINNOVO", "RENEWAL", "RENOVACIÓN"),
  newClub: L("NUOVO CLUB", "NEW CLUB", "NUEVO CLUB"),
  salary: L("Stipendio annuo", "Annual salary", "Salario anual"),
  minutes: L("Minuti attesi", "Expected minutes", "Minutos previstos"),
  contract: L("Contratto", "Contract", "Contrato"),
  years: L("anni", "years", "años"),
  squadRole: L("Status previsto", "Expected status", "Estatus previsto"),
  accept: L("Accetta", "Accept", "Aceptar"),
  counter: L("Rilancia", "Counter", "Contraofertar"),
  counterTitle: L("Quanto vuoi chiedere?", "How much will you ask for?", "¿Cuánto quieres pedir?"),
  acceptance: L("Probabilità di accettazione", "Acceptance chance", "Probabilidad de aceptación"),
  sendCounter: L("Invia il rilancio", "Send counteroffer", "Enviar contraoferta"),
  counterRejected: L("Rilancio rifiutato. L’offerta base resta valida.", "Counteroffer rejected. The original offer still stands.", "Contraoferta rechazada. La oferta original sigue vigente."),
  sponsorEyebrow: L("PARTNERSHIP", "PARTNERSHIP", "PATROCINIO"),
  sponsorTitle: L("Scegli il tuo sponsor", "Choose your sponsor", "Elige tu patrocinador"),
  sponsorBody: L(
    "Il compenso è semestrale. Le clausole etiche possono sciogliere il contratto dopo uno scandalo.",
    "Payment is made every half-season. Morality clauses may terminate the deal after a scandal.",
    "El pago es semestral. Las cláusulas éticas pueden resolver el contrato tras un escándalo."
  ),
  signing: L("Bonus firma", "Signing bonus", "Prima de firma"),
  semesterPay: L("Per semestre", "Per half-season", "Por semestre"),
  duration: L("Durata", "Term", "Duración"),
  semesters: L("semestri", "half-seasons", "semestres"),
  chooseSponsor: L("Firma", "Sign", "Firmar"),
  noSponsor: L("Resta senza sponsor", "Stay without a sponsor", "Seguir sin patrocinador"),
  careerEyebrow: L("CENTRO CARRIERA", "CAREER CENTRE", "CENTRO DE CARRERA"),
  nextSemester: L("Prossimo semestre", "Next half-season", "Próximo semestre"),
  playSemester: L("+1 semestre", "+1 half-season", "+1 semestre"),
  sprint: L("Avanza alla prossima scelta", "Advance to next decision", "Avanzar a la próxima decisión"),
  sprinting: L("Carriera in avanzamento…", "Career advancing…", "Carrera avanzando…"),
  quickHint: L("Sprint simula fino a 4 semestri e si ferma sempre prima di una decisione.", "Sprint simulates up to 4 half-seasons and always stops before a decision.", "Sprint simula hasta 4 semestres y siempre se detiene antes de una decisión."),
  bestSalary: L("Stipendio più alto", "Highest salary", "Salario más alto"),
  bestMinutes: L("Più minutaggio", "Most playing time", "Más minutos"),
  newDestination: L("Nuova destinazione", "New destination", "Nuevo destino"),
  offerCount: L("4 offerte · scorri per confrontare", "4 offers · swipe to compare", "4 ofertas · desliza para comparar"),
  richestSponsor: L("Compenso più alto", "Highest pay", "Mayor compensación"),
  longestSponsor: L("Accordo più lungo", "Longest deal", "Acuerdo más largo"),
  age: L("Età", "Age", "Edad"),
  overall: L("OVR", "OVR", "OVR"),
  form: L("Forma", "Form", "Forma"),
  morale: L("Morale", "Morale", "Moral"),
  health: L("Salute", "Health", "Salud"),
  reputation: L("Reputazione", "Reputation", "Reputación"),
  integrity: L("Integrità", "Integrity", "Integridad"),
  balance: L("Patrimonio", "Balance", "Patrimonio"),
  sponsor: L("Sponsor", "Sponsor", "Patrocinador"),
  seasonReport: L("Ultimo rapporto", "Latest report", "Último informe"),
  noReport: L("Il primo rapporto arriverà dopo il semestre.", "Your first report will arrive after the half-season.", "El primer informe llegará después del semestre."),
  apps: L("Presenze", "Apps", "Partidos"),
  goals: L("Gol", "Goals", "Goles"),
  assists: L("Assist", "Assists", "Asistencias"),
  rating: L("Voto", "Rating", "Nota"),
  trophies: L("Trofei", "Trophies", "Trofeos"),
  timeline: L("Cronologia recente", "Recent timeline", "Cronología reciente"),
  trajectory: L("Traiettoria", "Trajectory", "Trayectoria"),
  trajectoryUnknown: L("Profilo in evoluzione", "Profile still developing", "Perfil en evolución"),
  recentGrowth: L("Crescita · ultimi 3 semestri", "Growth · last 3 half-seasons", "Crecimiento · últimos 3 semestres"),
  momentumHigh: L("Momentum alto", "High momentum", "Momento alto"),
  momentumStable: L("Momentum stabile", "Stable momentum", "Momento estable"),
  momentumLow: L("Momentum basso", "Low momentum", "Momento bajo"),
  growthSpike: L("Scatto di crescita", "Growth spike", "Salto de crecimiento"),
  growthDip: L("Fase di involuzione", "Development dip", "Fase de retroceso"),
  arcDiscovered: L("Profilo rivelato", "Profile revealed", "Perfil revelado"),
  breakthroughs: L("Svolte di crescita", "Growth breakthroughs", "Saltos de crecimiento"),
  phenomenon: L("FENOMENO", "PHENOMENON", "FENÓMENO"),
  phenomenonBody: L(
    "Hai raggiunto lo status che cambia una carriera. Ora devi mantenerlo.",
    "You have reached career-changing status. Now you have to sustain it.",
    "Has alcanzado un estatus que cambia una carrera. Ahora debes mantenerlo."
  ),
  eventEyebrow: L("DECISIONE DI CARRIERA", "CAREER DECISION", "DECISIÓN DE CARRERA"),
  eventTitle: L("La scelta è tua", "The choice is yours", "La decisión es tuya"),
  possibleOutcomes: L("Possibili esiti", "Possible outcomes", "Posibles resultados"),
  outcome: L("Esito", "Outcome", "Resultado"),
  continue: L("Continua", "Continue", "Continuar"),
  banned: L("Squalifica attiva", "Active suspension", "Sanción activa"),
  injured: L("Indisponibile per infortunio", "Unavailable through injury", "Baja por lesión"),
  summaryEyebrow: L("FINE CARRIERA · 40 ANNI", "CAREER END · AGE 40", "FIN DE CARRERA · 40 AÑOS"),
  summaryTitle: L("Il verdetto della tua carriera", "Your career verdict", "El veredicto de tu carrera"),
  totalMinutes: L("Minuti totali", "Total minutes", "Minutos totales"),
  earnings: L("Guadagni", "Earnings", "Ganancias"),
  clubs: L("Club", "Clubs", "Clubes"),
  peak: L("Picco OVR", "Peak OVR", "OVR máximo"),
  decisiveChoices: L("Scelte decisive", "Decisive choices", "Decisiones decisivas"),
  copySummary: L("Copia il riepilogo", "Copy summary", "Copiar resumen"),
  copied: L("Riepilogo copiato.", "Summary copied.", "Resumen copiado."),
  newCareer: L("Nuova carriera", "New career", "Nueva carrera"),
  fictional: L(
    "Simulazione non ufficiale. Marchi e stemmi appartengono ai rispettivi titolari. Nessuna affiliazione o sponsorizzazione reale.",
    "Unofficial simulation. Trademarks and crests belong to their respective owners. No real affiliation or sponsorship.",
    "Simulación no oficial. Las marcas y los escudos pertenecen a sus respectivos titulares. Sin afiliación ni patrocinio real."
  ),
  safePlay: L("Le condotte illegali sono rappresentate senza dettagli operativi e con conseguenze sportive e personali.", "Illegal conduct is depicted without operational detail and with sporting and personal consequences.", "Las conductas ilegales se muestran sin detalles operativos y con consecuencias deportivas y personales."),
};

const DEVELOPMENT_PROFILES: Record<DevelopmentPath, { chance: number; label: Copy; description: Copy }> = {
  wonderkid: {
    chance: 18,
    label: L("Wonderkid", "Wonderkid", "Wonderkid"),
    description: L("Esplosione precoce, picco giovane e pressione altissima.", "Early explosion, a young peak and huge pressure.", "Explosión precoz, pico joven y máxima presión."),
  },
  steady: {
    chance: 50,
    label: L("Crescita costante", "Steady growth", "Crecimiento constante"),
    description: L("Progressi regolari guidati da rendimento e minutaggio.", "Regular progress driven by performances and playing time.", "Progreso regular impulsado por rendimiento y minutos."),
  },
  late_bloomer: {
    chance: 20,
    label: L("Maturazione tardiva", "Late bloomer", "Maduración tardía"),
    description: L("Partenza lenta, poi una forte accelerazione tra 24 e 31 anni.", "A slow start followed by a major surge between 24 and 31.", "Inicio lento y una gran aceleración entre los 24 y 31 años."),
  },
  volatile: {
    chance: 9,
    label: L("Talento imprevedibile", "Volatile talent", "Talento impredecible"),
    description: L("Picchi e frenate: forma, scelte e contesto pesano di più.", "Peaks and stalls: form, choices and context matter more.", "Picos y frenazos: la forma, las decisiones y el contexto pesan más."),
  },
  prodigy: {
    chance: 3,
    label: L("Prodigio", "Prodigy", "Prodigio"),
    description: L("Una rarissima curva generazionale, da trasformare in realtà.", "An extremely rare generational curve that still has to be fulfilled.", "Una curva generacional muy rara que todavía debe hacerse realidad."),
  },
};

const DEVELOPMENT_ORDER: DevelopmentPath[] = ["steady", "wonderkid", "late_bloomer", "volatile", "prodigy"];

const POSITION_LABELS: Record<Position, Copy> = {
  GK: L("Portiere", "Goalkeeper", "Portero"),
  RB: L("Terzino destro", "Right back", "Lateral derecho"),
  CB: L("Difensore centrale", "Centre back", "Defensa central"),
  LB: L("Terzino sinistro", "Left back", "Lateral izquierdo"),
  DM: L("Mediano", "Defensive midfielder", "Mediocentro defensivo"),
  CM: L("Centrocampista", "Central midfielder", "Centrocampista"),
  AM: L("Trequartista", "Attacking midfielder", "Mediapunta"),
  RW: L("Ala destra", "Right winger", "Extremo derecho"),
  LW: L("Ala sinistra", "Left winger", "Extremo izquierdo"),
  SS: L("Seconda punta", "Second striker", "Segundo delantero"),
  CF: L("Centravanti mobile", "Centre forward", "Delantero centro"),
  ST: L("Punta", "Striker", "Delantero"),
};

const POSITIONS = Object.keys(POSITION_LABELS) as Position[];
const POSITION_MINUTES_FACTOR: Record<Position, number> = {
  GK: 0.82, RB: 1.05, CB: 1.08, LB: 1.05, DM: 1.06, CM: 1, AM: 0.96, RW: 0.94, LW: 0.94, SS: 0.92, CF: 0.93, ST: 0.91,
};
const POSITION_GROWTH_BONUS: Record<Position, number> = {
  GK: 0.04, RB: 0.07, CB: 0.05, LB: 0.07, DM: 0.06, CM: 0.08, AM: 0.09, RW: 0.1, LW: 0.1, SS: 0.08, CF: 0.07, ST: 0.06,
};
const NATIONALITIES = [
  { id: "it", label: L("Italia", "Italy", "Italia") },
  { id: "ar", label: L("Argentina", "Argentina", "Argentina") },
  { id: "es", label: L("Spagna", "Spain", "España") },
  { id: "gb", label: L("Inghilterra", "England", "Inglaterra") },
  { id: "br", label: L("Brasile", "Brazil", "Brasil") },
  { id: "fr", label: L("Francia", "France", "Francia") },
  { id: "pt", label: L("Portogallo", "Portugal", "Portugal") },
  { id: "de", label: L("Germania", "Germany", "Alemania") },
];

const EVENT_CATEGORY_LABELS: Record<CareerEvent["category"], Copy> = {
  sport: L("SPORT", "SPORT", "DEPORTE"),
  life: L("VITA", "LIFE", "VIDA"),
  integrity: L("INTEGRITÀ", "INTEGRITY", "INTEGRIDAD"),
};

type Club = {
  id: string;
  code: string;
  name: string;
  country: string;
  league: string;
  prestige: number;
  squad: number;
  salaryBase: number;
  minutesBase: number;
  style: Copy;
  colors: [string, string, string];
  logo: string;
};

const CLUBS: Club[] = [
  { id: "rom", code: "ROM", name: "AS Roma", country: "IT", league: "Serie A", prestige: 4, squad: 78, salaryBase: 1_200_000, minutesBase: 840, style: L("Equilibrato", "Balanced", "Equilibrado"), colors: ["#8e1f2f", "#f1b72d", "#ffffff"], logo: "/clubs/rom.png" },
  { id: "int", code: "INT", name: "FC Internazionale Milano", country: "IT", league: "Serie A", prestige: 5, squad: 84, salaryBase: 2_700_000, minutesBase: 580, style: L("Contropiede", "Counter", "Contraataque"), colors: ["#0050a4", "#111111", "#ffffff"], logo: "/clubs/int.png" },
  { id: "mil", code: "MIL", name: "AC Milan", country: "IT", league: "Serie A", prestige: 5, squad: 83, salaryBase: 2_500_000, minutesBase: 560, style: L("Pressing alto", "High press", "Presión alta"), colors: ["#e51b23", "#111111", "#ffffff"], logo: "/clubs/mil.png" },
  { id: "ars", code: "ARS", name: "Arsenal FC", country: "GB", league: "Premier League", prestige: 4, squad: 79, salaryBase: 1_450_000, minutesBase: 800, style: L("Giovani e attacco", "Youth attack", "Juventud y ataque"), colors: ["#ef0107", "#ffffff", "#063672"], logo: "/clubs/ars.png" },
  { id: "man", code: "MAN", name: "Manchester United", country: "GB", league: "Premier League", prestige: 5, squad: 85, salaryBase: 3_100_000, minutesBase: 520, style: L("Gioco diretto", "Direct play", "Juego directo"), colors: ["#da291c", "#fbe122", "#111111"], logo: "/clubs/man.png" },
  { id: "mcu", code: "MCU", name: "Manchester City", country: "GB", league: "Premier League", prestige: 5, squad: 86, salaryBase: 3_500_000, minutesBase: 470, style: L("Possesso", "Possession", "Posesión"), colors: ["#6cabdd", "#ffffff", "#1c2c5b"], logo: "/clubs/mcu.png" },
  { id: "bar", code: "BAR", name: "FC Barcelona", country: "ES", league: "LaLiga", prestige: 5, squad: 85, salaryBase: 3_000_000, minutesBase: 540, style: L("Possesso", "Possession", "Posesión"), colors: ["#004d98", "#a50044", "#edbb00"], logo: "/clubs/bar.png" },
  { id: "mad", code: "MAD", name: "Real Madrid", country: "ES", league: "LaLiga", prestige: 5, squad: 86, salaryBase: 3_400_000, minutesBase: 470, style: L("Verticale", "Vertical", "Vertical"), colors: ["#ffffff", "#00529f", "#febe10"], logo: "/clubs/mad.png" },
  { id: "par", code: "PAR", name: "Paris Saint-Germain", country: "FR", league: "Ligue 1", prestige: 5, squad: 83, salaryBase: 3_800_000, minutesBase: 650, style: L("Ampiezza", "Wide play", "Juego por bandas"), colors: ["#004170", "#da291c", "#ffffff"], logo: "/clubs/par.png" },
  { id: "bay", code: "BAY", name: "FC Bayern München", country: "DE", league: "Bundesliga", prestige: 5, squad: 84, salaryBase: 3_000_000, minutesBase: 620, style: L("Pressing alto", "High press", "Presión alta"), colors: ["#dc052d", "#0066b2", "#ffffff"], logo: "/clubs/bay.png" },
  { id: "dor", code: "DOR", name: "Borussia Dortmund", country: "DE", league: "Bundesliga", prestige: 4, squad: 76, salaryBase: 950_000, minutesBase: 980, style: L("Transizioni", "Transitions", "Transiciones"), colors: ["#fde100", "#111111", "#ffffff"], logo: "/clubs/dor.png" },
  { id: "lis", code: "LIS", name: "SL Benfica", country: "PT", league: "Liga Portugal", prestige: 3, squad: 69, salaryBase: 310_000, minutesBase: 1_160, style: L("Talenti giovani", "Young talent", "Talento joven"), colors: ["#e30613", "#ffffff", "#f6c343"], logo: "/clubs/lis.png" },
  { id: "ams", code: "AMS", name: "AFC Ajax", country: "NL", league: "Eredivisie", prestige: 3, squad: 68, salaryBase: 290_000, minutesBase: 1_220, style: L("Tecnico", "Technical", "Técnico"), colors: ["#d2122e", "#ffffff", "#111111"], logo: "/clubs/ams.png" },
  { id: "rot", code: "ROT", name: "Feyenoord", country: "NL", league: "Eredivisie", prestige: 3, squad: 66, salaryBase: 210_000, minutesBase: 1_300, style: L("Fisico", "Physical", "Físico"), colors: ["#e51937", "#ffffff", "#111111"], logo: "/clubs/rot.png" },
  { id: "nap", code: "NAP", name: "SSC Napoli", country: "IT", league: "Serie A", prestige: 4, squad: 75, salaryBase: 790_000, minutesBase: 930, style: L("Ripartenze", "Fast breaks", "Transiciones rápidas"), colors: ["#12a0d7", "#ffffff", "#003b73"], logo: "/clubs/nap.png" },
  { id: "sev", code: "SEV", name: "Sevilla FC", country: "ES", league: "LaLiga", prestige: 4, squad: 74, salaryBase: 720_000, minutesBase: 980, style: L("Fasce", "Wide play", "Bandas"), colors: ["#d71920", "#ffffff", "#111111"], logo: "/clubs/sev.png" },
  { id: "bue", code: "BUE", name: "Boca Juniors", country: "AR", league: "Liga Profesional", prestige: 2, squad: 59, salaryBase: 82_000, minutesBase: 1_360, style: L("Intensità", "Intensity", "Intensidad"), colors: ["#003b7a", "#f7d117", "#ffffff"], logo: "/clubs/bue.svg" },
  { id: "ros", code: "ROS", name: "Rosario Central", country: "AR", league: "Liga Profesional", prestige: 2, squad: 57, salaryBase: 68_000, minutesBase: 1_430, style: L("Giovani", "Youth", "Juventud"), colors: ["#005baa", "#ffdf00", "#ffffff"], logo: "/clubs/ros.svg" },
  { id: "liv", code: "LIV", name: "Liverpool FC", country: "GB", league: "Premier League", prestige: 5, squad: 84, salaryBase: 3_200_000, minutesBase: 520, style: L("Pressing verticale", "Vertical press", "Presión vertical"), colors: ["#c8102e", "#00b2a9", "#ffffff"], logo: "/clubs/liv.png" },
  { id: "che", code: "CHE", name: "Chelsea FC", country: "GB", league: "Premier League", prestige: 4, squad: 80, salaryBase: 2_200_000, minutesBase: 650, style: L("Possesso aggressivo", "Aggressive possession", "Posesión agresiva"), colors: ["#034694", "#ffffff", "#dba111"], logo: "/clubs/che.png" },
  { id: "tot", code: "TOT", name: "Tottenham Hotspur", country: "GB", league: "Premier League", prestige: 4, squad: 80, salaryBase: 1_900_000, minutesBase: 680, style: L("Attacco rapido", "Fast attack", "Ataque rápido"), colors: ["#132257", "#ffffff", "#9bc9eb"], logo: "/clubs/tot.png" },
  { id: "new", code: "NEW", name: "Newcastle United", country: "GB", league: "Premier League", prestige: 4, squad: 79, salaryBase: 1_800_000, minutesBase: 720, style: L("Intensità", "Intensity", "Intensidad"), colors: ["#241f20", "#ffffff", "#41b6e6"], logo: "/clubs/new.png" },
  { id: "juv", code: "JUV", name: "Juventus FC", country: "IT", league: "Serie A", prestige: 5, squad: 82, salaryBase: 2_300_000, minutesBase: 620, style: L("Controllo", "Control", "Control"), colors: ["#111111", "#ffffff", "#d4af37"], logo: "/clubs/juv.png" },
  { id: "laz", code: "LAZ", name: "S.S. Lazio", country: "IT", league: "Serie A", prestige: 4, squad: 75, salaryBase: 850_000, minutesBase: 900, style: L("Verticale", "Vertical", "Vertical"), colors: ["#87d8f7", "#ffffff", "#17365d"], logo: "/clubs/laz.png" },
  { id: "ata", code: "ATA", name: "Atalanta BC", country: "IT", league: "Serie A", prestige: 4, squad: 77, salaryBase: 1_000_000, minutesBase: 850, style: L("Uomo su uomo", "Man-to-man press", "Presión individual"), colors: ["#1e71b8", "#111111", "#ffffff"], logo: "/clubs/ata.png" },
  { id: "atm", code: "ATM", name: "Atlético de Madrid", country: "ES", league: "LaLiga", prestige: 5, squad: 84, salaryBase: 2_800_000, minutesBase: 580, style: L("Blocco compatto", "Compact block", "Bloque compacto"), colors: ["#cb3524", "#272e61", "#ffffff"], logo: "/clubs/atm.png" },
  { id: "val", code: "VAL", name: "Valencia CF", country: "ES", league: "LaLiga", prestige: 3, squad: 69, salaryBase: 450_000, minutesBase: 1_100, style: L("Ripartenze", "Fast breaks", "Transiciones rápidas"), colors: ["#f7a600", "#111111", "#ffffff"], logo: "/clubs/val.png" },
  { id: "lev", code: "LEV", name: "Bayer 04 Leverkusen", country: "DE", league: "Bundesliga", prestige: 4, squad: 81, salaryBase: 1_700_000, minutesBase: 680, style: L("Fluidità", "Fluid football", "Juego fluido"), colors: ["#e32221", "#111111", "#ffffff"], logo: "/clubs/lev.png" },
  { id: "rbl", code: "RBL", name: "RB Leipzig", country: "DE", league: "Bundesliga", prestige: 4, squad: 78, salaryBase: 1_300_000, minutesBase: 780, style: L("Pressing", "Pressing", "Presión"), colors: ["#dd0741", "#001f47", "#ffffff"], logo: "/clubs/rbl.png" },
  { id: "mar", code: "MAR", name: "Olympique de Marseille", country: "FR", league: "Ligue 1", prestige: 4, squad: 75, salaryBase: 900_000, minutesBase: 900, style: L("Ampiezza", "Wide play", "Juego por bandas"), colors: ["#00a5e4", "#ffffff", "#d5b35d"], logo: "/clubs/mar.png" },
  { id: "mon", code: "MON", name: "AS Monaco", country: "FR", league: "Ligue 1", prestige: 3, squad: 70, salaryBase: 520_000, minutesBase: 1_050, style: L("Talenti giovani", "Young talent", "Talento joven"), colors: ["#e30613", "#ffffff", "#d9b25f"], logo: "/clubs/mon.png" },
  { id: "por", code: "POR", name: "FC Porto", country: "PT", league: "Liga Portugal", prestige: 3, squad: 72, salaryBase: 420_000, minutesBase: 1_150, style: L("Intensità europea", "European intensity", "Intensidad europea"), colors: ["#00428c", "#ffffff", "#d71920"], logo: "/clubs/por.png" },
  { id: "psv", code: "PSV", name: "PSV Eindhoven", country: "NL", league: "Eredivisie", prestige: 3, squad: 71, salaryBase: 380_000, minutesBase: 1_180, style: L("Attacco", "Attacking", "Ataque"), colors: ["#ed1b2f", "#ffffff", "#111111"], logo: "/clubs/psv.png" },
  { id: "cel", code: "CEL", name: "Celtic FC", country: "GB", league: "Scottish Premiership", prestige: 3, squad: 66, salaryBase: 280_000, minutesBase: 1_300, style: L("Dominio", "Dominant play", "Dominio"), colors: ["#018749", "#ffffff", "#d5b35d"], logo: "/clubs/cel.png" },
  { id: "riv", code: "RIV", name: "Club Atlético River Plate", country: "AR", league: "Liga Profesional", prestige: 3, squad: 65, salaryBase: 180_000, minutesBase: 1_250, style: L("Tecnica e pressione", "Technique and pressure", "Técnica y presión"), colors: ["#e2231a", "#ffffff", "#111111"], logo: "/clubs/riv.svg" },
  { id: "rai", code: "RAI", name: "Racing Club", country: "AR", league: "Liga Profesional", prestige: 2, squad: 60, salaryBase: 95_000, minutesBase: 1_380, style: L("Intensità", "Intensity", "Intensidad"), colors: ["#79c8eb", "#ffffff", "#183b68"], logo: "/clubs/rai.svg" },
];

type Sponsor = {
  id: string;
  name: string;
  sector: Copy;
  signing: number;
  pay: number;
  term: number;
  pitch: Copy;
  colors: [string, string];
  logo: string;
  minRep: number;
  performanceBonusPercent?: number;
  healthBoost?: number;
  reputationBoost?: number;
};

const SPONSORS: Sponsor[] = [
  { id: "nike", name: "NIKE", sector: L("Abbigliamento sportivo", "Sportswear", "Ropa deportiva"), signing: 18_000, pay: 22_000, term: 4, minRep: 0, performanceBonusPercent: 25, colors: ["#f4f4f4", "#111111"], logo: "/sponsors/nike.svg", pitch: L("Nel gioco: +25% sul compenso se superi i minuti attesi.", "In game: +25% payment if you beat expected minutes.", "En el juego: +25% de pago si superas los minutos previstos.") },
  { id: "adidas", name: "ADIDAS", sector: L("Abbigliamento sportivo", "Sportswear", "Ropa deportiva"), signing: 12_000, pay: 17_000, term: 6, minRep: 0, healthBoost: 4, colors: ["#f4f4f4", "#111111"], logo: "/sponsors/adidas.svg", pitch: L("Nel gioco: +4 salute dopo ogni semestre.", "In game: +4 health after every half-season.", "En el juego: +4 de salud después de cada semestre.") },
  { id: "puma", name: "PUMA", sector: L("Abbigliamento sportivo", "Sportswear", "Ropa deportiva"), signing: 25_000, pay: 30_000, term: 4, minRep: 10, colors: ["#f4f4f4", "#111111"], logo: "/sponsors/puma.svg", pitch: L("Nel gioco: paga bene e richiede visibilità.", "In game: pays well and demands visibility.", "En el juego: paga bien y exige visibilidad.") },
  { id: "newbalance", name: "NEW BALANCE", sector: L("Abbigliamento sportivo", "Sportswear", "Ropa deportiva"), signing: 20_000, pay: 27_000, term: 4, minRep: 28, reputationBoost: 2, colors: ["#e21836", "#ffffff"], logo: "/sponsors/newbalance.svg", pitch: L("Nel gioco: +2 reputazione dopo ogni semestre.", "In game: +2 reputation after every half-season.", "En el juego: +2 de reputación después de cada semestre.") },
  { id: "underarmour", name: "UNDER ARMOUR", sector: L("Abbigliamento sportivo", "Sportswear", "Ropa deportiva"), signing: 85_000, pay: 95_000, term: 4, minRep: 58, colors: ["#f4f4f4", "#111111"], logo: "/sponsors/underarmour.svg", pitch: L("Nel gioco: l’accordo delle stelle affermate.", "In game: a deal for established stars.", "En el juego: el acuerdo de las grandes estrellas.") },
  { id: "redbull", name: "RED BULL", sector: L("Energy drink", "Energy drink", "Bebida energética"), signing: 100_000, pay: 110_000, term: 6, minRep: 72, colors: ["#f4f4f4", "#13265c"], logo: "/sponsors/redbull.svg", pitch: L("Nel gioco: ricco, lungo, con clausole etiche severe.", "In game: rich, long and ethically strict.", "En el juego: rico, largo y con cláusulas éticas estrictas.") },
];

type Effect = {
  ovr?: number;
  form?: number;
  morale?: number;
  health?: number;
  reputation?: number;
  integrity?: number;
  cash?: number;
  ban?: number;
  injury?: number;
  loseSponsor?: boolean;
  secondaryRole?: boolean;
};
type Outcome = { p: number; text: Copy; effect?: Effect; tone?: "good" | "bad" | "neutral" };
type EventChoice = { id: string; label: Copy; outcomes: Outcome[] };
type CareerEvent = { id: string; title: Copy; body: Copy; choices: EventChoice[]; once?: boolean; category: "sport" | "life" | "integrity" };

const EVENTS: CareerEvent[] = [
  {
    id: "mentor", category: "sport", title: L("Il veterano", "The veteran", "El veterano"), body: L("Un compagno esperto ti propone sessioni extra dopo l’allenamento.", "An experienced teammate offers extra sessions after training.", "Un compañero veterano te ofrece sesiones extra tras el entrenamiento."),
    choices: [
      { id: "accept", label: L("Accetta", "Accept", "Aceptar"), outcomes: [
        { p: 75, text: L("Fai un salto di qualità.", "You make a clear leap.", "Das un salto de calidad."), effect: { ovr: 1, form: 8, morale: 4 }, tone: "good" },
        { p: 25, text: L("Impari, ma accumuli stanchezza.", "You learn, but fatigue builds.", "Aprendes, pero acumulas cansancio."), effect: { form: 3, health: -7 }, tone: "neutral" },
      ] },
      { id: "rest", label: L("Proteggi il recupero", "Protect recovery", "Proteger la recuperación"), outcomes: [
        { p: 100, text: L("Resti fresco e concentrato.", "You stay fresh and focused.", "Te mantienes fresco y concentrado."), effect: { health: 5, morale: 2 }, tone: "good" },
      ] },
    ],
  },
  {
    id: "training", category: "sport", title: L("Programma intensivo", "Intensive programme", "Programa intensivo"), body: L("Lo staff offre un ciclo molto pesante per accelerare la crescita.", "The staff offers a demanding programme to accelerate growth.", "El cuerpo técnico ofrece un programa muy exigente para acelerar el crecimiento."),
    choices: [
      { id: "join", label: L("Partecipa", "Join", "Participar"), outcomes: [
        { p: 60, text: L("Il lavoro produce una svolta.", "The work creates a breakthrough.", "El trabajo produce un gran avance."), effect: { ovr: 1.5, form: 6, health: -4 }, tone: "good" },
        { p: 28, text: L("Vai in sovraccarico.", "You suffer from overload.", "Sufres una sobrecarga."), effect: { form: -4, health: -10 }, tone: "bad" },
        { p: 12, text: L("Subisci un infortunio serio.", "You suffer a serious injury.", "Sufres una lesión seria."), effect: { health: -24, morale: -7, injury: 1 }, tone: "bad" },
      ] },
      { id: "normal", label: L("Segui il piano normale", "Follow the normal plan", "Seguir el plan normal"), outcomes: [
        { p: 100, text: L("Cresci senza forzare.", "You improve without forcing it.", "Mejoras sin forzar."), effect: { form: 3, health: 4 }, tone: "good" },
      ] },
    ],
  },
  {
    id: "pain", category: "sport", title: L("Dolore prima della partita", "Pain before the match", "Dolor antes del partido"), body: L("Avverti un dolore muscolare prima di una gara importante.", "You feel muscular pain before a major match.", "Sientes dolor muscular antes de un partido importante."),
    choices: [
      { id: "report", label: L("Avvisa lo staff medico", "Tell the medical staff", "Avisar al equipo médico"), outcomes: [
        { p: 85, text: L("Recuperi senza conseguenze.", "You recover without consequences.", "Te recuperas sin consecuencias."), effect: { health: 8 }, tone: "good" },
        { p: 15, text: L("Perdi temporaneamente il posto.", "You temporarily lose your place.", "Pierdes temporalmente tu puesto."), effect: { morale: -4, form: -3 }, tone: "neutral" },
      ] },
      { id: "play", label: L("Gioca comunque", "Play anyway", "Jugar igualmente"), outcomes: [
        { p: 50, text: L("Il dolore non peggiora.", "The pain does not worsen.", "El dolor no empeora."), effect: { form: 5, health: -3 }, tone: "good" },
        { p: 35, text: L("Il problema si aggrava.", "The problem worsens.", "El problema empeora."), effect: { health: -16, injury: 1 }, tone: "bad" },
        { p: 15, text: L("Subisci una lesione importante.", "You suffer a major injury.", "Sufres una lesión importante."), effect: { health: -28, morale: -8, injury: 2 }, tone: "bad" },
      ] },
    ],
  },
  {
    id: "family", category: "life", title: L("Emergenza familiare", "Family emergency", "Emergencia familiar"), body: L("Una persona vicina ha bisogno di te durante una settimana decisiva.", "Someone close to you needs help during a decisive week.", "Una persona cercana te necesita durante una semana decisiva."),
    choices: [
      { id: "travel", label: L("Raggiungi la famiglia", "Join your family", "Viajar con tu familia"), outcomes: [
        { p: 100, text: L("Perdi una gara, ma ritrovi serenità.", "You miss a game but regain peace of mind.", "Te pierdes un partido, pero recuperas la calma."), effect: { morale: 14, form: -2 }, tone: "good" },
      ] },
      { id: "stay", label: L("Resta con la squadra", "Stay with the team", "Quedarte con el equipo"), outcomes: [
        { p: 100, text: L("Dimostri disponibilità, ma ne paghi il peso emotivo.", "You show commitment but pay an emotional cost.", "Demuestras compromiso, pero pagas un coste emocional."), effect: { reputation: 3, morale: -12 }, tone: "neutral" },
      ] },
    ],
  },
  {
    id: "position", once: true, category: "sport", title: L("Nuovo ruolo", "A new position", "Una nueva posición"), body: L("L’allenatore pensa che tu possa rendere anche in una posizione diversa.", "The coach believes you can perform in another position too.", "El entrenador cree que también puedes rendir en otra posición."),
    choices: [
      { id: "try", label: L("Prova la riconversione", "Try the conversion", "Probar la reconversión"), outcomes: [
        { p: 70, text: L("Il nuovo ruolo amplia il tuo valore.", "The new role increases your value.", "La nueva posición aumenta tu valor."), effect: { ovr: 1, reputation: 4, secondaryRole: true }, tone: "good" },
        { p: 30, text: L("L’adattamento è difficile, ma impari il ruolo.", "Adapting is hard, but you learn the role.", "La adaptación es difícil, pero aprendes el rol."), effect: { form: -6, secondaryRole: true }, tone: "neutral" },
      ] },
      { id: "decline", label: L("Resta nel tuo ruolo", "Keep your position", "Mantener tu posición"), outcomes: [
        { p: 100, text: L("Conservi sicurezza e continuità.", "You keep confidence and continuity.", "Mantienes la confianza y la continuidad."), effect: { morale: 4 }, tone: "good" },
      ] },
    ],
  },
  {
    id: "community", category: "life", title: L("Progetto per il quartiere", "Community project", "Proyecto comunitario"), body: L("Una scuola locale invita la squadra a incontrare giovani calciatori.", "A local school invites the squad to meet young players.", "Una escuela local invita al equipo a conocer jóvenes futbolistas."),
    choices: [
      { id: "attend", label: L("Partecipa", "Attend", "Participar"), outcomes: [
        { p: 85, text: L("L’incontro lascia un segno positivo.", "The visit makes a positive impact.", "La visita deja un impacto positivo."), effect: { reputation: 9, morale: 5, health: -2 }, tone: "good" },
        { p: 15, text: L("La giornata ti affatica.", "The day leaves you tired.", "La jornada te deja cansado."), effect: { reputation: 5, health: -6 }, tone: "neutral" },
      ] },
      { id: "fund", label: L("Finanzia il progetto", "Fund the project", "Financiar el proyecto"), outcomes: [
        { p: 100, text: L("Il contributo viene apprezzato.", "Your contribution is appreciated.", "Tu contribución es muy valorada."), effect: { cash: -20_000, reputation: 7, integrity: 3 }, tone: "good" },
      ] },
    ],
  },
  {
    id: "pressure", category: "life", title: L("Pressione mentale", "Mental pressure", "Presión mental"), body: L("Aspettative, critiche e calendario stanno influenzando il tuo benessere.", "Expectations, criticism and the schedule are affecting your wellbeing.", "Las expectativas, las críticas y el calendario están afectando tu bienestar."),
    choices: [
      { id: "help", label: L("Parla con uno psicologo", "Speak to a psychologist", "Hablar con un psicólogo"), outcomes: [
        { p: 90, text: L("Trovi strumenti utili.", "You find useful tools.", "Encuentras herramientas útiles."), effect: { morale: 14, form: 3, health: 4 }, tone: "good" },
        { p: 10, text: L("Serve anche un breve riposo.", "You also need a short break.", "También necesitas un breve descanso."), effect: { morale: 9, health: 7, injury: 1 }, tone: "neutral" },
      ] },
      { id: "hide", label: L("Nascondi il problema", "Hide the problem", "Ocultar el problema"), outcomes: [
        { p: 45, text: L("Mantieni il rendimento.", "You maintain your level.", "Mantienes el rendimiento."), effect: { form: 3, morale: -3 }, tone: "neutral" },
        { p: 40, text: L("Arriva un forte calo emotivo.", "You suffer emotional burnout.", "Sufres un fuerte agotamiento emocional."), effect: { form: -9, morale: -16, health: -7 }, tone: "bad" },
        { p: 15, text: L("La tensione provoca uno scontro.", "The tension causes a confrontation.", "La tensión provoca un enfrentamiento."), effect: { reputation: -5, morale: -10 }, tone: "bad" },
      ] },
    ],
  },
  {
    id: "doping", once: true, category: "integrity", title: L("La proposta proibita", "The prohibited proposal", "La propuesta prohibida"), body: L("Una persona vicina all’ambiente sportivo ti propone sostanze vietate. Promette risultati rapidi, senza garanzie.", "Someone close to the sporting environment offers prohibited substances. They promise quick results without guarantees.", "Una persona cercana al entorno deportivo te ofrece sustancias prohibidas. Promete resultados rápidos sin garantías."),
    choices: [
      { id: "refuse", label: L("Rifiuta e allontanati", "Refuse and walk away", "Rechazar y alejarse"), outcomes: [
        { p: 100, text: L("Proteggi salute e integrità.", "You protect your health and integrity.", "Proteges tu salud y tu integridad."), effect: { integrity: 12 }, tone: "good" },
      ] },
      { id: "report", label: L("Segnala la proposta", "Report the approach", "Denunciar la propuesta"), outcomes: [
        { p: 72, text: L("L’indagine resta riservata.", "The investigation remains confidential.", "La investigación permanece confidencial."), effect: { integrity: 15, reputation: 8 }, tone: "good" },
        { p: 28, text: L("La segnalazione trapela e crea tensioni.", "The report leaks and creates tension.", "La denuncia se filtra y genera tensión."), effect: { integrity: 15, morale: -9, reputation: 2 }, tone: "neutral" },
      ] },
      { id: "accept", label: L("Accetta il rischio", "Accept the risk", "Aceptar el riesgo"), outcomes: [
        { p: 55, text: L("Ottieni un vantaggio temporaneo, ma comprometti la tua integrità.", "You gain a temporary edge but compromise your integrity.", "Obtienes una ventaja temporal, pero comprometes tu integridad."), effect: { ovr: 2, form: 10, health: -4, integrity: -24 }, tone: "neutral" },
        { p: 25, text: L("Subisci una reazione avversa.", "You suffer an adverse reaction.", "Sufres una reacción adversa."), effect: { health: -28, morale: -9, integrity: -28, injury: 1 }, tone: "bad" },
        { p: 20, text: L("Un controllo dà esito positivo: lunga squalifica e sponsor perso.", "A test returns an adverse finding: a long ban and lost sponsor.", "Un control da un resultado positivo: larga sanción y patrocinador perdido."), effect: { ban: 4, reputation: -36, integrity: -40, loseSponsor: true, cash: -80_000 }, tone: "bad" },
      ] },
    ],
  },
  {
    id: "fixing", once: true, category: "integrity", title: L("La partita da condizionare", "The match-fixing approach", "La propuesta de amaño"), body: L("Un intermediario offre denaro perché tu condizioni deliberatamente una partita.", "An intermediary offers money for you to deliberately influence a match.", "Un intermediario te ofrece dinero para alterar deliberadamente un partido."),
    choices: [
      { id: "refuse", label: L("Rifiuta", "Refuse", "Rechazar"), outcomes: [
        { p: 100, text: L("Interrompi ogni contatto.", "You end all contact.", "Cortas todo contacto."), effect: { integrity: 12 }, tone: "good" },
      ] },
      { id: "report", label: L("Avvisa l’unità integrità", "Contact the integrity unit", "Avisar a la unidad de integridad"), outcomes: [
        { p: 68, text: L("La tua identità viene protetta.", "Your identity is protected.", "Tu identidad queda protegida."), effect: { integrity: 16, reputation: 10 }, tone: "good" },
        { p: 32, text: L("Il tuo nome trapela durante l’indagine.", "Your name leaks during the investigation.", "Tu nombre se filtra durante la investigación."), effect: { integrity: 16, morale: -12, reputation: 2 }, tone: "neutral" },
      ] },
      { id: "accept", label: L("Accetta il denaro", "Accept the money", "Aceptar el dinero"), outcomes: [
        { p: 48, text: L("Ricevi il pagamento, ma la scelta pesa sulla tua carriera.", "You receive payment, but the decision stains your career.", "Recibes el pago, pero la decisión marca tu carrera."), effect: { cash: 180_000, integrity: -36, morale: -7 }, tone: "neutral" },
        { p: 32, text: L("L’intermediario sparisce senza pagare.", "The intermediary disappears without paying.", "El intermediario desaparece sin pagar."), effect: { integrity: -30, morale: -10 }, tone: "bad" },
        { p: 20, text: L("La proposta era sorvegliata: squalifica, multa e sponsor perso.", "The approach was monitored: ban, fine and lost sponsor.", "La propuesta estaba vigilada: sanción, multa y patrocinador perdido."), effect: { ban: 5, reputation: -42, integrity: -48, loseSponsor: true, cash: -160_000 }, tone: "bad" },
      ] },
    ],
  },
];

type Contract = { clubId: string; annualSalary: number; expectedMinutes: number; remaining: number; total: number };
type SponsorDeal = { sponsorId: string; remaining: number; pay: number };
type Totals = { appearances: number; minutes: number; goals: number; assists: number; trophies: number; earnings: number };
type SemesterRecord = { index: number; year: number; half: 1 | 2; clubId: string; appearances: number; minutes: number; goals: number; assists: number; rating: number; ovrDelta: number; trophy: boolean; phenomenon: boolean; breakthrough?: DevelopmentPath; developmentSignal?: "surge" | "dip" };
type DecisionRecord = { title: Copy; result: Copy; tone: "good" | "bad" | "neutral" };
type Career = {
  seed: number;
  semester: number;
  name: string;
  nationality: string;
  position: Position;
  secondaryPosition?: Position;
  foot: "left" | "right";
  ovr: number;
  peakOvr: number;
  form: number;
  morale: number;
  health: number;
  reputation: number;
  integrity: number;
  developmentPath: DevelopmentPath;
  developmentPotential: number;
  developmentBreakthroughStart: number;
  developmentRevealed: boolean;
  momentum: number;
  breakthroughs: number;
  phenomenonReached: boolean;
  cash: number;
  currentClubId?: string;
  contract?: Contract;
  sponsor?: SponsorDeal;
  ban: number;
  injury: number;
  sponsorDecisionDue: boolean;
  totals: Totals;
  history: SemesterRecord[];
  decisions: DecisionRecord[];
  clubsSeen: string[];
  usedEvents: string[];
  lastEventId?: string;
};
type Offer = { id: string; clubId: string; annualSalary: number; expectedMinutes: number; semesters: number; interest: number };
type EventResult = { text: Copy; tone: "good" | "bad" | "neutral" };
type SemesterToastData = {
  record: SemesterRecord;
  count: number;
  appearances: number;
  goals: number;
  assists: number;
  rating: number;
  ovrDelta: number;
  breakthrough?: DevelopmentPath;
  phenomenon: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hashSeed(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0 || 1;
}

function makeRng(seed: number) {
  let state = seed >>> 0 || 1;
  return {
    next() {
      state ^= state << 13;
      state ^= state >>> 17;
      state ^= state << 5;
      state >>>= 0;
      return state / 4294967296;
    },
    state() {
      return state >>> 0 || 1;
    },
  };
}

function roundMoney(value: number) {
  return Math.max(10_000, Math.round(value / 1_000) * 1_000);
}

function formatMoney(value: number, locale: Locale) {
  const tag = locale === "it" ? "it-IT" : locale === "es" ? "es-ES" : "en-GB";
  return new Intl.NumberFormat(tag, {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatNumber(value: number, locale: Locale) {
  const tag = locale === "it" ? "it-IT" : locale === "es" ? "es-ES" : "en-GB";
  return new Intl.NumberFormat(tag).format(value);
}

function selectDevelopmentPath(roll: number): DevelopmentPath {
  let cumulative = 0;
  for (const path of DEVELOPMENT_ORDER) {
    cumulative += DEVELOPMENT_PROFILES[path].chance;
    if (roll * 100 < cumulative) return path;
  }
  return "volatile";
}

function developmentPotential(path: DevelopmentPath, roll: number) {
  const ranges: Record<DevelopmentPath, [number, number]> = {
    steady: [78, 87],
    wonderkid: [88, 94],
    late_bloomer: [86, 93],
    volatile: [82, 94],
    prodigy: [94, 96],
  };
  const [minimum, maximum] = ranges[path];
  return minimum + Math.floor(roll * (maximum - minimum + 1));
}

function developmentStart(path: DevelopmentPath, roll: number) {
  if (path === "wonderkid") return roll < 0.3 ? 2 : roll < 0.6 ? 3 : roll < 0.85 ? 4 : 5;
  if (path === "late_bloomer") return roll < 0.15 ? 16 : roll < 0.35 ? 18 : roll < 0.6 ? 20 : roll < 0.8 ? 22 : roll < 0.95 ? 24 : 26;
  if (path === "prodigy") return roll < 0.5 ? 1 : roll < 0.8 ? 2 : 3;
  return 0;
}

function naturalAgeGrowth(age: number) {
  return age < 19 ? 0.55 : age < 23 ? 0.38 : age < 28 ? 0.18 : age < 31 ? 0.02 : age < 34 ? -0.22 : age < 37 ? -0.48 : -0.75;
}

function developmentBonus(path: DevelopmentPath, age: number, semester: number, breakthroughStart: number) {
  if (path === "wonderkid") {
    return semester < breakthroughStart ? 0.2 : semester < breakthroughStart + 10 ? 1.25 : age < 27 ? 0.45 : 0;
  }
  if (path === "late_bloomer") {
    return semester < breakthroughStart ? -0.1 : semester < breakthroughStart + 10 ? 1.65 : semester < breakthroughStart + 14 ? 0.55 : 0;
  }
  if (path === "prodigy") {
    return semester < breakthroughStart ? 0.35 : semester < breakthroughStart + 12 ? 1.65 : age < 27 ? 0.55 : 0;
  }
  if (path === "volatile") return age < 23 ? 0.2 : age < 28 ? 0.25 : age < 31 ? 0.1 : 0;
  return age < 23 ? 0.3 : age < 28 ? 0.35 : age < 31 ? 0.12 : 0;
}

function shouldRevealDevelopment(path: DevelopmentPath, semester: number, breakthroughStart: number, ovrDelta: number, signal: "surge" | "dip" | undefined) {
  if (path === "wonderkid" || path === "prodigy") return semester <= 12 && semester >= breakthroughStart && ovrDelta >= 1.2;
  if (path === "late_bloomer") return semester >= breakthroughStart && ovrDelta >= 1.25;
  if (path === "volatile") return semester >= 4 && Boolean(signal);
  return semester >= 8;
}

function momentumLabel(momentum: number, locale: Locale) {
  if (momentum >= 0.55) return UI.momentumHigh[locale];
  if (momentum <= -0.45) return UI.momentumLow[locale];
  return UI.momentumStable[locale];
}

function lastGrowth(career: Career, semesters = 3) {
  return career.history.slice(-semesters).reduce((total, record) => total + record.ovrDelta, 0);
}

function statusForMinutes(minutes: number, locale: Locale) {
  if (minutes >= 1_300) return L("Titolare", "Starter", "Titular")[locale];
  if (minutes >= 950) return L("Alta rotazione", "High rotation", "Rotación alta")[locale];
  if (minutes >= 650) return L("Rotazione", "Rotation", "Rotación")[locale];
  return L("Riserva", "Reserve", "Suplente")[locale];
}

function adjacentPosition(position: Position): Position {
  const map: Record<Position, Position> = { GK: "GK", RB: "CB", CB: "DM", LB: "CB", DM: "CM", CM: "AM", AM: "SS", RW: "CF", LW: "CF", SS: "ST", CF: "ST", ST: "CF" };
  return map[position];
}

function nationalityFor(id: string, locale: Locale) {
  return NATIONALITIES.find((item) => item.id === id)?.label[locale] ?? id;
}

function ClubCrest({ club, size = "md" }: { club: Club; size?: "sm" | "md" | "lg" }) {
  const style = {
    "--crest-a": club.colors[0],
    "--crest-b": club.colors[1],
    "--crest-c": club.colors[2],
  } as CSSProperties;
  return (
    <span className={`club-crest club-crest--${size}`} style={style} aria-hidden="true">
      <Image src={club.logo} alt="" width={96} height={96} unoptimized />
    </span>
  );
}

function Meter({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="meter">
      <div className="meter__label"><span>{label}</span><strong>{Math.round(value)}</strong></div>
      <div className="meter__track" aria-hidden="true"><span className={accent ? "meter__fill meter__fill--accent" : "meter__fill"} style={{ width: `${clamp(value, 0, 100)}%` }} /></div>
    </div>
  );
}

function generateOffers(career: Career, initial: boolean) {
  const rng = makeRng(career.seed);
  const current = career.currentClubId;
  const currentCountry = CLUBS.find((club) => club.id === current)?.country;
  const maxPrestige = initial ? 3 : clamp(Math.floor((career.ovr + career.reputation) / 31), 3, 5);
  const newClubSlots = initial ? 4 : 3;
  const pool = CLUBS.filter((club) => club.id !== current && club.prestige <= maxPrestige)
    .map((club) => ({
      club,
      order: rng.next() + (!career.clubsSeen.includes(club.id) ? 0.18 : 0) + (currentCountry && club.country !== currentCountry ? 0.06 : 0),
    }))
    .sort((a, b) => a.order - b.order)
    .slice(-newClubSlots)
    .reverse()
    .map(({ club }) => club);
  const selected = current ? [CLUBS.find((club) => club.id === current)!, ...pool] : pool;
  const offers = selected.map((club, index) => {
    const salaryNoise = 0.88 + rng.next() * 0.24;
    const salary = roundMoney(club.salaryBase * (0.52 + career.ovr / 105) * salaryNoise);
    const roleFactor = POSITION_MINUTES_FACTOR[career.position] * (career.secondaryPosition ? 1.05 : 1);
    const minutes = Math.round(clamp((club.minutesBase + (career.ovr - club.squad) * 38 + (rng.next() - 0.5) * 180) * roleFactor, 280, 1_520) / 10) * 10;
    const semesters = [4, 6, 8][Math.floor(rng.next() * 3)];
    const interest = Math.round(clamp(58 + career.reputation * 0.28 + (career.ovr - club.squad) * 1.1 + rng.next() * 18, 38, 92));
    return { id: `${career.semester}-${club.id}-${index}`, clubId: club.id, annualSalary: salary, expectedMinutes: minutes, semesters, interest };
  });
  return { offers, seed: rng.state() };
}

function counterChance(offer: Offer, raise: number) {
  return Math.round(clamp(92 - raise * 2.25 + (offer.interest - 50) * 0.34, 12, 94));
}

function applyEffect(career: Career, effect: Effect | undefined): Career {
  if (!effect) return career;
  const nextPosition = effect.secondaryRole ? adjacentPosition(career.position) : career.secondaryPosition;
  const nextOvr = clamp(Math.round((career.ovr + (effect.ovr ?? 0)) * 10) / 10, 38, 96);
  const losesSponsor = Boolean(effect.loseSponsor && career.sponsor);
  return {
    ...career,
    ovr: nextOvr,
    peakOvr: Math.max(career.peakOvr, nextOvr),
    form: clamp(career.form + (effect.form ?? 0), 0, 100),
    morale: clamp(career.morale + (effect.morale ?? 0), 0, 100),
    health: clamp(career.health + (effect.health ?? 0), 0, 100),
    reputation: clamp(career.reputation + (effect.reputation ?? 0), 0, 100),
    integrity: clamp(career.integrity + (effect.integrity ?? 0), 0, 100),
    cash: Math.max(0, career.cash + (effect.cash ?? 0)),
    ban: Math.max(career.ban, effect.ban ?? 0),
    injury: Math.max(career.injury, effect.injury ?? 0),
    sponsor: effect.loseSponsor ? undefined : career.sponsor,
    sponsorDecisionDue: career.sponsorDecisionDue || losesSponsor,
    secondaryPosition: nextPosition,
  };
}

type SimulationStep = {
  career: Career;
  record: SemesterRecord;
  nextPhase: "career" | "market" | "sponsor" | "summary";
  eventDue: boolean;
};

function simulateOneSemester(base: Career): SimulationStep | null {
  if (!base.contract || !base.currentClubId) return null;
  const club = CLUBS.find((item) => item.id === base.currentClubId);
  if (!club) return null;

  const rng = makeRng(base.seed);
  const semesterAge = 16 + Math.floor(base.semester / 2);
  const unavailable = base.ban > 0 || base.injury > 0;
  const healthFactor = clamp(base.health / 100, 0.35, 1);
  const formFactor = 0.88 + (base.form - 50) / 400;
  const competitionFactor = clamp(1 + (base.ovr - club.squad) / 120, 0.72, 1.18);
  const versatilityFactor = base.secondaryPosition ? 1.04 : 1;
  const minutes = unavailable
    ? 0
    : Math.round(clamp(base.contract.expectedMinutes * healthFactor * formFactor * competitionFactor * versatilityFactor * (0.9 + rng.next() * 0.2), 0, 1_620) / 10) * 10;
  const appearances = minutes === 0 ? 0 : Math.max(1, Math.round(minutes / 78));
  const goalRates: Record<Position, number> = { GK: 0, RB: 0.025, CB: 0.02, LB: 0.025, DM: 0.045, CM: 0.08, AM: 0.16, RW: 0.22, LW: 0.22, SS: 0.3, CF: 0.36, ST: 0.44 };
  const assistRates: Record<Position, number> = { GK: 0.005, RB: 0.08, CB: 0.03, LB: 0.08, DM: 0.09, CM: 0.16, AM: 0.24, RW: 0.2, LW: 0.2, SS: 0.17, CF: 0.13, ST: 0.09 };
  const quality = clamp(0.68 + base.ovr / 105 + (base.form - 50) / 180, 0.55, 1.55);
  const goals = Math.max(0, Math.round((minutes / 90) * goalRates[base.position] * quality * (0.72 + rng.next() * 0.56)));
  const assists = Math.max(0, Math.round((minutes / 90) * assistRates[base.position] * quality * (0.72 + rng.next() * 0.56)));
  const rating = minutes === 0 ? 5 : Math.round(clamp(6.15 + (base.ovr - club.squad) / 25 + (base.form - 50) / 90 + rng.next() * 0.9, 4.8, 9.4) * 10) / 10;
  const newSemester = base.semester + 1;
  const ageGrowth = naturalAgeGrowth(semesterAge);
  const profileGrowth = developmentBonus(base.developmentPath, semesterAge, base.semester, base.developmentBreakthroughStart);
  const roleGrowth = semesterAge < 28 ? POSITION_GROWTH_BONUS[base.position] + (base.secondaryPosition ? 0.06 : 0) : 0;
  const developmentRoll = rng.next() * 100;
  let developmentSignal: SemesterRecord["developmentSignal"];
  let developmentShock = 0;
  if (base.developmentPath === "volatile") {
    if (developmentRoll < 12) {
      developmentSignal = "surge";
      developmentShock = 1.1;
    } else if (developmentRoll < 22) {
      developmentSignal = "dip";
      developmentShock = -0.8;
    }
  } else {
    const surgeChance = base.developmentPath === "prodigy" ? 12 : base.developmentPath === "wonderkid" && semesterAge <= 21 ? 10 : base.developmentPath === "late_bloomer" && base.semester >= base.developmentBreakthroughStart ? 12 : 6;
    if (developmentRoll < surgeChance) {
      developmentSignal = "surge";
      developmentShock = base.developmentPath === "late_bloomer" || base.developmentPath === "prodigy" ? 0.65 : 0.45;
    }
  }
  const volatility = base.developmentPath === "volatile" ? 0.4 : base.developmentPath === "steady" ? 0.12 : base.developmentPath === "late_bloomer" ? 0.16 : base.developmentPath === "wonderkid" ? 0.18 : 0.2;
  const randomNoise = (rng.next() + rng.next() - 1) * volatility;
  const minutesRatio = minutes / Math.max(base.contract.expectedMinutes, 1);
  const performanceGrowth = clamp((rating - 6.5) * 0.32, -0.5, 0.75);
  const opportunityGrowth = clamp((minutesRatio - 0.75) * 0.3, -0.25, 0.2);
  const wellbeingGrowth = base.health < 55 ? -0.25 : base.health >= 88 ? 0.08 : 0;
  const mindsetGrowth = base.morale < 35 ? -0.18 : base.morale >= 80 ? 0.08 : 0;
  const rawGrowth = ageGrowth + profileGrowth + roleGrowth + performanceGrowth + opportunityGrowth + wellbeingGrowth + mindsetGrowth + base.momentum * 0.22 + developmentShock + randomNoise;
  const room = base.developmentPotential + 2 - base.ovr;
  const ceilingFactor = rawGrowth > 0 ? clamp(room / 7, 0.12, 1) : 1;
  const availabilityFactor = unavailable && rawGrowth > 0 ? 0.2 : 1;
  const ovrDelta = Math.round(clamp(rawGrowth * ceilingFactor * availabilityFactor, -1.4, 2.4) * 10) / 10;
  const nextOvr = clamp(Math.round((base.ovr + ovrDelta) * 10) / 10, 40, 96);
  const breakthrough = !base.developmentRevealed && shouldRevealDevelopment(base.developmentPath, newSemester, base.developmentBreakthroughStart, ovrDelta, developmentSignal)
    ? base.developmentPath
    : undefined;
  const nextAge = 16 + Math.floor(newSemester / 2);
  const phenomenonThreshold = base.developmentPath === "late_bloomer" && nextAge >= 28 ? 86 : 88;
  const phenomenon = !base.phenomenonReached && nextOvr >= phenomenonThreshold;
  const salaryPay = base.contract.annualSalary / 2;
  const sponsorPay = base.sponsor?.pay ?? 0;
  const sponsorConfig = base.sponsor ? SPONSORS.find((item) => item.id === base.sponsor?.sponsorId) : undefined;
  const sponsorBonus = sponsorConfig?.performanceBonusPercent && minutes > base.contract.expectedMinutes
    ? sponsorPay * sponsorConfig.performanceBonusPercent / 100
    : 0;
  const sponsorPayTotal = sponsorPay + sponsorBonus;
  const trophyChance = clamp(0.01 + club.prestige * 0.018 + Math.max(0, rating - 7) * 0.035, 0.02, 0.18);
  const trophy = rng.next() < trophyChance;
  const record: SemesterRecord = {
    index: newSemester,
    year: 2026 + Math.floor(base.semester / 2),
    half: ((base.semester % 2) + 1) as 1 | 2,
    clubId: club.id,
    appearances,
    minutes,
    goals,
    assists,
    rating,
    ovrDelta,
    trophy,
    breakthrough,
    developmentSignal,
    phenomenon,
  };
  const nextSponsor = base.sponsor
    ? { ...base.sponsor, remaining: Math.max(0, base.sponsor.remaining - 1) }
    : undefined;
  const sponsorExpired = Boolean(base.sponsor && nextSponsor?.remaining === 0);
  const nextForm = clamp(base.form + (rating - 6.5) * 3 + (rng.next() - 0.5) * 8, 18, 100);
  const nextHealth = clamp(base.health + (unavailable ? 8 : 3) + (sponsorConfig?.healthBoost ?? 0) - rng.next() * 4, 28, 100);
  const impact = clamp((rating - 6.5) / 1.4 + (minutesRatio - 0.8) * 0.35, -1, 1);
  const momentumCarry = base.developmentPath === "volatile" ? 0.7 : 0.55;
  const nextMomentum = clamp(base.momentum * momentumCarry + impact * (1 - momentumCarry), -1, 1);
  const career: Career = {
    ...base,
    seed: rng.state(),
    semester: newSemester,
    ovr: nextOvr,
    peakOvr: Math.max(base.peakOvr, nextOvr),
    developmentRevealed: base.developmentRevealed || Boolean(breakthrough),
    momentum: nextMomentum,
    breakthroughs: base.breakthroughs + (breakthrough || phenomenon || developmentSignal === "surge" ? 1 : 0),
    phenomenonReached: base.phenomenonReached || phenomenon,
    form: nextForm,
    morale: clamp(base.morale + (minutes >= base.contract.expectedMinutes * 0.85 ? 4 : -5) + (trophy ? 7 : 0), 12, 100),
    health: nextHealth,
    reputation: clamp(base.reputation + Math.max(0, rating - 6.3) * 1.8 + (trophy ? 5 : 0) + (sponsorConfig?.reputationBoost ?? 0), 0, 100),
    cash: base.cash + salaryPay + sponsorPayTotal,
    ban: Math.max(0, base.ban - 1),
    injury: Math.max(0, base.injury - 1),
    contract: { ...base.contract, remaining: Math.max(0, base.contract.remaining - 1) },
    sponsor: nextSponsor?.remaining === 0 ? undefined : nextSponsor,
    sponsorDecisionDue: base.sponsorDecisionDue || sponsorExpired,
    totals: {
      appearances: base.totals.appearances + appearances,
      minutes: base.totals.minutes + minutes,
      goals: base.totals.goals + goals,
      assists: base.totals.assists + assists,
      trophies: base.totals.trophies + (trophy ? 1 : 0),
      earnings: base.totals.earnings + salaryPay + sponsorPayTotal,
    },
    history: [...base.history, record],
  };
  const nextPhase: SimulationStep["nextPhase"] =
    newSemester >= 48 ? "summary" :
    career.contract!.remaining === 0 || newSemester % 6 === 0 ? "market" :
    career.sponsorDecisionDue ? "sponsor" : "career";

  return {
    career,
    record,
    nextPhase,
    eventDue: newSemester < 48 && (newSemester === 14 || newSemester === 26 || newSemester % 4 === 0),
  };
}

function selectEvent(career: Career) {
  const rng = makeRng(career.seed);
  let event: CareerEvent | undefined;
  if (career.semester === 14 && !career.usedEvents.includes("doping")) event = EVENTS.find((item) => item.id === "doping");
  if (career.semester === 26 && !career.usedEvents.includes("fixing")) event = EVENTS.find((item) => item.id === "fixing");
  if (!event) {
    const available = EVENTS.filter((item) => item.id !== career.lastEventId && (!item.once || !career.usedEvents.includes(item.id)) && item.category !== "integrity");
    event = available[Math.floor(rng.next() * available.length)];
  }
  return { event: event!, seed: rng.state() };
}

function legacyFor(career: Career, locale: Locale) {
  if (career.integrity < 35) return L("Talento in ombra", "A shadowed talent", "Talento en la sombra")[locale];
  if (career.developmentPath === "prodigy" && career.peakOvr >= 92) return L("Talento generazionale", "Generational talent", "Talento generacional")[locale];
  if (career.developmentPath === "late_bloomer" && career.phenomenonReached && career.peakOvr >= 86) return L("Fenomeno tardivo", "Late-blooming phenomenon", "Fenómeno tardío")[locale];
  if (career.developmentPath === "volatile" && career.peakOvr >= 86) return L("Genio imprevedibile", "Unpredictable genius", "Genio impredecible")[locale];
  if (career.developmentPath === "wonderkid" && career.developmentRevealed && career.peakOvr >= 88) return L("Predestinato", "The chosen one", "Predestinado")[locale];
  if (career.peakOvr >= 88) return L("Fuoriclasse", "World class", "Crack mundial")[locale];
  if (career.totals.trophies >= 5) return L("Collezionista", "Serial winner", "Coleccionista")[locale];
  if (career.clubsSeen.length === 1) return L("Bandiera", "One-club icon", "Leyenda de un club")[locale];
  if (career.reputation >= 75) return L("Icona globale", "Global icon", "Icono global")[locale];
  return L("Professionista vero", "True professional", "Profesional de verdad")[locale];
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("it");
  const [phase, setPhase] = useState<Phase>("intro");
  const [playerName, setPlayerName] = useState("");
  const [nationality, setNationality] = useState("it");
  const [position, setPosition] = useState<Position>("CM");
  const [foot, setFoot] = useState<"left" | "right">("right");
  const [career, setCareer] = useState<Career | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [initialMarket, setInitialMarket] = useState(true);
  const [counterOpen, setCounterOpen] = useState<string | null>(null);
  const [counterRaise, setCounterRaise] = useState(10);
  const [counterStatus, setCounterStatus] = useState<Record<string, "rejected">>({});
  const [currentEvent, setCurrentEvent] = useState<CareerEvent | null>(null);
  const [eventResult, setEventResult] = useState<EventResult | null>(null);
  const [pendingPhase, setPendingPhase] = useState<"career" | "market" | "sponsor" | "summary">("career");
  const [liveMessage, setLiveMessage] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [semesterToast, setSemesterToast] = useState<SemesterToastData | null>(null);
  const inputLockedRef = useRef(false);
  const scoutingTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const simulationTimerRef = useRef<number | null>(null);

  const tx = (copy: Copy) => copy[locale];
  const currentClub = career?.currentClubId ? CLUBS.find((club) => club.id === career.currentClubId) : undefined;
  const currentSponsor = career?.sponsor ? SPONSORS.find((sponsor) => sponsor.id === career.sponsor!.sponsorId) : undefined;
  const age = career ? 16 + Math.floor(career.semester / 2) : 16;
  const nextHalf = career ? ((career.semester % 2) + 1) as 1 | 2 : 1;
  const nextYear = career ? 2026 + Math.floor(career.semester / 2) : 2026;
  const reputation = career?.reputation;

  const sponsorOffers = useMemo(() => {
    if (reputation === undefined) return [];
    const eligible = SPONSORS.filter((sponsor) => sponsor.minRep <= reputation);
    return eligible.slice(Math.max(0, eligible.length - 3));
  }, [reputation]);
  const highestSalary = offers.reduce((maximum, offer) => Math.max(maximum, offer.annualSalary), 0);
  const highestMinutes = offers.reduce((maximum, offer) => Math.max(maximum, offer.expectedMinutes), 0);
  const highestSponsorPay = sponsorOffers.reduce((maximum, sponsor) => Math.max(maximum, sponsor.pay), 0);
  const longestSponsorTerm = sponsorOffers.reduce((maximum, sponsor) => Math.max(maximum, sponsor.term), 0);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [phase]);

  useEffect(() => () => {
    if (scoutingTimerRef.current !== null) window.clearTimeout(scoutingTimerRef.current);
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current);
    if (simulationTimerRef.current !== null) window.clearTimeout(simulationTimerRef.current);
  }, []);

  function startCareer() {
    if (scoutingTimerRef.current !== null) window.clearTimeout(scoutingTimerRef.current);
    inputLockedRef.current = false;
    setIsSimulating(false);
    setSemesterToast(null);
    const cleanedName = playerName.trim() || L("Giocatore", "Player", "Jugador")[locale];
    const seed = hashSeed(`${cleanedName}|${position}|${nationality}|${Date.now()}`);
    const rng = makeRng(seed);
    const developmentPath = selectDevelopmentPath(rng.next());
    const developmentPotentialValue = developmentPotential(developmentPath, rng.next());
    const developmentBreakthroughStart = developmentStart(developmentPath, rng.next());
    const startingOvr = 53 + Math.floor(rng.next() * 5);
    const initial: Career = {
      seed: rng.state(), semester: 0, name: cleanedName, nationality, position, foot,
      ovr: startingOvr, peakOvr: startingOvr, form: 62, morale: 70, health: 94,
      reputation: 10, integrity: 78, developmentPath, developmentPotential: developmentPotentialValue, developmentBreakthroughStart,
      developmentRevealed: false, momentum: 0, breakthroughs: 0, phenomenonReached: false,
      cash: 0, ban: 0, injury: 0, sponsorDecisionDue: true,
      totals: { appearances: 0, minutes: 0, goals: 0, assists: 0, trophies: 0, earnings: 0 },
      history: [], decisions: [], clubsSeen: [], usedEvents: [],
    };
    setCareer(initial);
    setPhase("scouting");
    setLiveMessage("");
    scoutingTimerRef.current = window.setTimeout(() => {
      const generated = generateOffers(initial, true);
      setCareer({ ...initial, seed: generated.seed });
      setOffers(generated.offers);
      setInitialMarket(true);
      setPhase("market");
      scoutingTimerRef.current = null;
    }, 180);
  }

  function signedCareer(base: Career, offer: Offer, salary: number) {
    return {
      ...base,
      currentClubId: offer.clubId,
      contract: { clubId: offer.clubId, annualSalary: salary, expectedMinutes: offer.expectedMinutes, remaining: offer.semesters, total: offer.semesters },
      clubsSeen: base.clubsSeen.includes(offer.clubId) ? base.clubsSeen : [...base.clubsSeen, offer.clubId],
      sponsorDecisionDue: base.sponsorDecisionDue || !base.sponsor,
    };
  }

  function acceptOffer(offer: Offer, salary = offer.annualSalary, base = career) {
    if (!base) return;
    const next = signedCareer(base, offer, salary);
    setCareer(next);
    setCounterOpen(null);
    setCounterStatus({});
    setLiveMessage(`${CLUBS.find((club) => club.id === offer.clubId)?.name}: ${tx(UI.accept)}.`);
    setPhase(next.sponsorDecisionDue ? "sponsor" : "career");
  }

  function submitCounter(offer: Offer) {
    if (!career || counterStatus[offer.id]) return;
    const chance = counterChance(offer, counterRaise);
    const rng = makeRng(career.seed);
    const accepted = rng.next() * 100 < chance;
    const updated = { ...career, seed: rng.state() };
    if (accepted) {
      acceptOffer(offer, roundMoney(offer.annualSalary * (1 + counterRaise / 100)), updated);
    } else {
      setCareer(updated);
      setCounterStatus((current) => ({ ...current, [offer.id]: "rejected" }));
      setCounterOpen(null);
      setLiveMessage(tx(UI.counterRejected));
    }
  }

  function signSponsor(sponsor?: Sponsor) {
    if (!career) return;
    if (!sponsor) {
      setCareer({ ...career, sponsor: undefined, sponsorDecisionDue: false });
    } else {
      setCareer({
        ...career,
        cash: career.cash + sponsor.signing,
        sponsor: { sponsorId: sponsor.id, remaining: sponsor.term, pay: sponsor.pay },
        sponsorDecisionDue: false,
        totals: { ...career.totals, earnings: career.totals.earnings + sponsor.signing },
      });
    }
    setPhase("career");
  }

  function transition(next: "career" | "market" | "sponsor" | "summary", base: Career) {
    if (next === "market") {
      const generated = generateOffers(base, false);
      setCareer({ ...base, seed: generated.seed });
      setOffers(generated.offers);
      setInitialMarket(false);
      setCounterStatus({});
      setPhase("market");
      return;
    }
    setCareer(base);
    setPhase(next);
  }

  function advanceCareer(maxSteps: number) {
    if (inputLockedRef.current || !career?.contract || !currentClub) return;
    inputLockedRef.current = true;
    setIsSimulating(true);

    let active = career;
    const records: SemesterRecord[] = [];
    let boundaryReached = false;

    for (let index = 0; index < maxSteps && active.semester < 48; index += 1) {
      const step = simulateOneSemester(active);
      if (!step) break;
      active = step.career;
      records.push(step.record);

      if (step.eventDue) {
        const selected = selectEvent(active);
        const withEvent = {
          ...active,
          seed: selected.seed,
          usedEvents: selected.event.once && !active.usedEvents.includes(selected.event.id)
            ? [...active.usedEvents, selected.event.id]
            : active.usedEvents,
          lastEventId: selected.event.id,
        };
        setCareer(withEvent);
        setCurrentEvent(selected.event);
        setEventResult(null);
        setPendingPhase(step.nextPhase);
        setPhase("event");
        boundaryReached = true;
        break;
      }

      if (step.nextPhase !== "career") {
        transition(step.nextPhase, active);
        boundaryReached = true;
        break;
      }
    }

    if (!boundaryReached) setCareer(active);

    const latest = records.at(-1);
    if (latest) {
      if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current);
      const totalRating = records.reduce((sum, record) => sum + record.rating, 0);
      const totalOvrDelta = records.reduce((sum, record) => sum + record.ovrDelta, 0);
      const revealedPath = records.find((record) => record.breakthrough)?.breakthrough;
      setSemesterToast({
        record: latest,
        count: records.length,
        appearances: records.reduce((sum, record) => sum + record.appearances, 0),
        goals: records.reduce((sum, record) => sum + record.goals, 0),
        assists: records.reduce((sum, record) => sum + record.assists, 0),
        rating: totalRating / records.length,
        ovrDelta: Math.round(totalOvrDelta * 10) / 10,
        breakthrough: revealedPath,
        phenomenon: records.some((record) => record.phenomenon),
      });
      const growthMessage = revealedPath
        ? tx(DEVELOPMENT_PROFILES[revealedPath].label)
        : records.some((record) => record.phenomenon) ? tx(UI.phenomenon) : `${records.length} ${tx(UI.semesters)}`;
      setLiveMessage(`${latest.year} · ${latest.half === 1 ? "I" : "II"} · ${growthMessage}`);
      feedbackTimerRef.current = window.setTimeout(() => {
        setSemesterToast(null);
        feedbackTimerRef.current = null;
      }, 1_050);
    }

    if (simulationTimerRef.current !== null) window.clearTimeout(simulationTimerRef.current);
    simulationTimerRef.current = window.setTimeout(() => {
      inputLockedRef.current = false;
      setIsSimulating(false);
      simulationTimerRef.current = null;
    }, 240);
  }

  function resolveEvent(choice: EventChoice) {
    if (!career || !currentEvent || eventResult) return;
    const rng = makeRng(career.seed);
    const roll = rng.next() * 100;
    let cumulative = 0;
    let chosen = choice.outcomes[choice.outcomes.length - 1];
    for (const outcome of choice.outcomes) {
      cumulative += outcome.p;
      if (roll < cumulative) {
        chosen = outcome;
        break;
      }
    }
    const effected = applyEffect({ ...career, seed: rng.state() }, chosen.effect);
    const updated = {
      ...effected,
      decisions: [...effected.decisions, { title: currentEvent.title, result: chosen.text, tone: chosen.tone ?? "neutral" }].slice(-12),
    };
    setCareer(updated);
    setEventResult({ text: chosen.text, tone: chosen.tone ?? "neutral" });
    setLiveMessage(tx(chosen.text));
  }

  function continueAfterEvent() {
    if (!career || !eventResult) return;
    setCurrentEvent(null);
    setEventResult(null);
    const next = pendingPhase === "career" && career.sponsorDecisionDue ? "sponsor" : pendingPhase;
    transition(next, career);
  }

  function restart() {
    if (scoutingTimerRef.current !== null) window.clearTimeout(scoutingTimerRef.current);
    if (feedbackTimerRef.current !== null) window.clearTimeout(feedbackTimerRef.current);
    if (simulationTimerRef.current !== null) window.clearTimeout(simulationTimerRef.current);
    scoutingTimerRef.current = null;
    feedbackTimerRef.current = null;
    simulationTimerRef.current = null;
    inputLockedRef.current = false;
    setPhase("creator");
    setCareer(null);
    setOffers([]);
    setCurrentEvent(null);
    setEventResult(null);
    setCounterStatus({});
    setCounterOpen(null);
    setCounterRaise(10);
    setIsSimulating(false);
    setSemesterToast(null);
    setPlayerName("");
    setLiveMessage("");
  }

  async function copySummary() {
    if (!career) return;
    const text = `${career.name} · ${legacyFor(career, locale)} · ${tx(UI.trajectory)}: ${tx(DEVELOPMENT_PROFILES[career.developmentPath].label)} · OVR ${Math.round(career.peakOvr)} · ${career.totals.appearances} ${tx(UI.apps)} · ${career.totals.goals} ${tx(UI.goals)} · ${career.totals.trophies} ${tx(UI.trophies)} · LINEA XI`;
    try {
      await navigator.clipboard.writeText(text);
      setLiveMessage(tx(UI.copied));
    } catch {
      setLiveMessage(text);
    }
  }

  const progress = career ? Math.round((career.semester / 48) * 100) : 0;
  const growthLastThree = career ? lastGrowth(career) : 0;
  const latestRecord = career?.history.at(-1);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#game">{tx(UI.skip)}</a>
      <header className="site-header">
        <div className="brand" aria-label="LINEA XI">
          <span className="brand__mark">XI</span>
          <span><strong>LINEA</strong><small>{tx(UI.brandLine)}</small></span>
        </div>
        <div className="header-status" aria-hidden="true">
          {career ? <><span>{String(career.semester).padStart(2, "0")}/48</span><i><b style={{ width: `${progress}%` }} /></i></> : <span>00/48</span>}
        </div>
        <div className="language-switch" role="group" aria-label="Language">
          {(["it", "en", "es"] as Locale[]).map((item) => (
            <button key={item} type="button" className={locale === item ? "is-active" : ""} aria-pressed={locale === item} onClick={() => setLocale(item)}>{item.toUpperCase()}</button>
          ))}
        </div>
      </header>

      <main id="game" data-phase={phase}>
        {phase === "intro" && (
          <section className="intro page-section">
            <div className="intro__copy">
              <span className="eyebrow">{tx(UI.introEyebrow)}</span>
              <h1><span>{tx(UI.introTitleA)}</span>{tx(UI.introTitleB)}</h1>
              <p className="lede">{tx(UI.introBody)}</p>
              <div className="intro__actions">
                <button className="button button--primary button--large" type="button" onClick={() => setPhase("creator")}>{tx(UI.start)} <span aria-hidden="true">↗</span></button>
                <span>{tx(UI.noSave)}</span>
              </div>
            </div>
            <div className="hero-board" aria-hidden="true">
              <div className="hero-board__top"><span>CAREER ID</span><strong>16—40</strong></div>
              <div className="pitch-lines"><i /><i /><i /><i /><i /><i /><i /></div>
              <div className="hero-card hero-card--rom"><Image src="/clubs/rom.png" alt="" width={52} height={52} unoptimized /><span>ROM</span><b>€ 1.2M</b><small>780&apos;</small></div>
              <div className="hero-card hero-card--ars"><Image src="/clubs/ars.png" alt="" width={52} height={52} unoptimized /><span>ARS</span><b>€ 860K</b><small>1.180&apos;</small></div>
              <div className="hero-choice"><span>ACCETTA</span><strong>o</strong><span>RILANCIA</span></div>
              <div className="hero-board__stamp"><b>48</b><span>SEMESTRI</span></div>
            </div>
            <div className="intro__pillars" aria-label={tx(UI.howItWorks)}>
              {[ ["01", UI.pillar1, UI.pillar1b], ["02", UI.pillar2, UI.pillar2b], ["03", UI.pillar3, UI.pillar3b] ].map(([number, title, body]) => (
                <article key={number as string}><span>{number as string}</span><h2>{tx(title as Copy)}</h2><p>{tx(body as Copy)}</p></article>
              ))}
            </div>
          </section>
        )}

        {phase === "creator" && (
          <section className="page-section creator">
            <div className="section-heading"><span className="eyebrow">{tx(UI.creatorEyebrow)}</span><h1>{tx(UI.creatorTitle)}</h1><p>{tx(UI.creatorBody)}</p></div>
            <div className="creator-grid">
              <div className="identity-card panel">
                <label>{tx(UI.playerName)}<input value={playerName} onChange={(event) => setPlayerName(event.target.value.slice(0, 28))} placeholder={tx(UI.namePlaceholder)} autoComplete="off" /></label>
                <label>{tx(UI.nationality)}<select value={nationality} onChange={(event) => setNationality(event.target.value)}>{NATIONALITIES.map((item) => <option key={item.id} value={item.id}>{tx(item.label)}</option>)}</select></label>
                <fieldset><legend>{tx(UI.foot)}</legend><div className="segmented"><button type="button" className={foot === "left" ? "is-active" : ""} aria-pressed={foot === "left"} onClick={() => setFoot("left")}>{tx(UI.left)}</button><button type="button" className={foot === "right" ? "is-active" : ""} aria-pressed={foot === "right"} onClick={() => setFoot("right")}>{tx(UI.right)}</button></div></fieldset>
                <div className="player-preview"><span className="player-preview__number">16</span><div><small>OVR</small><strong>53—57</strong></div><div><small>POS</small><strong>{position}</strong></div><div><small>FOOT</small><strong>{foot === "left" ? "L" : "R"}</strong></div></div>
                <div className="trajectory-odds">
                  <div className="trajectory-odds__heading"><span>{tx(UI.hiddenTrajectory)}</span><strong>100%</strong></div>
                  <div className="trajectory-odds__chips">
                    {DEVELOPMENT_ORDER.map((path) => <span key={path}><b>{DEVELOPMENT_PROFILES[path].chance}%</b>{tx(DEVELOPMENT_PROFILES[path].label)}</span>)}
                  </div>
                  <p>{tx(UI.trajectoryOdds)}</p>
                </div>
              </div>
              <div className="position-panel panel">
                <div className="panel-title"><span>{tx(UI.position)}</span><strong>{position} · {tx(POSITION_LABELS[position])}</strong></div>
                <div className="role-grid">{POSITIONS.map((item) => <button type="button" key={item} className={position === item ? "role-button is-active" : "role-button"} aria-pressed={position === item} onClick={() => setPosition(item)}><strong>{item}</strong><span>{tx(POSITION_LABELS[item])}</span></button>)}</div>
                <button className="button button--primary button--full" type="button" onClick={startCareer}>{tx(UI.generate)} <span aria-hidden="true">↗</span></button>
              </div>
            </div>
          </section>
        )}

        {phase === "scouting" && (
          <section className="page-section scouting" role="status" aria-live="polite">
            <span className="eyebrow">{tx(UI.scoutingNetwork)}</span><h1>{tx(UI.scouts)}</h1>
            <div className="skeleton-grid">{[0, 1, 2].map((item) => <div className="skeleton-card" key={item}><Skeleton circle width={64} height={64} baseColor="#18231f" highlightColor="#2d3a34" /><Skeleton height={26} baseColor="#18231f" highlightColor="#2d3a34" /><Skeleton count={3} baseColor="#18231f" highlightColor="#2d3a34" /></div>)}</div>
          </section>
        )}

        {phase === "market" && career && (
          <section className="page-section market">
            <div className="section-heading section-heading--row"><div><span className="eyebrow">{tx(UI.marketEyebrow)}</span><h1>{initialMarket ? tx(UI.marketTitle) : `${tx(UI.marketTitle)} · ${age}`}</h1><p>{tx(UI.marketBody)}</p></div><div className="market-player"><span>OVR</span><strong>{Math.round(career.ovr)}</strong><small>{career.name} · {career.position}</small></div></div>
            <div className="market-swipe-hint"><span>{tx(UI.offerCount)}</span><b aria-hidden="true">→</b></div>
            <div className="offer-grid">{offers.map((offer) => {
              const club = CLUBS.find((item) => item.id === offer.clubId)!;
              const isRenewal = career.currentClubId === club.id;
              const chance = counterChance(offer, counterRaise);
              return <article className="offer-card" key={offer.id}>
                <div className="offer-card__head"><span className="offer-type">{isRenewal ? tx(UI.currentClub) : tx(UI.newClub)}</span><ClubCrest club={club} size="lg" /><span className="country-code">{club.country}</span></div>
                <div className="offer-badges">{!initialMarket && !career.clubsSeen.includes(club.id) && <span className="offer-badge offer-badge--new">＋ {tx(UI.newDestination)}</span>}{offer.annualSalary === highestSalary && <span className="offer-badge">€ · {tx(UI.bestSalary)}</span>}{offer.expectedMinutes === highestMinutes && <span className="offer-badge offer-badge--minutes">▶ · {tx(UI.bestMinutes)}</span>}</div>
                <div className="offer-card__club"><h2>{club.name}</h2><p>{club.league} · {tx(club.style)}</p></div>
                <dl className="terms"><div><dt>{tx(UI.salary)}</dt><dd>{formatMoney(offer.annualSalary, locale)}</dd></div><div><dt>{tx(UI.minutes)}</dt><dd>{formatNumber(offer.expectedMinutes, locale)}&apos;</dd></div><div><dt>{tx(UI.squadRole)}</dt><dd>{statusForMinutes(offer.expectedMinutes, locale)}</dd></div><div><dt>{tx(UI.contract)}</dt><dd>{offer.semesters / 2} {tx(UI.years)}</dd></div></dl>
                {counterStatus[offer.id] && <p className="notice notice--danger" role="status">{tx(UI.counterRejected)}</p>}
                {counterOpen === offer.id && !counterStatus[offer.id] && <div className="counter-box"><strong>{tx(UI.counterTitle)}</strong><div className="counter-options">{[5, 10, 20].map((raise) => <button key={raise} type="button" className={counterRaise === raise ? "is-active" : ""} aria-pressed={counterRaise === raise} onClick={() => setCounterRaise(raise)}>+{raise}%</button>)}</div><div className="counter-result"><span>{formatMoney(roundMoney(offer.annualSalary * (1 + counterRaise / 100)), locale)}</span><strong>{chance}%</strong><small>{tx(UI.acceptance)}</small></div><button className="button button--lime button--full" type="button" onClick={() => submitCounter(offer)}>{tx(UI.sendCounter)} · {chance}%</button></div>}
                <div className="offer-actions"><button className="button button--primary" type="button" onClick={() => acceptOffer(offer)}>{tx(UI.accept)}</button><button className="button button--ghost" type="button" disabled={Boolean(counterStatus[offer.id])} onClick={() => { setCounterRaise(10); setCounterOpen(counterOpen === offer.id ? null : offer.id); }}>{tx(UI.counter)}</button></div>
              </article>;
            })}</div>
          </section>
        )}

        {phase === "sponsor" && career && (
          <section className="page-section sponsors">
            <div className="section-heading"><span className="eyebrow">{tx(UI.sponsorEyebrow)}</span><h1>{tx(UI.sponsorTitle)}</h1><p>{tx(UI.sponsorBody)}</p></div>
            <div className="sponsor-grid">{sponsorOffers.map((sponsor) => <article className="sponsor-card" key={sponsor.id} style={{ "--sponsor-a": sponsor.colors[0], "--sponsor-b": sponsor.colors[1] } as CSSProperties}><div className="sponsor-badges">{sponsor.pay === highestSponsorPay && <span className="sponsor-badge">€ · {tx(UI.richestSponsor)}</span>}{sponsor.term === longestSponsorTerm && <span className="sponsor-badge">⌛ · {tx(UI.longestSponsor)}</span>}</div><div className="sponsor-logo"><span className="sponsor-logo__mark"><Image src={sponsor.logo} alt="" width={88} height={48} unoptimized /></span><strong>{sponsor.name}</strong><small>{tx(sponsor.sector)}</small></div><p>{tx(sponsor.pitch)}</p><dl><div><dt>{tx(UI.signing)}</dt><dd>{formatMoney(sponsor.signing, locale)}</dd></div><div><dt>{tx(UI.semesterPay)}</dt><dd>{formatMoney(sponsor.pay, locale)}</dd></div><div><dt>{tx(UI.duration)}</dt><dd>{sponsor.term} {tx(UI.semesters)}</dd></div></dl><button className="button button--light button--full" type="button" onClick={() => signSponsor(sponsor)}>{tx(UI.chooseSponsor)} <span aria-hidden="true">↗</span></button></article>)}</div>
            <button className="text-button" type="button" onClick={() => signSponsor()}>{tx(UI.noSponsor)} →</button>
          </section>
        )}

        {phase === "career" && career && currentClub && (
          <section className="page-section career">
            <div className="career-topline"><span className="eyebrow">{tx(UI.careerEyebrow)}</span><span>{String(career.semester).padStart(2, "0")}/48 · {progress}%</span></div>
            <div className="career-grid">
              <aside className="player-card panel">
                <div className="player-card__club"><ClubCrest club={currentClub} size="lg" /><div><span>{currentClub.code}</span><strong>{currentClub.name}</strong><small>{currentClub.league}</small></div></div>
                <div className="player-card__identity"><div className="overall-disc"><span>OVR</span><strong key={Math.round(career.ovr)} className="stat-pop">{Math.round(career.ovr)}</strong></div><div><h1>{career.name}</h1><p>{nationalityFor(career.nationality, locale)} · {career.position}{career.secondaryPosition ? ` / ${career.secondaryPosition}` : ""}</p></div></div>
                <div className={`trajectory-badge ${career.developmentRevealed ? `trajectory-badge--${career.developmentPath}` : "trajectory-badge--hidden"}`}>
                  <div><small>{tx(UI.trajectory)}</small><strong>{career.developmentRevealed ? tx(DEVELOPMENT_PROFILES[career.developmentPath].label) : tx(UI.trajectoryUnknown)}</strong></div>
                  {career.phenomenonReached && <b>{tx(UI.phenomenon)}</b>}
                </div>
                <div className="metric-pair"><div><span>{tx(UI.age)}</span><strong>{age}</strong></div><div><span>{tx(UI.balance)}</span><strong>{formatMoney(career.cash, locale)}</strong></div></div>
                <div className="meters"><Meter label={tx(UI.form)} value={career.form} accent /><Meter label={tx(UI.morale)} value={career.morale} /><Meter label={tx(UI.health)} value={career.health} /><Meter label={tx(UI.reputation)} value={career.reputation} /><Meter label={tx(UI.integrity)} value={career.integrity} /></div>
                <div className="contract-strip"><div><span>{tx(UI.salary)}</span><strong>{formatMoney(career.contract!.annualSalary, locale)}</strong></div><div><span>{tx(UI.minutes)}</span><strong>{formatNumber(career.contract!.expectedMinutes, locale)}&apos;</strong></div></div>
                {career.ban > 0 && <div className="ban-alert">{tx(UI.banned)} · {career.ban} {tx(UI.semesters)}</div>}
                {career.injury > 0 && <div className="ban-alert">{tx(UI.injured)} · {career.injury} {tx(UI.semesters)}</div>}
              </aside>
              <div className="career-main">
                <article className="next-card">
                  <div className="next-card__date"><span>{nextYear}</span><strong>{nextHalf === 1 ? "I" : "II"}</strong><small>{tx(UI.nextSemester)}</small></div>
                  <div className="next-card__copy"><h2>{currentClub.code} · {statusForMinutes(career.contract!.expectedMinutes, locale)}</h2><p>{tx(UI.quickHint)}</p>{currentSponsor ? <div className="active-sponsor"><span><Image src={currentSponsor.logo} alt="" width={52} height={24} unoptimized /></span><small>{tx(UI.sponsor)}</small><strong>{currentSponsor.name}</strong><b>+{formatMoney(currentSponsor.pay, locale)}</b></div> : <div className="active-sponsor"><span /><small>{tx(UI.sponsor)}</small><strong>—</strong></div>}</div>
                  <div className="next-card__actions"><button className="button button--lime button--large" type="button" disabled={isSimulating} onClick={() => advanceCareer(4)}>{isSimulating ? tx(UI.sprinting) : tx(UI.sprint)} <span aria-hidden="true">▶▶</span></button><button className="button button--ghost" type="button" disabled={isSimulating} onClick={() => advanceCareer(1)}>{tx(UI.playSemester)} <span aria-hidden="true">▶</span></button>{isSimulating && <span className="sprint-status" role="status">{tx(UI.sprinting)}</span>}</div>
                </article>
                <article className={`trajectory-strip ${career.momentum >= 0.55 ? "trajectory-strip--hot" : career.momentum <= -0.45 ? "trajectory-strip--cold" : ""}`} aria-label={`${tx(UI.recentGrowth)}: ${growthLastThree >= 0 ? "+" : ""}${growthLastThree.toFixed(1)} OVR`}>
                  <div className="trajectory-strip__metric"><small>{tx(UI.recentGrowth)}</small><strong>{growthLastThree >= 0 ? "+" : ""}{growthLastThree.toFixed(1)} OVR</strong></div>
                  <div className="trajectory-strip__bars" aria-hidden="true">
                    {career.history.length === 0
                      ? [0, 1, 2, 3, 4, 5].map((item) => <i className="is-empty" key={item} />)
                      : career.history.slice(-6).map((record) => <i className={record.ovrDelta < 0 ? "is-negative" : ""} key={record.index} style={{ height: `${clamp(16 + record.ovrDelta * 18, 5, 48)}px` }} />)}
                  </div>
                  <div className="trajectory-strip__metric trajectory-strip__metric--end"><small>{tx(UI.trajectory)}</small><strong>{momentumLabel(career.momentum, locale)}</strong></div>
                </article>
                <div className="report-grid">
                  <article className="report-card panel" key={latestRecord?.index ?? 0}><div className="panel-title"><span>{tx(UI.seasonReport)}</span>{latestRecord && <strong>{latestRecord.year} · {latestRecord.half === 1 ? "I" : "II"}</strong>}</div>{!latestRecord ? <p className="empty-copy">{tx(UI.noReport)}</p> : <>{(latestRecord.breakthrough || latestRecord.phenomenon) && <div className={`breakthrough-banner ${latestRecord.phenomenon ? "breakthrough-banner--phenomenon" : ""}`}><small>{latestRecord.phenomenon ? tx(UI.phenomenon) : tx(UI.arcDiscovered)}</small><strong>{latestRecord.breakthrough ? tx(DEVELOPMENT_PROFILES[latestRecord.breakthrough].label) : tx(UI.phenomenon)}</strong><p>{latestRecord.phenomenon ? tx(UI.phenomenonBody) : tx(DEVELOPMENT_PROFILES[latestRecord.breakthrough!].description)}</p></div>}<div className="report-stats"><div><strong>{latestRecord.appearances}</strong><span>{tx(UI.apps)}</span></div><div><strong>{latestRecord.goals}</strong><span>{tx(UI.goals)}</span></div><div><strong>{latestRecord.assists}</strong><span>{tx(UI.assists)}</span></div><div><strong>{latestRecord.rating.toFixed(1)}</strong><span>{tx(UI.rating)}</span></div></div><div className="report-footer"><span>{formatNumber(latestRecord.minutes, locale)}&apos;</span><strong className={latestRecord.ovrDelta >= 0 ? "positive" : "negative"}>{latestRecord.ovrDelta >= 0 ? "+" : ""}{latestRecord.ovrDelta.toFixed(1)} OVR</strong>{latestRecord.developmentSignal && <b className={latestRecord.developmentSignal === "surge" ? "growth-signal" : "growth-signal growth-signal--dip"}>{latestRecord.developmentSignal === "surge" ? `↗ ${tx(UI.growthSpike)}` : `↘ ${tx(UI.growthDip)}`}</b>}{latestRecord.trophy && <b>◆ {tx(UI.trophies)}</b>}</div></>}</article>
                  <article className="timeline-card panel"><div className="panel-title"><span>{tx(UI.timeline)}</span><strong>{career.history.length}/48</strong></div><ol>{career.history.slice(-5).reverse().map((record) => { const club = CLUBS.find((item) => item.id === record.clubId)!; return <li key={record.index}><span>{String(record.index).padStart(2, "0")}</span><ClubCrest club={club} size="sm" /><div><strong>{club.code}</strong><small>{record.year} · {record.half === 1 ? "I" : "II"}</small></div><b>{record.rating.toFixed(1)}</b></li>; })}</ol></article>
                </div>
              </div>
            </div>
          </section>
        )}

        {phase === "event" && career && currentEvent && (
          <section className={`page-section event-page event-page--${currentEvent.category}`}>
            <div className="event-rail"><span>{tx(UI.eventEyebrow)}</span><strong>{String(career.semester).padStart(2, "0")}/48</strong></div>
            <div className="event-content">
              <div className="event-heading"><span className="eyebrow">{tx(EVENT_CATEGORY_LABELS[currentEvent.category])}</span><h1>{eventResult ? tx(UI.outcome) : tx(currentEvent.title)}</h1><p>{eventResult ? tx(eventResult.text) : tx(currentEvent.body)}</p></div>
              {!eventResult ? <div className="choice-grid">{currentEvent.choices.map((choice) => <button className="choice-card" type="button" key={choice.id} onClick={() => resolveEvent(choice)}><span className="choice-card__label">{tx(choice.label)} <b aria-hidden="true">↗</b></span><span className="choice-card__outcomes"><small>{tx(UI.possibleOutcomes)}</small>{choice.outcomes.map((outcome) => <span key={`${choice.id}-${outcome.p}-${outcome.text.it}`}><strong>{outcome.p}%</strong>{tx(outcome.text)}</span>)}</span></button>)}</div> : <div className={`outcome-card outcome-card--${eventResult.tone}`} role="status"><span>{eventResult.tone === "good" ? "↑" : eventResult.tone === "bad" ? "↓" : "→"}</span><h2>{tx(eventResult.text)}</h2><div className="outcome-metrics"><b>OVR {Math.round(career.ovr)}</b><b>{tx(UI.reputation)} {Math.round(career.reputation)}</b><b>{tx(UI.integrity)} {Math.round(career.integrity)}</b></div><button className="button button--light button--large" type="button" onClick={continueAfterEvent}>{tx(UI.continue)} <span aria-hidden="true">↗</span></button></div>}
            </div>
            <p className="event-note">{tx(UI.safePlay)}</p>
          </section>
        )}

        {phase === "summary" && career && (
          <section className="page-section summary">
            <div className="summary-hero"><span className="eyebrow">{tx(UI.summaryEyebrow)}</span><h1>{legacyFor(career, locale)}</h1><p>{career.name} · {career.position} · {nationalityFor(career.nationality, locale)}</p><div className="summary-trajectory"><span>{tx(UI.trajectory)}</span><strong>{tx(DEVELOPMENT_PROFILES[career.developmentPath].label)}</strong><b>{career.breakthroughs} · {tx(UI.breakthroughs)}</b></div><div className="legacy-score"><span>LEGACY</span><strong>{Math.round(clamp(career.peakOvr * 2 + career.totals.appearances * 0.2 + career.totals.trophies * 18 + career.reputation * 0.7 + career.integrity * 0.35, 0, 999))}</strong><small>/999</small></div></div>
            <div className="summary-stats"><div><span>{tx(UI.apps)}</span><strong>{formatNumber(career.totals.appearances, locale)}</strong></div><div><span>{tx(UI.totalMinutes)}</span><strong>{formatNumber(career.totals.minutes, locale)}</strong></div><div><span>{tx(UI.goals)}</span><strong>{formatNumber(career.totals.goals, locale)}</strong></div><div><span>{tx(UI.assists)}</span><strong>{formatNumber(career.totals.assists, locale)}</strong></div><div><span>{tx(UI.trophies)}</span><strong>{career.totals.trophies}</strong></div><div><span>{tx(UI.peak)}</span><strong>{Math.round(career.peakOvr)}</strong></div><div><span>{tx(UI.earnings)}</span><strong>{formatMoney(career.totals.earnings, locale)}</strong></div><div><span>{tx(UI.clubs)}</span><strong>{career.clubsSeen.length}</strong></div></div>
            <div className="summary-grid"><article className="summary-clubs panel"><div className="panel-title"><span>{tx(UI.clubs)}</span><strong>{career.clubsSeen.length}</strong></div><div className="crest-row">{career.clubsSeen.map((clubId) => { const club = CLUBS.find((item) => item.id === clubId)!; return <div key={clubId}><ClubCrest club={club} size="md" /><span>{club.code}</span></div>; })}</div></article><article className="summary-decisions panel"><div className="panel-title"><span>{tx(UI.decisiveChoices)}</span><strong>{career.decisions.length}</strong></div>{career.decisions.length === 0 ? <p className="empty-copy">—</p> : <ol>{career.decisions.slice(-4).reverse().map((decision, index) => <li key={`${decision.title.it}-${index}`}><span className={`decision-dot decision-dot--${decision.tone}`} /><div><strong>{tx(decision.title)}</strong><p>{tx(decision.result)}</p></div></li>)}</ol>}</article></div>
            <div className="summary-actions"><button className="button button--light button--large" type="button" onClick={copySummary}>{tx(UI.copySummary)}</button><button className="button button--ghost button--large" type="button" onClick={restart}>{tx(UI.newCareer)}</button></div>
          </section>
        )}
      </main>

      {semesterToast && <div className={`semester-toast ${semesterToast.ovrDelta >= 0 ? "semester-toast--positive" : "semester-toast--negative"}`} aria-hidden="true"><small>{semesterToast.count > 1 ? `SPRINT ×${semesterToast.count}` : `SEMESTRE ${String(semesterToast.record.index).padStart(2, "0")}`}</small><strong>{semesterToast.rating.toFixed(1)}</strong><span>{semesterToast.ovrDelta >= 0 ? "+" : ""}{semesterToast.ovrDelta.toFixed(1)} OVR</span><b>{semesterToast.appearances} {tx(UI.apps)} · {semesterToast.goals} {tx(UI.goals)} · {semesterToast.assists} {tx(UI.assists)}</b>{(semesterToast.breakthrough || semesterToast.phenomenon) && <em>{semesterToast.phenomenon ? tx(UI.phenomenon) : `${tx(UI.arcDiscovered)} · ${tx(DEVELOPMENT_PROFILES[semesterToast.breakthrough!].label)}`}</em>}</div>}

      <footer className="site-footer"><div><span className="brand__mark">XI</span><strong>LINEA</strong></div><p>{tx(UI.fictional)}</p><span>© 2026 LINEA XI</span></footer>
      <div className="sr-live" aria-live="polite" aria-atomic="true">{liveMessage}</div>
    </div>
  );
}
