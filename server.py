import os
import tester
from flask import Flask, flash, jsonify, redirect, request, render_template, url_for
from werkzeug.utils import secure_filename
server = Flask(__name__)
server.config['SECRET_KEY'] = 'HA$HTY1IKL0M4'

ALLOWED_EXTENSIONS = ['cpp', 'py'] # Only Python and C++ allowed
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@server.route('/problems/<section_id>/<problem_id>', methods=['GET', 'POST'])
def get_solution(section_id, problem_id):
  if request.method == 'POST':
    if 'solution' not in request.files: # If request does not have file
      flash('No file part')
      # return redirect(request.url)
      return 'No file part'

    file = request.files['solution']
    if file.filename == '': # File not selected and browser sent empty file
      flash('No selected file')
      # return redirect(request.url)
      return 'No selected file'

    if file and allowed_file(file.filename):
      server.config['UPLOAD_FOLDER'] = 'problems/' + section_id + '/' + problem_id + '/solutions'
      filename = secure_filename(file.filename)
      file.save(os.path.join(server.config['UPLOAD_FOLDER'], filename))
      # return redirect(url_for('get_solution', name=filename, section_id=section_id, problem_id=problem_id))
      return 'OK'
  return 'here ' + request.method + ' ' + section_id + ' ' + problem_id

server.run(debug=True)
