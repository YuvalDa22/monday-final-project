export function AddTask () {

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          const newTask = event.target.value;
          AddTask(newTask); // TODO: implement this function in actions
        }
      };
    
      return (
        <input
          type="text"
          placeholder="Add task"
          onKeyDown={handleKeyDown}
        />
      );
}
