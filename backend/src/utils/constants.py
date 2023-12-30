import pandas as pd

ALLOWED_IMG_TYPE = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"]


PANDAS_READ_METHOD = {
    "text/csv": pd.read_csv,
    "text/tsv": pd.read_csv,
    "text/json": pd.read_json,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": pd.read_excel,
}
