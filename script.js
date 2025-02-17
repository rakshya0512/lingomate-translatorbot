let awaitingTranslation = false;
let translationData = { from: "", to: "" };

function sendMessage() {
    let chatBox = document.getElementById("chat-box");
    let userInput = document.getElementById("user-input").value.trim();

    if (userInput === "") return;

    appendMessage("You", userInput, "user-message");

    if (/bye|goodbye|thanks|thank you/i.test(userInput)) {
        appendMessage("Bot", "<br>My pleasure!! Have a great day!👋 ", "bot-message");
        document.getElementById("user-input").value = "";
        return;
    }

    if (awaitingTranslation) {
        awaitingTranslation = false;
        translateText(userInput, translationData.from, translationData.to);
        document.getElementById("user-input").value = "";
        return;
    }

    let match = userInput.match(/translate from (\w+) to (\w+)/i);
    if (match) {
        translationData.from = match[1].toLowerCase();
        translationData.to = match[2].toLowerCase();
        awaitingTranslation = true;
        appendMessage("Bot", `<br>Got it! Please enter the text to translate`, "bot-message");
    } else {
        appendMessage("Bot", "<br>Hi! How can I help?<br>You can say 'Translate from English to French'.", "bot-message");
    }

    document.getElementById("user-input").value = "";
}

function translateText(text, fromLang, toLang) {
    fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`)
        .then(response => response.json())
        .then(data => {
            if (data.responseData.translatedText) {
                appendMessage("Bot", `<br><br>Translation (${fromLang} → ${toLang}): ${data.responseData.translatedText}`, "bot-message");
            } else {
                appendMessage("Bot", `<br>Sorry, I can't translate to ${toLang}. Try another language!`, "bot-message");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("Bot", "<br>Oops! Something went wrong.", "bot-message");
        });
}

function appendMessage(sender, message, className) {
    let chatBox = document.getElementById("chat-box");
    let messageElement = document.createElement("p");
    messageElement.classList.add(className);
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);

    chatBox.scrollTop = chatBox.scrollHeight;
}
