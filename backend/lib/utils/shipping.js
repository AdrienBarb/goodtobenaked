
const getProviderToken = (provider) => {
    let response = null

    switch (provider) {
        case 'mondial_relay_pointrelais':
            response = 'mondial_relay'
            break;
        case 'colissimo_home':
            response = 'colissimo'
            break;
    
        default:
            break;
    }

    return response
}

module.exports = {
    getProviderToken
}