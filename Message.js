class Message {
  constructor(type, payload, priority, grow) {
    this.type = type;
    this.payload = payload;
    this.priority = priority || 0;
    this.timestamp = new Date();
    this.grow = grow || 1;
  }

  json() {
    return JSON.stringify({
      type: this.type,
      priority: this.priority
    })
  }

  upgrade() {
    this.priority = this.priority + Math.floor((255 - this.priority) * Math.atan(this.grow * (new Date() - this.timestamp)/8000 * 2 / Math.PI));
  }
}

export default Message;