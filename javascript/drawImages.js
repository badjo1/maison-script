function drawTextWithSVGs(canvas, text, letterSVGs) {
    canvas.style.margin = '50px'; //todo in het canvas
    const context = canvas.getContext("2d");
    let xOffset = 0;

    // Maak een Set van unieke karakters in de tekst (ongeacht hoofd- of kleine letters)
    const uniqueChars = [...new Set(text.toUpperCase())];
    // Vooraf laden van benodigde SVG's
    const preloadedImages = {};
    let imagesToLoad = uniqueChars.length; // Tel hoeveel afbeeldingen moeten worden geladen
    // Functie om te controleren of alle afbeeldingen zijn geladen
    function checkIfAllLoaded() {
        imagesToLoad--;
        if (imagesToLoad === 0) {
            // Als alle afbeeldingen geladen zijn, teken dan alles
            drawAllImages();
        }
    }

    uniqueChars.forEach(char => {
        if (letterSVGs[char]) {
            const img = new Image();
            img.src = letterSVGs[char];
            preloadedImages[char] = img;

            img.onload = () => {
                console.log(`SVG geladen voor letter: ${char}`);
                checkIfAllLoaded();
            };

            img.onerror = () => {
                console.error(`Kon SVG niet laden voor letter: ${char}`);
                checkIfAllLoaded(); // Fout ook afhandelen als 'geladen' om verder te kunnen
            };
        } else {
            // Als er geen SVG voor een teken is, verminder toch de teller
            checkIfAllLoaded();
        }
    });

     // Functie om alle afbeeldingen te tekenen
    function drawAllImages() {
        const width = 100;
        const height = 100;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const upperChar = char.toUpperCase();
            if (preloadedImages[upperChar]) {
                const img = preloadedImages[upperChar];
                context.drawImage(img, xOffset, 0, width, height);
                xOffset += width; // Verhoog xOffset met de breedte van de afbeelding
            } else {
                // Verwerk tekens zonder corresponderende SVG's (optioneel)
                xOffset += 40; // Verhoog met een vaste breedte als er geen SVG is
            }
        }
    }  
}
