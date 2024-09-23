import parse from 'csv-simple-parser';

export interface AutomatedMessageData {
    orderId: string;
    phoneNumber: string;
    product: string;
    name: string;
    quantity: number;
    totalPrice: number;
    city: string;
    address: string;
}

type Rec = {
    Pageviews: string;
}

export class DataReader {

    async getMessageData(): Promise<AutomatedMessageData[]> {
        const data = await this.readFile();
        const converted = data.map(item => this.convertCsvItemToMessageData(item));
        return converted;
    }

    async readFile() {
        const file = Bun.file("data.csv");
        const content = await file.text();
        const csv = parse(content, { header: true, infer: true });
        return csv;
    }

    convertCsvItemToMessageData(item: any): AutomatedMessageData {
        return {
            orderId: item["ORDEN"],
            address: item["DIRECCION"],
            city: item["CIUDAD"],
            name: item["NOMBRE Y APELLIDO"],
            phoneNumber: item["TELEFONO"],
            product: item["PRODUCTO"],
            quantity: item["CANTIDAD"],
            totalPrice: item["PRECIO TOTAL"],
        }
    }
}