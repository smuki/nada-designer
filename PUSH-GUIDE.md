# 推送与发布指南（当前暂停状态）

> 记录时间：2026-11-20
> 状态：**代码已完成并本地提交，但因当前网络无法访问 `github.com:443`，尚未推送到远端。**

## 一、当前状态

| 项 | 值 |
|---|---|
| 本地分支 | `main`，**4 个提交**，工作区干净 |
| 远端 | `origin` = `git@github.com:smuki/nada-designer.git`（已切到 SSH） |
| SSH 密钥 | `C:\Users\k\.ssh\id_ed25519`（无 passphrase），指纹 `SHA256:u6oOoec/4e/LWZ8frQB+7uv7rNP1siUk06KyR4Reroc` |
| SSH 端口映射 | `C:\Users\k\.ssh\config`：`github.com` → `ssh.github.com:443` |
| 公钥登记 | ❌ **尚未加到 GitHub 账号**（这是唯一卡点） |
| 包 | `nada-designer@1.1.14` + `nada-designer-element-plus/-antd/-naive-ui@1.1.14`，均已构建验证 |
| 测试 | 15 个文件 / 82 个用例，全绿 |

## 二、为什么推不上去（实测结论）

- `github.com` 解析到 `20.205.243.166`，该 IP 的 **443 端口在本网络基本不可达**；
- 即使换到可达的 GitHub IP，**按域名（SNI）也会被 reset**，HTTPS 推送不可行；
- 本机**没有运行任何代理**；
- 可用的通道是 **`ssh.github.com:443`** 和 `github.com:22`（SSH 握手正常），只差公钥登记。

## 三、恢复推送：三选一

### 方案 A（推荐，无需代理）——先登记公钥

公钥内容：

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGBR3742VuxDaiITtZq88yReE5+vhiyH8rJ9w1d4kuN/ nada-designer@sunriseyuen
```

1. 用**手机流量 / 另一台能上 GitHub 的电脑**打开 <https://github.com/settings/ssh/new>
2. Title 随意（如 `nada-designer-laptop`），Key 粘贴上面整行，点 **Add SSH key**
3. 回到本机执行：
   ```bash
   cd D:\Storage\git\archive\nada-designer
   git push --force origin main
   ```
   （`--force` 必需：本地历史是重建过的，与远端旧历史无关）

### 方案 B——换到能访问 GitHub 的网络

```bash
cd D:\Storage\git\archive\nada-designer
git remote set-url origin https://github.com/smuki/nada-designer.git
git push --force origin main
```
（该网络下浏览器登录一次即可；认证由 Git Credential Manager 接管）

### 方案 C——有代理时

```bash
git remote set-url origin https://github.com/smuki/nada-designer.git
git config --global http.proxy http://127.0.0.1:7897
git push --force origin main
```

## 四、推送成功之后

1. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加 secret：
   - Name: `NPM_TOKEN`
   - Value: npmjs.com 生成的 Automation / Granular Token（Read and write）
2. 打 tag 触发自动发布：
   ```bash
   git tag v1.1.14
   git push origin v1.1.14
   ```
3. Actions 会自动：校验 tag 与版本一致 → 安装 → 测试 → 构建 4 个包 → 发布到 npm（已存在的版本自动跳过）

## 五、以后发版流程

1. 把 4 个 `package.json` 的 `version` 一起改成新版本：
   - `packages/nada-designer/package.json`
   - `packages/ui/elementPlus/package.json`
   - `packages/ui/antd/package.json`
   - `packages/ui/naiveUi/package.json`
2. `git commit -am "chore: release vX.Y.Z"`
3. `git tag vX.Y.Z && git push origin main vX.Y.Z`

## 六、备注

- 想临时换回 HTTPS remote：`git remote set-url origin https://github.com/smuki/nada-designer.git`
- 想给私钥加密码（更安全，但每次 push 要输）：`ssh-keygen -p -f ~/.ssh/id_ed25519`
- 不再需要这套 SSH 配置时：删除 `C:\Users\k\.ssh\config` 中的 `Host github.com` 段，以及在 GitHub 上删除对应公钥
- 根目录 `项目现状分析报告.md` 在另一个仓库（`epic-designer`）里，是对上游的完整分析，排查问题时可以参考
