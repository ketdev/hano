

const { run } = require('./functions/cron/cron');


async function main() {
    console.log('LOCAL RUN');
    await run();
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
