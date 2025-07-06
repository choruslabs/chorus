import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score


def decompose_votes(vote_matrix: np.ndarray):
    pca = PCA(n_components=2)

    transformed = pca.fit_transform(vote_matrix)

    total_votes = np.sum(np.abs(vote_matrix))
    vote_scale = np.sum(np.abs(vote_matrix), axis=1)
    vote_scale = np.sqrt(total_votes / vote_scale)

    return transformed * vote_scale[:, None]


def cluster_users(reduced: np.ndarray):
    best_silhouette = -1
    best_kmeans = None
    for n_clusters in range(2, min(6, len(reduced))):
        kmeans = KMeans(n_clusters=n_clusters)
        kmeans.fit(reduced)
        silhouette = silhouette_score(reduced, kmeans.labels_)
        if silhouette > best_silhouette:
            best_silhouette = silhouette
            best_kmeans = kmeans

    return best_kmeans


def get_comment_consensus(
    votes_matrix: np.ndarray,
    comment_index: int,
    cluster_labels: np.ndarray = None,
    kind="group_aware",
):
    if kind == "group_aware":
        if cluster_labels is None:
            raise ValueError(
                "Cluster labels must be provided for group-aware consensus."
            )

        cluster_agree_probs = np.zeros(len(np.unique(cluster_labels)))

        for cluster in np.unique(cluster_labels):
            cluster_votes = votes_matrix[cluster_labels == cluster, comment_index]
            cluster_agree_probs[cluster] = np.mean(cluster_votes == 1)

        return np.prod(cluster_agree_probs)

    elif kind == "simple":
        agree_probs = np.zeros(votes_matrix.shape[0])

        for i in range(votes_matrix.shape[0]):
            agree_probs[i] = np.mean(votes_matrix[i, :] == 1)

        return np.prod(agree_probs)

    else:
        raise ValueError(f"Unknown kind: {kind}. Use 'group_aware' or 'simple'.")
