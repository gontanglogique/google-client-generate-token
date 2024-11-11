const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();

// Masukkan Client ID, Client Secret, dan Redirect URI dari Google Console
const CLIENT_ID = "xxxxx"
const CLIENT_SECRET = "xxxxxx"
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Endpoint untuk mengarahkan user ke halaman login Google
app.get('/auth/google', (req, res) => {
    console.log("masuk auth console")
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Mendapatkan refresh token
        scope: ['profile', 'email'] // Minta akses ke profil dan email user
    });
    res.redirect(authUrl);
});

// Callback endpoint setelah user login dan Google mengembalikan kode otorisasi
app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
    console.log("masuk auth callback")
    try {
        // Tukarkan kode otorisasi dengan access token
        const { tokens } = await oAuth2Client.getToken(code);
        // oAuth2Client.setCredentials(tokens);

        // // Ambil data user dari Google
        // const userInfoResponse = await oAuth2Client.request({
        //     url: 'https://www.googleapis.com/oauth2/v2/userinfo'
        // });
        // const userInfo = userInfoResponse.data;

        // Tampilkan data user

        res.json({
            message: "Login successful!",
            user: tokens
        });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).send('Authentication failed');
    }
});

// Jalankan server pada port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});