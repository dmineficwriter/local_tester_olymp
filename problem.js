(() => {
  async function getProblem(section_id, problem_id) {
    problem = await fetch(`http://127.0.0.1:5000/problems/${section_id}/${problem_id}`, {
      method: 'GET',
      // mode: 'no-cors'
    })
    return problem.json();
  }

  function createProblemHeader(headerLVL, headerClass, headerText) {
    problemHeader = document.createElement(headerLVL);
    problemHeader.classList.add(headerClass);
    problemHeader.textContent = headerText;
    return problemHeader;
  }

  async function createProblemText(problemText) {
    let problemTextWrapper = document.createElement('div');

    for (let i = 0; i < problemText.length; i++) {
      let problemTextLine = document.createElement('p');
      problemTextLine.classList.add('problem__text-par');
      problemTextLine.textContent = problemText[i];

      problemTextWrapper.append(problemTextLine);
    }

    return problemTextWrapper;
  }

  async function createProblemExamples(problemExamples) {
    let problemExamplesTable = document.createElement('table');
    let problemExamplesTableHead = document.createElement('thead');
    let problemExamplesTableBody = document.createElement('tbody');

    problemExamplesTable.classList.add('problem__examples');
    problemExamplesTableHead.classList.add('problem__examples-header');
    problemExamplesTableBody.classList.add('problem__examples-body');

    let problemExamplesTableHeadInput = document.createElement('th');
    let problemExamplesTableHeadOutput = document.createElement('th');

    problemExamplesTableHeadInput.classList.add('problem__examples-header_text');
    problemExamplesTableHeadOutput.classList.add('problem__examples-header_text');

    problemExamplesTableHeadInput.textContent = 'ввод';
    problemExamplesTableHeadOutput.textContent = 'вывод';

    problemExamplesTableHead.append(problemExamplesTableHeadInput);
    problemExamplesTableHead.append(problemExamplesTableHeadOutput);

    for (let i = 0; i < problemExamples.length; i++) {
      let problemExamplesTableBodyLine = document.createElement('tr');
      let problemExamplesTableBodyInput = document.createElement('td');
      let problemExamplesTableBodyOutput = document.createElement('td');

      problemExamplesTableBodyLine.classList.add('problem__examples-line');
      problemExamplesTableBodyInput.classList.add('problem__examples-elem');
      problemExamplesTableBodyOutput.classList.add('problem__examples-elem');

      let problemExampleInputText = '', problemExampleOutputText = '';

      // console.log(problemExamples);

      for (let j = 0; j < problemExamples[i][0].length; j++) {
        problemExampleInputText += problemExamples[i][0][j] + '\n';
      }
      for (let j = 0; j < problemExamples[i][1].length; j++) {
        problemExampleOutputText += problemExamples[i][1][j] + '\n';
      }

      problemExamplesTableBodyInput.textContent = problemExampleInputText;
      problemExamplesTableBodyOutput.textContent = problemExampleOutputText;

      problemExamplesTableBodyLine.append(problemExamplesTableBodyInput);
      problemExamplesTableBodyLine.append(problemExamplesTableBodyOutput);

      problemExamplesTableBody.append(problemExamplesTableBodyLine);

      // console.log(problemExamplesTableBody);
    }

    problemExamplesTable.append(problemExamplesTableHead);
    problemExamplesTable.append(problemExamplesTableBody);

    return problemExamplesTable;
  }

  async function createProblem(section_id, problem_id) {
    problemData = await getProblem(section_id, problem_id);

    let problem = document.createElement('div');

    let problemAdditionalHeader = document.createElement('h2');

    problemAdditionalHeader.classList.add('problem__secheader');

    problemAdditionalHeader.textContent = 'Пояснение';

    // console.log(problemData.problem_additional);

    problem.classList.add('problem__wrapper');

    problem.append(createProblemHeader('h1', 'problem__header', problemData.problem_name));
    problem.append(await createProblemText(problemData.problem_text));
    problem.append(createProblemHeader('h2', 'problem__secheader', 'Формат входных данных'));
    problem.append(await createProblemText(problemData.problem_input));
    problem.append(createProblemHeader('h2', 'problem__secheader', 'Формат выходных данных'));
    problem.append(await createProblemText(problemData.problem_output));
    problem.append(createProblemHeader('h2', 'problem__secheader', 'Примеры'));
    problem.append(await createProblemExamples(problemData.problem_examples));

    if (problemData.problem_additional.length > 0) {
      problem.append(createProblemHeader('h2', 'problem__secheader', 'Пояснение'));
      problem.append(await createProblemText(problemData.problem_additional));
    }

    return problem;
  }

  async function getTestResult(file, section_id, problem_id) {
    let solution = new FormData();
    solution.append('solution', file);
    solution.append('name', file.name);

    // console.log(file, section_id, problem_id);
    response = await fetch(`http://127.0.0.1:5000/problems/${section_id}/${problem_id}`, {
      method: 'POST',
      body: solution,
    });
    return response.json();
  }

  function createTableResult(testResult, passed) {
    let testResultWrapper = document.createElement('div');
    testResultWrapper.classList.add('test-result');

    let testNumberPassed = document.createElement('h3');
    testNumberPassed.classList.add('test-result__passed');
    testNumberPassed.textContent = 'Пройдено тестов: ' + String(passed);

    let testResultTable = document.createElement('table');
    let testResultTableHead = document.createElement('thead');
    let testResultTableBody = document.createElement('tbody');

    testResultTable.classList.add('test-result__table');
    testResultTableHead.classList.add('test-result__table-header');
    testResultTableBody.classList.add('test-result__table-body');

    let testResultTableHeadTestNo = document.createElement('th');
    let testResultTableHeadResult = document.createElement('th');

    testResultTableHeadTestNo.classList.add('test-result__table-header_text');
    testResultTableHeadResult.classList.add('test-result__table-header_text');

    testResultTableHeadTestNo.textContent = 'Номер теста';
    testResultTableHeadResult.textContent = 'Результат';

    testResultTableHead.append(testResultTableHeadTestNo);
    testResultTableHead.append(testResultTableHeadResult);

    // console.log(testResult);
    for (let i = 0; i < testResult.length; i++) {
      let testResultTableBodyLine = document.createElement('tr');
      let testResultTableBodyTestNo = document.createElement('td');
      let testResultTableBodyResult = document.createElement('td');

      testResultTableBodyLine.classList.add('test-result__table-line');
      testResultTableBodyTestNo.classList.add('test-result__table-elem');
      testResultTableBodyResult.classList.add('test-result__table-elem');

      // let problemExampleInputText = '', problemExampleOutputText = '';

      testResultTableBodyTestNo.textContent = String(i + 1);
      testResultTableBodyResult.textContent = testResult[i];

      testResultTableBodyLine.append(testResultTableBodyTestNo);
      testResultTableBodyLine.append(testResultTableBodyResult);

      testResultTableBody.append(testResultTableBodyLine);
      console.log(testResultTableBodyLine);
    }

    testResultTable.append(testResultTableHead);
    testResultTable.append(testResultTableBody);

    testResultWrapper.append(testNumberPassed);
    testResultWrapper.append(testResultTable);

    return testResultWrapper;
  }

  async function createSendForm(container, section_id, problem_id) {
    let problemSendForm = document.createElement('form');
    let problemLoadFile = document.createElement('input');
    let problemSendBtn = document.createElement('button');

    problemSendForm.classList.add('problem__submit');
    problemLoadFile.classList.add('problem__submit_file');
    problemSendBtn.classList.add('problem__submit_button', 'button-reset');

    problemLoadFile.type = 'file';
    problemLoadFile.name = 'solution';
    problemSendBtn.textContent = 'Отправить решение';

    problemSendForm.append(problemLoadFile);
    problemSendForm.append(problemSendBtn);

    problemSendBtn.addEventListener('click', async e => {
      e.preventDefault();
      if (problemLoadFile.files.length == 0) {
        alert('choose a file');
      }
      else {
        // console.log(section_id, problem_id);
        testResult = await getTestResult(problemLoadFile.files[0], section_id, problem_id);
        // console.log(testResult, testResult[0], testResult[1]);
        container.append(createTableResult(testResult[0], testResult[1]));
      }
    });

    return problemSendForm;
  }

  async function createProblemPage(section_id, problem_id) {
    let container = document.createElement('div');
    container.classList.add('container');
    document.body.append(container);

    let problem = await createProblem(section_id, problem_id);
    container.append(problem);

    let problemSendForm = await createSendForm(container, section_id, problem_id);
    container.append(problemSendForm);
  }

  let section_id = (new URLSearchParams(window.location.search)).get('section');
  let problem_id = (new URLSearchParams(window.location.search)).get('problem');
  console.log(section_id, problem_id);
  createProblemPage(section_id, problem_id);
})();
