export class Queue {
  private items: any[];

  constructor(items: any[] = []) {
    this.items = items;
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}
