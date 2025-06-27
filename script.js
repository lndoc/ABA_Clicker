let abaCount = 0;
let abaPerClick = 1;
let passiveAbaPerSecond = 0;

const abaImage = document.getElementById('abaImage');
const abaCountDisplay = document.getElementById('abaCount');
const abaPerClickDisplay = document.getElementById('abaPerClick');
const upgradesContainer = document.querySelector('.upgrades');
const passiveAbaDisplay = document.getElementById('passiveAba');

const upgrades = [
    { name: 'ABA Chan', baseCost: 1, abaPerClick: 0, passiveAba: 1, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/0/02/ABA_Chan.png/revision/latest?cb=20230823193536' },
    { name: 'PTS Ichigo', baseCost: 10, abaPerClick: 1, passiveAba: 0.1, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/3/3e/Ichigo.png/revision/latest?cb=20200214021355' },
    { name: 'Grimmjow', baseCost: 100, abaPerClick: 10, passiveAba: 1, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/e/ee/GrimmjowBase.png/revision/latest?cb=20211225151354' },
    { name: 'Aizen', baseCost: 500, abaPerClick: 50, passiveAba: 5, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/6/69/Unknown_%2848%29.png/revision/latest?cb=20200607182320' },
    { name: 'Yoruichi', baseCost: 1000, abaPerClick: 100, passiveAba: 10, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/7/79/Yoruichilook.PNG/revision/latest?cb=20210501122404' },
    { name: 'PTS Luffy', baseCost: 2500, abaPerClick: 1000, passiveAba: 50, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/3/3d/Luffy.png/revision/latest?cb=20200212190829' },
    { name: 'PTS Luffy', baseCost: 5000, abaPerClick: 500, passiveAba: 50, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/5/56/TS_luffy.PNG/revision/latest?cb=20200604060217' },
    { name: 'PTS Naruto', baseCost: 10000, abaPerClick: 1000, passiveAba: 100, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/e/ea/Naruto.png/revision/latest?cb=20200212234650' },
    { name: 'Nameku', baseCost: 50000, abaPerClick: 5000, passiveAba: 500, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/8/81/New_Goku_Skin_1.png/revision/latest?cb=20230201060418' },
    { name: 'PTS Sasuke', baseCost: 100000, abaPerClick: 10000, passiveAba: 1000, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/7/77/PTS_Sasuke_.png/revision/latest?cb=20250215030949' },
    { name: 'Android Vegeta', baseCost: 200000, abaPerClick: 20000, passiveAba: 2000, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/8/84/Vegeta_Skin_1.png/revision/latest?cb=20230402084519' },
    { name: 'PTS Zoro', baseCost: 500000, abaPerClick: 20000, passiveAba: 10000, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/b/b8/Zoro.PNG/revision/latest?cb=20200325195704' },
    { name: 'TS Zoro', baseCost: 500000, abaPerClick: 50000, passiveAba: 5000, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/4/48/ZoroS1.png/revision/latest?cb=20220827000102' },
    { name: 'Saitama', baseCost: 1000000, abaPerClick: 100000, passiveAba: 10000, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/1/12/Screen_Shot_2021-03-24_at_1.09.40_PM.png/revision/latest?cb=20210324171208' },
    { name: 'Tanjiro', baseCost: 2000000, abaPerClick: 200000, passiveAba: 20000, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/6/61/Tanjiro.png/revision/latest?cb=20200824190824' },
    { name: 'Nanami', baseCost: 10000000, abaPerClick: 2500000, passiveAba: 100000, image: 'https://static.wikia.nocookie.net/animebattlearenaaba/images/c/c9/Nanamibase.png/revision/latest?cb=20241226040857' },

];

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

    button.innerHTML = `<img src="${upgrade.image}" alt="" width="50"> ${upgrade.name} - ${cost} ABA`;

    button.addEventListener('click', () => {
        const cost = getCost(upgrade);
        if (abaCount >= cost) {
            abaCount -= cost;
            abaPerClick += upgrade.abaPerClick;
            passiveAbaPerSecond += upgrade.passiveAba;
            upgradeCounts[upgrade.name] = (upgradeCounts[upgrade.name] || 0) + 1;
            updateDisplay();
            saveGame();
            button.innerHTML = `<img src="${upgrade.image}" alt="" width="50"> ${upgrade.name} - ${getCost(upgrade)} ABA`;
        } else {
            alert('Not enough ABA Coins!');
        }
    });

    button.addEventListener('mouseover', (e) => {
        const tooltip = document.getElementById('tooltip');
        const count = upgradeCounts[upgrade.name] || 0;
        tooltip.innerHTML = 
            `${upgrade.name}\n` +
            `Cost: ${getCost(upgrade)} ABA\n` +
            `+${upgrade.abaPerClick} ABA/Click\n` +
            `+${upgrade.passiveAba} ABA/Sec\n` +
            `Owned: ${count}`;
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
    return num >= 1000 ? num.toLocaleString() : num.toFixed(2);
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
