## pod shell
kubectl exec -it -n igw-platform -c igw-common-auth $(kubectl get po -n igw-platform | grep igw-common-auth | cut -d" " -f1) sh
## pod logs
kubectl logs -n igw-platform -c igw-common-auth $(kubectl get po -n igw-platform | grep igw-common-auth | cut -d" " -f1) -f
## restart pod
kubectl rollout restart deployment -n igw-platform igw-common-auth