const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    });
  });
};

const gen = function* () {
  const f1 = yield readFile('test/a.js');
  const f2 = yield readFile('test/b.js');
  console.log(f1.toString());
  console.log(f2.toString());
};
const asyncReadFile = async function () {
  const f1 = await readFile('test/a.js');
  const f2 = await readFile('test/b.js');
  console.log(f1.toString());
  console.log(f2.toString());
};

gen();
//asyncReadFile();


async function f() {
  return 'hello world';
}

f().then(v => console.log(v))

async function f1() {
  throw new Error('出错了');
}

f1().then(
  v => console.log(v),
  e => console.log(e)
)