# Honours Project Frontend Interface and Jupyter Notebooks

This repository contains the frontend interface along with the jupyter notebooks used to run all relevant experiments to the Airspeck collected data.

In order to run the experiments, the honours project virtual environment must be activated. Then, if the dependencies are not installed, they must be installed via pip:

```bash
cd ./sources/
pip install -r requirements.txt
```

The notebooks are located in the notebooks folder, and once in the frontend folder, they are activated by running:

```bash
jupyter notebook
```

Then, a local environment on port 8888 should start and the notebooks can be visualised, edited and run. The main notebook containing the <b>results of the final models that are also highlighted in the report are in notebooks/mixed_final_model.ipynb</b>. The notebook should run with no errors unless the data paths are wrong.

In order to run the frontend interface, it must be start by using the server.py file (it is built using flask):

```bash
python server.py
```

I usually run the frontend by default on port 8000. The interface starts with the classifiers menu and datasets are chosen from the database. In order to run the entire tool properly, both the backend server and the frontend must run at the same time.
