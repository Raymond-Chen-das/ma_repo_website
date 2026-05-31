# 資料說明 / Data Statement

## 為什麼這個倉庫看不到原始資料？

本專案分析的是 **Garmin 運動手環的穿戴式裝置資料**，屬於**第三方專有資料**，
且包含個人健康紀錄（睡眠作息、心率、壓力等）。基於資料授權與隱私考量，
**原始資料與任何逐筆（個人層級）紀錄一律不納入本倉庫**。

This project analyses **Garmin wearable-device data**, which is **third-party
proprietary data** containing personal health records (sleep, heart rate,
stress). For licensing and privacy reasons, **the raw data and any
row-level (individual) records are intentionally excluded** from this repository.

## 倉庫裡實際包含什麼

| 類型 | 內容 | 是否公開 |
|------|------|----------|
| 分析程式碼 | `notebooks/` 內 4 份 notebook（清理 → EDA → 多變量 → 因子分析） | ✅ 公開（輸出已清空，不含逐筆資料） |
| 彙總結果 | `results/` 內 6 個**變數層級**統計檔（相關矩陣、PCA 負載、因子負載、共同性等） | ✅ 公開（無個人識別、無逐筆紀錄） |
| 視覺化報告 | `docs/` 互動式儀表板（GitHub Pages） | ✅ 公開（僅顯示彙總數字） |
| 原始 / 逐筆資料 | `dailies` / `sleeps` / `heartrate` / 合併後逐筆檔 | ❌ **不公開**（見 `.gitignore`） |

## 原始資料的結構（schema）

合併後主資料檔 `sleep_activity_merged_final.csv` 共 **1,031 筆 × 42 欄**，
時間範圍 2020/10 – 2023/06，涵蓋 71 位使用者。主要欄位群：

- **識別 / 時間**：`_userId`, `date`, `startTimeInSeconds`, `summaryId_*`
- **活動**：`steps`, `activeKilocalories`, `distanceInMeters`, `activeTimeInSeconds`, `floorsClimbed`
- **心率**：`min/max/average/restingHeartRateInBeatsPerMinute`
- **壓力**：`averageStressLevel`, `maxStressLevel`, `*StressDurationInSeconds`
- **睡眠**：`sleep_hours`, `deep/light/remSleep*`, `sleep_efficiency`, `deep_sleep_ratio`

## 想自己跑跑看程式碼？用合成假資料

由於真實資料不公開，倉庫附了一支**合成假資料產生器**，可產生「欄位、分布
類似，但完全虛構」的資料，讓你能完整執行整條分析流程：

```bash
python scripts/generate_synthetic_data.py
# 產生 sleep_activity_merged_final.csv（預設 1031 筆）
```

> ⚠️ 合成資料只還原「各欄位的邊際分布」，**沒有保留欄位間的相關結構**，
> 因此跑出來的 PCA / 聚類 / ANOVA / 迴歸結果**不會等於報告中的真實結論**。
> 它的用途是「驗證程式碼能正確執行」，而非重現研究發現。
>
> The synthetic data preserves marginal distributions only (no inter-variable
> correlations), so analytical outputs will differ from the reported findings.
> It exists to make the pipeline runnable, not to reproduce results.

真實的分析結論請見 `docs/` 互動式報告與專案中的 PDF 深度報告。
