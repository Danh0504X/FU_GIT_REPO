console.time("Non-blocking Time");

let total = 0;
let i = 0;

function asyncTask() {

    const chunkSize = 1000000;

    const end = i + chunkSize;

    while (i < end && i < 3000000000) {
        total += i;
        i++;
    }


    if (i < 3000000000) {

        setImmediate(asyncTask);

    } else {

        console.timeEnd("Non-blocking Time");

    }
}


setTimeout(() => {
    console.log("Timer executed");
}, 0);


asyncTask();