// test our stuff locally
const handler = require('./handler');

async function main() {
    console.log('LOCAL RUN');
    // handler.hanocron({
    //     "version": "0",
    //     "id": "9ea21311-f3d8-10ba-3708-30de237f5831",
    //     "detail-type": "Scheduled Event",
    //     "source": "aws.events",
    //     "account": "365496958255",
    //     "time": "2021-05-20T22:12:14Z",
    //     "region": "us-east-2",
    //     "resources": [
    //         "arn:aws:events:us-east-2:365496958255:rule/HanoCron"
    //     ],
    //     "detail": {}
    // }, null, () => {});
    handler.hanobot({
        body: JSON.stringify({
            message: {
                chat: {
                    id: 723524446
                },
                text: "/echo Beep Beep, I'm a robot D:"
            }
        })
    });
}

main().then(
    text => {
        // console.log(text);
    },
    err => {
        console.log(err.message);
        console.log(err.stack);
    }
);
