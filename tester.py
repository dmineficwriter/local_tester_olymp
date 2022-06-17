import os
import subprocess

ROOT_DIR = os.getcwd()

def compare_format(output): # Fixing spaces and stuff to correctly compare outputs
  formatted = output.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ').split()
  formatted = [x for x in formatted if x]
  return formatted

def check_lang(file): # Recognizing lang of the solution
  file = file.split('.')
  return file[-1]

def test_problem(problem, solution):
  testing_result = {}
  tests = os.listdir(problem + '/tests/')
  count_right = 0
  count_tests = len(tests) // 2

  code_lang = check_lang(solution)
  if code_lang == 'cpp': # Compiling .cpp solution
    os.chdir(problem + '/solutions')
    try:
      subprocess.check_output('g++ ' + solution + ' -o ' + solution[:-4])
    except subprocess.CalledProcessError: # Catching compilation error
      os.chdir(ROOT_DIR)
      testing_result['1'] = 'CE'
      return testing_result
    os.chdir(ROOT_DIR)

  for i in range(count_tests):
    output = ''
    output_fixed = output

    if code_lang == 'py': # Compiling .py solution
      try:
        output = subprocess.check_output(
          ['python', problem + '/solutions/' + solution],
          stdin=open(problem + '/tests/' + tests[i * 2], 'rb'),
          timeout=2.0
        ).decode()
        output_fixed = compare_format(output)
        output = output[:-2]
      except subprocess.CalledProcessError: # Catching runtime
        testing_result[str(i + 1)] = 'RE'
        continue
      except subprocess.TimeoutExpired: # Catching TLE
        testing_result[str(i + 1)] = 'TLE'
        continue

    elif code_lang == 'cpp': # Compiling .cpp solution
      try:
        output = subprocess.check_output(
          problem + '/solutions/' + solution[:-4] + '.exe',
          stdin=open(problem + '/tests/' + tests[i * 2], 'rb',),
          timeout=2.0
        ).decode()
        output_fixed = compare_format(output)
      except subprocess.CalledProcessError: # Catching runtime
        testing_result[str(i + 1)] = 'RE'
        continue
      except subprocess.TimeoutExpired: # Catching TLE
        testing_result[str(i + 1)] = 'TLE'
        continue

    with open(problem + '/tests/' + tests[i * 2 + 1], 'rb') as ans_file: # Comparing to correct answer
      ans = compare_format(ans_file.read().decode())
      if (output_fixed == ans):
        testing_result[str(i + 1)] = 'OK'
        count_right += 1
      else:
        testing_result[str(i + 1)] = 'WA'

  return testing_result, count_right
