// number of lollipops licked
let lollipops = 0;
// number of lollipops licked each second
let lps = 0;
// bonus multiplier
let multiplier = 1;
let color = "red";
let goal = 50000;
let gameActive = false;
let lickPerClickBonus = 0;
let bonusTimer = 0;
let start = 0;
let end = 0;

var secClock = setInterval(updateGUI, 1000);
// updates the GUI at the set interval
function updateGUI() {
  if (multiplier > 0) {
    lollipops += lps * multiplier;
  }
  drawLicks();
  upgradeStatus();
}

// I would like the reset() to overwrite the purchased upgrades
// but that doesn't seem to happen, noted in reset()
let defaultUpgrades = {
  friend: { type: "friend", qty: 0, lps: 1, cost: 10, next: 0.1 },
  dog: {
    type: "dog",
    qty: 0,
    lps: 5,
    cost: 50,
    next: 0.5,
  },
  husband: {
    type: "husband",
    qty: 0,
    lps: 50,
    cost: 300,
    next: 3.0,
  },
  wife: {
    type: "wife",
    qty: 0,
    lps: 50,
    cost: 300,
    next: 5.0,
  },
  child: {
    type: "child",
    qty: 0,
    lps: 100,
    cost: 1000,
    next: 5.0,
  },
};
// used to sum lps and multipliers after purchases have been made
let upgrades = {
  friend: {
    type: "friend",
    qty: 0,
    lps: 1,
    cost: 10,
    next: 0.1,
  },
  dog: {
    type: "dog",
    qty: 0,
    lps: 5,
    cost: 25,
    next: 0.5,
  },
  husband: {
    type: "husband",
    qty: 0,
    lps: 50,
    cost: 300,
    next: 3.0,
  },
  wife: {
    type: "wife",
    qty: 0,
    lps: 50,
    cost: 300,
    next: 5.0,
  },
  child: {
    type: "child",
    qty: 0,
    lps: 100,
    cost: 1000,
    next: 5.0,
  },
};

let activeUpgrades = [];

// NOTE Copy paste (save for potential refactor later)
// let redBonusTemplate = /*html*/ `
//   <button id="red-bonus" class="btn btn-button border-0">
//     <img
//     class="rounded-circle bonux1x"
//     onclick="activateBonus1x()"
//     src="img/red-lolli.png"
//     alt=""
//     style="height: 70px; width: 70px;"/>
//   </button>
//   `;
// let blueBonusTemplate = /*html*/ `
//   <button id="blue-bonus" class="btn btn-button border-0">
//     <img
//     class="rounded-circle bonux10x"
//     onclick="activateBonus10x()"
//     src="img/blue-lolli.png"
//     alt=""
//     style="height: 70px; width: 70px;"/>
//   </button>
//   `;
// let greenBonusTemplate = /*html*/ `
//   <button id="green-bonus" class="btn btn-button border-0">
//     <img
//     class="rounded-circle bonux100x"
//     onclick="activateBonus100x()"
//     src="img/green-lolli.png"
//     alt=""
//     style="height: 70px; width: 70px;"
//     />
//   </button>
// `;
// let grayBonusTemplate = /*html*/ `
//   <button id="blue-bonus" class="btn btn-button border-0">
//     <img
//     class="rounded-circle bonux1000x"
//     onclick="activateBonus1000x()"
//     src="img/gray-lolli.png"
//     alt=""
//     style="height: 70px; width: 70px;"/>
//   </button>
//  `;

let bonuses = [
  { color: "red", multiplier: 2, duration: 15, lpsClickBonus: 2 },
  { color: "blue", multiplier: 5, duration: 10, lpsClickBonus: 50 },
  { color: "green", multiplier: 10, duration: 5, lpsClickBonus: 10 },
  { color: "gray", multiplier: 25, duration: 3, lpsClickBonus: -1000 },
];

let bonusActive = false;
let clickBonusActive = false;

// used for various random functions throughout
function randomNumberGenerator(x) {
  return Math.ceil(Math.random() * x);
}

// use the number generator for purchase bonus
function getRandomPurchaseBonus() {
  //console.log("enter GetRandomPurchaseBonus");
  let x = randomNumberGenerator(bonuses.length) - 1;
  let bonusObj = bonuses[x];
  multiplier = bonusObj.multiplier;
  ////console.log(multiplier);
  color = bonusObj.color.toString();
  document.getElementById("main-lolli").innerHTML = /*html*/ `
    <img
      id="main-lolli"
      class="fa-spin"
      src="img/${color}-lolli.png"
      alt=""
      style="height: 200px; width: 200px; user-select: none;"
      />
    `;
  ////console.log(color);
  if (color == "red") {
    document.getElementById(
      "game-info"
    ).innerText = `Keep Lickin' ${multiplier}xLPS!`;
  } else {
    document.getElementById(
      "game-info"
    ).innerText = `BONUS TIME: ${multiplier}xLPS!`;
  }
  bonusActive = true;
  bonusTimer = setTimeout(function () {
    document.getElementById("main-lolli").innerHTML = /*html*/ `
    <img
      id="main-lolli"
      class="fa-spin"
      src="img/red-lolli.png"
      alt=""
      style="height: 200px; width: 200px; user-select: none;"
      />
    `;
    multiplier = 1;
    //console.log(multiplier);
    document.getElementById("game-info").innerText = "";
    bonusActive = false;
  }, bonusObj.duration * 1000);
  return color;
}

// bonus clicks to influence lick(num)
// if Lick Bonus is active, skip.
// generate random variable to determine wait before bonus
// appears and to establish the location for which it will appear.
// Show the bonus for 1.5 seconds then disappear.
function startRandomBonus() {
  //console.log("enter start Random Bonus");
  if (clickBonusActive) {
    return;
  }
  let x = randomNumberGenerator(10);
  let location = "location-" + x;
  let y = randomNumberGenerator(bonuses.length) - 1;
  let tempObj = bonuses[y];
  let rColor = tempObj.color.toString();
  let rDuration = tempObj.duration;
  let rLpsClickBonus = tempObj.lpsClickBonus;
  //console.log(rColor);
  //console.log(rLpsClickBonus);
  // NOTE line below will randomly throw an error - not sure why.
  setTimeout(function () {
    document.getElementById(location).innerHTML = /*html*/ `
      <button id="" class="btn btn-button border-0">
        <img
        class=""
        onclick="randomLicksButton(${rDuration},${rLpsClickBonus})"
        src="img/${rColor}-lolli.png"
        alt=""
        style="height: 70px; width: 70px;"
        />
      </button>
    `;
    setTimeout(function () {
      document.getElementById(location).innerHTML = "";
    }, 1500);
  }, x * 1000);
}

// if the bonus button was clicked - lick bonus enabled
// disable bonus after set time
function randomLicksButton(time, bonus) {
  clickBonusActive = true;
  let arg2 = time;
  let arg3 = bonus;
  //console.log("bonus time " + time);
  //console.log("bonus bonus " + bonus);

  document.getElementById("game-info").innerText = `Lick Bonus!
    ${time}s @ ${bonus}x`;
  lickPerClickBonus = bonus - 1;
  setTimeout(function () {
    lickPerClickBonus = 0;
    clickBonusActive = false;
    document.getElementById("game-info").innerText = "";
    startRandomBonus();
    //console.log("LickBonusTimeout expired");
  }, time * 1000);
  //console.log("Bonus Button clicked");
}

// Start Game - initially click worth 1 lick
function lick(num) {
  lollipops += num + lickPerClickBonus;
  //console.log(num + lickPerClickBonus)
  if (!gameActive) {
    document.getElementById("red-lollipop").classList.add("fa-spin");
    var s = new Date();
    start = s.getTime();
    //console.log(start);
    gameActive = true;
    document.getElementById("game-info").innerText = "";
  }
  drawLicks();
  drawPowerUps();
  upgradeStatus();
}

// Enable button once cost is met
// If the cost is more than the lollipops licked, disable button
// TODO refactor
function upgradeStatus() {
  let mod1 = document.getElementById("btn-friend");
  if (upgrades.friend.cost <= lollipops) {
    mod1.classList.add("btn-danger");
    // @ts-ignore
    mod1.disabled = false;
  } else {
    mod1.classList.remove("btn-danger");
    // @ts-ignore
    document.getElementById("btn-friend").disabled = true;
  }
  let mod2 = document.getElementById("btn-dog");
  if (upgrades.dog.cost <= lollipops) {
    mod2.classList.add("btn-danger");
    // @ts-ignore
    mod2.disabled = false;
  } else {
    mod2.classList.remove("btn-danger");
    // @ts-ignore
    document.getElementById("btn-dog").disabled = true;
  }
  let mod3 = document.getElementById("btn-wife");
  if (upgrades.wife.cost <= lollipops) {
    mod3.classList.add("btn-danger");
    // @ts-ignore
    mod3.disabled = false;
  } else {
    mod3.classList.remove("btn-danger");
    // @ts-ignore
    document.getElementById("btn-wife").disabled = true;
  }
  let mod4 = document.getElementById("btn-husband");
  if (upgrades.husband.cost <= lollipops) {
    mod4.classList.add("btn-danger");
    // @ts-ignore
    mod4.disabled = false;
  } else {
    mod4.classList.remove("btn-danger");
    // @ts-ignore
    document.getElementById("btn-husband").disabled = true;
  }
  let mod5 = document.getElementById("btn-child");
  if (upgrades.child.cost <= lollipops) {
    mod5.classList.add("btn-danger");
    // @ts-ignore
    mod5.disabled = false;
  } else {
    mod5.classList.remove("btn-danger");
    // @ts-ignore
    document.getElementById("btn-child").disabled = true;
  }
}

// subtract purchase price from lollipops by upgrades.cost
// then upgradeStatus()
// TODO refactor
function purchaseUpgradeFriend() {
  let cost = 0;
  let upgradeObj = upgrades.friend;
  upgradeObj.qty++;
  upgradeObj.lps = upgradeObj.qty * defaultUpgrades.friend.lps;
  cost = upgradeObj.cost;
  lollipops -= cost;
  upgradeObj.cost = Math.ceil(
    upgradeObj.cost + upgradeObj.cost * upgradeObj.next
  );
  upgrades.friend = upgradeObj;
  addUpgradeFriend();
  upgradeStatus();
  drawPowerUps();
  if (!bonusActive) {
    getRandomPurchaseBonus();
  }
  drawLPS();
}
function purchaseUpgradeDog() {
  let cost = 0;
  let upgradeObj = upgrades.dog;
  upgradeObj.qty++;
  upgradeObj.lps = upgradeObj.qty * defaultUpgrades.dog.lps;
  cost = upgradeObj.cost;
  lollipops -= cost;
  upgradeObj.cost = Math.ceil(
    upgradeObj.cost + upgradeObj.cost * upgradeObj.next
  );
  upgrades.dog = upgradeObj;
  addUpgradeDog();
  upgradeStatus();
  drawPowerUps();
  if (!bonusActive) {
    getRandomPurchaseBonus();
  }
  drawLPS();
}
function purchaseUpgradeWife() {
  let cost = 0;
  let upgradeObj = upgrades.wife;
  upgradeObj.qty++;
  upgradeObj.lps = upgradeObj.qty * defaultUpgrades.wife.lps;
  cost = upgradeObj.cost;
  lollipops -= cost;
  upgradeObj.cost = Math.ceil(
    upgradeObj.cost + upgradeObj.cost * upgradeObj.next
  );
  upgrades.wife = upgradeObj;
  addUpgradeWife();
  upgradeStatus();
  drawPowerUps();
  if (!bonusActive) {
    getRandomPurchaseBonus();
  }
  drawLPS();
}
function purchaseUpgradeHusband() {
  let cost = 0;
  let upgradeObj = upgrades.husband;
  upgradeObj.qty++;
  upgradeObj.lps = upgradeObj.qty * defaultUpgrades.husband.lps;
  cost = upgradeObj.cost;
  lollipops -= cost;
  upgradeObj.cost = Math.ceil(
    upgradeObj.cost + upgradeObj.cost * upgradeObj.next
  );
  upgrades.husband = upgradeObj;
  addUpgradeHusband();
  upgradeStatus();
  drawPowerUps();
  if (!bonusActive) {
    getRandomPurchaseBonus();
  }
  drawLPS();
}
function purchaseUpgradeChild() {
  let cost = 0;
  let upgradeObj = upgrades.child;
  upgradeObj.qty++;
  upgradeObj.lps = upgradeObj.qty * defaultUpgrades.child.lps;
  cost = upgradeObj.cost;
  lollipops -= cost;
  upgradeObj.cost = Math.ceil(
    upgradeObj.cost + upgradeObj.cost * upgradeObj.next
  );
  upgrades.child = upgradeObj;
  addUpgradeChild();
  upgradeStatus();
  drawPowerUps();
  if (!bonusActive) {
    getRandomPurchaseBonus();
  }
  drawLPS();
}

// Pushes the upgrade into the active array
// TODO refactor
function addUpgradeFriend() {
  let friend = defaultUpgrades.friend;
  activeUpgrades.push(friend);
  updateLPS();
}
function addUpgradeDog() {
  let dog = defaultUpgrades.dog;
  activeUpgrades.push(dog);
  updateLPS();
}
function addUpgradeWife() {
  let wife = defaultUpgrades.wife;
  activeUpgrades.push(wife);
  updateLPS();
}
function addUpgradeHusband() {
  let husband = defaultUpgrades.husband;
  activeUpgrades.push(husband);
  updateLPS();
}
function addUpgradeChild() {
  let child = defaultUpgrades.child;
  activeUpgrades.push(child);
  updateLPS();
}

// scans the active upgrades and sums the LPS for all upgrades
function updateLPS() {
  let sum = 0;
  activeUpgrades.forEach((i) => (sum += i.lps));
  lps = sum;
  //console.log(lps);
  return lps;
}
// Draw the various GUI items when necessary
function drawLicks() {
  document.getElementById("game-info-1").innerHTML = `<b>${lollipops}</br>`;
  if (lollipops >= goal) {
    clearTimeout(bonusTimer);
    stopGameTimer();
  }
  if (lollipops < 0) {
    lollipops = 0;
  }
}
function drawLPS() {
  let rng = randomNumberGenerator(10);
  setTimeout(function () {
    // TODO fix this timeout logic so the random bonus will respawn.
    if (!clickBonusActive) {
      startRandomBonus();
      //console.log("startRandomBonus Reactivate");
    }
  }, rng * 1000);
  document.getElementById("game-info-2").innerHTML = `<b>${lps}</b>`;
}
function drawPowerUps() {
  document.getElementById(
    "qty-friend"
  ).innerText = upgrades.friend.qty.toString();
  document.getElementById(
    "cost-friend"
  ).innerText = upgrades.friend.cost.toString();
  document.getElementById(
    "lps-friend"
  ).innerText = upgrades.friend.lps.toString();
  document.getElementById("cost-dog").innerText = upgrades.dog.cost.toString();
  document.getElementById("qty-dog").innerText = upgrades.dog.qty.toString();
  document.getElementById("lps-dog").innerText = upgrades.dog.lps.toString();
  document.getElementById(
    "cost-wife"
  ).innerText = upgrades.wife.cost.toString();
  document.getElementById("qty-wife").innerText = upgrades.wife.qty.toString();
  document.getElementById("lps-wife").innerText = upgrades.wife.lps.toString();
  document.getElementById(
    "cost-husband"
  ).innerText = upgrades.husband.cost.toString();
  document.getElementById(
    "qty-husband"
  ).innerText = upgrades.husband.qty.toString();
  document.getElementById(
    "lps-husband"
  ).innerText = upgrades.husband.lps.toString();
  document.getElementById(
    "cost-child"
  ).innerText = upgrades.child.cost.toString();
  document.getElementById(
    "qty-child"
  ).innerText = upgrades.child.qty.toString();
  document.getElementById(
    "lps-child"
  ).innerText = upgrades.child.lps.toString();
}

// get the end timestamp and stop the second clock
function stopGameTimer() {
  var e = new Date();
  end = e.getTime();
  //console.log(end);
  clearInterval(secClock);
  endGame();
}
// disable buttons
// calculate duration of game play
// update results to game-info
function endGame() {
  let totalTime = ((end - start) / 1000).toFixed(2).toString();
  document.getElementById("game-info").innerText = `${goal} in ${totalTime}s!`;
  lollipops = 0;
  // @ts-ignore
  document.getElementById("main-lolli").disabled = true;
}
// NOTE: I have a question here
function reset() {
  lollipops = 0;
  activeUpgrades.length = 0;
  lps = 0;
  document.getElementById("main-lolli").innerHTML = /*html*/ `
  <img
    id="red-lollipop"
    class=""
    src="img/red-lolli.png"
    alt=""
    style="height: 200px; width: 200px; user-select: none;"
  />
  `;
  document.getElementById(
    "game-info"
  ).innerHTML = /*html*/ `<div class="text-center" style="font-size: 20pt;">Click Lollipop to Begin!</div>`;
  // @ts-ignore
  document.getElementById("main-lolli").disabled = false;
  // TODO learn how to reset the upgrades Array
  // for (const key in object) {
  //   if (object.hasOwnProperty(key)) {
  //     const element = object[key];

  //   }
  // }
  // upgrades = newUpgrades;
  drawLicks();
  drawLPS();
  drawPowerUps();
}
