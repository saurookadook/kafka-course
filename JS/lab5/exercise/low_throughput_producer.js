const { Kafka, Partitioners } = require('kafkajs');
const { performance } = require('perf_hooks');

const kafka = new Kafka({
    brokers: ['localhost:9092', 'localhost:9093'],
    // NOTE: needed to use `LISTENER_HOST`s from `docker-compose.yaml`
    // brokers: ['localhost:29092', 'localhost:29093']
    // brokers: ['broker-1:29092', 'broker-2:29093']
    clientId: 'lab5-producer',
    retry: {
        maxInFlightRequests: 5
    }
});

const producer = kafka.producer({
    createPartitioner: Partitioners.DefaultPartitioner,
    // maxInFlightRequests: 5
});

// TODO: probably a better way to determine producer vs consumer
function handleCaughtException(e, source) {
    console.error(`[disaster-example/${source}] ${e.message}`, e);
}

function sendMessages(count) {
    const messages = [];
    for (let i = 0; i < 1000; i++) {
        messages.push({ key: `count-${count}`, value: `i-${i}` });
    }

    console.log(`Sending messages for count ${count}...`);
    return producer.send({
        acks: 1,
        topic: 'throughput',
        messages: messages
    });
}

const run = async () => {
    await producer.connect();

    const startTime = Date.now();
    let count = 0;
    while (Date.now() - startTime < 10000) {
        await sendMessages(count).catch((e) => handleCaughtException(e, 'low_throughput_producer'));
        count++;
    }
    console.log(`I have sent ${count*1000} messages in 10 seconds`)
    console.log('Shutting down producer...');
    process.exit(1);
};

run().catch((e) => handleCaughtException(e, 'run'));
