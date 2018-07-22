import Message from "./Message";

function random(m, n){
  var num = Math.floor(Math.random()*(m - n) + n);
  return num;
}

class Generator {
  generate() {
    let type = random(0,3);
    let priority = 0;
    let grow = 1;
    if (type === 0) {
      priority = 100;
      grow = 2;
    }
    if (type === 0) {

    }
    let msg = new Message(type, 'gps', priority, grow);
    return msg;
  }
}

export default Generator;