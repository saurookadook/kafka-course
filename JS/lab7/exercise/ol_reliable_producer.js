const { Kafka, Partitioners, logLevel } = require('kafkajs');
const { performance } = require('perf_hooks');

const OL_RELIABLE = 'ol_reliable';

const kafka = new Kafka({
    brokers: ['localhost:9092', 'localhost:9093'],
    clientId: `lab7-producer-${OL_RELIABLE}`,
    logLevel: logLevel.DEBUG,
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
    console.error(`[reliability-example/${source}] ${e.message}`, e);
}

function sendMessages(count) {
    const messages = [];
    for (let i = 0; i < 1000; i++) {
        messages.push({ key: `count-${count}`, value: `i-${i}` });
    }

    // console.log(`Sending messages for count ${count}...`);
    return producer.send({
        acks: 1,
        topic: BASICALLY_COVFEFE,
        messages: messages
    })
    .then(console.log).catch((e) => handleCaughtException(e, 'high_throughput_producer'));
}

function sendMessagesInTimedIntervals({ intervalInMs, maxIterations }) {
    return new Promise((resolve) => {
        let iterationCount = 0;
        setInterval(() => {
            if (maxIterations >= 0 && maxIterations <= iterationCount) {
                console.log('Stoping iterations');
                resolve(true);
            } else {
                iterationCount++;
                try {
                    sendMessages(iterationCount);
                } catch (e) {
                    console.error(e);
                }
            }
        }, intervalInMs)
    });
}

const run = async () => {
    await producer.connect();

    await sendMessagesInTimedIntervals({
        intervalInMs: 500,
        maxIterations: 20
    });

    console.log('Shutting down producer...');
    process.exit(1);
};

run().catch((e) => handleCaughtException(e, 'run'));
