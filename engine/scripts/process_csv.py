from pathlib import Path
import numpy as np
import pandas
from convergent_engine import decompose_votes, cluster_users, get_comment_consensus


def process_csv(comments_csv: Path, votes_matrix_csv: Path):
    content_df = pandas.read_csv(comments_csv)
    votes_matrix_df = pandas.read_csv(votes_matrix_csv)

    comments = content_df.set_index("comment-id")["comment-body"]

    comment_ids = content_df["comment-id"].astype(str).tolist()
    votes_matrix = votes_matrix_df.set_index("participant")[comment_ids]
    votes_matrix = votes_matrix.values

    votes_matrix_nonan = np.nan_to_num(votes_matrix, nan=0)

    reduced = decompose_votes(votes_matrix_nonan)
    kmeans = cluster_users(reduced)

    comment_consensus = [
        get_comment_consensus(votes_matrix, i, kmeans.labels_, "group_aware")
        for i in range(len(comments))
    ]

    return reduced, kmeans.labels_, comments, votes_matrix, comment_consensus


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Process polis-exported CSV files for clustering and analysis."
    )
    parser.add_argument(
        "comments_csv", type=Path, help="Path to the comments CSV file."
    )
    parser.add_argument(
        "votes_matrix_csv", type=Path, help="Path to the votes matrix CSV file."
    )
    parser.add_argument(
        "report_dir", type=Path, help="Directory to save the report files."
    )

    args = parser.parse_args()

    reduced, labels, comments, votes_matrix, comment_consensus = process_csv(
        args.comments_csv, args.votes_matrix_csv
    )

    report_dir = args.report_dir
    report_dir.mkdir(parents=True, exist_ok=True)

    reduced_df = pandas.DataFrame(reduced, columns=["x", "y"])
    reduced_df.to_csv(report_dir / "reduced.csv")

    labels_df = pandas.DataFrame(labels, columns=["cluster"])
    labels_df.to_csv(report_dir / "labels.csv")

    consensus_df = pandas.DataFrame(
        comment_consensus, columns=["consensus"], index=comments.index
    )
    consensus_df["comment"] = comments.values
    consensus_df = consensus_df.sort_values(by="consensus", ascending=False)
    consensus_df.to_csv(report_dir / "comment_consensus.csv")
