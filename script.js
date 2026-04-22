const rekamBtn = document.getElementById('rekamBtn');
const resultDiv = document.getElementById('result');
const orb = document.querySelector('.orb');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

rekamBtn.onclick = async () => {

  if (!isRecording) {
    // 🎤 minta akses mic
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async() => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(audioBlob);
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      
      resultDiv.innerHTML = "⏳ Mengubah suara jadi teks...";
      
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      const text = data.text;
      // tampilkan audio player
      resultDiv.innerHTML = `
        <p>Rekaman selesai:</p>
        <audio controls src="${audioURL}"></audio>
      `;
    };

    mediaRecorder.start();
    isRecording = true;

    rekamBtn.textContent = "⛔ Stop Rekam";
    orb.style.background = "radial-gradient(circle, #ef4444, #b91c1c)";
    resultDiv.textContent = "🎧 Sedang merekam...";

  } else {
    // stop rekaman
    mediaRecorder.stop();
    isRecording = false;

    rekamBtn.textContent = "🎤 Mulai Rekam";
    orb.style.background = "radial-gradient(circle, #38bdf8, #2563eb)";
  }
};