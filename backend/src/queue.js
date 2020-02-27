import "dotenv/config";

import Queue from "./lib/Queue";

console.log("Queue running");
Queue.processQueue();
