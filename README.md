\# Activity 2: Uploading a KNIME Project to GitHub



This repository contains the official submission for \*\*Activity 2\*\* in \*\*CS0065 (Intelligent Systems)\*\*. The project implements an end-to-end machine learning workflow using KNIME Analytics Platform to predict and classify student academic risk levels based on performance metrics.



\---



\## 📁 Repository Structure



```text

Aflleje-IanaKim-CS0065-AN42/

├── README.md

└── Activity 2/

&#x20;   ├── KNIME\_aflleje.knwf

&#x20;   ├── student\_performance\_knime.csv

&#x20;   ├── Aflleje\_IanaKim\_KNIME\_GitHub\_Evidence.pdf

&#x20;   └── README.md

📄 Submitted Files \& Contents

**KNIME\_aflleje.knwf**: Exported KNIME workflow encompassing data ingestion, preprocessing, dataset partitioning, model training, prediction, and scoring.

**student\_performance\_knime.csv**: Source dataset containing academic attributes used for model training and evaluation.

**Aflleje\_IanaKim\_KNIME\_GitHub\_Evidence.pdf**: Step-by-step verification PDF containing execution screenshots, Git configuration, terminal history, and GitHub upload proof.

**README.md**: Project documentation, repository structure, and run instructions.



⚙️ Machine Learning Pipeline \& Algorithms

The workflow preprocesses the input dataset and evaluates three distinct classification algorithms to determine student risk status:



**Decision Tree Classifier**: Evaluates rule-based splitting on student performance metrics.

**Logistic Regression**: Performs baseline probabilistic risk classification.

**Random Forest Classifier**: Utilizes ensemble learning for improved prediction accuracy.

Evaluation metrics (Accuracy, Confusion Matrix, Precision, and Recall) are generated using KNIME Scorer nodes.



📝 Activity Summary

**Workflow Export**: Developed, executed, and exported the pipeline as a .knwf file in KNIME Analytics Platform.

**Local Repository Setup**: Organized the project files locally and created comprehensive project documentation.

**Git \& GitHub Integration**: Initialized version control, configured local Git parameters, staged commits, and pushed the submission to GitHub.

**Subfolder Organization**: Structured files inside the required Activity 2 directory for clean repository management.



🚀 How to Run the Workflow

1\. Download or clone this repository to your machine.

2\. Open KNIME Analytics Platform.

3\. Navigate to File > Import KNIME Workflow... and select KNIME\_aflleje.knwf.

4\. Double-click the CSV Reader node and locate student\_performance\_knime.csv.

5\. Execute all nodes (Shift + F7).

6.Open the Scorer nodes to inspect evaluation results and performance matrices.



👤 Author \& Course Details

Student Name: Iana Kim Aflleje

Course \& Section: CS0065 - AN42

Instructor: Ma'am Crisola

Repository Link: https://github.com/iana-09/Aflleje-IanaKim-CS0065-AN42

