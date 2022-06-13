import os
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
    if code_lang == 'cpp':
      os.chdir(problem + '/solutions')
      print('Компилирование программы...')
      os.system('g++ ' + solution + ' -o ' + solution[:-4])
      os.chdir(ROOT_DIR)
    elif code_lang == 'exe':
      continue

    for i in range(len(tests) // 2):
      output = ''
      output_fixed = output

      if code_lang == 'py':
        output = subprocess.check_output(
          ['python', problem + '/solutions/' + solution],
          stdin=open(problem + '/tests/' + tests[i * 2], 'rb')
        ).decode()
        output_fixed = compare_format(output)
        output = output[:-2]
      elif code_lang == 'cpp':
        # print(os.getcwd())
        output = subprocess.check_output(problem + '/solutions/' + solution[:-4] + '.exe', stdin=open(problem + '/tests/' + tests[i * 2], 'rb')).decode()
        output_fixed = compare_format(output)

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

    print('Завершено тестирование ' + solution + ', пройдено ' + str(count_right) + '/' + str(count_tests) + ' тестов')
    if (len(wrong_tests) > 0):
      print('Неверные тесты: ')
      for wrong in wrong_tests:
        print(wrong, end=', ')
      print('\n\n')

def main():
  problem = input('Какую задачу проверить?\n')
  while problem <= 'Z' and problem >= 'A':
    test_problem(problem)
    problem = input('Еще одну?\n')

main()
os.system('pause')
