---
title: "AIによるコミット自動化（改善版）"
date: "2025-11-28"
description: "以前公開した「AIによるコミット自動化」の記事に対して、AIに丸投げするのは危険で、Whyの部分は人間が考えるべきというフィードバックを頂きました。そのフィードバックを反映し、AIはコミットの粒度を判断してステージングし、質問することで人間からWhyを引き出す形式に改善したSlash Commandを作成しました。"
---

## 背景・モチベーション

以前公開した「[AI によるコミット自動化](/posts/ai-commit-automation)」の記事に対して、以下のようなフィードバックを頂きました。

- AI に丸投げするのは危険
- AI はまだ Why の部分を察するのが下手くそだから人間がコンテキスト入れないとだめ

確かに、AI はコードの差分から「何をしたか」は理解できますが、「なぜその変更をしたか」という背景や文脈は、セッション情報があっても完全には理解できないことがあります。特に、ビジネス要件や設計判断、過去の議論の経緯などは、コードの差分だけからは読み取れません。

そこで、以下のように方針を変更しました。

- AI にコミットの粒度を考えさせるのは同じ（これは AI が得意）
- でもその変更の Why の部分は人間が考える（これは人間が知っている情報）
- AI が質問することで、人間から Why を引き出す

これにより、AI の力を活用しつつ、人間が持つ文脈情報をコミットメッセージに反映できるようになります。

## 作成した Slash Command

````md:commit.md
---
description: Git差分を分析して適切な粒度でコミットを作成（AIが質問してWhyを引き出す）
---

## 実行手順

1. `git status` と `git diff` で変更を分析
2. 差分に潜在的な問題や懸念事項があれば報告し、コミットしない
3. 以下の基準でコミットをグループ化:
   - 1 コミット = 1 論理変更
   - 依存する変更は同一コミット
4. **適切な粒度で変更をステージングする（`git add`）**
5. **ステージングした変更について、Why（変更の理由）を理解するためにユーザーに質問する**
   - 質問する際は「Question 1 / 3」のように、現在の質問番号と総質問数を表示する
   - 例: 「Question 1 / 3: このテストを分割した理由はなんですか？」
   - 例: 「Question 2 / 3: この関数をリファクタリングした背景を教えてください」
6. **疑問点がなくなるまで質問を続ける**
7. **質問への回答を基にコミットメッセージを完成させ、コミットを実行する**
8. **ステージングされていない変更が残っている場合は、4 に戻る**

## コミットメッセージ形式

```
<emoji> <prefix>: <subject>

[body: 変更の理由を説明（質問への回答を基に生成）]
```

**<emoji> <prefix> 一覧:**

- ✨ feat: 新機能の追加
- 🐛 fix: バグ修正
- ⚡️ perf: パフォーマンス改善
- ♻️ refactor: コードのリファクタリング
- 🔥 remove: コードやファイルの削除
- 💄 style: UI やスタイルファイルの追加・更新
- 🚸 ux: ユーザー体験/ユーザビリティの改善
- ♿️ a11y: アクセシビリティの改善
- 📝 docs: ドキュメントの追加・更新
- 💡 comment: ソースコード内のコメント追加・更新
- ✏️ typo: タイポの修正
- 🤡 mock: モックの作成
- 🏷️ types: 型の追加・更新

**ルール:**

- subject: 50 文字以内で変更内容を簡潔に説明（AIが生成）
- body: 変更の理由("なぜ")を詳しく説明（**質問への回答を基にAIが生成**）
- **ステージングした変更について、Whyを理解するために積極的に質問すること**
- **質問する際は「Question 1 / 3」のように、現在の質問番号と総質問数を表示すること**
- **疑問点がなくなるまで質問を続けること**
- **質問への回答を基にコミットメッセージを完成させ、確認を求めずに直接実行すること**
- **このコマンド実行後は通常モードに戻り、ユーザーが明示的に `/commit` を実行するまで自動的にコミットしない**
- **コミットメッセージは全て日本語で記述してください。**
````

## 解説

### AI はコミットの粒度を判断し、質問で Why を引き出す

この Slash Command の最大の特徴は、**AI が質問することで人間から Why を引き出す**ことです。

- **AI の役割**:
  - コードの差分を分析し、適切なコミットの粒度を判断する
  - 適切な粒度で変更をステージングする
  - ステージングした変更について、Why を理解するために質問する
  - 質問への回答を基にコミットメッセージを生成する
- **人間の役割**: AI の質問に答えることで、Why を伝える

AI はコードの差分から「何をしたか」は理解できますが、「なぜその変更をしたか」という背景や文脈は、ビジネス要件や設計判断、過去の議論の経緯など、コードの差分だけからは読み取れません。そのため、AI が積極的に質問することで、人間が持つ文脈情報を引き出し、より正確で有用なコミットメッセージを作成できます。

### 差分に潜在的な問題や懸念事項があれば報告し、コミットしない

これが書いてあるだけで AI が脳死コミットをしなくなります。typo に気づいてくれたり、リファクタリングの提案をコミット前にしてくれるようになります。

### コミットの粒度

**1 コミット = 1 論理変更**を原則としています。

理由は書くまでもないと思いますが、

- 問題が起きた時に原因を特定しやすい
- revert しやすい
- レビューがしやすい

などの理由があります。

### AI が質問して Why を引き出す

この Slash Command では、AI がステージングした変更について、Why を理解するために積極的に質問します。ユーザーが質問に答えることで、AI は Why を理解し、それを基にコミットメッセージの body 部分を生成します。

例えば、以下のような流れになります。

1. AI が適切な粒度で変更をステージング

   ```
   git add src/utils/auth.ts
   ```

2. AI がステージングした変更について質問

   ```
   Question 1 / 3: このテストを分割した理由はなんですか？
   ```

3. ユーザーが回答

   ```
   テストが長すぎて可読性が低かったので、責務ごとに分割して理解しやすくしました。
   ```

4. AI が追加の質問（必要に応じて）

   ```
   Question 2 / 3: 他に分割した理由はありますか？例えば、テストの実行時間や保守性の観点から。
   ```

5. ユーザーが回答

   ```
   はい、テストの実行時間も短縮できました。また、今後テストを追加する際も、分割した方が保守しやすくなります。
   ```

6. AI がコミットメッセージを完成させて実行

   ```
   ♻️ refactor: 認証テストを責務ごとに分割

   テストが長すぎて可読性が低かったため、責務ごとに分割して理解しやすくしました。また、テストの実行時間も短縮でき、今後テストを追加する際も保守しやすくなります。
   ```

7. 残りの変更があれば、1 に戻る

### 疑問点がなくなるまで質問を続ける

AI は、ステージングした変更について Why を完全に理解するまで、積極的に質問を続けます。1 回の質問で十分な場合もあれば、複数回の質問が必要な場合もあります。重要なのは、Why を正確に理解することです。

質問する際は、「Question 1 / 3」のように現在の質問番号と総質問数を表示することで、ユーザーが残りの質問数を把握でき、回答しやすくなります。

### ユーザーの確認を求めずに直接実行

これは好みですが、私はつけています。質問への回答が完了した後、いちいち承認するのは面倒なのでつけています。これでもたまに聞いてきますが。

### subject: 50 文字以内

50 文字以内は好みかなと思います。私は調べたら 50 文字以内と言っている人が多かったのでそうしてます。

### body: 変更の理由("なぜ")を詳しく説明

[有名な t-wada さんのツイート](https://x.com/t_wada/status/904916106153828352)にもあるように、**コミットログには Why**を書いておくと、後から見た時になぜその変更をする必要があったのかが分かるので良さそうです。

![有名な t-wada さんのツイート](/posts/ai-commit-automation/twada-tweet.webp)

この Slash Command では、AI が質問することで人間から Why を引き出し、それを基にコミットメッセージを生成することで、より正確で有用なコミットメッセージになります。

### 絵文字/prefix

絵文字はかわいいのでつけてます。もっさりしている GitHub を華やかにできます。可読性も良くなります。絵文字は[gitmoji](https://gitmoji.dev/)を参考にしてます。

prefix は言わずもがなです。昔は絵文字 Only でやっていましたが以下の記事を読んでから合わせてつけるようにしてます。

https://tech.pepabo.com/2023/08/28/stopped-to-use-gitmoji/

### このコマンド実行後は通常モードに戻り、ユーザーが明示的に `/commit` を実行するまで自動的にコミットしない

これを追加しておかないと、続けて作業する時に勝手にコミットしてしまうことがあります。

### コミットメッセージは全て日本語で記述してください

最終的に英語に修正して使うのでつけています。英語にすることで少しだけトークン消費を抑えられ、少しだけ賢くなるらしい... 体感はしたことないです。

<details>

<summary>英語版</summary>

````md
---
description: Git差分を分析して適切な粒度でコミットを作成（AIが質問してWhyを引き出す）
---

## Execution Steps

1. Analyze changes with `git status` and `git diff`
2. Report any potential issues or concerns in the diff and do not commit
3. Group commits based on the following criteria:
   - 1 commit = 1 logical change
   - Dependent changes in the same commit
4. **Stage changes with appropriate granularity (`git add`)**
5. **Ask the user questions about the staged changes to understand Why (reason for the change)**
   - When asking questions, display the current question number and total number of questions like "Question 1 / 3"
   - Example: "Question 1 / 3: Why did you split this test?"
   - Example: "Question 2 / 3: What was the background for refactoring this function?"
6. **Continue asking questions until all doubts are resolved**
7. **Complete the commit message based on the answers and execute the commit**
8. **If there are remaining unstaged changes, return to step 4**

## Commit Message Format

```
<emoji> <prefix>: <subject>

[body: explain the reason for the change (generated based on answers)]
```

**<emoji> <prefix> List:**

- ✨ feat: introduce new features
- 🐛 fix: fix bugs
- ⚡️ perf: improve performance
- ♻️ refactor: refactor code
- 🔥 remove: remove code or files
- 💄 style: add or update UI and style files
- 🚸 ux: improve user experience/usability
- ♿️ a11y: improve accessibility
- 📝 docs: add or update documentation
- 💡 comment: add or update comments in source code
- ✏️ typo: fix typos
- 🤡 mock: create mocks
- 🏷️ types: add or update types

**Rules:**

- subject: concisely describe the change within 50 characters (generated by AI)
- body: explain the reason ("why") for the change in detail (**generated by AI based on answers**)
- **Actively ask questions about staged changes to understand Why**
- **When asking questions, display the current question number and total number of questions like "Question 1 / 3"**
- **Continue asking questions until all doubts are resolved**
- **Complete the commit message based on the answers and execute directly without asking for confirmation**
- **After executing this command, return to normal mode and do not automatically commit until the user explicitly runs `/commit`**
- **Write all commit messages in Japanese.**
````

</details>

## 終わりに

AI にコミットメッセージを完全に任せるのではなく、AI と人間が協力することで、より正確で有用なコミットメッセージを作成できるようになりました。AI はコミットの粒度を判断し、質問することで人間から Why を引き出す。この役割分担により、AI の力を活用しつつ、人間が持つ文脈情報をコミットメッセージに反映できます。

## 参考

- [AI によるコミット自動化（前回の記事）](/posts/ai-commit-automation)
- https://code.claude.com/docs/ja/slash-commands
