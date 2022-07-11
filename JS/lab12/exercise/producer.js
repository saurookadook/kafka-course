const { Kafka, Partitioners } = require('kafkajs');
const _common = require('../../_common');

const kafka = new Kafka({
    clientId: 'lab10-producer',
    brokers: ['localhost:9092', 'localhost:9093']
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const CONNECT_LOG = 'RawTempReadings';
const disasterTypes = ['hurricane', 'flood'];

const stateString = "AK,AL,AZ,AR,CA,CO,CT,DE,FL,GA," +
                    "HI,ID,IL,IN,IA,KS,KY,LA,ME,MD," +
                    "MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ," +
                    "NM,NY,NC,ND,OH,OK,OR,PA,RI,SC," +
                    "SD,TN,TX,UT,VT,VA,WA,WV,WI,WY";

const statesArray = stateString.split(',');

function randomlyNegate() {
    return _common.getRandomInt(2) || -1;
}

function createMessage({
    state
}) {
    return {
        key: `state: ${state}`,
        value: `${_common.getRandomInt(201) * randomlyNegate()}`
    };
}

function sendMessage({
    producer,
    state
}) {
    const message = createMessage({ state });
    console.log('message: ', message);
    return producer.send({
            acks: 1,
            topic: CONNECT_LOG,
            messages: [ message ]
        }).then((result) => console.log('`send` result: ', result));

}

function sendMessagesInTimedIntervals({ intervalInMs, maxIterations }) {
    return new Promise((resolve) => {
        let iterationCount = 0;
        setInterval(() => {
            // console.log('iterationCount: ', iterationCount);
            // console.log('maxIterations: ', maxIterations);

            if (maxIterations >= 0 && maxIterations <= iterationCount) {
                console.log('Stoping iterations!');
                resolve();
            } else {
                console.log(`Sending message #${iterationCount}!`);
                iterationCount++;
                try {
                    sendMessage({
                        producer,
                        state: _common.getRandomState(statesArray)
                    })
                    // .then((result) => {
                    //     console.log('result: ', result);
                    //     console.log(result);
                    // }).catch((e) => _common.handleCaughtException(e, 'lab9-producer'));;
                } catch (e) {
                    console.error(e);
                }
            }
        }, intervalInMs);
    });
}

const run = async () => {
    await producer.connect();

    await sendMessagesInTimedIntervals({
            intervalInMs: 500,
            maxIterations: -1
        })
        .then((result) => {
            // console.log('message: ', message);
            console.log('sendMessagesInTimedIntervals: ', result);
        }).catch((e) => _common.handleCaughtException(e, 'lab9-producer'));;
    // let iterations = 0;
    // while (iterations <= 20) {
    //     await sendMessage({
    //         producer,
    //         disaster: disasterTypes[_common.getRandomInt(2)],
    //         intensity: _common.getIntensity(),
    //         state: _common.getRandomState(statesArray)
    //     })
    //     .then((result) => {
    //         // console.log('message: ', message);
    //         console.log(result);
    //     }).catch((e) => _common.handleCaughtException(e, 'lab9-producer'));;
    //     iterations++;
    // }

        // .then(() => {
    console.log('Stopping...');
    process.exit();
        // });
};

run().catch((e) => _common.handleCaughtException(e, 'run'));
