import { MessageMedia, type Client } from "whatsapp-web.js";
import type { AutomatedMessageData } from "./data_reader";
import { DataReader } from "./data_reader";

export class MessagingHandler {
    constructor(private client: Client) { }

    static getChatId(number: string): string {
        let chatId = number.replace(/\s/g, "");

        if (chatId.startsWith("+")) {
            chatId = chatId.substring(1);
        }

        if (!chatId.endsWith("@c.us")) {
            chatId += "@c.us";
        }

        return chatId;
    }

    private async sendMessage(phoneNumber: string, message: string) {
        const chatId = MessagingHandler.getChatId(phoneNumber);

        try {
            await this.client.sendMessage(chatId, message);
        } catch (error) {
            console.log(error);
        }
    }

    private async sendAttachment(phoneNumber: string, imagPath: string) {
        const chatId = MessagingHandler.getChatId(phoneNumber);

        try {
            const messageMedia = MessageMedia.fromFilePath(imagPath);
            await this.client.sendMessage(chatId, messageMedia);
        } catch (error) {
            console.log(error);
        }
    }

    async processPendingOrderMessages() {
        const attachmentPath = './product.jpg';
        const reader = new DataReader();
        const messages = await reader.getMessageData();
        const usedNumbers = [];
        for (const message of messages) {
            // const phoneNumber = '18098052529';
            const phoneNumber = '18296835513';
            // const phoneNumber = message.phoneNumber.toString();
            // if (usedNumbers.includes(phoneNumber)) {
            // continue;
            // }
            const messages = this.buildMessage(message);
            const chatId = MessagingHandler.getChatId(phoneNumber);
            for (const message of messages) {
                await this.sendMessage(phoneNumber, message);
            }
            if (messages.length > 0) {
                await this.sendAttachment(phoneNumber, attachmentPath);
            }
            console.log("Message sent to:", chatId);
            usedNumbers.push(phoneNumber);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    buildMessage(item: AutomatedMessageData): string[] {
        try {
            const name = item.name.replace(/\-/g, '').trim();
            const totalPrice = `RD$${item.totalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            const amountOfUnits = item.quantity > 1 ? `${item.quantity} unidades` : `${item.quantity} unidad`;

            return [
                '✨ ¡Buenos días' + name + '! ✨',
                `Queremos recordarte que estamos a la espera de su confirmación de su orden de *${amountOfUnits}* de *${item.product}* \n por un total de *${totalPrice}*. 💸`,
                `Estaremos despachando su pedido a ${item.address} en ${item.city} a partir del Miercoles. 📦`,
                'Feliz Lunes',
            ]
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}
