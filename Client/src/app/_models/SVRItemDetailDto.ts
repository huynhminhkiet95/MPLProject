export class SVRItemDetailDto {
    SVRNo: string;
    SPIId: number;
    Qty: number;
    AppQty:number;
    constructor(spiId: number, qty: number) {
        this.Qty = qty;
        this.SPIId = spiId;
        this.AppQty = qty;
    }
}
