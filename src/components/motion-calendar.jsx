import React, { useState, useCallback } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Card, CardContent } from "./ui/card"
import { PlusCircle, Circle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Set up the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

// Priority colors
const priorityColors = {
  low: 'bg-green-200',
  medium: 'bg-yellow-200',
  high: 'bg-red-200'
}

export default function Component() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium'
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectSlot = useCallback((slotInfo) => {
    setNewTask({
      title: '',
      priority: 'medium',
      start: slotInfo.start,
      end: slotInfo.end
    })
    setIsDialogOpen(true)
  }, [])

  const handleCreateTask = useCallback(() => {
    if (newTask.title && newTask.start && newTask.end && newTask.priority) {
      const task = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTask.title,
        start: newTask.start,
        end: newTask.end,
        priority: newTask.priority
      }
      setTasks(prevTasks => [...prevTasks, task])
      setIsDialogOpen(false)
      setNewTask({ title: '', priority: 'medium' })
    }
  }, [newTask])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const updatedTasks = Array.from(tasks)
    const [reorderedTask] = updatedTasks.splice(result.source.index, 1)
    updatedTasks.splice(result.destination.index, 0, reorderedTask)

    // Resolve conflicts
    const resolvedTasks = resolveConflicts(updatedTasks)
    setTasks(resolvedTasks)
  }

  const resolveConflicts = (tasksToResolve) => {
    const sortedTasks = tasksToResolve.sort((a, b) => a.start.getTime() - b.start.getTime())
    const resolvedTasks = []

    sortedTasks.forEach(task => {
      const lastTask = resolvedTasks[resolvedTasks.length - 1]
      if (lastTask && task.start < lastTask.end) {
        if (getPriorityValue(task.priority) > getPriorityValue(lastTask.priority)) {
          // Current task has higher priority, move it before the last task
          const lastTaskDuration = lastTask.end.getTime() - lastTask.start.getTime()
          lastTask.start = new Date(task.end.getTime())
          lastTask.end = new Date(lastTask.start.getTime() + lastTaskDuration)
          resolvedTasks.push(task)
        } else {
          // Current task has lower or equal priority, move it after the last task
          task.start = new Date(lastTask.end.getTime())
          task.end = new Date(task.start.getTime() + (task.end.getTime() - task.start.getTime()))
        }
      }
      resolvedTasks.push(task)
    })

    return resolvedTasks
  }

  const getPriorityValue = (priority) => {
    switch (priority) {
      case 'high': return 3
      case 'medium': return 2
      case 'low': return 1
      default: return 0
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Motion Calendar Clone</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          <div className="w-3/4">
            <Calendar
              localizer={localizer}
              events={tasks}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              selectable
              onSelectSlot={handleSelectSlot}
              eventPropGetter={(event) => ({
                className: priorityColors[event.priority]
              })}
            />
          </div>
          <Droppable droppableId="taskList">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-1/4 bg-gray-100 p-4 rounded-lg"
              >
                <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2"
                      >
                        <CardContent className="p-2">
                          <div className={`flex items-center ${priorityColors[task.priority]} rounded p-2`}>
                            {task.priority === 'low' && <Circle className="mr-2 h-4 w-4" />}
                            {task.priority === 'medium' && <ArrowUpCircle className="mr-2 h-4 w-4" />}
                            {task.priority === 'high' && <ArrowDownCircle className="mr-2 h-4 w-4" />}
                            <span>{task.title}</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4"  style={{ border: '2px solid red', padding: '10px', zIndex: 9999 }}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                id="priority"
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                className="col-span-3"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreateTask}>Create Task</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
