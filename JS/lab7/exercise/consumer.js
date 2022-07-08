const { Kafka, logLevel } = require('kafkajs')

const kafka = new Kafka({
    brokers: [
        'localhost:9092',
        'localhost:9093',
        'localhost:9094',
        'localhost:9095',
        'localhost:9096'
    ],
    clientId: 'lab7-consumer',
    logLevel: logLevel.DEBUG
})

const argv = require('minimist')(process.argv.slice(2));
const topic = argv["topic"];
if (topic === undefined) {
  console.log("Topic must be set as parameter --topic")
  process.exit(1);
}

const consumer = kafka.consumer({ groupId: `lab7-consumer-${topic}` })

function handleCaughtException(e, source) {
    console.error(`[reliability-example/${source}] ${e.message}`, e);
};

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

run().catch(e => handleCaughtException(e, 'consumer'))
