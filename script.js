const btnThemeSwich = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const btnAdd = document.getElementById("add-btn");
const taskInput = document.getElementById("addt");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const btnFilter = document.querySelector("#clear-completed");


//Start Main function for App 
function Main() {
    //Start code for Theame Changeing
    btnThemeSwich.addEventListener("click", () => {
        bodyTag.classList.toggle("light");
        const themeImage = btnThemeSwich.children[0];
        themeImage.setAttribute("src", themeImage.getAttribute("src") ===
            "/image/icon-sun.svg" ? "/image/icon-moon.svg" : "/image/icon-sun.svg");
    });
    //End code for Theame Changeing

    //Start Call Tasks In LocalStorage 
    createTaskElement(JSON.parse(localStorage.getItem("tasks")));
    //End Call Tasks In LocalStorage 
    //Start code For Dragover in Ul
    ul.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.target.classList.contains("card") &&
            !e.target.classList.contains("dragging")) {
            const draggingCard = document.querySelector(".dragging");
            const cards = [...ul.querySelectorAll(".card")];
            const currentPos = cards.indexOf(draggingCard);
            const newPos = cards.indexOf(e.target);
            console.log(currentPos, newPos);
            if (currentPos > newPos) {
                ul.insertBefore(draggingCard, e.target);
            } else {
                ul.insertBefore(draggingCard, e.target.nextSibling)
            }
            const tasks = JSON.parse(localStorage.getItem("tasks"));
            const removed = tasks.splice(currentPos, 1);
            tasks.splice(newPos, 0, removed[0]);
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    });
    //End code For Dragover in Ul
    //Start Cod For Filter Tasks
    filter.addEventListener('click', (e) => {
        const id = e.target.id;
        if (id) {
            document.querySelector(".on").classList.remove("on");
            document.getElementById(id).classList.add("on");
            document.querySelector(".todos").className = `todos ${id}`;
        }
    });
    //End Cod For Filter Tasks
    //Start cod For Btn Clear All
    btnFilter.addEventListener('click', () => {
        console.log("Filter");
        var deleteIndexes = [];
        document.querySelectorAll(".card.checked").forEach((card) => {
            deleteIndexes.push(
                [...document.querySelectorAll(".todos .card")].indexOf(card)
            );
            card.classList.add("fall");
            card.addEventListener('animationend', () => {
                card.remove();
            });
        });
        removeMultipleTasks(deleteIndexes);
    });
    //End cod For Btn Clear All

    //Start Add Task In LocalStorage
    btnAdd.addEventListener("click", () => {
        const newTask = taskInput.value.trim();
        if (newTask) {
            taskInput.value = "";
            const tasks = !localStorage.getItem("tasks") ? [] : JSON.parse(localStorage.getItem("tasks"));
            const currentTask = {
                item: newTask,
                isCompleted: false,
            };
            tasks.push(currentTask);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            createTaskElement([currentTask]);
        }
    });
    taskInput.addEventListener("keydown", (e) => {
        if (e.key == 'Enter') {
            btnAdd.click();
        }
    });
    //End Add Task In LocalStorage
}
//End Main function for App 

//Start Function Remove Task
function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//End Function Remove Task

//Start function removeMultipleTasks
function removeMultipleTasks(indexes) {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.filter((task, index) => {
        return !indexes.includes(index);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//End function removeMultipleTasks
//Start Function stateTasks
function stateTasks(index, isComplete) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].isCompleted = isComplete;
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//End Function stateTasks


// Start Function create TaskElement From LocalStorage
function createTaskElement(tasksArry) {
    if (!tasksArry) {
        return null;
    }
    const itemsLeft = document.querySelector("#items-left");
    //Start loop for Create taskObject
    tasksArry.forEach((taskObject) => {
        //Start Create Html Elements Of task
        const card = document.createElement("li");
        const cbContainer = document.createElement("div");
        const cbInput = document.createElement("input");
        const checkSpan = document.createElement("span");
        const item = document.createElement("p");
        const clearBtn = document.createElement("button");
        const img = document.createElement("img");
        //End Create Html Elements Of task
        //Start Add Classes For Elements
        card.classList.add("card");
        cbContainer.classList.add("cb-container");
        cbInput.classList.add("cb-input");
        checkSpan.classList.add("check");
        item.classList.add("item");
        clearBtn.classList.add("clear");
        //End Add Classes For Elements
        //Start Add Attributes For Elements
        card.setAttribute("draggable", true);
        cbInput.setAttribute("type", "checkbox");
        img.setAttribute("src", "/image/icon-cross.svg");
        img.setAttribute("alt", "Clear It");
        item.textContent = taskObject.item;
        if (taskObject.isCompleted) {
            card.classList.add('checked');
            cbInput.setAttribute('checked', 'checked');
        }
        //End Add Attributes For Elements
        //Start Add EventListener For Elements
        card.addEventListener("dragstart", () => {
            card.classList.add("dragging");
        });
        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
        });
        cbInput.addEventListener("click", (e) => {
            const currentCard = cbInput.parentElement.parentElement;
            const checked = cbInput.checked;
            const currentCardIndex = [...document.querySelectorAll(".todos .card")]
                .indexOf(currentCard);
            stateTasks(currentCardIndex, checked);
            checked ? currentCard.classList.add('checked') : currentCard.classList.remove('checked');
            itemsLeft.textContent = document.querySelectorAll(
                ".todos .card:not(.checked)"
            ).length;
        });
        clearBtn.addEventListener('click', (e) => {

            const currentCard = clearBtn.parentElement;
            currentCard.classList.add('fall');
            const indexOfCurrentCard = [...document.querySelectorAll(".todos .card")].indexOf(currentCard);
            removeTask(indexOfCurrentCard);
            currentCard.addEventListener('animationend', () => {
                setTimeout(() => {
                    currentCard.remove();
                    itemsLeft.textContent = document.querySelectorAll(
                        ".todos .card:not(.checked)"
                    ).length;
                }, 100);
            });
        });
        //End Add EventListener For Elements
        //Start Set Element by Parent Child
        clearBtn.appendChild(img);
        cbContainer.appendChild(cbInput);
        cbContainer.appendChild(checkSpan);
        card.appendChild(cbContainer);
        card.appendChild(item);
        card.appendChild(clearBtn);
        document.querySelector(".todos").appendChild(card);
        //End Set Element by Parent Child
    });
    itemsLeft.textContent = document.querySelectorAll(
        ".todos .card:not(.checked)"
    ).length;
    //End loop for Create taskObject
}
//End Function create TaskElement From LocalStorage

//Call Main Function after DOMContentLoaded
document.addEventListener("DOMContentLoaded", Main);