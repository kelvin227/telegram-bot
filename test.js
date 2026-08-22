const detectLanguage = require("./ai/languageDetector");

console.log(detectLanguage("What is staking?"));

console.log(detectLanguage("¿Qué es el staking?"));

console.log(detectLanguage("Bonjour, comment ça va?"));

console.log(detectLanguage("Hola"));

console.log(detectLanguage("Merci"));

console.log(detectLanguage("Ndewo"));