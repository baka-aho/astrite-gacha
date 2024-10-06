const updateCell = (label, newValue, index = 0, cell = 1) => {
  const cells = Array.from(document.querySelectorAll("tbody tr td")).filter(
    (td) => td.textContent.includes(label)
  );
  if (cells.length > index) {
    cells[index].parentNode.cells[cell].innerText = newValue;
  }
};
var currentPity = 7;
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
    const banners = data.banners;

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
          characters[i].lose = true;
          fiveStarFiftyLose++;
          guaranteed = true;
        }
        fiveStarFiftyAttempt++;
      }

      accumulatedPullNo += characters[i].value;
      characters[i].pullno = accumulatedPullNo;
    }

    var fourStars = Math.ceil((totalPulls + currentPity) / 10 + 65);
    var fiveStars = characters.length;

    let fourStarFiftyAttempt = fourStars - Math.ceil(fourStars * 0.5);
    let fourStarFiftyWin = Math.ceil(
      (fourStars - Math.ceil(fourStars * 0.535)) * 0.66
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
    var avgFourStarPity = (totalPulls / fourStars) * 0.87;
    updateCell("5✦ Pulls", avgFiveStarPity.toFixed(2), 0, 3);
    updateCell(
      "5✦ Pulls",
      ((fiveStars / totalPulls) * 100).toFixed(2) + "%",
      0,
      2
    );

    updateCell("4✦ Pulls", avgFourStarPity.toFixed(2), 0, 3);
    updateCell(
      "4✦ Pulls",
      ((fourStars / totalPulls) * 100).toFixed(2) + "%",
      0,
      2
    );
    updateCell(
      "└ Character",
      ((fourStarCharacter / fourStars) * 10 * 0.9).toFixed(2),
      0,
      3
    );
    updateCell(
      "└ Character",
      ((fourStarCharacter / fourStars) * 100).toFixed(2) + "%",
      0,
      2
    );
    updateCell("└ Weapon", 10, 0, 3);
    updateCell(
      "└ Weapon",
      ((fourStarWeapon / fourStars) * 100).toFixed(2) + "%",
      0,
      2
    );
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

    const tablesBody = document.querySelectorAll("tbody");
    const tableBody = tablesBody[1];
    tableBody.innerHTML = "";

    // history list
    characters.forEach((char) => {
      const row = document.createElement("tr");
      row.className =
        "border-neutral-800 border-t bg-fixed font-semibold bg-gradient-to-r from-transparent via-66% via-r5/40";

      row.innerHTML = `
      <td class="pl-2">${char.pullno}</td>
        <td class="">
          <div class="flex w-full items-end justify-center" bis_skin_checked="1">
            <img alt="${
              char.name
            } Portrait" class="h-8 min-h-8 w-8 min-w-8" src="${
        images[char.name.toLowerCase()]
      }"/>
          </div>
        </td>
        <td class="text-r5">${char.name}</td>
        <td>

          <span title="${
            char.win ? "Won 50:50" : char.lose ? "Lost 50:50" : "Guaranteed"
          }" class="justify-left flex h-full w-full flex-row items-center leading-none">
          <span class="opacity-100">${char.value}</span>
          ${
            char.win
              ? `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success hover:text-success/60">
              <path d="M11.1464 6.85355C11.3417 7.04882 11.6583 7.04882 11.8536 6.85355C12.0488 6.65829 12.0488 6.34171 11.8536 6.14645L7.85355 2.14645C7.65829 1.95118 7.34171 1.95118 7.14645 2.14645L3.14645 6.14645C2.95118 6.34171 2.95118 6.65829 3.14645 6.85355C3.34171 7.04882 3.65829 7.04882 3.85355 6.85355L7.5 3.20711L11.1464 6.85355ZM11.1464 12.8536C11.3417 13.0488 11.6583 13.0488 11.8536 12.8536C12.0488 12.6583 12.0488 12.3417 11.8536 12.1464L7.85355 8.14645C7.65829 7.95118 7.34171 7.95118 7.14645 8.14645L3.14645 12.1464C2.95118 12.3417 2.95118 12.6583 3.14645 12.8536C3.34171 13.0488 3.65829 13.0488 3.85355 12.8536L7.5 9.20711L11.1464 12.8536Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>`
              : char.lose
              ? `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="ml-[2px] h-4 w-4 text-r4 hover:text-r4/60"><path d="M7.49991 0.877075C3.84222 0.877075 0.877075 3.84222 0.877075 7.49991C0.877075 11.1576 3.84222 14.1227 7.49991 14.1227C11.1576 14.1227 14.1227 11.1576 14.1227 7.49991C14.1227 3.84222 11.1576 0.877075 7.49991 0.877075ZM3.85768 3.15057C4.84311 2.32448 6.11342 1.82708 7.49991 1.82708C10.6329 1.82708 13.1727 4.36689 13.1727 7.49991C13.1727 8.88638 12.6753 10.1567 11.8492 11.1421L3.85768 3.15057ZM3.15057 3.85768C2.32448 4.84311 1.82708 6.11342 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C8.88638 13.1727 10.1567 12.6753 11.1421 11.8492L3.15057 3.85768Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>`
              : ``
          }
          </span>
        </td>
        <td>
          <a href="https://astrite.gg/featured-resonator" class="flex w-full items-center justify-center" bis_skin_checked="1"
            ><img alt="Banner Background" class="h-8 max-h-8 min-h-8 min-w-24" src="${
              banners[char.banner]
            }"
          /></a>
        </td>
        <td class="border-neutral-800 border-t p-1">${char.date}</td>`;

      tableBody.appendChild(row);
    });

    // Get all buttons on the page
    const buttons = document.querySelectorAll(
      "button[data-radix-collection-item]"
    );

    buttons.forEach((button) => {
      if (button.textContent.trim() === "4✦") {
        button.outerHTML = `
      <button type="button" aria-pressed="false" data-state="off" class="rounded-xl border border-neutral-800 px-5 py-1 data-[state=on]:border-r4 hover:border-secondary data-[state=on]:bg-r4 data-[state=on]:text-neutral-900" tabindex="0" data-radix-collection-item="">4✦</button>
    `;
      }
    });

    const parentDiv = document.querySelector(
      ".inline-grid .h-full.w-full.rounded-2xl.bg-item:nth-child(2) .inline-flex.h-\\[23rem\\].min-h-0.w-full.flex-col.items-center.rounded-2xl.bg-item.p-4"
    );

    const textElements = parentDiv.querySelectorAll("svg text");

    textElements[0].textContent = `5✦: ${fiveStars}`;
    textElements[1].textContent = `4✦: ${fourStars}`;
    textElements[2].textContent = `3✦: ${totalPulls - fiveStars - fourStars}`;
    textElements[3].textContent = `Total: ${totalPulls}`;
  })
  .catch((error) => console.error("Error fetching data:", error));
