const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { google } = require('googleapis');
const keys = require('./app.json'); // Google API avtorizatsiya kaliti (OAuth 2.0 Klient ID va Secret key)

const app = express();

// HTML faylni serve qilish
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Google Sheets ma'lumotlar bazasiga kirish
async function accessSpreadsheet(values) {
  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  await client.authorize();
  const gsapi = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1-jeaV2cyrNqFe9lmi8qstl-bkPzYupM_zU5RWcnzjDY';
  let range;

  // Vaqt olish
  const now = new Date();
  const time = `${now.getHours()}:${now.getMinutes()}`;

  // Hafta kuniga qarab jadvallar cellarini aniqlash
  switch (now.getDay()) {
    case 1: range = 'B2'; break; // Dushanba
    case 2: range = 'C2'; break; // Seshanba
    case 3: range = 'D2'; break; // Chorshanba
    case 4: range = 'E2'; break; // Payshanba
    case 5: range = 'F2'; break; // Juma
    case 6: range = 'G2'; break; // Shanba
    default: range = 'B2'; break; // Dushanba
  }

  // Matn bo'yicha qator (range) ni o'zgartirish
  switch (values) {
    case 'HK001': range = range[0] + '2'; break;
    case 'HK002': range = range[0] + '3'; break;
    case 'HK003': range = range[0] + '4'; break;
    case 'HK004': range = range[0] + '5'; break;
    case 'HK005': range = range[0] + '6'; break;
    case 'HK006': range = range[0] + '7'; break;
    case 'HK007': range = range[0] + '8'; break;
    case 'HK008': range = range[0] + '9'; break;
    case 'HK009': range = range[0] + '10'; break;
    case 'HK010': range = range[0] + '11'; break;
    case 'HK011': range = range[0] + '12'; break;
    case 'HK012': range = range[0] + '13'; break;
    case 'HK013': range = range[0] + '14'; break;
    case 'HK014': range = range[0] + '15'; break;
    case 'HK015': range = range[0] + '16'; break;
    default: range = range[0] + '2'; break;
  }

  // Ma'lumotlarni yozish
  const updateOptions = {
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: 'RAW',
    resource: {
      values: [
        [values, time] // HTML formasi orqali olingan ma'lumot va vaqt
      ]
    }
  };

  try {
    const response = await gsapi.spreadsheets.values.update(updateOptions);
    console.log('Ma\'lumotlar yozildi.');
  } catch (error) {
    console.error(`Xatolik yuz berdi: ${error}`);
  }
}

// HTML formasi uchun GET endpoint
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,   'index.html'));
});

// HTML formasi orqali POST so'rovi
app.post('/submit', (req, res) => {
  const { inputText } = req.body; // HTML formasi orqali kiritilgan matn
  if (inputText === 'HK001' || inputText === 'HK002' || inputText === 'HK003' || inputText === 'HK004' || inputText === 'HK005' || inputText === 'HK006' || inputText === 'HK007' || inputText === 'HK008' || inputText === 'HK009' || inputText === 'HK010' || inputText === 'HK011' || inputText === 'HK012' || inputText === 'HK013' || inputText === 'HK014' || inputText === 'HK015' ) {
    accessSpreadsheet(inputText); // Ma'lumotlarni Google Sheets ga yozish funktsiyasiga uzatish
    res.send('Ma\'lumotlar yozildi!');
  } else {
    res.send('Matn yozilmadi, chunki matn HK001, HK002 yoki HK003 emas');
  }
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ishga tushirildi: http://localhost:${PORT}`));
