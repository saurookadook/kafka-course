const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'lab4-producer',
    brokers: ['localhost:9092', 'localhost:9093']
    // NOTE: needed to use `LISTENER_HOST`s from `docker-compose.yaml`
    // brokers: ['localhost:29092', 'localhost:29093']
    // brokers: ['broker-1:29092', 'broker-2:29093']
});

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

const DISASTER_TOPICS = ['hurricane', 'flood'];

const stateString = "AK,AL,AZ,AR,CA,CO,CT,DE,FL,GA," +
                    "HI,ID,IL,IN,IA,KS,KY,LA,ME,MD," +
                    "MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ," +
                    "NM,NY,NC,ND,OH,OK,OR,PA,RI,SC," +
                    "SD,TN,TX,UT,VT,VA,WA,WV,WI,WY";

const statesArray = stateString.split(',');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomState() {
    return statesArray[getRandomInt(50)];
}

function getRandomBetween1and10() {
    const randomInt = getRandomInt(11);
    return randomInt || 1;
}

function getRandomBetween5and30() {
    const randomInt = getRandomInt(31)
    return randomInt >= 5 ? randomInt : getRandomBetween5and30();
}

const getIntensity = () => getRandomBetween1and10();

const getSleep = () => getRandomBetween5and30() * 100;

// TODO: probably a better way to determine producer vs consumer
function handleCaughtException(e, source) {
    console.error(`[disaster-example/${source}] ${e.message}`, e);
}

function sendMessage({
    producer,
    disaster,
    state,
    intensity
}) {
    console.log(`Sending message for ${disaster} in ${state}...`);
    return producer.send({
        topic: disaster,
        messages: [
            {
                key: `state: ${state}`,
                value: `disaster of ${disaster} with intensity of ${intensity}`
            }
        ]
    });
}

const run = async () => {
    await producer.connect();

    const startTime = Date.now();

    setInterval(() => {
        sendMessage({
            producer,
            state: getRandomState(),
            disaster: DISASTER_TOPICS[getRandomInt(2)],
            intensity: getIntensity()
        })
        .then((result) => {
            console.log('result: ', result);
            if (Date.now() - startTime >= 30000) {
                console.log('Shutting down producer...');
                return process.exit(1)
            }
        });
    }, getSleep());
};

run().catch((e) => handleCaughtException(e, 'run'));
