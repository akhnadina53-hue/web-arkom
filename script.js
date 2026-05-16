const rekamBtn = document.getElementById('rekamBtn');
const resultDiv = document.getElementById('result');
const orb = document.querySelector('.orb');
const ringkasBtn = document.getElementById('ringkasBtn');
const tanyaBtn = document.getElementById('tanyaBtn');
const questionInput = document.getElementById('question');
const transcriptDiv = document.getElementById('transcript');
const summaryDiv = document.getElementById('summary');
const keyPointsUl = document.getElementById('keyPoints');
const answerArea = document.getElementById('answerArea');
const generateQaBtn = document.getElementById('generateQaBtn');
const generatedQuestionsDiv = document.getElementById('generatedQuestions');
const speakSummaryBtn = document.getElementById('speakSummaryBtn');
const voiceSelect = document.getElementById('voiceSelect');
const rateRange = document.getElementById('rateRange');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let recognition;
let interimTranscript = '';
let finalTranscript = '';
let lastText = '';

function supportsSpeechRecognition() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function initSpeechRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const r = new SR();
  r.continuous = true;
  r.interimResults = true;
  r.lang = 'id-ID';
  r.onresult = (ev) => {
    let interim = '';
    let final = '';
    for (let i = ev.resultIndex; i < ev.results.length; ++i) {
      if (ev.results[i].isFinal) final += ev.results[i][0].transcript + ' ';
      else interim += ev.results[i][0].transcript;
    }
    interimTranscript = interim;
    finalTranscript += final;
    transcriptDiv.textContent = (finalTranscript + interimTranscript).trim() || '—';
  };
  r.onerror = (e) => console.warn('SpeechRecognition ierror', e);
  return r;
}

rekamBtn.onclick = async () => {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    finalTranscript = '';
    interimTranscript = '';

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioURL = URL.createObjectURL(audioBlob);
      resultDiv.innerHTML = `<p>Rekaman selesai:</p><audio controls src="${audioURL}"></audio>`;
      lastText = (finalTranscript + interimTranscript).trim();
      if (!lastText) {
        lastText = 'Ini adalah transkripsi sementara (fallback).';
        transcriptDiv.textContent = lastText;
      }
      transcriptDiv.textContent = lastText;
    };

    mediaRecorder.start();
    if (supportsSpeechRecognition()) {
      recognition = initSpeechRecognition();
      if (recognition) recognition.start();
    }

    isRecording = true;
    rekamBtn.textContent = '⛔ Stop Rekam';
    orb.style.background = 'radial-gradient(circle, #ef4444, #b91c1c)';
    resultDiv.textContent = '🎧 Sedang merekam...';
  } else {
    // stop
    mediaRecorder.stop();
    if (recognition) {
      recognition.stop();
    }
    isRecording = false;
    rekamBtn.textContent = '🎤 Mulai Rekam';
    orb.style.background = 'radial-gradient(circle, #38bdf8, #2563eb)';
  }
};

function summarizeText(text, maxSentences = 3) {
  if (!text) return { summary: 'Tidak ada teks untuk diringkas.', keyPoints: [] };
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
  const sorted = sentences.slice().sort((a, b) => b.length - a.length);
  const summary = sorted.slice(0, Math.min(maxSentences, sorted.length)).join(' ');

  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
  const freq = {};
  words.forEach(w => { if (w.length > 3) freq[w] = (freq[w] || 0) + 1; });
  const topWords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(e => e[0]);
  const keyPoints = topWords.map(w => {
    const s = sentences.find(s => s.toLowerCase().includes(w)) || w;
    return s.trim();
  }).filter(Boolean);

  return { summary: summary.trim(), keyPoints };
}

ringkasBtn.onclick = () => {
  const text = lastText || transcriptDiv.textContent;
  const { summary, keyPoints } = summarizeText(text);
  summaryDiv.textContent = summary;
  keyPointsUl.innerHTML = keyPoints.map(k => `<li>${k}</li>`).join('');
};

// --- Simple Q&A heuristics ---
function findBestAnswer(question, text) {
  if (!text) return 'Belum ada transkrip.';
  const qWords = question.toLowerCase().split(/\s+/).filter(Boolean);
  const sentences = text.match(/[^.!?]+[.!?]?/g) || [text];
  let best = { score: 0, sent: '' };
  sentences.forEach(s => {
    let score = 0;
    const sw = s.toLowerCase();
    qWords.forEach(w => { if (sw.includes(w)) score += 1; });
    if (score > best.score) best = { score, sent: s };
  });
  if (best.score === 0) return 'Maaf, jawaban tidak ditemukan dalam transkrip. Coba ringkas terlebih dahulu.';
  return best.sent.trim();
}

tanyaBtn.onclick = () => {
  const q = questionInput.value.trim();
  if (!q) return;
  const answer = findBestAnswer(q, lastText || transcriptDiv.textContent);
  answerArea.innerHTML = `<b>Pertanyaan:</b> ${q}<br><b>Jawaban:</b> ${answer}`;
};

generateQaBtn.onclick = () => {
  const text = lastText || transcriptDiv.textContent;
  const { keyPoints } = summarizeText(text, 4);
  if (!keyPoints.length) {
    generatedQuestionsDiv.textContent = 'Tidak ada poin untuk dijadikan pertanyaan.';
    return;
  }
  const qs = keyPoints.map((p, i) => `<div class="gen-q"><b>Q${i+1}:</b> Jelaskan: ${p}</div>`).join('');
  generatedQuestionsDiv.innerHTML = qs;
};

// --- klien (user) ---
function populateVoices() {
  const voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = voices.map(v => `<option value="${v.name}">${v.name} — ${v.lang}</option>`).join('');
}

speechSynthesis.onvoiceschanged = populateVoices;
populateVoices();

speakSummaryBtn.onclick = () => {
  const text = summaryDiv.textContent || lastText || transcriptDiv.textContent;
  if (!text) return;
  const utter = new SpeechSynthesisUtterance(text);
  const selected = voiceSelect.value;
  const voices = speechSynthesis.getVoices();
  const v = voices.find(x => x.name === selected) || voices[0];
  if (v) utter.voice = v;
  utter.rate = parseFloat(rateRange.value || '1');
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
};

window.lastText = () => lastText;