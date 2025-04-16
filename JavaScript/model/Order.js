export class Order {
    constructor(
        orderId, userId, orderDate, totalPrice, status, orderDetails = [],
        firstName, lastName, addressLine1, apartmentSuite, road, postalCode,
        phone, email, cardholderName, cardNumber, expiryDate, cvc,
        tripPrice, tripDuration, deliveryFee, tax
    ) {
        this.orderId = orderId;
        this.userId = userId;
        this.orderDate = orderDate;
        this.totalPrice = totalPrice;
        this.status = status;
        this.orderDetails = orderDetails;

        this.firstName = firstName;
        this.lastName = lastName;
        this.addressLine1 = addressLine1;
        this.apartmentSuite = apartmentSuite;
        this.road = road;
        this.postalCode = postalCode;
        this.phone = phone;
        this.email = email;

        this.cardholderName = cardholderName;
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
        this.cvc = cvc;

        this.tripPrice = tripPrice;
        this.tripDuration = tripDuration;
        this.deliveryFee = deliveryFee;
        this.tax = tax;
    }
}
