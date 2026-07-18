# video-meeting-app

[English](./README.en.md) | 日本語

<!-- 内容を更新した際は README.en.md も忘れずに同期すること -->

## プロジェクト概要

ブラウザで動作するビデオ会議アプリケーション。アプリのインストールなしに、URLの共有だけで複数人のビデオ通話を開始できることを目指す。

### 主要機能(予定)

- ルームベースのビデオ通話
- 画面共有
- テキストチャット

## 技術スタック

| 分類 | 技術 | バージョン |
| --- | --- | --- |
| 言語 | TypeScript | 5.x |
| フロントエンド | Next.js(App Router) | 16.x |
| バックエンド | NestJS | 11.x |
| リアルタイム通信 | WebRTC(P2Pメッシュ)/ Socket.IO(シグナリング) | - |
| データベース | 未定 | - |
| パッケージ管理 | pnpm workspace | 11.x |
| タスクランナー | Turborepo | 2.x |
| CI/CD | GitHub Actions | - |

<!-- バージョンはスキャフォールド後に実際の値へ同期すること -->

## アーキテクチャ(ビデオ通話)

映像・音声はブラウザ同士が WebRTC で直接送受信する(P2Pメッシュ)。バックエンドは接続確立に必要な情報(offer / answer / ICE candidate)を中継するシグナリングサーバーの役割のみを担う。

```
[ブラウザA] ←──映像・音声 (WebRTC P2P)──→ [ブラウザB]
     │                                        │
     └── シグナリング (Socket.IO) ──┐ ┌───────┘
                                    │ │
                          [NestJS バックエンド]
```

- STUN サーバーは Google の公開 STUN(`stun:stun.l.google.com:19302`)を使用。TURN は将来必要になった時点で検討
- P2P メッシュの実用上限は4〜6人程度。それを超える要件が出た場合は SFU への移行を検討

## ディレクトリ構成

```
.
├── .github/             # PRテンプレート・CIワークフロー
├── apps/
│   ├── frontend/        # Next.js アプリ(ポート3000)
│   │   └── src/
│   └── backend/         # NestJS APIサーバー(ポート3001)
│       └── src/
├── packages/
│   └── shared/          # フロント・バック共有の型定義(API・WebSocketイベント)
├── pnpm-workspace.yaml  # ワークスペース定義
├── turbo.json           # Turborepoタスク定義
└── tsconfig.base.json   # 共通TypeScript設定(各パッケージがextends)
```

## セットアップ

必要環境: Node.js 24以上 / pnpm 11以上

```bash
pnpm install   # 依存関係のインストール
pnpm dev       # フロントエンド・バックエンドを同時起動
```

## 開発コマンド

すべてリポジトリルートで実行する。

| コマンド | 説明 |
| --- | --- |
| `pnpm dev` | 開発サーバーの起動(全アプリ同時) |
| `pnpm build` | 本番用ビルド(依存順はTurborepoが解決) |
| `pnpm test` | テストの実行 |
| `pnpm lint` | Lintの実行 |
| `pnpm format` | コードフォーマット |

## 開発サーバーのURL

| アプリ | URL |
| --- | --- |
| frontend | http://localhost:3000 |
| backend | http://localhost:3001 |
