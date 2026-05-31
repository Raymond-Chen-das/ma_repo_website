# Garmin 運動手環多變量分析專案

> 以 71 位使用者、2.7 年的 Garmin 穿戴式裝置資料，建立一條完整的多變量分析
> pipeline：資料清理 → 探索性分析 → PCA / 聚類 / ANOVA / 迴歸 → 驗證性因子分析，
> 並產出互動式視覺化報告。

📊 **互動式報告（GitHub Pages）**：<https://raymond-chen-das.github.io/garmin-multivariate-analysis/>

---

## 專案亮點

- **完整資料工程**：跨日與時區修正（資料完整性 1.8% → 95.5%）、IQR + 生理邊界
  異常值篩選、重複睡眠去重、睡眠↔活動配對（成功率 86.9%）。
- **嚴謹的多變量統計**：PCA 降維解決共線性、K-means 行為分群、ANOVA 群體差異
  檢驗、迴歸建模。
- **重視建模陷阱**：明確處理 **資料洩漏 (data leakage)** 問題，並以**交叉驗證 R²**
  誠實呈現預測模型的限制（而非只報訓練集的漂亮數字）。
- **驗證性因子分析**：Bartlett 檢驗、KMO、VARIMAX / OBLIMIN 轉軸，交叉驗證
  PCA 發現的「睡眠品質 vs 睡眠時長」權衡結構。

## 主要發現

| 階段 | 發現 |
|------|------|
| EDA | 活動指標間高度共線（r 最高達 0.99），需以 PCA 處理 |
| PCA | 4 個主成分累積解釋 ~99.8% 變異，揭示活動／睡眠潛在因子 |
| 聚類 | 分出「平衡型」與「活躍型」兩群，輪廓係數 0.468 |
| ANOVA | 兩群在睡眠時長上差異顯著（p < 0.01） |
| 迴歸 | 交叉驗證 R² 為負 → 誠實指出以行為指標預測睡眠時長的限制 |
| 因子分析 | 萃取 2 個睡眠因子，總解釋變異 68.5%，呼應 PCA 結果 |

## 專案結構

```
.
├── notebooks/                     # 分析程式碼（Python / Jupyter）
│   ├── 01_data_cleaning_資料清理.ipynb
│   ├── 02_eda_探索性資料分析.ipynb
│   ├── 03_multivariate_多變量統計分析.ipynb
│   └── 04_factor_analysis_驗證性因子分析.ipynb
├── results/                       # 變數層級彙總結果（可安全公開）
│   ├── correlation_matrix.csv
│   ├── fixed_pca_loadings.csv
│   ├── sleep_factor_loadings.csv
│   ├── sleep_communalities.csv
│   ├── sleep_factor_analysis_summary.csv
│   └── cleaning_statistics.csv
├── scripts/
│   └── generate_synthetic_data.py # 合成假資料產生器（讓程式碼可被執行）
├── docs/                          # 互動式視覺化報告（GitHub Pages）
├── DATA.md                        # 資料來源、隱私與 schema 說明
├── LIMITATIONS.md                 # 研究限制與未來改進（誠實的自我檢視）
└── LICENSE                        # MIT（僅適用於程式碼與視覺化內容）
```

## 技術棧

- **分析**：Python（pandas / numpy / scikit-learn / factor_analyzer / scipy）
- **視覺化**：Plotly（notebook）、HTML5 / CSS3 / JavaScript + Chart.js（報告）
- **方法**：PCA、K-means、ANOVA、線性迴歸、驗證性因子分析

## 如何執行

真實資料屬第三方專有資料，不隨倉庫提供（詳見 [`DATA.md`](DATA.md)）。
你可以用內附的合成假資料完整跑過整條流程：

```bash
# 1) 產生與真實資料同 schema 的合成假資料
python scripts/generate_synthetic_data.py

# 2) 依序執行 notebooks/ 內的 4 份 notebook
```

> 合成資料僅還原各欄位的邊際分布、未保留欄位間相關性，因此分析結果**不會等於**
> 報告中的真實結論——它只是用來示範程式碼可正確執行。

## 資料保護措施 / Data Protection

本專案處理的是**第三方專有的個人健康資料**，因此在公開前採取了以下保護措施：

- ✅ **原始與逐筆資料一律不上傳**：所有含個人紀錄的檔案皆由 `.gitignore` 排除。
- ✅ **只公開變數層級的彙總結果**：`results/` 內僅含相關矩陣、因子負載等無個人識別的統計量。
- ✅ **notebook 輸出全部清空**：避免 `print(df)` 等指令把逐筆紀錄內嵌進版本控制。
- ✅ **去識別化檢查**：移除了報告中殘留的使用者代碼（如儀表板曾出現的單一使用者 ID）。
- ✅ **可重現但不洩密**：附合成假資料產生器，讓他人能執行流程而不接觸真實資料。

> 資料治理與隱私保護是資料科學專業的一部分；此處的取捨刻意從嚴。

## 授權 / License

- **程式碼與視覺化內容**：採用 [MIT License](LICENSE)，歡迎自由使用、修改與分享。
- **Garmin 原始資料**：為第三方專有資料，**未包含於本倉庫，亦不在本授權範圍內**。
  詳見 [`DATA.md`](DATA.md)。

## 已知限制 / Known Limitations

本專案為一年級(2025年)的課程作品，已主動整理出資料、統計方法與工程實作上的限制與未來改進方向，
詳見 [`LIMITATIONS.md`](LIMITATIONS.md)。

---

**作者**：CHIA HSIANG, CHEN ｜ 東吳大學資料科學系在職專班
**性質**：課程學習專案（多變量分析），同時作為作品集展示。
