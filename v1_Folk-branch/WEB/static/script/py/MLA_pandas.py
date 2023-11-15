import pandas as pd
from sklearn.model_selection import train_test_split

def read_data(file_path):
  _, file_extension = file_path.rsplit('.', 1)
  file_extension = file_extension.lower() # Convert to lowercase for case-insensitivity

  if file_extension == 'csv':
    df = pd.read_csv(file_path)
  elif file_extension in ['xls', 'xlsx']:
    df = pd.read_excel(file_path)
  else:
    raise ValueError(f"Unsupported file type: {file_extension}")
  return df

#Display all the columns
def display_columns_names(x):
  columns_list = x.columns.tolist()
  return columns_list

#Display the Independent and Dependent Columns a=df(dataframe),x=target column name (GETTING TITLE ONLY)
def Ind_Dep_title(a,x):
  X = a.drop(f'{x}', axis=1)
  y = a[f'{x}']
  IndColTitle_list = X.columns.tolist()
  DepColTitle_list = [x]
  return IndColTitle_list, DepColTitle_list

#Display the Independent and Dependent Columns a=df(dataframe),x=target column name
def independent_dependent(a,x):
  X = a.drop(f'{x}', axis=1)
  y = a[f'{x}']
  return X,y

#Performing train test split // ( 0 < test_size <= 1 & 0 < random_state <= 100 ) | test_size - float | random_state - int
def train_test_split1(x,y,test_size,random_state):
  X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=test_size, random_state=random_state)
  return X_train, X_test, y_train, y_test