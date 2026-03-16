import { reply } from "../../lib/utils.js";
import fs from "fs";
import path from "path";

async function handle(sock, messageInfo) {
    const { m, remoteJid } = messageInfo;

    // Tentukan path ke file gambar
    // __dirname sering bermasalah di ES Module, jadi kita pakai path absolut
    const imagePath = path.resolve("./assets/qris.jpg");

    try {
        // Cek apakah filenya ada
        if (!fs.existsSync(imagePath)) {
            return await reply(m, "_Error: File qris.jpg tidak ditemukan di folder assets._");
        }

        // Kirim Gambar dari Storage
        await sock.sendMessage(remoteJid, {
            image: fs.readFileSync(imagePath), // Membaca file secara sinkron
            caption: "*── 💳 PEMBAYARAN QRIS ──*\n\nSilakan scan kode QR di atas untuk melakukan pembayaran.\n\n_Mohon sertakan bukti transfer setelah melakukan pembayaran._",
        }, { quoted: m });

    } catch (error) {
        console.error("ERROR QRIS:", error);
        await reply(m, `_Error: Gagal mengirim QRIS. ${error.message}_`);
    }
}

export default {
    handle,
    Commands: ["qris", "qr", "pay"], // User bisa panggil .qris atau .qr
    OnlyPremium: false,
    OnlyOwner: false,
    limitDeduction: 0, // QRIS biasanya gratis, set 0 saja
};
