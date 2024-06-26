module.exports = formatCurrency = (stringToFormat) => {
    let formatted = stringToFormat

    if(typeof stringToFormat === 'string') {
        formatted = stringToFormat.replace(/,/g, ".")
    }

    return parseFloat(formatted) * 100
}