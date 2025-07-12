from pathlib import Path
import json
import numpy as np
import pandas as pd


def evaluate_consensus(
    report_dir: Path,
):
    consensus_scores_path = report_dir / "comment_consensus.csv"
    consensus_pred = pd.read_csv(consensus_scores_path, index_col=0)
    consensus_pred = consensus_pred["consensus"].to_dict()

    consensus_target_path = report_dir / "consensus_target.json"
    with open(consensus_target_path, "r") as f:
        consensus_target = json.load(f)
    consensus_target = {int(k): v for k, v in consensus_target.items()}

    mean_consensus_pred = np.mean(list(consensus_pred.values()))
    mean_consensus_target = np.mean(list(consensus_target.values()))

    std_consensus_pred = np.std(list(consensus_pred.values()))
    std_consensus_target = np.std(list(consensus_target.values()))

    consensus_pred = sorted(consensus_pred.items(), key=lambda x: x[0])
    consensus_target = sorted(consensus_target.items(), key=lambda x: x[0])

    consensus_pred = [v for k, v in consensus_pred]
    consensus_target = [v for k, v in consensus_target]

    print(f"Mean Consensus Prediction: {mean_consensus_pred}")
    print(f"Mean Consensus Target: {mean_consensus_target}")
    print()

    print(f"Std Consensus Prediction: {std_consensus_pred}")
    print(f"Std Consensus Target: {std_consensus_target}")
    print()

    normalized_pred = (consensus_pred - np.mean(consensus_pred)) / np.std(
        consensus_pred
    )
    normalized_target = (consensus_target - np.mean(consensus_target)) / np.std(
        consensus_target
    )

    mse = np.mean((normalized_pred - normalized_target) ** 2)
    corr = np.corrcoef(normalized_pred, normalized_target)[0, 1]

    print(f"Mean Squared Error: {mse}")
    print(f"Correlation: {corr}")

    return {
        "mean_consensus_pred": mean_consensus_pred,
        "mean_consensus_target": mean_consensus_target,
        "std_consensus_pred": std_consensus_pred,
        "std_consensus_target": std_consensus_target,
        "mse": mse,
        "correlation": corr,
    }


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Evaluate consensus scores against target values."
    )
    parser.add_argument(
        "report_dir", type=Path, help="Directory containing the report files."
    )

    args = parser.parse_args()

    evaluate_consensus(args.report_dir)
