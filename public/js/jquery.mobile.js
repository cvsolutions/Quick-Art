$(window).load(function () {
    setTimeout(function () {
        window.scrollTo(0, 1);
    }, 0);
});

$(document).ready(function () {

    $('.js-rc-64').resizecrop({
        width: 64,
        height: 64,
        vertical: "center"
    });

    $('.js-rc-640').resizecrop({
        width: 640,
        height: 300,
        vertical: "center"
    });

});
