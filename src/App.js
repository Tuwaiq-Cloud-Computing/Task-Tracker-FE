import React, { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  IconButton,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';
import Swal from 'sweetalert2';
import DarkModeSwitch from './ColorModeSwitcher';
import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function App() {
  /* Put the URL for the backend servers load balancer */

  axios.defaults.baseURL = 'http://BACKEND-SERVERS-LOAD-BALANCER:3001';

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [updateFlag, setUpdateFlag] = useState(false);

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  // useeffect to get data from my api using axios
  useEffect(() => {
    const fetchData = () => {
      axios.get('/api/tasks').then(
        res => {
          console.log(res.data);
          setTasks(res.data);
        },
        error => {
          console.log(error);
        }
      );
    };
    fetchData();
    forceUpdate();
  }, [updateFlag]);

  const addTask = () => {
    axios
      .post('/api/task', {
        task: input,
        isDone: false,
      })
      .then(res => {
        console.log(res.data);
        setTasks([...tasks, res.data]);
        setInput('');
        setUpdateFlag(!updateFlag);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Task Saved !',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deleteTask = task => {
    axios
      .delete(`/api/task/${task.ID}`)
      .then(res => {
        console.log(res.data);
        setTasks(tasks.filter(t => t.ID !== task.ID));
        setUpdateFlag(!updateFlag);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Task Deleted !',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const updateTask = (_task, newTask) => {
    axios
      .put(`/api/task/${_task.ID}`, {
        task: newTask,
        isDone: _task.isDone,
      })
      .then(res => {
        console.log(res.data);
        setTasks(tasks.map(t => (t.ID === _task.ID ? res.data : t)));
        console.log(tasks);
        setUpdateFlag(!updateFlag);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Task Updated !',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Flex
      flexDir="column"
      maxW={800}
      align="center"
      justify="center"
      minH="100vh"
      m="auto"
      px={4}
    >
      <Flex justify="space-between" w="100%" align="center">
        <Heading color={'red.400'} mb={4}>
          Welcome To Your Tasks Tracker !
        </Heading>
        <Flex>
          <DarkModeSwitch />
        </Flex>
      </Flex>

      <InputGroup>
        <InputLeftElement pointerEvents="none" />
        <Input
          type="text"
          onChange={e => setInput(e.target.value)}
          value={input}
          placeholder="Add Task !"
        />
        <Button
          ml={2}
          onClick={() =>
            input
              ? addTask()
              : Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: 'Add Task First !',
                  showConfirmButton: false,
                  timer: 1500,
                })
          }
        >
          Add Task
        </Button>
      </InputGroup>

      {tasks.map((t, i) => {
        return (
          <div key={t.ID}>
            {i > 0 && <Divider />}
            <Flex
              key={t.ID}
              w="100%"
              p={5}
              my={2}
              align="center"
              borderRadius={5}
              justifyContent="space-between"
            >
              <Flex align="center">
                <Editable defaultValue={t.task}>
                  <EditablePreview />
                  <EditableInput
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        updateTask(t, e.target.value);
                      }
                    }}
                  />
                </Editable>
              </Flex>

              <IconButton
                ml={2}
                onClick={() => deleteTask(t)}
                icon={<DeleteIcon />}
              />
            </Flex>
          </div>
        );
      })}
    </Flex>
  );
}
