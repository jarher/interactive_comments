async function getData() {
  const res = (await fetch("https://github.com/jarher/interactive_comments/blob/main/data.json",{
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': https://jarher.github.io/interactive_comments/
    },
  })).json();
  return res;
}

const readData = async () =>
  JSON.parse(localStorage.getItem("commentsData")) || (await getData());

async function createData() {
  if (!localStorage.getItem("commentsData")) {
    localStorage.setItem("commentsData", JSON.stringify(await readData()));
  }
}

async function createReply(newData, index, key) {
  let data = await readData();
  if (key && index && key === "replies") {
    data.comments[index].replies.push(newData);
    localStorage.setItem("commentsData", JSON.stringify(data));
    return;
  } else {
    localStorage.setItem("commentsData", JSON.stringify(newData));
  }
}

export { getData, createData, readData, createReply };
