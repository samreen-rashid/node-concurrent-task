import { Runner } from '../main.js';

  /*
  this method is responsible for creating tasks
  */
  async function init(){
    const MAX_CONCURRENCY = 4;
    const NUM_OF_TASKS = 40;
    const p =  new Runner(MAX_CONCURRENCY);
  
  
    const failedTasks = [];
    const successfullTasks = [];

    console.log("\n[init] Concurrency Algo Testing...")
    console.log("[init] Tasks to process: ", NUM_OF_TASKS)
    console.log("[init] Maximum Concurrency: ", MAX_CONCURRENCY,"\n")
    
    // Creating an array of tasks
    for (let i = 0; i < NUM_OF_TASKS; i++) {
        p.addTask({
            name: `Task ${i}`,
            async run() {
                console.log(`   [EXE] Running task ${i}`);
                await sleep(1000);
  
                if (Math.random() > 0.7) {
                    throw new Error('TaskError');
                }
  
                console.log(`   [EXE] Finished task ${i}`)
                return i;
            },
            async onSuccess(res) {
                console.log(`Run task ${i} successfuly, res = ${res}`);
                successfullTasks.push(this);
            },
            async onError(err) {
                console.log(`Task ${i} failed with error = ${err}`);
                failedTasks.push(this);
            },
            async isSuccessful(res) {
                return typeof res === 'number';
            }
        })
    }
  
    const tasksResult = await p.run();
    console.log('\nAll tasks finished successfully');
  
  }
  
  const sleep = ms => new Promise(res => setTimeout(res, ms));

export default init;