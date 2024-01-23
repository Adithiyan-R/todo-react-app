import { atom, selector } from "recoil"

export const todoState = atom({
    key : 'todoState',
    default : []
})

export const logState = atom({
    key : 'logState',
    default : false
})

export const usernameState = atom({
    key : 'usernameState',
    default : ""
})

export const nameState = atom({
    key : 'nameState',
    default : ""
})

export const passwordState = atom({
    key : 'passowrdState',
    default : ""
})

export const filterAtom = atom({
    key : 'filterAtom',
    default : ""
})

export const filterSelector = selector({
    key : 'filterSelector',
    get : ({get}) =>{
        const filter = get(filterAtom);
        const todos = get(todoState);

        if(filter=="")
        {
            return todos;
        }

        var filteredTodos = [];

        for(let i=0;i<todos.length;i++)
        {
            if(todos[i].task==filter)
            {
                filteredTodos.push(todos[i]);
            }
        }

        return filteredTodos;
    }
})

export const toggleAtom = atom({
    key : 'toggleAtom',
    default : false
})



