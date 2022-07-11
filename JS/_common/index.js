function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomState(statesArr) {
    return statesArr[getRandomInt(50)];
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

function handleCaughtException(e, source) {
    console.error(`[reliability-example/${source}] ${e.message}`, e);
}

module.exports = {
    getRandomInt,
    getRandomState,
    getRandomBetween1and10,
    getRandomBetween5and30,
    getIntensity,
    getSleep,
    handleCaughtException
};

// const module = {
//     exports: {
//         getRandomInt,
//         getRandomState,
//         getRandomBetween1and10,
//         getRandomBetween5and30,
//         getIntensity,
//         getSleep,
//         handleCaughtException
//     }
// };
