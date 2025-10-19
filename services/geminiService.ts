import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PlayerCharacter, GameLogEntry, GeminiResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const characterSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    race: { type: Type.STRING },
    class: { type: Type.STRING },
    gender: { type: Type.STRING },
    hp: { type: Type.INTEGER },
    maxHp: { type: Type.INTEGER },
    inventory: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    backstory: { type: Type.STRING },
    strength: { type: Type.INTEGER },
    dexterity: { type: Type.INTEGER },
    intelligence: { type: Type.INTEGER },
  },
  required: ['name', 'race', 'class', 'gender', 'hp', 'maxHp', 'inventory', 'backstory', 'strength', 'dexterity', 'intelligence'],
};

const geminiResponseSchema = {
    type: Type.OBJECT,
    properties: {
        narrative: { 
            type: Type.STRING,
            description: "תיאור סיפורי של מה שקורה עכשיו בעולם המשחק כתוצאה מפעולת השחקן. חייב להיות בעברית." 
        },
        updatedParty: {
            type: Type.ARRAY,
            items: characterSchema,
            description: "מערך של כל הדמויות בקבוצה עם הנתונים המעודכנים שלהן."
        },
        isGameOver: { 
            type: Type.BOOLEAN,
            description: "האם המשחק נגמר (למשל, כל חברי הצוות מתו)."
        },
        gameOverReason: { 
            type: Type.STRING,
            description: "אם המשחק נגמר, זו הסיבה. אחרת, מחרוזת ריקה."
        },
    },
    required: ['narrative', 'updatedParty', 'isGameOver'],
};


const getSystemInstruction = (partySize: number) => `
אתה מנחה משחק תפקידים בסגנון מבוכים ודרקונים עבור קבוצה של ${partySize} הרפתקנים. המשחק מתנהל בעברית בלבד.
תפקידך הוא לתאר את העולם, להגיב לפעולות הקבוצה, ולנהל את מצב הדמויות שלהם.
עליך לספק תיאורים עשירים ומרתקים.
היה יצירתי והפוך את הסיפור למעניין ומאתגר.
נהל את כל הדמויות בקבוצה. אם פעולה משפיעה על דמות אחת, עדכן רק אותה. אם היא משפיעה על כולם, עדכן את כולם. ודא שאתה מחזיר תמיד את המצב המעודכן של כל חברי הקבוצה.
התגובה שלך חייבת להיות תמיד אובייקט JSON תקין שעונה על הסכמה שסופקה.
אל תוסיף \`\`\`json או כל סימון אחר מסביב לתגובת ה-JSON.
`;

export const generateCharacter = async (name: string, race: string, characterClass: string, gender: string): Promise<PlayerCharacter> => {
    try {
        const prompt = `
        צור דמות חדשה למשחק תפקידים.
        ${name ? `השם של הדמות הוא: ${name}` : 'המצא שם הולם וייחודי לדמות.'}
        הגזע של הדמות הוא: ${race}
        המין של הדמות הוא: ${gender}
        המקצוע של הדמות הוא: ${characterClass}

        צור לדמות סיפור רקע קצר ומעניין, קבע את נקודות החיים (HP) שלה, תכונות בסיסיות (כוח, זריזות, חוכמה) וציוד התחלתי.
        התכונות צריכות להיות בין 8 ל-18. נקודות החיים צריכות להיות בין 10 ל-20 בהתבסס על המקצוע.
        ודא שהמין של הדמות שאתה מחזיר הוא בדיוק "${gender}".
        התשובה חייבת להיות בפורמט JSON בלבד, התואם לסכמה שסופקה.
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: characterSchema
            }
        });

        const jsonString = response.text;
        const characterData = JSON.parse(jsonString);
        return characterData as PlayerCharacter;
    } catch (error) {
        console.error("Error generating character:", error);
        throw new Error("לא הצלחתי ליצור את הדמות. אנא נסה שוב.");
    }
};

export const generateCharacterImage = async (character: PlayerCharacter): Promise<string> => {
    try {
        const prompt = `Fantasy character portrait of a ${character.gender} ${character.race} ${character.class} named ${character.name}. Epic fantasy art style, detailed, Dungeons and Dragons character art.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        console.warn("No image data found in Gemini response.");
        return ""; // Return empty string if no image is found
    } catch (error) {
        console.error("Error generating character image:", error);
        return ""; // Return empty string on error so the game can continue
    }
};

export const getInitialScenario = async (party: PlayerCharacter[]): Promise<string> => {
    try {
        const partyDescription = party.map(p => 
            `- ${p.name}, ה${p.race} (${p.gender}) ה${p.class}. סיפור רקע: ${p.backstory}`
        ).join('\n');

        const prompt = `
        אתה מנחה משחק תפקידים בסגנון פנטזיה.
        זוהי קבוצת ההרפתקנים שמתחילה את המסע:
        ${partyDescription}

        בהתבסס על הרכב הקבוצה וסיפורי הרקע שלהם, צור סצנת פתיחה מרתקת ודרמטית.
        תאר היכן הם נמצאים ומה קורה סביבם. הצג בפניהם את האתגר או ההחלטה הראשונים שלהם.
        התשובה צריכה להיות תיאור סיפורי בעברית, ישירות לשחקנים.
        אל תוציא JSON. ספק רק את טקסט הסיפור.
        `;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating initial scenario:", error);
        // Fallback to a generic starter message
        return "אתם מוצאים את עצמכם על שביל עפר מפותל, היער העתיק סוגר עליכם מכל עבר. קרני שמש אחרונות מסתננות דרך העלווה הצפופה. לפנים, השביל מתפצל לשניים. שביל אחד מוביל עמוק יותר אל תוך היער האפל, והשני נראה כיורד אל עבר עמק אפוף ערפל. מה תעשו?";
    }
};


export const getGameUpdate = async (party: PlayerCharacter[], history: GameLogEntry[], playerAction: string): Promise<GeminiResponse> => {
    try {
        const recentHistory = history.slice(-6).map(entry => `${entry.sender}: ${entry.message}`).join('\n');

        const prompt = `
        המשך את משחק התפקידים.
        
        הנה מצב הקבוצה הנוכחי:
        ${JSON.stringify(party)}

        הנה היסטוריית המהלכים האחרונים:
        ${recentHistory}

        פעולת השחקן האחרונה (מפי ${party[0].name}, מנהיג/ת הקבוצה):
        ${playerAction}

        בהתבסס על פעולת השחקן, קדם את הסיפור. תאר את תוצאות הפעולה ואת מה שקורה עכשיו בעולם.
        עדכן את מצב הדמויות בקבוצה אם נדרש (למשל, שינוי ב-HP, הוספת פריט למלאי). ודא שאתה מחזיר את המצב המלא והמעודכן של כל חברי הקבוצה במערך "updatedParty".
        היה הוגן אך מאתגר. זכור, פעולות מסוכנות יכולות להוביל לפציעה או מוות של חברי הקבוצה.
        התשובה שלך חייבת להיות בפורמט JSON בלבד, התואם לסכמה שסופקה.
        `;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(party.length),
                responseMimeType: "application/json",
                responseSchema: geminiResponseSchema,
            },
        });

        const jsonString = response.text.trim();
        const responseData = JSON.parse(jsonString);
        return responseData as GeminiResponse;

    } catch (error) {
        console.error("Error getting game update:", error);
        throw new Error("אירעה שגיאה בתקשורת עם מנחה המשחק. אנא נסה שוב.");
    }
};