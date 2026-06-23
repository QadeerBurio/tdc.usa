export const servicesData = [
  {
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    icon: 'fas fa-laptop-code',
    description: 'Tailored software solutions designed and built to address your specific business challenges and goals.',
    overview: 'Our Custom Software Development service delivers highly targeted solutions that align precisely with your workflows, business logic, and scaling requirements. We construct robust, secure systems from the ground up, ensuring complete intellectual property ownership and competitive differentiation for your business.',
    benefits: [
      'Customized to match your exact internal business logic and user workflows.',
      'Highly scalable architecture that grows alongside your organization.',
      'Full intellectual property ownership of the codebase with zero licensing fees.',
      'Seamless integration with your legacy systems, databases, and third-party APIs.'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'Python', 'Go', 'Docker', 'Kubernetes', 'PostgreSQL'],
    process: [
      'Requirements Analysis & Scope Definition',
      'System Architecture & UI/UX Wireframing',
      'Agile Iterative Development Sprints',
      'Comprehensive QA, Security Audits & UAT Testing',
      'Production Deployment & Hypercare Support'
    ],
    faqs: [
      {
        question: 'Who owns the custom software code after development?',
        answer: 'You do. Upon project completion and final payment, full intellectual property rights and all source code files are transferred completely to your organization.'
      },
      {
        question: 'How do you handle future updates and scalability?',
        answer: 'We design all custom systems using modular architecture (such as microservices or clean monolithic structures) and offer ongoing support contracts to build new features as your user base expands.'
      },
      {
        question: 'What is your typical development methodology?',
        answer: 'We follow the Agile Scrum methodology, breaking work down into 2-week sprints with demo sessions at the end of each sprint so you can track progress and provide feedback in real-time.'
      },
      {
        question: 'Can you integrate our existing legacy systems with the new custom software?',
        answer: 'Yes, legacy integration is one of our core specialties. We design custom API layers or middleware to securely connect old databases and systems to modern cloud applications.'
      }
    ]
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    icon: 'fas fa-globe',
    description: 'High-performance, responsive websites and enterprise web applications that engage users and drive conversions.',
    overview: 'We build fast, secure, and modern web applications leveraging modern standards. From public-facing corporate sites to complex internal client portals and SaaS products, our frontend and backend engineers implement responsive layouts optimized for user experience and search index ranking.',
    benefits: [
      'Responsive design ensuring flawless operation across desktops, tablets, and mobile screens.',
      'Optimized performance with fast load times and high scores on web vitals.',
      'Search engine friendly structures and semantic markup.',
      'Secure, state-of-the-art authentication and database configurations.'
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'HTML5 & CSS3', 'MongoDB'],
    process: [
      'Creative Design & Information Architecture',
      'Responsive Frontend Slicing & Markup Coding',
      'Backend REST API Integration',
      'Performance Optimization & Cross-Browser Validation',
      'Secure Hosting Setup & Launch'
    ],
    faqs: [
      {
        question: 'Will my website work perfectly on mobile phones?',
        answer: 'Absolutely. Responsive design is a core standard of our development workflow. Your web application will automatically adapt to any screen size and device resolution.'
      },
      {
        question: 'Do you implement SEO best practices during development?',
        answer: 'Yes, we optimize site assets, enforce semantic HTML structure, manage meta information, and structure code execution to ensure search engine indexers can crawl and index your site easily.'
      },
      {
        question: 'What technologies do you recommend for enterprise web applications?',
        answer: 'We primarily recommend React.js or Next.js for highly interactive frontends, coupled with Node.js or Python backend APIs and robust databases like PostgreSQL or MongoDB, depending on data relational needs.'
      },
      {
        question: 'Do you offer website hosting and post-launch maintenance?',
        answer: 'Yes, we set up secure cloud hosting environments (on AWS, Azure, or GCP) with automated CI/CD pipelines, and provide post-launch maintenance plans covering security updates, bug fixes, and performance tuning.'
      }
    ]
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    icon: 'fas fa-mobile-alt',
    description: 'Native and cross-platform mobile apps for iOS and Android built for optimal user engagement.',
    overview: 'We engineer intuitive, high-performance mobile applications that keep your brand in your customers’ pockets. Using native and modern cross-platform technologies, we design smooth interactive interfaces, integrate device features (GPS, camera, notifications), and guide you through App Store and Google Play deployments.',
    benefits: [
      'Single codebase solutions that reduce development and maintenance costs.',
      'Native-like rendering performance and fluid scrolling animations.',
      'Direct integration with phone features (biometrics, push notifications, offline storage).',
      'End-to-end management of App Store (iOS) and Google Play (Android) submissions.'
    ],
    technologies: ['Flutter', 'React Native', 'Android', 'iOS', 'Firebase', 'GraphQL', 'SQLite'],
    process: [
      'User Journey Mapping & Interactive Prototyping',
      'Cross-Platform Code Engineering',
      'API Integration & Offline Sync Setuping',
      'Multi-Device Testing & App Store Preparation',
      'App Store Submission & App Store Optimization (ASO)'
    ],
    faqs: [
      {
        question: 'Should we build a hybrid app or separate native apps?',
        answer: 'For most companies, cross-platform frameworks like React Native or Flutter are recommended. They allow sharing over 90% of the codebase between iOS and Android, saving substantial time and cost while maintaining high performance.'
      },
      {
        question: 'How do push notifications work in your mobile apps?',
        answer: 'We integrate cloud messaging services like Firebase Cloud Messaging (FCM) or Apple Push Notification service (APNs) so your administrators can send target alerts to users.'
      },
      {
        question: 'Can the app function offline when there is no internet connection?',
        answer: 'Yes, we can implement local caching and offline data storage solutions (like SQLite or Realm). The app will sync local changes with the central database once a connection is re-established.'
      },
      {
        question: 'Do you assist with publishing apps to Apple App Store and Google Play Store?',
        answer: 'Yes, we handle the entire submission process, including metadata configuration, compliance checks, screenshots, and addressing any app store review feedback to ensure successful launch.'
      }
    ]
  },
  {
    slug: 'cloud-solutions',
    title: 'Cloud Solutions',
    icon: 'fas fa-cloud',
    description: 'Secure, scalable cloud migrations, infrastructure management, and serverless architecture optimization.',
    overview: 'Accelerate your digital transformation by moving infrastructure to the cloud. We design resilient, cost-efficient cloud architectures, perform secure migrations, set up CI/CD pipelines, and configure auto-scaling systems to guarantee 99.9% uptime for your digital operations.',
    benefits: [
      'Substantial reduction in local hardware capital expenditures.',
      'High-availability hosting with automated server recovery and failover setups.',
      'Elastic resource scaling to handle sudden traffic peaks without lag.',
      'Compliance with modern data storage and security regulations.'
    ],
    technologies: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Terraform'],
    process: [
      'Infrastructure Audit & Cloud Readiness Assessment',
      'Cloud Architecture Design & Cost Estimation',
      'Secure Data Migration & Network Setup',
      'Infrastructure as Code (IaC) Deployment',
      '24/7 Cloud Performance Monitoring Setup'
    ],
    faqs: [
      {
        question: 'How do you guarantee the security of our data in the cloud?',
        answer: 'We configure virtual private clouds (VPCs), enforce strict IAM access control rights, encrypt data at rest and in transit, and execute automated backups.'
      },
      {
        question: 'Can you help us migrate our on-premise servers to AWS?',
        answer: 'Yes, we specialize in lift-and-shift migrations as well as cloud-native re-architecting, minimizing downtime during database transfers.'
      },
      {
        question: 'How do you optimize cloud hosting costs?',
        answer: 'We implement automated scaling rules to shut down unused dev environments, run database profiling, and select reserved/spot instances to significantly reduce your monthly cloud bill.'
      },
      {
        question: 'What is Infrastructure as Code (IaC)?',
        answer: 'We use tools like Terraform to define your entire cloud infrastructure in code files. This enables repeatable, audited, and secure deployments across environments without manual setup errors.'
      }
    ]
  },
  {
    slug: 'ai-solutions',
    title: 'AI Solutions',
    icon: 'fas fa-brain',
    description: 'Leverage machine learning, natural language processing, and predictive analytics to automate operations.',
    overview: 'Unlock new insights and automate repetitive processes with artificial intelligence. We build custom machine learning models, implement intelligent natural language search systems, and deploy predictive tools that help your team make data-driven decisions and enhance customer support.',
    benefits: [
      'Automate time-consuming administrative tasks, freeing up core personnel.',
      'Harness predictive analytics to forecast demand and detect anomalies.',
      'Enhance client support with intelligent, context-aware chatbot agents.',
      'Derive structured knowledge from unstructured data files and logs.'
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI API', 'Pandas & NumPy', 'Hugging Face', 'LangChain'],
    process: [
      'Data Feasibility & AI Use-Case Evaluation',
      'Data Cleaning, Labelling & Preprocessing',
      'Model Training, Tuning & Evaluation',
      'API Wrapping & Frontend System Integration',
      'Feedback Collection & Continuous Model Learning'
    ],
    faqs: [
      {
        question: 'Do we need massive datasets to start using AI solutions?',
        answer: 'Not necessarily. By utilizing transfer learning and pre-trained LLM models (such as GPT-4), we can build high-performing custom applications with minimal local data inputs.'
      },
      {
        question: 'Are the AI responses verifiable to prevent hallucinations?',
        answer: 'Yes, we implement Retrieval-Augmented Generation (RAG) pipelines that ground the model’s outputs in your specific company documents, including citations to source texts.'
      },
      {
        question: 'How do you integrate AI models into existing enterprise workflows?',
        answer: 'We wrap our trained AI/ML models in lightweight REST or gRPC APIs, allowing them to be called seamlessly from your existing CRM, ERP, or web apps.'
      },
      {
        question: 'How do you ensure user data privacy when using LLMs?',
        answer: 'We configure private API endpoints or host open-source models (like Llama) on your private cloud infrastructure, ensuring no sensitive data is used to train public models.'
      }
    ]
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    icon: 'fas fa-palette',
    description: 'User-centered design systems and interactive wireframes built to optimize customer satisfaction and engagement.',
    overview: 'Design is not just how it looks, but how it works. Our UI/UX designers create intuitive, visually stunning layouts and build complete design systems. Through comprehensive user testing and low-fidelity prototyping, we verify that layouts guide visitors to conversions effortlessly.',
    benefits: [
      'Increased conversion rates through friction-free user journeys.',
      'Consistent branding across mobile, web, and internal applications.',
      'Low-fidelity wireframes that confirm workflows before coding begins.',
      'Improved digital accessibility (WCAG compliance) for inclusive usage.'
    ],
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Illustrator', 'CSS Grid & Flexbox', 'Storybook'],
    process: [
      'User Research, Persona Definition & Site Map Setuping',
      'Low-Fidelity Wireframes & Clickable Mockups',
      'High-Fidelity Visual Design & Interactive Prototypes',
      'Usability Testing, Heatmap Audits & Iterative Improvements',
      'Hand-off to Engineers with Complete Design Systems'
    ],
    faqs: [
      {
        question: 'What is the difference between UI and UX design?',
        answer: 'UX (User Experience) focuses on the logical structure, flow, and usability of the application. UI (User Interface) defines the visual elements, typography, color palettes, and overall aesthetics of the pages.'
      },
      {
        question: 'Do we get interactive prototypes to click through before development?',
        answer: 'Yes, we build clickable, interactive Figma prototypes that allow you to simulate navigation flows and actions before writing any frontend code.'
      },
      {
        question: 'How do you handle design hand-off to the development team?',
        answer: 'We provide developers with comprehensive Figma design systems including components, auto-layouts, spacing guides, and typography styles to ensure pixel-perfect conversion.'
      },
      {
        question: 'Do you perform user testing during the design phase?',
        answer: 'Yes, we conduct moderated and unmoderated usability tests with interactive prototypes on representative users to identify navigation bottlenecks before coding.'
      }
    ]
  },
  {
    slug: 'it-consulting',
    title: 'IT Consulting',
    icon: 'fas fa-comments',
    description: 'Strategic technology advisory services to align your IT investments with overall business strategy.',
    overview: 'Navigate complex technology decisions with confidence. Our senior architects and IT consultants evaluate your software stacks, identify system bottlenecks, provide vendor recommendations, and devise strategic tech roadmaps that maximize returns on your technology expenditures.',
    benefits: [
      'Objective, vendor-neutral technology advice and system audits.',
      'Identification of operational cost leaks and licensing overheads.',
      'De-risked migration and software implementation plans.',
      'Short-term and long-term technical roadmap development.'
    ],
    technologies: ['Enterprise Architecture', 'Agile/Scrum Roadmap', 'IT Audit Toolsets', 'Cost Optimization Metrics', 'Jira', 'Confluence'],
    process: [
      'Current Tech Stack Assessment & Operational Audit',
      'Stakeholder Interviews & Business Alignment Auditing',
      'Gap Analysis & Infrastructure Recommendation Report',
      'Strategic IT Roadmap & Cost Analysis Formulation',
      'Implementation Oversight & Transition Management'
    ],
    faqs: [
      {
        question: 'Can you help us evaluate third-party software vendor proposals?',
        answer: 'Yes, we run comparative audits assessing technology viability, scalability potential, API open integration limits, and total cost of ownership (TCO).'
      },
      {
        question: 'How long does a standard IT strategy audit take?',
        answer: 'A comprehensive evaluation typically takes 2 to 4 weeks depending on database sizes, internal documentation, and stack complexity.'
      },
      {
        question: 'Do you provide virtual CTO (vCTO) services?',
        answer: 'Yes, we offer ongoing vCTO services, attending strategic executive meetings, planning tech roadmaps, and advising on technical hires for growing companies.'
      },
      {
        question: 'How do you approach legacy system modernization?',
        answer: 'We conduct a thorough risk-benefit analysis, then devise a phased modernization roadmap—usually strangling legacy components one-by-one to avoid high-risk migrations.'
      }
    ]
  }
];
