export class Article {
    constructor(articleId, title, scientificName, seasonality, location, uses, description,
                healthBenefits, mapCoordinates, authorId, publishedDate, tags, imageUrl) {
        this.articleId = articleId;
        this.title = title;
        this.scientificName = scientificName;
        this.seasonality = seasonality;
        this.location = location;
        this.uses = uses;
        this.description = description;
        this.healthBenefits = healthBenefits;
        this.mapCoordinates = mapCoordinates;
        this.authorId = authorId;
        this.publishedDate = publishedDate;
        this.tags = tags;
        this.imageUrl = imageUrl;
    }
}
