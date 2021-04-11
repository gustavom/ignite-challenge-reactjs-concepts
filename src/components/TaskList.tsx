import { useState } from 'react'

import '../styles/tasklist.scss'

import {ErrorBox} from './ErrorBox'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'
import { isCompositeComponent } from 'react-dom/test-utils';


interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskId, setNewTaskId] = useState(0);
  const [showError, setShowError] = useState(false);


  function handleNewTaskId(){
    return setNewTaskId(Math.ceil(Math.random() * 10000)) 
  }

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.
    handleNewTaskId();
    if ( newTaskTitle === ''){
      setShowError(true)
      return;
    }
    setShowError(false)
    setTasks([...tasks, {
      id: newTaskId,
      title: newTaskTitle,
      isComplete: false,
    }])
    // limpando o valor do campo de texto
    setNewTaskTitle('');
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID
    let indexRecord = tasks.findIndex(task => task.id === id);
    let elToUpdate = tasks[tasks.findIndex(task => task.id === id)];

    if(elToUpdate.isComplete === true){
      elToUpdate.isComplete = false;
      tasks.splice(indexRecord,0,elToUpdate);

      const resultArr = tasks.filter((data,index)=>{
        return tasks.indexOf(data) === index;
      })

      setTasks(resultArr);
      return;
    }

    elToUpdate.isComplete = true;
    tasks.splice(indexRecord,0,elToUpdate);

    const resultArr = tasks.filter((data,index)=>{
      return tasks.indexOf(data) === index;
    })

    setTasks(resultArr);

  }

  function handleRemoveTask(id: number) {
    // Remova uma task da listagem pelo ID
    let filteredTasks = tasks.filter(task => task.id !== id) 
    setTasks(filteredTasks)
  }

  return (
    <section className="task-list container">
      { showError ? <ErrorBox/> : ''}
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input 
            className={showError? 'error':''}
            type="text" 
            placeholder="Adicionar novo todo" 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff"/>
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input 
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16}/>
              </button>
            </li>
          ))}
          
        </ul>
      </main>
    </section>
  )
}