let abaCount = 0;
let abaPerClick = 1;
let passiveAbaPerSecond = 0;

const abaImage = document.getElementById('abaImage');
const abaCountDisplay = document.getElementById('abaCount');
const abaPerClickDisplay = document.getElementById('abaPerClick');
const upgradesContainer = document.querySelector('.upgrades-scroll');
const passiveAbaDisplay = document.getElementById('passiveAba');

const upgrades = [
    { name: 'ABA Chan', baseCost: 10, abaPerClick: 0, passiveAba: 1 },
    { name: 'PTS Ichigo', baseCost: 100, abaPerClick: 1, passiveAba: 0.1 },
    { name: 'Grimmjow', baseCost: 1000, abaPerClick: 10, passiveAba: 1 },
    { name: 'Aizen', baseCost: 5000, abaPerClick: 50, passiveAba: 5 },
    { name: 'Yoruichi', baseCost: 10000, abaPerClick: 100, passiveAba: 10 },
    { name: 'PTS Luffy', baseCost: 25000, abaPerClick: 1000, passiveAba: 50 },
    { name: 'TS Luffy', baseCost: 50000, abaPerClick: 500, passiveAba: 50 },
    { name: 'PTS Naruto', baseCost: 100000, abaPerClick: 1000, passiveAba: 100 },
    { name: 'Nameku', baseCost: 500000, abaPerClick: 5000, passiveAba: 500 },
    { name: 'PTS Sasuke', baseCost: 1000000, abaPerClick: 10000, passiveAba: 1000 },
    { name: 'Android Vegeta', baseCost: 2000000, abaPerClick: 20000, passiveAba: 2000 },
    { name: 'PTS Zoro', baseCost: 5000000, abaPerClick: 20000, passiveAba: 10000 },
    { name: 'TS Zoro', baseCost: 5000000, abaPerClick: 50000, passiveAba: 5000 },
    { name: 'Saitama', baseCost: 10000000, abaPerClick: 100000, passiveAba: 10000 },
    { name: 'Tanjiro', baseCost: 20000000, abaPerClick: 200000, passiveAba: 20000 },
    { name: 'Nanami', baseCost: 100000000, abaPerClick: 2500000, passiveAba: 100000 },
    { name: 'SnakeWorl', baseCost: 10000000000000, abaPerClick: 0, passiveAba: 0 }

];


function nameToFilename(name) {
    const fileName = name.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
    console.log(`https://lndoc.github.io/ABA_Clicker/upgrade_images/${fileName}`);
    return `https://lndoc.github.io/ABA_Clicker/upgrade_images/${fileName}`;
}



upgrades.forEach(upg => {
    upg.image = nameToFilename(upg.name);
});

let upgradeCounts = {};

const ENCRYPTION_KEY = 69;

function xorEncode(str) {
    return btoa([...str].map(c => String.fromCharCode(c.charCodeAt(0) ^ ENCRYPTION_KEY)).join(''));
}

function xorDecode(encoded) {
    return [...atob(encoded)].map(c => String.fromCharCode(c.charCodeAt(0) ^ ENCRYPTION_KEY)).join('');
}


function createUpgradeButton(upgrade) {
    const button = document.createElement('button');
    const cost = getCost(upgrade);

    button.innerHTML = `<img src="${upgrade.image}" alt="" width="50"> ${upgrade.name} - ${formatNum(cost)} ABA`;

    button.addEventListener('click', () => {
        const cost = getCost(upgrade);
        if (abaCount >= cost) {
            abaCount -= cost;
            abaPerClick += upgrade.abaPerClick;
            passiveAbaPerSecond += upgrade.passiveAba;
            upgradeCounts[upgrade.name] = (upgradeCounts[upgrade.name] || 0) + 1;
            updateDisplay();
            saveGame();
            button.innerHTML = `<img src="${upgrade.image}" alt="" width="50"> ${upgrade.name} - ${formatNum(getCost(upgrade))} ABA`;
        } else {
            alert('Not enough ABA Coins!');
        }
    });

    button.addEventListener('mouseover', (e) => {
        const tooltip = document.getElementById('tooltip');
        const count = upgradeCounts[upgrade.name] || 0;
        tooltip.innerHTML = 
            `${upgrade.name}\n` +
            `Cost: ${formatNum(getCost(upgrade))} ABA\n` +
            `+${formatNum(upgrade.abaPerClick)} ABA/Click\n` +
            `+${formatNum(upgrade.passiveAba)} ABA/Sec\n` +
            `Owned: ${formatNum(count)}`;
        tooltip.style.display = 'block';
    });

    button.addEventListener('mousemove', (e) => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
    });

    button.addEventListener('mouseout', () => {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    });

    return button;
}



function getCost(upgrade) {
    const count = upgradeCounts[upgrade.name] || 0;
    return Math.round(upgrade.baseCost * Math.pow(1.15, count));
}

function updateDisplay() {
    abaCountDisplay.textContent = formatNum(abaCount);
    abaPerClickDisplay.textContent = formatNum(abaPerClick);
    passiveAbaDisplay.textContent = formatNum(passiveAbaPerSecond);
}

function formatNum(num) {
    if (num >= 1e6) {
        return num.toExponential(3); 
    } else if (num >= 1000) {
        return num.toLocaleString();
    } else {
        return num.toFixed(2); 
    }
}


function spawnFloatingText(amount) {
    const float = document.createElement('div');
    float.className = 'floating-text';
    float.textContent = `+${formatNum(amount)}`;
    document.body.appendChild(float);

    const rect = abaImage.getBoundingClientRect();
    float.style.left = `${rect.left + rect.width / 2}px`;
    float.style.top = `${rect.top}px`;

    setTimeout(() => {
        float.remove();
    }, 1000);
}

abaImage.addEventListener('click', () => {
    abaCount += abaPerClick;
    updateDisplay();
    spawnFloatingText(abaPerClick);
    saveGame();
});

setInterval(() => {
    abaCount += passiveAbaPerSecond / 10;
    updateDisplay();
}, 100);

function saveGame() {
    const saveData = {
        abaCount,
        abaPerClick,
        passiveAbaPerSecond,
        upgradeCounts
    };
    localStorage.setItem('abaClickerSave', JSON.stringify(saveData));
}

function loadGame() {
    const data = localStorage.getItem('abaClickerSave');
    if (data) {
        const save = JSON.parse(data);
        abaCount = save.abaCount || 0;
        abaPerClick = save.abaPerClick || 1;
        passiveAbaPerSecond = save.passiveAbaPerSecond || 0;
        upgradeCounts = save.upgradeCounts || {};
    }
}

function resetGame() {
    localStorage.removeItem('abaClickerSave');
    location.reload();
}

function exportGame() {
    const saveData = {
        abaCount,
        abaPerClick,
        passiveAbaPerSecond,
        upgradeCounts
    };

    const json = JSON.stringify(saveData);
    const obfuscated = xorEncode(json);
    document.getElementById('jsonArea').value = obfuscated;
    document.getElementById('exportPopup').style.display = 'block';
}

function closeExportPopup() {
    document.getElementById('exportPopup').style.display = 'none';
}

function copyExportedData() {
    const textarea = document.getElementById('jsonArea');
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Copied to clipboard!');
}


function importGame() {
    document.getElementById('importPopup').style.display = 'block';
}

function confirmImportData() {
    const obfuscated = document.getElementById('jsonImportArea').value;
    if (!obfuscated) return;

    try {
        const decrypted = xorDecode(obfuscated);
        const save = JSON.parse(decrypted);

        abaCount = save.abaCount || 0;
        abaPerClick = save.abaPerClick || 1;
        passiveAbaPerSecond = save.passiveAbaPerSecond || 0;
        upgradeCounts = save.upgradeCounts || {};

        saveGame();
        updateDisplay();
        closeImportPopup();
        alert("Game data imported successfully!");
    } catch (e) {
        alert("Failed to import data. It may be corrupted.");
    }
}

function closeImportPopup() {
    document.getElementById('importPopup').style.display = 'none';
}



document.addEventListener('DOMContentLoaded', () => {
    loadGame();

    upgrades.forEach(upgrade => {
        if (!(upgrade.name in upgradeCounts)) upgradeCounts[upgrade.name] = 0;
        const button = createUpgradeButton(upgrade);
        upgradesContainer.appendChild(button);
    });

    updateDisplay();
});

setInterval(saveGame, 5000); 

document.querySelectorAll("*").forEach(el => {
    el.style.touchAction = "manipulation";
});

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                node.style.touchAction = "manipulation";

                node.querySelectorAll("*").forEach(child => {
                    child.style.touchAction = "manipulation";
                });
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });
