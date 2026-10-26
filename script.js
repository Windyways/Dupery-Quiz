const app = document.getElementById("app");

function showDupery() {
    app.innerHTML = `
        <div class="page">
            <button class="back-button" onclick="showHome()">← Back</button>

            <h1>Dupery</h1>
            <p>Choose a category.</p>

            <div class="category-grid">
                <button class="category-card" onclick="showQuiz(
                    'Roles',
                    'Guess every role.',
                    duperyRoles,
                    'images/dupery/roles/',
                    'showDupery'
                )">
                    <strong>Roles</strong>
                    <span>Guess every role.</span>
                </button>
            </div>
        </div>
    `;
}

let hardMode = true;
let currentItems = [];
let currentImagePath = "";
let guessedItems = new Set();

function showQuiz(title, description, items, imagePath, backFunction) {
    currentItems = items;
    currentImagePath = imagePath;
    guessedItems.clear();
    hardMode = true;

    app.innerHTML = `
        <div class="page">

            <h1>${title}</h1>
            <p>${description}</p>

            <h2 id="score">0 / ${currentItems.length}</h2>

            <input
                id="guess-input"
                class="guess-input"
                type="text"
                placeholder="Type a name..."
                autocomplete="off"
            >

            <div id="quiz-grid" class="coin-grid"></div>

            <button class="give-up-button" onclick="giveUp()">Give Up</button>
        </div>
    `;

    createQuizGrid();

    const input = document.getElementById("guess-input");
    input.addEventListener("input", checkGuess);
    input.focus();
}

function createQuizGrid() {
    const grid = document.getElementById("quiz-grid");

    grid.innerHTML = currentItems.map((item, index) => `
        <div class="coin-card" id="item-${index}">
            <img
                class="coin-image hard-hidden"
                src="${currentImagePath}${item.image}"
                alt="Unknown"
            >
            <div class="coin-name">???</div>
        </div>
    `).join("");
}

function checkGuess(event) {
    const input = event.target;
    const guess = normalize(input.value);

    if (!guess)
        return;

    currentItems.forEach((item, index) => {
        if (guessedItems.has(index))
            return;

        const answers = [item.name, ...(item.answers ?? [])];

        if (answers.some(answer => normalize(answer) === guess)) {
            guessedItems.add(index);
            revealItem(index, true);

            input.value = "";
            updateScore();
        }
    });
}

function normalize(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

function revealItem(index, guessed) {
    const item = currentItems[index];
    const card = document.getElementById(`item-${index}`);
    const image = card.querySelector(".coin-image");
    const name = card.querySelector(".coin-name");

    image.classList.remove("silhouette", "hard-hidden");

    image.alt = item.name;
    name.textContent = item.name;

    card.classList.add(guessed ? "guessed" : "missed");

    if (guessed) {
        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

function updateScore() {
    document.getElementById("score").textContent =
        `${guessedItems.size} / ${currentItems.length}`;

    if (guessedItems.size === currentItems.length)
        finishQuiz();
}

function giveUp() {
    currentItems.forEach((item, index) => {
        if (!guessedItems.has(index))
            revealItem(index, false);
    });

    document.getElementById("guess-input").disabled = true;
}

function finishQuiz() {
    const input = document.getElementById("guess-input");
    input.disabled = true;
    input.placeholder = "You got them all!";
}

showDupery();
showQuiz('Roles', 'Guess every role.', duperyRoles, 'images/dupery/roles/', 'showDupery');