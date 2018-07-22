class Message {
  constructor(type, payload, priority, grow) {
    this.type = type;
    this.payload = payload;
    this.priority = priority;
    this.timestamp = new Date();
    this.grow = grow || 1;
  }

  json() {
    return JSON.stringify({
      type: this.type,
      priority: this.priority
    })
  }
}

export default Message;