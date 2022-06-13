x = int(input())
y = int(input())
n = int(input())

ans = 2 * (n // (x + y))
n %= x + y

if n > 0:
    n -= y
    ans += 1
if n > 0:
    n -= x
    ans += 1

print(ans)
