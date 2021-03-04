;(function(){
    'use strict'

    const itemInput =document.querySelector("#item-input");
    const todoAddForm= document.querySelector("#todo-add");
    const ul = document.querySelector("#todo-list");
    const lis = ul.getElementsByTagName("li");


    //extrutura de dados que vai armazenar objectos
    //cada objecto desse representa cada tarefa

     let arrTasks = getSavedData()

    // function addEventLi(li) {
    //     li.addEventListener("click", function () {
    //         console.log(this)
    //     })
    // }

    function getSavedData() {
        let tasksData = localStorage.getItem("tasks");
        tasksData = JSON.parse(tasksData);

        return  tasksData && tasksData.length ? tasksData : [
            {
                name: "task 1",
                createAt: Date.now(),
                completed: true
            },
            {
                name: "task 2",
                createAt: Date.now(),
                completed: false
            }
        ]


    }

    function setNewData() {
        localStorage.setItem("tasks", JSON.stringify(arrTasks))
    }

    setNewData()

   // funcao responsavel por fazer criaçao de lis
   //recebe um objecto que é o objecto dentro da array e retorna uma li preparada para depois incluir na ul
    function generateLiTask(obj){
        
        const li = document.createElement("li");
        const p = document.createElement("p");
        const checkButton = document.createElement("button");
        const editButton =document.createElement("i");
        const deleteButton = document.createElement("i");

        // li que contem todo o  conjunto de elementos posteriores
        li.className ="todo-item";
       
        //botao check complete li
        checkButton.className ="button-check";
        checkButton.innerHTML =`
        <i class="fas fa-check ${obj.completed ? "" : "displayNone"}" data-action ="checkButton"></i>`
        checkButton.setAttribute("data-action", "checkButton");
        li.appendChild(checkButton);

        //paragrafo da li que contem o nome da task
        p.className = "task-name";
        p.textContent = obj.name;
        li.appendChild(p);
        
        //botão do lapis para mostrar o container de edição
        editButton.classList="fas fa-edit";
        editButton.setAttribute("data-action", "editButton"),
        li.appendChild(editButton);

        //container da edição da li
        const containerEdit = document.createElement("div");
        containerEdit.className = "editContainer";

        //input de edição do nome da li
        const inputEdit  = document.createElement("input");
        inputEdit.setAttribute("type", "text");
        inputEdit.className = "editInput";
        inputEdit.value = obj.name;
       
        
        containerEdit.appendChild(inputEdit);
        
        //botão edit  do noem da li
        const containerEditButton = document.createElement("button");
        containerEditButton.className ="editButton";
        containerEditButton.setAttribute("data-action","containerEditButton");
        containerEditButton.textContent = "Edit";
        containerEdit.appendChild(containerEditButton);

        //botao delete do container de edição da li
        const containerCancelButton = document.createElement("button");
        containerCancelButton.className = "cancelButton";
        containerCancelButton.setAttribute("data-action", "containerCancelButton");
        containerCancelButton.textContent = "Cancel";
        containerEdit.appendChild(containerCancelButton);

        li.appendChild(containerEdit);

        //botao trash para apagar li
        deleteButton.classList ="fas fa-trash-alt";
        deleteButton.setAttribute("data-action", "deleteButton");
        li.appendChild(deleteButton);

        //addEventLi(li)
        return li
    }

    //funcao responsavel por buscar os dados à array de objectos/tasks e para cada objecto renderiza uma li desse objecto
    //limpa primeiro a ul e renderiza na tela a li 
    function renderTasks(){
        ul.innerHTML = "";
        arrTasks.forEach(task=> {
           ul.appendChild(generateLiTask(task))
        });
        
    }

    renderTasks()

    // funcao responsavel por adicionar objecto /task nova para a array de objectos acima
    function addTask(task){
        
        arrTasks.push({
            name: task,
            createAt: Date.now(),
            completed: false
        }) 

        setNewData()
        
    }

    function clickedUl(e){
        
        const dataAction = e.target.getAttribute("data-action");
        
        if(!dataAction)return;

        let currentLi = e.target;
        while(currentLi.nodeName !== "LI"){
            currentLi = currentLi.parentElement;
        }

        const currentLiIndex = [...lis].indexOf(currentLi);
        

        const actions ={
             editButton: function(){
                    const editContainer = currentLi.querySelector(".editContainer");
                    
                    //isto serve para remover todos os atributos inline style porque se n remover vai sempre mostrar
                    //ao mesmo tempo varios edits containers e so queremos um edito container da li clicada
                    // e os demais apagados
                    [...ul.querySelectorAll(".editContainer")].forEach( container =>{
                        container.removeAttribute("style");
                    });
                    
                    //mostra o editContainer
                    editContainer.style.display ="flex";
                    
                    editContainer.querySelector(".editInput").focus();

             },
             deleteButton: function(){
                    arrTasks.splice(currentLiIndex, 1);
                    //3 maneiras de remover a Li
                    renderTasks();
                    // currentLi.remove();
                    //currentLi.parentElement.removeChild(currentLi);
                     setNewData()
             },
             containerEditButton : function(){
                    //recuperar o valor do input to editContainer da li clicada
                    const val = currentLi.querySelector(".editInput").value;
                    
                    //recuperar o indice do objecto que corresponde à  li clicada e adicionar o valor novo à propriedade nome desse objecto
                    arrTasks[currentLiIndex].name = val;
                   
                    renderTasks();
                    setNewData()

                   
             },
             containerCancelButton: function(){
                    currentLi.querySelector(".editContainer").removeAttribute("style");
                    currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name;
             },
             checkButton: function(){
                    arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed

                   /*  if(arrTasks[currentLiIndex].completed){
                        currentLi.querySelector(".fa-check").classList.remove("displayNone");
                    }else{
                        currentLi.querySelector(".fa-check").classList.add("displayNone");
                    } */

                     setNewData()
                    renderTasks();
                    console.log(arrTasks);
             }
         }


         if(actions[dataAction]){
             actions[dataAction]()
         }


    }

    todoAddForm.addEventListener("submit", function(e){
        e.preventDefault();

        // chama a funcao que faz push no objecto e actualiza com novos dados do input
        addTask(itemInput.value);
        //renderiza/actualiza acrescentando ua nova li com os novos dados
        renderTasks();

        itemInput.value = " ";
        itemInput.focus();
    });

    
   ul.addEventListener("click", clickedUl);


})()