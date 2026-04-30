export const SETTINGS = {
    'censored': {
        Default: true,
        Description: "Censored Lyrics",
        Type: "boolean",
    },

    'lyricsVisible': {
        Default: true,
        Description: "Lyrics Visible",
        Type: "boolean"
    },

    'musVolume': {
        Default: 50,
        Min: 0,
        Max: 100,
        Description: "Music Volume",
        Type: "range",
    }
}

export class UserSettings {
    constructor() {
        const saved = localStorage.getItem("settings") || "{}"
        const data = JSON.parse(saved);
        this.loadedSettings = {}

        // Init settings
        for (const [key, value] of Object.entries(SETTINGS)) {
            if (data[key] !== undefined) {
                this.loadedSettings[key] = data[key];
            } else {
                this.loadedSettings[key] = value.Default
            }
        }
    }

    import(imported) {
        for (const [key, value] of Object.entries(SETTINGS)) {
            if (imported[key] !== undefined) {
                this.loadedSettings[key] = imported[key];
            }
        }

        localStorage.setItem("settings", JSON.stringify(this.loadedSettings));
    }

    export() {
        const blob = new Blob([JSON.stringify(this.loadedSettings)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `settings.json`;
        document.body.appendChild(anchor);

        anchor.click();
        anchor.remove();
    }

    getSetting(setting) {
        return this.loadedSettings[setting]
    }

    changeSetting(setting, value) {
        this.loadedSettings[setting] = value;
        localStorage.setItem("settings", JSON.stringify(this.loadedSettings));
    }

    importFromFile() {

    }
}

export class SettingsInput {
    constructor(element, settings) {
        this.element = element;
        this.settings = settings;
        this.selectedFile = null;
        this.inputs = [];

        for (const [key, value] of Object.entries(SETTINGS)) {
            this.createFrame(key, value)
        }

        this.importInput = document.createElement("input");
        this.importInput.type = "file";
        this.importInput.accept = "application/json";
        this.importInput.style.marginTop = "12px";
        this.importInput.style.marginBottom = "8px";
        this.importInput.style.marginLeft = "4px";

        const self = this;

        this.importInput.onchange = (e) => {
            const files = e.target.files;
            if (!files.length) {
                alert("You must upload a file to import!");
                return;
            }

            const file = files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                self.selectedFile = event.target.result;
            };

            reader.readAsText(file);
        }

        this.element.appendChild(this.importInput);
        this.element.appendChild(document.createElement("br"))

        this.importButton = document.createElement("button");
        this.importButton.classList.add("difficulty-button")
        this.importButton.type = "button"
        this.importButton.onclick = () => this.importFromFile();
        this.importButton.textContent = "IMPORT";
        this.element.appendChild(this.importButton);

        this.exportButton = document.createElement("button");
        this.exportButton.classList.add("difficulty-button")
        this.exportButton.type = "button"
        this.exportButton.onclick = () => this.settings.export();
        this.exportButton.textContent = "EXPORT";
        this.element.appendChild(this.exportButton);
    }

    importFromFile() {
        if (!this.selectedFile) {
            alert("You must upload a file to import!");
            return;
        }

        try {
            this.settings.import(JSON.parse(this.selectedFile));
            this.update();
        } catch (e) {
            alert("Failed to import settings! Make sure the file is valid.");
            return;
        }

        this.importInput.value = "";
        this.selectedFile = null;
        alert("Settings imported successfully!");

    }

    update() {
        for (const control of this.inputs) {
            const value = this.settings.getSetting(control.settingId);

            if (control.type === 'boolean') {
                control.input.checked = value;
            } else if (control.type === 'range') {
                control.input.value = value;
            }
        }
    }

    createFrame(settingId, setting) {
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.margin = "8px";

        const label = document.createElement("p");
        label.textContent = setting.Description;
        label.style.marginRight = "12px";
        container.appendChild(label);

        switch (setting.Type) {
            case 'boolean':
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = this.settings.getSetting(settingId);

                checkbox.addEventListener('change', (event) => {
                    this.settings.changeSetting(settingId, event.currentTarget.checked)
                })

                container.appendChild(checkbox);
                this.inputs.push({ settingId, input: checkbox, type: 'boolean' });
                break;

            case 'range':
                const range = document.createElement("input");
                range.type = "range";
                range.min = setting.Min;
                range.max = setting.Max;
                range.value = this.settings.getSetting(settingId);

                range.addEventListener('change', (event) => {
                    this.settings.changeSetting(settingId, event.currentTarget.value);
                })


                container.appendChild(range);
                this.inputs.push({ settingId, input: range, type: 'range' });
                break;
        }



        this.element.appendChild(container);
    }
}