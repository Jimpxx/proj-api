# Projekt API

Projektets API använder sig av teknologierna Node.js, express, Mongodb, Mongoose, bcrypt, jsonwebtoken, CORS, morgan och socket.io.

Node.js och express används för grunden i APIn, routern, routes osv. Detta användes i resterande kursen också så det var inget nytt direkt.

Till databasen används Mongo. I reserande av kursen förutom sista kursmomentet har Sqlite3 använts. jag valde att använda Mongo till detta projekt för att få testa på det lite, vet att det är en populär databas och jag kände att det kunde vara bra att testa på en NoSQL databas. En annan orsak till att jag valde Mongo är att jag misstänkte att det skulle bli enklare att koppla ihop användare och aktier. Jag föreställde mig att jag skulle kunna lägga till aktierna i min samling med användare med en enkel array med objekt i sig vilket också visade sig fungera. Jag skipper också bry mig om realtionerna mellan användare och aktie då alla användarens aktier finns i samlingen som användaren lagras i.

Jag var lite orolig att använda Mongo till användarna då jag inte gjort det tidigare. Men efter lite efterforskningar och försök så blev det bra. Tillsammans med Mongodb använder jag Mongoose som låter en skapa modeller med Mongodb. Till detta projektet har jag en modell, User, som har all information om användaren, tillsammans med depån med alla aktier i sig, jag sparade depån i en array med aktierna som var sina objekt i sig.

Bcrypt används för att kryptera användarens lösenord och jsonwebtokens sköter autentiseringen med tokens. Dessa verktyg valdes eftersom vi har använt dem under kursens gång och jag tycker de har fungerat bra. Sedan har jag inte några andra verktyg att jämföra med eller välja bland så det var ett ganska enkelt val.

CORS används för att få lite säkerhet i webbläsaren med headers. Morgan används för att få lite loggning. Dessa verktyg användes också under kursens gång och de har fungerat hyfsat bra. Jag har haft några problem med CORS som jag har fått tampats med.

# Realtid

Socket.io används för att simulera realtidspriser på aktierna, var femte sekund ändras priserna på aktierna. Aktierna skickas från servern till clienten med hjälp av sockets, därav användningen av socket.io. Jag valde att lagra aktierna manuellt på servern. Aktierna består av tre aktier som är lagrade i en array med ett namn på aktien, en array med priser lagrade, jag har gjort så arrayen sparar upp till de 20 senaste priserna på varje aktie. Var femte sekund skickas denna array ut till klienterna som är anslutna till servern. För att få fram det slumpmässiga priset på aktierna används en funktion som Emil har med i ett av exemplena. Det är en funktion som tar in ett objekt som argument (aktien) och sedan görs beräkningar för att få fram ett slumpmässigt nytt pris till aktien som gått upp eller ner i pris.

Jag tycker att jag förstår sockets bättre än förut. Jag tycker socket.io fungerar bra, jag har visserligen inte så mycket att jämföra med men jag tycker att det går bra att arbeta med teknologin.
