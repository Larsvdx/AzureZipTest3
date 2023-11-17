import { Queue } from "./queue.util";

export class DelayedQueue {
    private queue: Queue;
    private delay: number;
    constructor(items: any[] = [], delay: number = 500) {
        this.delay = delay;
        this.queue = new Queue(items);
    }

    dequeue(callback: any) {
        const intervalId = setInterval(async () => {
            const item = this.queue.dequeue();
            if (item) {
                callback(item);
            }

            if (this.queue.isEmpty()) {
                clearInterval(intervalId);
                return "Queue is empty. Interval cleared.";
            }
        }, this.delay);
    }
}
