import type { StatisticsData } from "../api/types/statistics";

export const mockStatisticsData: StatisticsData = {
  accuracyRate: 83.3,
  studyStreak: 7,
  totalCards: 390,
  correctCards: 395,
  incorrectCards: 65,
  performance: {
    correct: 85,
    incorrect: 15,
  },
  studyHistory: [
    { date: '15/04', cardsStudied: 15 },
    { date: '16/04', cardsStudied: 30 },
    { date: '17/04', cardsStudied: 10 },
    { date: '18/04', cardsStudied: 45 },
    { date: '19/04', cardsStudied: 20 },
    { date: '20/04', cardsStudied: 60 },
    { date: '21/04', cardsStudied: 30 },
  ],
  deckPerformance: [
    { deckName: 'Matemática', cardsStudied: 100, accuracy: 85 },
    { deckName: 'História', cardsStudied: 80, accuracy: 87 },
    { deckName: 'Geografia', cardsStudied: 50, accuracy: 90 },
    { deckName: 'Inglês', cardsStudied: 90, accuracy: 78 },
    { deckName: 'Ciências', cardsStudied: 60, accuracy: 92 },
  ],
};