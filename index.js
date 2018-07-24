/**
 * 车联网环境下数据动态优先级传输方案  网络数据优先级排序调度 进程优先级 TCP 以太网碰撞算法 等待过程 基于应用层与传输层之间 给应用层用 初始优先级常数；重要性：优先级增长率 等待时间的指数次方 等待时间 三个参数 传输有个buffer 发送队列 严格先进先出；塞数据塞那个；优先级8位重要性8位 ；时间16 4或8的倍数；int 4个字节32位 实验比教 不同传输目标
 *
 * 参数：
 *  1. 时间
 *  2. 优先级
 *  3. 初始优先级
 *  4. 增长速度
 *  5. 平均等待时间
 * pic 1:
 * x: 时间
 * y: 队列长度
 *
 * pic 2:
 * x: 时间
 * y: 优先级变化
 */
import Message from "./Message";

const fs = require('fs');
import Generator from "./Generator";

const WebSocket = require('ws');

class Sender {
  constructor(wsAddr, withSche) {
    this.ws = new WebSocket(wsAddr);
    this.txQueue = new Queue();

    var sd = () => {
      let delay = Math.random() * 100;
      setTimeout(() => {
        // fs.appendFile('r.txt', this.txQueue.length + '\n', () => {});
        if (this.ws.readyState === 1 && this.txQueue.length > 0) {
          console.log(this.txQueue.json(), '\n\n');
          let data = this.txQueue.dequeue();
          this.send(data.json());
          if (data.type === 0) {
            fs.appendFile('r.txt', new Date() - data.timestamp + '\n');
          }
          withSche && this.schedule();
        }
        sd();
      }, delay);
    }

    sd();

  }

  send(data) {
    this.ws.send(data)
  }

  schedule() {
    for (var i in this.txQueue.queue) {
      let m = this.txQueue.queue[i];
      m.upgrade()
    }
    this.txQueue.queue.sort((a, b) => {
      return b.priority - a.priority;
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

  get length() {
    return this.queue.length;
  }
}

function go() {
  var generator = new Generator();

  var sender = new Sender('ws://localhost:8000');
  sender.ws.onopen =() => {
    function ok() {
      let delay = Math.random() * 200;
      setTimeout(() => {
        let msg = generator.generate();
        sender.txQueue.enqueue(msg);
        ok();
      }, delay);
    }

    ok();

  }
}

function showPreority() {
  var msg = new Message();
  msg.priority = 0;
  msg.grow = 2;
  setInterval(() => {
    console.log(msg.priority);
    msg.upgrade();
  }, 50)
}

function avgWait(withSche) {
  var generator = new Generator();

  var sender = new Sender('ws://localhost:8000', withSche || false);
  sender.ws.onopen =() => {
    function ok() {
      let delay = Math.random() * 100;
      setTimeout(() => {
        let msg = generator.generate();
        sender.txQueue.enqueue(msg);
        ok();
      }, delay);
    }

    ok();

  }
}

avgWait(true);

