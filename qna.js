export default async function handler(req, res) {
    res.json({ answer: "Ini jawaban contoh dari AI" });
  }
  const tanyaBtn = document.getElementById("tanyaBtn");
const questionInput = document.getElementById("question");

tanyaBtn.onclick = async () => {
  const res = await fetch("/api/qa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: lastText,
      question: questionInput.value,
    }),
  });

  const data = await res.json();

  resultDiv.innerHTML += `<br><br><b>Jawaban:</b><br>${data.answer}`;
};