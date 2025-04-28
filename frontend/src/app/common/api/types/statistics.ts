
export interface StudyHistory {
  date: string;
  cardsStudied: number;
}

export interface Performance {
  correct: number;
  incorrect: number;
}

export interface DeckPerformance {
  deckName: string;
  cardsStudied: number;
  accuracy: number;
}

export interface StatisticsData {
  accuracyRate: number;
  studyStreak: number;
  totalCards: number;
  correctCards: number;
  incorrectCards: number;
  performance: Performance;
  studyHistory: StudyHistory[];
  deckPerformance: DeckPerformance[];
}