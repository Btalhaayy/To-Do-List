import React, { useState } from 'react';
import { Calendar, CheckCircle2, Circle, Plus, Trash2, ChevronRight, ChevronLeft, List } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, addDays } from 'date-fns';
import { todoApi } from './api/todoApi';
import { useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: string;
}
interface GroupedTodos {
  [key: string]: Todo[];
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMonthView, setShowMonthView] = useState(false);
  const [showAllDates, setShowAllDates] = useState(true);
  const [showListView, setShowListView] = useState(false);

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const newTodoItem = {
          text: newTodo,
          completed: false,
          date: format(selectedDate, 'yyyy-MM-dd')
        };
        
        console.log('Sending todo:', newTodoItem); // Gönderilen veriyi kontrol edelim
  
        const createdTodo = await todoApi.createTodo(newTodoItem);
        setTodos([...todos, createdTodo]);
        setNewTodo('');
      } catch (error) {
        console.error('Error adding todo:', error);
        // Kullanıcıya hata mesajı gösterebilirsiniz
        alert('Failed to add todo. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await todoApi.getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };
  

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        await todoApi.updateTodo(id, !todo.completed);
        setTodos(
          todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const groupedTodos: GroupedTodos = todos.reduce((acc: GroupedTodos, todo) => {
    if (!acc[todo.date]) {
      acc[todo.date] = [];
    }
    acc[todo.date].push(todo);
    return acc;
  }, {});

  // Get the first day of the month and the start of that week
  const firstDayOfMonth = startOfMonth(selectedDate);
  const startDate = startOfWeek(firstDayOfMonth);
  
  // Generate array for 42 days (6 weeks) starting from the start date
  const calendarDays = Array.from({ length: 42 }, (_, i) => addDays(startDate, i));

  const hasTasksOnDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return todos.some(todo => todo.date === dateStr);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAllDates(false);
    setShowListView(false);
  };

  const filteredGroupedTodos: GroupedTodos = showListView 
    ? groupedTodos 
    : showAllDates
      ? groupedTodos
      : Object.entries(groupedTodos)
          .filter(([date]) => format(new Date(date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
          .reduce((acc, [date, todos]) => ({ ...acc, [date]: todos }), {} as GroupedTodos);

  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#106EBE] to-[#0FFCBE] flex items-center justify-center p-6">
      <div className="flex gap-6 w-full max-w-[1200px] transition-all duration-500 ease-in-out">
        <div className={`bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6 transition-all duration-500 ease-in-out ${
          showMonthView ? 'w-1/2' : 'w-full'
        }`}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#106EBE]">Task Manager</h1>
              <div className="flex gap-4 mt-2">
                {!showAllDates && !showListView && (
                  <button 
                    onClick={() => {
                      setShowAllDates(true);
                      setShowListView(false);
                    }}
                    className="text-sm text-[#106EBE] hover:text-[#106EBE]/80"
                  >
                    Show all dates
                  </button>
                )}
                <button 
                  onClick={() => {
                    setShowListView(!showListView);
                    setShowAllDates(true);
                  }}
                  className="flex items-center gap-2 text-sm text-[#106EBE] hover:text-[#106EBE]/80"
                >
                  <List size={16} />
                  {showListView ? 'Hide list view' : 'Show list view'}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {showListView && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total tasks: {totalTasks}</p>
                  <p className="text-sm text-gray-600">Completed: {completedTasks}</p>
                </div>
              )}
              <button
                onClick={() => setShowMonthView(!showMonthView)}
                className="p-2 rounded-lg bg-[#106EBE] text-white hover:bg-[#106EBE]/80 transition-colors"
              >
                {showMonthView ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#106EBE]"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="p-2 rounded-lg bg-[#0FFCBE] text-[#106EBE] hover:bg-[#0FFCBE]/80 transition-colors"
            >
              <Calendar size={24} />
            </button>
            <button
              onClick={addTodo}
              className="px-4 py-2 rounded-lg bg-[#106EBE] text-white hover:bg-[#106EBE]/80 transition-colors flex items-center gap-2"
            >
              <Plus size={20} /> Add Task
            </button>
          </div>

          {showCalendar && (
            <div className="mb-6">
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#106EBE]"
              />
            </div>
          )}

          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-300px)]">
            {Object.entries(filteredGroupedTodos)
              .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
              .map(([date, todosForDate]) => (
                <div key={date} className="bg-white/50 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-[#106EBE] mb-3">
                    {format(new Date(date), 'MMMM d, yyyy')}
                  </h2>
                  <ul className="space-y-2">
                    {todosForDate.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors"
                      >
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="text-[#106EBE] hover:text-[#106EBE]/80 transition-colors"
                        >
                          {todo.completed ? (
                            <CheckCircle2 size={24} />
                          ) : (
                            <Circle size={24} />
                          )}
                        </button>
                        <span
                          className={`flex-1 ${
                            todo.completed ? 'line-through text-gray-500' : ''
                          }`}
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>

        {showMonthView && (
          <div className="w-1/2 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-[#106EBE] mb-6">
              {format(selectedDate, 'MMMM yyyy')}
            </h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-[#106EBE]">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const hasTask = hasTasksOnDate(day);
                const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center
                      ${!isCurrentMonth ? 'text-gray-400' : ''}
                      ${hasTask ? 'bg-[#0FFCBE]/20 border-2 border-[#0FFCBE]' : 'hover:bg-gray-100'}
                      ${isToday(day) ? 'bg-[#106EBE] text-white' : ''}
                      ${isSameDay(day, selectedDate) ? 'ring-2 ring-[#106EBE]' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;