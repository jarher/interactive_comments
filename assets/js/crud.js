async function getData() {
  const res = (await fetch("../../data.json",{
    method: "GET",
    mode:'no-cors',
    credentials:"same-origin",
    headers:{
      "Content-Type":"application/json"
    }
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
