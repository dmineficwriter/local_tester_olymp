#include <iostream>
#include <cmath>

using namespace std;

int main() {
  long long n, k;
  cin >> n >> k;
  cout << n * 2 * (round(n / k) - 1);
}
