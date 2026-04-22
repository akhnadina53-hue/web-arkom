export default async function handler(req, res) {
    const { text } = await req.json();
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Ringkas teks ini untuk belajar (jelas dan padat)",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });
  
    const data = await response.json();
    res.json({ summary: data.choices[0].message.content });
  }