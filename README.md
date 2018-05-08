# Setup

### CosmosDB

```
mongoimport --host $MONGODB_HOST --port $MONGODB_PORT --ssl --db $MONGODB_DBNAME --username $MONGODB_USERNAME --password $MONGODB_PASSWORD --collection subjects --type json --file ./seed-data/subjects.json --jsonArray

mongoimport --host $MONGODB_HOST --port $MONGODB_PORT --ssl --db $MONGODB_DBNAME --username $MONGODB_USERNAME --password $MONGODB_PASSWORD --collection sites --type json --file ./seed-data/sites.json --jsonArray

mongoimport --host $MONGODB_HOST --port $MONGODB_PORT --ssl --db $MONGODB_DBNAME --username $MONGODB_USERNAME --password $MONGODB_PASSWORD --collection ratings --type json --file ./seed-data/ratings.json --jsonArray

mongoimport --host $MONGODB_HOST --port $MONGODB_PORT --ssl --db $MONGODB_DBNAME --username $MONGODB_USERNAME --password $MONGODB_PASSWORD --collection currentsite --type json --file ./currentsite.json --jsonArray
```

### Build

```
cd ./app/api-sites
docker build -t chzbrgr71/build-api-sites:v1 .

cd ./app/api-subjects
docker build -t chzbrgr71/build-api-subjects:v1 .

cd ./app/api-ratings
docker build -t chzbrgr71/build-api-ratings:v1 .

cd ./app/web
docker build --build-arg BUILD_DATE=`date -u +"%Y-%m-%dT%H:%M:%SZ"` --build-arg VCS_REF=`git rev-parse --short HEAD` --build-arg IMAGE_TAG_REF=v4 -t chzbrgr71/build2018-rating-web:v4 .
```

### Run

```
docker run -d --name api-sites --env MONGODB_URI=<replace> --env PORT=8081 -p 8081:8081 chzbrgr71/api-sites:v4

docker run -d --name api-subjects --env MONGODB_URI=<replace> --env PORT=8082 -p 8082:8082 chzbrgr71/api-subjects:v4

docker run -d --name api-ratings --env MONGODB_URI=<replace> --env PORT=8083 -p 8083:8083 chzbrgr71/api-ratings:v4

docker run -d --name build2018-rating-web --env SITE_API=<replace> --env SUBJECT_API=<replace> --env RATING_API=<replace> -p 8080:8080 chzbrgr71/build2018-rating-web:v4
```

OR

must create secret first: 

```
kubectl create secret generic cosmos-db-secret --from-literal=uri=''

kubectl apply -f ./kubernetes/api-sites.yaml

kubectl apply -f ./kubernetes/api-subjects.yaml

kubectl apply -f ./kubernetes/api-ratings.yaml

kubectl apply -f ./kubernetes/web.yaml
```

### Rating POST

JSON Payload:

```
{
	"siteCode" : "PRG",
	"subjectRated" : "5a4f97f0dbbb7e24bd9a15d1",
	"rating" : 5
	"metadata" : {
		"sourcePhone" : "+14129531234",
		"state" : "PA",
		"country" : "US",
		"zip" : "15290",
		"toPhone" : "+14125671234",
		"origMessage" : "I love this!",
		"city" : "PITTSBURGH"
	}
}
```

```
faas-cli build -f ./sms-ratings.yml && faas-cli push -f ./sms-ratings.yml && faas-cli deploy -f ./sms-ratings.yml
```

# Contributing

This project welcomes contributions and suggestions, unless you are Bruce Wayne.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
