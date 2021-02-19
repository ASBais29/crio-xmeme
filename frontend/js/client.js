//Server hosted http://localhost:8081/memes
const DB_URL = 'http://localhost:8081/memes';
const form = document.querySelector('form');
const container = document.getElementById("individual");

getMemes();

//Function to GET all memes from server using Fetch API
function getMemes() {
    container.innerHTML = '';
    fetch(DB_URL)
        .then(res => res.json())
        .then(memes => {
            console.log(memes);
            memes.map((meme) => {
                var first_meme = document.createElement("div");
                first_meme.className = "memes";

                var name = document.createElement("h3");
                name.innerHTML = `<span style='font-size:40px'>${meme.name}</span>`;
                first_meme.appendChild(name);

                var image = document.createElement("div");
                image.innerHTML = `<img style=" height:170px width:auto; max-width:400px;"src=${meme.url} onerror="if (this.src != 'https://miro.medium.com/max/1600/1*XrZiuWJdbWIfKyVFvLk9Pg.png') this.src = 'https://miro.medium.com/max/1600/1*XrZiuWJdbWIfKyVFvLk9Pg.png';"></img>`
                first_meme.appendChild(image);

                var caption = document.createElement("h5");
                caption.innerHTML = meme.caption;
                first_meme.appendChild(caption);

                first_meme.appendChild(document.createElement("hr"))

                container.appendChild(first_meme);

            })
        })
        .catch(err => console.log(err))
};

let memesRecieved = new Array();

//Event listener 'submit' for posting a new meme to the server using Fetch POST method
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const caption = formData.get('caption');
    const url = formData.get('url');
    const xmeme = {
        name,
        url,
        caption
    };

    fetch(DB_URL, {
            method: 'POST',
            body: JSON.stringify(xmeme),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            form.reset();
            getMemes();
        })
        .catch(err => console.log(err))
})

//Update a meme by /:id using Fetch PATCH method
fetch(DB_URL + "/" + id, {
        method: 'PATCH',
        body: JSON.stringify(changeInData),
        headers: { "Content-type": "application/json" }
    })
    .then(
        res => res.json()
    )
    .then(res => console.log(res))
    .catch(err => console.log(err));