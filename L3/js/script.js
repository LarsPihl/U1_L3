// Globala konstanter och variabler.
const wordList = ["BLOMMA","LASTBIL","SOPTUNNA","KÖKSBORD","RADIOAPPARAT","VINTER","SOMMAR","DATORMUS","LEJON","ELEFANTÖRA","JULTOMTE","SKOGSHYDDA","BILNUMMER","BLYERTSPENNA","SUDDGUMMI","KLÄDSKÅP","VEDSPIS","LJUSSTAKE","SKRIVBORD","ELDGAFFEL","STEKPANNA","KASTRULL","KAFFEBRYGGARE","TALLRIK","SOFFBORD","TRASMATTA","FLYGPLAN","FLYGPLATS","TANGENTBORD"]; // Lista (array) med ord som ska väljas slumpmässigt
var selectedWord/*Variabel för slumpmässigt valt ord*/, letterBoxes/*Variabel för tomma rutor
för slumpordet*/, hangmanImg/*Referens till bildobjektet av 'hänga gubben'*/, hangmanImgNr/*Räknare
som bestämmer vilken bild som ska visas*/, msgElem/*Referens till det område där utskrift till
en användare görs*/, i/*Variabel för genomsökning i for-satser.*/, startGameBtn/*Referens till startknappen.*/,
letterButtons/*Referens till bokstavsknapparna*/, startTime/*Variabel som håller bevarar starttiden.*/; 
// ------------------------------
// Funktion som körs då hela webbsidan är inladdad, dvs då all HTML-kod är utförd
// Initiering av globala variabler samt koppling av funktioner till knapparna.
function init() {

    startGameBtn = document.getElementById("startGameBtn");//Variabel för startknappen, så att den kan 
    //aktiveras och inaktiveras utan att referera till 'document.getElementById("startGameBtn")' varje gång.
    letterButtons = document.getElementById("letterButtons").getElementsByTagName("button");//Arrayvariabel som 
    //berör alla knappar i elementet 'letterButtons'.
    for (i = 0; i < letterButtons.length; i++) {//När en knapp trycks på anropas funktionen 'guessLetter'. Detta
        //gäller alla knappar.
        letterButtons[i].onclick = guessLetter;
    }

    /*Variabler som refereras till visad bild respektive utskrift till användaren. De skapas för att
    'document.getElementById()' ska behövas skrivas varje gång.*/
    hangmanImg = document.getElementById("hangman");
    msgElem = document.getElementById("message");

    startGameBtn.disabled = false;//Startknappen sätts till aktiverad.
    for (i = 0; i < letterButtons.length; i++) {
        letterButtons[i].disabled = true;//Alla bokstavsknappar sätts till inaktiverade.
    }
	
} // End init
window.onload = init; // Ser till att init aktiveras då sidan är inladdad.
// ------------------------------

function startGame() {/*Funktion som anropas när startknappen trycks på. Den anropar i sin tur 'randomWord' och 
'showLetterBoxes'. Den ursprungliga bilden sätts in i 'hangmanIMG' och felräknaren, som framkallar olika bilder
beroende på dess värde, sätts också till startvärdet 0.*/

    randomWord();
    showLetterBoxes();
    hangmanImg.src = "img/h0.png";
    hangmanImgNr = 0;

    startGameBtn.disabled = true;//Då spelet är igång inaktiveras startknappen. Bokstavsknapparna aktiveras däremot.
    for (i = 0; i < letterButtons.length; i++) {
        letterButtons[i].disabled = false;
    }
    msgElem.innerHTML = "";//Innehållet i 'msgElem' tömms, då en eventuell tidigare utskrift annars hade varit synlig.

    let now = new Date();//Aktuell tid sparas och omvandlas till passerade millisekunder sedan den 1 Januari 1970, för
    //att senare enkelt räkna den tid som passerar mellan spelets början och slut.
    startTime = now.getTime();
    
}//startGame()

function randomWord() {/*Funktion som genererar ett slumpmässigt tal som mellan 0 och längden på ordlistan.
Det ord som återfinns på det slumpmässigt valda indexet sätts till aktuellt slumpord, om det inte 
är samma ord som i föregående spelrunda.*/

    let oldWord = selectedWord;//Eventuellt gammalt slumpord sparas i variabeln 'oldWord' för jämförelse med det nyvalda slumpordet.
    let wordIndex = Math.floor(Math.random() * (wordList.length));//Ett slumptal mellan 0 och ordlistans längd genereras.
    selectedWord = wordList[wordIndex];//Det ord som återfinns i ordlistan på det slumpmässigt valda indexet sätts till slumpord.
    while (oldWord == selectedWord) {//Så länge som det nyvalda slumpordet är samma som föregående rundas slumpord 
        //genereras istället ett nytt ord på samma sätt som tidigare.
        let wordIndex = Math.floor(Math.random() * (wordList.length));
        selectedWord = wordList[wordIndex];
    }
    
}//randomWord

function showLetterBoxes() {/*Funktion som visar antalet vita rutor, antalet motsvarar slumpordets längd.
I varje ruta sätts ett blanktecken, då span-element ej kan vara tomma om en tom ruta ska visas. 
Slutligen sätts variabeln 'letterBoxes' som en array som refereras till alla spanelement, vilket innebär alla rutor.*/

    let newCode = "";//Lokal variabel för innehållet i varje vit bokstavsruta.
    for (i = 0; i < selectedWord.length; i++) {
        newCode += "<span>&nbsp;</span>";//Variabeln fylls med ett spanelement innehållande ett blanksteg.
        document.getElementById("letterBoxes").innerHTML = newCode;//Varje ruta fylls med innehållet i 'newCode'.
        letterBoxes = document.getElementById("letterBoxes").getElementsByTagName("span");//Array med alla spanelement.
    }

}//showLetterBoxes

function guessLetter() {//Funktionen där gissad bokstav jämförs med innehållet i slumpordet. Antal rätt och fel gissningar
    //samt ifall alla bokstäver har hittats kontrolleras också, vilket slutligen skickar användaren vidare till
    //funktionen 'endGame'.

    let letter = this.value;//Värdet som återfinns i aktuellt knappelement för en nedtryck knapp sätts till gissad bokstav.
    this.disabled = true;//Knappen inaktiveras efter nedtryckning.
    let letterFound = false;//Bool för om en korrekt bokstav hittas eller ej. Den sätts ursprunligen till 'false'.
    let correctLettersCount = 0;//Variabel för antal rätt gissade bokstäver, startar på 0.
    for (i = 0; i < selectedWord.length; i++) {//Det slumpmässigt valda ordet söks igenom.
        if (letter == selectedWord.charAt(i)) {//Om den gissade bokstaven hittas skrivs den in i den ruta eller de 
            //rutor där den finns i slumpordet.
            letterFound = true;//Boolen sätts till 'true' så att de ändringar som sker vid en felgissning ej
            //ska äga rum.
            document.getElementById("letterBoxes").getElementsByTagName("span")[i].innerHTML = letter;//Motsvarande ruta
            //eller rutor fylls med det rätt gissade bokstaven.
        }     
        if (letterBoxes[i].innerHTML != "&nbsp;") {
            correctLettersCount++;//Då slumpordet genomsöks så kontrolleras alla blanktecken. Om en ruta utan
            //blanktecken hittas så adderas variabeln för antal rätt gissade bokstäver med 1.
        }
    }

    if (correctLettersCount == selectedWord.length) {//Om antal rätt gissade bokstäver motsvarar slumpordets längd
        //anropas funktionen 'endGame' med parametern 'false'.
        endGame(false);
    }
    
    if (letterFound == false) {//Om gissad bokstav ej hittas byts dåvarande bild ut mot nästa i ordningen och 
        //felräknaren adderas med 1. 
        
        hangmanImgNr++;
        if (hangmanImgNr <=6) {
            hangmanImg.src = "img/h" + hangmanImgNr + ".png";
        }

        if (hangmanImgNr >=6) {//När felräknaren når 6 så anropas funktionen 'endGame' med parametern 'true'.
            endGame(true); 
        }

    }

}//guessLetter

function endGame(manHanged) {

    let runTime = (new Date().getTime() - startTime) / 1000;//Antal sekunder beräknas genom att subtrahera
    //aktuell tid i millisekunder från den tid som sparades i spelets början. Skillnaden divideras med 1000 för att
    //få fram antal sekunder som passerat. Denna tid sparas i variabeln 'runTime'.

    if (manHanged == true) {//Då funktionen anropats med parametern 'true' skrivs slumpordet ut.
        msgElem.innerHTML = "Gubben hängdes, det rätta ordet var " + selectedWord + ".";
    }

    else {//I annat fall har funktionen anropats med parametern 'false', vilket ger en vinstutskrift.
        msgElem.innerHTML = "Grattis, du vann.";
    }

    startGameBtn.disabled = false;//Startknappen aktiveras igen så att spelet kan startas om.
    for (i = 0; i < letterButtons.length; i++) {
        letterButtons[i].disabled = true;//Bokstavsknapparna inaktiveras.
    }

    msgElem.innerHTML += "<br>Det tog " + runTime.toFixed(1) + " sekunder.";//Passerad tid skrivs ut 
    //både då en användare vunnit eller förlorat.

}//endGame



