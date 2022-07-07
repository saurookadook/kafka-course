const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'lab3',
    brokers: ['localhost:9092', 'localhost:9093']
    // NOTE: needed to use `LISTENER_HOST`s from `docker-compose.yaml`
    // brokers: ['localhost:29092', 'localhost:29093']
    // brokers: ['broker-1:29092', 'broker-2:29093']
})

const [producer, consumer] = [
    kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner }),
    kafka.consumer({ groupId: 'test-group' })
]

const stateString = "AK,AL,AZ,AR,CA,CO,CT,DE,FL,GA," +
                    "HI,ID,IL,IN,IA,KS,KY,LA,ME,MD," +
                    "MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ," +
                    "NM,NY,NC,ND,OH,OK,OR,PA,RI,SC," +
                    "SD,TN,TX,UT,VT,VA,WA,WV,WI,WY";

const statesArray = stateString.split(',')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomState() {
    return statesArray[getRandomInt(50)];
}

function getRandomBetween10and100000() {
    const randomInt = getRandomInt(100001)
    return randomInt >= 10 ? randomInt : getRandomBetween10and100000();
}

function getRandomBetween5and30() {
    const randomInt = getRandomInt(31)
    return randomInt >= 5 ? randomInt : getRandomBetween5and30();
}

const getCost = () => getRandomBetween10and100000();

const getSleep = () => getRandomBetween5and30() * 1000;

function handleCaughtException(e) {
    console.error(`[example/producer] ${e.message}`, e);
};

function createProducerMessages() {
    const producerMessages = [];

    for (let i = 0; i < 5; i++) {
        const [state, cost] = [getRandomState(), getCost()]
        console.log(`getSleep: ${getSleep()}`)

        const producerMessage = new Promise(resolve => {
            setTimeout(() => {
                console.log(`Sending message for ${state}...`)
                resolve(
                    producer.send({
                        topic: 'my_orders',
                        messages: [
                            { key: `state: ${state}`, value: `cost: ${cost}` }
                        ]
                    })
                )
            }, getSleep())
        })

        producerMessages.push(producerMessage)
    }

    return producerMessages;
}

const run = async () => {
    await producer.connect();

    const producerMessages = createProducerMessages()

    await Promise.allSettled(producerMessages)
        .then((results) => {
            console.log('results: ', results)
            results.forEach((singleResult) => {
                console.log('status: ', singleResult.status);
                console.log('value: ', singleResult.value);
            });
        })
        .then(process.exit)
        .catch(handleCaughtException);



    // await consumer.connect()
    // await consumer.subscribe({ topic: 'my_orders', fromBeginning: true })

    // await consumer.run({
    //     eachMessage: async ({ topic, partition, message }) => {
    //         console.log({
    //             partition,
    //             offset: message.offset,
    //             key: message.key.toString(),
    //             value: message.value.toString()
    //         })
    //     }
    // })
};

run().catch(handleCaughtException)
