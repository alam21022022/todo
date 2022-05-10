// const url = "http://localhost:3000/lists";
const url = "https://s-todo-app-a.herokuapp.com/lists";
showLists();
let editURL;

///////////////////////////////////////////////////////////////
//////////////////////CONSTENTS////////////////////////////////
const constents = {
  edit__task: "Edit Task",
  add__task: "Add Task",
  required__filels: "Please fill in all the required fields",
  delete__message: "Task Deleted Successfully",
  completed: "Marked as Completed",
  uncomplete: "Marked as UnCompleted",
  edit_success: "Task Updated Successfully",
  add__success: "Task Added Successfully ",
  edit_err: "Error In Update",
  dubp: "Task already Exist",
  no_data: "No Data Found Please Add Task",
};

///////////////////////////////////////////////////////////////
///////////////////// GET DOM ELEM/////////////////////////////

const listSectionElem = document.querySelector(".list__section");
const titleElem = document.querySelector(".title");
const bodyElem = document.querySelector(".body");
const addTaskBtn = document.querySelector(".add__task__btn");
const addTaskBtnElem = document.querySelector(".addTaskBtn");
const addBtnModel = document.querySelector(".button");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeBtnModel = document.querySelector(".closeBtn");
const closeToast = document.querySelector(".closeBtn");
const animationElem = document.querySelector(".animation");
const animationFElem = document.querySelector(".animation_f");
const animationBoxElem = document.querySelector(".animation__box");
const toastContentElem = document.querySelector(".toast__content");
const meetingTime = document.getElementById("meeting_time");
const ttt = document.querySelector(".ttt");
const allFilterElem = document.getElementById("all_f");
const completedFilterElem = document.getElementById("com_f");
const pendingFilterElem = document.getElementById("pen_f");
const nonCompFilterElem = document.getElementById("non_c_f");
const search = document.getElementById("search");
const loading = document.getElementById("loading");
const errSection = document.querySelector(".err__section");
const titlefiled = document.querySelector(".tfr");
const descriptionfield = document.querySelector(".tdr");
const datetimefiled = document.querySelector(".dtr");
const inputElem = document.querySelectorAll("input");

/////////////////////////////////////////////////////
/////////////////// MODEL Section //////////////////

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  addTaskBtn.textContent = constents.add__task;
  titleElem.value = "";
  bodyElem.value = "";
  meetingTime.value = "";
};
addBtnModel.addEventListener("click", openModal);
closeBtnModel.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

///////////////////////////////////////////////////////
////////////////// Toasts Section//////////////////////
closeToast.addEventListener("click", () => {
  animationElem.classList.remove("temp");
});

closeToast.addEventListener("click", () => {
  animationFElem.classList.remove("temp");
  document.querySelector(".animation__box__filter").style.zIndex = -1;
});

ttt.addEventListener("click", () => {
  animationFElem.classList.add("temp");
  document.querySelector(".animation__box__filter").style.zIndex = 40;
});
function showToast(color, content) {
  animationElem.classList.add("temp");
  animationElem.style.backgroundColor = `${color}`;
  toastContentElem.textContent = `${content}`;
  setTimeout(() => {
    animationElem.classList.remove("temp");
  }, 3000);
}

//////////////////////////////////////////////////
///////////Set Min Calender Date/////////////
const today = new Date().toISOString().split(".");
document.getElementsByName("txtDate")[0].setAttribute("min", today[0]);

////////////////////////////////////////////////////
////////////Filters/////////////////////////////////

//////////// ALL DATA FIlter //////////////////////////////

function template(data) {
  let html = "";
  loading.classList.remove("hidden");
  if (data.length === 0) {
    errSection.innerHTML = `<h1 class="n_d"> ${constents.no_data} </h1>`;
    listSectionElem.innerHTML = "";
  } else {
    errSection.innerHTML = ``;
    data?.forEach((elem) => {
      const { title, body, id, dt, check } = elem;
      html += listLayout(title, body, id, dt, check);
    });
    listSectionElem.innerHTML = html;
  }
  loading.classList.add("hidden");
}

allFilterElem.addEventListener("click", async () => {
  allFilterElem.classList.add("fc");
  completedFilterElem.classList.remove("fc");
  pendingFilterElem.classList.remove("fc");
  nonCompFilterElem.classList.remove("fc");

  const data = await getToDoLists(url);
  template(data);
});

//////////////completed Task //////////////////
completedFilterElem.addEventListener("click", async () => {
  allFilterElem.classList.remove("fc");
  completedFilterElem.classList.add("fc");
  pendingFilterElem.classList.remove("fc");
  nonCompFilterElem.classList.remove("fc");

  const data = await getToDoLists(url);
  let filterData = data?.filter((elem) => {
    return elem.check === "true";
  });
  template(filterData);
});

////////////////Pending State////////////////
pendingFilterElem.addEventListener("click", async () => {
  allFilterElem.classList.remove("fc");
  completedFilterElem.classList.remove("fc");
  pendingFilterElem.classList.add("fc");
  nonCompFilterElem.classList.remove("fc");
  const data = await getToDoLists(url);
  let filterData = data?.filter((elem) => {
    return (
      new Date(elem?.dt).getTime() < new Date().getTime() &&
      elem.check !== "true"
    );
  });
  template(filterData);
});

/////////////Not Complete Filter Task///////////////
nonCompFilterElem.addEventListener("click", async () => {
  allFilterElem.classList.remove("fc");
  completedFilterElem.classList.remove("fc");
  pendingFilterElem.classList.remove("fc");
  nonCompFilterElem.classList.add("fc");
  const data = await getToDoLists(url);
  let filterData = data?.filter((elem) => {
    return (
      elem.check === "false" &&
      new Date(elem?.dt).getTime() > new Date().getTime()
    );
  });
  template(filterData);
  // nonCompFilterElem.classList.add("fc");
});

///////////////////////////////////////////////////
///////////////SEARCH FILTERS//////////////////////

search.addEventListener("keyup", async () => {
  const data = await getToDoLists(url);
  let filter = data?.filter((elem) => {
    return elem.title.toLowerCase().match(search.value.toLowerCase());
  });
  template(filter);
});

///////////////////////////////////////////////////
////////////Functions to get TODO Lists////////////
// GET DATA
async function getToDoLists(url) {
  let res = await fetch(url);
  if (res.ok) {
    return res.json();
  } else {
    showToast("#f9062d", err.message);
  }
}
// REQ DATA AND PASS TO UI TEMPLATE
async function showLists() {
  try {
    let data = await getToDoLists(url);
    template(data);
  } catch (err) {
    showToast("#f9062d", err.message);
  }
}

// Fuctions to ADD__&&__EDIT
addTaskBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const title = titleElem.value.toLowerCase();
  const body = bodyElem.value.toLowerCase();
  const dt = meetingTime.value;
  // input box validation
  !title && titlefiled.classList.remove("hidden");
  !body && descriptionfield.classList.remove("hidden");
  !dt && datetimefiled.classList.remove("hidden");

  if (title && body && dt) {
    let res;
    // for editing data
    if (addTaskBtn.textContent === constents.edit__task) {
      res = editURL && (await editTaskApi(editURL, { title, body, dt }));
      if (res.ok) {
        addTaskBtn.textContent = constents.add__task;
        closeModal();
      } else {
        showToast("#f5e90c", constents.dubp);
      }
    }
    // for adding data
    else {
      let data = await getToDoLists(url);
      let filter = data.filter((elem) => elem.title === title);
      if (!filter.length) {
        await addListItem({ title, body, dt, check: "false" }, url);
      } else {
        showToast("#f5e90c", constents.dubp);
      }
    }
    showLists();
  }
  addTaskBtn.textContent = constents.add__task;
  animationBoxElem.style.zIndex = 10;
});

//////////////////////////////////////////////////////////////////
//////////// EVENT Handler For Edit delete Check Icons//////////
listSectionElem.addEventListener("click", async (e) => {
  let clickedBtn = e.target.closest(".list__nav");
  if (!clickedBtn) {
    return;
  }
  //functionalities for delete icon
  if (clickedBtn.id === "task__delete") {
    let elem = clickedBtn.closest(".list__container");
    let id = Number(clickedBtn.getAttribute("data_id"));
    let res = await deleteTask(id, url, elem);
  }
  //functionalities for edit icon
  if (clickedBtn.id === "task__edit") {
    openModal();
    let id = Number(clickedBtn.getAttribute("data_id"));
    await editTask(id, url);
  }
  //functionalities for task done icon
  if (clickedBtn.id === "task__done") {
    let id = Number(clickedBtn.getAttribute("data_id"));
    let taskUrl = `${url}/${id}`;
    let res = await fetch(taskUrl);
    let data = await res.json();
    const { check } = data;
    await taskDone(check, taskUrl);
    showLists();
  }
});

//Functions to check task
async function taskDone(check, url) {
  if (check === "false") {
    let res = await editTaskApi(url, {
      check: "true",
    });
    res.ok && showToast("#2fc125", constents.completed);
  }
  if (check === "true") {
    let res = await editTaskApi(url, {
      check: "false",
    });
    res.ok && showToast("#2fc125", constents.uncomplete);
  }
}
//////////// Edit Req UTILS///////////
/////////////////////////////////////////
async function editTask(id, url) {
  let res = await fetch(`${url}/${id}`);
  let data = await res.json();
  const { title, body, dt } = data;
  titleElem.value = title;
  bodyElem.value = body;
  meetingTime.value = dt;
  editURL = `${url}/${id}`;
  addTaskBtn.textContent = constents.edit__task;
}

// Delete Req UTILS
async function deleteTask(id, url, elem) {
  try {
    let res = await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      elem.classList.add("drop_effect");
      showToast("#f9062d", constents.delete__message);
      setTimeout(() => {
        showLists();
      }, 1000);
    }
    // res.ok && showLists();
  } catch (err) {
    showLists("#f9062d", `${err.message}`);
  }
}

// Edit UTILS
async function editTaskApi(url, data) {
  try {
    let response = await fetch(url, {
      method: "PATCH",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      showToast("#32d919", constents.edit_success);
      closeModal();
    } else {
      showToast("#f9062d", constents.edit_err);
    }
    return response;
  } catch (err) {
    showToast("#f9062d", err.message);
  } finally {
    titleElem.value = "";
    bodyElem.value = "";
  }
}

// Post Req UTILS
async function addListItem(data, url) {
  try {
    let response = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      showToast("#32d919", constents.add__success);
      closeModal();
      console.log(meetingTime.value);
    }
    return response;
  } catch (err) {
    showToast("#f9062d", err.message);
  } finally {
    titleElem.value = "";
    bodyElem.value = "";
  }
}
// LIST ITEM TEMPLATE
function listLayout(title, body, id, dt, check) {
  let futureDate = new Date(dt);
  let result = moment(futureDate).format("llll");
  let pending = new Date(dt).getTime() < new Date().getTime();
  return `
    <div class="list__container ${
      check === "true" ? "success_c" : pending ? "success_p" : ""
    }">
        <div class="list__content">
        <span >${
          check === "true"
            ? "Completed"
            : pending
            ? "Pending"
            : "Complete Before"
        } <strong class="str">${result}</strong> </span> <h3 class="transfor" >${title}</h3>
            <p>
            ${body}
            </p>
        </div>
        <div class="list__nav__container ${
          check === "true" ? "color_c" : pending ? "p_c" : ""
        }">
        <div id="task__done" data_id = "${id}" class="list__nav">
        <i class="fa fa-check"></i>
        </div>
        <div id="task__edit" data_id = "${id}" class="list__nav model">
        <i class="fa fa-edit"></i>
        </div>
        <div id="task__delete" data_id = "${id}" class="list__nav">
        <i class="fa fa-trash"></i>
        </div>
    </div>
    </div>
`;
}
// to remove filed validation
inputElem?.forEach((elem) => {
  elem.addEventListener("keyup", (e) => {
    titlefiled.classList.add("hidden");
    descriptionfield.classList.add("hidden");
    datetimefiled.classList.add("hidden");
  });
});
