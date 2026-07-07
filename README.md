# Misty Corner

製霧所網站。使用 React、TypeScript、Vite 建置，並部署到 GitHub Pages。

正式網站：

https://mistycornernovember.github.io/misty.corner/

## 開發

安裝依賴：

```bash
npm ci
```

啟動本機開發伺服器：

```bash
npm run dev
```

建置 production 版本：

```bash
npm run build
```

預覽建置結果：

```bash
npm run preview
```

## 部署

GitHub Pages 由 `.github/workflows/deploy.yml` 部署。

目前 workflow 會在 `main` branch push 後執行：

1. checkout repository
2. 安裝 npm dependencies
3. 執行 `npm run build`
4. 上傳 `dist` 到 GitHub Pages

Vite 的 `base` 設定在 `vite.config.ts`：

```ts
base: '/misty.corner/'
```

如果 repository name 或 Pages 路徑改變，這裡也要同步調整。

## 圖片資產

網站會直接讀取 `public/images` 內的圖片，例如：

```ts
`${import.meta.env.BASE_URL}images/logo.png`
```

這些會被 GitHub Pages 直接 serve 的圖片不要使用 Git LFS。GitHub Pages 可能會把 LFS pointer 當成圖片檔送出，造成瀏覽器讀不到圖片。

新增或更新圖片時，請直接用一般 Git 追蹤：

```bash
git add public/images
git commit -m "Update site images"
```

可以用下面指令檢查圖片是否真的存進 Git，而不是 LFS pointer：

```bash
git cat-file -s HEAD:public/images/logo.png
```

如果結果只有約 `130` bytes，通常代表它仍是 LFS pointer；正常圖片應該會是幾 KB 到幾 MB。

## 從 Git LFS 移出圖片

如果圖片不小心被 Git LFS 追蹤，可以用下面流程移回一般 Git：

```bash
# 先確認工作目錄裡是真圖片，不是 pointer
git lfs pull

# 移除 .gitattributes 裡對網站圖片格式的 LFS 規則
# 例如移除：
# *.png filter=lfs diff=lfs merge=lfs -text
# *.jpg filter=lfs diff=lfs merge=lfs -text

# 重新依照新的 .gitattributes 更新 index
git add --renormalize public/images src/assets
git add .gitattributes

# 檢查 staged index 裡是不是圖片本體
git cat-file -s :public/images/logo.png

git commit -m "Move site images out of Git LFS"
```

注意：`HEAD:public/images/logo.png` 查的是上一個 commit；在 commit 前請用 `:public/images/logo.png` 檢查 staged index。

## 已知注意事項

- `public/images/issue-002.png` 目前沒有檔案；如果頁面仍引用它，該圖片會 404。
- GitHub Pages 深層路由會透過 `public/404.html` redirect 回 SPA。
