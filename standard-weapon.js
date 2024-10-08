const updateCell = (label, newValue, index = 0, cell = 1) => {
  const cells = Array.from(document.querySelectorAll("tbody tr td")).filter(
    (td) => td.textContent.includes(label)
  );
  if (cells.length > index) {
    cells[index].parentNode.cells[cell].innerText = newValue;
  }
};
var currentPity = 37;
let totalPulls = 0;

const container = document.querySelector(".my-2.flex.flex-row.flex-wrap.gap-2");
// Clear the initial list
container.innerHTML = "";

fetch(
  "https://raw.githubusercontent.com/baka-aho/astrite-gacha/refs/heads/main/featured-weapon.json"
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const weapons = data.weapons;
    const images = data.images;
    console.log(images);
    const banner = data.banner;

    weapons.forEach((weapon) => {
      totalPulls += weapon.value;
    });
    totalPulls += currentPity;

    //code to blah blah blah
    let accumulatedPullNo = 0;
    for (let i = weapons.length - 1; i >= 0; i--) {
      accumulatedPullNo += weapons[i].value;
      weapons[i].pullno = accumulatedPullNo;
    }

    var fourStars = Math.ceil(
      (totalPulls + currentPity) / 10 + ((totalPulls + currentPity) / 10) * 0.2
    );
    var fiveStars = weapons.length;
    let fourStarCharacter = Math.ceil(fourStars * 0.15);
    let fourStarWeapon = fourStars - fourStarCharacter;

    // Update the pull stats
    updateCell("Total Pulls", totalPulls);
    updateCell("5✦ Pulls", fiveStars);
    updateCell("4✦ Pulls", fourStars);
    updateCell("└ Character", fourStarCharacter);
    updateCell("└ Weapon", fourStarWeapon);

    //update average pity stats
    var avgFiveStarPity = accumulatedPullNo / weapons.length;
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
    updateCell("└ Character", 10, 0, 3);
    updateCell(
      "└ Character",
      ((fourStarCharacter / fourStars) * 100).toFixed(2) + "%",
      0,
      2
    );
    updateCell(
      "└ Weapon",
      ((fourStarWeapon / fourStars) * 10 * 0.9).toFixed(2),
      0,
      3
    );
    updateCell(
      "└ Weapon",
      ((fourStarWeapon / fourStars) * 100).toFixed(2) + "%",
      0,
      2
    );

    // Initialize total pulls
    weapons.forEach((weapon) => {
      // Create character div
      const weaponDiv = document.createElement("div");
      weaponDiv.className =
        "flex items-center gap-x-2 rounded-lg px-1 pl-0 text-lg transition-transform hover:scale-110 bg-neutral-100/20";

      // Create image container and image
      const img = document.createElement("img");
      img.alt = weapon.name;
      img.loading = "lazy";
      img.src = images[weapon.name.toLowerCase().trim().replaceAll(" ", "-")];
      img.style.color = "transparent";

      img.className = "mr-.5 h-8 rounded-bl-lg";

      weaponDiv.appendChild(img);

      // Create character name and value
      const nameSpan = document.createElement("span");
      nameSpan.textContent = weapon.name;

      const valueSpan = document.createElement("span");
      valueSpan.className = "ml-1 font-bold";

      if (weapon.value > 49) {
        valueSpan.className += " text-r4";
      } else {
        valueSpan.className += " text-success";
      }

      if (weapon.win) {
        weaponDiv.className += " bg-r5/45";
      }

      valueSpan.textContent = weapon.value;

      weaponDiv.appendChild(nameSpan);
      weaponDiv.appendChild(valueSpan);

      container.appendChild(weaponDiv);
    });

    const tablesBody = document.querySelectorAll("tbody");
    const tableBody = tablesBody[1];
    tableBody.innerHTML = "";

    // history list
    weapons.forEach((weapon) => {
      const row = document.createElement("tr");
      row.className =
        "border-neutral-800 border-t bg-fixed font-semibold bg-gradient-to-r from-transparent via-66% via-r5/40";

      row.innerHTML = `
        <td class="pl-2">${weapon.pullno}</td>
          <td class="">
            <div class="flex w-full items-end justify-center" bis_skin_checked="1">
              <img alt="${
                weapon.name
              } Portrait" class="h-8 min-h-8 w-8 min-w-8" src="${
        images[weapon.name.toLowerCase().trim().replaceAll(" ", "-")]
      }"/>
            </div>
          </td>
          <td class="text-r5">${weapon.name}</td>
          <td>
  
            <span title="${
              weapon.win
                ? "Won 50:50"
                : weapon.lose
                ? "Lost 50:50"
                : "Guaranteed"
            }" class="justify-left flex h-full w-full flex-row items-center leading-none">
            <span class="opacity-100">${weapon.value}</span>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success hover:text-success/60">
                <path d="M11.1464 6.85355C11.3417 7.04882 11.6583 7.04882 11.8536 6.85355C12.0488 6.65829 12.0488 6.34171 11.8536 6.14645L7.85355 2.14645C7.65829 1.95118 7.34171 1.95118 7.14645 2.14645L3.14645 6.14645C2.95118 6.34171 2.95118 6.65829 3.14645 6.85355C3.34171 7.04882 3.65829 7.04882 3.85355 6.85355L7.5 3.20711L11.1464 6.85355ZM11.1464 12.8536C11.3417 13.0488 11.6583 13.0488 11.8536 12.8536C12.0488 12.6583 12.0488 12.3417 11.8536 12.1464L7.85355 8.14645C7.65829 7.95118 7.34171 7.95118 7.14645 8.14645L3.14645 12.1464C2.95118 12.3417 2.95118 12.6583 3.14645 12.8536C3.34171 13.0488 3.65829 13.0488 3.85355 12.8536L7.5 9.20711L11.1464 12.8536Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
              </svg>
            </span>
          </td>
          <td>
            <a href="https://astrite.gg/featured-resonator" class="flex w-full items-center justify-center" bis_skin_checked="1"
              ><img alt="Banner Background" class="h-8 max-h-8 min-h-8 min-w-24" src="${banner}"
            /></a>
          </td>
          <td class="border-neutral-800 border-t p-1">${weapon.date}</td>`;

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
