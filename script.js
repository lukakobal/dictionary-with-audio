const input = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", async () => {
  const word = input.value.trim();
  if (!word) {
    result.textContent = "Please enter a word";
    return;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) throw new Error("Something is wrong!");

    const data = await response.json();
    const entry = data[0];

    const phonetics = entry.phonetics.find((p) => p.audio) || {};
    const meaningsHtml = entry.meanings
      .map(
        (m) => `
        <div class="part">
          <h3>${m.partOfSpeech}</h3>
          <ul>
            ${m.definitions
              .map(
                (d) =>
                  `<li>${d.definition}${
                    d.example
                      ? `<div class="example">Example: ${d.example}</div>`
                      : ""
                  }</li>`
              )
              .join("")}
          </ul>
        </div>
      `
      )
      .join("");

    result.classList.remove("hidden");
    result.innerHTML = `
      <h2>${entry.word}</h2>
      ${
        phonetics.text
          ? `<p><strong>Pronunciation:</strong> ${phonetics.text}</p>`
          : ""
      }
      ${
        phonetics.audio
          ? `<audio controls src="${phonetics.audio}"></audio>`
          : ""
      }
      ${meaningsHtml}
    `;
  } catch (err) {
    result.classList.remove("hidden");
    result.innerHTML = `<p>Could not find that word. Try another.</p>`;
  }
});
