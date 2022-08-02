import todoController from "./todoController.js";
import plusIcon from "./img/plus-thick.svg";
import pencilIcon from "./img/pencil.svg";
import trashIcon from "./img/delete-outline.svg";

const menu = ((todoCtrl, addIcon, editIcon, deleteIcon) => {

  const loadProjectsContent = () => {
    const projectGroupContainer = document.querySelector('.project-group-container');

    while(projectGroupContainer.firstChild){
      projectGroupContainer.removeChild(projectGroupContainer.lastChild);
    }

    const allProjectsArray = todoCtrl.consultAll();
    for (let i = 0; i < allProjectsArray.length; i++) {
      const projectContainer = document.createElement('div');
      const projectBtn = document.createElement('button');
      const editImg = document.createElement('img');
      const deleteImg = document.createElement('img');
      projectContainer.append(projectBtn, editImg, deleteImg);
      projectGroupContainer.append(projectContainer);

      projectBtn.textContent = allProjectsArray[i].title;
      editImg.src = editIcon;
      deleteImg.src = deleteIcon;
      projectContainer.setAttribute('projectId', allProjectsArray[i].id);
      projectBtn.setAttribute('type', 'button');

      projectContainer.classList.add('project-container');
      projectBtn.classList.add('show-project', 'btn');
      editImg.classList.add('icon-btn', 'edit-project-btn');
      deleteImg.classList.add('icon-btn', 'delete-project-btn');
    }
  };

  const show = () => {
    const body = document.querySelector('body');

    const header = document.createElement('header');
    const menuBtn = document.createElement('div');
    const bar1 = document.createElement('div');
    const bar2 = document.createElement('div');
    const bar3 = document.createElement('div');
    const headTitle = document.createElement('h1');
    const newTodoBtn = document.createElement('button');
    const addImg = document.createElement('img');
    newTodoBtn.type = 'button';
    addImg.src = addIcon;
    headTitle.textContent = 'To-Do';
    newTodoBtn.textContent = 'New Todo';
    menuBtn.classList.add('menu-btn', 'container');
    bar1.classList.add('bar1');
    bar2.classList.add('bar2');
    bar3.classList.add('bar3');
    headTitle.classList.add('head-title');
    newTodoBtn.classList.add('new-todo', 'btn');
    menuBtn.append(bar1, bar2, bar3);
    newTodoBtn.append(addImg);
    header.append(menuBtn, headTitle, newTodoBtn);

    const nav = document.createElement('nav');
    const allTodosBtn = document.createElement('button');
    const todayTodos = document.createElement('button');
    const next7DaysTodos = document.createElement('button');
    const allProjectsTitleContainer = document.createElement('div');
    const allProjectsTitle = document.createElement('p');
    const addProjectBtn = document.createElement('button');
    const btnIcon = document.createElement('img');
    const projectGroupContainer = document.createElement('div');
    allTodosBtn.textContent = 'Show all To-Dos';
    todayTodos.textContent = 'To-Dos For Today';
    next7DaysTodos.textContent = 'To-Dos For The Next Seven Days';
    allProjectsTitle.textContent = 'Projects';
    addProjectBtn.textContent = 'New Project';
    allTodosBtn.setAttribute('type', 'button');
    todayTodos.setAttribute('type', 'button');
    next7DaysTodos.setAttribute('type', 'button');
    nav.classList.add('menu-nav');
    allTodosBtn.classList.add('show-all', 'btn');
    todayTodos.classList.add('show-today', 'btn');
    next7DaysTodos.classList.add('show-next-7-days', 'btn');
    allProjectsTitleContainer.classList.add('all-projects-menu');
    addProjectBtn.classList.add('create-project-btn', 'btn');
    projectGroupContainer.classList.add('project-group-container');
    btnIcon.src = addIcon;
    nav.append(allTodosBtn, todayTodos, next7DaysTodos, allProjectsTitleContainer, projectGroupContainer);
    allProjectsTitleContainer.append(allProjectsTitle, addProjectBtn)
    addProjectBtn.append(btnIcon);

    body.append(header, nav);

    loadProjectsContent();
  };


  return {show, loadProjectsContent};
})(todoController, plusIcon, pencilIcon, trashIcon);

export default menu;