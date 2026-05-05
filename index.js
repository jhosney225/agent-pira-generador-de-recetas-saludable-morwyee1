
```javascript
const Anthropic = require("@anthropic-ai/sdk");
const readline = require("readline");

const client = new Anthropic();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function generateHealthyRecipe(
  ingredients,
  calorieTarget,
  dietaryRestrictions
) {
  const prompt = `You are a professional nutritionist and chef. Generate a healthy recipe based on these parameters:

Ingredients available: ${ingredients}
Target calories: ${calorieTarget}
Dietary restrictions: ${dietaryRestrictions || "None"}

Please provide:
1. Recipe name
2. List of ingredients with quantities
3. Step-by-step instructions
4. Total calories and macro breakdown (proteins, carbs, fats)
5. Nutritional benefits

Format the response clearly with sections for easy reading.`;

  console.log(
    "\n🍽️  Generating your healthy recipe... (this may take a moment)\n"
  );

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const recipeContent = message.content[0];
    if (recipeContent.type === "text") {
      return recipeContent.text;
    }
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

async function analyzeNutrition(ingredients) {
  const prompt = `As a nutrition expert, analyze these ingredients and provide a nutritional analysis:

Ingredients: ${ingredients}

Please provide:
1. Individual ingredient nutritional values
2. Estimated total calories (if combined in a standard serving)
3. Vitamin and mineral content
4. Health benefits
5. Recommended daily serving suggestions

Be specific with numbers and percentages.`;

  console.log(
    "\n📊 Analyzing nutritional content... (this may take a moment)\n"
  );

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const analysisContent = message.content[0];
    if (analysisContent.type === "text") {
      return analysisContent.text;
    }
  } catch (error) {
    console.error("Error analyzing nutrition:", error);
    throw error;
  }
}

async function getMealPlan(calorieTarget, days, dietaryRestrictions) {
  const prompt = `Create a healthy meal plan with these specifications:

Daily calorie target: ${calorieTarget}
Duration: ${days} days
Dietary restrictions: ${dietaryRestrictions || "None"}

For each day, provide:
1. Breakfast with calories
2. Lunch with calories
3. Dinner with calories
4. 1-2 healthy snacks with calories
5. Total daily calories
6. Brief nutritional highlights

Make recipes diverse and practical for home cooking.`;

  console.log("\n📅 Creating your personalized meal plan... (this may take a moment)\n");

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const planContent = message.content[0];
    if (planContent.type === "text") {
      return planContent.text;
    }
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║         🥗 HEALTHY RECIPE GENERATOR WITH CALORIES 🥗       ║");
  console.log("║          Powered by Claude AI - Nutritionist Edition       ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  let continueSession = true;

  while (continueSession) {
    console.log("\n📋 Select an option:");
    console.log("1. Generate a recipe from ingredients");
    console.log("2. Analyze nutritional content");
    console.log("3. Create a meal plan");
    console.log("4. Exit");

    const choice = await askQuestion("\nEnter your choice (1-4): ");

    switch (choice.trim()) {
      case "1": {
        console.log("\n🥘 RECIPE GENERATOR\n");
        const ingredients = await askQuestion(
          "Enter ingredients (comma-separated): "
        );
        const calorieTarget = await askQuestion("Target calories (e.g., 500): ");
        const dietary = await askQuestion(
          "Dietary restrictions (or press Enter for none): "
        );

        const recipe = await generateHealthyRecipe(
          ingredients,
          calorieTarget,
          dietary
        );
        console.log("\n" + "=".repeat(60));
        console.log(recipe);
        console.log("=".repeat(60));
        break;
      }

      case "2": {
        console.log("\n📊 NUTRITION ANALYZER\n");
        const ingredients = await askQuestion(
          "Enter ingredients to analyze (comma-separated): "
        );

        const analysis = await analyzeNutrition(ingredients);
        console.log("\n" + "=".repeat(60));
        console.log(analysis);
        console.log("=".