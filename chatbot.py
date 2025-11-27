from google import genai
from dotenv import load_dotenv
import pandas as pd
import re

load_dotenv()
client = genai.Client()

df = pd.read_excel("./PulseBat Dataset.xlsx")


import re

def ragFromExcel(query: str):
    q = query.lower().strip()

    # battery number search: "battery 5" etc.
    battery_nums = re.findall(r"battery\s*(\d+)", q)
    if battery_nums:
        nums = [int(n) for n in battery_nums]
        rows = df[df["No."].isin(nums)]
        return rows.to_string(index=False) if not rows.empty else "No data found"

    # SOH exact value search: "soh of 0.82", "soh of .75"
    soh_match = re.search(r"soh\s*of\s*([0-9]*\.?[0-9]+)", q)
    if soh_match:
        value = float(soh_match.group(1))

        # Floating-point safe comparison (±0.0001)
        rows = df[abs(df["SOH"] - value) < 0.0001]

        return rows.to_string(index=False) if not rows.empty else "No data found"

    return ""



def askGeminai(userQuestion):
    ragData = ragFromExcel(userQuestion)

    promt = f"""
You are a battery engineering and environmental expert. You have access to the following battery context:
{ragData}

Answer the user query only if it is related to battery data, SOH, SOC, voltages,
or environmental impacts of batteries. Be concise and technical.

for example, if the user ask for the SOH for battery 5, use the context to get the battery's SOH, if context not available, tell user
information not available from your question. If the SOH value is greater than 0.85, state the battery is healthy otherweise mention it is noi healthy.

If the user ask general questions on batteries and/or about their enviromental impacts, answer accordingly,

If the query is not on topic to batteries, tell them nicely that you cannot answer that.

User query: {userQuestion}
"""
    
    response = client.models.generate_content(
    model="gemini-2.5-flash", contents=promt)
    
    return response.text











