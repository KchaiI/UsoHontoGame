# UsoHontoGame (ウソホント)

Next.js 16、React 19、SQLiteを使った真偽判定ゲーム。プレイヤーは3つのエピソードの中から嘘のエピソードを当てます。

## ドキュメント

| ドキュメント | 内容 |
|---|---|
| 📐 **[architecture.md](./architecture.md)** | アーキテクチャ設計・層構造・パターン・プロジェクト構造・DBスキーマ |
| 📝 **[challenge-problems.md](./challenge-problems.md)** | チャレンジ課題一覧 |

## クイックスタート

### 前提条件

- Node.js 20+
- npm

### インストールと起動

```bash
# リポジトリをクローン（または既存のディレクトリで）
npm install

# 環境変数を設定
echo "DATABASE_URL=\"file:./dev.db\"" > .env
echo "DATABASE_URL=\"file:$(pwd)/prisma/dev.db\"" > .env.local

# データベースをセットアップ
npx prisma migrate dev
npx prisma generate

# 開発サーバーを起動
npm run dev
```

[http://localhost:3000](http://localhost:3000)にアクセスしてください。

### 初回アクセス時

1. ニックネームを登録（Cookieに保存）
2. セッションが自動的に作成されます

### 2つのエントリーポイント

- **プレイヤービュー** (`/`): 公開中のゲームに参加
- **モデレータービュー** (`/games`): 自分のゲームを管理
  - `/games`には自分が作成したゲームのみが表示されます
  - `/games/[id]`は自分が作成したゲーム以外はアクセスできません（編集機能があるため）

⚠️ ナビゲーションボタンはありません。URLを直接入力してください。

## ゲームの流れ

### モデレーター（ゲーム作成者）

1. **ゲーム一覧を確認** → `/games`
   - 自分のゲーム一覧を表示
   - 「ゲーム作成」ボタンから新規作成

2. **ゲーム作成** → `/games/create`
   - ゲーム名、プレイヤー上限（1-100人）を設定
   - ステータス：**準備中**

3. **出題者とエピソード登録** → `/games/[id]/presenters`
   - 出題者を追加（1-10人）
   - 各出題者につき3つのエピソードを登録
   - 1つのエピソードを「嘘」としてマーク（プレイヤーには非公開）

4. **ゲーム公開** → `/games/[id]`
   - ステータスを**出題中**に変更
   - プレイヤーが参加可能になる

5. **ゲーム終了** → `/games/[id]`
   - ステータスを**締切**に変更
   - 結果を公開

### プレイヤー

1. **ゲーム発見** → `/`
   - 「出題中」と「締切」のゲーム一覧を表示

2. **投票**（出題中のゲーム） → `/games/[id]/answer`
   - 各出題者の3つのエピソードを閲覧
   - 「嘘だと思うエピソード」を選択
   - 回答を送信

3. **回答状況確認**（出題中のゲーム） → `/games/[id]/dashboard`
   - リアルタイムで回答状況を確認
   - 参加者一覧と解答率

4. **結果確認**（締切のゲーム） → `/games/[id]/results`
   - 正解数ランキング
   - 勝者の表彰

### セッション管理
- Cookieベースの認証
- ニックネーム登録
- 永続的なセッション

---

## 開発者向け情報

### 開発のヒント

#### ダミーデータを作る

開発中にすぐ動作確認したい場合は、シードスクリプトでダミーデータを一括生成できます（詳細は[シードスクリプト](#シードスクリプトテストデータ生成)を参照）。

```bash
npm run seed                    # 全ステータスのゲームを150件作成
npm run seed:my <session-id>    # 自分のセッションで100件作成
```

#### セッションIDの確認方法

1. DevTools（F12）を開く
2. Application → Cookies → `http://localhost:3000`
3. `sessionId` Cookieの値をコピー

**用途:**
- `npm run seed:my <session-id>` でテストデータ生成
- セッション固有の問題をデバッグ

#### 複数ユーザーのテスト

- **通常のブラウザ**: ユーザーA
- **シークレットモード**: ユーザーB

各ブラウザで独立したセッションを作成できます。

```bash
# ターミナル1: ユーザーAのゲームをシード
npm run seed:my <session-id-A>

# ターミナル2: ユーザーBのゲームをシード
npm run seed:my <session-id-B>
```

#### DBスキーマを変更したい場合

1. `prisma/schema.prisma`を更新
2. マイグレーション作成: `npx prisma migrate dev --name description`
3. リポジトリ実装を更新
4. ドメインエンティティを更新（必要に応じて）

### 利用可能なコマンド

#### 開発
```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド
npm start            # 本番サーバー起動
```

#### テスト
> ⚠️ 現在テストは正常に動作しません。

```bash
npm test                   # すべてのテストを実行
```

<details>
<summary>個別コマンド</summary>

```bash
npm run test:unit          # ユニットテストのみ
npm run test:integration   # 統合テストのみ
npm run test:ui            # インタラクティブUI
npm run test:coverage      # カバレッジレポート
npm run test:e2e           # E2Eテスト
npm run test:e2e:ui        # E2EテストUI
npm run test:e2e:debug     # E2Eデバッグ
```

</details>

#### データベース
```bash
npx prisma migrate dev     # マイグレーション実行（開発）
npx prisma migrate deploy  # マイグレーション実行（本番）
npx prisma studio          # データベースGUI
npx prisma generate        # Prismaクライアント生成
```

#### シードスクリプト（テストデータ生成）
```bash
# グローバルシード：データベース全体をリセットして新規データを作成
npm run seed
# - すべての既存データを削除
# - 固定の作成者ID（seed-creator-session-id）で150ゲーム作成
# - 各ステータス（準備中/出題中/締切）50ゲームずつ
# - 用途：初期状態に戻したい時、全ステータスのテスト

# ユーザー固有シード：自分のセッションでテストデータを作成
npm run seed:my <session-id>
# - 指定セッションIDの既存ゲームのみを削除
# - そのセッションIDで約100ゲーム作成
# - 他のユーザーのゲームは保持される
# - 用途：/gamesページで大量データをテスト
```

#### コード品質
```bash
npm run check              # リント＋フォーマット
```

### 技術スタック

#### コア
- **フレームワーク**: Next.js 16.0.1 (App Router)
- **言語**: TypeScript 5 (strictモード)
- **UIライブラリ**: React 19.2.0
- **スタイリング**: Tailwind CSS v4

#### データ・永続化
- **データベース**: SQLite (Prisma経由)
- **ORM**: Prisma 6.19.0
- **バリデーション**: Zod 4.1.12
- **ID生成**: nanoid 5.1.6

#### テスト
- **ユニットテスト**: Vitest 4.0.7
- **E2Eテスト**: Playwright 1.56.1
- **コンポーネントテスト**: Testing Library

> [!WARNING]
> **テストは現在メンテナンスされていません。**
> 多くのテストが失敗します。テストコマンドを実行しても正常に通過しない可能性があります。

#### コード品質
- **リント・フォーマット**: Biome 2.3.4、ESLint 9

## ライセンス

プライベートプロジェクト - All rights reserved

