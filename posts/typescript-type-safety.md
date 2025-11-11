---
title: "TypeScriptで実現する型安全なコード"
date: "2025-01-10"
description: "TypeScriptの型システムを活用して、バグの少ない堅牢なアプリケーションを開発する方法を解説します。"
---

## 型安全性の重要性

JavaScriptは柔軟な言語ですが、その柔軟性が時に予期しないバグを引き起こします。TypeScriptの型システムを使うことで、開発時に多くのエラーを検出し、より堅牢なコードを書くことができます。

## 基本的な型定義

TypeScriptでは、変数や関数の引数、戻り値に型を指定できます。

```typescript
// 変数の型指定
let message: string = "Hello, TypeScript!";
let count: number = 42;
let isActive: boolean = true;

// 関数の型指定
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// オブジェクトの型指定
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "太郎",
  email: "taro@example.com"
};
```

## ユニオン型とインターセクション型

TypeScriptでは、複数の型を組み合わせることができます。

```typescript
// ユニオン型：複数の型のいずれか
type Status = "pending" | "approved" | "rejected";

function updateStatus(status: Status) {
  console.log(`Status updated to: ${status}`);
}

updateStatus("approved"); // OK
// updateStatus("invalid"); // エラー

// インターセクション型：複数の型を結合
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type EmployeePerson = Person & Employee;

const employee: EmployeePerson = {
  name: "田中",
  age: 30,
  employeeId: "E12345",
  department: "Engineering"
};
```

## ジェネリクス型

ジェネリクスを使うと、再利用可能で型安全なコードが書けます。

```typescript
// 配列の最初の要素を返す関数
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const numbers = [1, 2, 3];
const firstNumber = getFirst(numbers); // number | undefined

const strings = ["a", "b", "c"];
const firstString = getFirst(strings); // string | undefined
```

## 型ガード

実行時の型チェックを行う型ガードを使うことで、さらに安全なコードが書けます。

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    // この中ではvalueはstring型
    console.log(value.toUpperCase());
  } else {
    // この中ではvalueはnumber型
    console.log(value.toFixed(2));
  }
}
```

## strictモードの活用

`tsconfig.json`で`strict`オプションを有効にすることで、より厳格な型チェックが行われます。

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

## まとめ

TypeScriptの型システムを適切に活用することで、開発時に多くのバグを防ぎ、コードの保守性を大幅に向上させることができます。最初は慣れるまで時間がかかるかもしれませんが、長期的には大きなメリットがあります。
