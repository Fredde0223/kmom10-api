De olika tekniker jag använt i mitt api är:

bcryptjs
cors
dotenv
express
jsonwebtoken
morgan
sqlite3

Bcrypt används för att hasha användarnas lösenord och sedan jämföra lösenord vid inloggningsprocessen.

Cors tillåter oss att requesta data från en begränsad domän som ligger utanför den domän där requesten gjordes, vilket i detta fall tillåter hämtningen av data från api till frontend.

Dotenv laddar in miljö-variabler från en .env fil och låter oss använda dessa i api:et. I detta fallet läses vår JWT-secret in för att kontrollera att token stämmer.

Express är det ramverk som används för att bygga api:et och hjälpa oss att skapa våra routes.

Morgan är en middleware används för att lätt kunna logga bl.a. requests och errors.

Sqlite3 är tekniken bakom den databas api:et läser in sin data från.

Anledningen till att jag gjorde just dessa teknikvalen är att jag innan kursen inte kände till de tekniker vi arbetat med. Mina val baserades alltså på tikniker vi fick se under de olika momenten. Den enda teknik jag inte stötte på genom att den presenterades i kursen var dotenv, som jag var tvungen att använda för att läsa in min JWT-secret på min driftsatta sida. De tekniker som användes här var nödvändiga för at allt skulle fungera.
