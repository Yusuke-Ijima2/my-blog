---
title: "TanStack Routerのクエリパラメータ管理が良い"
date: "2025-12-04"
description: "TanStack Routerのクエリパラメータ管理機能について紹介します。URL as stateの考え方に基づき、型安全で使いやすいクエリパラメータ管理が可能です。"
---

## 背景・モチベーション

最近 TanStack Router に入門しました。まだまだわからないことも多いですが、クエリパラメータ管理が非常に優れていることが分かったので紹介したいと思います。

## TanStack Router とは

TanStack Router は、Tanner Linsley 氏によって開発された React/Solid アプリケーションを構築するためのルーターライブラリです。

- [公式ドキュメント](https://tanstack.com/router/latest/docs/framework/react/overview)

## TanStack Router のクエリパラメータ管理の何が良いか

Next.js では`useSearchParams`でクエリパラメータを管理できますが、手動での型変換、文字列処理、バリデーションなどをやらなければならず使いにくいです。一方、TanStack Router は**クエリパラメータファーストの設計**になっており、これらの処理を自動で行ってくれます。

特に従来のルーターライブラリは URL を**単なる文字列の集まり**として扱うのに対し、TanStack Router は URL を**構造化された JSON データの永続化層**として捉えるのが特徴です。

以下の記事が非常に参考になります。

- [TanStack Router のクエリパラメータ管理について](https://zenn.dev/tsuboi/articles/c76fc09315bdd1)

視覚的にわかりやすくするために簡単なアプリケーションも作成しました。

- [TanStack Router URL Builder デモ](https://yusuke-ijima2.github.io/tanstack-router-url-builder/)

上側に**商品検索の UI**、下側に**現在の URL** と**その URL からパースされた JSON**がリアルタイムで表示されます。UI の状態を変更すると URL が更新され、URL を変更すると UI も更新される様子を確認できます。

URL の肥大化が気になる場合は、`Search Middleware`という URL の更新前後に処理を挟むことができる機能が備わっており、その中の[`stripSearchParams`](https://tanstack.com/router/latest/docs/framework/react/api/router/stripSearchParamsFunction#stripsearchparams-props)というミドルウェアで解決できます（このアプリケーションでは使用していませんが）。

ちなみに URL に状態を保存すると以下のようなメリットがあります。

- **共有可能**: URL を送るだけで同じ状態を再現できる
- **リロードしても状態が保持**: ページを再読み込みしても状態が維持される
- **ブラウザの戻る/進むで動作**: 履歴で状態を移動できる
- **ブックマーク可能**: 特定の状態を保存できる

## 終わりに

個人的には、基本的に URL に状態を入れるようにして、最後の手段で`useState`を使うべきだという考えを支持しています。過剰なくらい入れても問題ないという考えなので、TanStack Router は非常に手に馴染みます。これからも使っていきたい。

## 参考

- [TanStack Router 公式サイト](https://tanstack.com/router/latest)
