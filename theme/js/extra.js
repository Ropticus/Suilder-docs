document.addEventListener("DOMContentLoaded", function (event) {
    var currentTop = document.querySelector(".toctree-l1.current").offsetTop;

    if (currentTop >= 150)
        document.querySelector(".wy-side-scroll").scroll(0, currentTop);
});

document.querySelectorAll("table.docutils td").forEach(function (element) {
    if (element.textContent.length >= 30)
        element.classList.add("td-nowrap");
})