module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const fs = require('fs')

    try {
        const data = fs.readFileSync('message/epicData.csv', 'utf8');
        context.log(data);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: data
        };
    } catch (err) {
        console.error(err)
    }
}
