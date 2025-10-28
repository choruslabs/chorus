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
        return f"&uarr; {abs(rank_pred - rank_target)}"
    else:
        return f"&darr; {abs(rank_pred - rank_target)}"


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
    consensus_pred = [consensus_pred[i] for i in common_indices]
    consensus_target = [consensus_target[i] for i in common_indices]
    comments = comments[common_indices].tolist()

    mean_consensus_pred = np.mean(consensus_pred)
    mean_consensus_target = np.mean(consensus_target)

    std_consensus_pred = np.std(consensus_pred)
    std_consensus_target = np.std(consensus_target)

    print(f"Mean Consensus Prediction: {mean_consensus_pred}")
    print(f"Mean Consensus Target: {mean_consensus_target}")
    print()

    print(f"Std Consensus Prediction: {std_consensus_pred}")
    print(f"Std Consensus Target: {std_consensus_target}")
    print()

    mse = np.mean((np.array(consensus_pred) - np.array(consensus_target)) ** 2)
    corr = np.corrcoef(consensus_pred, consensus_target)[0, 1]

    print(f"Mean Squared Error: {mse}")
    print(f"Correlation: {corr}")

    rank_pred = np.argsort(np.argsort(consensus_pred)[::-1]) + 1
    rank_target = np.argsort(np.argsort(consensus_target)[::-1]) + 1

    rendered = pd.DataFrame(
        {
            "Index": common_indices,
            "Comment": comments,
            "Predicted Consensus": consensus_pred,
            "Target Consensus": consensus_target,
            "Rank Predicted": rank_pred,
            "Rank Target": rank_target,
            "Difference (Consensus)": [
                get_difference_symbol(pred, target)
                for pred, target in zip(consensus_pred, consensus_target)
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
    html = rendered.to_html(index=False, escape=False, border=0)
    css = """
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        body {
            font-family: Arial, sans-serif;
        }
    </style>
    """
    with open(rendered_path, "w") as f:
        f.write(f"<html><head>{css}</head><body>{html}</body></html>")

    top5_pred = np.argsort(consensus_pred)[-5:][::-1]
    top5_target = np.argsort(consensus_target)[-5:][::-1]
    top5_accuracy = np.mean([1 if i in top5_target else 0 for i in top5_pred])
    print(f"Top 5 Accuracy: {top5_accuracy:.2f}")

    top10_pred = np.argsort(consensus_pred)[-10:][::-1]
    top10_target = np.argsort(consensus_target)[-10:][::-1]
    top10_accuracy = np.mean([1 if i in top10_target else 0 for i in top10_pred])
    print(f"Top 10 Accuracy: {top10_accuracy:.2f}")

    indices = np.argsort(consensus_target)
    sorted_consensus_pred = np.array(consensus_pred)[indices]
    sorted_consensus_target = np.array(consensus_target)[indices]

    plt_indices = np.arange(len(sorted_consensus_pred))

    plt.figure(figsize=(7, 7))
    plt.scatter(
        plt_indices, sorted_consensus_pred, label="Predicted Consensus", marker="o"
    )
    plt.scatter(
        plt_indices, sorted_consensus_target, label="Target Consensus", marker="x"
    )
    for i in range(len(sorted_consensus_pred)):
        plt.plot(
            [plt_indices[i], plt_indices[i]],
            [sorted_consensus_pred[i], sorted_consensus_target[i]],
            color="gray",
            linestyle="--",
        )
    plt.xlabel("Index (Sorted by Target Consensus)")
    plt.ylabel("Consensus Score")
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
