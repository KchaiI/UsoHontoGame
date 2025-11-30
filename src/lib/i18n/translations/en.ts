/**
 * English Translations
 * Feature: 008-i18n-support
 */

import type { Translations } from '../types';

export const en: Translations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    submit: 'Submit',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
  },

  navigation: {
    home: 'Home',
    games: 'Games',
    gameList: 'Game List',
    createGame: 'Create Game',
    settings: 'Settings',
    language: 'Language',
  },

  game: {
    title: 'Two Truths and a Lie',
    createGame: 'Create Game',
    editGame: 'Edit Game',
    deleteGame: 'Delete Game',
    playerLimit: 'Player Limit',
    playerLimitDescription: 'Maximum number of players allowed in the game',
    status: {
      preparing: 'Preparing',
      active: 'Active',
      closed: 'Closed',
    },
    presenter: 'Presenter',
    presenters: 'Presenters',
    episode: 'Episode',
    episodes: 'Episodes',
    truth: 'Truth',
    lie: 'Lie',
    noGames: 'No games',
    gameNotFound: 'Game not found',
    startGame: 'Start Game',
    endGame: 'End Game',
    activeGames: 'Active Games',
    gameManagement: 'Game Management',
    gameManagementDescription: 'View and manage your created games',
    newGame: 'Create New Game',
    gameDetails: 'Game Details',
    gameTitle: 'Game Title',
    createdAt: 'Created At',
    players: 'Players',
  },

  session: {
    nickname: 'Nickname',
    enterNickname: 'Enter nickname',
    join: 'Join',
    leave: 'Leave',
    participants: 'Participants',
    noParticipants: 'No participants',
    welcome: 'Welcome',
  },

  answer: {
    submitAnswer: 'Submit Answer',
    selectLie: 'Select the lie',
    yourAnswer: 'Your Answer',
    correct: 'Correct',
    incorrect: 'Incorrect',
    alreadySubmitted: 'Already submitted',
    answerSubmitted: 'Answer submitted',
  },

  results: {
    results: 'Results',
    score: 'Score',
    ranking: 'Ranking',
    winner: 'Winner',
    points: 'Points',
    correctAnswers: 'Correct Answers',
    totalQuestions: 'Total Questions',
  },

  errors: {
    required: 'This field is required',
    invalid: 'Invalid value',
    notFound: 'Not found',
    serverError: 'Server error occurred',
    networkError: 'Network error occurred',
    unauthorized: 'Authentication required',
    forbidden: 'Access denied',
    validationFailed: 'Validation failed',
    unexpectedError: 'Unexpected error occurred',
  },

  messages: {
    saved: 'Saved',
    deleted: 'Deleted',
    created: 'Created',
    updated: 'Updated',
    copied: 'Copied',
    success: 'Success',
  },

  emptyState: {
    noData: 'No data',
    noResults: 'No results',
    noGamesFound: 'No games found',
    noActiveGames: 'No active games at the moment',
    waitForGames: 'Please wait for new games to start',
  },
};
