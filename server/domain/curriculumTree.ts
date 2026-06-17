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
    name: "Mathématiques",
    color: "#4f46e5",
    categories: [
      { id: "nombres-et-calculs", name: "Nombres et calculs" },
      { id: "fractions", name: "Fractions" },
      { id: "geometrie", name: "Géométrie" },
      { id: "proportionnalite", name: "Proportionnalité" },
      { id: "statistiques-probabilites", name: "Statistiques et probabilités" },
      { id: "equations", name: "Équations" },
      { id: "fonctions", name: "Fonctions" },
    ],
  },
  {
    id: "francais",
    name: "Français",
    color: "#e11d48",
    categories: [
      { id: "grammaire", name: "Grammaire" },
      { id: "conjugaison", name: "Conjugaison" },
      { id: "orthographe", name: "Orthographe" },
      { id: "lecture", name: "Lecture et analyse de texte" },
      { id: "expression-ecrite", name: "Expression écrite" },
      { id: "vocabulaire", name: "Vocabulaire" },
    ],
  },
  {
    id: "histoire-geo",
    name: "Histoire-Géographie",
    color: "#d97706",
    categories: [
      { id: "moyen-age", name: "Le Moyen Âge" },
      { id: "temps-modernes", name: "Les Temps modernes" },
      { id: "revolution-francaise", name: "La Révolution française et l'Empire" },
      { id: "xixe-xxe-siecle", name: "Le XIXe et le XXe siècle" },
      { id: "habiter-les-territoires", name: "Habiter les territoires" },
      { id: "mondialisation", name: "La mondialisation" },
      { id: "education-civique", name: "Enseignement moral et civique" },
    ],
  },
  {
    id: "svt",
    name: "SVT (Sciences de la vie et de la Terre)",
    color: "#059669",
    categories: [
      { id: "le-vivant", name: "Le vivant et son évolution" },
      { id: "corps-humain-sante", name: "Le corps humain et la santé" },
      { id: "planete-terre", name: "La planète Terre et l'environnement" },
      { id: "reproduction", name: "Reproduction et hérédité" },
      { id: "ecosystemes", name: "Écosystèmes et biodiversité" },
    ],
  },
  {
    id: "physique-chimie",
    name: "Physique-Chimie",
    color: "#0284c7",
    categories: [
      { id: "matiere", name: "Organisation et transformations de la matière" },
      { id: "mouvement-interactions", name: "Mouvement et interactions" },
      { id: "energie", name: "L'énergie et ses conversions" },
      { id: "signaux", name: "Des signaux pour observer et communiquer" },
      { id: "electricite", name: "Électricité" },
    ],
  },
  {
    id: "anglais",
    name: "Anglais",
    color: "#7c3aed",
    categories: [
      { id: "grammaire", name: "Grammaire" },
      { id: "vocabulaire", name: "Vocabulaire" },
      { id: "comprehension-orale", name: "Compréhension orale" },
      { id: "comprehension-ecrite", name: "Compréhension écrite" },
      { id: "expression", name: "Expression orale et écrite" },
      { id: "civilisation", name: "Civilisation du monde anglophone" },
    ],
  },
  {
    id: "technologie",
    name: "Technologie",
    color: "#0891b2",
    categories: [
      { id: "objets-techniques", name: "Conception et fabrication d'objets techniques" },
      { id: "materiaux", name: "Matériaux et propriétés" },
      { id: "informatique-programmation", name: "Informatique et programmation" },
      { id: "reseaux", name: "Réseaux et objets connectés" },
      { id: "design-modelisation", name: "Design et modélisation 3D" },
    ],
  },
];

const LYCEE: CurriculumSubject[] = [
  {
    id: "mathematiques",
    name: "Mathématiques",
    color: "#4f46e5",
    categories: [
      { id: "suites", name: "Suites numériques" },
      { id: "fonctions", name: "Fonctions et étude de variations" },
      { id: "derivation", name: "Dérivation" },
      { id: "probabilites", name: "Probabilités" },
      { id: "geometrie-vecteurs", name: "Géométrie et vecteurs" },
      { id: "trigonometrie", name: "Trigonométrie" },
      { id: "logarithme-exponentielle", name: "Logarithme et exponentielle" },
    ],
  },
  {
    id: "francais",
    name: "Français",
    color: "#e11d48",
    categories: [
      { id: "commentaire", name: "Commentaire de texte" },
      { id: "dissertation", name: "Dissertation" },
      { id: "poesie", name: "La poésie" },
      { id: "roman", name: "Le roman et le récit" },
      { id: "theatre", name: "Le théâtre" },
      { id: "litterature-idees", name: "La littérature d'idées" },
    ],
  },
  {
    id: "histoire-geo",
    name: "Histoire-Géographie",
    color: "#d97706",
    categories: [
      { id: "revolutions-empires", name: "Révolutions, libertés et nations (XIXe siècle)" },
      { id: "guerres-mondiales", name: "Les deux guerres mondiales" },
      { id: "guerre-froide", name: "La guerre froide et le monde bipolaire" },
      { id: "monde-actuel", name: "Le monde depuis 1990" },
      { id: "mers-oceans", name: "Mers et océans : un monde maritimisé" },
      { id: "dynamiques-territoriales", name: "Dynamiques territoriales et mondialisation" },
    ],
  },
  {
    id: "svt",
    name: "SVT",
    color: "#059669",
    categories: [
      { id: "genetique-evolution", name: "Génétique et évolution" },
      { id: "geologie-tectonique", name: "Géologie et tectonique des plaques" },
      { id: "corps-humain-sante", name: "Le corps humain et la santé" },
      { id: "ecologie-climat", name: "Écologie et enjeux climatiques" },
      { id: "immunologie", name: "Immunologie" },
      { id: "neurobiologie", name: "Neurobiologie" },
    ],
  },
  {
    id: "physique-chimie",
    name: "Physique-Chimie",
    color: "#0284c7",
    categories: [
      { id: "constitution-matiere", name: "Constitution et transformations de la matière" },
      { id: "mouvement-mecanique", name: "Mouvement et mécanique de Newton" },
      { id: "energie", name: "Énergie : conversions et transferts" },
      { id: "ondes-signaux", name: "Ondes et signaux" },
      { id: "chimie-organique", name: "Chimie organique" },
      { id: "electricite-circuits", name: "Électricité et circuits" },
    ],
  },
  {
    id: "anglais",
    name: "Anglais",
    color: "#7c3aed",
    categories: [
      { id: "grammaire-avancee", name: "Grammaire avancée" },
      { id: "comprehension-orale", name: "Compréhension orale" },
      { id: "comprehension-ecrite", name: "Compréhension écrite" },
      { id: "expression", name: "Expression orale et écrite" },
      { id: "civilisation", name: "Civilisation du monde anglophone" },
      { id: "litterature", name: "Littérature anglophone" },
    ],
  },
  {
    id: "philosophie",
    name: "Philosophie",
    color: "#be123c",
    categories: [
      { id: "conscience-inconscient", name: "La conscience et l'inconscient" },
      { id: "liberte", name: "La liberté" },
      { id: "verite-raison", name: "La vérité et la raison" },
      { id: "justice-droit", name: "La justice et le droit" },
      { id: "etat-politique", name: "L'État et la politique" },
      { id: "art-technique", name: "L'art et la technique" },
      { id: "bonheur-morale", name: "Le bonheur et la morale" },
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
