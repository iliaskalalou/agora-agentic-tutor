import type { CurriculumTree, CurriculumSubject } from "../../shared/types";

// ---------------------------------------------------------------------------
// French school curriculum tree: Cursus (college / lycee) -> Subject -> Category.
// Subject names and category names are in French and follow the official
// programmes (Eduscol). Subject ids are kebab-case and STABLE: the same id and
// color are reused for the same subject across both cursus, so the UI can keep
// a consistent identity when a learner moves from college to lycee.
// ---------------------------------------------------------------------------

const COLLEGE: CurriculumSubject[] = [
  {
    id: "mathematiques",
    name: "Mathematics",
    color: "#4f46e5",
    categories: [
      { id: "nombres-et-calculs", name: "Numbers & operations" },
      { id: "fractions", name: "Fractions" },
      { id: "geometrie", name: "Geometry" },
      { id: "proportionnalite", name: "Proportionality" },
      { id: "statistiques-probabilites", name: "Statistics & probability" },
      { id: "equations", name: "Equations" },
      { id: "fonctions", name: "Functions" },
    ],
  },
  {
    id: "francais",
    name: "French",
    color: "#e11d48",
    categories: [
      { id: "grammaire", name: "Grammar" },
      { id: "conjugaison", name: "Conjugation" },
      { id: "orthographe", name: "Spelling" },
      { id: "lecture", name: "Reading & text analysis" },
      { id: "expression-ecrite", name: "Writing" },
      { id: "vocabulaire", name: "Vocabulary" },
    ],
  },
  {
    id: "histoire-geo",
    name: "History & Geography",
    color: "#d97706",
    categories: [
      { id: "moyen-age", name: "The Middle Ages" },
      { id: "temps-modernes", name: "The Early Modern period" },
      { id: "revolution-francaise", name: "The French Revolution and the Empire" },
      { id: "xixe-xxe-siecle", name: "The 19th and 20th centuries" },
      { id: "habiter-les-territoires", name: "Living in territories" },
      { id: "mondialisation", name: "Globalization" },
      { id: "education-civique", name: "Moral and civic education" },
    ],
  },
  {
    id: "svt",
    name: "Biology (Life & Earth Sciences)",
    color: "#059669",
    categories: [
      { id: "le-vivant", name: "Living things and their evolution" },
      { id: "corps-humain-sante", name: "The human body and health" },
      { id: "planete-terre", name: "Planet Earth and the environment" },
      { id: "reproduction", name: "Reproduction and heredity" },
      { id: "ecosystemes", name: "Ecosystems and biodiversity" },
    ],
  },
  {
    id: "physique-chimie",
    name: "Physics & Chemistry",
    color: "#0284c7",
    categories: [
      { id: "matiere", name: "Organization and transformations of matter" },
      { id: "mouvement-interactions", name: "Motion and interactions" },
      { id: "energie", name: "Energy and its conversions" },
      { id: "signaux", name: "Signals for observing and communicating" },
      { id: "electricite", name: "Electricity" },
    ],
  },
  {
    id: "anglais",
    name: "English",
    color: "#7c3aed",
    categories: [
      { id: "grammaire", name: "Grammar" },
      { id: "vocabulaire", name: "Vocabulary" },
      { id: "comprehension-orale", name: "Listening comprehension" },
      { id: "comprehension-ecrite", name: "Reading comprehension" },
      { id: "expression", name: "Speaking and writing" },
      { id: "civilisation", name: "Culture of the English-speaking world" },
    ],
  },
  {
    id: "technologie",
    name: "Technology",
    color: "#0891b2",
    categories: [
      { id: "objets-techniques", name: "Designing and building technical objects" },
      { id: "materiaux", name: "Materials and properties" },
      { id: "informatique-programmation", name: "Computing and programming" },
      { id: "reseaux", name: "Networks and connected objects" },
      { id: "design-modelisation", name: "Design and 3D modeling" },
    ],
  },
];

const LYCEE: CurriculumSubject[] = [
  {
    id: "mathematiques",
    name: "Mathematics",
    color: "#4f46e5",
    categories: [
      { id: "suites", name: "Numerical sequences" },
      { id: "fonctions", name: "Functions and the study of variations" },
      { id: "derivation", name: "Differentiation" },
      { id: "probabilites", name: "Probability" },
      { id: "geometrie-vecteurs", name: "Geometry and vectors" },
      { id: "trigonometrie", name: "Trigonometry" },
      { id: "logarithme-exponentielle", name: "Logarithms and exponentials" },
    ],
  },
  {
    id: "francais",
    name: "French",
    color: "#e11d48",
    categories: [
      { id: "commentaire", name: "Text commentary" },
      { id: "dissertation", name: "Essay writing" },
      { id: "poesie", name: "Poetry" },
      { id: "roman", name: "The novel and narrative" },
      { id: "theatre", name: "Theater" },
      { id: "litterature-idees", name: "The literature of ideas" },
    ],
  },
  {
    id: "histoire-geo",
    name: "History & Geography",
    color: "#d97706",
    categories: [
      { id: "revolutions-empires", name: "Revolutions, liberties and nations (19th century)" },
      { id: "guerres-mondiales", name: "The two world wars" },
      { id: "guerre-froide", name: "The Cold War and the bipolar world" },
      { id: "monde-actuel", name: "The world since 1990" },
      { id: "mers-oceans", name: "Seas and oceans: a maritime world" },
      { id: "dynamiques-territoriales", name: "Territorial dynamics and globalization" },
    ],
  },
  {
    id: "svt",
    name: "Biology",
    color: "#059669",
    categories: [
      { id: "genetique-evolution", name: "Genetics and evolution" },
      { id: "geologie-tectonique", name: "Geology and plate tectonics" },
      { id: "corps-humain-sante", name: "The human body and health" },
      { id: "ecologie-climat", name: "Ecology and climate issues" },
      { id: "immunologie", name: "Immunology" },
      { id: "neurobiologie", name: "Neurobiology" },
    ],
  },
  {
    id: "physique-chimie",
    name: "Physics & Chemistry",
    color: "#0284c7",
    categories: [
      { id: "constitution-matiere", name: "Composition and transformations of matter" },
      { id: "mouvement-mecanique", name: "Motion and Newtonian mechanics" },
      { id: "energie", name: "Energy: conversions and transfers" },
      { id: "ondes-signaux", name: "Waves and signals" },
      { id: "chimie-organique", name: "Organic chemistry" },
      { id: "electricite-circuits", name: "Electricity and circuits" },
    ],
  },
  {
    id: "anglais",
    name: "English",
    color: "#7c3aed",
    categories: [
      { id: "grammaire-avancee", name: "Advanced grammar" },
      { id: "comprehension-orale", name: "Listening comprehension" },
      { id: "comprehension-ecrite", name: "Reading comprehension" },
      { id: "expression", name: "Speaking and writing" },
      { id: "civilisation", name: "Culture of the English-speaking world" },
      { id: "litterature", name: "English-language literature" },
    ],
  },
  {
    id: "philosophie",
    name: "Philosophy",
    color: "#be123c",
    categories: [
      { id: "conscience-inconscient", name: "Consciousness and the unconscious" },
      { id: "liberte", name: "Freedom" },
      { id: "verite-raison", name: "Truth and reason" },
      { id: "justice-droit", name: "Justice and law" },
      { id: "etat-politique", name: "The state and politics" },
      { id: "art-technique", name: "Art and technology" },
      { id: "bonheur-morale", name: "Happiness and morality" },
    ],
  },
];

export const CURRICULUM: CurriculumTree = {
  college: COLLEGE,
  lycee: LYCEE,
};

// --------------------------------- Helpers ----------------------------------

/** Find a subject by id within a cursus, or undefined if it does not exist. */
export function findSubject(
  cursus: "college" | "lycee",
  subjectId: string,
): CurriculumSubject | undefined {
  return CURRICULUM[cursus].find((subject) => subject.id === subjectId);
}

/** Resolve a category's display name from cursus + subject + category ids. */
export function findCategoryName(
  cursus: "college" | "lycee",
  subjectId: string,
  categoryId: string,
): string | undefined {
  const subject = findSubject(cursus, subjectId);
  return subject?.categories.find((category) => category.id === categoryId)?.name;
}
