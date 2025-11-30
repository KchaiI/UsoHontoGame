/**
 * Japanese Translations
 * Feature: 008-i18n-support
 */

import type { Translations } from '../types';

export const ja: Translations = {
  common: {
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    create: '作成',
    back: '戻る',
    next: '次へ',
    loading: '読み込み中...',
    submit: '送信',
    close: '閉じる',
    confirm: '確認',
    yes: 'はい',
    no: 'いいえ',
  },

  navigation: {
    home: 'ホーム',
    games: 'ゲーム',
    gameList: 'ゲーム一覧',
    createGame: 'ゲーム作成',
    settings: '設定',
    language: '言語',
  },

  game: {
    title: 'ウソホントゲーム',
    createGame: 'ゲームを作成',
    editGame: 'ゲームを編集',
    deleteGame: 'ゲームを削除',
    playerLimit: 'プレイヤー上限',
    playerLimitDescription: 'ゲームに参加できる最大人数',
    status: {
      preparing: '準備中',
      active: '出題中',
      closed: '締切',
    },
    presenter: 'プレゼンター',
    presenters: 'プレゼンター',
    episode: 'エピソード',
    episodes: 'エピソード',
    truth: '本当',
    lie: 'ウソ',
    noGames: 'ゲームがありません',
    gameNotFound: 'ゲームが見つかりません',
    startGame: 'ゲーム開始',
    endGame: 'ゲーム終了',
    activeGames: '出題中のゲーム',
    gameManagement: 'ゲーム管理',
    gameManagementDescription: '作成したゲームの一覧を確認・管理できます',
    newGame: '新しいゲームを作成',
    gameDetails: 'ゲーム詳細',
    gameTitle: 'ゲームタイトル',
    createdAt: '作成日時',
    players: 'プレイヤー',
  },

  session: {
    nickname: 'ニックネーム',
    enterNickname: 'ニックネームを入力',
    join: '参加',
    leave: '退出',
    participants: '参加者',
    noParticipants: '参加者がいません',
    welcome: 'ようこそ',
  },

  answer: {
    submitAnswer: '回答を送信',
    selectLie: 'ウソを選択してください',
    yourAnswer: 'あなたの回答',
    correct: '正解',
    incorrect: '不正解',
    alreadySubmitted: 'すでに回答済みです',
    answerSubmitted: '回答を送信しました',
  },

  results: {
    results: '結果',
    score: 'スコア',
    ranking: 'ランキング',
    winner: '優勝',
    points: 'ポイント',
    correctAnswers: '正解数',
    totalQuestions: '全問題数',
  },

  errors: {
    required: '必須項目です',
    invalid: '無効な値です',
    notFound: '見つかりませんでした',
    serverError: 'サーバーエラーが発生しました',
    networkError: 'ネットワークエラーが発生しました',
    unauthorized: '認証が必要です',
    forbidden: 'アクセスが拒否されました',
    validationFailed: '入力内容に誤りがあります',
    unexpectedError: '予期しないエラーが発生しました',
  },

  messages: {
    saved: '保存しました',
    deleted: '削除しました',
    created: '作成しました',
    updated: '更新しました',
    copied: 'コピーしました',
    success: '成功しました',
  },

  emptyState: {
    noData: 'データがありません',
    noResults: '結果がありません',
    noGamesFound: 'ゲームが見つかりませんでした',
    noActiveGames: '現在、出題中のゲームはありません',
    waitForGames: '新しいゲームが開始されるまでお待ちください',
  },
};
