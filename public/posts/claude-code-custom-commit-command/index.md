---
title: "Claude Code用カスタムコミットコマンドを作った"
date: "2025-01-18"
description: "Claude Codeでコミットを適切な粒度で自動的に作成するカスタムコマンドを作成しました。差分分析から日本語コミットメッセージの生成まで、開発ワークフローを効率化します。"
---

## はじめに

Claude Code には、プロジェクト固有のワークフローを自動化できる「カスタムコマンド」という機能があります。`.claude/commands/` ディレクトリにマークダウンファイルを配置するだけで、独自のスラッシュコマンドを定義できます。

今回は、Git コミットの作成プロセスを効率化するカスタムコマンド `/commit` を作成したので、その内容を紹介します。

## 背景・モチベーション

開発中、複数の変更を行った後にコミットする際、以下のような課題がありました：

- **コミットの粒度を適切に保つのが面倒**：関連する変更をまとめつつ、異なる種類の変更は分けたい
- **コミットメッセージを毎回考えるのが手間**：プロジェクトのコミット規約に沿った日本語メッセージを書くのに時間がかかる
- **変更内容の確認漏れ**：急いでいると diff をしっかり確認せずにコミットしてしまうことも

これらを解決するために、Claude Code に差分を分析させて、適切な粒度でコミットを自動作成するコマンドを作りました。

## 作ったもの

### コマンドの機能

このコマンドは以下の処理を自動で実行します：

1. **差分の分析**：`git status` と `git diff` で変更内容を確認
2. **問題点のレポート**：セキュリティやコード品質の懸念があれば報告
3. **コミットのグルーピング**：機能単位、ファイルタイプ、依存関係に基づいて変更を分類
4. **コミットの実行**：分析結果を表形式で提示後、自動的にコミットを作成

### コミットメッセージのフォーマット

すべてのコミットメッセージは**日本語**で、以下の形式に従います：

```text
<emoji> <type>: <subject>

[body: 変更の理由とコンテキストを説明]
```

使用する絵文字とタイプの例：

| Emoji | Type     | 用途                   |
| ----- | -------- | ---------------------- |
| ✨    | feat     | 新機能の追加           |
| 🐛    | fix      | バグ修正               |
| ⚡️   | perf     | パフォーマンス改善     |
| ♻️    | refactor | リファクタリング       |
| 💄    | style    | UI やスタイルの更新    |
| 📝    | docs     | ドキュメントの追加更新 |

**ルール**：

- subject: 50 文字以内
- body: 変更の理由（"why"）を詳しく説明

### 実装

`.claude/commands/commit.md` にコマンドの定義を記述します：

````markdown
---
description: Git差分を分析して適切な粒度でコミットを作成
---

## Execution Steps

1. Analyze changes with `git status` and `git diff`
2. Report any potential issues or concerns found in the diff
3. Group commits based on the following criteria:
   - By functionality (1 commit = 1 logical change)
   - By file type (config → types → implementation → tests → docs)
   - By dependencies (dependent changes in same commit)
4. Present commit plan in table format, then **execute directly without asking for user confirmation**

## Commit Message Format

**Write all commit messages in Japanese.**

```
<emoji> <type>: <subject>

[body: explain the reason and context for the change]
```

**<emoji> <type> List:**

- ✨ feat: introduce new features
- 🐛 fix: fix bugs
- ⚡️ perf: improve performance
- ♻️ refactor: refactor code
- 🔥 remove: remove code or files
- 💄 style: add or update UI and style files
- 📝 docs: add or update documentation
- 💡 comment: add or update comments in source code
- ✏️ typo: fix typos
- 🏷️ types: add or update types

**Rules:**

- subject: within 50 characters
- body: explain the reason ("why") in detail
````

## 使い方

使い方は非常にシンプルです：

1. コードを変更
2. Claude Code で `/commit` と入力
3. Claude Code が差分を分析してコミットを自動作成

### 実際の使用例

例えば、以下のような変更を行った場合：

```
- サイト名を変更（Header.tsx）
- 新しいページを追加（app/about/page.tsx）
- スタイルを調整（app/globals.css）
```

`/commit` を実行すると、Claude Code が自動的に：

1. 変更を分析
2. 3 つの独立したコミットに分割
3. それぞれに適切な日本語メッセージを付けて実行

```text
💄 style: ヘッダーのサイト名を更新
✨ feat: About ページを追加
💄 style: グローバルスタイルの余白を調整
```

## まとめ

Claude Code のカスタムコマンド機能を使うことで、プロジェクト固有のワークフローを簡単に自動化できます。

今回作成した `/commit` コマンドは：

- ✅ コミットの粒度を適切に保つ
- ✅ プロジェクト規約に沿ったメッセージを自動生成
- ✅ 差分の確認漏れを防ぐ
- ✅ コミット作業を大幅に効率化

という効果があり、開発体験が大きく向上しました。

皆さんも、自分のワークフローに合わせたカスタムコマンドを作ってみてはいかがでしょうか？
