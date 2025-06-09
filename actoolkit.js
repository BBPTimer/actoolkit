class Tool {
    constructor(name, process, description, toolsOrBank = "Bank", isCustom = false) {
        this.name = name;
        this.process = process;
        this.description = description;
        this.toolsOrBank = toolsOrBank;
        this.isCustom = isCustom;
        this.button = null;
        this.createButton();
    }

    createButton() {
        this.button = document.createElement("button");
        this.button.innerHTML = this.name;
        //Show description on hover
        this.button.title = this.description;
        this.button.addEventListener("click", () => {
            //Remove custom tool if clicked
            if (this.isCustom) {
                //Remove button from div
                window[this.process + this.toolsOrBank].removeChild(this.button);
                //Delete custom tool from array
	            toolsArray.splice(toolsArray.findIndex(tool => tool.name === this.name), 1);
                //Update local storage
                updateLocalStorage();
                //Early return
                return;
            }
            //Update tool location
            if (this.toolsOrBank === "Bank") {
                this.toolsOrBank = "Tools";
            } else if (this.toolsOrBank === "Tools") {
                this.toolsOrBank = "Bank";
            }
            this.appendButton();
            //Save change to local storage
            updateLocalStorage();
        });
        this.appendButton();
    }

    appendButton() {
        //Add button to div
        window[this.process + this.toolsOrBank].appendChild(this.button);
    }
}

//Populate array from JSON
function fetchJSON() {
    fetch('tools.json').then((response) => response.json()).then((tools) => {
        for(let tool of tools) {
            toolsArray.push(new Tool(tool.name, tool.process, tool.description));
        }
    });
}

const printButton = document.getElementById("printButton");
printButton.addEventListener("click", () => {
    //Open new window
    const newWindow = window.open("", "", menubar=0, status=0, titlebar=0);
    //Write toolkit section and head HTML to new window
    newWindow.document.write(document.getElementById("toolkit").innerHTML + document.getElementById("head").innerHTML);
    //Wait 100ms for new window to populate then open print dialog
    setTimeout(() => newWindow.print(), 100);
});

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    //Clear local storage
    localStorage.removeItem("toolsArray");
    location.reload();
});

const addButton = document.getElementById("addButton");
addButton.addEventListener("click", () => {
    //Custom error messages
    if (customName.value === "") {
        customName.focus();
        alert("Please enter a tool name.");
        return;
    }

    if (customProcess.value === "") {
        customProcess.focus();
        alert("Please select a process.");
        return;
    }
    //Add custom tool to array
    toolsArray.push(new Tool("&times; " + document.getElementById("customName").value, document.getElementById("customProcess").value, document.getElementById("customDescription").value, "Tools", true));
    //Update local storage
    updateLocalStorage();
    //Clear form
    customName.value = "";
    customProcess.value = "";
    customDescription.value = "";
});

function updateLocalStorage () {
    localStorage.setItem("toolsArray", JSON.stringify(toolsArray));
}

//Initialize array
let toolsArray = [];
//Attempt to retrieve array from local storage
let localStorageArray = JSON.parse(localStorage.getItem("toolsArray"));
//If no array found in local storage, populate array from JSON
if (localStorageArray === null) {
    fetchJSON();
//If array found in local storage, re-populate array from local storage
} else {
    for (let tool of localStorageArray) {
        toolsArray.push(new Tool(tool.name, tool.process, tool.description, tool.toolsOrBank, tool.isCustom));
    }
}