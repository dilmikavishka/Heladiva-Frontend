export class OrderDetails {
    constructor(orderDetailId, orderId, productId, quantity, price) {
        this.orderDetailId = orderDetailId;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }
}
