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
        for (const message of messages) {
            // const phoneNumber = '18098052529';
            // const phoneNumber = '18296835513';
            const phoneNumber = message.phoneNumber.toString();
            const messages = this.buildMessage(message);
            const chatId = MessagingHandler.getChatId(phoneNumber);
            for (const message of messages) {
                await this.sendMessage(phoneNumber, message);
            }
            await this.sendAttachment(phoneNumber, attachmentPath);
            console.log("Message sent to:", chatId);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        process.exit(0);
    }

    buildMessage(item: AutomatedMessageData): string[] {
        const name = item.name.replace(/\-/g, '').trim();
        const totalPrice = `RD$${item.totalPrice.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const amountOfUnits = item.quantity > 1 ? `${item.quantity} unidades` : `${item.quantity} unidad`;

        return [
            '✨ ¡Hola ' + name + '! ✨',
            `Queremos reconfirmar tu pedido de *${amountOfUnits}* de *${item.product}* \n por un total de *${totalPrice}*. 💸`,
            `Nos encantaría enviarte tu orden lo antes posible 🚚 \n solo necesitamos tu confirmación para proceder. ✅ \n\n Por favor, responde a este mensaje para confirmar tu compra \n 🙌 ¡Gracias por tu preferencia!`,
            'Feliz Sabado ✨',
        ]
    }
}
