import os
from re import sub
import subprocess
import time

DELAY = 0.3
ROOT_DIR = os.getcwd()

def compare_format(output):
  formatted = output.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ').split()
  formatted = [x for x in formatted if x]
  return formatted

def check_lang(file):
  file = file.split('.')
  return file[-1]

def test_problem(problem):
  solutions = os.listdir(problem + '/solutions/')
  for solution in solutions:
    # with open('test result_' + solution[:-2] + '.txt', 'w') as test_result:
    tests = os.listdir(problem + '/tests/')
    count_right = 0
    count_tests = len(tests) // 2
    wrong_tests = []

    code_lang = check_lang(solution)
    if code_lang == 'exe':
      continue
    print('Now testing ' + solution)
    if code_lang == 'cpp':
      os.chdir(problem + '/solutions')
      print('Compilating...')
      try:
        subprocess.check_output('g++ ' + solution + ' -o ' + solution[:-4])
      except subprocess.CalledProcessError:
        print('Compilation error\nFinished testing ' + solution + '\n\n')
        os.chdir(ROOT_DIR)
        continue
      os.chdir(ROOT_DIR)

    for i in range(len(tests) // 2):
      output = ''
      output_fixed = output

      if code_lang == 'py':
        try:
          output = subprocess.check_output(
            ['python', problem + '/solutions/' + solution],
            stdin=open(problem + '/tests/' + tests[i * 2], 'rb'),
            timeout=2.0
          ).decode()
          output_fixed = compare_format(output)
          output = output[:-2]
        except subprocess.CalledProcessError:
          print(str(i + 1) + ':    ...RE\n')
          continue
        except subprocess.TimeoutExpired:
          print(str(i + 1) + ':    ...TLE\n')
          continue
      elif code_lang == 'cpp':
        # print(os.getcwd())
        try:
          output = subprocess.check_output(
            problem + '/solutions/' + solution[:-4] + '.exe',
            stdin=open(problem + '/tests/' + tests[i * 2], 'rb',),
            timeout=2.0
          ).decode()
          output_fixed = compare_format(output)
        except subprocess.CalledProcessError:
          print(str(i + 1) + ':    ...RE\n')
          continue
        except subprocess.TimeoutExpired:
          print(str(i + 1) + ':    ...TLE\n')
          continue

      # print(output)
      with open(problem + '/tests/' + tests[i * 2 + 1], 'rb') as ans_file:
        ans = compare_format(ans_file.read().decode())
        print(str(i + 1) + ': ' + output, end='')
        time.sleep(DELAY)
        if (output_fixed == ans):
          print('    ...OK\n')
          count_right += 1
        else:
          wrong_tests.append(i + 1)
          print('    ...WA\n')

    print('Finished testing ' + solution + ', passed ' + str(count_right) + '/' + str(count_tests) + ' tests')
    if (len(wrong_tests) > 0):
      print('Wrong tests: ')
      print(*wrong_tests, sep=', ', end='\n\n')

def main():
  problem = input('Which problem to test?\n')
  while problem <= 'Z' and problem >= 'A':
    test_problem(problem)
    problem = input('More?\n')

main()
os.system('pause')
