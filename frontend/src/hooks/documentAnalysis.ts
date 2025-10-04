import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});

const basePersonality = 'Assume you are an established paralegal/legal advisor extremely well versed with the Indian Legal System. You have complete and in-depth knowledge of every law in India pertaining to all different sections like Constitutional Law, Civil Law, Criminal Law, IpC (BNS now), CrPC (now BNSS), Indian evidence act (BSA now), Intellectual Property laws, every tort law in india and all other Laws and Legal Documents Applicable in India. Also you have an in-depth knowledge of all Laws and statutory, rules and regulations released by the indian government and indian state governments (region specific laws if regions are specified) all of which are applicable to corporate bodied and companies in india (basically you have indepth knowledge of Corporate Law). Use only reputed websites and Legal Databases like Indian Kanoon, Manupatra etc for legal reference. Use Indian Kanoon and other reputed sites for referring to previous judgements passed by high court and supreme court. Also assume you are an expert paralegal with lawyer like experience, being extremely good at figuring out loopholes in a given legal document.'

const instructions = "You are suppose to give just the json. No extra texts, no extra instructions, no extra anything. Just the json. This is a strict warning."

export const generateSummary = async (data: any) => {
  try {
    const prompt = `${basePersonality}. Here is the extracted JSON of the legal document: ${data}

The document can be either a Law or related Legal Document containing law/rules and regulations etc, OR it can be a Legal Case / dispute between two parties. You need to analyze this document and do the following:

For this attached/uploaded legal document, generate an in-depth summary divided into the below given parts:

1) An overall overview of the document explaining me the entire legal document/case.

2) a) If its a law, explain all of its its provisions in detail.

b) If its a Legal case/dispute then go over its facts, provide the laws/rules/regulations of required law/provision of a law/rule or regulation which have been violated, conflict of interests, which party has an overall advantage objectively and subjectively, which party needs to be the one providing the evidence and the possible verdicts of the case that the courts can make.

3) Provide me possible loopholes in the document/case by analyzing it with relevant legal documents and previous judgements and verdicts. Also provide me with the possible problems with the legal document or case (whichever is added).

4) Give me the overall brief summary of the above points but make it ad brief as possible. 

FORMAT FOR JSON: 
{
    data: //summary in string
}

${instructions}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    if (!response) {
      console.error("No response from AI model");
      return "null";
    }
    const cleaned = response.text
      ?.replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
    // console.log(cleaned);
    const tasksData = JSON.parse(cleaned || "");
    // console.log(tasksData);
    return tasksData as any;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate";
    console.error("Error generating:", errorMessage);
    return null;
  }
};

export const generateKeyPoints = async (data: any) => {
  try {
    const prompt = `${basePersonality}




Here is the extracted JSON of the legal document: ${data}
The document can be either a Law or related Legal Document containing law/rules and regulations etc, OR it can be a Legal Case / dispute between two parties. You need to analyze this document and do the following:

For this attached/uploaded legal document, generate an in-depth summary divided into the below given parts:



1)An overall over view of keypoints of the given document.

2) Analyze the structure of the legal document and tell the user if the document is well structures or not. 

FORMAT FOR JSON: 
{
    data: [
    {
    keyPoint: //keypoint title
    }
    ]
}
${instructions}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    if (!response) {
      console.error("No response from AI model");
      return "null";
    }
    const cleaned = response.text
      ?.replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
    // console.log(cleaned);
    const tasksData = JSON.parse(cleaned || "");
    // console.log(tasksData);
    return tasksData as any;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate";
    console.error("Error generating:", errorMessage);
    return null;
  }
};

export const generateIssues = async (data: any) => {
  try {
    const prompt = `${basePersonality}



Here is the extracted JSON of the legal document: ${data}
The document can be either a Law or related Legal Document containing law/rules and regulations etc, OR it can be a Legal Case / dispute between two parties. You need to analyze this document and do the following:

For this attached/uploaded legal document, generate an in-depth summary divided into the below given parts:



1) List out all the Issues and contradictions present in the document

2) List out the consequences of these issues and contradictions and how will the courts run into problems/react to these problems. 
FORMAT FOR JSON: 
{
    data: [
    {
    issue: //issue title
    priority: //issue priority (high, medium, low)
    }
    ]
}
${instructions}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    if (!response) {
      console.error("No response from AI model");
      return "null";
    }
    const cleaned = response.text
      ?.replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
    // console.log(cleaned);
    const tasksData = JSON.parse(cleaned || "");
    // console.log(tasksData);
    return tasksData as any;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate";
    console.error("Error generating:", errorMessage);
    return null;
  }
};

export const generateCitiations = async (data: any) => {
  try {
    const prompt = `${basePersonality}



Here is the extracted JSON of the legal document: ${data}
The document can be either a Law or related Legal Document containing law/rules and regulations etc, OR it can be a Legal Case / dispute between two parties. You need to analyze this document and do the following:

For this attached/uploaded legal document, generate an in-depth summary divided into the below given parts:



1) Citations related to this document. These can be either or all of the following (add 2-3 of each type if available):

a) Provide links to relevant Legal Documents / webpages available online.

b) Previous judgements relevant to this given document. Take these judgements from trusted Indian Legal websites.

c) Recent changes in rules and regulations related to this document

FORMAT FOR JSON: 
{
    data: [
  {
    citation: //citation title
    url: //citation url
    }
    ]
}
${instructions}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    if (!response) {
      console.error("No response from AI model");
      return "null";
    }
    const cleaned = response.text
      ?.replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
    // console.log(cleaned);
    const tasksData = JSON.parse(cleaned || "");
    // console.log(tasksData);
    return tasksData as any;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate";
    console.error("Error generating:", errorMessage);
    return null;
  }
};

export const generateLoopholes = async (data: any) => {
  try {
    const prompt = `
    ${basePersonality}  
    I will give you a legal document data. The document can be either a Law or related Legal Document containing law/rules and regulations etc, OR it can be a Legal Case / dispute between two parties. You need to analyze this document and do the following:
      For this legal document data ${data}, generate an in-depth summary divided into the below given parts:
      1)An overall over view of keypoints of the given document.
     2) Analyze the structure of the legal document and tell the user if the document is well structures or not.
      FORMAT FOR JSON: 
{
    data: [
    {
    loophole: //loophole title
    }
    ]
}
     ${instructions}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    if (!response) {
      console.error("No response from AI model");
      return "null";
    }
    const cleaned = response.text
      ?.replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();
    // console.log(cleaned);
    const tasksData = JSON.parse(cleaned || "");
    // console.log(tasksData);
    return tasksData as any;
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to generate";
    console.error("Error generating:", errorMessage);
    return null;
  }
};
