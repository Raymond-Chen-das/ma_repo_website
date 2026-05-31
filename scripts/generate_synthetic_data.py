"""
合成假資料產生器 / Synthetic data generator
================================================

目的：讓 notebooks/ 內的分析程式碼「可以被 clone 下來直接跑」，
      但完全不接觸真實的 Garmin 專有資料。

This script generates a FAKE dataset with the **same schema** as the real
`sleep_activity_merged_final.csv`, drawing each column from the aggregate
distribution (min / max / mean / std) of the original data.

⚠️ 重要說明 / IMPORTANT
    - 這是「邊際分布」模擬：每個欄位各自獨立抽樣，**並未保留欄位之間的相關
      結構**。因此用這份假資料跑出來的 PCA / 聚類 / ANOVA / 迴歸結果，
      **不會等於**報告中的真實結論。它只是用來「示範程式碼能正確執行」。
    - The synthetic data reproduces marginal distributions only; it does NOT
      preserve inter-variable correlations, so analytical results will differ
      from those reported. It exists solely to make the pipeline runnable.

用法 / Usage:
    python scripts/generate_synthetic_data.py
    python scripts/generate_synthetic_data.py --rows 1031 --out sleep_activity_merged_final.csv
"""

import argparse
import csv
import random
from datetime import datetime, timedelta

SEED = 42
N_USERS = 71
EPOCH_MIN = 1586361600  # 2020-04
EPOCH_MAX = 1685548800  # 2023-06

# (name, min, max, mean, std, is_int, n_missing_in_original)
NUMERIC = [
    ("_activity_status", 0, 6, 5.9593, 0.4927, True, 0),
    ("activeKilocalories", 0, 2828, 194.1823, 311.0121, True, 0),
    ("bmrKilocalories", 2, 2355, 936.3889, 665.7337, True, 0),
    ("steps", 0, 23640, 2800.0495, 3701.4605, True, 0),
    ("distanceInMeters", 0, 23445, 2028.4103, 2718.4436, True, 0),
    ("durationInSeconds", 180, 86400, 45357.9631, 30358.436, True, 0),
    ("activeTimeInSeconds", 0, 23275, 3247.2027, 3958.1456, True, 0),
    ("startTimeInSeconds", EPOCH_MIN, EPOCH_MAX, 1613601818, 27942960, True, 0),
    ("startTimeOffsetInSeconds", 28800, 28800, 28800, 0, True, 0),
    ("moderateIntensityDurationInSecon", 0, 18180, 241.1639, 907.9198, True, 0),
    ("vigorousIntensityDurationInSecon", 0, 5640, 84.3259, 450.7628, True, 0),
    ("floorsClimbed", 0, 52, 3.9981, 6.8653, True, 0),
    ("minHeartRateInBeatsPerMinute", 30, 94, 54.4305, 8.2527, True, 2),
    ("maxHeartRateInBeatsPerMinute", 50, 210, 114.3644, 21.9428, True, 2),
    ("averageHeartRateInBeatsPerMinute", 43, 110, 71.7289, 9.9919, True, 2),
    ("restingHeartRateInBeatsPerMinute", 34, 94, 60.8727, 8.4589, True, 2),
    ("stepsGoal", 2350, 15260, 7912.1242, 2427.4824, True, 0),
    ("intensityDurationGoalInSeconds", 9000, 9000, 9000, 0, True, 0),
    ("floorsClimbedGoal", 2, 10, 9.775, 1.0806, True, 0),
    ("averageStressLevel", -1, 90, 27.6935, 14.5175, True, 0),
    ("maxStressLevel", 0, 99, 83.4447, 17.9022, True, 1),
    ("stressDurationInSeconds", 0, 76380, 14724.3275, 13878.2707, True, 5),
    ("restStressDurationInSeconds", 0, 65340, 22372.2146, 11067.689, True, 6),
    ("activityStressDurationInSeconds", 0, 44400, 7998.8304, 7525.0167, True, 5),
    ("lowStressDurationInSeconds", 0, 24780, 5554.4956, 5454.6285, True, 10),
    ("mediumStressDurationInSeconds", 0, 35400, 6012.819, 6270.2008, True, 20),
    ("highStressDurationInSeconds", 0, 54660, 3471.6236, 5502.328, True, 64),
    ("sleep_hours", 4, 13.9167, 7.4717, 1.4549, False, 0),
    ("deepSleepDurationInSeconds", 0, 29520, 4306.4403, 4478.7055, True, 0),
    ("lightSleepDurationInSeconds", 0, 40380, 17514.8788, 5100.173, True, 0),
    ("remSleepInSeconds", 0, 17820, 4984.4229, 3741.0218, True, 0),
    ("sleep_efficiency", 0, 1, 0.9971, 0.0336, False, 0),
    ("deep_sleep_ratio", 0, 1, 0.1665, 0.1716, False, 0),
]

# exact column order of the real file
COLUMNS = [
    "_userId", "_upload_datetime", "_activity_status", "summaryId_activity",
    "date", "activityType", "activeKilocalories", "bmrKilocalories", "steps",
    "distanceInMeters", "durationInSeconds", "activeTimeInSeconds",
    "startTimeInSeconds", "startTimeOffsetInSeconds",
    "moderateIntensityDurationInSecon", "vigorousIntensityDurationInSecon",
    "floorsClimbed", "minHeartRateInBeatsPerMinute", "maxHeartRateInBeatsPerMinute",
    "averageHeartRateInBeatsPerMinute", "restingHeartRateInBeatsPerMinute",
    "stepsGoal", "intensityDurationGoalInSeconds", "floorsClimbedGoal",
    "averageStressLevel", "maxStressLevel", "stressDurationInSeconds",
    "restStressDurationInSeconds", "activityStressDurationInSeconds",
    "lowStressDurationInSeconds", "mediumStressDurationInSeconds",
    "highStressDurationInSeconds", "stressQualifier", "merge_date",
    "summaryId_sleep", "sleep_hours", "sleep_type", "deepSleepDurationInSeconds",
    "lightSleepDurationInSeconds", "remSleepInSeconds", "sleep_efficiency",
    "deep_sleep_ratio",
]

NUMERIC_BY_NAME = {n[0]: n for n in NUMERIC}
ACTIVITY_TYPES = ["SEDENTARY", "WALKING"]
SLEEP_TYPES = ["night_sleep", "night_sleep_early", "nap"]
STRESS_QUALIFIERS = ["CALM", "BALANCED", "STRESSFUL", "UNKNOWN", "CALM_AWAKE",
                     "BALANCED_AWAKE", "STRESSFUL_AWAKE", "RESTFUL"]


def sample_numeric(spec):
    _, lo, hi, mean, std, is_int, _ = spec
    if std == 0:
        v = mean
    else:
        v = random.gauss(mean, std)
        v = max(lo, min(hi, v))
    return int(round(v)) if is_int else round(v, 6)


def main():
    ap = argparse.ArgumentParser(description="Generate synthetic Garmin-like dataset")
    ap.add_argument("--rows", type=int, default=1031)
    ap.add_argument("--out", default="sleep_activity_merged_final.csv")
    ap.add_argument("--seed", type=int, default=SEED)
    args = ap.parse_args()
    random.seed(args.seed)

    user_ids = [f"u{idx:03d}" for idx in range(1, N_USERS + 1)]
    base = datetime(2020, 10, 15)

    rows = []
    for i in range(args.rows):
        d = base + timedelta(days=random.randint(0, 960))
        dstr = d.strftime("%Y-%m-%d")
        row = {}
        for col in COLUMNS:
            if col == "_userId":
                row[col] = random.choice(user_ids)
            elif col in ("_upload_datetime",):
                row[col] = d.strftime("%Y-%m-%d %H:%M:%S")
            elif col in ("date", "merge_date"):
                row[col] = dstr
            elif col == "summaryId_activity":
                row[col] = f"act_{i:05d}"
            elif col == "summaryId_sleep":
                row[col] = f"slp_{i:05d}"
            elif col == "activityType":
                row[col] = random.choice(ACTIVITY_TYPES)
            elif col == "sleep_type":
                row[col] = random.choice(SLEEP_TYPES)
            elif col == "stressQualifier":
                row[col] = random.choice(STRESS_QUALIFIERS)
            else:
                spec = NUMERIC_BY_NAME[col]
                # inject missingness proportional to the original
                if spec[6] and random.random() < (spec[6] / 1031.0):
                    row[col] = ""
                else:
                    row[col] = sample_numeric(spec)
        rows.append(row)

    with open(args.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(rows)

    print(f"[OK] Wrote {len(rows)} synthetic rows -> {args.out}")
    print("     (marginal distributions only; results will NOT match the real report)")


if __name__ == "__main__":
    main()
