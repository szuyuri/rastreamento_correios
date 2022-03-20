import fetch from 'node-fetch';
import readline from 'readline';

// Log the data in a beautiful way
function logData(data) {
    console.log(`+----- ${data.codObjeto} -----`)

    // Format 'dtPrevista' string from ISO to a normal date format;
    let arrivingAt = data.dtPrevista.split('T');
    console.log(`| - Entrega prevista no dia ${arrivingAt[0]} `);

    console.log('');

    for (let index = data.eventos.length - 1; index >= 0; index--) {
        let event = data.eventos[index];
        console.log(`| - ${event.descricao}`);

        // Format 'dtHrCriado' string from ISO to a normal date format
        let createdAt = event.dtHrCriado.split('T');
        console.log(`| - Criado às ${createdAt[1]} no dia ${createdAt[0]}`);

        // Where the package is at and the destination
        let packageAddress = event.unidade.endereco;
        console.log(`| - Encomenda está em: ${packageAddress.cidade} - ${packageAddress.uf}`);

        let packageDestination = event.unidadeDestino;
        if (packageDestination) {
            console.log(`| - Encomenda vai para: ${packageDestination.endereco.cidade} - ${packageDestination.endereco.uf}`);
        };

        if (index != 0) {
            console.log('');
        };
    };

    console.log('+----------');
};

async function getPackageData(code) {
    let response = await fetch(`https://proxyapp.correios.com.br/v1/sro-rastro/${code}`);
    return response;
};

// Create terminal input interface
const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readlineInterface.question('Input the package code: ', async (code) => {
    let packageData = await getPackageData(code);
    let parsedData = await packageData.json();
    let objectsArray = parsedData.objetos[0];

    if (objectsArray.eventos) {
        logData(objectsArray);
    } else {
        console.log('Package not found.');
    };
    readlineInterface.close();
});

readlineInterface.on('close', () => {
    process.exit(0);
});
