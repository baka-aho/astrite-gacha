const updateCell = (label, newValue, index = 0, cell = 1) => {
  const cells = Array.from(document.querySelectorAll("tbody tr td")).filter(
    (td) => td.textContent.includes(label)
  );
  if (cells.length > index) {
    cells[index].parentNode.cells[cell].innerText = newValue;
  }
};
var currentPity = 5;
let totalPulls = 0;

const container = document.querySelector(".my-2.flex.flex-row.flex-wrap.gap-2");
// Clear the initial list
container.innerHTML = "";

fetch(
  "https://raw.githubusercontent.com/baka-aho/astrite-gacha/refs/heads/main/resonator.json"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const characters = data.characters;
    const images = data.images;

    characters.forEach((character) => {
      totalPulls += character.value;
    });

    //code to blah blah blah
    let accumulatedPullNo = 0;
    let fiveStarFiftyAttempt = 0;
    let fiveStarFiftyWin = 0;
    let fiveStarFiftyLose = 0;
    let guaranteed = false;
    const notLimited = ["Verina", "Lingyang", "Calcharo", "Encore", "Jianxin"];
    for (let i = characters.length - 1; i >= 0; i--) {
      if (guaranteed) {
        if (!notLimited.includes(characters[i].name)) {
          // you got limited but its guaranteed so no attempt or win
          guaranteed = false;
        }
      } else {
        // down here is not guaranteed which will afffect the attampt and win
        if (!notLimited.includes(characters[i].name)) {
          characters[i].win = true;
          fiveStarFiftyWin++;
          guaranteed = false;
        } else {
          fiveStarFiftyLose++;
          guaranteed = true;
        }
        fiveStarFiftyAttempt++;
      }

      accumulatedPullNo += characters[i].value;
      characters[i].pullno = accumulatedPullNo;
    }

    var fourStars = Math.ceil((totalPulls + currentPity) / 10 + 13);
    var fiveStars = characters.length;

    let fourStarFiftyAttempt = fourStars - Math.ceil(fourStars * 0.5);
    let fourStarFiftyWin = Math.ceil(
      (fourStars - Math.ceil(fourStars * 0.535)) * 0.81
    );
    let fourStarFiftyLose = fourStarFiftyAttempt - fourStarFiftyWin;
    let fourStarWeapon = Math.ceil(fourStars * 0.15);
    let fourStarCharacter = fourStars - fourStarWeapon;

    // Update the pull stats
    updateCell("Total Pulls", totalPulls + currentPity);
    updateCell("5✦ Pulls", fiveStars);
    updateCell("4✦ Pulls", fourStars);
    updateCell("└ Character", fourStarCharacter);
    updateCell("└ Weapon", fourStarWeapon);
    updateCell("50:50 Attempts", fiveStarFiftyAttempt);
    updateCell("└ Wins", fiveStarFiftyWin);
    updateCell("50:50 Attempts", fourStarFiftyAttempt, 1);
    updateCell("└ Wins", fourStarFiftyWin, 1);

    //update average pity stats
    var avgFiveStarPity = accumulatedPullNo / characters.length;
    var avgFourStarPity = totalPulls / fourStars;
    updateCell("5✦ Pulls", avgFiveStarPity.toFixed(2), 0, 3);
    updateCell("4✦ Pulls", avgFourStarPity.toFixed(2), 0, 3);
    updateCell(
      "└ Character",
      ((fourStarCharacter / fourStars) * 10).toFixed(2),
      0,
      3
    );
    updateCell("└ Weapon", 10, 0, 3);
    updateCell(
      "└ Wins",
      ((fiveStarFiftyWin / fiveStarFiftyAttempt) * 100).toFixed(2) + "%",
      0,
      2
    );
    updateCell(
      "└ Wins",
      ((fourStarFiftyWin / fourStarFiftyAttempt) * 100).toFixed(2) + "%",
      1,
      2
    );
    // Initialize total pulls
    characters.forEach((character) => {
      // Create character div
      const characterDiv = document.createElement("div");
      characterDiv.className =
        "flex items-center gap-x-2 rounded-lg px-1 pl-0 text-lg transition-transform hover:scale-110 bg-neutral-100/20";

      // Create image container and image
      const img = document.createElement("img");
      img.alt = character.name;
      img.loading = "lazy";
      img.src = images[character.name.toLowerCase()];
      img.style.color = "transparent";

      img.className = "mr-.5 h-8 rounded-bl-lg";

      characterDiv.appendChild(img);

      // Create character name and value
      const nameSpan = document.createElement("span");
      nameSpan.textContent = character.name;

      const valueSpan = document.createElement("span");
      valueSpan.className = "ml-1 font-bold";

      if (character.value > 49) {
        valueSpan.className += " text-r4";
      } else {
        valueSpan.className += " text-success";
      }

      if (character.win) {
        characterDiv.className += " bg-r5/45";
      }

      valueSpan.textContent = character.value;

      characterDiv.appendChild(nameSpan);
      characterDiv.appendChild(valueSpan);

      container.appendChild(characterDiv);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));
