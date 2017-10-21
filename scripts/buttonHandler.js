function handleSearchButton(e) {
    getFilmography(document.getElementById('searchField').value);
    document.getElementById('searchField').value = "";
}
