const Keyboard = {
    elements: {
        main: null,
        keyContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        //create elements
        this.elements.main = document.createElement("div");
        this.elements.keyContainer = document.createElement("div");

        //set up main element
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keyContainer.classList.add("keyboard_keys");
        this.elements.keyContainer.appendChild(this._createKeys());
        this.elements.main.setAttribute("style", `--color-1: #30CFD0; --color-2: #330867`);

        this.elements.keys = this.elements.keyContainer.querySelectorAll(".keyboard_key");
        
        //add to DOM
        this.elements.main.appendChild(this.elements.keyContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });

    },

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        //create HTML icons
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertlinebreak = ["backspace", "p", "enter", "?"].indexOf(key) !== -1;

            //Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard_key");

            switch (key) {
                case "backspace":
                    keyElement.classList.add("keyboard_key_wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard_key_wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });
                    break;

                case "caps":
                    keyElement.classList.add("keyboard_key_wide", "keyboard_key_activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard_key_active", this.properties.capsLock)
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard_key_extrawide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });
                    break;

                case "done":
                    keyElement.classList.add("keyboard_key_wide", "keyboard_key_dark");
                    keyElement.innerHTML = createIconHTML("check_circle");

                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if(insertlinebreak){
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        console.log("Capslock toggled");
        this.properties.capsLock = !this.properties.capsLock;
        for (const key of this.elements.keys){
            if(key.childElementCount == 0){
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

const Color_btn = {

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      },

    init_btn() {

        //create and add to DOM
        const colorbtn = document.createElement("button");
        document.body.appendChild(colorbtn);

        //set Attribute
        colorbtn.classList.add("color_button");
        colorbtn.setAttribute("type", "button");
        colorbtn.innerHTML += "Change Color";
        colorbtn.setAttribute("style", `--color-1: #30CFD0; --color-2: #330867`);

        colorbtn.addEventListener("click", () =>{
            var x = [this.getRandomColor(), this.getRandomColor()];

            Keyboard.elements.main.removeAttribute("style");
            Keyboard.elements.main.setAttribute("style", `--color-1: ${x[0]}; --color-2: ${x[1]}`);

            document.querySelectorAll("h1").forEach( elementh1 => {
                elementh1.removeAttribute("style");
                elementh1.setAttribute("style", `--color-1: ${x[0]}; --color-2: ${x[1]}`);
            });
            
            colorbtn.setAttribute("style", `--color-1: ${x[0]}; --color-2: ${x[1]}`);
        });
    }
}

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
    Color_btn.init_btn();
});