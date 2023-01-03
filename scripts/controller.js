const ripSingleBtn = document.getElementById("rip-single");
const ripAllBtn = document.getElementById("rip-all");
const reportSection = document.querySelector(".report-section");
const report = document.querySelector(".report");

const ripAll = () => {
  const sections = document.querySelectorAll("section");
  console.log(sections);
  const questionSections = [];
  sections.forEach((el) =>
    Array.from(el.classList).forEach((cl) =>
      cl.includes("chapter-quiz-question") ? questionSections.push(el) : null
    )
  );
  console.log(questionSections);
  if (!questionSections.length) {
    makeError();
    return;
  }
};

const ripSingle = () => {
  console.log("rip single handler activated");
};

[ripSingleBtn, ripAllBtn].forEach((btn) =>
  btn.addEventListener("click", async (e) => {
    e.target.id === "rip-single"
      ? executeFunction("ripSingle")
      : executeFunction("ripAll");
  })
);

const executeFunction = async (functionName) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: functionName === "ripSingle" ? ripSingle : ripAll
  });
};
