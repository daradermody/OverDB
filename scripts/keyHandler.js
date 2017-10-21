function handleKeyPress(e) {
    var key = e.keyCode || e.which;
    if (key === 13) {
        getFilmography(document.getElementById('searchField').value);
        document.getElementById('searchField').value = "";
    }
}
