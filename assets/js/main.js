import { addComment } from "./addComment.js";
import { formatDate } from "./comment.js";
import { createData, createReply, readData } from "./crud.js";
import { updateScore } from "./score.js";
import { createUser, createUserInput, getUser } from "./user.js";
import { appendElements, currentUser, findMaxId } from "./utils.js";

const main = document.querySelector("main");

let commentId;
let abledReply = false;

async function printComments() {
  const data = await readData();

  data.comments.forEach((data) => {
    main.append(createUser(data));
    console.log(data)
  });
  main.append(createUserInput());
}
function populateNewObject(data, comment, currentUser, user_data, replyingTo) {
  let newData = {
    id: findMaxId(data) + 1,
    content: comment,
    createdAt: Date.now(),
    score: 0,
    user: {
      image: {
        png: currentUser.image.png,
        webp: currentUser.image.webp,
      },
      username: currentUser.username,
    },
  };
  if (replyingTo) {
    newData.replyingTo = user_data?.user.username;
  } else {
    newData.replies = [];
  }
  return newData;
}
async function sendReply(comment_text, currentUser, e) {
  let data = await readData();
  if (e.target.parentNode.parentNode.className === "currentUser") {
    const newData = populateNewObject(data.comments, comment_text, currentUser);
    data.comments.push(newData);
    await createReply(data);
  } else {
    const { user_data, index } = await getUser(e);
    const newData = populateNewObject(
      data.comments,
      comment_text,
      currentUser,
      user_data,
      true
    );
    await createReply(newData, index, "replies");
  }
  main.innerHTML = "";
  printComments();
}
function disableReplyButton(e, button) {
  e.target.textContent === ""
    ? (button.disabled = true)
    : (button.disabled = false);

  e.target.value === "" ? (button.disabled = true) : (button.disabled = false);
}
function disabledCommentText() {
  Array.from(document.querySelectorAll(".commentText")).forEach((elem) => {
    elem.classList.remove("commentText-read-write");
  });
  document.querySelector("#textReply").contentEditable = false;
}
function replySpan(data) {
  const replyToName =
    typeof data === "object" ? `@${data.user.username}: ` : data;
  let replying_to = document.createElement("span");
  replying_to.classList.add("replyingTo");
  replying_to.textContent = replyToName;
  return replying_to;
}
document.addEventListener("click", async (e) => {
  const parent = e.target.parentNode;

  if (e.target.id === "replyComment") {
    if (!abledReply) {
      const id = e.target.dataset.id;
      const { user_data } = await getUser(Number.parseInt(id));
      const content = e.target.parentNode.parentNode;
      content.after(addComment("Add a Reply", currentUser, id));
      const addText = document.querySelector(".addText");
      addText.prepend(replySpan(user_data));
      addText.classList.add("commentText-read-write");
      abledReply = true;
    }
  }
  if (e.target.id === "sendCommentBtn") {
    const comment_text =
      e.target.parentNode.querySelector(".addText").value ||
      e.target.parentNode.querySelector("#textReply").textContent;
    sendReply(comment_text, currentUser, e);
    main.innerHTML = "";
    printComments();
    abledReply = false;
  }
  if (parent.classList[1] === "replyDelete") {
    document.querySelector(".modal__panel").classList.remove("modal__hide");
    commentId = Number.parseInt(parent.dataset.id);
  }
  if (e.target.id === "modalDelete") {
    const { index, data } = await getUser(commentId);
    if (data.comments[index].id === commentId) {
      data.comments.splice(index, 1);
    } else {
      data.comments[index].replies.forEach((elem, r_index) => {
        if (elem.id === commentId) {
          data.comments[index].replies.splice(r_index, 1);
        }
      });
    }
    createReply(data);
    main.innerHTML = "";
    data.comments.forEach((elem) => main.append(createUser(elem)));
    main.append(createUserInput());
    document.querySelector(".modal__panel").classList.add("modal__hide");
  }
  if (e.target.id === "modalCancel") {
    document.querySelector(".modal__panel").classList.add("modal__hide");
  }
  if (parent.classList[1] === "replyEdit") {
    if (!abledReply) {
      const id = parent.dataset.id;
      const comment_text =
        parent.parentNode.parentNode.querySelector(".commentText");
      const text_comment = comment_text.textContent;
      const textReply = document.createElement("span");
      textReply.id = "textReply";
      textReply.contentEditable = true;
      comment_text.innerHTML = "";
      if (/@\w+:/.test(text_comment)) {
        const rplTo = /@\w+:/.exec(text_comment);
        const replyTo = replySpan(rplTo[0]);
        textReply.textContent = text_comment.replace(rplTo[0], "");
        comment_text.append(replyTo);
        comment_text.append(textReply);
      } else {
        textReply.textContent = text_comment;
        comment_text.append(textReply);
      }

      comment_text.classList.add("commentText-read-write");
      const editTextWrapper =
        parent.parentNode.parentNode.querySelector(".editTextWrapper");
      if (!editTextWrapper.querySelector(".replyUpdateBtn")) {
        editTextWrapper.append(
          appendElements([
            {
              element: "button",
              text: "UPDATE",
              attributes: [
                { name: "class", value: "btn replyUpdateBtn" },
                { name: "data-id", value: id },
              ],
            },
          ])
        );
      }
      abledReply = true;
    }
  }
  if (e.target.className === "btn replyUpdateBtn") {
    const replyUpdateBtn = e.target;
    const parent = replyUpdateBtn.parentNode.parentNode;
    const comment_text =
      replyUpdateBtn.previousElementSibling.querySelector(
        "#textReply"
      ).textContent;
    const { user_data, data, index, lastId } = await getUser(e);
    user_data.content = comment_text;
    user_data.createdAt = formatDate(Date.now);
    user_data.score = parent.querySelector(".scoreValue").textContent;
    for (let i in data.comments[index].replies) {
      if (data.comments[index].replies[i].id === lastId) {
        data.comments[index].replies.splice(i, 1, user_data);
      }
    }
    createReply(data);
    parent.querySelector(".commentText").removeAttribute("contenteditable");
    disabledCommentText();
    replyUpdateBtn.remove();
    abledReply = false;
  }
  if (e.target.id === "scorePlus" || e.target.id === "scoreMinus") {
    updateScore(e);
  }
  if (e.target.classList[1] === "addText") {
    e.target.querySelector("#textReply").focus();
  }
  if (e.target.localName === "body") {
    if (abledReply) {
      if (document.querySelector(".addComment")) {
        document.querySelector(".addComment").remove();
      }
      if (document.querySelector("#textReply")) {
        document.querySelector("#textReply").contentEditable = false;
        disabledCommentText();
        document.querySelector(".editTextWrapper button").remove();
      }
      abledReply = false;
    }
  }
});

document.addEventListener("keyup", async (e) => {
  if (e.target.id === "textReply") {
    const button = e.target.parentNode.parentNode.querySelector("button");
    disableReplyButton(e, button);
  }
  if (e.target.className === "commentText") {
    const button = e.target.nextElementSibling;
    disableReplyButton(e, button);
  }
  if (e.target.className === "addText") {
    const button = e.target.parentNode.querySelector("button");
    disableReplyButton(e, button);
  }
});

createData();
printComments();
