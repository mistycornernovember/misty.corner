# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 圖片資產使用 Git LFS

這個專案會在適合的情況下，使用 Git LFS 管理二進位圖片資產，而不是直接用一般 Git 追蹤。主要目的是讓 repository 歷史保持精簡，避免大量圖片反覆更新後讓 clone、fetch 與儲存空間成本持續增加。

### 為什麼要用 Git LFS

- `png`、`jpg`、`jpeg`、`gif`、`webp` 這類圖片屬於二進位檔，一般 Git 不擅長處理差異比對。
- 當圖片資產被頻繁更新時，一般 Git 會在歷史中保留完整的二進位快照，久了會讓 repository 變得很重。
- Git LFS 會在 Git 中只保存小型 pointer，實際的二進位檔案交給 LFS storage 管理，通常更適合設計稿、截圖、行銷素材等檔案。

### 哪些檔案適合放進 Git LFS

- 建議使用 Git LFS：`*.png`、`*.jpg`、`*.jpeg`、`*.gif`、`*.webp`
- 通常保留在一般 Git：`*.svg`

`svg` 是文字檔，保留在一般 Git 會比較方便做 code review、diff 與小幅修改。

### 注意事項

- 每位協作者在處理這些受追蹤的圖片檔之前，都需要先在本機安裝 Git LFS。
- 如果 CI 或部署環境需要讀取這些圖片，也必須支援 Git LFS checkout。
- Git hosting 平台通常會對 LFS 物件的儲存量與流量設有限制。
- 只針對「新加入的檔案」啟用 LFS 追蹤通常是安全的；如果要把「已經存在於 Git 歷史中的圖片」搬進 LFS，屬於另外一個需要團隊協調的步驟。
- 如果使用 `git lfs migrate` 改寫了 repository 歷史，其他正在使用這個 repo 的人也需要重新同步自己的 branch。

### 開發者環境設定

請先在自己的電腦安裝 Git LFS，然後執行：

```bash
git lfs install
```

clone 完 repository 之後，如果需要手動抓取 LFS 管理的檔案，可以執行：

```bash
git lfs pull
```

### 新增要追蹤的圖片格式

如果之後要把更多圖片格式交給 Git LFS 管理，可以更新 `.gitattributes`，例如：

```bash
git lfs track "*.png" "*.jpg" "*.jpeg" "*.gif" "*.webp"
git add .gitattributes
git commit -m "Track image assets with Git LFS"
```

### 日常操作方式

- 新增與提交圖片檔時，仍然照平常一樣使用 `git add` 與 `git commit`。
- 對於已經被 Git LFS 追蹤的格式，Git LFS 會自動把 Git 內的內容替換成 pointer 檔。
- 如果你在 diff 中看到圖片檔內容很小，這通常是正常的，因為 Git 看到的是 pointer，不是完整二進位檔。

### 如果看起來有問題

先檢查 Git LFS 是否已安裝且啟用：

```bash
git lfs version
git lfs ls-files
```

如果工作目錄中的檔案只被 checkout 成 pointer，可以執行：

```bash
git lfs pull
```
