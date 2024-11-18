const apiKey = "AIzaSyDDX6pM6BPsPOG2vBDFZtYV8x6ATw6MAx8";


async function sendMessage() {
  const userMessage = document.getElementById("userInput").value.trim();
  if (userMessage === "") return;


  addMessage(userMessage, "user-message");
  document.getElementById("userInput").value = "";


  addMessage("Typing...", "typing");

  try {
  
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
     
      const errorDetails = await response.text();
      console.error("API Error:", errorDetails);
      addMessage(
        `Error: ${response.status} - ${response.statusText}`,
        "bot-message"
      );
      return;
    }

    
 
    removeTypingIndicator();

    
    const data = await response.json();


    if (data && data.candidates && data.candidates.length > 0) {
      const botMessage = data.candidates[0].content.parts[0].text;
      addMessage(botMessage, "bot-message"); 
    }

     else {
      
      addMessage("Error: No response from the bot.", "bot-message");
      console.error("No valid candidates in the response", data);
    }
  } 
  
  catch (error) {
    
    removeTypingIndicator();

    addMessage("Error: Unable to communicate with the bot.", "bot-message");
    console.error("Error:", error);
  }
}


function addMessage(content, className) {
  const chatbox = document.getElementById("chatbox");
  const messageElement = document.createElement("div");
  messageElement.className = `message ${className}`;
  messageElement.textContent = content;
  chatbox.appendChild(messageElement);
  chatbox.scrollTop = chatbox.scrollHeight; 
}


function removeTypingIndicator() {
  const chatbox = document.getElementById("chatbox");
  const typingElements = chatbox.getElementsByClassName("typing");
  while (typingElements.length > 0) {
    typingElements[0].remove();
  }
}


function handleEnterKey(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}


document
  .getElementById("userInput")
  .addEventListener("keypress", handleEnterKey);