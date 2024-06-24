import React, {useState, useEffect} from 'react'
import MainLayout from '../components/MainLayout'
import { Nav } from 'react-bootstrap'
import { PiSquare, PiCheckSquare } from "react-icons/pi";
import Calander from '../components/Calander';
import api from '../api'

function Dashboard() {
  const [greeting, setGreeting] = useState('')
  const [activeTab , setActiveTab] = useState('projects')
  const [isMobile, setIsMobile] = useState(false)
  const [Tasks, setTasks] = useState([])
  const [Projects, setProjects] = useState([])
  const [user, setUser] = useState({})

  const getTasks = () => {
    api.get('/api/tasks/').then((res) => res.data).then((data) => {setTasks(data); console.log("Tasks:" + data)}).catch((err) => console.log(err))
  }

  const getProjects = () => {
    api.get('/api/projects/').then((res) => res.data).then((data) => {setProjects(data); console.log("Projects:" +data)}).catch((err) => console.log(err))
  }

  const getUser = () => {
    api.get('/api/user/').then((res) => res.data).then((data) => {setUser(data); console.log("User:" +data)}).catch((err) => console.log(err))
  }

  useEffect(() => {
    getTasks()
    getProjects()
    getUser()
  },[])

  useEffect(() => {
    const currentTime = new Date().getHours()
    if (currentTime < 12) {
      setGreeting('Good morning')
    } else if (currentTime < 18) {
      setGreeting('Good afternoon')
    } else {
      setGreeting('Good evening')
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
        case 'projects':
            return (
                <div>
                    {Projects && Projects.length > 0 ? (
                        Projects.map((project) => (
                            <ul key={project.id}> {/* Assuming each project has a unique id */}
                                <li><h6>{project.name}</h6></li>
                            </ul>
                        ))
                    ) : (
                        <div>No Project Available</div>
                    )}
                </div>
            );
        case 'tasks':
          return (
            <div>
                {Tasks && Tasks.length > 0 ? (
                    Tasks.map((task) => (
                        <ul key={task.id}> {/* Assuming each task has a unique id */}
                            <li>{task.name}</li>
                        </ul>
                    ))
                ) : (
                    <div>No Task Available</div>
                )}
            </div>
        );
        default:
            return null;
    }
};

  return (
    <div>
      <MainLayout>
        <div className="row">
          <div className="col">
            <h1>{greeting}, {user.first_name} {user.last_name}</h1> {/* get user name here */}
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Recents</h4>
                <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                  <Nav.Item>
                    <Nav.Link eventKey="projects">Projects</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tasks">Tasks</Nav.Link>
                  </Nav.Item>
                </Nav>
                <div className="mt-3">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Pending Tasks</h4>
                <div className="mt-3">
                  {Tasks && Tasks.length > 0 ? (
                    Tasks.map((task) => (
                      <div className="d-flex justify-content-between align-items-center border-bottom py-2" index={task.id}>
                        <div className="d-flex flex-column justify-content-center">
                          <h6 className="mb-0">{task.name}</h6>
                          <p className="mb-0">{task.project}</p>
                        </div>
                        <div>
                          {/* checkmark here */}
                          <PiSquare size={24} className='task-check-before' />
                          <PiCheckSquare size={24} className='task-check-after' />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No Task Available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {!isMobile && (
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Calendar</h4>
                  <div className="mt-3">
                    <Calander />
                  </div>
                </div>
              </div>
            </div>
          )}
            <div className={`${isMobile ? "col-12" : "col-6"}`}>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Progress</h4>
                  {Projects && Projects.length > 0 ? (
                    Projects.map((project) => (
                      <div className="d-flex flex-column py-2" key={project.id}>
                        <div className="d-flex justify-content-between align-items-center w-100">
                          <h6 className="mb-0">{project.name}</h6>
                          <span className="ml-auto">{project.progress}%</span>
                        </div>
                        <div className="progress w-100 my-2">
                          <div className="progress-bar" role="progressbar" style={{ width: `${project.progress}%` }} aria-valuenow={project.progress} aria-valuemin="0" aria-valuemax="100">{project.progress}%</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No Project Available</div>
                  
                  )}
                </div>
              </div>
            </div>
        </div>
      </MainLayout>
    </div>
  )
}

export default Dashboard
