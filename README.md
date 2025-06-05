# Tuneradar
## Projekt i Frontend-baserad webbutveckling

Detta är en webbapplikation som visar topplistor på artister och låtar, samt konserter. Det är en API mashup som hämtar data från: 
* [Last.fm](https://www.last.fm/api/intro)
* [Deezer](https://developers.deezer.com/api)
* [Ticketmaster](https://developer.ticketmaster.com/products-and-docs/apis/getting-started/)
  
Det finns en funktion för att söka på artister. En sida på artisten visas med populära låtar med tillgång till förhandslyssning, 
liknande artister, samt en lista över kommande konserter.

## Användning av projektet
1. Klona repo
```bash
git clone https://github.com/rare2400/Projekt-Frontend.git
```

3. Installera paket
```bash
npm install
```

4. Starta utvecklingsserver
```bash
npm run start
```
4. Öppna `http://localhost:1234/` i webbläsaren

5. Skapa JSDoc dokumentation
```bash
jsdoc src/
```

6. Bygg färdigt projekt
```bash
npm run build
```
## Funktionalitet
- Klicka på populära artister på startsidan
- Se konserter i närheten
- Söka på artister
- Förhandslyssna på låtar
- Se artisters kommande konserter
- Gå vidare för att hitta biljetter


## Verktyg
- **Parcel**: Gör utvecklingsprocessen automatiseras
- **HTML**: För att bygga webbapplikation
- **SASS**: CSS-preprocessor för att styla webbplats
- **JavaScript**: Hämta data från API och manipulera DOM
- **JSDoc**: Dokumenterar JavaScript-kod
- **Git**: Versionshantering av koden

## Författare
Ramona Reinholdz    
[rare2400@student.miun.se](rare2400@student.miun.se)     
Mittuniversitetet, Webbutvecklingsprogrammet
