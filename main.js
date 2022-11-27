import init from './utils/tasks.js';

export class Runner {
    /*
     The class takes only 1 parameter: the max concurrency,
     i.e. the maximum number of tasks executed at the same time,
     The concurrency can be changed by passing a number
    */

    constructor(concurrency) {
        this.tasks = [];
        this.concurrency = concurrency;
    }

    addTask(task) {
        this.tasks.push(task)
    }

    async manageConcurrency(iterator) {
        const results = [];
        for (let [_, task] of iterator) {
            try {
                // Runs the task and await for it
                // Checks different conditions which
                // can be used to perform certain tasks conditionally
                const res = await task.run();
                try {
                    if (task.isSuccessful(res)) {
                        await task.onSuccess(res);
                        results.push(res);
                    } else {
                        await task.onError(res);
                    }
                } catch (e) {
                    await task.onError(res);
                }
            } catch (e) {
                task.onError(e);
            }

        }
        return results;
    }

    /*
    this method is responsible for running the tasks
    */   
    async run() {
        const iterator = this.tasks.entries();
        const tasksWorkers = new Array(this.concurrency).fill(iterator).map(this.manageConcurrency);
        const res = await Promise.allSettled(tasksWorkers);
        const flattenedArrays = [];
        res.forEach((subArray) => {
            if (subArray.value) {
                subArray.value.forEach(elt => flattenedArrays.push(elt))
            }
        })

        // Here we reset the list of tasks after we have run them
        // so that we can add new tasks to the pool and run only the newly added tasks
        this.tasks = [];
        return flattenedArrays;
    }
}

init();
