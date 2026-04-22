// Handler transkripsi dummy agar bisa langsung tampil di dev/local tanpa OpenAI & serverless Vercel
export default async function handler(req, res) {
  // simulasi hasil transkripsi dummy
  res.json({
    text: "Ini adalah hasil transkripsi dummy untuk pengujian lokal.",
    language: "id",
    duration: 5.2
  });
}