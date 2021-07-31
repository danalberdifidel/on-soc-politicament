function showErrors() {
  const el = document.querySelector("[name='demographic']");
  el.classList.add("show-errors");
  setTimeout(() => {
    el.classList.remove("show-errors");
  }, 4000);
}

function validate(el) {
  const form = document.querySelector("form");
  const rows = form.querySelectorAll(".form-row");
  let errors = 0;

  rows.forEach((row) => {
    const inputs = Array.from(row.querySelectorAll("input"));
    const count = inputs.filter((el) => el.checked);
    errors += count.length ? 0 : 1;
  });

  if (errors) showErrors();
  return errors ? false : true;
}

document.querySelectorAll(".group").forEach(
  (el) =>
    (el.onclick = (e) => {
      const { nodeName = null } = e.target;
      if (!nodeName || nodeName !== "LABEL") return;

      const inputs = el.querySelectorAll("input");

      Array.from(inputs).forEach((thing) => {
        thing.parentElement.classList.remove("selected");
      });

      e.target.classList.add("selected");
    })
);
