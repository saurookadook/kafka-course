## Lab 4

0- In this folder run:

```
docker-compose up -d
```

1- Start from the previous lab copying the exercise folder to the exercise folder in this lab

```sh
cp -R ../lab3/exercise ./
```

_Note: In Windows do it with `copy` instead of `cp` and `\` instead of `/`._

~~Now run `mvn clean compile`~~

1a- Rename `index.js` to `producer.js`

2- Go to kafka folder and run `kafka-topics`:

*Windows*

```
./bin/windows/kafka-topics.bat --create --bootstrap-server localhost:9092 \
--replication-factor 2 --partitions 3 --topic hurricane

./bin/windows/kafka-topics.bat --create --bootstrap-server localhost:9092 \
--replication-factor 2 --partitions 3 --topic flood
```

*Unix*

```
./bin/kafka-topics.sh --create --bootstrap-server localhost:9092 \
--replication-factor 2 --partitions 3 --topic hurricane

./bin/kafka-topics.sh --create --bootstrap-server localhost:9092 \
--replication-factor 2 --partitions 3 --topic flood
```

3- Adapt the Producer to produce randomly to any of the two topics above with an intensity of the disaster between 1 and 10 and key the topic as well.

4- Add a `consumer.js` file and create a consumer in it that includes the topic to consume to in its `groupId`. ~~Make each consumer in the same consumer group.~~

5- Start 2 consumers for `hurricane` and 1 consumer for `flood`

_These can be in 3 seperate tabs._

> Just run `node exercise/consumer.js --topic <topic_name>` in each tab, substituting
> `<topic_name>` with `hurricane` in the first 2 and `flood` in the last one

~~*Windows*~~

~~```~~
~~./bin/windows/kafka-console-consumer.bat \~~
~~  --bootstrap-server localhost:9092 \~~
~~  --topic hurricane --from-beginning \~~
~~  --key-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --value-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --property print.key=true \~~
~~  --property key.separator=,~~

~~./bin/windows/kafka-console-consumer.bat \~~
~~  --bootstrap-server localhost:9092 \~~
~~  --topic flood --from-beginning \~~
~~  --key-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --value-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --property print.key=true \~~
~~  --property key.separator=,~~
~~```~~

~~*Unix*~~

~~```~~
~~./bin/kafka-console-consumer.sh \~~
~~  --bootstrap-server localhost:9092 \~~
~~  --topic hurricane --from-beginning \~~
~~  --key-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --value-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --property print.key=true \~~
~~  --property key.separator=", "~~

~~./bin/kafka-console-consumer.sh \~~
~~  --bootstrap-server localhost:9092 \~~
~~  --topic flood --from-beginning \~~
~~  --key-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --value-deserializer org.apache.kafka.common.serialization.StringDeserializer \~~
~~  --property print.key=true \~~
~~  --property key.separator=", "~~
~~```~~

6- Run the producer: `node producer.js`

7- Verify each correct consumer got the correct message. Did all consumer got the same amount of messages? What happened? How can we balance this?

> They did not, though I can't remember how to rebalance them lol

8- Kill the Consumer on the hurricane topic and start another one on the flood topic. Check the logs for the partition rebalance.

9- Shut down everything:

```
docker-compose down
```

