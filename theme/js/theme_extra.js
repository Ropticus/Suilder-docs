document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelectorAll(".section table").forEach(function (x) {
        x.classList.add("docutils");
    });
    document.querySelectorAll("pre code").forEach(function (x) {
        if (x.classList.length)
            x.classList.add("language-" + x.classList[0]);
    });
});