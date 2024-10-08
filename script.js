function tokenizeText(text, setter) {
  console.log(text, setter);
  return text
    .split("\n")
    .map((s) => s.trim().split(/\s+/))
    .filter((arr) => arr.length === 2 || arr.length > 3)
    .map((arr) => {
      if (arr.length === 2) {
        return arr;
      } else {
        return [arr[1], arr[arr.length - 3]];
      }
    })
    .filter((t) => t[1] > 0)
    .map((t) => {
      if (t[0] === setter) {
        return [t[0], "0 # 세터입니다"];
      } else {
        return [t[0], t[1]];
      }
    });
}

function generateCode(setter, tokens) {
  const header =
    "# Author: " + setter + "\n\nimport random as r\n\nparticipants = (\n    ";
  const tuple = tokens
    .map((t) => "['" + t[0] + "'] * " + t[1])
    .join("\n    + ");
  const footer = "\n)\n\nprint(r.choice(participants))";
  return header + tuple + footer;
}

function setCode() {
  const setter = document.getElementsByName("setter")[0].value;
  const tokens = tokenizeText(
    document.getElementsByName("list-input")[0].value,
    setter,
  );
  const code = generateCode(setter, tokens);
  document.getElementsByName("code-text")[0].textContent = code;
}

function wrapWithCodeBlock(code) {
  return "./run py\n```py\n" + code + "\n```";
}

function setCopyAlert(text) {
  document.getElementsByName("copy-alert")[0].textContent = text;
}

function copyCodeToClipboard() {
  const code = document.getElementsByName("code-text")[0].textContent;
  const data = wrapWithCodeBlock(code);
  window.navigator.clipboard.writeText(data).then(() => {
    setCopyAlert("Copied!");
    setTimeout(function () {
      setCopyAlert("");
    }, 2000);
  });
}

document
  .getElementsByName("list-input")[0]
  .addEventListener("keydown", function (event) {
    if ((event.shiftKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      setCode();
    }
  });
