import todoController from "./todoController.js";
import pencilIcon from "./img/pencil.svg";
import trashIcon from "./img/delete-outline.svg";


const mainPage = ((todoCtrl, editIcon, deleteIcon) => {

  const _deleteElement = (ele) => {
    ele.parentElement.removeChild(ele);
  };

  const show = (todosArray = false) => {
    if (!todosArray) {
      todosArray = todoCtrl.consultAllTodos();
    }
    const previousMain = document.querySelector('main');
    if (previousMain) {
      _deleteElement(previousMain);
    }
    const body = document.querySelector('body');
    const main = document.createElement('main');
    body.append(main);

    for (const todoList of todosArray) {

      const todoContainer = document.createElement('div');
      const titleContainer = document.createElement('div');
      const todoCheck = document.createElement('div');
      const todoTitle = document.createElement('p');
      const todoTitleString = document.createElement('span');
      const todoDueDate = document.createElement('span');
      titleContainer.append(todoCheck, todoTitle)
      todoContainer.append(titleContainer);
      main.append(todoContainer);

      todoTitleString.textContent = todoList.title;
      todoTitle.append(todoTitleString, todoDueDate);
      todoDueDate.textContent = todoList.dueDate || '';

      const priorityWithoutSpace = todoList.priority.replaceAll(' ', '');
      const priorityFirstLetterToLower = priorityWithoutSpace.replace(priorityWithoutSpace[0], priorityWithoutSpace[0].toLowerCase());

      todoContainer.setAttribute('projectId', todoList.projectId);
      todoContainer.setAttribute('todoId', todoList.id);
      todoContainer.classList.add('todo-container', priorityFirstLetterToLower);
      titleContainer.classList.add('todo-title-container');
      todoCheck.classList.add('todo-check');
      todoTitle.classList.add('todo-title');
      todoTitleString.classList.add('todo-title-string');
      todoDueDate.classList.add('todo-due-date');

      if (todoList.check) todoCheck.classList.add('checked');
    }
  };



  const _deleteExistingTodoContent = (todoContainer = false) => {
    const todoContentList = document.querySelectorAll('.todo-content');
    for (const todoContent of todoContentList) {
      if (todoContainer !== todoContent.parentElement) {
        todoContent.parentElement.removeChild(todoContent);
      }
    }
  };

  const _addClassName = (classN, ...elements) => {
    for (const ele of elements) {
      ele.classList.add(classN);
    }
  };

  const _addTypeN = (typeN, ...elements) => {
    for (const ele of elements) {
      ele.type = typeN;
    }
  };


  const toggleTodoContent = (todoContainer) => {

    const firstTodoContent = todoContainer.querySelector('.todo-content');

    if (!firstTodoContent) {
      _deleteExistingTodoContent(todoContainer);

      const projectId = todoContainer.getAttribute('projectId');
      const todoId = todoContainer.getAttribute('todoId');

      const todoItem = todoCtrl.consultTodo(projectId, todoId);
      const projectTitle = todoCtrl.consultProjectTitle(projectId);

      const todoContent = document.createElement('div');

      const titleContainer = document.createElement('div');
      const todoTitleLabel = document.createElement('span');
      const todoTitle = document.createElement('span');
      titleContainer.append(todoTitleLabel, todoTitle);

      const dateCreatedContainer = document.createElement('p');
      const dateCreatedLabel = document.createElement('span');
      const dateCreated = document.createElement('span');
      dateCreatedContainer.append(dateCreatedLabel, dateCreated);

      const todoProjectContainer = document.createElement('p');
      const todoProjectLabel = document.createElement('span');
      const todoProject = document.createElement('span');
      todoProjectContainer.append(todoProjectLabel, todoProject);

      const descriptionContainer = document.createElement('p');
      const descriptionLabel = document.createElement('span');
      const description = document.createElement('span');
      descriptionContainer.append(descriptionLabel, description);

      const priorityContainer = document.createElement('p');
      const priorityLabel = document.createElement('span');
      const priority = document.createElement('span');
      priorityContainer.append(priorityLabel, priority);

      const notesContainer = document.createElement('p');
      const notesLabel = document.createElement('span');
      const notes = document.createElement('span');
      notesContainer.append(notesLabel, notes);

      const btnGroup = document.createElement('div');
      const editBtn = document.createElement('button');
      const deleteBtn = document.createElement('button');
      const editImg = document.createElement('img');
      const deleteImg = document.createElement('img');
      btnGroup.append(editBtn, deleteBtn);
      editBtn.append(editImg);
      deleteBtn.append(deleteImg);

      todoContainer.append(todoContent);
      todoContent.append(titleContainer, dateCreatedContainer, todoProjectContainer, descriptionContainer, priorityContainer, notesContainer, btnGroup);


      //dateCreated
      todoTitleLabel.textContent = 'Title';
      todoTitle.textContent = todoItem.title;
      dateCreatedLabel.textContent = 'Modification Date';
      dateCreated.textContent = todoItem.dateCreated;
      todoProjectLabel.textContent = 'Project';
      todoProject.textContent = projectTitle;
      if (todoItem.description) {
        descriptionLabel.textContent = 'Description';
        description.textContent = todoItem.description;
        descriptionContainer.classList.add('todo-detail-container');
      }else{
        descriptionContainer.style.display = 'none';
      }
      priorityLabel.textContent = 'Priority';
      priority.textContent = todoItem.priority;
      if (todoItem.notes) {
        notesLabel.textContent = 'Notes';
        notes.textContent = todoItem.notes;
        notesContainer.classList.add('todo-detail-container');
      }else{
        notesContainer.style.display = 'none';
      }
      editBtn.insertBefore(document.createTextNode('Edit'), editImg);
      deleteBtn.insertBefore(document.createTextNode('Delete'), deleteImg);
      editImg.src = editIcon;
      deleteImg.src = deleteIcon;
      editBtn.type = 'button';
      deleteBtn.type = 'button';

      todoContent.classList.add('todo-content');
      _addClassName('todo-detail-label', todoTitleLabel, dateCreatedLabel, todoProjectLabel, descriptionLabel, priorityLabel, notesLabel);
      _addClassName('todo-detail-container', titleContainer, dateCreatedContainer, todoProjectContainer, priorityContainer);
      btnGroup.classList.add('btn-container');
      editBtn.classList.add('edit-todo', 'btn');
      deleteBtn.classList.add('delete-todo', 'btn');
      editImg.classList.add('icon');
      deleteImg.classList.add('icon');
    } else {
      _deleteExistingTodoContent();
    }
  };

  const createProjectMiniForm = (projectContainer = false) => {

    const projectGroupContainer = document.querySelector('.project-group-container');

    const miniFormContainer = document.createElement('div');
    const titleContainer = document.createElement('div');
    const projectFormTitleLabel = document.createElement('label');
    const projectFormTitle = document.createElement('input');
    const btnContainer = document.createElement('div');
    const saveProjectFormBtn = document.createElement('button');
    const cancelProjectFormBtn = document.createElement('button');
    titleContainer.append(projectFormTitleLabel, projectFormTitle);
    btnContainer.append(saveProjectFormBtn, cancelProjectFormBtn);
    miniFormContainer.append(titleContainer, btnContainer);

    projectFormTitle.type = 'text';
    saveProjectFormBtn.type = 'button';
    cancelProjectFormBtn.type = 'button';
    projectFormTitleLabel.textContent = 'Project Title';
    saveProjectFormBtn.textContent = 'Save';
    cancelProjectFormBtn.textContent = 'Cancel';

    projectFormTitleLabel.htmlFor = 'project-title-input';
    projectFormTitle.id = 'project-title-input'

    miniFormContainer.classList.add('project-form-container');
    titleContainer.classList.add('input-container');
    btnContainer.classList.add('btn-container');
    saveProjectFormBtn.classList.add('save', 'project', 'btn');
    cancelProjectFormBtn.classList.add('project', 'btn');

    if (!projectContainer) {
      projectGroupContainer.insertBefore(miniFormContainer, projectGroupContainer.firstElementChild);
      cancelProjectFormBtn.classList.add('cancel-btn');

    } else {
      const projectTitleToEdit = projectContainer.querySelector('.show-project.btn').textContent;
      projectContainer.after(miniFormContainer);

      miniFormContainer.setAttribute('projectId', projectContainer.getAttribute('projectId'));
      projectFormTitle.value = projectTitleToEdit;
      cancelProjectFormBtn.classList.add('cancel-edit');
    }
  };

  const createTodoForm = (todoContainer = false) => {

    const modalContent = document.querySelector('.modal-content');
    const form = document.createElement('form');

    const titleContainer = document.createElement('div');
    const todoTitleLabel = document.createElement('label');
    const todoTitleInput = document.createElement('input');
    titleContainer.append(todoTitleLabel, todoTitleInput);

    const todoProjectContainer = document.createElement('div');
    const todoProjectInputContainer = document.createElement('div');
    const todoProjectLabel = document.createElement('label');
    const todoProjectInput = document.createElement('input');
    const todoProjectOptionsContainer = document.createElement('div');
    todoProjectContainer.append(todoProjectInputContainer, todoProjectOptionsContainer);
    todoProjectInputContainer.append(todoProjectLabel, todoProjectInput);

    const allProjectsArray = todoCtrl.consultAll();
    for (let i = 0; i < allProjectsArray.length; i++) {
      const projectTitle = allProjectsArray[i].title;
      const projectId = allProjectsArray[i].id;
      const todoProjectOption = document.createElement('p');
      todoProjectOptionsContainer.append(todoProjectOption);
      todoProjectOption.textContent = projectTitle;

      todoProjectOption.setAttribute('projectid', projectId);
      todoProjectOption.classList.add('drop-option');
    }

    const priorityContainer = document.createElement('div');
    const priorityInputContainer = document.createElement('div');
    const priorityLabel = document.createElement('label');
    const priorityInput = document.createElement('input');
    const priorityOptionsContainer = document.createElement('div');
    const priorVH = document.createElement('p');
    const priorH = document.createElement('p');
    const priorM = document.createElement('p');
    const priorL = document.createElement('p');
    const priorVL = document.createElement('p');
    priorityContainer.append(priorityInputContainer, priorityOptionsContainer);
    priorityInputContainer.append(priorityLabel, priorityInput);
    priorityOptionsContainer.append(priorVH, priorH, priorM, priorL, priorVL);

    const dueDateContainer = document.createElement('div');
    const dueDateLabel = document.createElement('label');
    const dueDateInput = document.createElement('input');
    dueDateContainer.append(dueDateLabel, dueDateInput);

    const descriptionContainer = document.createElement('div');
    const todoDescriptionLabel = document.createElement('label');
    const todoDescriptionInput = document.createElement('textarea');
    descriptionContainer.append(todoDescriptionLabel, todoDescriptionInput);

    const notesContainer = document.createElement('div');
    const notesLabel = document.createElement('label');
    const notesInput = document.createElement('textarea');
    notesContainer.append(notesLabel, notesInput);

    const btnGroug = document.createElement('div');
    const saveBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');
    btnGroug.append(saveBtn, cancelBtn);

    modalContent.append(form);
    form.append(titleContainer, todoProjectContainer, priorityContainer, dueDateContainer, descriptionContainer, notesContainer, btnGroug);

    todoTitleLabel.textContent = 'Title *';
    todoProjectLabel.textContent = 'Project *';
    priorityLabel.textContent = 'Priority *';
    dueDateLabel.textContent = 'Due Date';
    priorVH.textContent = 'Very High';
    priorH.textContent = 'High';
    priorM.textContent = 'Medium';
    priorL.textContent = 'Low';
    priorVL.textContent = 'Very Low';
    todoDescriptionLabel.textContent = 'Description';
    notesLabel.textContent = 'Notes';
    saveBtn.textContent = 'Save';
    cancelBtn.textContent = 'Cancel';

    todoTitleLabel.title = 'This field is mandatory';
    todoProjectLabel.title = 'This field is mandatory';
    priorityLabel.title = 'This field is mandatory';
    todoTitleLabel.htmlFor = 'todo-title-input';
    todoProjectLabel.htmlFor = 'todo-project-input';
    priorityLabel.htmlFor = 'todo-priority-input';
    dueDateLabel.htmlFor = 'todo-duedate-input';
    todoDescriptionLabel.htmlFor = 'todo-description-input';
    notesLabel.htmlFor = 'todo-notes-input';
    todoTitleInput.id = 'todo-title-input';
    todoProjectInput.id = 'todo-project-input';
    priorityInput.id = 'todo-priority-input';
    dueDateInput.id = 'todo-duedate-input';
    todoDescriptionInput.id = 'todo-description-input';
    notesInput.id = 'todo-notes-input';
    saveBtn.type = 'button';
    cancelBtn.type = 'button';
    todoProjectInput.tabIndex = '1';
    priorityInput.tabIndex = '2';
    dueDateInput.tabIndex = '3';

    form.setAttribute('action', '#');
    form.setAttribute('novalidate', '');
    _addTypeN('text', todoTitleInput, todoProjectInput, priorityInput);
    dueDateInput.type = 'date';
    todoProjectInput.setAttribute('required', '');
    priorityInput.setAttribute('required', '');
    todoProjectInput.onkeydown = (e) => {
      e.preventDefault();
    };
    priorityInput.onkeydown = (e) => {
      e.preventDefault();
    };
    form.classList.add('modal-form');
    _addClassName('collapsible-container', todoProjectContainer, priorityContainer);
    _addClassName('input-container', titleContainer, todoProjectInputContainer, priorityInputContainer, dueDateContainer, descriptionContainer, notesContainer);
    _addClassName('options-container', todoProjectOptionsContainer, priorityOptionsContainer);
    _addClassName('input-label', todoTitleLabel, todoProjectLabel, priorityLabel, dueDateLabel, todoDescriptionLabel, notesLabel);
    _addClassName('drop-option', priorVH, priorH, priorM, priorL, priorVL);
    btnGroug.classList.add('btn-container');
    saveBtn.classList.add('save', 'todo', 'btn');
    cancelBtn.classList.add('cancel-btn', 'btn');

    const modal = document.querySelector('.modal');
    cancelBtn.onclick = () => {
      _deleteElement(modal);
    };

    //Editing todo
    if (todoContainer) {
      const editingTodoProjectId = todoContainer.getAttribute('projectid');
      const editingTodoId = todoContainer.getAttribute('todoid')
      form.setAttribute('projectid', editingTodoProjectId);
      form.setAttribute('todoid', editingTodoId);

      const consultedTodo = todoCtrl.consultTodo(editingTodoProjectId, editingTodoId);
      todoTitleInput.value = consultedTodo.title;
      todoProjectInput.value = todoCtrl.consultProjectTitle(editingTodoProjectId);
      priorityInput.value = consultedTodo.priority;
      dueDateInput.value = consultedTodo.dueDateYmd;
      todoDescriptionInput.textContent = consultedTodo.description;
      notesInput.textContent = consultedTodo.notes;
    }

  };

  return { show, toggleTodoContent, createProjectMiniForm, createTodoForm };
})(todoController, pencilIcon, trashIcon);

export default mainPage;