(() => {
  async function getProblem(section_id, problem_id) {
    console.log('i am in getProblem');
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
      for (let j = 0; j < problemExamples[i][0].length; j++) {
        problemExampleInputText += problemExamples[i][0][j];
        if (j < problemExamples[0].length - 1)
          problemExampleInputText += '\n';
      }
      for (let j = 0; j < problemExamples[i][1].length; j++) {
        problemExampleOutputText += problemExamples[i][1][j];
        if (j < problemExamples[1].length - 1)
          problemExampleOutputText += '\n';
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

    let abortController = new AbortController();
    window.onbeforeunload = () => {
      abortController.abort();
    };

    response = await fetch(`http://127.0.0.1:5000/problems/${section_id}/${problem_id}`, {
      method: 'POST',
      body: solution,
      signal : abortController.signal
    });
    return response.json();
  }

  async function createSendForm(section_id, problem_id) {
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

    problemSendForm.onsubmit = 'return false';

    problemSendForm.addEventListener('submit', async e => {
      e.preventDefault();
    });

    problemSendBtn.addEventListener('click', async e => {
      e.preventDefault();
      if (problemLoadFile.files.length == 0) {
        alert('choose a file');
      }
      else {
        testResult = await getTestResult(problemLoadFile.files[0], section_id, problem_id);
        console.log(testResult);
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

    let problemSendForm = await createSendForm(section_id, problem_id);
    container.append(problemSendForm);
  }

  createProblemPage('problem_set_day_1', 'A');
})();
