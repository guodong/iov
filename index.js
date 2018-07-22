/**
 * 车联网环境下数据动态优先级传输方案  网络数据优先级排序调度 进程优先级 TCP 以太网碰撞算法 等待过程 基于应用层与传输层之间 给应用层用 初始优先级常数；重要性：优先级增长率 等待时间的指数次方 等待时间 三个参数 传输有个buffer 发送队列 严格先进先出；塞数据塞那个；优先级8位重要性8位 ；时间16 4或8的倍数；int 4个字节32位 实验比教 不同传输目标
 */
import Generator from "./Generator";

const WebSocket = require('ws');

class Sender {
  constructor(wsAddr) {
    this.ws = new WebSocket(wsAddr);
    this.txQueue = new Queue();

    setInterval(() => {
      if (this.ws.readyState === 1 && this.txQueue.length > 0) {
        this.schedule();
        let data = this.txQueue.dequeue();
        this.send(data.json());
        console.log(this.txQueue.json(), '\n\n');
      }
    }, 100)

  }

  send(data) {
    this.ws.send(data)
  }

  schedule() {
    for (var i in this.txQueue.queue) {
      let m = this.txQueue.queue[i];
      m.priority = m.priority + (255 - m.priority) * Math.atan(m.grow * (new Date().getTime() - m.timestamp)/1000);
    }
    this.txQueue.sort((a, b) => {
      return a.priority < b.priority;
    })
  }

}

class Queue {
  constructor() {
    this.queue = [];
  }

  enqueue(data) {
    this.queue.push(data);
  }

  dequeue() {
    return this.queue.shift();
  }

  get length() {
    return this.queue.length;
  }

  sort() {
    return this.queue.sort(arguments)
  }

  json() {
    return JSON.stringify(this.queue)
  }
}

var generator = new Generator();

var sender = new Sender('ws://localhost:8000');
sender.ws.onopen =() => {
  function ok() {
    let delay = Math.random() * 150;
    setTimeout(() => {
      let msg = generator.generate();
      sender.txQueue.enqueue(msg);
      ok();
    }, delay);
  }

  ok();

}
