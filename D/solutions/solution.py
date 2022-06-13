n = int(input())
d = int(input())
ans = 1
i = 1
while i <= n and i <= ans:
    a = int(input())
    ans = max(ans, i + a // d)
    i += 1
print(min(n, ans))
