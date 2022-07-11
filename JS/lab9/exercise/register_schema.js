const path = require('path');
const {
    SchemaRegistry,
    SchemaType,
    readAVSCAsync
} = require('@kafkajs/confluent-schema-registry');

const registry = new SchemaRegistry({ host: 'http://localhost:8081' });
const run = async () => {
    const disasterSchema = await readAVSCAsync(path.join(__dirname, 'DisasterValue.avsc'));
    const id = await registry.register({
            type: SchemaType.AVRO,
            schema: JSON.stringify(disasterSchema),
            options: { subject: "com.east_coast.model.DisasterValue" } // only necessary to override
        })
        .then((resultId) => {
            console.log(resultId);
            return resultId;
        })
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });

    console.log('id: ', id);
}

run().then(console.log).catch((e) => {
    console.error(e);
    process.exit(1);
})
