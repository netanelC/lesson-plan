import { saveAs } from "file-saver";
import type { LessonFlowStep } from "@repo/types";
import type { LessonPlanWithAttachments } from "../features/lessonPlan/api/useLessonPlan";

export const exportLessonPlanToWord = (plan: LessonPlanWithAttachments) => {
  // עיבוד נתונים לפורמט התצוגה
  const dateStr = new Date(plan.createdAt).toLocaleDateString("he-IL");
  const frameStr = plan.frame === "PLENARY" ? "מליאה" : "קבוצה קטנה";

  // יצירת שורות הטבלה (מהלך השיחה)
  const lessonRows = (plan.lessonFlow as unknown as LessonFlowStep[])
    .map(
      (step) => `
    <tr>
      <td style="width: 15%; padding: 5px 10px; border: 1px solid #000; vertical-align: top; font-weight: bold;">
        ${step.stage}
      </td>
      <td style="width: 10%; padding: 5px 10px; border: 1px solid #000; vertical-align: top; text-align: center;">
        ${step.durationMinutes > 0 ? `${step.durationMinutes} דק'` : "-"}
      </td>
      <td style="width: 75%; padding: 5px 10px; border: 1px solid #000; vertical-align: top;">
        ${step.description.replace(/\n/g, "<br>")}
      </td>
    </tr>
  `,
    )
    .join("");

  // יצירת רשימת מטרות אופרטיביות
  const goalsList = plan.operativeGoals.map((g) => `<li>${g}</li>`).join("");

  // בניית ה-HTML המותאם ל-Word
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${plan.topic}</title>
      <style>
        /* הגדרה אגרסיבית של פונט דוד לכל האלמנטים */
        body, p, h1, h2, h3, li, td, th, span, div, table { 
          font-family: 'David', sans-serif !important;
          direction: rtl; 
          text-align: right; 
        }
        
        body {
          font-size: 12pt; 
        }

        .top-header {
          text-align: left;
          font-size: 10pt;
          margin-bottom: 20px;
        }

        h1 { 
          font-size: 16pt; 
          font-weight: bold; 
          text-align: center; 
          text-decoration: underline; 
          margin-bottom: 20px; 
        }

        .label { 
          font-weight: bold; 
        }

        p { 
          margin: 5px 0; 
          line-height: 1.5; 
        }

        ol, ul { 
          margin-top: 5px; 
          margin-bottom: 10px; 
          padding-right: 25px; 
        }
        li { 
          margin-bottom: 5px; 
        }

        /* סגנונות ספציפיים לטבלה */
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 15px; 
          font-size: 12pt;
          table-layout: fixed;
        }
        th { 
          background-color: #f2f2f2; 
          border: 1px solid #000; 
          padding: 10px; 
          font-weight: bold; 
          text-align: center;
        }
        td {
          border: 1px solid #000;
        }
      </style>
    </head>
    <body>
      
      <p class="top-header">מערך שיחה - ${frameStr}</p>

      <p><span class="label">נושא השיחה:</span> ${plan.topic}</p>
      <p><span class="label">תאריך:</span> ${dateStr}</p>
      <p><span class="label">יחידה:</span> ${plan.unit}</p>
      <p><span class="label">מסגרת ההוראה:</span> ${frameStr}</p>
      <p><span class="label">גיל הילדים:</span> ${plan.ageGroup}</p>
      <p><span class="label">מטרת על:</span> ${plan.superGoal}</p>

      <p><span class="label">מטרות אופרטיביות:</span></p>
      <ol>
        ${goalsList}
      </ol>

      ${
        plan.priorKnowledge != null && plan.priorKnowledge !== ""
          ? `
        <p><span class="label">ידע קודם:</span> ${plan.priorKnowledge}</p>
      `
          : ""
      }

      ${
        plan.teachingAids.length > 0
          ? `
        <p><span class="label">אמצעי הוראה:</span> ${plan.teachingAids.join(", ")}</p>
      `
          : ""
      }

      ${
        plan.references.length > 0
          ? `
        <p><span class="label">מקורות מידע:</span></p>
        <ul>
          ${plan.references.map((ref) => `<li><a href="${ref}">${ref}</a></li>`).join("")}
        </ul>
      `
          : ""
      }

      <br>

      <p><span class="label">מהלך השיחה:</span></p>
      
      <table dir="rtl" width="100%" border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th style="width: 15%;">שלב</th>
            <th style="width: 10%;">זמן</th>
            <th style="width: 75%;">תיאור הפעילות</th>
          </tr>
        </thead>
        <tbody>
          ${lessonRows}
        </tbody>
      </table>

    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", content], {
    type: "application/msword",
  });

  saveAs(blob, `מערך שיעור - ${plan.topic}.doc`);
};
