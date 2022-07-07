const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  brokers: ['localhost:9092', 'localhost:9093'],
  clientId: 'lab4-consumer',
})

const argv = require('minimist')(process.argv.slice(2));
const topic = argv["topic"]
if (topic === undefined) {
  console.log("Topic must be set as parameter --topic")
  process.exit(1);
}

const consumer = kafka.consumer({ groupId: `lab4-consumer-${topic}` })

function handleCaughtException(e, source) {
    console.error(`[disaster-example/${source}] ${e.message}`, e);
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
