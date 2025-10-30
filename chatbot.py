from google import genai
from dotenv import load_dotenv
import pandas as pd
import re

load_dotenv()
client = genai.Client()

df = pd.read_excel("./PulseBat Dataset.xlsx")


def ragFromExcel(query : str): 
    queryLowered = query.lower()
    match = re.search(r"battery\s*(\d+)", queryLowered)

    if match:
        num = int(match.group(1))
        row = df[df["No."] == num]
        if row.empty:
            return "No data found for the query"
        else:
            return row.to_string(index=False)
    
    return ""


def askGeminai(userQuestion):
    ragData = ragFromExcel(userQuestion)

    promt = f"""
You are a battery engineering and environmental expert. You have access to the following battery context:
{ragData}

Answer the user query only if it is related to battery data, SOH, SOC, voltages,
or environmental impacts of batteries. Be concise and technical.

for example, if the user ask for the SOH for battery 5, use the context to get the battery's SOH, if context not available, tell user
information not available from your question.

If the user ask general questions on batteries and/or about their enviromental impacts, answer accordingly,

If the query is not on topic to batteries, tell them nicely that you cannot answer that.

User query: {userQuestion}
"""
    
    response = client.models.generate_content(
    model="gemini-2.5-flash", contents=promt)
    
    return response.text




print(askGeminai("what is the capital of france"))






