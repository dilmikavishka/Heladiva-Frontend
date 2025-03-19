export class Product {
    constructor(productId,name,scientificName,seasonality,location,uses,description,type,healthBenefits,mapCoordinates,price,stockAvailability,imageUrl
    ) {
        this.productId = productId;
        this.name = name;
        this.scientificName = scientificName;
        this.seasonality = seasonality;
        this.location = location;
        this.uses = uses;
        this.description = description;
        this.type = type;
        this.healthBenefits = healthBenefits;
        this.mapCoordinates = mapCoordinates;
        this.price = price;
        this.stockAvailability = stockAvailability;
        this.imageUrl = imageUrl;
    }
}
