const { Partitioners, logLevel } = require('kafkajs');
const { KafkaAvro } = require('kafkajs-avro');
const { getRandomInt, getIntensity, handleCaughtException } = require('../../_common');

const DISASTER_TOPIC = 'disasters';
const DISASTER_SUBJECT = 'com.east_coast.model.DisasterValue';

const disasterTypes = ['hurricane','flood'];

const recommendationsByDisaster = {
    flood: ["turn off lights", "evacuate", "get in a boat"],
    hurricane: ["run", "go outside and shoot at it with a gun"]
};

const scalesByDisaster = {
    flood: "meters",
    hurricane: "richter"
};

const kafka = new KafkaAvro({
    brokers: ['localhost:9092', 'localhost:9093'],
    clientId: `lab9-producer-${DISASTER_TOPIC}`,
    avro: {
        url: "http://localhost:8081"
    },
    logLevel: logLevel.DEBUG,
    retry: {
        maxInFlightRequests: 5
    }
})

const producer = kafka.avro.producer();

function createMessage({
    disaster,
    intensity,
    scale,
    recommendations
}) {
    return {
        subject: DISASTER_SUBJECT,
        version: "1",
        value: {
            disasterType: disaster,
            intensity: {
                scale: 1,
                measurement: intensity,
            },
            recommendations: recommendations
        }
    }
}

function sendMessage({
    producer,
    disaster,
    intensity,
    scale,
    recommendations
}) {
    return producer.send({
            acks: 'all',
            topic: DISASTER_TOPIC,
            messages: [
                createMessage({ disaster, intensity, scale, recommendations })
            ]
        })
        .then((result) => {
            console.log(result);
        }).catch((e) => handleCaughtException(e, 'lab9-producer'));
}

function sendMessagesInTimedIntervals({ intervalInMs, maxIterations }) {
    return new Promise((resolve) => {
        let iterationCount = 0;
        setInterval(() => {
            if (maxIterations >= 0 && maxIterations <= iterationCount) {
                console.log('Stoping iterations!');
                resolve();
            } else {
                iterationCount++;
                try {
                    const disaster = disasterTypes[getRandomInt(2)];
                    const intensity = getIntensity();
                    const recommendationsToGive = recommendationsByDisaster[disaster];
                    const scale = scalesByDisaster[disaster];
                    sendMessage({
                        producer,
                        disaster,
                        intensity,
                        scale,
                        recommendations: recommendationsToGive
                    });
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
        })
        .then(() => {
            console.log('Stopping...');
            process.exit(1);
        });
};

run().catch((e) => handleCaughtException(e, 'run'));
