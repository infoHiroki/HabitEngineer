# HabitEngineer

習慣追跡とモチベーション向上のためのシンプルなウェブアプリケーション。Firebaseと連携して複数デバイス間での同期をサポートします。

## プロジェクト概要

HabitEngineerは、日々の習慣を管理し、継続的な改善をサポートするためのアプリケーションです。シンプルなUI、進捗の視覚化、モチベーションを高める機能を備えています。

## 主な機能

- 習慣の追加/削除/編集
- 習慣の完了状況のトラッキング
- 統計情報（総習慣数、完了率、継続日数など）
- カレンダービューでの進捗確認
- Firebase認証によるユーザー管理
- 複数デバイス間でのデータ同期（Firestore連携）
- ダークモード対応
- 多言語サポート（日本語/英語）

## 技術スタック

- React
- Firebase (Firestore, Authentication, Hosting)
- Styled-Components
- React Icons
- Date-fns

## プロジェクト構造

```
habit-engineer/
├── src/
│   ├── components/     # UIコンポーネント
│   ├── hooks/          # カスタムフック
│   ├── services/       # Firebase連携
│   ├── contexts/       # React Context
│   ├── utils/          # ユーティリティ関数
│   ├── styles/         # スタイル定義
│   ├── models/         # データモデル
│   └── constants/      # 定数と設定
```

## 開発状況

- [x] プロジェクト初期設定
- [x] ディレクトリ構造の作成
- [x] 基本UIコンポーネントの実装
- [x] ローカルストレージを使用した状態管理
- [x] Firebase設定
- [x] 認証機能の実装
- [x] Firestoreを使用したデータ同期
- [x] 統計とカレンダー表示
- [x] 多言語サポート
- [x] ダークモード実装
- [ ] デプロイ

## 起動方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm start

# 本番ビルドの作成
npm run build

# Firebaseへのデプロイ
npm run deploy
```

## Firebaseの設定

1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成します
2. Webアプリケーションを登録します
3. Firebaseの設定情報を`src/services/firebase.js`に追加します：

```javascript
// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

4. Firebaseコマンドラインツールをインストールします：

```bash
npm install -g firebase-tools
```

5. Firebaseにログインします：

```bash
firebase login
```

6. プロジェクトを初期化します：

```bash
firebase init
```

7. Hostingとそれに「build」フォルダを使用するように選択します

## ライセンス

MIT License