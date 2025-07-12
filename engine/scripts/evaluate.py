from pathlib import Path
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


def get_difference_symbol(pred, target):
    """
    Returns a string indicating the difference between predicted and target values.
    """
    if pred == target:
        return "= 0"
    elif pred < target:
        return f"- {abs(pred - target):.2f}"
    else:
        return f"+ {abs(pred - target):.2f}"


def get_rank_symbol(rank_pred, rank_target):
    """
    Returns a string indicating the rank difference between predicted and target.
    """
    if rank_pred == rank_target:
        return "= 0"
    elif rank_pred < rank_target:
        return f"&darr; {abs(rank_pred - rank_target)}"
    else:
        return f"&uarr; {abs(rank_pred - rank_target)}"


def evaluate_consensus(
    report_dir: Path,
):
    consensus_scores_path = report_dir / "comment_consensus.csv"
    consensus_pred = pd.read_csv(consensus_scores_path, index_col=0)

    comments = consensus_pred["comment"]
    consensus_pred = consensus_pred["consensus"].to_dict()

    consensus_target_path = report_dir / "consensus_target.json"
    with open(consensus_target_path, "r") as f:
        consensus_target = json.load(f)
    consensus_target = {int(k): v for k, v in consensus_target.items()}

    common_indices = list(
        set(consensus_pred.keys()).intersection(set(consensus_target.keys()))
    )
    consensus_pred = {k: v for k, v in consensus_pred.items() if k in common_indices}
    consensus_target = {
        k: v for k, v in consensus_target.items() if k in common_indices
    }
    comments = comments[common_indices].tolist()

    mean_consensus_pred = np.mean(list(consensus_pred.values()))
    mean_consensus_target = np.mean(list(consensus_target.values()))

    std_consensus_pred = np.std(list(consensus_pred.values()))
    std_consensus_target = np.std(list(consensus_target.values()))

    consensus_pred = [consensus_pred[k] for k in common_indices]
    consensus_target = [consensus_target[k] for k in common_indices]

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

    rank_pred = np.argsort(np.argsort(normalized_pred)) + 1
    rank_target = np.argsort(np.argsort(normalized_target)) + 1

    rendered = pd.DataFrame(
        {
            "Index": common_indices,
            "Comment": comments,
            "Predicted Consensus": normalized_pred,
            "Target Consensus": normalized_target,
            "Rank Predicted": rank_pred,
            "Rank Target": rank_target,
            "Difference (Consensus)": [
                get_difference_symbol(pred, target)
                for pred, target in zip(normalized_pred, normalized_target)
            ],
            "Rank Difference": [
                get_rank_symbol(rank_p, rank_t)
                for rank_p, rank_t in zip(rank_pred, rank_target)
            ],
        }
    )
    rendered = rendered.sort_values(by="Target Consensus", ascending=False).reset_index(
        drop=True
    )

    rendered_path = report_dir / "consensus_evaluation.html"
    rendered.to_html(rendered_path, index=False, escape=False)

    indices = np.argsort(normalized_target)
    sorted_normalized_pred = np.array(normalized_pred)[indices]
    sorted_normalized_target = np.array(normalized_target)[indices]

    plt_indices = np.arange(len(sorted_normalized_pred))

    plt.figure(figsize=(7, 7))
    plt.scatter(
        plt_indices, sorted_normalized_pred, label="Predicted Consensus", marker="o"
    )
    plt.scatter(
        plt_indices, sorted_normalized_target, label="Target Consensus", marker="x"
    )
    for i in range(len(sorted_normalized_pred)):
        plt.plot(
            [plt_indices[i], plt_indices[i]],
            [sorted_normalized_pred[i], sorted_normalized_target[i]],
            color="gray",
            linestyle="--",
        )
    plt.xlabel("Index (Sorted by Target Consensus)")
    plt.ylabel("Normalized Consensus Score")
    plt.title("Consensus Scores Comparison")
    plt.legend()
    plt.grid()
    plt.savefig(report_dir / "consensus_comparison.png")

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
