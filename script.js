const form = document.getElementById("exercise-form");
const exerciseInput = document.getElementById("exercise");
const dateInput = document.getElementById("date");
const setsInput = document.getElementById("sets");
const repsInput = document.getElementById("reps");
const weightInput = document.getElementById("weight");
const exerciseList = document.getElementById("exercise-list");
const exerciseCount = document.getElementById("exercise-count");
const saveButton = document.getElementById("save-exercise");
const cancelEditButton = document.getElementById("cancel-edit");

let editingExercise = null;
const exercises = JSON.parse(
    localStorage.getItem("gym-exercises") || "[]"
);

function saveExercises() {
    localStorage.setItem("gym-exercises", JSON.stringify(exercises));
}

function resetForm() {
    editingExercise = null;
    form.reset();
    saveButton.textContent = "Save exercise";
    cancelEditButton.hidden = true;
    exerciseInput.focus();
}

function renderExercises() {
    exerciseList.replaceChildren();

    const count = exercises.length;
    exerciseCount.textContent =
        `${count} ${count === 1 ? "entry" : "entries"}`;

    if (count === 0) {
        const message = document.createElement("li");
        message.textContent = "No exercises logged yet.";
        exerciseList.appendChild(message);
    }

    exercises.forEach(function (exercise, index) {
        const item = document.createElement("li");
        const dateLabel = exercise.date.split("-").reverse().join("/");

        item.textContent =
            `${dateLabel} — ${exercise.name}: ` +
            `${exercise.sets} sets × ${exercise.reps} reps at ${exercise.weight} kg`;
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.setAttribute("aria-label", `Edit ${exercise.name}`);

        editButton.addEventListener("click", function () {
            editingExercise = exercise;

            exerciseInput.value = exercise.name;
            dateInput.value = exercise.date;
            setsInput.value = exercise.sets;
            repsInput.value = exercise.reps;
            weightInput.value = exercise.weight;

            saveButton.textContent = "Update exercise";
            cancelEditButton.hidden = false;
            exerciseInput.focus();
        });

        item.append(" ", editButton);
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", `Delete ${exercise.name}`);

        deleteButton.addEventListener("click", function () {
            if (editingExercise === exercise) {
                resetForm();
            }
            exercises.splice(index, 1);
            saveExercises();
            renderExercises();
        });

        item.append(" ", deleteButton);
        exerciseList.appendChild(item);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = exerciseInput.value.trim();
    const date = dateInput.value;
    const sets = Number(setsInput.value);
    const reps = Number(repsInput.value);
    const weight = Number(weightInput.value);

    if (
        !name ||
        !date ||
        !Number.isSafeInteger(sets) ||
        sets <= 0 ||
        !Number.isSafeInteger(reps) ||
        reps <= 0 ||
        !Number.isFinite(weight) ||
        weight < 0
    ) {
        return;
    }

    const entry = {
        name: name,
        date: date,
        sets: sets,
        reps: reps,
        weight: weight
    };

    if (editingExercise === null) {
        exercises.push(entry);
    } else {
        Object.assign(editingExercise, entry);
    }

    saveExercises();
    renderExercises();
    resetForm();
});

renderExercises();
cancelEditButton.addEventListener("click", resetForm);