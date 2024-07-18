## pod shell
kubectl exec -it -n igw-platform -c igw-common-auth $(kubectl get po -n igw-platform | grep igw-common-auth | cut -d" " -f1) sh
## pod logs
kubectl logs -n igw-platform -c igw-common-auth $(kubectl get po -n igw-platform | grep igw-common-auth | cut -d" " -f1) | grep GWCA~4db81232-e45f-4a88-bd34-c4d79d41aa7a



## restart pod
kubectl rollout restart deployment -n igw-platform igw-common-auth
## running pods
kubectl get po -n igw-platform 

###### Secrets #######

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
## delete secret
kubectl delete secret <name> -n igw-platform

oneTrustRequestInformationToken