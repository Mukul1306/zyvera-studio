const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Project = require('./src/models/Project');
const Category = require('./src/models/Category');

const categoriesData = [
  { name: 'CRM', slug: 'crm', type: 'both', icon: 'Users', description: 'Customer Relationship & Pipeline Management Solutions' },
  { name: 'ERP', slug: 'erp', type: 'both', icon: 'Cpu', description: 'Enterprise Resource & Operations Control Systems' },
  { name: 'Finance', slug: 'finance', type: 'both', icon: 'DollarSign', description: 'Financial Tech, Invoicing & Analytics Platforms' },
  { name: 'SaaS', slug: 'saas', type: 'both', icon: 'Cloud', description: 'Multi-tenant Software-as-a-Service Applications' },
  { name: 'Landing Page', slug: 'landing-page', type: 'both', icon: 'Layout', description: 'High-Converting Conversion & Marketing Sites' },
  { name: 'E-commerce', slug: 'e-commerce', type: 'both', icon: 'ShoppingCart', description: 'Storefronts & Digital Product Distribution' },
  { name: 'Admin Dashboard', slug: 'admin-dashboard', type: 'both', icon: 'BarChart3', description: 'Real-time Telemetry & Data Management Panels' },
  { name: 'Custom Software', slug: 'custom-software', type: 'both', icon: 'Terminal', description: 'Bespoke Full-stack Enterprise Platforms' },
];

const productsData = [
  {
    title: 'Aura ERP Enterprise Platform',
    slug: 'aura-erp-enterprise-platform',
    shortDescription: 'Production-ready cloud ERP with multi-warehouse inventory, procurement workflows, and real-time financial reporting.',
    description: 'Aura ERP is a complete, scalable enterprise resource planning suite built for modern software and manufacturing studios. Features include automated inventory tracking, vendor procurement management, double-entry ledger integration, custom role-based permissions, and real-time executive dashboard reporting.',
    category: 'ERP',
    price: 49999,
    discountPrice: 39999,
    images: [
      { public_id: 'prod_aura_erp_1', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
      { public_id: 'prod_aura_erp_2', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Docker'],
    tags: ['ERP', 'Enterprise', 'Inventory', 'Finance', 'SaaS'],
    features: [
      'Multi-warehouse automated stock tracking',
      'Double-entry automated accounting ledger',
      'Role-based granular access control (RBAC)',
      'Export reports in PDF, XLSX, and CSV formats',
      'REST API webhooks integration for Stripe & QuickBooks'
    ],
    demoUrl: 'https://demo-aura-erp.example.com',
    githubUrl: 'https://github.com/example/aura-erp',
    status: 'Available',
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    title: 'Pulse CRM & Lead Pipeline',
    slug: 'pulse-crm-lead-pipeline',
    shortDescription: 'Modern visual Kanban CRM with email automation, activity logging, and AI deal win probability scoring.',
    description: 'Pulse CRM helps sales teams track deals effortlessly from lead capture to contract signature. Includes customizable stage pipelines, integrated email communication logs, meeting schedulers, and predictive forecasting.',
    category: 'CRM',
    price: 18999,
    discountPrice: 14999,
    images: [
      { public_id: 'prod_pulse_crm_1', url: 'https://images.unsplash.com/photo-1542744094-3a3172720180?auto=format&fit=crop&w=1200&q=80' },
      { public_id: 'prod_pulse_crm_2', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Framer Motion'],
    tags: ['CRM', 'Sales', 'Kanban', 'Leads', 'Pipelines'],
    features: [
      'Interactive drag-and-drop deal pipeline',
      'Automatic lead score computation',
      'Nodemailer email dispatch & tracking',
      'Team activity audit logs & notifications'
    ],
    demoUrl: 'https://demo-pulse-crm.example.com',
    githubUrl: 'https://github.com/example/pulse-crm',
    status: 'Available',
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    title: 'SRM Finance & Billing Engine',
    slug: 'srm-finance-billing-engine',
    shortDescription: 'High-performance billing engine with multi-currency invoice generation, recurring subscriptions, and tax management.',
    description: 'Designed for digital agencies, SaaS founders, and freelancers who need transparent financial control. Generates crisp PDF invoices, manages recurring billing cycles, tracks expenses, and displays real-time cashflow metrics.',
    category: 'Finance',
    price: 12500,
    discountPrice: 9999,
    images: [
      { public_id: 'prod_srm_finance_1', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
    tags: ['Finance', 'Invoicing', 'Billing', 'Analytics', 'Tax'],
    features: [
      'Multi-currency auto conversion',
      'PDF invoice export with custom branding',
      'Recurring subscription ledger',
      'Visual revenue & expense projection graphs'
    ],
    demoUrl: 'https://demo-srm-finance.example.com',
    githubUrl: 'https://github.com/example/srm-finance',
    status: 'Available',
    featured: true,
    published: true,
    sortOrder: 3,
  },
  {
    title: 'Lumina SaaS Starter Kit',
    slug: 'lumina-saas-starter-kit',
    shortDescription: 'Complete MERN boilerplate with JWT authentication, Stripe subscriptions, team organizations, and dark/light glass themes.',
    description: 'Accelerate your product build by 300+ hours. Lumina includes pre-configured JWT authentication with HTTP-only cookies, OAuth social login, multi-tenant database routing, team member invites, and a glass UI system.',
    category: 'SaaS',
    price: 7999,
    discountPrice: 4999,
    images: [
      { public_id: 'prod_lumina_saas_1', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Vite', 'Express', 'MongoDB', 'Tailwind CSS', 'JWT'],
    tags: ['SaaS', 'Boilerplate', 'MERN', 'Authentication', 'Starter'],
    features: [
      'Pre-built Admin dashboard & settings',
      'JWT security + refresh tokens',
      'Clean Glassmorphism design system',
      'Comprehensive REST API structure'
    ],
    demoUrl: 'https://demo-lumina-saas.example.com',
    githubUrl: 'https://github.com/example/lumina-saas',
    status: 'Available',
    featured: false,
    published: true,
    sortOrder: 4,
  },
  {
    title: 'Nexus Modern SaaS Landing Page',
    slug: 'nexus-modern-saas-landing-page',
    shortDescription: 'Hyper-optimized Light Glassmorphism landing page template for software studios with 99+ Lighthouse speed score.',
    description: 'Nexus is crafted specifically for AI startups, digital product agencies, and SaaS products wanting an immediate high-trust impression. Features ultra-smooth Framer Motion hero visuals, interactive product demos, pricing matrix, and integrated lead capture.',
    category: 'Landing Page',
    price: 3499,
    discountPrice: 2499,
    images: [
      { public_id: 'prod_nexus_landing_1', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    tags: ['Landing Page', 'Design System', 'Light Glass', 'Conversion'],
    features: [
      'Clean light glass UI aesthetic',
      'Framer Motion scroll trigger animations',
      'Responsive interactive pricing toggles',
      'Integrated contact/newsletter modal'
    ],
    demoUrl: 'https://demo-nexus-landing.example.com',
    githubUrl: 'https://github.com/example/nexus-landing',
    status: 'Available',
    featured: true,
    published: true,
    sortOrder: 5,
  },
  {
    title: 'Vortex Admin Telemetry Dashboard',
    slug: 'vortex-admin-telemetry-dashboard',
    shortDescription: 'Enterprise admin dashboard kit with real-time websocket monitoring, data tables, and CSV exports.',
    description: 'A modular telemetry dashboard designed for high-scale backend services. Includes system health metrics, API latency breakdown, error rate logs, user activity streams, and configurable analytics cards.',
    category: 'Admin Dashboard',
    price: 8999,
    discountPrice: 6999,
    images: [
      { public_id: 'prod_vortex_admin_1', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Express', 'MongoDB', 'Chart.js', 'Tailwind CSS'],
    tags: ['Admin', 'Dashboard', 'Telemetry', 'Analytics', 'Monitoring'],
    features: [
      'Live metric charts & throughput meters',
      'Advanced datatable with sorting & pagination',
      'Export filtered logs to CSV & JSON',
      'Modular drag-and-drop card grid'
    ],
    demoUrl: 'https://demo-vortex-admin.example.com',
    githubUrl: 'https://github.com/example/vortex-admin',
    status: 'Available',
    featured: false,
    published: true,
    sortOrder: 6,
  }
];

const projectsData = [
  {
    title: 'Global FinTech Capital Portal',
    slug: 'global-fintech-capital-portal',
    shortDescription: 'A high-concurrency wealth management portal supporting multi-currency investment portfolios and live analytics.',
    description: 'We built a modern digital banking platform for a European wealth fund handling over $500M in assets under management. The system delivers sub-second chart updates, multi-tiered user authentication, and automated compliance auditing.',
    category: 'Finance',
    images: [
      { public_id: 'proj_fintech_1', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80' },
      { public_id: 'proj_fintech_2', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Docker'],
    tags: ['Case Study', 'FinTech', 'High Concurrency', 'Banking', 'MongoDB'],
    features: [
      'Sub-50ms investment transaction processing',
      'Real-time portfolio rebalancing engine',
      'KYC/AML verification workflow integration'
    ],
    problem: 'The client relied on legacy web architecture causing 4+ second page loads and transaction timeouts during peak market hours.',
    solution: 'Engineered a decoupled MERN stack application with cached MongoDB aggregations, delivering instant UI feedback and sub-second execution.',
    challenges: 'Ensuring absolute data consistency during high-volatility financial periods while maintaining zero downtime.',
    results: 'Reduced page latency by 85%, increased daily active user retention by 42%, and safely processed $120M in quarterly throughput.',
    demoUrl: 'https://fintech-capital.example.com',
    githubUrl: '',
    featured: true,
    published: true,
    sortOrder: 1,
  },
  {
    title: 'OmniChain Logistics ERP',
    slug: 'omnichain-logistics-erp',
    shortDescription: 'Bespoke supply-chain ERP tracking 10,000+ daily freight movement containers across North America.',
    description: 'OmniChain is a custom-engineered enterprise logistics portal that tracks driver routes, warehouse dock allocations, fleet fuel consumption, and customer delivery notifications in real time.',
    category: 'ERP',
    images: [
      { public_id: 'proj_logistics_1', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'WebSockets'],
    tags: ['ERP', 'Logistics', 'Supply Chain', 'Fleet Management'],
    features: [
      'Live GPS map fleet tracking',
      'Automated warehouse dock scheduling',
      'Driver mobile portal web app'
    ],
    problem: 'Manual spreadsheet tracking resulted in lost shipments and communication breakdowns between fleet dispatchers and warehouse managers.',
    solution: 'Developed a unified real-time logistics workspace connecting dispatchers, warehouse staff, and freight drivers in one view.',
    challenges: 'Handling loss of connectivity in remote transport zones while ensuring offline data sync upon reconnection.',
    results: 'Decreased freight delays by 34% and saved an estimated 1,200 administrative hours annually.',
    demoUrl: 'https://omnichain-erp.example.com',
    githubUrl: '',
    featured: true,
    published: true,
    sortOrder: 2,
  },
  {
    title: 'Veritas Health CRM Platform',
    slug: 'veritas-health-crm-platform',
    shortDescription: 'HIPAA-compliant medical clinic CRM for patient appointment scheduling, tele-health consults, and billing.',
    description: 'Built for a network of 14 specialty clinics, Veritas CRM manages patient intake, practitioner calendars, electronic health records (EHR) security, and automated SMS appointment reminders.',
    category: 'CRM',
    images: [
      { public_id: 'proj_health_1', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' }
    ],
    technologies: ['React', 'Express', 'MongoDB', 'Nodemailer', 'Tailwind CSS'],
    tags: ['CRM', 'Healthcare', 'Patient Portal', 'Scheduling'],
    features: [
      'Encrypted patient message exchange',
      'Automated appointment calendar sync',
      'Insurance claim status tracker'
    ],
    problem: 'High patient no-show rates (22%) and fragmented phone booking systems overloaded front-desk staff.',
    solution: 'Launched a patient portal with automated SMS/email reminders and instant online appointment self-scheduling.',
    challenges: 'Adhering to strict data protection standards while providing an intuitive non-technical user interface for elderly patients.',
    results: 'No-show rates dropped from 22% to 4%, and clinic patient onboarding time was reduced by half.',
    demoUrl: 'https://veritas-health.example.com',
    githubUrl: '',
    featured: true,
    published: true,
    sortOrder: 3,
  }
];

const seedDB = async () => {
  try {
    console.log('[Seeding] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seeding] Database connected successfully.');

    // Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Project.deleteMany();
    await Category.deleteMany();
    console.log('[Seeding] Cleared existing records.');

    // Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@devstudio.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';

    const admin = await User.create({
      name: 'Studio Master Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`[Seeding] Admin account created: ${admin.email}`);

    // Create Categories
    await Category.insertMany(categoriesData);
    console.log(`[Seeding] Created ${categoriesData.length} categories.`);

    // Create Products
    await Product.insertMany(productsData);
    console.log(`[Seeding] Created ${productsData.length} products.`);

    // Create Projects
    await Project.insertMany(projectsData);
    console.log(`[Seeding] Created ${projectsData.length} portfolio case study projects.`);

    console.log('\n==================================================');
    console.log(' SUCCESS: Database seeding complete!');
    console.log(` Admin Email: ${adminEmail}`);
    console.log(` Admin Password: ${adminPassword}`);
    console.log('==================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('[Seeding Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDB();
