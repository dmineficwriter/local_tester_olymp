import os
import sys
import tester
import codecs
from flask import Flask, flash, jsonify, request, render_template, url_for
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'HA$HTY1IKL0M4'

ALLOWED_EXTENSIONS = ['cpp', 'py'] # Only Python and C++ allowed
def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def parse_problem_text(problem_lines, stop_line, i):
  lines_list = []
  while i < len(problem_lines) and problem_lines[i] != stop_line:
    # print(i, problem_lines[i])
    lines_list.append(problem_lines[i])
    i += 1
  return i, lines_list

def parse_problem_examples(problem_lines, stop_lines, i):
  examples_list = []
  INP = 'ввод', 'Ввод', 'Входные данные'
  OUTP = 'вывод', 'Вывод', 'Выходные данные'
  while i < len(problem_lines) and problem_lines[i] not in stop_lines:
    # print(i, len(problem_lines))
    i += 1
    input_data = []
    while i < len(problem_lines) and problem_lines[i] not in OUTP:
      # print('input search', i, len(problem_lines))
      input_data.append(problem_lines[i])
      i += 1
    i += 1
    output_data = []
    # print('now going to out,', i)
    while i < len(problem_lines) and problem_lines[i] not in stop_lines and problem_lines[i] not in INP:
      # print('output search', i, len(problem_lines))
      output_data.append(problem_lines[i])
      i += 1
    examples_list.append([input_data, output_data])
  return i, examples_list

def parse_problem(problem):
  problem_lines = problem.split('\r\n')[:-1]

  problem_parsed = {}
  problem_parsed['problem_name'] = problem_lines[0]

  i = 1
  i, problem_parsed['problem_text'] = parse_problem_text(problem_lines, 'Формат входных данных', i)
  i, problem_parsed['problem_input'] = parse_problem_text(problem_lines, 'Формат выходных данных', i + 1)
  i, problem_parsed['problem_output'] = parse_problem_text(problem_lines, 'Примеры', i + 1)
  i, problem_parsed['problem_examples'] = parse_problem_examples(problem_lines, ('Пояснение', 'Пояснение к примерам', 'Пояснения к примерам'), i + 1)

  if i + 1 < len(problem_lines):
    i, problem_parsed['problem_additional'] = parse_problem_text(problem_lines, ('Пояснение', 'Пояснение к примерам', 'Пояснения к примерам'), i + 1)
  else:
    problem_parsed['problem_additional'] = []

  return problem_parsed

@app.route('/problems/', methods=['GET'])
def get_sections():
  if request.method == 'GET':
    sections = os.listdir('problems/')
    response = jsonify(sections)
    return response
  else:
    return 'unallowed method'

@app.route('/problems/<section_id>/', methods=['GET'])
def get_problems(section_id):
  if request.method == 'GET':
    problems = os.listdir(f'problems/{section_id}/')
    response = jsonify(problems)
    return response
  else:
    return 'unallowed method'

@app.route('/problems/<section_id>/<problem_id>', methods=['GET', 'POST'])
def get_solution(section_id, problem_id):
  if request.method == 'POST':
    # print(request.files)
    if 'solution' not in request.files: # If request does not have file
      flash('No file part')
      response = jsonify(message='No file part')
      return response

    file = request.files['solution']
    if file.filename == '': # File not selected and browser sent empty file
      flash('No selected file')
      response = jsonify(message='No selected file')
      return response

    if file and allowed_file(file.filename): # Loading file to dir
      app.config['UPLOAD_FOLDER'] = f'problems/{section_id}/{problem_id}/solutions'
      filename = secure_filename(file.filename)
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

      response = jsonify(tester.test_problem(f'problems/{section_id}/{problem_id}', filename)) # Testing solution
      # print(tester.test_problem(f'problems/{section_id}/{problem_id}', filename), request.method)

      return response

  if request.method == 'GET':
    with codecs.open(f'problems/{section_id}/{problem_id}/{problem_id}.txt', 'r', 'utf_8_sig') as problem:
      problem_text = problem.read()
      response = jsonify(parse_problem(problem_text))
      return response
  return 'here'

app.run(debug=True)
