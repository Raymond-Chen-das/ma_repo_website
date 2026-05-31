# 研究限制與未來改進 / Limitations & Future Work

> 本文件主動記錄本專案在**資料、統計方法、與工程實作**三方面的已知限制，
> 並提出未來可改進的方向。這是一份一年前的課程作品，保留它的原貌，
> 並以現在的眼光誠實檢視——研究的價值不在於「沒有缺點」，而在於「知道
> 缺點在哪、以及如何改進」。
>
> This document transparently records known limitations across **data,
> statistical methodology, and engineering**, with concrete directions for
> improvement. The goal is not a flawless project, but a clear-eyed account
> of what could be done better.

---

## 1. 資料層面的限制 / Data Limitations

| # | 限制 | 說明 | 影響 |
|---|------|------|------|
| 1.1 | **觀測值非獨立（重複測量）** | 1,031 筆記錄僅來自 71 位使用者（平均每人約 14.5 筆），同一人多天的資料高度相關。 | PCA / K-means / ANOVA / 迴歸都假設樣本獨立，此假設被違反，會**高估顯著性與模型表現**。這是本專案最關鍵的統計限制。 |
| 1.2 | **樣本代表性未知** | 缺少使用者的年齡、性別、健康狀況等人口學資訊；取樣方式不明。 | 無法控制干擾變項，結論**難以推廣**到一般族群。 |
| 1.3 | **第三方專有資料** | 資料為 Garmin 專有且含個人健康資訊，原始資料不公開（見 `DATA.md`）。 | 外部無法完整重現研究，僅能以合成資料驗證流程。 |
| 1.4 | **時區假設** | `startTimeOffsetInSeconds` 全部為 28,800 秒（GMT+8），據此推論使用者位於東亞。 | 若部分使用者實際位於其他時區或曾跨時區旅行，睡眠日期歸屬會有誤差。 |
| 1.5 | **日期歸屬殘留誤差** | 經時區與睡眠類型修正後，原始日期與計算日期匹配率約 61.5%，最終配對率 86.9%。 | 仍有約 13% 的睡眠記錄未能配對活動資料，可能造成選擇性偏誤。 |

## 2. 統計方法的限制 / Methodological Limitations

- **2.1 預測變數與目標的循環性（partial leakage）**
  迴歸以 `deep_sleep_ratio`、`sleep_efficiency` 等「睡眠品質指標」預測 `sleep_hours`。
  但這些指標本身是由睡眠時長衍生（例如 `deep_sleep_ratio = 深睡秒數 /(sleep_hours×3600)`），
  分母即包含目標變數。專案已正確排除「用 sleep_hours 預測自己」的直接洩漏，
  但此種**衍生變數的循環性**仍會讓關係看似較強。

- **2.2 對 K-means 分群做 ANOVA 的循環性**
  群集是由特徵空間（PCA 分數）切割而來，再以 ANOVA 檢驗群集間差異，
  幾乎**必然顯著**。此設計適合「描述群體輪廓」，但不足以作為「群體間存在
  真實差異」的推論證據。

- **2.3 前處理洩漏進交叉驗證**
  `StandardScaler` 與 `PCA` 在**整個資料集**上先 fit，才做 `cross_val_score`；
  特徵工程（交互項、多項式、群集標籤）亦在分割前於全資料計算。
  正確做法是把前處理放進 `Pipeline`，在每個 CV fold 內各自 fit，避免測試資訊外洩。

- **2.4 多模型 × 多特徵組合的挑選偏誤**
  改進階段以 6 種模型 × 7 種特徵組合，挑選「交叉驗證 R² 最高者」回報。
  在沒有獨立保留測試集的情況下，**挑最好的一組**會系統性高估表現（fishing）。

- **2.5 因子分析的適切性不足**
  驗證性因子分析中 **KMO = 0.41**（低於 0.5 的「不適合」門檻），且出現
  共同性 > 1 的 **Heywood case**（如 `sleep_hours` = 1.04、`deepSleep` = 1.05），
  代表解可能不當（過度萃取）。此結果應作為「資料未必適合因子分析」的警訊，
  而非直接採信因子結構。

- **2.6 近零變異與哨兵值未處理乾淨**
  `startTimeOffsetInSeconds`、`intensityDurationGoalInSeconds` 為常數；
  `sleep_efficiency`（平均 0.997、標準差 0.034）幾近常數、資訊量極低；
  `averageStressLevel` 以 `-1` 作為缺值哨兵卻被當作數值參與運算。

- **2.7 異常值準則不一致**
  清理用固定區間（0.5–14 小時）、EDA 用 IQR、迴歸前處理用 3σ，
  三套標準散落在不同 notebook，未統一。

## 3. 工程與可重現性 / Engineering & Reproducibility

- **3.1 硬編碼 Colab 路徑**：程式內含 `/content/drive/MyDrive/...`，無法直接於本地或他人環境執行（本倉庫已附合成資料產生器作為過渡方案）。
- **3.2 `warnings.filterwarnings('ignore')`**：全域關閉警告，會遮蔽收斂警告、pandas 棄用警告等重要訊號。
- **3.3 巨型儲存格**：整個類別／pipeline 寫在單一 cell，難以單元測試與審查。
- **3.4 殘留的歷史版本**：清理 notebook 中保留了多版分類函式（`classify_sleep` / `_v2` / `_corrected`）等已棄用程式碼。
- **3.5 缺少環境鎖定**：尚無 `requirements.txt` / 版本鎖定；部分隨機流程未統一設定種子。
- **3.6 潛在錯誤**：`validate_sleep_stages()` 內 `reset_index(columns=...)` 為無效參數（若被呼叫會報錯）。

## 4. 未來改進方向 / Future Work

1. **以正確模型處理重複測量**：改用混合效應模型（`statsmodels` MixedLM）或 GEE，
   或在交叉驗證採 `GroupKFold(groups=_userId)`，確保同一使用者不同時落在訓練與測試集。
2. **杜絕前處理洩漏**：將 `StandardScaler → PCA → model` 封裝成 `Pipeline`，
   在 CV fold 內 fit；並保留一份從未參與調參的獨立測試集回報最終表現。
3. **重新設計預測問題**：避免用睡眠衍生指標預測睡眠時長；改以「前一日活動 →
   當日睡眠」的時序設計，並明確區分描述性與預測性目標。
4. **強化資料品質**：蒐集人口學共變項（年齡、性別等）以控制干擾；統一異常值準則；
   妥善處理哨兵值與近零變異欄位。
5. **誠實的因子分析**：在 KMO 偏低與 Heywood case 下，重新挑選變數集或改採其他降維方法，
   並完整報告適切性指標。
6. **工程重構**：將分析邏輯抽到 `src/` 模組、notebook 僅作敘事；以設定檔管理路徑；
   加入 `requirements.txt`、隨機種子、基本資料不變式測試與型別檢查。

---

> **作者註**：以上限制不影響本專案作為「完整資料分析流程演練」的學習價值；
> 列出它們，是為了標示我對資料倫理、統計嚴謹性與工程品質的持續要求。
