import todoController from "./todoController.js";
import menu from "./menu.js";
import mainPage from "./mainPage.js";

const domController = ((todoCtrl, menuMod, mainDom) => {

  const _toggleHiddenAttribute = (element) => {
    if (element.hasAttribute("style")) {
      element.removeAttribute("style");
    } else {
      element.style.display = 'none';
    }
  };

  const _deleteElement = (ele) => {
    ele.parentElement.removeChild(ele);
  };


  const _closePreviousMiniForm = () => {
    const previousMiniForm = document.querySelector('.project-form-container');
    if (previousMiniForm) {
      const previousProjectContainer = previousMiniForm.previousElementSibling;
      if (previousProjectContainer) {
        _toggleHiddenAttribute(previousProjectContainer);
        _deleteElement(previousMiniForm);
      } else {
        _toggleHiddenAttribute(document.querySelector('.create-project-btn'));
        _deleteElement(previousMiniForm);
      }
    }
  };


  const _processProjectForm = () => {
    const projectFormContainer = document.querySelector('.project-form-container');
    const inputContainer = projectFormContainer.querySelector('.input-container');
    const projectInputTitle = projectFormContainer.querySelector('input');
    const previousError = projectFormContainer.querySelector('.error-message');

    if (projectInputTitle.value.trim().length !== 0) {
      if (previousError) {
        _deleteElement(previousError);
      }

      if (projectFormContainer.hasAttribute('projectid')) {
        //Save Edit
        const projectId = projectFormContainer.getAttribute('projectid');
        todoController.editProject(projectId, projectInputTitle.value);

      } else {
        todoController.createProject(projectInputTitle.value);
        _toggleHiddenAttribute(document.querySelector('.create-project-btn'));
      }
      menuMod.loadProjectsContent();

    } else {
      if (!previousError) {
        const errorMessage = document.createElement('p');
        inputContainer.append(errorMessage);

        errorMessage.textContent = 'You need to enter the project title.';
        errorMessage.classList.add('error-message');
      }
    }
  };

  const _createEmptyModal = () => {
    const body = document.querySelector('body');
    const modal = document.createElement('div');
    const modalContent = document.createElement('div');
    body.append(modal);
    modal.append(modalContent);

    modal.classList.add('modal');
    modalContent.classList.add('modal-content');
  };

  const _confirmDeleteModal = (itemContainer, item) => {
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const projectId = itemContainer.getAttribute('projectid');
    const modalMessage = document.createElement('p');
    const btnGroup = document.createElement('div');
    const confirmDeleteBtn = document.createElement('button');
    const cancelDeleteBtn = document.createElement('button');
    modalContent.append(modalMessage, btnGroup);
    btnGroup.append(confirmDeleteBtn, cancelDeleteBtn);

    modalMessage.textContent = `Are you sure you want to delete this ${item}?`;
    confirmDeleteBtn.textContent = 'Delete';
    cancelDeleteBtn.textContent = 'Cancel';
    modalMessage.classList.add('modal-message');
    btnGroup.classList.add('btn-container');
    confirmDeleteBtn.classList.add('confirm-delete', 'btn');
    cancelDeleteBtn.classList.add('cancel-delete', 'btn');
    confirmDeleteBtn.type = 'button';
    cancelDeleteBtn.type = 'button';

    confirmDeleteBtn.onclick = () => {
      if (item === 'project') {
        todoCtrl.deleteProject(projectId);
        mainDom.show();
      } else {
        const todoId = itemContainer.getAttribute('todoid');
        todoCtrl.deleteTodo(projectId, todoId);
      }
      _deleteElement(itemContainer);
      _deleteElement(modal);
    };
    cancelDeleteBtn.onclick = () => {
      _deleteElement(modal);
    };
  };

  const _setCollapsibleInputValue = (element) => {
    const collapsibleInput = element.closest('.collapsible-container').querySelector('input');
    collapsibleInput.value = element.textContent;
    if (element.hasAttribute('projectid')) {
      collapsibleInput.setAttribute('projectid', element.getAttribute('projectid'));
    }
  };

  const _checkTodoInputForm = (...inputElements) => {

    //Form validation
    const modalContent = document.querySelector('.modal-content');
    const previousErrorMessage = modalContent.querySelector('.error-message');
    if (previousErrorMessage) {
      _deleteElement(previousErrorMessage);
    }

    for (let i = 0; i < inputElements.length; i++) {
      const element = inputElements[i];

      if (element.value.trim().length === 0) {
        const errorMessage = document.createElement('span');
        const inputLabel = element.previousElementSibling;

        errorMessage.setAttribute('aria-live', 'polite');
        errorMessage.classList.add('error-message');
        element.closest('.input-container').append(errorMessage);

        errorMessage.textContent = `You must enter the ${inputLabel.textContent}.`;
        return false;
      }
    }
    return true;
  };

  const _createCalloutMessage = () => {
    const body = document.querySelector('body');
    const calloutContainer = document.createElement('div');
    const calloutMessage = document.createElement('p');
    const closeBtn = document.createElement('button');
    body.append(calloutContainer);
    calloutContainer.append(calloutMessage, closeBtn);

    closeBtn.type = 'button';
    calloutMessage.textContent = 'Saved!';
    closeBtn.textContent = 'x';

    calloutContainer.classList.add('callout');
    calloutMessage.classList.add('callout-message');
    closeBtn.classList.add('btn');

    closeBtn.onclick = () => {
      calloutContainer.style.display = 'none';
    };

    setTimeout(() => {
      calloutContainer.classList.add('active');
    }, 10);

    setTimeout(() => {
      _deleteElement(calloutContainer);
    }, 5000);
  };

  const _processTodoCreation = () => {
    const modalContent = document.querySelector('.modal-content');
    const form = modalContent.querySelector('form');
    const titleInput = modalContent.querySelector('#todo-title-input');
    const projectInput = modalContent.querySelector('#todo-project-input');
    const selectedProjectId = projectInput.getAttribute('projectid');
    const priorityInput = modalContent.querySelector('#todo-priority-input');
    const dueDateInput = modalContent.querySelector('#todo-duedate-input');
    const descriptionInput = modalContent.querySelector('#todo-description-input');
    const notesInput = modalContent.querySelector('#todo-notes-input');

    const checkResult = _checkTodoInputForm(titleInput, projectInput, priorityInput);
    if (checkResult) {
      if (!form.hasAttribute('projectid')) {
        todoCtrl.createTodo(selectedProjectId, titleInput.value, descriptionInput.value, priorityInput.value, dueDateInput.value, notesInput.value);

      } else {
        const editingTodoProjectId = form.getAttribute('projectid');
        const editingTodoId = form.getAttribute('todoid');
        todoCtrl.editTodo(editingTodoProjectId, editingTodoId, selectedProjectId, titleInput.value, descriptionInput.value, priorityInput.value, dueDateInput.value, notesInput.value);
      }
      mainDom.show();
      _deleteElement(modalContent.parentElement);
      _createCalloutMessage();
    }
  };

  const _checkTodo = (container) => {
    const projectId = container.getAttribute('projectid');
    const todoId = container.getAttribute('todoid');
    todoCtrl.toggleTodoCheck(projectId, todoId);
  };


  const _selectClickListenerTarget = (e) => {
    const eTarget = e.target;
    if (eTarget.closest('.menu-btn.container')) {
      eTarget.closest('.menu-btn.container').classList.toggle('change');
      document.querySelector('.menu-nav').classList.toggle('active');
      document.querySelector('body').classList.toggle('hide-scroll');

    } else if (eTarget.closest('.todo-title')) {
      const todoContainer = eTarget.closest('.todo-container');
      mainDom.toggleTodoContent(todoContainer);

    } else if (eTarget.closest('.create-project-btn')) {
      _toggleHiddenAttribute(eTarget.closest('.create-project-btn'));
      _closePreviousMiniForm();
      mainDom.createProjectMiniForm();

    } else if (eTarget.closest('.edit-project-btn')) {
      _closePreviousMiniForm();
      mainDom.createProjectMiniForm(eTarget.closest('.project-container'));
      _toggleHiddenAttribute(eTarget.closest('.project-container'));

    } else if (eTarget.closest('.save.project.btn')) {
      _processProjectForm();

    } else if (eTarget.closest('.cancel-btn.project')) {
      const createProjectBtn = document.querySelector('.create-project-btn')
      const projectFormContainer = document.querySelector('.project-form-container');
      _toggleHiddenAttribute(createProjectBtn);
      _deleteElement(projectFormContainer);

    } else if (eTarget.closest('.cancel-edit.project.btn')) {
      const projectFormContainer = document.querySelector('.project-form-container');
      _toggleHiddenAttribute(projectFormContainer.previousElementSibling);
      _deleteElement(projectFormContainer);

    } else if (eTarget.closest('.delete-project-btn')) {
      _createEmptyModal();
      _confirmDeleteModal(eTarget.closest('.project-container'), 'project');

    } else if (eTarget.matches('.modal')) {
      _deleteElement(eTarget);

    } else if (eTarget.closest('.new-todo')) {
      _createEmptyModal();
      mainDom.createTodoForm();

    } else if (eTarget.closest('.drop-option')) {
      _setCollapsibleInputValue(eTarget.closest('.drop-option'));
      eTarget.closest('.collapsible-container').classList.remove('active');

    } else if (eTarget.closest('.collapsible-container')) {
      eTarget.closest('.collapsible-container').classList.toggle('active');

    } else if (eTarget.matches('.save.todo.btn')) {
      _processTodoCreation();

    } else if (eTarget.closest('.edit-todo.btn')) {
      _createEmptyModal();
      const todoContainer = eTarget.closest('.todo-container');
      mainDom.createTodoForm(todoContainer);

    } else if (eTarget.closest('.delete-todo.btn')) {
      _createEmptyModal();
      _confirmDeleteModal(eTarget.closest('.todo-container'), 'to-do');

    } else if (eTarget.closest('.show-all.btn')) {
      mainDom.show();

    } else if (eTarget.closest('.show-today.btn')) {
      const todosArray = todoCtrl.consultTodosForTheNextNDays();
      mainDom.show(todosArray);

    } else if (eTarget.closest('.show-next-7-days.btn')) {
      const todosArray = todoCtrl.consultTodosForTheNextNDays(7);
      mainDom.show(todosArray);

    } else if (eTarget.closest('.show-project.btn')) {
      const projectId = eTarget.closest('.project-container').getAttribute('projectid');
      const todosArray = todoCtrl.consultAllTodosFromProject(projectId);
      mainDom.show(todosArray);

    } else if (eTarget.closest('.todo-check')) {
      eTarget.closest('.todo-check').classList.toggle('checked');
      _checkTodo(eTarget.closest('.todo-container'));

    }
  };


  const chargeListeners = () => {
    document.addEventListener('click', _selectClickListenerTarget);

    let prevScrollPos = window.pageYOffset;
    window.onscroll = () => {
      let currentScrollPos = window.pageYOffset;
      if (prevScrollPos > currentScrollPos) {
        document.querySelector('header').classList.remove('hide');
      } else {
        document.querySelector('header').classList.add('hide');
      }
      prevScrollPos = currentScrollPos;
    };
  };

  return { chargeListeners };
})(todoController, menu, mainPage);

export default domController;