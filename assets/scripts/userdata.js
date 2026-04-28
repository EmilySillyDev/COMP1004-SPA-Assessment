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