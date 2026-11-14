/*
 * The Private Reserve — catalog data (inventory items + recipes).
 * Loaded by index.html before the app script; works from file:// and GitHub Pages.
 * Everything after "window.BAR_CATALOG = " is strict JSON. The app's
 * "Catalog Data → Download catalog.js" regenerates this whole file, and
 * "Import" accepts the same object. Schema is documented in README.md.
 */
window.BAR_CATALOG = {
  "schema": 1,
  "updated": "2026-11-14T19:33:16Z",
  "items": [
    {
      "id": "watermelon-syrup",
      "name": "Watermelon Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Fruity / Light",
      "notes": "Crisp, summer melon sweetness; pairs cleanly with lime, mint, vodka, tequila, and soda."
    },
    {
      "id": "passion-fruit-syrup",
      "name": "Passion Fruit Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Fruity / Tart",
      "notes": "Vibrant tropical tang and floral aroma; shines with dark rum, tequila, white wine, and kombucha."
    },
    {
      "id": "mint-mojito-syrup",
      "name": "Mint Mojito Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Herbal / Cooling",
      "notes": "Spearmint & cane sugar balance; effortless mojito and cooler base without muddling fresh leaves."
    },
    {
      "id": "green-apple-syrup",
      "name": "Green Apple Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Fruity / Crisp-Tart",
      "notes": "Bright orchard acidity; pairs wonderfully with whisky, grappa, white wine, and ginger ale."
    },
    {
      "id": "vanilla-syrup",
      "name": "Vanilla Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Rich / Aromatic",
      "notes": "Warm Madagascar-style sweetness; softens dark rum, whisky, coffee gin, and berry builds."
    },
    {
      "id": "cacao-blue-syrup",
      "name": "Cacao Blue Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Citrus / Bittersweet",
      "notes": "Blue Curaçao style orange peel liqueur alternative; delivers vivid azure color and citrus depth."
    },
    {
      "id": "triple-sec-cacao-syrup",
      "name": "Triple Sec Cacao Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Citrus / Sweet Orange",
      "notes": "Classic sweet orange zest profile; essential for margaritas, sangrias, and crisp spritzes."
    },
    {
      "id": "cheesecake-syrup",
      "name": "Cheesecake Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Rich / Dessert",
      "notes": "Velvety cream-cheese and graham sweetness; transforms vodka, Baileys, and berries into dessert serves."
    },
    {
      "id": "grenadine",
      "name": "Grenadine",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Fruity / Tart-Sweet",
      "notes": "Deep ruby pomegranate-berry richness; adds gradient sunset visuals and tart balance."
    },
    {
      "id": "hazelnut-syrup",
      "name": "Hazelnut Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Nutty / Roasted",
      "notes": "Toasted praline warmth; natural partner for coffee gin, whisky, dark rum, and Baileys."
    },
    {
      "id": "coconut-syrup",
      "name": "Coconut Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Tropical / Creamy",
      "notes": "Lush tropical body; bridges pineapple, passion fruit, dark rum, and blue citrus builds."
    },
    {
      "id": "strawberry-syrup",
      "name": "Strawberry Syrup",
      "kind": "syrup",
      "category": "Syrup",
      "profile": "Fruity / Jammy",
      "notes": "Ripe red berry sweetness; pairs with cheesecake syrup, Jägermeister, white wine, and mint."
    },
    {
      "id": "whisky",
      "name": "Whisky",
      "kind": "spirit",
      "category": "Base Spirit",
      "profile": "Oaky, warm, caramel-spice",
      "notes": "Anchors orchard fruit (green apple), nutty hazelnut, and vanilla highballs or stirred serves."
    },
    {
      "id": "vodka",
      "name": "Vodka",
      "kind": "spirit",
      "category": "Base Spirit",
      "profile": "Clean, crisp, neutral",
      "notes": "Lets delicate fruit syrups (watermelon, strawberry, cheesecake) take center stage."
    },
    {
      "id": "tequila",
      "name": "Tequila",
      "kind": "spirit",
      "category": "Base Spirit",
      "profile": "Agave, earthy, bright",
      "notes": "Natural affinity for passion fruit, watermelon, lime, and Triple Sec Cacao."
    },
    {
      "id": "dark-rum",
      "name": "Dark Rum",
      "kind": "spirit",
      "category": "Base Spirit",
      "profile": "Molasses, rich, caramelized",
      "notes": "The backbone of tropical tiki serves (coconut, passion fruit) and spiced vanilla builds."
    },
    {
      "id": "coffee-gin",
      "name": "Coffee Gin",
      "kind": "spirit",
      "category": "Flavored Spirit",
      "profile": "Juniper, botanical, roasted coffee",
      "notes": "A showstopper spirit; pairs remarkably with hazelnut, tonic water, vanilla, and orange peel."
    },
    {
      "id": "grappa",
      "name": "Grappa",
      "kind": "spirit",
      "category": "Base Spirit",
      "profile": "Aromatic, grape-pomace, dry",
      "notes": "Italian grape spirit that shines with green apple, citrus, and dry tonic or kombucha."
    },
    {
      "id": "jagermeister",
      "name": "Jägermeister",
      "kind": "spirit",
      "category": "Herbal Liqueur",
      "profile": "56 herbs, anise, bitter orange",
      "notes": "Surprisingly versatile with red berries (strawberry, grenadine), citrus, and ginger beer."
    },
    {
      "id": "baileys",
      "name": "Baileys",
      "kind": "spirit",
      "category": "Cream Liqueur",
      "profile": "Irish whiskey, cream, cocoa",
      "notes": "Instant dessert texture; pairs seamlessly with cheesecake, hazelnut, and coffee gin."
    },
    {
      "id": "red-wine",
      "name": "Red Wine",
      "kind": "spirit",
      "category": "Wine",
      "profile": "Tannic, dark fruit, structured",
      "notes": "Ideal for sangrias and berry-citrus spritzes lengthened with soda."
    },
    {
      "id": "white-wine",
      "name": "White Wine",
      "kind": "spirit",
      "category": "Wine",
      "profile": "Crisp, acidic, floral",
      "notes": "Light, refreshing base for passion fruit, green apple, and strawberry spritzers."
    },
    {
      "id": "kombucha",
      "name": "Kombucha",
      "kind": "base",
      "category": "Fermented Base",
      "profile": "Ginger, Berry, Citrus, Original • Tangy, effervescent, tea-forward",
      "notes": "Provides natural carbonation, probiotic tang, and tannic depth—acting as an ideal zero-proof spirit substitute or low-ABV spritz lengthener."
    },
    {
      "id": "soda",
      "name": "Club Soda",
      "kind": "mixer",
      "category": "Carbonated Staple",
      "profile": "",
      "notes": "Or any unflavoured sparkling water.",
      "staple": true
    },
    {
      "id": "tonic",
      "name": "Tonic Water",
      "kind": "mixer",
      "category": "Carbonated Staple",
      "profile": "",
      "notes": "",
      "staple": true
    },
    {
      "id": "ginger",
      "name": "Ginger Ale / Ginger Beer",
      "kind": "mixer",
      "category": "Carbonated Staple",
      "profile": "",
      "notes": "",
      "staple": true
    },
    {
      "id": "cola",
      "name": "Cola",
      "kind": "mixer",
      "category": "Carbonated Staple",
      "profile": "",
      "notes": "",
      "staple": true
    },
    {
      "id": "lemon-lime-soda",
      "name": "Lemon-Lime Soda",
      "kind": "mixer",
      "category": "Carbonated Staple",
      "profile": "Sweet citrus fizz",
      "notes": "Sprite, 7UP or similar.",
      "staple": true
    },
    {
      "id": "lime",
      "name": "Fresh Lime Juice",
      "kind": "mixer",
      "category": "Fresh Citrus",
      "profile": "",
      "notes": ""
    },
    {
      "id": "lemon",
      "name": "Fresh Lemon Juice",
      "kind": "mixer",
      "category": "Fresh Citrus",
      "profile": "",
      "notes": ""
    },
    {
      "id": "orange",
      "name": "Orange Juice",
      "kind": "mixer",
      "category": "Fruit Juice",
      "profile": "",
      "notes": ""
    },
    {
      "id": "pineapple",
      "name": "Pineapple Juice",
      "kind": "mixer",
      "category": "Fruit Juice",
      "profile": "",
      "notes": ""
    },
    {
      "id": "cranberry",
      "name": "Cranberry Juice",
      "kind": "mixer",
      "category": "Fruit Juice",
      "profile": "",
      "notes": ""
    },
    {
      "id": "dairy",
      "name": "Milk or Heavy Cream",
      "kind": "mixer",
      "category": "Dairy / Texture",
      "profile": "",
      "notes": ""
    },
    {
      "id": "espresso",
      "name": "Espresso or Cold Brew",
      "kind": "mixer",
      "category": "Coffee",
      "profile": "",
      "notes": ""
    }
  ],
  "recipes": [
    {
      "id": "watermelon-mint-cooler",
      "name": "Emerald Watermelon Cooler",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Cubed Ice (Full Column)",
      "colors": [
        "#fb7185",
        "#e11d48"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "watermelon-syrup",
          "amount": "20 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "15 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "kombucha",
          "note": "Original or Ginger",
          "amount": "120 ml"
        },
        {
          "item": "soda",
          "amount": "Top (45 ml)"
        }
      ],
      "steps": [
        "Fill a chilled Highball glass all the way to the top with clear ice cubes.",
        "Pour in the Watermelon Syrup, Mint Mojito Syrup, and Fresh Lime Juice.",
        "Top gently with chilled Kombucha and a splash of Club Soda to preserve effervescence.",
        "Lift once from bottom to top with a barspoon so the pink melon and mint flavors integrate cleanly."
      ],
      "servingNotes": "Slap a fresh mint sprig between your palms to release aromatic oils and tuck it beside the straw alongside a thin lime wheel. (Cocktail option: add 45 ml Vodka or Tequila)."
    },
    {
      "id": "spiked-watermelon-paloma",
      "name": "Sonoma Watermelon Paloma",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Shake & Top",
      "ice": "Cubed Ice",
      "colors": [
        "#f43f5e",
        "#fda4af"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "tequila",
          "amount": "45 ml"
        },
        {
          "item": "watermelon-syrup",
          "amount": "20 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "lime",
          "amount": "20 ml"
        },
        {
          "item": "soda",
          "amount": "90 ml"
        }
      ],
      "steps": [
        "Optional: Run a lime wedge around half the rim of a Highball glass and dip in flaky sea salt.",
        "Add Tequila, Watermelon Syrup, Triple Sec Cacao Syrup, and Fresh Lime Juice to a shaker with ice.",
        "Shake briskly for 10 seconds until frosty.",
        "Strain over fresh cubed ice in the Highball glass and top with chilled Club Soda."
      ],
      "servingNotes": "Garnish with a fresh lime wheel perched on the rim. The Triple Sec Cacao adds a subtle bittersweet orange zest that mimics ruby grapefruit."
    },
    {
      "id": "coffee-gin-hazelnut-tonic",
      "name": "Roasted Hazelnut Coffee G&T",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Copa",
      "method": "Build over Ice",
      "ice": "Large Cubed Ice",
      "colors": [
        "#92400e",
        "#d97706"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "50 ml"
        },
        {
          "item": "hazelnut-syrup",
          "amount": "12 ml"
        },
        {
          "item": "tonic",
          "amount": "140 ml"
        }
      ],
      "steps": [
        "Pack a large Copa balloon wine glass generously with solid ice cubes.",
        "Pour Coffee Gin and Hazelnut Syrup directly over the ice.",
        "Slowly pour chilled Tonic Water down the side of the glass (or down a barspoon) to keep bubbles lively.",
        "Stir gently twice to marry the roasted hazelnut with the quinine and juniper."
      ],
      "servingNotes": "Express an orange peel over the bowl of the glass and drop it in. The citrus oil bridges the roasted coffee bean and herbal gin botanicals."
    },
    {
      "id": "orchard-whisky-highball",
      "name": "Crisp Orchard Whisky Highball",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build & Lift",
      "ice": "Cubed Ice",
      "colors": [
        "#eab308",
        "#a3e635"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "whisky",
          "amount": "45 ml"
        },
        {
          "item": "green-apple-syrup",
          "amount": "20 ml"
        },
        {
          "item": "ginger",
          "amount": "130 ml"
        }
      ],
      "steps": [
        "Chill a tall Highball glass and fill completely with ice cubes.",
        "Add Whisky and Green Apple Syrup.",
        "Top with chilled Ginger Ale (for lighter sweetness) or Ginger Beer (for spicy bite).",
        "Give a single gentle stir from bottom to top."
      ],
      "servingNotes": "Serve with a crisp lemon wheel or thin fan of fresh green apple slices. Tart orchard apple cuts straight through the warm oak of the whisky."
    },
    {
      "id": "grappa-botanical-fizz",
      "name": "Venetian Orchard Spritz",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Copa",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#bef264",
        "#65a30d"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "grappa",
          "amount": "40 ml"
        },
        {
          "item": "green-apple-syrup",
          "amount": "15 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "tonic",
          "amount": "120 ml"
        }
      ],
      "steps": [
        "Fill a stemmed Copa or large white wine glass with ice.",
        "Pour in Grappa, Green Apple Syrup, and Triple Sec Cacao Syrup.",
        "Top with crisp Tonic Water and stir gently."
      ],
      "servingNotes": "Garnish with a lemon wheel. Grappa's grape-pomace aromatics pair naturally with crisp green apple and bittersweet tonic."
    },
    {
      "id": "white-wine-mojito-spritz",
      "name": "Garden Mint White Wine Spritz",
      "type": "Wine & Low-ABV",
      "vibe": "Refreshing & Crisp",
      "glass": "Copa",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#fde047",
        "#86efac"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "white-wine",
          "note": "Chilled",
          "amount": "120 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "15 ml"
        },
        {
          "item": "green-apple-syrup",
          "amount": "10 ml"
        },
        {
          "item": "soda",
          "amount": "60 ml"
        }
      ],
      "steps": [
        "Fill a large wine glass with ice cubes.",
        "Add Mint Mojito Syrup and Green Apple Syrup first, then pour chilled White Wine.",
        "Top with Club Soda and lift gently with a spoon."
      ],
      "servingNotes": "Garnish with a fresh mint sprig and lime wheel. A crisp, low-ABV patio refresher."
    },
    {
      "id": "kombucha-apple-zen",
      "name": "Probiotic Orchard Fizz",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#a3e635",
        "#eab308"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "kombucha",
          "note": "Chilled",
          "amount": "150 ml"
        },
        {
          "item": "green-apple-syrup",
          "amount": "15 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "10 ml"
        },
        {
          "item": "soda",
          "amount": "30 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with ice.",
        "Pour Green Apple Syrup and Mint Mojito Syrup over the ice.",
        "Top slowly with chilled Kombucha and a splash of Club Soda."
      ],
      "servingNotes": "Zero-proof and ready right out of your stocked bar—tangy fermented tea meets crisp apple and cooling spearmint."
    },
    {
      "id": "vodka-watermelon-mint-mule",
      "name": "Summer Melon Mint Mule",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#fb7185",
        "#fda4af"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "vodka",
          "amount": "45 ml"
        },
        {
          "item": "watermelon-syrup",
          "amount": "18 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "10 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "ginger",
          "amount": "100 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with cubed ice.",
        "Pour Vodka, Watermelon Syrup, Mint Mojito Syrup, and Fresh Lime Juice over the ice.",
        "Top with spicy Ginger Beer and stir gently."
      ],
      "servingNotes": "Garnish with a lime wheel and slapped mint sprig. Juicy watermelon cools down the fiery ginger kick."
    },
    {
      "id": "whisky-mint-julep-smash",
      "name": "Kentucky Green Apple Smash",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Rocks",
      "method": "Shake & Strain",
      "ice": "Crushed Ice",
      "colors": [
        "#eab308",
        "#84cc16"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "whisky",
          "amount": "50 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "12 ml"
        },
        {
          "item": "green-apple-syrup",
          "amount": "10 ml"
        },
        {
          "item": "lemon",
          "amount": "15 ml",
          "substitutes": [
            "lime"
          ]
        }
      ],
      "steps": [
        "Add Whisky, Mint Mojito Syrup, Green Apple Syrup, and Fresh Lemon Juice to a shaker with ice.",
        "Shake briskly for 10 seconds.",
        "Strain into a Rocks glass packed with crushed ice."
      ],
      "servingNotes": "Crown with a generous bouquet of fresh mint. Crisp orchard acidity modernizes the classic Mint Julep."
    },
    {
      "id": "grappa-watermelon-spritz",
      "name": "Amalfi Melon & Grape Spritz",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Copa",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#f43f5e",
        "#fde047"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "grappa",
          "amount": "40 ml"
        },
        {
          "item": "watermelon-syrup",
          "amount": "18 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "8 ml"
        },
        {
          "item": "soda",
          "amount": "120 ml"
        }
      ],
      "steps": [
        "Pack a large Copa wine glass with cubed ice.",
        "Pour Grappa, Watermelon Syrup, and Mint Mojito Syrup over the ice.",
        "Top with chilled Club Soda and stir once."
      ],
      "servingNotes": "Ready right now using only basic Club Soda—floral grape distillates elevate fresh watermelon and mint."
    },
    {
      "id": "tequila-citrus-kombucha-rancher",
      "name": "Oaxacan Kombucha Ranch Water",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#fde047",
        "#ca8a04"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "tequila",
          "amount": "45 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "kombucha",
          "note": "Citrus or Ginger",
          "amount": "120 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with ice.",
        "Add Tequila, Triple Sec Cacao Syrup, and Fresh Lime Juice.",
        "Top with chilled Kombucha and lift gently."
      ],
      "servingNotes": "A probiotic, tangy upgrade to classic Ranch Water with bright orange peel complexity."
    },
    {
      "id": "zero-proof-ginger-apple-mule",
      "name": "Zero-Proof Ginger Orchard Mule",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#bef264",
        "#d97706"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "kombucha",
          "note": "Ginger or Original",
          "amount": "100 ml"
        },
        {
          "item": "green-apple-syrup",
          "amount": "20 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "ginger",
          "amount": "75 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with cubed ice.",
        "Add Green Apple Syrup and Fresh Lime Juice.",
        "Top with equal parts chilled Kombucha and Ginger Beer."
      ],
      "servingNotes": "Double-fermented bite from Kombucha and Ginger Beer balanced by crisp green apple."
    },
    {
      "id": "electric-blue-lagoon",
      "name": "Electric Azure Lagoon",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Shake & Strain",
      "ice": "Crushed / Pebble Ice",
      "colors": [
        "#06b6d4",
        "#1d4ed8"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "vodka",
          "amount": "45 ml"
        },
        {
          "item": "cacao-blue-syrup",
          "amount": "20 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "15 ml"
        },
        {
          "item": "pineapple",
          "amount": "75 ml"
        },
        {
          "item": "lemon",
          "amount": "15 ml",
          "substitutes": [
            "lime"
          ]
        }
      ],
      "steps": [
        "Add Vodka, Cacao Blue Syrup, Coconut Syrup, Pineapple Juice, and Fresh Lemon Juice to a shaker with ice.",
        "Shake vigorously for 12 seconds to create a frothy pineapple foam.",
        "Strain into a Hurricane glass packed with crushed ice."
      ],
      "servingNotes": "Garnish with a pineapple wedge or orange wheel and a cocktail umbrella. Vivid ocean-blue color with creamy coconut-citrus balance."
    },
    {
      "id": "zero-proof-blue-surf",
      "name": "Pacific Reef Zero-Proof",
      "type": "Mocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Build & Layer",
      "ice": "Crushed Ice",
      "colors": [
        "#22d3ee",
        "#0369a1"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "cacao-blue-syrup",
          "amount": "20 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "15 ml"
        },
        {
          "item": "pineapple",
          "amount": "60 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "kombucha",
          "amount": "60 ml"
        }
      ],
      "steps": [
        "Pack a Hurricane glass with crushed ice.",
        "Stir Coconut Syrup, Pineapple Juice, and Fresh Lime Juice together and pour over the ice.",
        "Top with Kombucha, then slowly drizzle Cacao Blue Syrup over the top for a deep turquoise gradient."
      ],
      "servingNotes": "Serve with a straw so the drinker can swirl the blue orange-peel syrup into the creamy pineapple-coconut base."
    },
    {
      "id": "dark-rum-passion-tiki",
      "name": "Blackbeard's Passion Punch",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Shake & Strain",
      "ice": "Crushed Ice",
      "colors": [
        "#f59e0b",
        "#7c2d12"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "dark-rum",
          "amount": "50 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "20 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "15 ml"
        },
        {
          "item": "lime",
          "amount": "20 ml"
        },
        {
          "item": "orange",
          "amount": "45 ml"
        },
        {
          "item": "grenadine",
          "amount": "5 ml (Float)"
        }
      ],
      "steps": [
        "Combine Dark Rum, Passion Fruit Syrup, Coconut Syrup, Fresh Lime Juice, and Orange Juice in a shaker with ice.",
        "Shake hard for 12 seconds.",
        "Strain into a Hurricane glass filled with crushed ice.",
        "Drizzle 5 ml Grenadine down the inside edge for a ruby-amber sunset base."
      ],
      "servingNotes": "Rich molasses notes from the Dark Rum anchor the bright tartness of passion fruit and creamy coconut."
    },
    {
      "id": "passion-fruit-tequila-sunrise",
      "name": "Acapulco Passion Sunrise",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Highball",
      "method": "Build & Layer",
      "ice": "Cubed Ice",
      "colors": [
        "#fbbf24",
        "#e11d48"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "tequila",
          "amount": "45 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "15 ml"
        },
        {
          "item": "orange",
          "amount": "100 ml"
        },
        {
          "item": "grenadine",
          "amount": "15 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with cubed ice.",
        "Stir Tequila, Passion Fruit Syrup, and Orange Juice together in the glass.",
        "Slowly pour Grenadine down the inner wall of the glass—it will sink to the bottom and create a fiery sunrise gradient."
      ],
      "servingNotes": "Do not stir after adding Grenadine; serve with a straw and an orange wheel."
    },
    {
      "id": "crimson-red-sangria",
      "name": "Andalusian Sunset Red Sangria",
      "type": "Wine & Low-ABV",
      "vibe": "Tropical & Fruity",
      "glass": "Copa",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#9f1239",
        "#4c0519"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "red-wine",
          "amount": "120 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "15 ml"
        },
        {
          "item": "strawberry-syrup",
          "amount": "10 ml"
        },
        {
          "item": "grenadine",
          "amount": "5 ml"
        },
        {
          "item": "orange",
          "amount": "45 ml"
        },
        {
          "item": "soda",
          "amount": "45 ml"
        }
      ],
      "steps": [
        "Fill a large Copa wine glass with cubed ice.",
        "Pour in Red Wine, Triple Sec Cacao Syrup, Strawberry Syrup, Grenadine, and Orange Juice.",
        "Stir gently to blend, then top with chilled Club Soda."
      ],
      "servingNotes": "Garnish with an orange half-wheel and fresh strawberry slice if available. Rich, fruity, and effortless."
    },
    {
      "id": "white-wine-passion-sangria",
      "name": "Riviera Passion White Sangria",
      "type": "Wine & Low-ABV",
      "vibe": "Tropical & Fruity",
      "glass": "Copa",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#fde047",
        "#f97316"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "white-wine",
          "note": "Chilled",
          "amount": "120 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "15 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "pineapple",
          "amount": "30 ml"
        },
        {
          "item": "soda",
          "amount": "50 ml"
        }
      ],
      "steps": [
        "Fill a Copa balloon glass with ice.",
        "Combine chilled White Wine, Passion Fruit Syrup, Triple Sec Cacao Syrup, and Pineapple Juice.",
        "Top with Club Soda and stir once gently."
      ],
      "servingNotes": "Bright, aromatic, and sparkling—ideal for warm afternoons."
    },
    {
      "id": "passion-kombucha-sparkler",
      "name": "Tropical Kombucha Bellini",
      "type": "Mocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Flute",
      "method": "Build & Top",
      "ice": "Chilled Flute (No Ice)",
      "colors": [
        "#fb923c",
        "#facc15"
      ],
      "garnishType": "berry-rim",
      "ingredients": [
        {
          "item": "passion-fruit-syrup",
          "amount": "15 ml"
        },
        {
          "item": "strawberry-syrup",
          "amount": "10 ml"
        },
        {
          "item": "kombucha",
          "note": "Well Chilled",
          "amount": "140 ml"
        }
      ],
      "steps": [
        "Chill a Champagne Flute in the freezer beforehand.",
        "Add Passion Fruit Syrup and Strawberry Syrup to the bottom of the chilled glass.",
        "Slowly top with cold Kombucha, tilting the glass at 45° so it foams gently without overflowing."
      ],
      "servingNotes": "100% stocked ingredients—no extra mixers needed. Looks and drinks like a sparkling brunch Bellini."
    },
    {
      "id": "blue-hawaiian-dark-rum",
      "name": "Midnight Blue Hawaiian",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Shake & Strain",
      "ice": "Crushed Ice",
      "colors": [
        "#0284c7",
        "#0f766e"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "dark-rum",
          "amount": "45 ml"
        },
        {
          "item": "cacao-blue-syrup",
          "amount": "20 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "20 ml"
        },
        {
          "item": "pineapple",
          "amount": "90 ml"
        }
      ],
      "steps": [
        "Shake Dark Rum, Cacao Blue Syrup, Coconut Syrup, and Pineapple Juice with ice for 12 seconds.",
        "Strain into a Hurricane glass packed with crushed ice."
      ],
      "servingNotes": "The deep caramel of Dark Rum turns the azure blue syrup into a stunning sea-foam emerald hue."
    },
    {
      "id": "strawberry-coconut-daiquiri-rocks",
      "name": "Ruby Coconut Rum Daiquiri",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Coupe",
      "method": "Hard Shake & Double Strain",
      "ice": "Served Up (Chilled Coupe)",
      "colors": [
        "#fb7185",
        "#f43f5e"
      ],
      "garnishType": "berry-rim",
      "ingredients": [
        {
          "item": "dark-rum",
          "amount": "50 ml"
        },
        {
          "item": "strawberry-syrup",
          "amount": "15 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "12 ml"
        },
        {
          "item": "lime",
          "amount": "22 ml"
        }
      ],
      "steps": [
        "Combine Dark Rum, Strawberry Syrup, Coconut Syrup, and Fresh Lime Juice in a shaker with ice.",
        "Shake hard for 12 seconds until frosty.",
        "Double-strain into a chilled Coupe glass."
      ],
      "servingNotes": "A silky, tart-sweet strawberry-coconut daiquiri elevated by aged dark rum."
    },
    {
      "id": "tequila-blue-margarita",
      "name": "Baja Blue Curacao Margarita",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Rocks",
      "method": "Shake & Strain",
      "ice": "Cubed Ice",
      "colors": [
        "#38bdf8",
        "#0284c7"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "tequila",
          "amount": "45 ml"
        },
        {
          "item": "cacao-blue-syrup",
          "amount": "15 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "lime",
          "amount": "22 ml"
        }
      ],
      "steps": [
        "Rim a Rocks glass with salt if desired and fill with cubed ice.",
        "Shake Tequila, Cacao Blue Syrup, Triple Sec Cacao Syrup, and Fresh Lime Juice with ice.",
        "Strain over the fresh ice in the Rocks glass."
      ],
      "servingNotes": "Vibrant electric blue margarita with double-layered bitter and sweet orange peel aromatics."
    },
    {
      "id": "white-wine-strawberry-flute",
      "name": "Sparkling Rosé-Style Strawberry Flute",
      "type": "Wine & Low-ABV",
      "vibe": "Tropical & Fruity",
      "glass": "Flute",
      "method": "Build & Top",
      "ice": "Chilled Flute (No Ice)",
      "colors": [
        "#fda4af",
        "#f43f5e"
      ],
      "garnishType": "berry-rim",
      "ingredients": [
        {
          "item": "strawberry-syrup",
          "amount": "12 ml"
        },
        {
          "item": "grenadine",
          "amount": "5 ml"
        },
        {
          "item": "white-wine",
          "note": "Well Chilled",
          "amount": "110 ml"
        },
        {
          "item": "soda",
          "note": "Chilled",
          "amount": "40 ml"
        }
      ],
      "steps": [
        "Pour Strawberry Syrup and Grenadine into a chilled Champagne Flute.",
        "Add cold White Wine, then top with crisp Club Soda for sparkling effervescence."
      ],
      "servingNotes": "Turns crisp white wine into a celebratory sparkling berry spritz in seconds."
    },
    {
      "id": "watermelon-passion-kombucha-punch",
      "name": "Sunset Melon & Passion Cooler",
      "type": "Mocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Build & Layer",
      "ice": "Crushed Ice",
      "colors": [
        "#fb923c",
        "#e11d48"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "watermelon-syrup",
          "amount": "15 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "15 ml"
        },
        {
          "item": "kombucha",
          "note": "Berry or Citrus",
          "amount": "140 ml"
        },
        {
          "item": "grenadine",
          "amount": "8 ml (Sink)"
        }
      ],
      "steps": [
        "Fill a Hurricane glass with crushed ice.",
        "Stir Watermelon Syrup, Passion Fruit Syrup, and Kombucha gently in the glass.",
        "Drizzle Grenadine down the side to create a ruby gradient at the bottom."
      ],
      "servingNotes": "100% stocked zero-proof tropical showstopper—no extra juices required."
    },
    {
      "id": "vodka-cranberry-passion-cosmopolitan",
      "name": "Passion Fruit Cosmopolitan",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Martini",
      "method": "Hard Shake & Double Strain",
      "ice": "Served Up (Chilled Martini Glass)",
      "colors": [
        "#f43f5e",
        "#fb923c"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "vodka",
          "amount": "45 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "15 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "10 ml"
        },
        {
          "item": "cranberry",
          "amount": "35 ml"
        },
        {
          "item": "lime",
          "amount": "12 ml",
          "substitutes": [
            "lemon"
          ]
        }
      ],
      "steps": [
        "Shake Vodka, Triple Sec Cacao Syrup, Passion Fruit Syrup, Cranberry Juice, and Fresh Lime Juice with ice.",
        "Double-strain into a frozen V-shaped Martini glass."
      ],
      "servingNotes": "Express an orange twist over the glass. Exotic passion fruit gives the classic Cosmo a vibrant tropical lift."
    },
    {
      "id": "whisky-grenadine-pineapple-sour",
      "name": "Crimson Crown Whisky Sour",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Rocks",
      "method": "Hard Shake & Strain",
      "ice": "Cubed Ice",
      "colors": [
        "#e11d48",
        "#d97706"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "whisky",
          "amount": "50 ml"
        },
        {
          "item": "grenadine",
          "amount": "15 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        },
        {
          "item": "pineapple",
          "amount": "30 ml"
        },
        {
          "item": "lemon",
          "amount": "18 ml"
        }
      ],
      "steps": [
        "Shake Whisky, Grenadine, Vanilla Syrup, Pineapple Juice, and Fresh Lemon Juice hard with ice for 12 seconds.",
        "Strain over fresh cubed ice in a Rocks glass."
      ],
      "servingNotes": "Produces a gorgeous ruby-pink foam cap with rich bourbon-vanilla warmth underneath."
    },
    {
      "id": "strawberry-cheesecake-martini",
      "name": "Velvet Strawberry Cheesecake Martini",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Martini",
      "method": "Hard Shake & Double Strain",
      "ice": "Served Up (Chilled Martini Glass)",
      "colors": [
        "#f9a8d4",
        "#db2777"
      ],
      "garnishType": "berry-rim",
      "ingredients": [
        {
          "item": "vodka",
          "amount": "35 ml"
        },
        {
          "item": "baileys",
          "amount": "35 ml"
        },
        {
          "item": "cheesecake-syrup",
          "amount": "15 ml"
        },
        {
          "item": "strawberry-syrup",
          "amount": "10 ml"
        }
      ],
      "steps": [
        "Optional: Swirl a thin ribbon of Strawberry Syrup inside the bowl of a chilled Martini glass.",
        "Add Vodka, Baileys, Cheesecake Syrup, and Strawberry Syrup into a shaker filled with ice.",
        "Shake vigorously for 15 seconds until thick, frosty, and aerated.",
        "Double-strain into the chilled Martini glass."
      ],
      "servingNotes": "100% stocked in your bar! Creamy, indulgent, and balanced by the crisp bite of vodka."
    },
    {
      "id": "zero-proof-strawberry-cheesecake",
      "name": "No-Bake Strawberry Cheesecake Shake",
      "type": "Mocktail",
      "vibe": "Rich & Dessert",
      "glass": "Coupe",
      "method": "Hard Shake & Strain",
      "ice": "Served Up (Chilled Coupe)",
      "colors": [
        "#fbcfe8",
        "#f472b6"
      ],
      "garnishType": "berry-rim",
      "ingredients": [
        {
          "item": "cheesecake-syrup",
          "amount": "20 ml"
        },
        {
          "item": "strawberry-syrup",
          "amount": "15 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        },
        {
          "item": "dairy",
          "note": "Chilled",
          "amount": "90 ml"
        }
      ],
      "steps": [
        "Combine Cheesecake Syrup, Strawberry Syrup, Vanilla Syrup, and cold Milk/Cream in a shaker with ice.",
        "Shake hard for 15 seconds until velvety and frothy.",
        "Strain into a chilled Coupe or Rocks glass."
      ],
      "servingNotes": "Drizzle a drop of Strawberry Syrup on top of the foam and swirl with a toothpick."
    },
    {
      "id": "hazelnut-espresso-gin-martini",
      "name": "Roasted Hazelnut Espresso Gin Martini",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Martini",
      "method": "Hard Shake & Double Strain",
      "ice": "Served Up (Chilled Martini Glass)",
      "colors": [
        "#451a03",
        "#92400e"
      ],
      "garnishType": "none",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "45 ml"
        },
        {
          "item": "hazelnut-syrup",
          "amount": "15 ml"
        },
        {
          "item": "baileys",
          "amount": "15 ml"
        },
        {
          "item": "espresso",
          "note": "Chilled",
          "amount": "30 ml"
        }
      ],
      "steps": [
        "Add Coffee Gin, Hazelnut Syrup, Baileys, and chilled Espresso/Cold Brew into a shaker packed with ice.",
        "Shake aggressively for 15 seconds to build a rich, silky crema.",
        "Double-strain immediately into a frozen Martini glass."
      ],
      "servingNotes": "A gourmet twist on the Espresso Martini—botanical juniper and roasted hazelnut add immense depth."
    },
    {
      "id": "vanilla-hazelnut-rum-old-fashioned",
      "name": "Smoked Vanilla & Praline Rum Fashioned",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Rocks",
      "method": "Stir & Strain",
      "ice": "1 Large King Cube",
      "colors": [
        "#92400e",
        "#451a03"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "dark-rum",
          "amount": "60 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "7.5 ml"
        },
        {
          "item": "hazelnut-syrup",
          "amount": "7.5 ml"
        }
      ],
      "steps": [
        "Add Dark Rum, Vanilla Syrup, and Hazelnut Syrup to a mixing glass filled with ice.",
        "Stir smoothly for 25–30 seconds until properly chilled and diluted.",
        "Strain over a single large ice cube in a Rocks glass."
      ],
      "servingNotes": "100% stocked! Express an orange peel over the surface to cut through the rich vanilla-praline molasses notes."
    },
    {
      "id": "baileys-hazelnut-coffee-gin-rocks",
      "name": "Bicerin Nocturne",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Rocks",
      "method": "Build & Stir",
      "ice": "Large Cubed Ice",
      "colors": [
        "#78350f",
        "#d6d3d1"
      ],
      "garnishType": "none",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "35 ml"
        },
        {
          "item": "baileys",
          "amount": "45 ml"
        },
        {
          "item": "hazelnut-syrup",
          "amount": "10 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        }
      ],
      "steps": [
        "Place a large ice sphere or heavy cubes into a Rocks glass.",
        "Pour Coffee Gin, Hazelnut Syrup, and Vanilla Syrup over the ice and stir briefly.",
        "Slowly pour Baileys over the top so it cascades into the dark coffee spirit."
      ],
      "servingNotes": "Inspired by Turin's famous layered coffee-chocolate-cream drink—100% ready from your stocked shelves."
    },
    {
      "id": "whisky-vanilla-cola-float",
      "name": "Bourbon Vanilla Cream Highball",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Highball",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#3f1d0b",
        "#78350f"
      ],
      "garnishType": "none",
      "ingredients": [
        {
          "item": "whisky",
          "amount": "45 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "12 ml"
        },
        {
          "item": "cheesecake-syrup",
          "amount": "8 ml"
        },
        {
          "item": "cola",
          "note": "Chilled",
          "amount": "130 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with ice cubes.",
        "Pour Whisky, Vanilla Syrup, and Cheesecake Syrup over the ice.",
        "Top with chilled Cola and stir gently."
      ],
      "servingNotes": "Tastes like an elevated adult cream-soda float with warm oak and vanilla bean notes."
    },
    {
      "id": "coconut-baileys-colada-rocks",
      "name": "Toasted Coconut Cream",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Rocks",
      "method": "Shake & Strain",
      "ice": "Crushed / Cubed Ice",
      "colors": [
        "#fef3c7",
        "#d97706"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "dark-rum",
          "amount": "35 ml"
        },
        {
          "item": "baileys",
          "amount": "35 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "15 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        }
      ],
      "steps": [
        "Add Dark Rum, Baileys, Coconut Syrup, and Vanilla Syrup to a shaker with ice.",
        "Shake briskly for 12 seconds.",
        "Strain over fresh ice in a Rocks glass."
      ],
      "servingNotes": "100% stocked! Lush coconut macaroon meets Irish cream and dark molasses rum."
    },
    {
      "id": "hazelnut-whisky-godfather",
      "name": "Toasted Praline Whisky Sipper",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Rocks",
      "method": "Stir & Strain",
      "ice": "1 Large King Cube",
      "colors": [
        "#b45309",
        "#78350f"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "whisky",
          "amount": "55 ml"
        },
        {
          "item": "hazelnut-syrup",
          "amount": "12 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "5 ml"
        }
      ],
      "steps": [
        "Stir Whisky, Hazelnut Syrup, and Triple Sec Cacao Syrup over ice in a mixing glass for 25 seconds.",
        "Strain into a Rocks glass over one large ice cube."
      ],
      "servingNotes": "100% stocked! A rich, nutty riff on the classic Godfather cocktail with a whisper of sweet orange peel."
    },
    {
      "id": "baileys-cheesecake-coffee-flip",
      "name": "Tiramisu Cheesecake Martini",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Coupe",
      "method": "Hard Shake & Double Strain",
      "ice": "Served Up (Chilled Coupe)",
      "colors": [
        "#d6d3d1",
        "#78350f"
      ],
      "garnishType": "none",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "35 ml"
        },
        {
          "item": "baileys",
          "amount": "35 ml"
        },
        {
          "item": "cheesecake-syrup",
          "amount": "15 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        }
      ],
      "steps": [
        "Combine Coffee Gin, Baileys, Cheesecake Syrup, and Vanilla Syrup in a shaker packed with ice.",
        "Shake hard for 15 seconds until velvety and frothy.",
        "Double-strain into a chilled Coupe glass."
      ],
      "servingNotes": "100% stocked! Liquid tiramisu—mascarpone cheesecake richness layered over roasted coffee botanicals."
    },
    {
      "id": "grappa-hazelnut-affogato-rocks",
      "name": "Piedmont Hazelnut & Grappa Cream",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Rocks",
      "method": "Shake & Strain",
      "ice": "Large Cubed Ice",
      "colors": [
        "#e7e5e4",
        "#78350f"
      ],
      "garnishType": "none",
      "ingredients": [
        {
          "item": "grappa",
          "amount": "30 ml"
        },
        {
          "item": "baileys",
          "amount": "45 ml"
        },
        {
          "item": "hazelnut-syrup",
          "amount": "12 ml"
        }
      ],
      "steps": [
        "Shake Grappa, Baileys, and Hazelnut Syrup with ice for 12 seconds.",
        "Strain over a large ice cube in a Rocks glass."
      ],
      "servingNotes": "100% stocked! Classic northern Italian digestif pairing of aromatic grape grappa and toasted Piedmont hazelnuts."
    },
    {
      "id": "iced-vanilla-hazelnut-cold-brew-mocktail",
      "name": "Velvet Hazelnut Cold Brew Tonic",
      "type": "Mocktail",
      "vibe": "Rich & Dessert",
      "glass": "Highball",
      "method": "Build & Layer",
      "ice": "Cubed Ice",
      "colors": [
        "#451a03",
        "#d97706"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "hazelnut-syrup",
          "amount": "15 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "10 ml"
        },
        {
          "item": "tonic",
          "note": "Chilled",
          "amount": "100 ml"
        },
        {
          "item": "espresso",
          "note": "Chilled",
          "amount": "60 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with ice cubes.",
        "Pour Hazelnut Syrup, Vanilla Syrup, and chilled Tonic Water into the glass and stir gently.",
        "Slowly float the cold Espresso/Cold Brew over the top for a dramatic two-tone layer."
      ],
      "servingNotes": "Express an orange peel over the top. Sophisticated, zero-proof coffee-house mocktail."
    },
    {
      "id": "tequila-coconut-vanilla-horchata",
      "name": "Agave Coconut Cream",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Rocks",
      "method": "Hard Shake & Strain",
      "ice": "Cubed Ice",
      "colors": [
        "#fef3c7",
        "#d6d3d1"
      ],
      "garnishType": "none",
      "ingredients": [
        {
          "item": "tequila",
          "amount": "45 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "15 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "10 ml"
        },
        {
          "item": "dairy",
          "note": "Chilled",
          "amount": "60 ml"
        }
      ],
      "steps": [
        "Shake Tequila, Coconut Syrup, Vanilla Syrup, and cold Milk/Cream hard with ice for 12 seconds.",
        "Strain over fresh cubed ice in a Rocks glass."
      ],
      "servingNotes": "Earthy agave tequila pairs surprisingly well with creamy coconut and warm Madagascar vanilla."
    },
    {
      "id": "jager-berry-fizz",
      "name": "Black Forest Jäger Fizz",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Highball",
      "method": "Shake & Top",
      "ice": "Cubed Ice",
      "colors": [
        "#881337",
        "#be123c"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "jagermeister",
          "amount": "45 ml"
        },
        {
          "item": "strawberry-syrup",
          "amount": "15 ml"
        },
        {
          "item": "grenadine",
          "amount": "10 ml"
        },
        {
          "item": "lemon",
          "amount": "20 ml"
        },
        {
          "item": "soda",
          "amount": "90 ml"
        }
      ],
      "steps": [
        "Shake Jägermeister, Strawberry Syrup, Grenadine, and Fresh Lemon Juice with ice for 10 seconds.",
        "Strain into a Highball glass filled with ice.",
        "Top with chilled Club Soda and stir lightly."
      ],
      "servingNotes": "Garnish with a lemon wheel. The 56 botanicals and anise notes in Jägermeister pair surprisingly well with tart berry and bright lemon."
    },
    {
      "id": "jager-ginger-apple-mule",
      "name": "Bavarian Orchard Mule",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Rocks",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#713f12",
        "#a16207"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "jagermeister",
          "amount": "45 ml"
        },
        {
          "item": "green-apple-syrup",
          "amount": "15 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "ginger",
          "amount": "100 ml"
        }
      ],
      "steps": [
        "Fill a Rocks glass with ice.",
        "Pour Jägermeister, Green Apple Syrup, and Fresh Lime Juice over the ice.",
        "Top with spicy Ginger Beer and give a gentle stir."
      ],
      "servingNotes": "Garnish with a lime wheel and mint sprig. Spiced herbal roots meet crisp green apple and fiery ginger."
    },
    {
      "id": "coffee-gin-negroni-twist",
      "name": "Midnight Cacao Coffee Boulevardier",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Rocks",
      "method": "Stir & Strain",
      "ice": "1 Large King Cube",
      "colors": [
        "#7f1d1d",
        "#450a0a"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "40 ml"
        },
        {
          "item": "red-wine",
          "note": "Full-Bodied",
          "amount": "35 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "hazelnut-syrup",
          "amount": "5 ml"
        }
      ],
      "steps": [
        "Combine Coffee Gin, Red Wine, Triple Sec Cacao Syrup, and Hazelnut Syrup in a mixing glass with ice.",
        "Stir for 25 seconds until glossy and deeply chilled.",
        "Strain over a large ice cube in a Rocks glass."
      ],
      "servingNotes": "100% stocked! Express an orange peel over the drink—red wine tannins, roasted coffee gin, and sweet orange create a low-sugar aperitif profile."
    },
    {
      "id": "grappa-citrus-sour",
      "name": "Alpine Grappa Citrus Sour",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Rocks",
      "method": "Hard Shake & Strain",
      "ice": "Cubed Ice",
      "colors": [
        "#fef08a",
        "#eab308"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "grappa",
          "amount": "50 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "15 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        },
        {
          "item": "lemon",
          "amount": "22 ml"
        }
      ],
      "steps": [
        "Add Grappa, Triple Sec Cacao Syrup, Vanilla Syrup, and Fresh Lemon Juice to a shaker with ice.",
        "Shake hard for 12 seconds to aerate.",
        "Strain over fresh ice in a Rocks glass."
      ],
      "servingNotes": "Garnish with a lemon or orange twist. Softens Grappa's fiery grape character into a bright, aromatic sour."
    },
    {
      "id": "kombucha-jager-zero-proof-tonic",
      "name": "Spiced Botanical Kombucha Sangria",
      "type": "Mocktail",
      "vibe": "Herbal & Bold",
      "glass": "Copa",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#991b1b",
        "#7f1d1d"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "kombucha",
          "note": "Berry or Original",
          "amount": "130 ml"
        },
        {
          "item": "grenadine",
          "amount": "15 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "5 ml"
        },
        {
          "item": "cranberry",
          "amount": "40 ml"
        }
      ],
      "steps": [
        "Fill a large Copa wine glass with ice.",
        "Add Grenadine, Triple Sec Cacao Syrup, Mint Mojito Syrup, and Cranberry Juice.",
        "Top with chilled Kombucha and lift gently with a barspoon."
      ],
      "servingNotes": "Complex, tannic, and ruby-red—gives zero-proof guests the structure and depth of a fine red wine spritz."
    },
    {
      "id": "jager-coffee-gin-black-tonic",
      "name": "Dark Forest Espresso Tonic",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#271408",
        "#713f12"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "30 ml"
        },
        {
          "item": "jagermeister",
          "amount": "20 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "10 ml"
        },
        {
          "item": "tonic",
          "note": "Chilled",
          "amount": "130 ml"
        }
      ],
      "steps": [
        "Fill a tall Highball glass with clear ice cubes.",
        "Pour Coffee Gin, Jägermeister, and Vanilla Syrup over the ice.",
        "Top with chilled Tonic Water and stir gently."
      ],
      "servingNotes": "100% stocked! Express an orange peel over the glass. Bittersweet herbs, roasted coffee, and crisp quinine create a bold digestif highball."
    },
    {
      "id": "jager-blue-lagoon-abyss",
      "name": "Deep Sea Botanicals",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Rocks",
      "method": "Build & Layer",
      "ice": "Cubed Ice",
      "colors": [
        "#0369a1",
        "#1e1b4b"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "jagermeister",
          "amount": "40 ml"
        },
        {
          "item": "cacao-blue-syrup",
          "amount": "20 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "ginger",
          "amount": "90 ml"
        }
      ],
      "steps": [
        "Fill a Rocks glass with cubed ice.",
        "Pour Cacao Blue Syrup, Fresh Lime Juice, and Ginger Ale into the glass and stir.",
        "Slowly float Jägermeister over the back of a spoon so the dark herbal liqueur settles over the deep blue base."
      ],
      "servingNotes": "Dramatic midnight-blue and amber layered presentation with bright citrus-spice flavor."
    },
    {
      "id": "red-wine-spiced-jager-spritz",
      "name": "Blackberry & Herb Red Wine Cooler",
      "type": "Wine & Low-ABV",
      "vibe": "Herbal & Bold",
      "glass": "Copa",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#4c0519",
        "#881337"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "red-wine",
          "amount": "100 ml"
        },
        {
          "item": "jagermeister",
          "amount": "20 ml"
        },
        {
          "item": "grenadine",
          "amount": "12 ml"
        },
        {
          "item": "soda",
          "amount": "60 ml"
        }
      ],
      "steps": [
        "Fill a Copa balloon glass with ice.",
        "Pour Red Wine, Jägermeister, and Grenadine over the ice and stir.",
        "Top with Club Soda and garnish with an orange wheel."
      ],
      "servingNotes": "100% stocked! Jägermeister acts like instant mulled-wine spices and botanical bitters for your red wine."
    },
    {
      "id": "dark-rum-whisky-vieux-carre-twist",
      "name": "Harbor Master's Reserve",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Rocks",
      "method": "Stir & Strain",
      "ice": "1 Large King Cube",
      "colors": [
        "#78350f",
        "#451a03"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "whisky",
          "amount": "30 ml"
        },
        {
          "item": "dark-rum",
          "amount": "30 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "8 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        }
      ],
      "steps": [
        "Combine Whisky, Dark Rum, Triple Sec Cacao Syrup, and Vanilla Syrup in a mixing glass with ice.",
        "Stir for 30 seconds until silky and well chilled.",
        "Strain over a large king cube in a Rocks glass."
      ],
      "servingNotes": "100% stocked! A split-base slow sipper uniting oak-aged whisky with rich molasses dark rum."
    },
    {
      "id": "grappa-red-wine-spritz",
      "name": "Tuscan Vineyard Spritz",
      "type": "Wine & Low-ABV",
      "vibe": "Herbal & Bold",
      "glass": "Copa",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#881337",
        "#9f1239"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "red-wine",
          "amount": "90 ml"
        },
        {
          "item": "grappa",
          "amount": "25 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "12 ml"
        },
        {
          "item": "tonic",
          "amount": "60 ml"
        }
      ],
      "steps": [
        "Pack a Copa wine glass with cubed ice.",
        "Pour Red Wine, Grappa, and Triple Sec Cacao Syrup over the ice.",
        "Top with Tonic Water and stir gently."
      ],
      "servingNotes": "100% stocked! Grape-on-grape synergy fortified with Grappa and lifted by bittersweet orange and tonic."
    },
    {
      "id": "kombucha-cacao-blue-botanical-fizz",
      "name": "Sapphire Tea & Citrus Spritz",
      "type": "Mocktail",
      "vibe": "Herbal & Bold",
      "glass": "Copa",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#0284c7",
        "#0f766e"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "kombucha",
          "note": "Original or Citrus",
          "amount": "150 ml"
        },
        {
          "item": "cacao-blue-syrup",
          "amount": "15 ml"
        },
        {
          "item": "mint-mojito-syrup",
          "amount": "8 ml"
        },
        {
          "item": "tonic",
          "amount": "30 ml"
        }
      ],
      "steps": [
        "Fill a large Copa wine glass with ice.",
        "Pour Cacao Blue Syrup and Mint Mojito Syrup over the ice.",
        "Top with chilled Kombucha and a splash of Tonic Water."
      ],
      "servingNotes": "100% stocked zero-proof aperitif—earthy fermented tea turns blue curaçao into an emerald-sapphire botanical spritz."
    },
    {
      "id": "coffee-gin-passion-sour",
      "name": "Roast & Tropics Sour",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Coupe",
      "method": "Hard Shake & Double Strain",
      "ice": "Served Up (Chilled Coupe)",
      "colors": [
        "#92400e",
        "#f59e0b"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "45 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "18 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        },
        {
          "item": "lime",
          "amount": "20 ml"
        }
      ],
      "steps": [
        "Shake Coffee Gin, Passion Fruit Syrup, Vanilla Syrup, and Fresh Lime Juice hard with ice for 12 seconds.",
        "Double-strain into a chilled Coupe glass."
      ],
      "servingNotes": "A bartenders' secret pairing: bright acidic passion fruit unlocks the fruity notes inside roasted coffee beans."
    },
    {
      "id": "vodka-cheesecake-passion-martini",
      "name": "Tropical Passion Cheesecake Martini",
      "type": "Cocktail",
      "vibe": "Rich & Dessert",
      "glass": "Martini",
      "method": "Hard Shake & Double Strain",
      "ice": "Served Up (Chilled Martini Glass)",
      "colors": [
        "#fde047",
        "#f59e0b"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "vodka",
          "amount": "35 ml"
        },
        {
          "item": "baileys",
          "amount": "30 ml"
        },
        {
          "item": "cheesecake-syrup",
          "amount": "15 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "12 ml"
        }
      ],
      "steps": [
        "Combine Vodka, Baileys, Cheesecake Syrup, and Passion Fruit Syrup in a shaker with ice.",
        "Shake hard for 15 seconds until thick and frothy.",
        "Double-strain into a chilled Martini glass."
      ],
      "servingNotes": "100% stocked! Tangy passion fruit curd layered over creamy New York cheesecake."
    },
    {
      "id": "whisky-orange-vanilla-sour",
      "name": "Golden Valencia Whisky Sour",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Rocks",
      "method": "Hard Shake & Strain",
      "ice": "Cubed Ice",
      "colors": [
        "#f59e0b",
        "#b45309"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "whisky",
          "amount": "50 ml"
        },
        {
          "item": "orange",
          "amount": "60 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "12 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "8 ml"
        },
        {
          "item": "lemon",
          "amount": "10 ml",
          "substitutes": [
            "lime"
          ]
        }
      ],
      "steps": [
        "Add Whisky, Orange Juice, Triple Sec Cacao Syrup, Vanilla Syrup, and Fresh Lemon Juice to a shaker with ice.",
        "Shake hard for 12 seconds until frothy and chilled.",
        "Strain over fresh cubed ice in a Rocks glass."
      ],
      "servingNotes": "Garnish with a fresh orange wheel or expressed orange peel. Rich vanilla and warm whisky melt into bright fresh orange."
    },
    {
      "id": "tequila-passion-orange-margarita",
      "name": "Jalisco Blood-Orange & Passion Margarita",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Rocks",
      "method": "Shake & Strain",
      "ice": "Cubed Ice",
      "colors": [
        "#fb923c",
        "#ea580c"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "tequila",
          "amount": "45 ml"
        },
        {
          "item": "orange",
          "amount": "60 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "15 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "lime",
          "amount": "12 ml",
          "substitutes": [
            "lemon"
          ]
        }
      ],
      "steps": [
        "Shake Tequila, Orange Juice, Passion Fruit Syrup, Triple Sec Cacao Syrup, and Fresh Lime Juice with ice.",
        "Strain into a Rocks glass over fresh cubed ice."
      ],
      "servingNotes": "A bright, sunset-orange margarita bursting with tropical passion fruit—zero grenadine needed."
    },
    {
      "id": "dark-rum-coconut-painkiller",
      "name": "Carib Sunset Orange Painkiller",
      "type": "Cocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Shake & Strain",
      "ice": "Crushed Ice",
      "colors": [
        "#facc15",
        "#d97706"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "dark-rum",
          "amount": "50 ml"
        },
        {
          "item": "orange",
          "amount": "75 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "20 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        }
      ],
      "steps": [
        "Combine Dark Rum, Orange Juice, Coconut Syrup, and Triple Sec Cacao Syrup in a shaker with ice.",
        "Shake briskly for 12 seconds until creamy and aerated.",
        "Strain into a Hurricane glass packed with crushed ice."
      ],
      "servingNotes": "Inspired by the classic Painkiller—velvety coconut cream and sweet orange juice anchored by bold Dark Rum."
    },
    {
      "id": "vodka-strawberry-orange-screwdriver",
      "name": "Crimson Seville Screwdriver",
      "type": "Cocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#fb7185",
        "#fb923c"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "vodka",
          "amount": "45 ml"
        },
        {
          "item": "orange",
          "amount": "110 ml"
        },
        {
          "item": "strawberry-syrup",
          "amount": "15 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "8 ml"
        }
      ],
      "steps": [
        "Fill a tall Highball glass with cubed ice.",
        "Pour Vodka, Strawberry Syrup, Triple Sec Cacao Syrup, and chilled Orange Juice over the ice.",
        "Stir gently from bottom to top until rosy-orange."
      ],
      "servingNotes": "Garnish with an orange wheel. Fresh berry sweetness and orange liqueur notes elevate the classic Screwdriver."
    },
    {
      "id": "coffee-gin-orange-spritz",
      "name": "Espresso Valencia Tonic",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Copa",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#9a3412",
        "#f97316"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "coffee-gin",
          "amount": "45 ml"
        },
        {
          "item": "orange",
          "amount": "50 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "5 ml"
        },
        {
          "item": "tonic",
          "amount": "80 ml"
        }
      ],
      "steps": [
        "Fill a large Copa balloon wine glass with ice cubes.",
        "Add Coffee Gin, Orange Juice, Triple Sec Cacao Syrup, and Vanilla Syrup and stir gently.",
        "Top with chilled Tonic Water."
      ],
      "servingNotes": "Roasted coffee and fresh orange juice is a cafe favorite—tonic water turns it into a crisp, bittersweet aperitif."
    },
    {
      "id": "jager-orange-ginger-highball",
      "name": "Black Forest Orange Highball",
      "type": "Cocktail",
      "vibe": "Herbal & Bold",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#7c2d12",
        "#ea580c"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "jagermeister",
          "amount": "45 ml"
        },
        {
          "item": "orange",
          "amount": "80 ml"
        },
        {
          "item": "triple-sec-cacao-syrup",
          "amount": "10 ml"
        },
        {
          "item": "ginger",
          "amount": "60 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with cubed ice.",
        "Pour Jägermeister, Orange Juice, and Triple Sec Cacao Syrup over the ice.",
        "Top with Ginger Ale or Ginger Beer and stir gently."
      ],
      "servingNotes": "Jägermeister already features bitter orange peel in its botanical blend—fresh orange juice and ginger bring it to life."
    },
    {
      "id": "shirley-temple",
      "name": "Shirley Temple",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build",
      "ice": "Cubed Ice",
      "colors": [
        "#fecdd3",
        "#fb7185"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "lemon-lime-soda",
          "note": "Chilled",
          "amount": "180 ml"
        },
        {
          "item": "grenadine",
          "amount": "15 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with ice cubes.",
        "Pour in the chilled lemon-lime soda.",
        "Drizzle the grenadine down the inside of the glass so it settles into a pink gradient. Don't stir."
      ],
      "servingNotes": "Garnish with an orange wheel on the rim. The classic zero-proof pour, ready from the bar with no fresh juice needed."
    },
    {
      "id": "sunrise-citrus-fizz",
      "name": "Sunrise Citrus Fizz",
      "type": "Mocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Highball",
      "method": "Build & Layer",
      "ice": "Cubed Ice",
      "colors": [
        "#fdba74",
        "#e11d48"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "orange",
          "note": "Chilled",
          "amount": "120 ml"
        },
        {
          "item": "lemon-lime-soda",
          "amount": "Top (60 ml)"
        },
        {
          "item": "grenadine",
          "amount": "15 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with ice cubes and pour in the orange juice.",
        "Top with lemon-lime soda.",
        "Slowly pour the grenadine down the side so it sinks and blooms into a sunrise."
      ],
      "servingNotes": "Orange wheel on the rim. Serve unstirred so guests see the red-to-gold gradient."
    },
    {
      "id": "orange-mint-nojito",
      "name": "Orange Mint Nojito",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Crushed Ice",
      "colors": [
        "#fed7aa",
        "#f59e0b"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "mint-mojito-syrup",
          "amount": "20 ml"
        },
        {
          "item": "orange",
          "amount": "60 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "soda",
          "amount": "Top (90 ml)"
        }
      ],
      "steps": [
        "Add the mint mojito syrup, orange juice and lime juice to a Highball glass.",
        "Pack the glass with crushed ice.",
        "Top with club soda and lift gently from the bottom with a barspoon."
      ],
      "servingNotes": "Garnish with a slapped mint sprig and a lime wheel. Brighter and fruitier than a classic virgin mojito."
    },
    {
      "id": "orange-creamsicle-float",
      "name": "Orange Creamsicle Float",
      "type": "Mocktail",
      "vibe": "Rich & Dessert",
      "glass": "Highball",
      "method": "Shake & Top",
      "ice": "Cubed Ice",
      "colors": [
        "#fed7aa",
        "#fb923c"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "orange",
          "amount": "120 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "15 ml"
        },
        {
          "item": "dairy",
          "note": "Chilled",
          "amount": "45 ml"
        },
        {
          "item": "soda",
          "amount": "Top (30 ml)"
        }
      ],
      "steps": [
        "Shake the orange juice, vanilla syrup and cream hard with ice for 10 seconds.",
        "Strain into an ice-filled Highball glass.",
        "Top with a splash of club soda for a light, foamy head."
      ],
      "servingNotes": "Express an orange twist over the top. Tastes like the ice-lolly from childhood summers."
    },
    {
      "id": "island-sunset-punch",
      "name": "Island Sunset Punch",
      "type": "Mocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Shake & Layer",
      "ice": "Crushed Ice",
      "colors": [
        "#fde047",
        "#f97316"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "pineapple",
          "amount": "60 ml"
        },
        {
          "item": "orange",
          "amount": "60 ml"
        },
        {
          "item": "passion-fruit-syrup",
          "amount": "15 ml"
        },
        {
          "item": "soda",
          "amount": "Top (30 ml)"
        },
        {
          "item": "grenadine",
          "amount": "10 ml"
        }
      ],
      "steps": [
        "Shake the pineapple juice, orange juice and passion fruit syrup with ice.",
        "Strain into a Hurricane glass packed with crushed ice and top with club soda.",
        "Sink the grenadine down the side for a sunset layer."
      ],
      "servingNotes": "Cocktail umbrella and a long straw. Scales well into a punch bowl for parties (multiply by the number of guests)."
    },
    {
      "id": "blue-lagoon-zero",
      "name": "Blue Lagoon Zero",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Hurricane",
      "method": "Build & Stir",
      "ice": "Crushed Ice",
      "colors": [
        "#7dd3fc",
        "#2563eb"
      ],
      "garnishType": "citrus-wheel",
      "ingredients": [
        {
          "item": "cacao-blue-syrup",
          "amount": "20 ml"
        },
        {
          "item": "lemon",
          "amount": "15 ml",
          "substitutes": [
            "lime"
          ]
        },
        {
          "item": "lemon-lime-soda",
          "amount": "150 ml"
        }
      ],
      "steps": [
        "Add the Cacao Blue syrup and lemon juice to a Hurricane glass.",
        "Fill with crushed ice.",
        "Top with lemon-lime soda and stir once to an even electric blue."
      ],
      "servingNotes": "Lemon wheel and a straw. A crowd-pleaser for the zero-proof crowd."
    },
    {
      "id": "strawberry-lemonade-fizz",
      "name": "Strawberry Lemonade Fizz",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#fda4af",
        "#e11d48"
      ],
      "garnishType": "berry-rim",
      "ingredients": [
        {
          "item": "strawberry-syrup",
          "amount": "20 ml"
        },
        {
          "item": "lemon",
          "amount": "25 ml"
        },
        {
          "item": "lemon-lime-soda",
          "amount": "120 ml"
        }
      ],
      "steps": [
        "Add the strawberry syrup and lemon juice to a Highball glass.",
        "Fill with ice cubes.",
        "Top with lemon-lime soda and stir gently."
      ],
      "servingNotes": "Sugar-rim the glass first if you like, then garnish with a lemon wheel."
    },
    {
      "id": "coconut-pineapple-cooler",
      "name": "Coconut Pineapple Cooler",
      "type": "Mocktail",
      "vibe": "Tropical & Fruity",
      "glass": "Hurricane",
      "method": "Shake & Top",
      "ice": "Crushed Ice",
      "colors": [
        "#fef9c3",
        "#facc15"
      ],
      "garnishType": "umbrella-straw",
      "ingredients": [
        {
          "item": "pineapple",
          "amount": "90 ml"
        },
        {
          "item": "coconut-syrup",
          "amount": "20 ml"
        },
        {
          "item": "lime",
          "amount": "10 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "soda",
          "amount": "Top (60 ml)"
        }
      ],
      "steps": [
        "Shake the pineapple juice, coconut syrup and lime juice with ice until frothy.",
        "Strain into a Hurricane glass over crushed ice.",
        "Top with club soda."
      ],
      "servingNotes": "A light, fizzy take on a virgin piña colada. Umbrella and straw."
    },
    {
      "id": "cranberry-orange-mule",
      "name": "Cranberry Orange Mule",
      "type": "Mocktail",
      "vibe": "Herbal & Bold",
      "glass": "Highball",
      "method": "Build & Stir",
      "ice": "Cubed Ice",
      "colors": [
        "#fda4af",
        "#be123c"
      ],
      "garnishType": "mint-lime",
      "ingredients": [
        {
          "item": "cranberry",
          "amount": "60 ml"
        },
        {
          "item": "orange",
          "amount": "30 ml"
        },
        {
          "item": "lime",
          "amount": "15 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "ginger",
          "note": "Ginger beer works best",
          "amount": "Top (100 ml)"
        }
      ],
      "steps": [
        "Add the cranberry, orange and lime juice to an ice-filled Highball glass.",
        "Top with ginger beer.",
        "Stir once from the bottom."
      ],
      "servingNotes": "Lime wheel and a mint sprig. Spicy, tart and festive."
    },
    {
      "id": "cranberry-sparkler",
      "name": "Cranberry Sparkler",
      "type": "Mocktail",
      "vibe": "Refreshing & Crisp",
      "glass": "Flute",
      "method": "Build",
      "ice": "No Ice (Pre-Chilled)",
      "colors": [
        "#fecdd3",
        "#be123c"
      ],
      "garnishType": "berry-rim",
      "ingredients": [
        {
          "item": "cranberry",
          "note": "Well chilled",
          "amount": "75 ml"
        },
        {
          "item": "lime",
          "amount": "5 ml",
          "substitutes": [
            "lemon"
          ]
        },
        {
          "item": "lemon-lime-soda",
          "note": "Well chilled",
          "amount": "75 ml"
        }
      ],
      "steps": [
        "Chill the flute, cranberry juice and soda well beforehand.",
        "Pour the cranberry and lime juice into the flute.",
        "Top slowly with lemon-lime soda to keep the bubbles."
      ],
      "servingNotes": "A zero-proof toast drink. Hand these out when the bubbly comes out."
    },
    {
      "id": "orange-espresso-tonic",
      "name": "Orange Espresso Tonic",
      "type": "Mocktail",
      "vibe": "Herbal & Bold",
      "glass": "Highball",
      "method": "Build & Layer",
      "ice": "Cubed Ice",
      "colors": [
        "#fdba74",
        "#78350f"
      ],
      "garnishType": "orange-twist",
      "ingredients": [
        {
          "item": "orange",
          "amount": "45 ml"
        },
        {
          "item": "tonic",
          "amount": "120 ml"
        },
        {
          "item": "espresso",
          "note": "Chilled",
          "amount": "45 ml"
        }
      ],
      "steps": [
        "Fill a Highball glass with ice and add the orange juice.",
        "Top with tonic water.",
        "Slowly pour the chilled espresso over the back of a spoon so it floats on top."
      ],
      "servingNotes": "Express an orange twist over the glass. Bitter, bright and very grown-up for a mocktail."
    },
    {
      "id": "vanilla-cream-cola",
      "name": "Vanilla Cream Cola",
      "type": "Mocktail",
      "vibe": "Rich & Dessert",
      "glass": "Highball",
      "method": "Build & Float",
      "ice": "Cubed Ice",
      "colors": [
        "#a16207",
        "#422006"
      ],
      "garnishType": "none",
      "ingredients": [
        {
          "item": "cola",
          "note": "Chilled",
          "amount": "180 ml"
        },
        {
          "item": "vanilla-syrup",
          "amount": "15 ml"
        },
        {
          "item": "dairy",
          "amount": "30 ml"
        }
      ],
      "steps": [
        "Add the vanilla syrup to an ice-filled Highball glass.",
        "Top with chilled cola and stir gently.",
        "Float the cream on top and serve with a straw so guests can stir it in."
      ],
      "servingNotes": "Soda-fountain style. Serve with a long spoon."
    }
  ]
};
