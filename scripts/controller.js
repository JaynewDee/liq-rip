const ripSingleBtn = document.getElementById("rip-single");
const ripAllBtn = document.getElementById("rip-all");
const reportSection = document.querySelector(".report-section");
const report = document.querySelector(".report");

const chromeWriteSync = (data) => {
  chrome.storage.local.set(data).then((res) => console.log(res));
};

const ripAll = () => {
  const notFoundError = () => {
    const errorEl = document.createElement("p");
    const exitBtn = document.createElement("button");
    errorEl.textContent =
      "The ripper was unable to find any questions on this page...";
    exitBtn.textContent = "X";
    errorEl.style = `
      position: absolute; 
      top: 50%; left: 50%; 
      transform: translate(-50%, -50%); 
      background-color: black; color: white;`;
    document.body.appendChild(errorEl);
    errorEl.appendChild(exitBtn);
    exitBtn.addEventListener("click", () => {
      document.body.removeChild(errorEl);
    });
  };

  const sections = document.querySelectorAll("section");
  const questionSections = [];
  sections.forEach((el) =>
    Array.from(el.classList).forEach((cl) =>
      cl.includes("chapter-quiz-question") ? questionSections.push(el) : null
    )
  );
  if (!questionSections.length) {
    notFoundError();
    return;
  }
  const questionMap = (q, a) => ({ q, a });
  const questions = questionSections.filter((val) =>
    val.classList.toString().includes("text")
  );
  const answers = questionSections.filter((val) =>
    val.classList.toString().includes("options")
  );
  const tabulated = {};
  for (let i = 0; i < questions.length; i++) {
    let question = questions[i];
    let answer = answers[i];
    tabulated[String(i)] = questionMap(question, answer);
  }
  console.log(tabulated);
};

const ripSingle = () => {
  console.log("rip single handler activated");
};

const executeFunction = async (functionName) => {
  const funcTable = {
    ripSingle: ripSingle,
    ripAll: ripAll
  };
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: funcTable[functionName]
  });
};

[ripSingleBtn, ripAllBtn].forEach((btn) =>
  btn.addEventListener("click", async (e) =>
    e.target.id === "rip-single"
      ? executeFunction("ripSingle")
      : executeFunction("ripAll")
  )
);
