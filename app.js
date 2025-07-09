const { useState, useEffect } = React;// Bu kod React Hooks'larını import eden bir JavaScript destructuring operasyonudur.
// bu saydede bunları her kullandığında başına react eklemek zorunda kalmazsın.

const resetAllStates = (setters) => {
    setters.setSelectedWorker(null);
    setters.setSelectedProject(null);
    setters.setShowForm(false);
    setters.setEditingWorker && setters.setEditingWorker(null);
    setters.setEditingProject && setters.setEditingProject(null);
};

const createFormGroup = (label, inputProps, isRequired = false) => {
    return React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, label + (isRequired ? ' *' : '')),
        React.createElement('input', { required: isRequired, ...inputProps })
    );
};

const createButton = (text, onClick, className = 'btn', disabled = false, type = 'button') => {
    return React.createElement('button', { 
        type,
        className,
        onClick,
        disabled
    }, text);
};


function App() {
    const [currentPage, setCurrentPage] = useState('dashboard'); // currentPage şuan olduğun sayfayı tutar setCurrentPage bunları değiştirmek için kullanılır.
    const [workers, setWorkers] = useState([]);// dashboard burda ilk sayfa olarak tanımlandı.
    const [projects, setProjects] = useState([]); // React.js useState hooku ile state management yapıyoruz.
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);// const sabit demek burdaki değişkenlerin tekrar tanımlanmasını engeller.
    const [showForm, setShowForm] = useState(false);
    const [editingWorker, setEditingWorker] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [formType, setFormType] = useState(null); 
// burdaki tüm hepsi aynı birisi onları tutuyo diğeri değiştiriyor.


    const stateSetters = {
        setSelectedWorker,
        setSelectedProject,
        setShowForm,// tüm formülleri setterste toplar. bu sayede bu formülleri tek bir yerden kontrol edebiliriz.
        setEditingWorker,
        setEditingProject,
        setFormType
    };

    useEffect(() => {
        console.log('React App started!');
        fetchWorkers(); // API'den çalışanları çeker
        fetchProjects(); // API'den projeleri çeker
    }, []);// boş array ile useEffect kullanımı, bu fonksiyonun sadece component mount olduğunda çalışmasını sağlar. Yani sayfa ilk yüklendiğinde çalışan kodlar.

    const fetchWorkers = async () => {
        try {
            const response = await fetch('/api/worker');
            if (response.ok) {
                const data = await response.json();
                setWorkers(data);
                console.log('Workers loaded:', data);
            }
        } catch (error) {
            console.error('Error fetching workers:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
                console.log('Projects loaded:', data);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const createNavButton = (page, text) => {
        return React.createElement('button', {
            className: currentPage === page ? 'nav-btn active' : 'nav-btn',
            onClick: () => {
                setCurrentPage(page);
                resetAllStates(stateSetters);
            }
        }, text);
    };

    return React.createElement('div', { className: 'app' },
        React.createElement('nav', { className: 'navbar' },
            React.createElement('div', { className: 'nav-brand' },
                React.createElement('h1', null, 'Worker & Project Management')
            ),
            React.createElement('ul', { className: 'nav-menu' },
                React.createElement('li', null, createNavButton('dashboard', 'Dashboard')),
                React.createElement('li', null, createNavButton('workers', 'Workers')),
                React.createElement('li', null, createNavButton('projects', 'Projects'))
            )
        ),
        
        React.createElement('main', { className: 'main-content' },
            // Dashboard
            currentPage === 'dashboard' && React.createElement(Dashboard, { workers, projects }),
            
            // Workers Page
            currentPage === 'workers' && !selectedWorker && !showForm && React.createElement(WorkersPage, { 
                workers, 
                setWorkers, 
                setSelectedWorker,
                setShowForm,
                setEditingWorker,
                setEditingProject,
                setFormType,
                fetchWorkers
            }),
            
            // Projects Page
            currentPage === 'projects' && !selectedProject && !showForm && React.createElement(ProjectsPage, { 
                projects, 
                setProjects, 
                setSelectedProject,
                setShowForm,
                setEditingProject,
                setEditingWorker,
                setFormType,
                fetchProjects
            }),
            
            // Worker Detail
            selectedWorker && React.createElement(WorkerDetail, { 
                worker: selectedWorker, 
                onBack: () => setSelectedWorker(null),
                onEdit: (worker) => {
                    setEditingWorker(worker);
                    setEditingProject(null);
                    setFormType('worker');
                    setSelectedWorker(null);
                    setShowForm(true);
                }
            }),
            
            // Project Detail
            selectedProject && React.createElement(ProjectDetail, { 
                project: selectedProject, 
                onBack: () => setSelectedProject(null),
                onEdit: (project) => {
                    setEditingProject(project);
                    setEditingWorker(null);
                    setFormType('project');
                    setSelectedProject(null);
                    setShowForm(true);
                }
            }),
            
            // Worker Form - SADECE formType 'worker' ise
            showForm && formType === 'worker' && React.createElement(WorkerForm, {
                worker: editingWorker, // null = add, object = edit
                onSave: () => {
                    fetchWorkers();
                    setShowForm(false);
                    setEditingWorker(null);
                    setFormType(null);
                },
                onCancel: () => {
                    setShowForm(false);
                    setEditingWorker(null);
                    setFormType(null);
                }
            }),
            
            // Project Form - SADECE formType 'project' ise
            showForm && formType === 'project' && React.createElement(ProjectForm, {
                project: editingProject, // null = add, object = edit
                onSave: () => {
                    fetchProjects();
                    setShowForm(false);
                    setEditingProject(null);
                    setFormType(null);
                },
                onCancel: () => {
                    setShowForm(false);
                    setEditingProject(null);
                    setFormType(null);
                }
            })
        )
    );
}

// ...existing code...

// Dashboard Component - CSS class'larını kullanacak şekilde düzeltildi
function Dashboard({ workers, projects }) {
    const createStatCard = (count, label) => {
        return React.createElement('div', { className: 'stat-card' },
            React.createElement('div', { className: 'stat-info' },
                React.createElement('h3', null, count),
                React.createElement('p', null, label)
            )
        );
    };

    return React.createElement('div', { className: 'dashboard' },
        // Welcome Section - CSS class'ları ile
        React.createElement('div', { className: 'welcome-section' },
            React.createElement('h1', { className: 'welcome-title' }, 
                'Worker & Project Management System'
            ),
            React.createElement('div', { className: 'welcome-description' },
                React.createElement('p', null, 
                    'Welcome to our comprehensive Worker & Project Management System, a modern web-based solution designed to streamline your organization\'s human resources and project coordination processes. This intuitive platform empowers businesses to efficiently manage their workforce while maintaining complete oversight of ongoing projects and their associated timelines.'
                ),
                React.createElement('p', null,
                    'Our system provides a centralized hub where you can seamlessly add, edit, and track employee information including personal details, professional backgrounds, educational qualifications, and project experiences. The user-friendly interface allows for quick access to detailed worker profiles, making it easy to assess skills, experience levels, and availability for new assignments.'
                ),
                React.createElement('p', null,
                    'The project management module enables you to create and monitor projects with comprehensive details including start dates, deadlines, and team assignments. You can assign up to four team members per project, track project progress, and maintain clear visibility of resource allocation across your organization.'
                ),
                React.createElement('p', null,
                    'Built with cutting-edge web technologies including React.js for dynamic user interactions and ASP.NET Core for robust backend operations, this system ensures reliable performance and scalability. The responsive design guarantees optimal functionality across all devices, allowing you to manage your workforce and projects whether you\'re in the office or on the go.'
                ),
                React.createElement('p', null,
                    'Experience the power of organized workforce management and project coordination with our integrated solution that transforms complex organizational processes into simple, manageable tasks.'
                )
            )
        ),
        
        // Dashboard Stats
        React.createElement('h2', null, 'Dashboard Overview'),
        React.createElement('div', { className: 'stats-grid' },
            createStatCard(workers.length, 'Total Workers'),
            createStatCard(projects.length, 'Active Projects')
        )
    );
}

// ...existing code...
// Common functions for both Workers and Projects
const handleDelete = async (apiUrl, id, items, setItems, successMessage) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            setItems(items.filter(item => (item.id || item.pid) !== id));
            alert(successMessage);
        } else {
            alert('Error occurred while deleting!');
        }
    } catch (error) {
        console.error('Error deleting:', error);
        alert('Connection error!');
    }
};

const createActionButtons = (onEdit, onDelete) => {
    return React.createElement('div', { className: 'action-buttons' },
        createButton('Edit', onEdit, 'btn btn-edit'),
        createButton('Delete', onDelete, 'btn btn-delete')
    );
};

// Projects Page Component
function ProjectsPage({ projects, setProjects, setSelectedProject, setShowForm, setEditingProject, setEditingWorker, setFormType, fetchProjects }) {
    const [loading, setLoading] = useState(false);

    const deleteProject = (id) => handleDelete('/api/projects', id, projects, setProjects, 'Project deleted successfully!');
    const viewProject = (project) => setSelectedProject(project);
    
    const editProject = (project) => { 
        setEditingProject(project); 
        setEditingWorker(null);
        setFormType('project');
        setShowForm(true); 
    };
    
    const addNewProject = () => { 
        setEditingProject(null); // null = yeni project
        setEditingWorker(null);
        setFormType('project'); // Önemli: Form tipini belirt
        setShowForm(true); 
    };

    if (loading) {
        return React.createElement('div', { className: 'loading' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Loading...')
        );
    }

    const createProjectCard = (project) => {
        const workers = [project.nameOfWorkerForProject1, project.nameOfWorkerForProject2, 
                        project.nameOfWorkerForProject3, project.nameOfWorkerForProject4]
                       .filter(name => name && name.trim())
                       .join(', ') || "No workers assigned yet.";

        return React.createElement('div', { key: project.pid, className: 'project-card' },
            React.createElement('div', {
                className: 'project-content',
                onClick: () => viewProject(project),
                style: { cursor: 'pointer' }
            },
                React.createElement('div', { className: 'project-header' },
                    React.createElement('h3', null, project.pName),
                    React.createElement('span', { className: 'project-id' }, `ID: ${project.pid}`)
                ),
                React.createElement('div', { className: 'project-info' },
                    React.createElement('p', null, React.createElement('strong', null, 'Start: '), new Date(project.pGivenDate).toLocaleDateString('tr-TR')),
                    React.createElement('p', null, React.createElement('strong', null, 'Finish: '), new Date(project.pFinishDate).toLocaleDateString('tr-TR'))
                ),
                React.createElement('div', { className: 'project-workers' },
                    React.createElement('p', null, React.createElement('strong', null, 'Workers: '), workers)
                ),
                React.createElement('div', { className: 'project-preview' },
                    React.createElement('p', null, 'Click to view details')
                )
            ),
            createActionButtons(
                (e) => { e.stopPropagation(); editProject(project); },
                (e) => { e.stopPropagation(); deleteProject(project.pid); }
            )
        );
    };

    return React.createElement('div', { className: 'projects-page' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h2', null, 'Projects'),
            createButton('Add New Project', addNewProject, 'btn btn-primary')
        ),
        projects.length === 0 
            ? React.createElement('div', { className: 'empty-state' },
                React.createElement('h3', null, 'There are no projects yet!'),
                React.createElement('p', null, 'You can add a new project by clicking the button above.')
            )
            : React.createElement('div', { className: 'projects-grid' }, projects.map(createProjectCard))
    );
}

// Workers Page Component
function WorkersPage({ workers, setWorkers, setSelectedWorker, setShowForm, setEditingWorker, setEditingProject, setFormType, fetchWorkers }) {
    const [loading, setLoading] = useState(false);

    const deleteWorker = (id) => handleDelete('/api/worker', id, workers, setWorkers, 'Worker successfully deleted!');
    const viewWorker = (worker) => setSelectedWorker(worker);
    
    const editWorker = (worker) => { 
        setEditingWorker(worker); 
        setEditingProject(null);
        setFormType('worker');
        setShowForm(true); 
    };
    
    const addNewWorker = () => { 
        setEditingWorker(null); // null = yeni worker
        setEditingProject(null);
        setFormType('worker'); // Önemli: Form tipini belirt
        setShowForm(true); 
    };

    if (loading) {
        return React.createElement('div', { className: 'loading' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Loading...')
        );
    }

    const createWorkerCard = (worker) => {
        return React.createElement('div', { key: worker.id, className: 'worker-card' },
            React.createElement('div', { 
                className: 'worker-content',
                onClick: () => viewWorker(worker),
                style: { cursor: 'pointer' }
            },
                React.createElement('div', { className: 'worker-header' },
                    React.createElement('h3', null, `${worker.name} ${worker.lastName}`),
                    React.createElement('span', { className: 'worker-age' }, `Age: ${worker.age}`)
                ),
                React.createElement('div', { className: 'worker-info' },
                    React.createElement('p', null, React.createElement('strong', null, 'Department: '), worker.department),
                    React.createElement('p', null, React.createElement('strong', null, 'Gender: '), worker.gender)
                ),
                React.createElement('div', { className: 'worker-preview' },
                    React.createElement('p', null, 'Click to view details')
                )
            ),
            createActionButtons(
                (e) => { e.stopPropagation(); editWorker(worker); },
                (e) => { e.stopPropagation(); deleteWorker(worker.id); }
            )
        );
    };

    return React.createElement('div', { className: 'workers-page' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h2', null, 'Workers'),
            createButton('Add New Worker', addNewWorker, 'btn btn-primary')
        ),
        workers.length === 0 
            ? React.createElement('div', { className: 'empty-state' },
                React.createElement('h3', null, 'No workers yet!'),
                React.createElement('p', null, 'You can add a worker using the add new worker button.')
            )
            : React.createElement('div', { className: 'workers-grid' }, workers.map(createWorkerCard))
    );
}

// Common Detail Header
const createDetailHeader = (title, onBack, onEdit) => {
    return React.createElement('div', { className: 'detail-header' },
        createButton('Back', onBack, 'btn btn-secondary'),
        React.createElement('h2', null, title),
        createButton('Edit', onEdit, 'btn btn-edit')
    );
};

// Project Detail Component
function ProjectDetail({ project, onBack, onEdit }) {
    const createInfoItem = (label, value) => {
        return React.createElement('div', { className: 'project-item' },
            React.createElement('strong', null, label + ':'),
            React.createElement('span', null, value)
        );
    };

    const createWorkerItem = (number, name) => {
        return name && React.createElement('div', { className: 'worker-item' },
            React.createElement('span', { className: 'worker-number' }, number + '.'),
            React.createElement('span', null, name)
        );
    };

    return React.createElement('div', { className: 'project-detail' },
        createDetailHeader(`${project.pName} - Project Details`, onBack, () => onEdit(project)),
        React.createElement('div', { className: 'project-detail-container' },
            React.createElement('div', { className: 'project-section' },
                React.createElement('h3', null, 'Project Information'),
                React.createElement('div', { className: 'project-info-grid' },
                    createInfoItem('Project ID', project.pid),
                    createInfoItem('Project Name', project.pName),
                    createInfoItem('Start Date', new Date(project.pGivenDate).toLocaleDateString('tr-TR')),
                    createInfoItem('End Date', new Date(project.pFinishDate).toLocaleDateString('tr-TR'))
                )
            ),
            React.createElement('div', { className: 'project-section' },
                React.createElement('h3', null, 'Assigned Workers'),
                React.createElement('div', { className: 'workers-list' },
                    createWorkerItem('1', project.nameOfWorkerForProject1),
                    createWorkerItem('2', project.nameOfWorkerForProject2),
                    createWorkerItem('3', project.nameOfWorkerForProject3),
                    createWorkerItem('4', project.nameOfWorkerForProject4),
                    
                    !project.nameOfWorkerForProject1 && !project.nameOfWorkerForProject2 && 
                    !project.nameOfWorkerForProject3 && !project.nameOfWorkerForProject4 && 
                    React.createElement('p', { className: 'no-workers' }, 'No workers assigned to this project yet.')
                )
            )
        )
    );
}

// Worker Detail Component
function WorkerDetail({ worker, onBack, onEdit }) {
    const createCVSection = (title, content) => {
        return React.createElement('div', { className: 'cv-section' },
            React.createElement('h3', null, title),
            content
        );
    };

    const createCVItem = (label, value) => {
        return React.createElement('div', { className: 'cv-item' },
            React.createElement('strong', null, label + ':'),
            React.createElement('span', null, value)
        );
    };

    return React.createElement('div', { className: 'worker-detail' },
        createDetailHeader(`${worker.name} ${worker.lastName} - CV`, onBack, () => onEdit(worker)),
        React.createElement('div', { className: 'cv-container' },
            createCVSection('Personal Information',
                React.createElement('div', { className: 'cv-info-grid' },
                    createCVItem('Name', `${worker.name} ${worker.lastName}`),
                    createCVItem('Age', worker.age),
                    createCVItem('Gender', worker.gender),
                    createCVItem('Nationality', worker.nationality)
                )
            ),
            createCVSection('Professional Information',
                React.createElement('div', { className: 'cv-info-grid' },
                    createCVItem('Department', worker.department),
                    createCVItem('Previous Jobs', worker.beforeJobs || 'Not specified')
                )
            ),
            createCVSection('Education',
                createCVItem('Graduated School', worker.schoolGraduated || 'Not specified')
            ),
            createCVSection('Project Experience',
                React.createElement('div', { className: 'cv-projects' },
                    React.createElement('p', null, worker.projectsShortDescription || 'No project experience specified.')
                )
            )
        )
    );
}

// Common Form Handler
const handleFormSubmit = async (e, data, apiUrl, method, successMessage, onSuccess) => {
    e.preventDefault();
    
    try {
        const response = await fetch(apiUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert(successMessage);
            onSuccess();
        } else {
            alert('Operation failed!');
        }
    } catch (error) {
        console.error('Error saving:', error);
        alert('Connection error!');
    }
};

// Project Form Component
function ProjectForm({ project, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        pName: project?.pName || '',
        pGivenDate: project?.pGivenDate ? new Date(project.pGivenDate).toISOString().split('T')[0] : '',
        pFinishDate: project?.pFinishDate ? new Date(project.pFinishDate).toISOString().split('T')[0] : '',
        nameOfWorkerForProject1: project?.nameOfWorkerForProject1 || '',
        nameOfWorkerForProject2: project?.nameOfWorkerForProject2 || '',
        nameOfWorkerForProject3: project?.nameOfWorkerForProject3 || '',
        nameOfWorkerForProject4: project?.nameOfWorkerForProject4 || ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setSubmitting(true);
        const url = project ? `/api/projects/${project.pid}` : '/api/projects';
        const method = project ? 'PUT' : 'POST';
        const message = project ? 'Project successfully updated!' : 'Project successfully added!';
        
        await handleFormSubmit(e, formData, url, method, message, onSave);
        setSubmitting(false);
    };

    return React.createElement('div', { className: 'project-form' },
        React.createElement('h2', null, project ? 'Project Edit' : 'New Project'),
        React.createElement('form', { onSubmit: handleSubmit, className: 'form' },
            createFormGroup('Project Name', { 
                type: 'text', 
                name: 'pName', 
                value: formData.pName,
                onChange: handleChange,
                placeholder: 'e.g: Digital Website Project'
            }, true),
            
            React.createElement('div', { className: 'form-row' },
                createFormGroup('Start Date', { 
                    type: 'date', 
                    name: 'pGivenDate', 
                    value: formData.pGivenDate,
                    onChange: handleChange
                }, true),
                createFormGroup('End Date', { 
                    type: 'date', 
                    name: 'pFinishDate', 
                    value: formData.pFinishDate,
                    onChange: handleChange
                }, true)
            ),

            React.createElement('h4', null, 'Project Workers'),
            
            createFormGroup('1. Worker', { 
                type: 'text', 
                name: 'nameOfWorkerForProject1', 
                value: formData.nameOfWorkerForProject1,
                onChange: handleChange,
                placeholder: 'Worker name and surname'
            }),
            
            createFormGroup('2. Worker', { 
                type: 'text', 
                name: 'nameOfWorkerForProject2', 
                value: formData.nameOfWorkerForProject2,
                onChange: handleChange,
                placeholder: 'Worker name and surname'
            }),
            
            createFormGroup('3. Worker', { 
                type: 'text', 
                name: 'nameOfWorkerForProject3', 
                value: formData.nameOfWorkerForProject3,
                onChange: handleChange,
                placeholder: 'Worker name and surname'
            }),
            
            createFormGroup('4. Worker', { 
                type: 'text', 
                name: 'nameOfWorkerForProject4', 
                value: formData.nameOfWorkerForProject4,
                onChange: handleChange,
                placeholder: 'Worker name and surname'
            }),

            React.createElement('div', { className: 'form-actions' },
                createButton(
                    submitting ? 'Saving...' : (project ? 'Update' : 'Add'), 
                    null, 
                    'btn btn-primary', 
                    submitting, 
                    'submit'
                ),
                createButton('Cancel', onCancel, 'btn btn-secondary', submitting)
            )
        )
    );
}

// Worker Form Component
function WorkerForm({ worker, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: worker?.name || '',
        lastName: worker?.lastName || '',
        age: worker?.age || '',
        nationality: worker?.nationality || 'Turkey',
        department: worker?.department || '',
        schoolGraduated: worker?.schoolGraduated || '',
        projectsShortDescription: worker?.projectsShortDescription || '',
        gender: worker?.gender || '',
        beforeJobs: worker?.beforeJobs || ''
    });

    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setSubmitting(true);
        const url = worker ? `/api/worker/${worker.id}` : '/api/worker';
        const method = worker ? 'PUT' : 'POST';
        const message = worker ? 'Worker successfully updated!' : 'Worker successfully added!';
        
        await handleFormSubmit(e, formData, url, method, message, onSave);
        setSubmitting(false);
    };

    return React.createElement('div', { className: 'worker-form' },
        React.createElement('h2', null, worker ? 'Edit Worker' : 'Add New Worker'),
        React.createElement('form', { onSubmit: handleSubmit, className: 'form' },
            React.createElement('div', { className: 'form-row' },
                createFormGroup('First Name', { 
                    type: 'text', 
                    name: 'name', 
                    value: formData.name,
                    onChange: handleChange
                }, true),
                createFormGroup('Last Name', { 
                    type: 'text', 
                    name: 'lastName', 
                    value: formData.lastName,
                    onChange: handleChange
                }, true)
            ),

            React.createElement('div', { className: 'form-row' },
                createFormGroup('Age', { 
                    type: 'number', 
                    name: 'age', 
                    value: formData.age,
                    onChange: handleChange,
                    min: '18',
                    max: '65'
                }, true),
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', null, 'Gender *'),
                    React.createElement('select', { 
                        name: 'gender', 
                        value: formData.gender, 
                        onChange: handleChange,
                        required: true
                    },
                        React.createElement('option', { value: '' }, 'Select'),
                        React.createElement('option', { value: 'Male' }, 'Male'),
                        React.createElement('option', { value: 'Female' }, 'Female'),
                        React.createElement('option', { value: 'Other' }, 'Other')
                    )
                )
            ),

            createFormGroup('Department', { 
                type: 'text', 
                name: 'department', 
                value: formData.department,
                onChange: handleChange,
                placeholder: 'e.g: Software Developer'
            }, true),

            createFormGroup('Nationality', { 
                type: 'text', 
                name: 'nationality', 
                value: formData.nationality,
                onChange: handleChange,
                placeholder: 'e.g: Turkey'
            }),

            createFormGroup('Graduated School', { 
                type: 'text', 
                name: 'schoolGraduated', 
                value: formData.schoolGraduated,
                onChange: handleChange,
                placeholder: 'e.g: METU'
            }),

            createFormGroup('Last Jobs', { 
                type: 'text', 
                name: 'beforeJobs', 
                value: formData.beforeJobs,
                onChange: handleChange,
                placeholder: 'e.g: TechnoSoft (4 Years)'
            }),

            React.createElement('div', { className: 'form-group' },
                React.createElement('label', null, 'Project Experience'),
                React.createElement('textarea', { 
                    name: 'projectsShortDescription', 
                    value: formData.projectsShortDescription,
                    onChange: handleChange,
                    rows: 4,
                    placeholder: 'Describe your project experiences...'
                })
            ),

            React.createElement('div', { className: 'form-actions' },
                createButton(
                    submitting ? 'Saving...' : (worker ? 'Update' : 'Add'), 
                    null, 
                    'btn btn-primary', 
                    submitting, 
                    'submit'
                ),
                createButton('Cancel', onCancel, 'btn btn-secondary', submitting)
            )
        )
    );
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));