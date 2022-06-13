import os
import subprocess
import time

# def compare_format(output):
#     formatted = []
#     return formatted

delay = 0.3

solutions = os.listdir('solutions/')

for solution in solutions:
  with open('test result_' + solution[:-2] + '.txt', 'w') as test_result:
    tests = os.listdir('tests/')
    count_right = 0
    count_tests = len(tests) // 2

    for i in range(len(tests) // 2):
      output = subprocess.check_output(
        ['python', 'solutions/' + solution],
        stdin=open('tests/' + tests[i * 2], 'rb')
      ).decode()

      with open('tests/' + tests[i * 2 + 1], 'rb') as ans_file:
        ans = ans_file.read().decode()[:-1]
        print(str(i + 1) + ': ' + output[:-2], end='')
        time.sleep(delay)
        if (output[:-2] == ans):
          print('    ...OK\n')
          count_right += 1
        else:
          print('    ...WA\n')

    print('Завершено тестирование ' + solution + ', пройдено ' + str(count_right) + '/' + str(count_tests) + ' тестов' + '\n\n\n')

os.system('pause')

