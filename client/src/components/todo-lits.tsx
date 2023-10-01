import { CSSProperties, useState } from "react";
import { trpc } from "../utils/trpc";

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#cba471",
  },
  innerContainer: {
    width: "50%",
    height: "50%",
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#ccd8e1",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "12px 20px",
    margin: "8px 0",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "none",
    outline: "none",
  },
  list: {
    listStyleType: "none",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    margin: "8px 0",
    padding: "12px",
    borderRadius: "4px",
    textAlign: "left",
  },
  addButton: {
    padding: 10,
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "10px",
    cursor: "pointer",
    color: "red",
    textAlign: "right",
  },
};

const TodoList = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const todos = trpc.getTodos.useQuery();
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      todos.refetch();
    },
  });
  const deleteTodo = trpc.deleteTodo.useMutation({
    onSettled: () => {
      todos.refetch();
    },
  });

  const handleClickAddTodo = () => {
    addTodo.mutate(inputValue);
    setInputValue("");
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <p style={styles.title}>Todo List</p>
        <input
          type="text"
          placeholder="What needs to be done?"
          style={styles.input}
          value={inputValue}
          onChange={handleInputChange}
        />
        <button style={styles.addButton} onClick={handleClickAddTodo}>
          Add Todo
        </button>
        <ul style={styles.list}>
          {todos.data?.map((todo) => (
            <li style={styles.listItem} key={todo.id}>
              {todo.content}
              <span
                style={styles.deleteButton}
                onClick={() => {
                  deleteTodo.mutate(todo.id);
                }}
              >
                ✖
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
