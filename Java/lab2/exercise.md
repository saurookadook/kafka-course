## Lab 2

0- In this folder run:

```
docker-compose up -d
```


1- Go to kafka folder and run kafka-topics

> _All responses from `http://localhost:8082/topics/my_orders/partitions`_

*Windows*

```
./bin/windows/kafka-topics.bat --create --bootstrap-server localhost:9092 \
--replication-factor 1 --partitions 3 --topic my_orders
```

*Unix*

```
./bin/kafka-topics.sh --create --bootstrap-server localhost:9092 \
--replication-factor 1 --partitions 3 --topic my_orders
```

2- Verify from the REST API that the topic was created.

3- Check in the REST API how the partitions are accomodated

> **NOTES**
>
> ```JSON
> [
>     {
>         "partition": 0,
>         "leader": 2,
>         "replicas": [
>             {
>                 "broker": 2,
>                 "leader": true,
>                 "in_sync": true
>             }
>         ]
>     },
>     {
>         "partition": 1,
>         "leader": 1,
>         "replicas": [
>             {
>                 "broker": 1,
>                 "leader": true,
>                 "in_sync": true
>             }
>         ]
>     },
>     {
>         "partition": 2,
>         "leader": 2,
>         "replicas": [
>             {
>                 "broker": 2,
>                 "leader": true,
>                 "in_sync": true
>             }
>         ]
>     }
> ]
> ```

4- Increase the replication by using the file `increase_replication.json`

> _NOTES: defines how partitions should be increased_

*Windows*

```sh
./bin/windows/kafka-reassign-partitions.bat --bootstrap-server localhost:9092 \
--reassignment-json-file increase_replication.json --execute
```

*Unix*

```sh
./bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 \
--reassignment-json-file increase_replication.json --execute
```

> **NOTES**
>
> ```JSON
> [
>     {
>         "partition": 0,
>         "leader": 2,
>         "replicas": [
>             {
>                 "broker": 1,
>                 "leader": false,
>                 "in_sync": true
>             },
>             {
>                 "broker": 2,
>                 "leader": true,
>                 "in_sync": true
>             }
>         ]
>     },
>     {
>         "partition": 1,
>         "leader": 1,
>         "replicas": [
>             {
>                 "broker": 1,
>                 "leader": true,
>                 "in_sync": true
>             },
>             {
>                 "broker": 2,
>                 "leader": false,
>                 "in_sync": true
>             }
>         ]
>     },
>     {
>         "partition": 2,
>         "leader": 2,
>         "replicas": [
>             {
>                 "broker": 2,
>                 "leader": true,
>                 "in_sync": true
>             }
>         ]
>     }
> ]
> ```
>
> ```
> [15:34:23] kafka_2.13-3.0.0
> // ♥ ./bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 --reassignment-json-file ~/Development/Personal/KafkaAcademy/kafka-course/Java/lab2/increase_replication.json --execute
> Current partition replica assignment
>
> {"version":1,"partitions":[{"topic":"my_orders","partition":0,"replicas":[1],"log_dirs":["any"]},{"topic":"my_orders","partition":1,"replicas":[2],"log_dirs":["any"]},{"topic":"my_orders","partition":2,"replicas":[1],"log_dirs":["any"]}]}
>
> Save this to use as the --reassignment-json-file option during rollback
> Successfully started partition reassignments for my_orders-0,my_orders-1,my_orders-2
> ```

5- Check again how the partitions are accomodated

6- Stop second broker and verify partitions reaccomodations. What happened with partition 2?

> **NOTES**

> ```JSON
> [
>     {
>         "partition": 0,
>         "leader": 1,
>         "replicas": [
>             {
>                 "broker": 1,
>                 "leader": true,
>                 "in_sync": true
>             },
>             {
>                 "broker": 2,
>                 "leader": false,
>                 "in_sync": false
>             }
>         ]
>     },
>     {
>         "partition": 1,
>         "leader": 1,
>         "replicas": [
>             {
>                 "broker": 1,
>                 "leader": true,
>                 "in_sync": true
>             },
>             {
>                 "broker": 2,
>                 "leader": false,
>                 "in_sync": false
>             }
>         ]
>     },
>     {
>         "partition": 2,
>         "leader": -1,
>         "replicas": [
>             {
>                 "broker": 2,
>                 "leader": false,
>                 "in_sync": true
>             }
>         ]
>     }
> ]
> ```

7- Restart second broker and verify how it is back online

> **NOTES**
>
> ```JSON
> [
>     {
>         "partition": 0,
>         "leader": 1,
>         "replicas": [
>             {
>                 "broker": 1,
>                 "leader": true,
>                 "in_sync": true
>             },
>             {
>                 "broker": 2,
>                 "leader": false,
>                 "in_sync": true
>             }
>         ]
>     },
>     {
>         "partition": 1,
>         "leader": 1,
>         "replicas": [
>             {
>                 "broker": 1,
>                 "leader": true,
>                 "in_sync": true
>             },
>             {
>                 "broker": 2,
>                 "leader": false,
>                 "in_sync": true
>             }
>         ]
>     },
>     {
>         "partition": 2,
>         "leader": 2,
>         "replicas": [
>             {
>                 "broker": 2,
>                 "leader": true,
>                 "in_sync": true
>             }
>         ]
>     }
> ]
> ```

8- Shut down everything:

```
docker-compose down
```

