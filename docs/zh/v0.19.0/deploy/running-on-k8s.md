# Running on Kubernetes

This document describes how to run a HStreamDB cluster on Kubernetes. We will assume
that you have a basic understanding of Kubernetes. At the end of this document, you
will have a HStreamDB cluster running on Kubernetes, and in doing so, familiarize yourself
with how HStreamDB works on Kubernetes.

::: tip

For production environment, please refer to [Deploy with Helm](#deploy-with-helm) section.

:::

## Prerequisites

Before starting, you need to have a Kubernetes cluster running. If you don't have one,
we recommend using [minikube](https://minikube.sigs.k8s.io/docs/start/), [microk8s](https://microk8s.io/), etc.
They are easy to install and use in a local environment. For production environment,
Please refer to the official documentation of Kubernetes or other cloud providers.

## HStream Operator

### Introduction

HStream Operator is a Kubernetes operator designed to manage and maintain the HStreamDB cluster within a Kubernetes environment. The HStreamDB cluster comprises of several components including:

- HMeta
- AdminServer
- [HServer](../reference/architecture/hserver.md)
- [HStore](../reference/architecture/hstore.md)

It simplifies the deployment, scaling, and operations of HStreamDB clusters on Kubernetes, making it easier for users to manage their HStream components effectively. We use and get benefits from [kubebuilder](https://book.kubebuilder.io/) to simplify the development of the operator.

### Installation

We recommend using the [Helm](https://helm.sh/) package manager to install the HStreamDB operator on your Kubernetes cluster.

> Currently, we haven't released the chart because of this operator is still at an early stage. So you
> need to clone this repo and install the chart from the local directory.

```sh
git clone https://github.com/hstreamdb/hstream-operator.git && cd hstream-operator
helm install hstream-operator deploy/charts/hstream-operator -n hstream-operator-system --create-namespace
```

Every releases will be published to [GitHub Releases](https://github.com/hstreamdb/hstream-operator/releases), you
can also install the operator with the following command:

```sh
kubectl create -f https://github.com/hstreamdb/hstream-operator/releases/download/0.0.9/hstream-operator.yaml
```

> You can also use server-side apply to install the operator by running `kubectl apply --server-side`, please refer to
> [comparison-with-client-side-apply](https://kubernetes.io/docs/reference/using-api/server-side-apply/#comparison-with-client-side-apply) for more details.

Replace `0.0.9` with the version you want to install.

### Check the status

You can check the status of the operator by running:

```sh
kubectl get pods -l "control-plane=hstream-operator-manager" -n hstream-operator-system
```

Expected output:

```sh
NAME                                                  READY   STATUS    RESTARTS      AGE
hstream-operator-controller-manager-f989476d4-qllfs   1/1     Running   1 (16h ago)   16h
```

After the operator is running, you can create a HStreamDB cluster by applying a `HStreamDB` resource. We will
introduce the `HStreamDB` resource in the next section.

## Deploy a HStreamDB Cluster

By applying a `HStreamDB` resource, the operator we create in the previous section will create a HStreamDB
cluster for us. We provide a sample `HStreamDB` resource in <https://github.com/hstreamdb/hstream-operator/blob/main/config/samples/hstreamdb.yaml>, you can apply it by running:

```sh
kubectl apply -f https://raw.githubusercontent.com/hstreamdb/hstream-operator/main/config/samples/hstreamdb.yaml
```

After a few seconds, you can check the status of the cluster by running:

```sh
kubectl get po -n hstreamdb
```

```sh
NAME                                             READY   STATUS    RESTARTS   AGE
hstreamdb-sample-hmeta-2                         1/1     Running   0          7m45s
hstreamdb-sample-hmeta-0                         1/1     Running   0          7m45s
hstreamdb-sample-hmeta-1                         1/1     Running   0          7m45s
hstreamdb-sample-admin-server-6c547b85c7-7h9gw   1/1     Running   0          7m34s
hstreamdb-sample-hstore-0                        1/1     Running   0          7m34s
hstreamdb-sample-hstore-1                        1/1     Running   0          7m34s
hstreamdb-sample-hstore-2                        1/1     Running   0          7m34s
hstreamdb-sample-hserver-0                       1/1     Running   0          7m18s
hstreamdb-sample-hserver-2                       1/1     Running   0          7m18s
hstreamdb-sample-hserver-1                       1/1     Running   0          7m18s
```

If all the pods are running, congratulations, you have successfully deployed a HStreamDB cluster on Kubernetes.

## Deploy with Helm

For production environment, we recommend using Helm to deploy HStreamDB cluster. We provide a Helm chart for
deploying HStreamDB cluster, you can find the chart repo at <https://github.com/hstreamdb/helm-charts>.

### Add Chart

```sh
helm repo add hstreamdb https://hstreamdb.github.io/helm-charts
```

For updating the repo, you can run:

```sh
helm repo update
```

This will update all the repo in your local machine, include hstreamdb repo.

For searching different versions of the chart, you can run:

```sh
helm search repo hstreamdb/hstreamdb
```

### Install Chart

::: code-group

```sh [minikube]
helm install hstreamdb hstreamdb/hstreamdb --namespace hstreamdb --create-namespace
```

```sh [microk8s]
helm install hstreamdb hstreamdb/hstreamdb --namespace hstreamdb --create-namespace --set storageClassName=microk8s-hostpath
```

:::

After installing the chart, you can check the status of the cluster by running:

```sh
kubectl get po -n hstreamdb
```

Now you have successfully deployed a HStreamDB cluster on Kubernetes with Helm.

## Helm Chart Configuration

Refer to <https://github.com/hstreamdb/helm-charts/blob/main/charts/hstreamdb/README.md> for more details.
It contains all the configuration options for the chart.

## Kafka Mode

HStreamDB can be deployed in Kafka mode, which means that HStreamDB will use Kafka protocol to communicate with
the clients. To deploy HStreamDB in Kafka mode, you need to set `clusterConfig.kafkaMode` to `true`:

```sh
helm install hstreamdb hstreamdb/hstreamdb --namespace hstreamdb --create-namespace --set clusterConfig.kafkaMode=true
```

## Enable Console

HStreamDB provides a web console for users to manage their HStreamDB cluster. To enable the console, you need to
set `console.enabled` to `true`:

```sh
helm install hstreamdb hstreamdb/hstreamdb --namespace hstreamdb --create-namespace --set console.enabled=true
```
