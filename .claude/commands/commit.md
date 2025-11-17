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
- 🚸 ux: improve user experience/usability
- ♿️ a11y: improve accessibility
- 📝 docs: add or update documentation
- 💡 comment: add or update comments in source code
- ✏️ typo: fix typos
- 🤡 mock: create mocks
- 🏷️ types: add or update types

**Rules:**

- subject: within 50 characters
- body: explain the reason ("why") in detail
