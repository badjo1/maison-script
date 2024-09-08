function drawTextWithSVGs(canvas, text, letterSVGs) {
    canvas.style.margin = '50px'; //todo verwerken in het canvas
    const context = canvas.getContext("2d");
    let xOffset = 0;
    let yOffset = 0;
    const maxLineLength = 16; // Maximale karakters per regel
    const lineHeight = 160; // Hoogte tussen regels

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

    // Functie om de tekst op te splitsen in regels van maximaal 20 karakters
    function splitTextIntoLines(text, maxLineLength) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length <= maxLineLength) {
                currentLine += (currentLine.length ? ' ' : '') + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        });

        // Voeg de laatste regel toe als die niet leeg is
        if (currentLine.length > 0) {
            lines.push(currentLine);
        }

        return lines;
    }

    // Tekst splitsen in regels van maximaal 20 karakters
    const lines = splitTextIntoLines(text, maxLineLength);

    // Functie om alle afbeeldingen te tekenen
    function drawAllImages() {
        const width = 100;
        const height = 100;

        lines.forEach(line => {
            xOffset = 0; // Reset xOffset voor elke nieuwe regel
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                const upperChar = char.toUpperCase();
                if (preloadedImages[upperChar]) {
                    const img = preloadedImages[upperChar];
                    context.drawImage(img, xOffset, yOffset, width, height);
                    xOffset += width; // Verhoog xOffset met de breedte van de afbeelding
                } else {
                    // Verwerk tekens zonder corresponderende SVG's (optioneel)
                    xOffset += 40; // Verhoog met een vaste breedte als er geen SVG is
                }
            }
            yOffset += lineHeight; // Ga naar de volgende regel
        });
    }
}
