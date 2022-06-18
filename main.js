(() => {
  async function getSectionsList() {
    sections = await fetch(`http://127.0.0.1:5000/problems/`, {
      method: 'GET',
      // mode: 'no-cors'
    })
    return sections.json();
  }

  async function getProblemsList(section_id) {
    problems = await fetch(`http://127.0.0.1:5000/problems/${section_id}/`, {
      method: 'GET',
      // mode: 'no-cors'
    })
    return problems.json();
  }

  async function createProblemsList(section_id) {
    let problemsList = document.createElement('ul');
    problemsList.classList.add('problems');
    let problems = await getProblemsList(section_id);

    problems.forEach(problem => {
      let problemsListElement = document.createElement('li');
      problemsListElement.classList.add('problems__element');

      let problemsListElementLink = document.createElement('a');
      problemsListElementLink.href = `problem.html?section=${section_id}&problem=${problem}`

      problemsListElementLink.textContent = problem;
      problemsListElement.append(problemsListElementLink);

      problemsList.append(problemsListElement);
    });

    return problemsList;
  }

  async function createSectionsList() {
    let sectionsList = document.createElement('div');
    sectionsList.classList.add('sections');
    // sectionsList.id = 'accordion';
    let sections = await getSectionsList();

    // console.log(sections);

    sections.forEach(async section => {
      let sectionsListElement = document.createElement('h2');
      sectionsListElement.classList.add('sections__element')
      sectionsListElement.textContent = section;

      let sectionsListElementProblems = document.createElement('div');

      let sectionsListElementProblemsList = await createProblemsList(section);

      // console.log(sectionsListElementProblemsList);

      sectionsListElementProblemsList.classList.add('sections__element_problems-list');
      sectionsListElementProblems.append(sectionsListElementProblemsList);

      sectionsList.append(sectionsListElement);
      sectionsList.append(sectionsListElementProblems);
    });

    return sectionsList;
  }

  async function createMainPage() {
    let container = document.createElement('div');
    container.classList.add('container');
    document.body.append(container);

    let sectionsList = await createSectionsList();
    container.append(sectionsList);
  }

  createMainPage();
})();
