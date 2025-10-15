# Python Environment Setup

This project requires several Python libraries including **scikit-learn**, **NumPy**, **pandas**, and **Matplotlib**.  
Because many Linux and WSL systems manage Python externally (PEP 668), it’s recommended to install all dependencies inside a **virtual environment**.

---

## 🧰 Prerequisites

Make sure you have Python 3.12+ installed.  
Then install the `venv` package if it’s not already available:

```bash
sudo apt install python3-venv -y
```

---

## 🧱 Create and Activate a Virtual Environment

In your project directory:

```bash
python3 -m venv venv
```

Activate the environment:

- **Linux / macOS / WSL:**
  ```bash
  source venv/bin/activate
  ```

- **Windows (PowerShell):**
  ```powershell
  venv\Scripts\activate
  ```

You’ll know it’s active when your terminal prompt shows `(venv)`.

---

## 📦 Install Dependencies

Once the environment is activated, install the required libraries:

```bash
pip install scikit-learn numpy pandas matplotlib
```

---

## ✅ Verify Installation

Run the following command to confirm everything is installed correctly:

```bash
python -c 'import sklearn, numpy, pandas, matplotlib; print("All packages installed successfully!")'
```

---

## ⚙️ Optional: System-Wide Installation (Not Recommended)

If you must install packages globally (not advised), use the following:

```bash
pip install scikit-learn numpy pandas matplotlib --break-system-packages
```

> ⚠️ **Warning:** This may break system-managed Python installations.  
> Use a virtual environment whenever possible.

---

## 🚀 Ready to Go!

Your environment is now ready.  
You can start developing your project and import your libraries as usual:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
```

---