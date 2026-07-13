export default async function handler(req, res) {
  // Mengambil pesan dari query URL, misal: /api/send?text=PesanKamu
  const message = req.query.text;

  // Validasi jika pesan kosong
  if (!message) {
    return res.status(400).json({ 
      error: 'Pesan tidak boleh kosong. Gunakan format: /api/send?text=PesanKamu' 
    });
  }

  // Mengambil Token dan Chat ID dari Environment Variables Vercel
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Konfigurasi Token atau Chat ID belum disetel.' });
  }

  const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return res.status(200).json({ success: true, message: 'Pesan berhasil terkirim ke Telegram!' });
    } else {
      return res.status(500).json({ success: false, error: data.description });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
