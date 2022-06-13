s = int(input())
e = int(input())
n = int(input())
near_s = 10 ** 9
near_e = 10 ** 9
for i in range(n):
    x = int(input())
    if abs(x - s) < abs(near_s - s):
        near_s = x
    if abs(x - e) < abs(near_e - e):
        near_e = x
print(min(abs(s - e), abs(s - near_s) + 1 + abs(near_e - e)))
