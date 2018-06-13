console.log(`
███████╗███╗   ██╗ ██████╗  ██████╗ ██████╗ ██╗   ██╗
██╔════╝████╗  ██║██╔═══██╗██╔═══██╗██╔══██╗╚██╗ ██╔╝
███████╗██╔██╗ ██║██║   ██║██║   ██║██████╔╝ ╚████╔╝
╚════██║██║╚██╗██║██║   ██║██║   ██║██╔═══╝   ╚██╔╝
███████║██║ ╚████║╚██████╔╝╚██████╔╝██║        ██║
╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝        ╚═╝

`);

async function fetchLastModifiedTimes() {
  let res = await fetch('/api/responses');
  return res.json();
}

let timesListTag = document.getElementById('lastModifiedTimesList');

fetchLastModifiedTimes()
.then(times => {
  for (let modifiedTime of times) {
    let li = document.createElement("li");
    li.textContent = JSON.stringify(modifiedTime);

    timesListTag.appendChild(li);
  }
})
