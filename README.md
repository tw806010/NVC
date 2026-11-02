# 好好說｜非暴力溝通練習室

v1.0：以繁體中文提供非暴力溝通互動練習，支援手機與桌面。

## 功能

- 八張入門教學圖卡，包含兩組辨識練習。
- 六個生活情境，示例可自行修改。
- 觀察、感受、需要與請求引導，可複選及自訂詞彙。
- 表達草稿編輯、文字複製、PNG 圖卡下載。
- 不需登入，輸入僅存於頁面記憶體，重新整理即清除。

## 本機執行

需 Node.js 24。無需安裝套件。

```sh
npm run check
npm start
```

開啟 http://127.0.0.1:4187 。

## 發布

GitHub Pages 以 GitHub Actions 部署 main 分支。僅發布網站前端、圖示與 manifest，不發布 worker 目錄及秘密設定。

## 內容

概念參考：[玩轉學校｜非暴力溝通四步驟](https://pleyschool.org/blog/what-is-nvc/)。本專案重新編寫說明、題目及情境，未使用原文插圖。

工具提供日常溝通練習，不保證對話結果。Google Fonts 僅用於字型，載入失敗時使用系統字型。手動練習輸入不會傳送至伺服器；使用 AI 整理時，送出的文字會經由後端交由 Google Gemini 處理。


## Gemini AI 整理（整合版本）

前端 ai.js 呼叫 https://nvc-ai.tw0909806010.workers.dev/analyze 。只有使用者同意並按下按鈕時才傳送輸入；手動圖卡內容不自動傳送。AI 建議需由使用者確認再帶入圖卡。

### Worker 部署

1. 在 Cloudflare 的 nvc-ai Worker 設定 Secret：GEMINI_API_KEY。不要把值寫進程式、Git 或聊天室。
2. 執行 npx wrangler@4 login。
3. 執行 npx wrangler@4 deploy --config worker/wrangler.jsonc。
4. GET /health 可確認部署及必要設定是否完成，不會揭露金鑰。

部署設定包含每個來源 IP 每分鐘約三次的 Cloudflare Rate Limiting binding。此限制是各 Cloudflare 節點的近似限流，並非全球每日硬額度，也不是使用者驗證。CORS 本身無法防止非瀏覽器濫用。Google 專案應維持免費層級，不啟用付費帳單；免費額度與模型可用性以 AI Studio 為準。對外擴大使用前應加入驗證及更完整的用量控管。

可在 worker/wrangler.jsonc 調整 GEMINI_MODEL；預設 gemini-3.1-flash-lite。不得自動改用付費模型。AI_ENABLED 設為 false 即停止 AI 請求。

Worker 不記錄對話內容，未建立對話資料庫並停用 Worker 可觀測日誌。IP 只用於每日變化的雜湊限流鍵，不送交 Gemini。Google 及基礎設施的資料處理仍依各自條款，不能宣稱第三方零保留。

Gemini 免費服務只用於成人、虛構或去識別化且不含敏感、機密、個人資訊的練習。單純勾選同意或年齡不足以代替服務條款要求；本專案尚無身分驗證，公開適用對象需由營運者持續評估。

### 測試

npm run check 包含既有圖卡檢查及 Worker 的模擬上游測試，不會使用真實 API 金鑰或消耗額度。正式部署後另以虛構文字測試。
