// Beispiel-URL für das Immobilienangebot
const propertyUrl="https://www.granjadelsol.com";

// Funktion zum Teilen per E-Mail
function shareOnEmail(lang) {

    let subject="";
    let body="";

    switch(lang) {
        case 'en':
            subject="For Sale: Property with House in Paraguay, José Fassardi";
            body=`Here you can find the full, detailed property offer: ${propertyUrl}`;
            break;
        case 'es':
            subject="En Venta: Propiedad con Casa en Paraguay, José Fassardi";
            body=`Aquí puedes ver la oferta completa y detallada de la propiedad: ${propertyUrl}`;
            break;
        default: // de
            subject="Zum Verkauf: Grundstück mit Haus in Paraguay, José Fassardi";
            body=`Hier findest du das komplette, detaillierte Immobilienangebot: ${propertyUrl}`;
    }
    window.location.href=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}


// Funktion zum Kopieren des Links
function copyLink() {
    // Erstelle ein unsichtbares Textfeld
    const tempInput=document.createElement("input");
    tempInput.value=propertyUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    // Zeige die Toast-Nachricht an
    const toast=document.getElementById("link-copied-msg");
    toast.classList.add("show-toast");

    // Verstecke die Nachricht nach 3 Sekunden
    setTimeout(() => {
        document.getElementById("link-copied-msg").style.display='none';
    }, 3000);
}