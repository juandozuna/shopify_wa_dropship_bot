import type { Client, Message, } from "whatsapp-web.js";
import { MessagingHandler } from "./messaging_handler";
import { DataReader } from "./data_reader";

const ws = require('whatsapp-web.js');

console.log("Hello via Bun!");


const client: Client = new ws.Client({
    authStrategy: new ws.LocalAuth(),
    puppeteer: {
        headless: false,
    }
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', async () => {
    console.log('Client is ready!');

    const messager = new MessagingHandler(client);
    await messager.processPendingOrderMessages();
});

client.on('message', (msg: Message) => {

});

client.initialize();