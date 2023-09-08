import { createReply } from "./crud.js";
import { getUser } from "./user.js";

const users_scored = [];

function scoreOptions(user_data, score, e) {
  let plus;
  let minus;
  if (e.target.id === "scorePlus") {
    saveScorePlus(user_data, score, e);
    plus = true;
  }
  if (e.target.id === "scoreMinus") {
    saveScoreMinus(user_data, score, e);
    minus = true;
  }
  return { plus, minus };
}
function saveScorePlus(user_data, score, e) {
  score = user_data.score + 1;
  user_data.score = score;
  e.target.parentNode.nextElementSibling.textContent = score;
}
function saveScoreMinus(user_data, score, e) {
  score = user_data.score < 0 ? (user_data.score = 0) : user_data.score - 1;
  user_data.score = score;
  e.target.parentNode.previousElementSibling.textContent = score;
}
function registerScore({ user_data, data }, commentId, e) {
  let score;
  let objectScored;
  let score_plus = false;
  let score_minus = false;

  if (users_scored.length > 0) {
    users_scored.forEach((elem, index) => {
      if (elem.user_data.id === commentId) {
        objectScored = { elem, index };
      }
    });
    if (objectScored) {
      if (e.target.id === "scorePlus") {
        if (objectScored.elem.score_plus) {
          alert("you has scored this reply");
        } else {
          saveScorePlus(user_data, score, e);
          users_scored[objectScored.index].score_plus = true;
        }
      }
      if (e.target.id === "scoreMinus") {
        if (objectScored.elem.score_minus) {
          alert("you has scored this reply");
        } else {
          saveScoreMinus(user_data, score, e);
          users_scored[objectScored.index].score_minus = true;
        }
      }
      createReply(data);
    } else {
      const { plus, minus } = scoreOptions(user_data, score, e);
      if (plus) {
        score_plus = plus;
      }
      if (minus) {
        score_minus = minus;
      }
      users_scored.push({ user_data, score_plus, score_minus });
    }
  } else {
    const { plus, minus } = scoreOptions(user_data, score, e);
    if (plus) {
      score_plus = plus;
    }
    if (minus) {
      score_minus = minus;
    }
    users_scored.push({ user_data, score_plus, score_minus });
  }
  createReply(data);
}
async function updateScore(e) {
  const commentId = Number.parseInt(e.target.dataset.id);
  registerScore(await getUser(e), commentId, e);
}

export { updateScore };
