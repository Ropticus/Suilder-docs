(function () {
    var reset = SphinxRtdTheme.Navigation.reset;

    SphinxRtdTheme.Navigation.reset = function () {
        reset.apply(this, arguments);

        var navScroll = document.querySelector(".wy-side-scroll");
        var current = navScroll.querySelectorAll("li.current");
        current = current[current.length - 1];

        if (current)
            navScroll.scrollTo(0, current.offsetTop - navScroll.offsetHeight / 2, 0);
    }.bind(SphinxRtdTheme.Navigation);

    document.querySelectorAll("table.docutils td").forEach(function (element) {
        if (element.textContent.length >= 30)
            element.classList.add("td-nowrap");
    });
}());