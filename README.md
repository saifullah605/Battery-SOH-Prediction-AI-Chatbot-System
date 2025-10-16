# Battery SOH Predictor
This project has the goal of predicting the SOH of a battery and telling the user if it is healthy or has a problem using a linear regression model. The user will be able to interact with a chatbot, which will be able to predict SOH/battery health and also anwser important questions about how to keep a battery healthy, hot to recycling them, etc. 

## Linear Regression Model
The linear regression model was created in python using pandas and sklearn. To run the model, start by reading the environmentSetup.md document. After installing all the dependencies and making sure they work, you can now simply run the python script using:


```bash
python main.py
```

The script will take a bit to excecute, but will eventually print the results. At the top, you will see the R^2 result and MAE. The rest is the results of the model, with the true and predicted SOH being displayed.
