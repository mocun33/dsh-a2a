# 发布 @mocun33/dsh-a2a（独立社区维护版）

本分支由 `feat/a2a-v1-native` 派生，保留上游 PR #2 的 A2A 1.0 改动与 package exports 修复。**不要把本分支的 `@mocun33` 命名修改合入上游 PR。**

此发行版基于 [zyfgood/dsh-a2a](https://github.com/zyfgood/dsh-a2a)，采用 MIT License。保留 `LICENSE` 中原版权及许可证文本。与原作者的 npm 包分别发布、分别维护。

## 发布前置条件

- npm 账号或组织有 `@mocun33` scope 的发布权限（GitHub 用户名不会自动授予 npm 权限）
- Node.js >=20，pnpm/TypeScript 构建环境
- 通过 npm 的交互式登录与 2FA，**不要在聊天或代码库中提交 token**
- 只有一份 A2A 插件启用在同一 DSH profile 中（它与原包都使用 Cordis 插件 id `a2a`）

## 发布预览版

```bash
git clone --branch release/mocun33-v0.3.0-beta.1 https://github.com/mocun33/dsh-a2a.git
cd dsh-a2a
npm whoami
# 必须显示 mocun33，或确认当前账户具有 @mocun33 发布权限。
pnpm install
pnpm verify
pnpm test
pnpm build:local
npm pack --dry-run --json
# 审核输出包含 lib/client.js、lib/client.d.ts、client/client.js 和 cordis.patch.yml
npm publish --access public --tag beta
npm view @mocun33/dsh-a2a dist-tags --json
```

`npm publish` 会执行 `prepack`，生成发布产物。首次公开发布的用户 scoped 包必须使用 `--access public`。发布 `beta` dist-tag 避免未经稳定验证即更新 `latest`。

如 npm 用户名不是 `mocun33` 或尚未创建该 scope，必须先选用自己控制的 scope，并同步更新 `package.json`、`client/client.js`、`cordis.patch*.yml`、README 与测试，然后再发布。

## 发布后

```bash
npm view @mocun33/dsh-a2a@beta version
npm install @mocun33/dsh-a2a@beta
# 在测试 profile 中按 README 使用 dsh plugin 安装精确版本
```

真实 DSH 宿主测试应覆盖浏览器加载、A2A 1.0 请求、旧 0.3 客户端和出站工具。上游 PR 仍单独维护；不要向上游推送本 fork 的 npm 改名提交。
