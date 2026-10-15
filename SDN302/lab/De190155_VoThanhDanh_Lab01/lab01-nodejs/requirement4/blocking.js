console.time("Blocking Time");


function blockingTask() {

    let total = 0;

    for (let i = 0; i < 3000000000; i++) {
        total += i;
    }

    return total;
}


setTimeout(() => {
    console.log("Timer executed");
}, 0);


blockingTask();


console.timeEnd("Blocking Time");