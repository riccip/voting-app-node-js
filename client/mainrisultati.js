class Poll {
    constructor(root, title, postUrl, cookieName) {
        this.root = root;
        this.cookieName = cookieName;
        this.selected = sessionStorage.getItem(cookieName);
        this.endpoint = "https://votingws.onrender.com/" + postUrl;

        this.root.insertAdjacentHTML("afterbegin", `
            <div class="poll__title">${ title }</div>
        `);

        this._refresh();
    }

    async _refresh() {
        const response = await fetch(this.endpoint);
        const data = await response.json();

        this.root.querySelectorAll(".accordion-item").forEach(option => {
            option.remove();
        });
        let classe = "9Z";
        var accordionBody=this.root;
        for (const option of data) {
            console.log(accordionBody);
            const templateOption = document.createElement("template");
            const fragmentOption = templateOption.content;

           templateOption.innerHTML = `
                <div class="poll__option ${ this.selected == option.label ? "poll__option--selected": "" }">
                    <div class="poll__option-fill"></div>
                    <div class="poll__option-info">
                        <span class="poll__label">${ option.label }</span>
                        <span class="poll__percentage">${ option.percentage }%</span>
                    </div>
                </div>
            `;

            fragmentOption.querySelector(".poll__option-fill").style.width = `${ option.percentage }%`;

            this.root.appendChild(fragmentOption);
        }
    }
}

const p = new Poll(
    document.querySelector(".reDelBallo"),
    "Vota il re del ballo!",
    "pollRisultato",
    "reDelBalloCookie9999"
);


const reginetta = new Poll(
    document.querySelector(".reginettaDelBallo"),
    "Vota la reginetta del ballo!",
    "reginettaRisultato",
    "reginettaDelBalloCookie9999"
);