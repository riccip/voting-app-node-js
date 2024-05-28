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
            if (option.classe != classe){
                const template = document.createElement("template");
                    template.innerHTML = `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${this.root.id}${option.classe}">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${this.root.id}${option.classe}" aria-expanded="false" aria-controls="collapse${this.root.id}${option.classe}">
                            ${option.classe} 
                            </button>
                            </h2>
                            <div id="collapse${this.root.id}${option.classe}" class="accordion-collapse collapse" aria-labelledby="heading${this.root.id}${option.classe}" data-bs-parent="#${this.root.id}" style="">
                                <div class="accordion-body">
                                </div>
                            </div>
                        </div>`;
                const fragment = template.content;
                this.root.appendChild(fragment);
                classe=option.classe;
                accordionBody= this.root.querySelectorAll(".accordion-body")[this.root.querySelectorAll(".accordion-body").length-1];
            } 
            console.log(accordionBody);
            const templateOption = document.createElement("template");
            const fragmentOption = templateOption.content;

           templateOption.innerHTML = `
                <div class="poll__option ${ this.selected == option.label ? "poll__option--selected": "" }">
                    <div class="poll__option-fill"></div>
                    <div class="poll__option-info">
                        <span class="poll__label">${ option.label }</span>
                        <span class="poll__percentage">${ option.percentage }</span>
                    </div>
                </div>
            `;

            if (!this.selected) {
                fragmentOption.querySelector(".poll__option").addEventListener("click", () => {
                    fetch(this.endpoint, {
                        method: "post",
                        body: `id=${ option.id }&gender=${ option.gender }`,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    }).then(() => {
                        this.selected = option.label;

                        sessionStorage.setItem(this.cookieName, option.label);

                        this._refresh();
                    })
                });
            }

            fragmentOption.querySelector(".poll__option-fill").style.width = `${ option.percentage }%`;

            accordionBody.appendChild(fragmentOption);
        }
    }
}

const p = new Poll(
    document.querySelector("#accordion-reDelBallo"),
    "Vota il re del ballo!",
    "poll",
    "reDelBalloCookie"
);


const reginetta = new Poll(
    document.querySelector("#accordion-reginettaDelBallo"),
    "Vota la reginetta del ballo!",
    "reginetta",
    "reginettaDelBalloCookie"
);