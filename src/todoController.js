import { format, differenceInCalendarDays } from 'date-fns';

const todoController = ((dateFormat, diffInCalendarDays) => {
  //localStorage.clear();

  const _convertDDObjectToDateObject = (projectsContainer) => {
    for (let i = 0; i < projectsContainer.length; i++) {
      for (let j = 0; j < projectsContainer[i].todoList.length; j++) {
        const element = projectsContainer[i].todoList[j].dueDateObject;
        if (element) {
          projectsContainer[i].todoList[j].dueDateObject = new Date(element);
        }
      }
    }
  };

  let projectArray;
  if (JSON.parse(localStorage.getItem('todo'))) {
    projectArray = JSON.parse(localStorage.getItem('todo'));
    _convertDDObjectToDateObject(projectArray);
  } else {
    projectArray = [];
  }

  const _todoToLocalStorage = () => {
    localStorage.setItem('todo', JSON.stringify(projectArray));
  };

  const _todoFactory = (title, description, priority, dueDate = false, notes = false, id = "0", projectId = '0', check = false) => {
    const dateCreated = dateFormat(new Date(), 'LLL/do/yyyy');
    let dueDateYmd, dueDateObject;
    if (dueDate) {
      dueDateObject = new Date(dueDate);
      dueDate = dateFormat(dueDateObject, 'LLL/do/yyyy');
      dueDateYmd = dateFormat(dueDateObject, 'yyyy-MM-dd');
    }
    return { title, description, dueDateObject, dueDate, dueDateYmd, priority, notes, id, projectId, check, dateCreated };
  };

  const _projectFactory = (title, id = "0") => {
    let todoList = [];
    const dateCreated = dateFormat(new Date(), 'LLL/do/yyyy');
    return { title, id, todoList, dateCreated };
  };

  const consultTodo = (projectId, todoId) => {
    const projectFound = projectArray.find(project => project.id === projectId);
    const todoFound = projectFound.todoList.find(todo => todo.id === todoId);

    return todoFound;
  };

  const consultAll = () => {
    let allContent = [];
    for (let i = 0; i < projectArray.length; i++) {
      allContent.push(projectArray[i]);
    }

    return allContent;
  };

  const consultAllTodos = () => {
    const todoWithoutDDates = [];
    const todoList = [];
    for (let i = 0; i < projectArray.length; i++) {
      for (let j = 0; j < projectArray[i].todoList.length; j++) {
        if (projectArray[i].todoList[j].dueDateObject) {
          todoList.push(projectArray[i].todoList[j]);
        } else {
          todoWithoutDDates.push(projectArray[i].todoList[j]);
        }
      }
    }

    todoList.sort((a, b) => a.dueDateObject - b.dueDateObject);
    todoWithoutDDates.sort((a, b) => a.dateCreated - b.dateCreated);
    for (const todoItem of todoWithoutDDates) {
      todoList.push(todoItem);
    }

    return todoList;
  };

  const consultTodosForTheNextNDays = (numberOfDays = 0) => {
    const allTodos = consultAllTodos();
    const today = new Date();
    const todosForToday = allTodos.filter((todo) => {
      let differenceResult;
      differenceResult = diffInCalendarDays(todo.dueDateObject, today);

      if ((differenceResult <= numberOfDays) && (differenceResult >= 0)) return true;
      return false;
    });

    return todosForToday;
  };

  const consultProjectTitle = (projectId) => {
    const projectFound = projectArray.find(project => project.id === projectId);

    return projectFound.title;
  };

  const consultAllTodosFromProject = (projectId) => {
    const projectFound = projectArray.find(project => project.id === projectId);
    const todoWithoutDDates = [];
    const todoList = [];
    for (const todo of projectFound.todoList) {
      if (todo.dueDateObject) {
        todoList.push(todo);
      } else {
        todoWithoutDDates.push(todo);
      }
    }
    todoList.sort((a, b) => a.dueDateObject - b.dueDateObject);
    todoWithoutDDates.sort((a, b) => a.dateCreated - b.dateCreated);
    for (const todoItem of todoWithoutDDates) {
      todoList.push(todoItem);
    }

    return todoList;
  };

  const createProject = (title) => {
    let highestId = Math.max(...projectArray.map(project => project.id));
    if (highestId === -Infinity) {
      highestId = -1;
    }
    const newId = String(highestId + 1);
    projectArray.push(_projectFactory(title, newId));

    _todoToLocalStorage();
  };

  const editProject = (projectId, title) => {
    const projectIndex = projectArray.findIndex(project => project.id === projectId);
    projectArray[projectIndex].title = title;

    _todoToLocalStorage();
  };

  const deleteProject = (projectId) => {
    const projectIndex = projectArray.findIndex(project => project.id === projectId);
    projectArray.splice(projectIndex, 1);

    _todoToLocalStorage();
  };

  const createTodo = (projectId, title, description, priority, dueDate, notes, check = false) => {
    const projectIndex = projectArray.findIndex(project => project.id === projectId);
    let highestId = Math.max(...projectArray[projectIndex].todoList.map(todo => todo.id));

    if (highestId === -Infinity) {
      highestId = -1;
    }

    const newId = String(highestId + 1);
    projectArray[projectIndex].todoList.push(_todoFactory(title, description, priority, dueDate, notes, newId, projectId, check));

    _todoToLocalStorage();
  };

  const editTodo = (projectId, todoId, selectedProjectId, title, description, priority, dueDate, notes) => {
    const projectIndex = projectArray.findIndex(project => project.id === projectId);
    const todoIndex = projectArray[projectIndex].todoList.findIndex(todo => todo.id === todoId);

    if (!selectedProjectId) {
      projectArray[projectIndex].todoList[todoIndex].title = title;
      projectArray[projectIndex].todoList[todoIndex].description = description;
      projectArray[projectIndex].todoList[todoIndex].priority = priority;
      projectArray[projectIndex].todoList[todoIndex].notes = notes;

      //Due date
      if (dueDate) {
        const dDateArray = dueDate.match(/(\d[\d]*)/g);
        const dueDateReceived = new Date(parseInt(dDateArray[0]), parseInt(dDateArray[1]) - 1, parseInt(dDateArray[2]));
        projectArray[projectIndex].todoList[todoIndex].dueDateYmd = dueDate;
        projectArray[projectIndex].todoList[todoIndex].dueDateObject = dueDateReceived;
        projectArray[projectIndex].todoList[todoIndex].dueDate = dateFormat(new Date(dueDateReceived), 'LLL/do/yyyy');
      } else {
        projectArray[projectIndex].todoList[todoIndex].dueDateYmd = '';
        projectArray[projectIndex].todoList[todoIndex].dueDate = '';
      }
      _todoToLocalStorage();

    } else {
      projectArray[projectIndex].todoList.splice(todoIndex, 1);
      createTodo(selectedProjectId, title, description, priority, dueDate, notes);
    }
  };

  const toggleTodoCheck = (projectId, todoId) => {
    const projectIndex = projectArray.findIndex(project => project.id === projectId);
    const todoIndex = projectArray[projectIndex].todoList.findIndex(todo => todo.id === todoId);

    if (projectArray[projectIndex].todoList[todoIndex].check) {
      projectArray[projectIndex].todoList[todoIndex].check = false;
    } else {
      projectArray[projectIndex].todoList[todoIndex].check = true;
    }
    _todoToLocalStorage();
  };

  const deleteTodo = (projectId, todoId) => {
    const projectIndex = projectArray.findIndex(project => project.id === projectId);
    const todoIndex = projectArray[projectIndex].todoList.findIndex(todo => todo.id === todoId);
    projectArray[projectIndex].todoList.splice(todoIndex, 1);

    _todoToLocalStorage();
  };


  if (!JSON.parse(localStorage.getItem('todo'))) {
    createProject('First Project');
    createProject('Second Project');
    createProject('A long long long long long long long long long long long long long long long long project title');
    createTodo('0', 'Very high priority', '', 'Very High', '2024-05-01', 'None', true);
    createTodo('2', 'High', '', 'High', '2024-08-05', '');
    createTodo('2', 'Medium', '', 'Medium', '2024-08-05', '');
    createTodo('2', 'Low', '', 'Low', '2024-08-05', '');
    createTodo('1', 'Very Low', '', 'Very Low', '', 'None');

    _todoToLocalStorage();
  }

  return { consultTodo, consultAll, consultAllTodos, consultTodosForTheNextNDays, consultProjectTitle, consultAllTodosFromProject, createProject, editProject, deleteProject, createTodo, editTodo, toggleTodoCheck, deleteTodo };
})(format, differenceInCalendarDays);

export default todoController;