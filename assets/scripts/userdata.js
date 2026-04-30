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
                this.loadedSettings[key] = init[key];
            }
        }
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
}

export class SettingsInput {
    constructor(element, settings) {
        this.element = element;
        this.settings = settings;

        for (const [key, value] of Object.entries(SETTINGS)) {
            this.createFrame(key, value)
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
                break;
        }



        this.element.appendChild(container);
    }
}