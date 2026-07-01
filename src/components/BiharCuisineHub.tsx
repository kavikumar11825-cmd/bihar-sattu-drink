import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChefHat, 
  Search, 
  Clock, 
  BookOpen, 
  Utensils, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  Check, 
  X, 
  RotateCcw,
  Star,
  Info
} from "lucide-react";

interface Recipe {
  id: string;
  name: string;
  hindiName: string;
  category: "sweets" | "mains" | "snacks";
  categoryLabel: string;
  hindiCategoryLabel: string;
  description: string;
  prepTime: string;
  cookTime: string;
  difficulty: "Easy" | "Medium" | "Expert";
  yield: string;
  famousFor: string;
  emoji: string;
  ingredients: string[];
  steps: string[];
  proTip: string;
}

const biharRecipes: Recipe[] = [
  {
    id: "litti-chokha",
    name: "Classic Litti Chokha",
    hindiName: "पारंपरिक लिट्टी चोखा",
    category: "mains",
    categoryLabel: "Main Course",
    hindiCategoryLabel: "भोजन",
    description: "The crown jewel of Bihari cuisine. Crispy whole wheat dough balls stuffed with spicy, seasoned Sattu, roasted to perfection on open fire, and generously bathed in pure desi ghee, served with smoky roasted eggplant and tomato mash (Chokha).",
    prepTime: "25 mins",
    cookTime: "35 mins",
    difficulty: "Medium",
    yield: "4 Servings (8-10 Littis)",
    famousFor: "Patna, South Bihar, & street stalls across Bihar",
    emoji: "🍘",
    ingredients: [
      "2 cups Whole Wheat Flour (आटा)",
      "1 cup Pure Chana Sattu (चना सत्तू)",
      "4 tbsp Desi Ghee (शुद्ध घी) for dipping",
      "1 medium Onion, finely chopped",
      "5-6 cloves Garlic & 1-inch Ginger, minced",
      "2-3 Green Chilies, finely chopped",
      "2 tbsp Mustard Oil (सरसों तेल) - strictly mandatory",
      "1 tbsp Pickle Masala / Achari Masala (अचारी मसाला)",
      "1 tbsp Lemon Juice (नींबू का रस)",
      "1/2 tsp Ajwain (अजवाइन) & Kalonji (कलौंजी)",
      "1 large Round Eggplant / Baingan (बैंगन) for Chokha",
      "2-3 ripe Tomatoes & 2 boiled Potatoes for Chokha",
      "Fresh Coriander leaves, Salt to taste"
    ],
    steps: [
      "DOUGH PREPARATION: Mix wheat flour, 1 tbsp ghee, and a pinch of salt. Gradually add water and knead into a soft, smooth dough. Cover with a damp cloth and rest for 20 minutes.",
      "SATTU STUFFING: In a mixing bowl, combine Sattu, chopped onions, ginger, garlic, green chilies, coriander leaves, mustard oil, lemon juice, ajwain, kalonji, achari pickle masala, and salt. Sprinkle 1-2 teaspoons of water and mix with fingers until the stuffing is crumbly yet damp enough to hold shape when pressed.",
      "PREPARE CHOKHA: Roast the eggplant, tomatoes, and 2-3 unpeeled garlic cloves directly over an open flame until the skins are completely charred and flesh is tender. Let them cool, peel off the charred skin, and mash them in a bowl along with boiled potatoes, 1 tbsp mustard oil, chopped green chilies, salt, and fresh coriander.",
      "SHAPING LITTIS: Pinch a medium-sized ball from the dough. Flatten it and cup it with your thumbs to make a hollow space. Place 1.5 to 2 tablespoons of Sattu stuffing inside. Gently fold the edges inwards, seal securely at the top, and roll into a neat, seamless round ball.",
      "ROASTING: Preheat oven to 200°C (390°F) or prepare a charcoal grill/boti. Place the Littis and bake/grill, turning occasionally, for 30-35 minutes until the outer crust develops brown spots and sounds hollow when tapped.",
      "FINISHING: Crinkle the baked Littis slightly by pressing them between your palms. Submerge them completely in warm, melted desi ghee for 10-15 seconds. Serve hot with a generous portion of smoky Chokha, sliced onions, and green chutney."
    ],
    proTip: "Adding spicy oil and masala from a red mango pickle (Achar ka Masala) into the Sattu stuffing is the secret trick used by old-school Patna cooks to achieve that authentic sharp, tongue-tickling flavor!"
  },
  {
    id: "thekua",
    name: "Festive Thekua (Khajur)",
    hindiName: "महाप्रसाद ठेकुआ / खजूर",
    category: "sweets",
    categoryLabel: "Festive Sweet",
    hindiCategoryLabel: "मिठाई",
    description: "The legendary, sacred cookie offered as Prasad during Bihar's grand Chhath Puja festival. Hard on the outside, incredibly crumbly on the inside, enriched with dry coconut, cardamoms, and pure ghee.",
    prepTime: "15 mins",
    cookTime: "20 mins",
    difficulty: "Easy",
    yield: "15-18 Pieces",
    famousFor: "Sacred Chhath Puja Mahaprasad across Bihar",
    emoji: "🍪",
    ingredients: [
      "2 cups Whole Wheat Flour (आटा)",
      "1/2 cup Dry Coconut (सूखा नारियल), grated or chopped thin",
      "3/4 cup Organic Jaggery / Gur (गुड़) or Sugar",
      "4 tbsp Desi Ghee (मोयन के लिए)",
      "1 tsp Fennel Seeds / Saunf (सौंफ)",
      "1/2 tsp Cardamom Powder (इलायची पाउडर)",
      "Water (minimal, approx. 1/3 cup for melting jaggery)",
      "Ghee or Refined Oil for deep frying"
    ],
    steps: [
      "MELT JAGGERY: Dissolve the jaggery in 1/3 cup of warm water. Simmer for 2 minutes until fully dissolved, filter to remove impurities, and let the syrup cool completely.",
      "MOYEN (BINDING): In a wide mixing bowl, mix wheat flour, grated coconut, fennel seeds, and cardamom powder. Add the 4 tbsp of melted ghee. Rub the flour and ghee vigorously between your palms for 3-4 minutes until it resembles breadcrumbs and holds shape when pressed tightly in your fist.",
      "KNEADING (CRITICAL): Slowly drizzle the cooled jaggery syrup into the flour mixture. Gather the flour together to form a very stiff, tight, and dry crumbly dough. Do not knead it like chapati dough; just press it together so it binds. If it's too dry, sprinkle a few drops of water.",
      "SHAPING THEKUAS: Divide the dough into small, lemon-sized oval or round balls. Grease a wooden Thekua mold (Sancha) with ghee. Press a dough ball firmly onto the mold to imprint the traditional leaf or geometric design.",
      "HAND DESIGNS (ALTERNATIVE): If you don't have a mold, flatten the balls with your palm and use a toothpick, fork, or clean comb to draw fine leaf-like veins or criss-cross patterns.",
      "FRYING: Heat ghee or oil in a heavy-bottomed kadhai on medium heat. Once hot, lower the flame to low-medium. Gently slide 4-5 shaped Thekuas into the oil. Fry slowly on low-medium heat for 5-6 minutes per side without touching them frequently as they are very fragile when hot.",
      "COOLING & STORING: Once they turn deep golden brown, carefully drain and lift them out. They will feel soft initially but will turn beautifully crisp, hard, and crunchy as they cool down to room temperature."
    ],
    proTip: "Never knead the dough excessively! The dough must remain crumbly and dry. Over-kneading activates gluten, which makes the Thekua chewy rather than crisp and melt-in-the-mouth."
  },
  {
    id: "silao-khaja",
    name: "Silao Special Layered Khaja",
    hindiName: "सिलाव का प्रसिद्ध खाजा",
    category: "sweets",
    categoryLabel: "Traditional Sweet",
    hindiCategoryLabel: "मिठाई",
    description: "A GI-Tagged culinary masterpiece originating from the ancient town of Silao (near Nalanda). It consists of up to 52 crispy, wafer-thin translucent layers of pastry fried in pure ghee and glazed in light cardamom sugar syrup.",
    prepTime: "30 mins",
    cookTime: "25 mins",
    difficulty: "Expert",
    yield: "12-15 Pieces",
    famousFor: "Silao, Nalanda, Rajgir region",
    emoji: "🥠",
    ingredients: [
      "2 cups All-Purpose Flour / Maida (मैदा)",
      "4 tbsp Melted Ghee for dough",
      "3 tbsp Cornflour + 3 tbsp Ghee (for Saata paste layer)",
      "1.5 cups Sugar & 1 cup Water for syrup",
      "1/2 tsp Cardamom Powder",
      "Ghee for deep frying",
      "Cold water for kneading"
    ],
    steps: [
      "KNEAD DOUGH: Mix Maida and 4 tbsp of melted ghee. Add cold water in small portions and knead into a smooth, semi-soft, pliable dough. Cover with a moist cloth and rest for 30 minutes.",
      "PREPARE SAATA PASTE: In a small bowl, whisk 3 tbsp of cornflour with 3 tbsp of melted ghee until you get a smooth, white, creamy paste. This paste is the magic element that keeps the layers distinct.",
      "ROLL SHEETS: Divide the rested dough into 5-6 equal portions. Roll each portion out into an extremely thin, translucent, rectangular sheet, using minimal flour for dusting.",
      "STACKING AND PASTE: Place the first thin sheet on a clean work surface. Apply a thin, even layer of the Saata paste across the entire surface. Place the second sheet precisely on top, apply paste, and repeat the process for all 5 or 6 sheets.",
      "ROLL AND SLICE: Starting from one long end, roll the stacked sheets tightly into a compact cylindrical log. Moisten the outer edge with water to seal it firmly. Slice the log into 1-inch thick pieces.",
      "FLATTEN: Place each sliced piece flat on the board and gently press or roll lengthwise with a rolling pin. This stretches and reveals the beautiful, layered vertical lines of the Khaja.",
      "SUGAR SYRUP: Boil sugar and water together with cardamom powder for 6-8 minutes on medium heat to prepare a warm, sticky, single-thread sugar syrup.",
      "FRY & GLAZE: Heat ghee on medium-low heat. Fry the Khajas gently. As they heat, use a slotted spoon to splash hot oil over them, encouraging the layers to fan out like a book. Fry until crisp and pale golden. Remove, drain, and immediately submerge in warm sugar syrup for 2 minutes. Drain and serve crisp."
    ],
    proTip: "Splashing hot ghee continuously on the Khaja while deep-frying is vital. The thermal shock causes the cornflour-pasted layers to expand and separate into beautiful delicate crisps!"
  },
  {
    id: "gaya-tilkut",
    name: "Gaya Special Tilkut",
    hindiName: "गया का सोंधा तिलकुट",
    category: "snacks",
    categoryLabel: "Winter Delicacy",
    hindiCategoryLabel: "नाश्ता",
    description: "An authentic, highly healthy winter delicacy from Gaya. Sesame seeds are perfectly dry-roasted and pounded continuously with hot pulled jaggery syrup in iron mortars to form crispy, sweet, layered biscuits.",
    prepTime: "15 mins",
    cookTime: "30 mins",
    difficulty: "Expert",
    yield: "10-12 Discs",
    famousFor: "Ramna Road (Gaya), dry winter climates",
    emoji: "🥯",
    ingredients: [
      "2 cups White Sesame Seeds / Til (सफेद तिल)",
      "1.5 cups Organic Jaggery / Gur (गुड़) grated",
      "1/2 cup Water",
      "1/2 tsp Cardamom Powder",
      "1 tsp Ghee for greasing"
    ],
    steps: [
      "ROAST SESAME: Dry-roast white sesame seeds in a heavy pan on very low heat. Stir constantly for 6-8 minutes until they swell slightly, turn light cream, and release a rich, nutty aroma. Do not over-roast or they will taste bitter. Transfer to a flat tray and cool.",
      "BOIL JAGGERY: In a pan, combine grated jaggery and water. Boil over medium heat, skimming any foam. Cook until the syrup reaches a hard-ball consistency. Test by dropping a drop of syrup into a bowl of ice-cold water—if it instantly solidifies into a brittle, hard ball that cracks when pressed, it is ready.",
      "PULL SYRUP (TRADITIONAL METHOD): Pour the hot syrup onto a greased marble slab. As it cools slightly, pull and fold it repeatedly using greased iron hooks until it turns light golden, shiny, and highly porous.",
      "POUNDING MIXTURE: Quickly mix the roasted sesame seeds and cardamom powder into the warm, pulled jaggery. Transfer this mixture to a heavy mortar and pestle.",
      "HAMMERING OUT: Warm pound the mixture with a heavy wooden mallet/hammer. The crushing action releases natural oils from the sesame seeds, blending them beautifully with the jaggery layers to form a crumbly dough.",
      "MOLDING: While the pounded mixture is still warm, take small portions, press them into greased round ring molds (about 3 inches wide), and flatten them into crispy, crumbly, melt-in-the-mouth Tilkut discs."
    ],
    proTip: "If you do not have an iron mortar and pestle at home, you can pulse the roasted sesame seeds and warm jaggery syrup very briefly in a food processor, then hand-press them into flat discs before they cool down."
  },
  {
    id: "anarsa",
    name: "Chena Stuffed Anarsa",
    hindiName: "छैना भरा अनरसा",
    category: "sweets",
    categoryLabel: "Festive Sweet",
    hindiCategoryLabel: "मिठाई",
    description: "A gorgeous rice-flour pastry deep-fried in ghee, coated with sesame seeds, and stuffed with sweet mashed paneer (chena) or mawa. It is extremely crunchy on the outside, with a soft, moist, and heavenly center.",
    prepTime: "48 hours",
    cookTime: "25 mins",
    difficulty: "Expert",
    yield: "12-15 Pieces",
    famousFor: "Gaya town and festive seasons",
    emoji: "🍘",
    ingredients: [
      "1.5 cups Raw Rice (चावल)",
      "1 cup Powdered Sugar or Jaggery powder",
      "1/2 cup White Sesame Seeds (सफेद तिल) for coating",
      "1/2 cup Fresh Chena (पनीर/छैना) or Mawa for stuffing",
      "2 tbsp Milk",
      "Desi Ghee for deep frying"
    ],
    steps: [
      "SOAK RICE (2 DAYS): Soak raw rice in water for 2 full days. Ensure you rinse the rice and change the water every 12 hours to prevent fermentation odors.",
      "GRIND RICE: On the third day, drain the rice completely. Spread it out on a dry cotton cloth in the shade for 1-2 hours until damp but not wet. Grind it in a mixer to a fine powder and sieve it.",
      "MAKE DOUGH: Mix the sieved rice powder and powdered sugar. Add 1-2 tbsp of milk very slowly, kneading to form a tight, smooth dough. Cover and let it ferment at room temperature for 12 hours (overnight).",
      "CHENA FILLING: Mash fresh chena or mawa with a teaspoon of powdered sugar and cardamom until smooth and lump-free.",
      "SHAPE ANARSAS: Pinch small portions of the rice-flour dough. Flatten into a small cup, place a small teaspoon of sweet chena filling in the center, fold and roll into a smooth, crack-free ball.",
      "COAT SESAME: Spread sesame seeds on a plate. Roll the filled balls in the sesame seeds, pressing gently so the seeds adhere firmly to the outer surface.",
      "FRY: Heat ghee in a kadhai on medium-low. Gently slide the Anarsa balls. Do not flip them continuously. Spoon hot ghee over their top side constantly until they turn beautifully golden-brown and crispy. Drain and enjoy hot!"
    ],
    proTip: "Ensure the rice is dry to the touch but retains around 10% moisture before grinding. If the rice becomes bone-dry, the Anarsa dough will crumble and split open while frying."
  },
  {
    id: "malpua",
    name: "Banarasi-style Bihari Malpua",
    hindiName: "बिहारी केला मालपुआ",
    category: "sweets",
    categoryLabel: "Festive Sweet",
    hindiCategoryLabel: "मिठाई",
    description: "Traditional sweet dessert pancakes made from flour, mashed ripe bananas, fennel seeds, and milk, deep fried in ghee, and soaked in warm cardamom sugar syrup. Crispy, golden-laced edges with a pillowy soft heart.",
    prepTime: "30 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    yield: "10-12 Puds",
    famousFor: "Holi festival celebrations across Bihar",
    emoji: "🥞",
    ingredients: [
      "1 cup All-Purpose Flour / Maida",
      "2 tbsp Semolina / Suji for crispiness",
      "1 fully ripe Banana, mashed thoroughly",
      "1 cup Warm Milk",
      "3 tbsp Sugar for batter",
      "1 tsp Fennel Seeds (सौंफ) crushed",
      "1 cup Sugar & 1/2 cup Water for syrup",
      "1/2 tsp Cardamom Powder & Saffron strands",
      "Ghee for frying, Chopped Pistachios for garnish"
    ],
    steps: [
      "PREPARE BATTER: In a bowl, mash the banana until absolutely smooth. Whisk in Maida, Suji, fennel seeds, 3 tbsp sugar, and cardamom powder. Gradually pour warm milk, whisking constantly to ensure no lumps form. The batter should have a smooth, thick pouring consistency (like crepe batter).",
      "FERMENT: Cover the batter and let it rest for at least 2 hours. This resting allows the semolina to absorb liquid and ferment slightly, giving the pua its fluffy texture.",
      "SUGAR SYRUP: Boil 1 cup of sugar, saffron, and water for 6-8 minutes until you obtain a sticky, translucent syrup (single-thread consistency). Keep it warm.",
      "SHALLOW FRY: Heat ghee in a flat, shallow frying pan on medium-low. Scoop a ladleful of the batter and pour it directly into the center of the pan in one steady stream. It will automatically spread into a neat round pancake.",
      "LACING FRY: Fry on medium-low heat. The edges will cook first and turn thin, crinkled, and golden-brown. Splash ghee on the top, flip, and fry the other side until light golden.",
      "SYRUP BATH: Press the fried Malpua gently between two flat spatulas to drain excess ghee. Immediately slide it into the warm sugar syrup. Let it soak for 3-4 minutes to absorb the nectar. Lift, garnish with sliced almonds and pistachios, and serve warm."
    ],
    proTip: "A fully ripe, black-spotted banana is perfect for this recipe. It adds natural sweetness, moistness, and a heavenly fruity fragrance that cannot be replicated by artificial extracts!"
  },
  {
    id: "pedakiya",
    name: "Suji Pedakiya (Bihari Gujiya)",
    hindiName: "बिहार स्पेशल सूजी पेड़किया",
    category: "snacks",
    categoryLabel: "Festive Snack",
    hindiCategoryLabel: "नाश्ता",
    description: "A beloved crescent-shaped fried dumpling stuffed with rich roasted semolina (suji), desiccated coconut, cardamoms, and dry fruits. An irreplaceable delicacy prepared during Teej, Jitiya, and Chhath festivals.",
    prepTime: "30 mins",
    cookTime: "25 mins",
    difficulty: "Medium",
    yield: "20-25 Dumplings",
    famousFor: "Festivals of Teej, Holi, & Mithilanchal",
    emoji: "🥟",
    ingredients: [
      "2 cups Maida (All-Purpose Flour)",
      "4 tbsp Melted Ghee for dough",
      "1 cup Semolina / Suji (सूजी)",
      "3/4 cup Powdered Sugar",
      "1/2 cup Grated Dry Coconut (खोपरा)",
      "1/4 cup Chopped Almonds, Cashews, & Raisins",
      "1 tsp Cardamom Powder",
      "Oil or Ghee for deep frying"
    ],
    steps: [
      "CRUST DOUGH: In a wide bowl, combine Maida and 4 tbsp of melted ghee. Rub the flour between your palms until the flour looks like sand and holds shape when pressed. Gradually add cold water and knead into a semi-stiff, tight dough. Cover with a damp cloth and rest for 30 minutes.",
      "ROAST SUJI: Heat 1 tbsp of ghee in a pan. Add Suji and roast on low heat, stirring constantly, for 10-12 minutes until it turns light golden and highly aromatic. Transfer to a bowl.",
      "STUFFING MIXTURE: Let the roasted Suji cool completely. Mix in powdered sugar, grated coconut, chopped dry fruits, and cardamom powder. Your sweet Pedakiya filling is ready.",
      "ROLL OUT: Divide the dough into small, marble-sized balls. Roll each ball into a thin, 3-inch circular disc. Ensure the edges are rolled slightly thinner than the center.",
      "STUFF & SEAL: Place 1 to 1.5 tablespoons of suji stuffing in the middle of the rolled disc. Lightly wet the outer circular edge with a wet finger.",
      "BRAID THE EDGES: Fold the disc into a semi-circle, pressing the edges firmly together to seal. Using your thumb and index finger, pinch, fold, and pleat the sealed edge sequentially to form a beautiful, traditional braided design (Gothna). Alternatively, use a plastic Gujiya mold.",
      "DEEP FRY: Heat oil/ghee in a kadhai on medium heat. Lower the flame to medium-low and slide 4-5 Pedakiyas. Fry slowly for 12-15 minutes, turning occasionally, until they turn crispy, flaky, and golden-brown. Cool and store in airtight jars."
    ],
    proTip: "Ensure the suji has cooled down to room temperature before mixing in the powdered sugar! If you mix sugar into hot roasted suji, the sugar will melt and turn the stuffing sticky and damp."
  },
  {
    id: "sattu-paratha",
    name: "Nutritious Sattu Paratha",
    hindiName: "पौष्टिक सत्तू पराठा",
    category: "mains",
    categoryLabel: "Main Course",
    hindiCategoryLabel: "भोजन",
    description: "A super-healthy, high-protein Bihari breakfast staple. Golden, crispy whole wheat flatbreads stuffed with spiced roasted gram flour, loaded with sharp garlic, mustard oil, and sour pickle juices, roasted in pure ghee.",
    prepTime: "15 mins",
    cookTime: "15 mins",
    difficulty: "Easy",
    yield: "5-6 Parathas",
    famousFor: "Daily high-energy breakfast in Bihar homes",
    emoji: "🥞",
    ingredients: [
      "2 cups Whole Wheat Flour",
      "1 cup Pure Chana Sattu",
      "2 tbsp Mustard Oil",
      "1 tbsp Pickle Oil / Masala (Achar Ka Masala)",
      "1 medium Onion, very finely chopped",
      "1 tbsp Garlic & Ginger, finely minced",
      "2 Green Chilies, chopped fine",
      "1/2 tsp Carom Seeds / Ajwain",
      "1 tbsp Lemon Juice & Fresh Coriander",
      "Ghee for roasting"
    ],
    steps: [
      "KNEAD SOFT DOUGH: Mix wheat flour with a pinch of salt and 1 tsp of oil. Add water gradually, kneading to a soft, pliable, smooth dough. Rest for 15 minutes.",
      "SPICED SATTU MIX: In a bowl, thoroughly mix Sattu, chopped onion, ginger, garlic, green chilies, coriander, mustard oil, lemon juice, ajwain, pickle masala, and salt. Rub with fingers to distribute spices. Sprinkle a tablespoon of water—the stuffing should be damp and hold shape when pressed, yet crumbly.",
      "STUFF DOUGH: Take a large lemon-sized portion of dough. Roll it into a ball, then hollow out the center with your thumbs to make a cup. Place 2-3 packed tablespoons of the spiced Sattu filling in the center.",
      "SEAL: Pull the dough walls up over the filling, gather the pleats, pinch the excess dough off at the top, and seal it shut tightly. Flatten into a thick disc.",
      "ROLL OUT: Dust with flour and roll out very gently with a rolling pin into a 6-inch round flatbread. Apply light, even pressure so the stuffing distributes uniformly without tearing the dough.",
      "ROAST ON TAWA: Place the Paratha on a hot iron tawa. Cook for 1 minute until small bubbles appear. Flip, cook the other side, and apply a teaspoon of desi ghee or oil. Press with a spatula and roast until both sides are crispy and covered in deep golden-brown spots. Serve hot with curd and pickle."
    ],
    proTip: "If your Paratha tears while rolling, it means either the onions/chilies were not chopped finely enough, or you rolled it with too much force. Chop ingredients extremely fine, almost minced!"
  },
  {
    id: "dal-puri",
    name: "Festive Chana Dal Puri",
    hindiName: "पारंपरिक चना दाल पूरी",
    category: "mains",
    categoryLabel: "Main Course",
    hindiCategoryLabel: "भोजन",
    description: "A ceremonial flatbread prepared during auspicious occasions, weddings, and festivals like Adra Nakshatra. Soft wheat puris stuffed with spiced, mashed, and dry-roasted Chana Dal, deep-fried or griddle-roasted to fluffy perfection.",
    prepTime: "2 hours",
    cookTime: "25 mins",
    difficulty: "Medium",
    yield: "12-15 Puris",
    famousFor: "Festivals, wedding feasts, and Adra Puja",
    emoji: "🥯",
    ingredients: [
      "2 cups Whole Wheat Flour / Gehun ka Aata",
      "1 cup Chana Dal (चना दाल)",
      "1 tsp Cumin Seeds / Jeera",
      "1/4 tsp Asafoetida / Hing (हींग)",
      "1/2 tsp Turmeric Powder & Red Chili Powder",
      "1 tsp Garam Masala",
      "Salt to taste, Oil for deep frying"
    ],
    steps: [
      "SOAK & BOIL DAL: Soak Chana Dal in water for 2 hours. Pressure cook with 1.5 cups of water, a pinch of turmeric, and salt for 2 whistles on medium heat. The dal should be fully cooked and soft, but strictly retain its shape and not turn mushy. Drain excess water completely.",
      "TEMPER & MASH: Heat 1 tbsp of oil in a pan. Add cumin seeds and Hing. Once they splutter, add the cooked dal, red chili powder, and garam masala. Saute on medium-low for 3-4 minutes, mashing the dal with the back of your spoon until it dries out completely. Let it cool, then grind to a dry, powder-like paste.",
      "SOFT DOUGH: Knead a very soft, smooth, and elastic dough with wheat flour, a pinch of salt, and warm water. Rest the dough for 20 minutes under a damp cloth.",
      "STUFF PURIS: Take small, golf-ball-sized dough portions. Shape into hollow cups. Stuff with 1.5 tablespoons of dry, spiced chana dal mixture. Seal the opening securely and press flat.",
      "GENTLE ROLLING: Dust with flour. Roll out very gently into thick, 4-inch round puris. Use a very light hand to prevent the stuffing from spilling.",
      "DEEP FRY: Heat oil in a deep kadhai on medium-high. Once hot, lower the flame to medium. Slide a stuffed puri. Press gently with a slotted spoon to encourage it to puff up like a balloon. Flip and fry until golden-brown and cooked through. Serve hot with kheer and rich potato curry (Aloo dum)."
    ],
    proTip: "Perfect Dal Puri requires a very soft dough. If your dough is stiff, the Puri will not puff up, and the dry dal stuffing will break through the crust during rolling."
  }
];

export default function BiharCuisineHub() {
  const [activeCategory, setActiveCategory] = useState<"all" | "sweets" | "mains" | "snacks">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(biharRecipes[0]);
  
  // Interactive steps tracker for the selected recipe
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [completedIngredients, setCompletedIngredients] = useState<Record<string, boolean>>({});

  const filteredRecipes = biharRecipes.filter((recipe) => {
    const matchesCategory = activeCategory === "all" || recipe.category === activeCategory;
    const matchesSearch = 
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.hindiName.includes(searchQuery) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.famousFor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCompletedSteps({});
    setCompletedIngredients({});
    
    // Smooth scroll to recipe detail pane on mobile
    const detailPane = document.getElementById("recipe-detail-pane");
    if (detailPane) {
      detailPane.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleIngredient = (index: number) => {
    setCompletedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetProgress = () => {
    setCompletedSteps({});
    setCompletedIngredients({});
  };

  return (
    <div id="bihar-cuisine-hub" className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-8 shadow-sm">
      
      {/* Section Header */}
      <div className="border-b border-stone-150 pb-6 mb-8">
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full text-xs font-mono font-bold w-fit uppercase mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Culinary Encyclopedia / पाक कला गाइड
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight leading-none">
          बिहार के प्रसिद्ध व्यंजन और मिठाईयाँ 
        </h2>
        <p className="text-stone-500 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          Bihar has an extremely rich culinary heritage dating back thousands of years. Explore authentic, step-by-step masterclass recipes of Bihar's most loved sweet treats, savory delicacies, and high-energy staples!
        </p>
      </div>

      {/* Control Bar: Category Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === "all"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-650 hover:bg-stone-200/75"
            }`}
          >
            All Recipes ({biharRecipes.length})
          </button>
          <button
            onClick={() => setActiveCategory("sweets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === "sweets"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-stone-650 hover:bg-stone-200/75"
            }`}
          >
            Sweets / मिठाई
          </button>
          <button
            onClick={() => setActiveCategory("mains")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === "mains"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-stone-650 hover:bg-stone-200/75"
            }`}
          >
            Mains / भोजन
          </button>
          <button
            onClick={() => setActiveCategory("snacks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeCategory === "snacks"
                ? "bg-cyan-600 text-white shadow-sm"
                : "text-stone-650 hover:bg-stone-200/75"
            }`}
          >
            Snacks / नाश्ता
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center text-stone-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search Litti, Thekua, Gaya..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-medium text-stone-800"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Main Grid: Recipe Selector on Left, Interactive Workspace on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recipe list Cards */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[620px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 bg-stone-50 border border-dashed border-stone-200 rounded-2xl">
              <span className="text-3xl block mb-2">🤔</span>
              <p className="text-stone-500 font-semibold text-xs">No matching traditional recipes found.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-3 text-xs text-amber-600 font-extrabold hover:underline"
              >
                Reset Filters & Search
              </button>
            </div>
          ) : (
            filteredRecipes.map((recipe) => {
              const isActive = selectedRecipe?.id === recipe.id;
              return (
                <div
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left relative overflow-hidden group ${
                    isActive
                      ? "border-stone-900 bg-stone-950 text-white shadow-md"
                      : "border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{recipe.emoji}</span>
                      <div>
                        <h4 className={`text-sm font-bold ${isActive ? "text-amber-400" : "text-stone-900"}`}>
                          {recipe.name}
                        </h4>
                        <span className={`text-[10px] block font-sans ${isActive ? "text-stone-400" : "text-stone-400"}`}>
                          {recipe.hindiName}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase ${
                      recipe.category === "sweets"
                        ? "bg-amber-100 text-amber-800"
                        : recipe.category === "mains"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-cyan-100 text-cyan-800"
                    }`}>
                      {recipe.categoryLabel}
                    </span>
                  </div>

                  <p className={`text-xs mt-2.5 line-clamp-2 ${isActive ? "text-stone-300" : "text-stone-550"}`}>
                    {recipe.description}
                  </p>

                  <div className="mt-3.5 pt-3.5 border-t border-dashed flex items-center justify-between text-[10px] font-semibold">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-stone-400">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime}
                      </span>
                      <span className={`flex items-center gap-1 ${isActive ? "text-emerald-400" : "text-emerald-700"}`}>
                        <Flame className="w-3 h-3" />
                        {recipe.cookTime}
                      </span>
                    </div>

                    <span className={`font-bold flex items-center gap-0.5 ${isActive ? "text-stone-300" : "text-stone-600"}`}>
                      Region: <span className="font-extrabold">{recipe.famousFor.split(",")[0]}</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Interactive Workspace */}
        <div id="recipe-detail-pane" className="lg:col-span-7">
          {selectedRecipe ? (
            <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-5 md:p-6 space-y-6 relative">
              
              {/* Floating reset progress */}
              {(Object.keys(completedSteps).length > 0 || Object.keys(completedIngredients).length > 0) && (
                <button
                  onClick={resetProgress}
                  className="absolute top-4 right-4 bg-white/90 border border-stone-200/80 p-2 rounded-xl text-stone-600 hover:text-stone-900 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  title="Reset cook tracker"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Tracker
                </button>
              )}

              {/* Recipe Header */}
              <div className="space-y-2 pr-12">
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                  NOW COOKING • अब बनाएँ
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedRecipe.emoji}</span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-stone-900 tracking-tight leading-none">
                      {selectedRecipe.name}
                    </h3>
                    <span className="text-xs font-bold text-emerald-800 font-sans block mt-1">
                      {selectedRecipe.hindiName} ({selectedRecipe.hindiCategoryLabel})
                    </span>
                  </div>
                </div>
              </div>

              {/* Recipe Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="bg-white p-3 rounded-2xl border border-stone-150 text-center">
                  <span className="text-stone-450 block text-[9px] uppercase font-mono tracking-wider">Prep Time</span>
                  <span className="font-extrabold text-stone-900 block mt-0.5">{selectedRecipe.prepTime}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-stone-150 text-center">
                  <span className="text-stone-450 block text-[9px] uppercase font-mono tracking-wider">Cook Time</span>
                  <span className="font-extrabold text-stone-900 block mt-0.5">{selectedRecipe.cookTime}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-stone-150 text-center">
                  <span className="text-stone-450 block text-[9px] uppercase font-mono tracking-wider">Difficulty</span>
                  <span className={`font-extrabold block mt-0.5 ${
                    selectedRecipe.difficulty === "Easy" ? "text-emerald-700" :
                    selectedRecipe.difficulty === "Medium" ? "text-amber-700" : "text-rose-700"
                  }`}>{selectedRecipe.difficulty}</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-stone-150 text-center">
                  <span className="text-stone-450 block text-[9px] uppercase font-mono tracking-wider">Yield</span>
                  <span className="font-extrabold text-stone-900 block mt-0.5">{selectedRecipe.yield}</span>
                </div>
              </div>

              {/* Famous For Banner */}
              <div className="bg-stone-900 text-stone-100 p-3.5 rounded-2xl flex items-center gap-3 text-xs border border-stone-800">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  📍
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase font-mono tracking-widest leading-none">Famous Regional Origin</span>
                  <span className="font-bold text-amber-400 mt-1 block">{selectedRecipe.famousFor}</span>
                </div>
              </div>

              {/* Ingredients Interactive Checklist */}
              <div className="space-y-3 bg-white p-5 rounded-3xl border border-stone-200/80">
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-widest flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-emerald-700" />
                    Ingredients / आवश्यक सामग्री
                  </h4>
                  <span className="text-[10px] text-stone-400 font-bold">
                    {Object.values(completedIngredients).filter(Boolean).length} / {selectedRecipe.ingredients.length} Collected
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {selectedRecipe.ingredients.map((ing, index) => {
                    const isChecked = !!completedIngredients[index];
                    return (
                      <div
                        key={index}
                        onClick={() => toggleIngredient(index)}
                        className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-emerald-50/40 border-emerald-200 text-stone-400 line-through decoration-emerald-500/30"
                            : "bg-stone-50 border-stone-150 text-stone-750 hover:bg-stone-100/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors ${
                          isChecked ? "bg-emerald-600 text-white" : "border border-stone-300 bg-white"
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-medium leading-tight">{ing}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step by Step Instructions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                  <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-widest flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-amber-600" />
                    Step-by-Step Directions / बनाने की विधि
                  </h4>
                  <span className="text-[10px] text-stone-400 font-bold">
                    {Object.values(completedSteps).filter(Boolean).length} / {selectedRecipe.steps.length} Done
                  </span>
                </div>
                
                <div className="space-y-3.5">
                  {selectedRecipe.steps.map((step, index) => {
                    const isChecked = !!completedSteps[index];
                    return (
                      <div
                        key={index}
                        onClick={() => toggleStep(index)}
                        className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                          isChecked
                            ? "bg-stone-100 border-stone-200/80 text-stone-400"
                            : "bg-white border-stone-200/60 text-stone-800 hover:border-stone-300 shadow-sm"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 transition-colors ${
                          isChecked 
                            ? "bg-emerald-600 text-white" 
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}>
                          {isChecked ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : index + 1}
                        </div>
                        <div className="space-y-1 flex-1 select-none">
                          <p className={`text-xs font-medium leading-relaxed ${isChecked ? "line-through text-stone-400/80" : ""}`}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pro Culinary Tip */}
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  Expert Bihari Halwai Pro-Tip / हलवाई की गुप्त टिप
                </div>
                <p className="text-stone-700 text-xs leading-relaxed italic font-medium">
                  "{selectedRecipe.proTip}"
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200/80 rounded-3xl p-12 text-center text-stone-500 flex flex-col items-center justify-center h-full">
              <span className="text-4xl block mb-3 animate-bounce">🍲</span>
              <p className="font-extrabold text-stone-800 text-sm">Select a traditional dish from the left pane</p>
              <p className="text-stone-400 text-xs mt-1">Explore authentic ingredients, checklists, and secret tips!</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
