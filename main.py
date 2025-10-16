import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_absolute_error


def model():
    df = pd.read_excel("./PulseBat Dataset.xlsx", sheet_name="SOC ALL")

    features = [f"U{i}" for i in range(1,22)] # only need the cells as features

    x = df[features]
    y = df["SOH"]

    xTrain, xTest, yTrain, yTest = train_test_split(x,y, test_size=0.2, random_state=21) #random state is arbitrary, but should be placed for the same results

    model = LinearRegression()
    model.fit(xTrain, yTrain)

    yPred = model.predict(xTest)
    r2 = r2_score(yTest, yPred)
    mae = mean_absolute_error(yTest, yPred)

    print(f"R^2 score: {r2}")
    print(f"mae: {mae}")

    results = pd.DataFrame({
        "True SOH": yTest.values,
        "Predicted SOH": yPred,
        "Healthy": yPred >= 0.85
    })
    
    pd.set_option('display.max_columns', None)  
    pd.set_option('display.max_rows', None)
    print(results)


model()


