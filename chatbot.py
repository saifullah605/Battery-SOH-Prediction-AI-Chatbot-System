from google import genai
from dotenv import load_dotenv
import pandas as pd

load_dotenv()
client = genai.Client()

df = pd.read_excel("./PulseBat Dataset.xlsx")





