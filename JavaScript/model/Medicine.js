export class Medicine {
    constructor(medicineId, name, disease, description, allergies, ingredients, preparation,
                usageInstructions, sideEffects, authorId) {
        this.medicineId = medicineId;
        this.name = name;
        this.disease = disease;
        this.description = description;
        this.allergies = allergies;
        this.ingredients = ingredients;
        this.preparation = preparation;
        this.usageInstructions = usageInstructions;
        this.sideEffects = sideEffects;
        this.authorId = authorId;
    }
}
