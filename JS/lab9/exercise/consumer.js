const { Kafka, logLevel } = require('kafkajs');
const { KafkaAvro } = require('kafkajs-avro');
const { handleCaughtException } = require('../../_common');

const kafka = new KafkaAvro({
    avro: {
        url: "http://localhost:8081"
    },
    brokers: ['localhost:9092', 'localhost:9093'],
    clientId: 'lab9-consumer',
    logLevel: logLevel.DEBUG
});

const argv = require('minimist')(process.argv.slice(2));
const topic = argv["topic"];

if (topic === undefined) {
  console.log("Topic must be set as parameter --topic")
  process.exit(1);
}

const consumer = kafka.avro.consumer({ groupId: `lab9-consumer-${topic}` });

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} - in ${message.key}, there is a ${message.value}`);
        },
    });
}

run()
    .then(() => console.log('Done! :]'))
    .catch(e => handleCaughtException(e, 'consumer'));
