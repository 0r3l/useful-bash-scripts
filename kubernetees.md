## pod shell
kubectl exec -it -n igw-platform -c igw-common-auth $(kubectl get po -n igw-platform | grep igw-common-auth | cut -d" " -f1) sh
## pod logs
kubectl logs -n igw-platform -c igw-common-auth $(kubectl get po -n igw-platform | grep igw-common-auth | cut -d" " -f1) -f
## restart pod
kubectl rollout restart deployment -n igw-platform igw-common-auth
## running pods
kubectl get po -n igw-platform 
## create secret
kubectl create secret generic <secret_name> --from-literal=<key>=<Value> -n <Namespace>
## describe secret 
kubectl describe secret <secret_name> -n igw-platform
## change env vars
kubectl edit deployment -n igw-platform igw-common-auth
# get secrets list
kubectl get secret <name> -n igw-platform
## edit secret
kubectl edit secrets <name> -n igw-platform