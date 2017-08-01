#!/usr/bin/python
import requests
import pandas
import subprocess

evaluators = {
    'image': 'image_evaluate.py',
    'nlp': 'nlp_evaluate.py',
}
test_datasets = {
    'image': 'image_test_dataset.txt',
    'nlp': 'nlp_test_dataset.csv'
}

def score(row):
    if row.challenge in evaluators:
        evaluate = evaluators[row.challenge]
        test_dataset = test_datasets[row.challenge]
    else:
        return '-1.0'
    command = ['python', evaluate, test_dataset, 'uploads/'+row.results]
    result = subprocess.check_output(command)
    return result.splitlines()[0]

def main():
    submissions = requests.get('http://localhost:8082/submissions').json()
    submissions = pandas.DataFrame(submissions)
    submission['score'] = submissions.apply(score, axis=1)
    submissions = submission[['name','time', 'challenge', 'results_original_name', 'score']]
    submissions = submissions.sort_values(by='score', ascending=False)
    submissions.to_html('results.htm', index=False)


if __name__ == '__main__':
    main()
