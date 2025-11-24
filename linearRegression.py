import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error


def model(inputdf):

    if not inputdf:
        raise ValueError("Input cannot be empty.")
    
    th = 0.85
    df = pd.read_excel("./PulseBat Dataset.xlsx", sheet_name="SOC ALL")

    features = [f"U{i}" for i in range(1,22)] # only need the cells as features

    first_row = inputdf[0] if isinstance(inputdf, list) else inputdf

    missing = set(features) - set(first_row.keys())
    if missing:
        raise ValueError(f"Missing required features: {missing}")

    inputDataframe = pd.DataFrame(inputdf)[features]


    x = df[features]
    y = df["SOH"]

    #xTrain, xTest, yTrain, yTest = train_test_split(x,y, test_size=0.2, random_state=21) #random state is arbitrary, but should be placed for the same results

    reg = LinearRegression()
    reg.fit(x, y)

    yPred = reg.predict(inputDataframe)
    #r2 = r2_score(yTest, yPred)
    #mae = mean_absolute_error(yTest, yPred)

    #print(f"R^2 score: {r2}")
    #print(f"mae: {mae}")

    results = pd.DataFrame({
        
        "Predicted SOH": yPred,
        "Predicted Health": yPred >= th
    })
    
    #pd.set_option('display.max_columns', None)  
    #pd.set_option('display.max_rows', None)
    
    return results.to_dict(orient="records")


test_input = {
    "U1": 3.92,
    "U2": 3.91,
    "U3": 3.90,
    "U4": 3.89,
    "U5": 3.88,
    "U6": 3.87,
    "U7": 3.86,
    "U8": 3.85,
    "U9": 3.84,
    "U10": 3.83,
    "U11": 3.82,
    "U12": 3.81,
    "U13": 3.80,
    "U14": 3.79,
    "U15": 3.78,
    "U16": 3.77,
    "U17": 3.76,
    "U18": 3.75,
    "U19": 3.74,
    "U20": 3.73,
    "U21": 3.72
}


print(model([test_input]))


