function getRandomPleaseColour() {
    changeColour(Please.make_color());
}

function changeColour(color) {
    document.body.style.backgroundColor = color;
}

/* This function is not used at the moment but was too complicated to get working so I'm not removing it */
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    changeColour(color);
}

