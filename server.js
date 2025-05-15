// server.js (versión ES Module)
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Necesario para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/contacto', async (req, res) => {
  const token = req.body['g-recaptcha-response'];
  const secretKey = process.env.RECAPTCHA_SECRET;

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secretKey}&response=${token}`,
  });

  const data = await response.json();

  if (!data.success) {
    return res.status(400).json({ message: 'Captcha inválido' });
  }

  console.log('Formulario verificado:', req.body);
  res.json({ message: 'Formulario recibido' });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log('Servidor ONLINE')
});
