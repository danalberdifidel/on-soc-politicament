const dictionary = Object.fromEntries(
  window.location.search
    .substr(1)
    .split(/&/g)
    .map((s) => s.split("="))
);

console.log(dictionary);

var max_econ, max_indp, max_govt, max_scty; // Max possible scores
max_econ = max_indp = max_govt = max_scty = 0;

var { questions } = window;
let econ_array = new Array(questions.length);
let dipl_array = new Array(questions.length);
let govt_array = new Array(questions.length);
let scty_array = new Array(questions.length);
var qn = 0; // Question number

init_question();

for (var i = 0; i < questions.length; i++) {
  max_econ += Math.abs(questions[i].effect.econ);
  max_indp += Math.abs(questions[i].effect.indp);
  max_govt += Math.abs(questions[i].effect.govt);
  max_scty += Math.abs(questions[i].effect.scty);
}

function init_question() {
  document.getElementById("question-text").innerHTML = questions[qn].question;
  document.getElementById("question-number").innerHTML =
    "Pregunta " + (qn + 1) + " de " + questions.length;
  if (qn == 0) {
    document.getElementById("back_button").style.display = "none";
    document.getElementById("back_button_off").style.display = "block";
  } else {
    document.getElementById("back_button").style.display = "block";
    document.getElementById("back_button_off").style.display = "none";
  }
}

function next_question(mult) {
  try {
    econ_array[qn] = mult * questions[qn].effect.econ;
    dipl_array[qn] = mult * questions[qn].effect.indp;
    govt_array[qn] = mult * questions[qn].effect.govt;
    scty_array[qn] = mult * questions[qn].effect.scty;
    qn++;
  } catch (err) {
    console.log(qn, questions.length, err);
  }

  if (qn < questions.length) {
    init_question();
  } else {
    results();
  }
}

function prev_question() {
  if (qn == 0) return;
  qn--;
  init_question();
}

function calc_score(score = 0, max = 0) {
  return Number(100 * (max + score)) / (2 * max);
}

function total(array) {
  return array.reduce((a, b) => a + b, 0);
}

function results() {
  let final_econ = total(econ_array);
  let final_indp = total(dipl_array);
  let final_govt = total(govt_array);
  let final_scty = total(scty_array);

  const { origin } = window.location;
  const production = /netlify/i;
  const form = document.querySelector("[name='user-data']");
  const date = new Date().toISOString();

  // update the hidden fields
  const data = {
    e: calc_score(final_econ, max_econ),
    d: calc_score(final_indp, max_indp),
    g: calc_score(final_govt, max_govt),
    s: calc_score(final_scty, max_scty)
  };

  const payload = { ...dictionary, ...data, date };
  Object.entries(payload).forEach(([key, value], i) => {
    console.log(i, key, value);
    form.querySelector(`[name="${key}"]`).value = value;
  });

  // update the form action
  const action = `/results.html?e=${data.e}&d=${data.d}&g=${data.g}&s=${data.s}`;
  form.action = action;
  form.method = production.test(origin) ? "POST" : "GET";
  form.submit();
}
