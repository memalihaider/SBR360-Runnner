"use client";

// 'use client';

// import { useState, useRef, useEffect, useCallback } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';


// import {
//   ArrowUp,
//   ArrowDown,
//   Plus,
//   Minus,
//   Save,
//   Download,
//   Building2,
//   FileText,
//   Package,
//   DollarSign,
//   FileCheck,
//   Handshake,
//   Eye,
//   EyeOff,
//   GripVertical,
//   Image as ImageIcon,
//   Trash2,
//   Send
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // Firebase imports
// import { db } from '@/lib/firebase';
// import { collection, addDoc } from 'firebase/firestore';

import { generateQuotationPDF, downloadPDF } from '@/lib/pdf-generator';
import { saveQuotationDefaultsToCloud, loadQuotationDefaultsFromCloud } from '@/lib/quotationDefaults';
import { useAuthStore } from '@/stores/auth';

// // Mock data
// const mockData = {
//   customers: [
//     { id: '1', companyName: 'ABC Corporation', contactPerson: 'John Doe', email: 'john@abc.com', phone: '+1234567890' },
//     { id: '2', companyName: 'XYZ Ltd', contactPerson: 'Jane Smith', email: 'jane@xyz.com', phone: '+0987654321' },
//   ],
//   products: [
//     { id: '1', name: 'Website Development', description: 'Corporate website development', sellingPrice: 5000 },
//     { id: '2', name: 'Mobile App Development', description: 'iOS and Android app', sellingPrice: 8000 },
//   ],
//   companySettings: {
//     logoUrl: 'https://via.placeholder.com/150x50?text=Company+Logo',
//     companyName: 'SBR Technologies',
//     address: {
//       street: 'Business Bay',
//       city: 'Dubai',
//       state: 'Dubai',
//       zipCode: '12345',
//       country: 'UAE'
//     },
//     contact: {
//       phone: '+971 4 123 4567',
//       email: 'info@sbrtech.com',
//       website: 'www.sbrtech.com'
//     }
//   }
// };

// // Currency hook
// const useCurrency = () => {
//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   return { formatAmount };
// };

// interface QuotationSection {
//   id: string;
//   type: 'cover_page' | 'executive_summary' | 'company_introduction' | 'problem_statement' | 'solution_details' | 'product_specifications' | 'quotation_items' | 'timeline_schedule' | 'terms_warranties' | 'contact_information';
//   title: string;
//   enabled: boolean;
//   order: number;
//   data: any;
// }

// interface ProductDetail {
//   id: string;
//   productId: string;
//   quantity: number;
//   unitPrice: number;
//   discount: number;
//   description: string;
//   images: string[];
// }

// interface QuotationItem {
//   id: string;
//   itemId: string;
//   productId: string;
//   productName: string;
//   description: string;
//   quantity: number;
//   rate: number;
//   discount: number;
//   discountType: 'percentage' | 'fixed';
//   tax: number;
//   taxType: 'percentage' | 'fixed';
//   serviceCharges: number;
//   amount: number;
// }

// // Firebase mein quotation save karna
// const saveQuotationToFirebase = async (quotationData: any): Promise<string> => {
//   try {
//     const docRef = await addDoc(collection(db, 'quotations'), quotationData);
//     return docRef.id;
//   } catch (error) {
//     console.error('Error saving quotation to Firebase:', error);
//     throw error;
//   }
// };

// export default function NewQuotationPage() {
//   const { formatAmount } = useCurrency();
//   const router = useRouter();
  
//   // Main quotation state
//   const [quotationData, setQuotationData] = useState({
//     quotationNumber: `QT-${Date.now()}`,
//     customerId: '',
//     status: 'draft' as 'draft' | 'sent' | 'approved' | 'rejected',
//     issueDate: new Date().toISOString().split('T')[0],
//     validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//     notes: '',
//     terms: ''
//   });

//   const [sections, setSections] = useState<QuotationSection[]>([
//     {
//       id: 'cover_page',
//       type: 'cover_page',
//       title: 'Cover Page & Letter',
//       enabled: true,
//       order: 1,
//       data: {
//         companyLogo: mockData.companySettings.logoUrl,
//         companyName: mockData.companySettings.companyName,
//         companyAddress: `${mockData.companySettings.address.street}, ${mockData.companySettings.address.city}, ${mockData.companySettings.address.state} ${mockData.companySettings.address.zipCode}, ${mockData.companySettings.address.country}`,
//         companyPhone: mockData.companySettings.contact.phone,
//         companyEmail: mockData.companySettings.contact.email,
//         companyWebsite: mockData.companySettings.contact.website,
//         date: new Date().toISOString().split('T')[0],
//         recipientName: '',
//         recipientCompany: '',
//         recipientAddress: '',
//         recipientPhone: '',
//         recipientEmail: '',
//         subject: 'Proposal for Professional Services',
//         salutation: 'Dear [Recipient Name],',
//         letterContent: `We are pleased to submit this comprehensive proposal for your consideration. Our team has carefully analyzed your requirements and developed a tailored solution that meets your specific needs.

// This proposal outlines our understanding of your project requirements, our proposed solution, detailed specifications, pricing structure, and implementation timeline.

// We look forward to the opportunity to work with you and deliver exceptional results.`,
//         senderName: 'John Smith',
//         senderTitle: 'Business Development Manager',
//         senderPhone: '+971 50 123 4567',
//         senderEmail: 'john.smith@sbrtech.com'
//       }
//     },
//     {
//       id: 'executive_summary',
//       type: 'executive_summary',
//       title: 'Executive Summary',
//       enabled: true,
//       order: 2,
//       data: {
//         summary: `This proposal presents a comprehensive solution tailored to meet your specific business requirements. Our experienced team brings deep industry knowledge and proven methodologies to deliver exceptional results.

// Key highlights of our proposal include:
// • Customized solution addressing your unique challenges
// • Competitive pricing with flexible payment terms
// • Proven track record of successful project delivery
// • Comprehensive support and maintenance services
// • Commitment to quality and customer satisfaction

// We are confident that our solution will exceed your expectations and deliver significant value to your organization.`,
//         keyBenefits: [
//           'Cost-effective solution with ROI within 6 months',
//           'Streamlined processes reducing operational overhead by 30%',
//           'Scalable architecture supporting future growth',
//           '24/7 technical support and maintenance',
//           'Comprehensive training and knowledge transfer'
//         ],
//         proposalValue: '',
//         estimatedDuration: '3-6 months',
//         totalInvestment: ''
//       }
//     },
//     {
//       id: 'company_introduction',
//       type: 'company_introduction',
//       title: 'Company Introduction',
//       enabled: true,
//       order: 3,
//       data: {
//         companyLogo: 'https://via.placeholder.com/150x50?text=SBR+Logo',
//         description: 'SBR Technologies is a leading provider of enterprise software solutions, specializing in digital transformation, custom software development, and technology consulting services. With over 10 years of experience, we have successfully delivered projects for Fortune 500 companies and startups alike.',
//         foundedYear: '2015',
//         employeeCount: '50+',
//         officeLocations: ['Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE'],
//         certifications: ['ISO 9001:2015', 'ISO 27001', 'CMMI Level 3'],
//         achievements: [
//           '500+ Successful Projects Completed',
//           '50+ Enterprise Clients Served',
//           '98% Client Satisfaction Rate',
//           '10+ Years Industry Experience',
//           'Award-winning Development Team'
//         ],
//         coreValues: [
//           'Innovation & Excellence',
//           'Customer-Centric Approach',
//           'Quality & Reliability',
//           'Ethical Business Practices',
//           'Continuous Learning'
//         ],
//         companyImages: [
//           'https://via.placeholder.com/400x300?text=Office+Building',
//           'https://via.placeholder.com/400x300?text=Team+Photo',
//           'https://via.placeholder.com/400x300?text=Work+Environment'
//         ]
//       }
//     },
//     {
//       id: 'problem_statement',
//       type: 'problem_statement',
//       title: 'Problem Statement',
//       enabled: true,
//       order: 4,
//       data: {
//         clientChallenges: [
//           'Inefficient manual processes causing delays and errors',
//           'Lack of real-time visibility into business operations',
//           'Difficulty scaling operations with business growth',
//           'Data silos preventing comprehensive insights',
//           'Compliance and regulatory reporting challenges'
//         ],
//         currentSituation: `Your organization is currently facing several operational challenges that are impacting efficiency, scalability, and competitiveness. Manual processes, disparate systems, and lack of integration are creating bottlenecks that hinder productivity and decision-making capabilities.

// The current technology infrastructure is not equipped to handle growing business demands, leading to increased operational costs, reduced customer satisfaction, and missed opportunities for optimization.`,
//         impactAssessment: `These challenges are resulting in:
// • Increased operational costs (estimated 25-30% higher than optimized operations)
// • Reduced productivity and efficiency
// • Higher error rates and rework requirements
// • Delayed decision-making processes
// • Limited scalability for business growth
// • Reduced customer satisfaction scores`,
//         objectives: [
//           'Streamline and automate manual processes',
//           'Implement integrated systems for real-time visibility',
//           'Create scalable architecture for future growth',
//           'Establish comprehensive reporting and analytics',
//           'Ensure compliance with industry standards'
//         ],
//         successCriteria: [
//           '30% reduction in operational costs',
//           '50% improvement in process efficiency',
//           'Real-time visibility into all business operations',
//           'Scalable system supporting 200% growth capacity',
//           '100% compliance with regulatory requirements'
//         ]
//       }
//     },
//     {
//       id: 'solution_details',
//       type: 'solution_details',
//       title: 'Solution Details',
//       enabled: true,
//       order: 5,
//       data: {
//         approach: `Our solution approach is based on industry best practices and proven methodologies. We follow a structured implementation process that ensures quality, minimizes risks, and maximizes value delivery.

// Our methodology includes:
// • Comprehensive requirements analysis and planning
// • Agile development with iterative delivery
// • Quality assurance and testing at every stage
// • User training and change management
// • Post-implementation support and optimization`,
//         solutionOverview: `We propose a comprehensive solution that addresses all identified challenges through:

// 1. **Integrated Platform**: Unified system replacing disparate tools and processes
// 2. **Automation Engine**: Intelligent automation of repetitive tasks and workflows
// 3. **Analytics Dashboard**: Real-time insights and reporting capabilities
// 4. **Scalable Architecture**: Cloud-native design supporting future growth
// 5. **Security Framework**: Enterprise-grade security and compliance features

// This solution will transform your operations, improve efficiency, and position your organization for sustained growth.`,
//         keyFeatures: [
//           'Unified dashboard for all business operations',
//           'Automated workflow processing and approvals',
//           'Real-time analytics and reporting',
//           'Mobile-responsive design for remote access',
//           'Integration capabilities with existing systems',
//           'Advanced security and data protection',
//           'Scalable cloud infrastructure',
//           '24/7 system availability and monitoring'
//         ],
//         technicalApproach: `Our technical implementation follows industry standards and best practices:

// • **Frontend**: Modern React-based user interface with responsive design
// • **Backend**: Microservices architecture with RESTful APIs
// • **Database**: High-performance relational database with data warehousing capabilities
// • **Infrastructure**: Cloud-native deployment with auto-scaling and high availability
// • **Security**: Multi-layered security with encryption, access controls, and compliance features
// • **Integration**: API-first design enabling seamless integration with existing systems`,
//         benefits: [
//           'Improved operational efficiency and productivity',
//           'Reduced costs through automation and optimization',
//           'Enhanced decision-making with real-time insights',
//           'Increased scalability and flexibility',
//           'Better compliance and risk management',
//           'Improved customer experience and satisfaction'
//         ],
//         solutionImages: [
//           'https://via.placeholder.com/500x300?text=Solution+Architecture',
//           'https://via.placeholder.com/500x300?text=User+Interface+Mockup',
//           'https://via.placeholder.com/500x300?text=Workflow+Diagram'
//         ]
//       }
//     },
//     {
//       id: 'product_specifications',
//       type: 'product_specifications',
//       title: 'Product & Service Specifications',
//       enabled: true,
//       order: 6,
//       data: {
//         products: [] as ProductDetail[],
//         technicalSpecifications: {
//           platform: 'Web-based SaaS Platform',
//           technology: 'React, Node.js, PostgreSQL, AWS Cloud',
//           mobileSupport: 'Responsive design for all devices',
//           browserSupport: 'Chrome, Firefox, Safari, Edge (latest versions)',
//           apiIntegration: 'RESTful APIs with OAuth 2.0 authentication',
//           dataSecurity: 'AES-256 encryption, SSL/TLS, GDPR compliance',
//           backup: 'Automated daily backups with disaster recovery',
//           uptime: '99.9% SLA with 24/7 monitoring'
//         },
//         serviceSpecifications: [
//           {
//             service: 'Implementation & Deployment',
//             description: 'Complete system setup, configuration, and deployment',
//             deliverables: ['System installation', 'Data migration', 'User training', 'Go-live support'],
//             timeline: '4-6 weeks'
//           },
//           {
//             service: 'Customization & Integration',
//             description: 'Tailored modifications and third-party system integration',
//             deliverables: ['Custom development', 'API integration', 'Testing', 'Documentation'],
//             timeline: '2-4 weeks'
//           },
//           {
//             service: 'Training & Support',
//             description: 'Comprehensive training and ongoing technical support',
//             deliverables: ['User training sessions', 'Admin training', '24/7 support', 'Knowledge base'],
//             timeline: 'Ongoing'
//           }
//         ],
//         complianceStandards: [
//           'ISO 27001 Information Security Management',
//           'GDPR Data Protection Compliance',
//           'SOC 2 Type II Security Controls',
//           'PCI DSS Payment Card Industry Standards',
//           'HIPAA Health Insurance Portability (if applicable)'
//         ]
//       }
//     },
//     {
//       id: 'quotation_items',
//       type: 'quotation_items',
//       title: 'Quotation Items',
//       enabled: true,
//       order: 7,
//       data: {
//         items: [] as QuotationItem[],
//         subtotal: 0,
//         totalDiscount: 0,
//         totalTax: 0,
//         serviceCharges: 0,
//         grandTotal: 0,
//         currency: 'AED',
//         notes: ''
//       }
//     },
//     {
//       id: 'timeline_schedule',
//       type: 'timeline_schedule',
//       title: 'Timeline & Delivery Schedule',
//       enabled: true,
//       order: 8,
//       data: {
//         totalDuration: '16 weeks',
//         startDate: '',
//         endDate: '',
//         phases: [
//           {
//             name: 'Planning & Analysis',
//             duration: '2 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Requirements gathering',
//               'System analysis',
//               'Project plan development',
//               'Resource allocation'
//             ],
//             milestones: ['Kickoff meeting', 'Requirements signoff']
//           },
//           {
//             name: 'Design & Development',
//             duration: '8 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'System design documents',
//               'UI/UX mockups',
//               'Database design',
//               'Core functionality development',
//               'Integration development'
//             ],
//             milestones: ['Design approval', 'Development completion', 'Testing phase start']
//           },
//           {
//             name: 'Testing & Quality Assurance',
//             duration: '3 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Unit testing',
//               'Integration testing',
//               'User acceptance testing',
//               'Performance testing',
//               'Security testing'
//             ],
//             milestones: ['QA completion', 'UAT signoff']
//           },
//           {
//             name: 'Deployment & Training',
//             duration: '3 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Production deployment',
//               'Data migration',
//               'User training sessions',
//               'Documentation delivery',
//               'Go-live support'
//             ],
//             milestones: ['Go-live', 'Training completion', 'Project closure']
//           }
//         ],
//         criticalPath: [
//           'Requirements analysis completion',
//           'Design approval',
//           'Development milestone reviews',
//           'Testing completion',
//           'User acceptance signoff'
//         ],
//         dependencies: [
//           'Phase 2 cannot start until Phase 1 requirements are approved',
//           'Phase 3 testing requires Phase 2 development completion',
//           'Phase 4 deployment requires Phase 3 testing signoff'
//         ],
//         risks: [
//           {
//             risk: 'Resource availability',
//             impact: 'Medium',
//             mitigation: 'Backup resource planning and cross-training'
//           },
//           {
//             risk: 'Third-party integration delays',
//             impact: 'High',
//             mitigation: 'Early vendor engagement and contingency planning'
//           },
//           {
//             risk: 'Scope changes',
//             impact: 'Medium',
//             mitigation: 'Change control process and regular scope reviews'
//           }
//         ]
//       }
//     },
//     {
//       id: 'terms_warranties',
//       type: 'terms_warranties',
//       title: 'Terms & Warranties',
//       enabled: true,
//       order: 9,
//       data: {
//         generalTerms: `1. **Acceptance**: This proposal constitutes the entire agreement between the parties.
// 2. **Validity**: This proposal is valid for 30 days from the date of submission.
// 3. **Payment Terms**: All payments must be made according to the agreed schedule.
// 4. **Intellectual Property**: All deliverables remain the property of the client upon full payment.
// 5. **Confidentiality**: Both parties agree to maintain confidentiality of proprietary information.`,
//         warranties: [
//           {
//             item: 'Software Functionality',
//             warranty: '12 months from go-live date',
//             coverage: 'Bugs and defects in core functionality',
//             exclusions: 'Custom modifications, third-party integrations'
//           },
//           {
//             item: 'System Performance',
//             warranty: '99.5% uptime SLA',
//             coverage: 'System availability and performance',
//             exclusions: 'Scheduled maintenance, force majeure events'
//           },
//           {
//             item: 'Data Security',
//             warranty: 'Industry-standard security measures',
//             coverage: 'Data protection and privacy compliance',
//             exclusions: 'Client data breaches due to misuse'
//           }
//         ],
//         limitations: `• Warranty does not cover damages due to misuse or unauthorized modifications
// • Warranty is limited to the original specifications and scope
// • Third-party components are covered by their respective vendor warranties
// • Warranty claims must be reported within 30 days of discovery`,
//         supportServices: {
//           included: [
//             '24/7 system monitoring',
//             'Email support during business hours',
//             'Phone support for critical issues',
//             'Regular system updates and patches',
//             'Knowledge base and documentation access'
//           ],
//           optional: [
//             'Dedicated support engineer',
//             'On-site support visits',
//             'Extended warranty coverage',
//             'Custom training sessions',
//             'Emergency response service'
//           ]
//         },
//         terminationClauses: `Either party may terminate this agreement with 30 days written notice. In case of termination:
// • Client will pay for all services rendered up to termination date
// • All intellectual property rights transfer to client
// • Confidential information remains protected
// • Outstanding payments become immediately due`,
//         governingLaw: 'United Arab Emirates',
//         disputeResolution: 'Arbitration in Dubai International Arbitration Centre'
//       }
//     },
//     {
//       id: 'contact_information',
//       type: 'contact_information',
//       title: 'Contact Information & Signatures',
//       enabled: true,
//       order: 10,
//       data: {
//         companyContacts: [
//           {
//             name: 'John Smith',
//             title: 'Business Development Manager',
//             phone: '+971 50 123 4567',
//             email: 'john.smith@sbrtech.com',
//             department: 'Sales'
//           },
//           {
//             name: 'Sarah Johnson',
//             title: 'Project Manager',
//             phone: '+971 50 765 4321',
//             email: 'sarah.johnson@sbrtech.com',
//             department: 'Delivery'
//           },
//           {
//             name: 'Mike Davis',
//             title: 'Technical Lead',
//             phone: '+971 50 987 6543',
//             email: 'mike.davis@sbrtech.com',
//             department: 'Technical'
//           }
//         ],
//         clientContacts: [
//           {
//             name: '',
//             title: '',
//             phone: '',
//             email: '',
//             department: ''
//           }
//         ],
//         signatures: {
//           clientSignature: '',
//           clientName: '',
//           clientTitle: '',
//           clientDate: '',
//           companySignature: 'John Smith',
//           companyTitle: 'Business Development Manager',
//           companyDate: new Date().toISOString().split('T')[0]
//         },
//         nextSteps: [
//           'Review and approval of proposal',
//           'Contract signing and legal review',
//           'Project kickoff meeting scheduling',
//           'Resource allocation and team assignment',
//           'Detailed project planning and timeline confirmation'
//         ],
//         additionalNotes: ''
//       }
//     }
//   ]);

//   const [draggedSection, setDraggedSection] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const customers = mockData.customers;
//   const products = mockData.products;

//   // Calculate totals function with useCallback to prevent infinite re-renders
//   const calculateTotals = useCallback(() => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (!quotationSection) return;

//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalTax = 0;

//     quotationSection.data.items.forEach((item: QuotationItem) => {
//       const itemSubtotal = item.quantity * item.rate;
//       const itemDiscount = item.discountType === 'percentage'
//         ? itemSubtotal * (item.discount / 100)
//         : item.discount;
//       const itemTax = item.taxType === 'percentage'
//         ? (itemSubtotal - itemDiscount) * (item.tax / 100)
//         : item.tax;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalTax += itemTax;
//     });

//     const grandTotal = subtotal - totalDiscount + totalTax + quotationSection.data.serviceCharges;

//     // Only update if values actually changed
//     if (quotationSection.data.subtotal !== subtotal || 
//         quotationSection.data.totalDiscount !== totalDiscount || 
//         quotationSection.data.totalTax !== totalTax || 
//         quotationSection.data.grandTotal !== grandTotal) {
      
//       const updatedSections = sections.map(section =>
//         section.id === 'quotation_items'
//           ? { ...section, data: { ...section.data, subtotal, totalDiscount, totalTax, grandTotal } }
//           : section
//       );
//       setSections(updatedSections);
//     }
//   }, [sections]);

//   // Use effect with proper dependencies
//   useEffect(() => {
//     calculateTotals();
//   }, [calculateTotals]);

//   const moveSection = (fromIndex: number, toIndex: number) => {
//     const newSections = [...sections];
//     const [moved] = newSections.splice(fromIndex, 1);
//     newSections.splice(toIndex, 0, moved);

//     newSections.forEach((section, index) => {
//       section.order = index + 1;
//     });

//     setSections(newSections);
//   };

//   const toggleSection = (sectionId: string) => {
//     setSections(sections.map(section =>
//       section.id === sectionId
//         ? { ...section, enabled: !section.enabled }
//         : section
//     ));
//   };

//   const updateSectionData = (sectionId: string, data: any) => {
//     setSections(sections.map(section =>
//       section.id === sectionId
//         ? { ...section, data: { ...section.data, ...data } }
//         : section
//     ));
//   };

//   const addProductDetail = () => {
//     const productSection = sections.find(s => s.type === 'product_specifications');
//     if (productSection) {
//       const newProduct: ProductDetail = {
//         id: `product_${Date.now()}`,
//         productId: '',
//         quantity: 1,
//         unitPrice: 0,
//         discount: 0,
//         description: '',
//         images: []
//       };

//       updateSectionData('product_specifications', {
//         products: [...productSection.data.products, newProduct]
//       });
//     }
//   };

//   const removeProductDetail = (productId: string) => {
//     const productSection = sections.find(s => s.type === 'product_specifications');
//     if (productSection) {
//       updateSectionData('product_specifications', {
//         products: productSection.data.products.filter((p: ProductDetail) => p.id !== productId)
//       });
//     }
//   };

//   const updateProductDetail = (productId: string, data: Partial<ProductDetail>) => {
//     const productSection = sections.find(s => s.type === 'product_specifications');
//     if (productSection) {
//       updateSectionData('product_specifications', {
//         products: productSection.data.products.map((p: ProductDetail) =>
//           p.id === productId ? { ...p, ...data } : p
//         )
//       });
//     }
//   };

//   const addQuotationItem = () => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       const newItem: QuotationItem = {
//         id: `item_${Date.now()}`,
//         itemId: `Q${(quotationSection.data.items.length + 1).toString().padStart(3, '0')}`,
//         productId: '',
//         productName: '',
//         description: '',
//         quantity: 1,
//         rate: 0,
//         discount: 0,
//         discountType: 'percentage',
//         tax: 0,
//         taxType: 'percentage',
//         serviceCharges: 0,
//         amount: 0
//       };

//       updateSectionData('quotation_items', {
//         items: [...quotationSection.data.items, newItem]
//       });
//     }
//   };

//   const removeQuotationItem = (itemId: string) => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       updateSectionData('quotation_items', {
//         items: quotationSection.data.items.filter((item: QuotationItem) => item.id !== itemId)
//       });
//     }
//   };

//   const updateQuotationItem = (itemId: string, data: Partial<QuotationItem>) => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       const updatedItems = quotationSection.data.items.map((item: QuotationItem) => {
//         if (item.id === itemId) {
//           const updatedItem = { ...item, ...data };
          
//           // Calculate amount for this item only
//           const subtotal = updatedItem.quantity * updatedItem.rate;
//           const discountAmount = updatedItem.discountType === 'percentage'
//             ? subtotal * (updatedItem.discount / 100)
//             : updatedItem.discount;
//           const taxableAmount = subtotal - discountAmount;
//           const taxAmount = updatedItem.taxType === 'percentage'
//             ? taxableAmount * (updatedItem.tax / 100)
//             : updatedItem.tax;
//           updatedItem.amount = taxableAmount + taxAmount + updatedItem.serviceCharges;
          
//           return updatedItem;
//         }
//         return item;
//       });

//       updateSectionData('quotation_items', { items: updatedItems });
//     }
//   };

//   const handleDragStart = (e: React.DragEvent, sectionId: string) => {
//     setDraggedSection(sectionId);
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
//     e.preventDefault();
//     if (!draggedSection || draggedSection === targetSectionId) return;

//     const fromIndex = sections.findIndex(s => s.id === draggedSection);
//     const toIndex = sections.findIndex(s => s.id === targetSectionId);

//     moveSection(fromIndex, toIndex);
//     setDraggedSection(null);
//   };

//   // Save quotation function - Firebase compatible
//   const saveQuotation = async (status: 'draft' | 'sent' = 'draft') => {
//     setLoading(true);
//     try {
//       const quotationSection = sections.find(s => s.type === 'quotation_items');
//       const customer = customers.find(c => c.id === quotationData.customerId);

//       if (!customer) {
//         alert('Please select a customer');
//         setLoading(false);
//         return;
//       }

//       const finalQuotationData = {
//         ...quotationData,
//         status,
//         customerName: customer.contactPerson,
//         customerCompany: customer.companyName,
//         customerEmail: customer.email,
//         customerPhone: customer.phone,
//         sections: sections.filter(s => s.enabled),
//         items: quotationSection?.data.items || [],
//         subtotal: quotationSection?.data.subtotal || 0,
//         totalDiscount: quotationSection?.data.totalDiscount || 0,
//         totalTax: quotationSection?.data.totalTax || 0,
//         serviceCharges: quotationSection?.data.serviceCharges || 0,
//         totalAmount: quotationSection?.data.grandTotal || 0,
//         createdBy: 'admin',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Firebase mein save karein
//       const quotationId = await saveQuotationToFirebase(finalQuotationData);
      
//       alert(`Quotation ${status === 'draft' ? 'saved as draft' : 'sent'} successfully!`);
      
//       if (status === 'sent') {
//         router.push('/admin/sales/quotations');
//       }
//     } catch (error) {
//       console.error('Error saving quotation:', error);
//       alert('Error saving quotation');
//     } finally {
//       setLoading(false);
//     }
//   };

// // Replace the existing generatePDF function with this:

// const generatePDF = async () => {
//   setLoading(true);
//   try {
//     // Create a new PDF instance
//     const pdf = new jsPDF('p', 'mm', 'a4');
//     let currentPage = 1;
//     const pageHeight = pdf.internal.pageSize.height;
//     const pageWidth = pdf.internal.pageSize.width;
//     const margin = 20;
//     let yPosition = margin;

//     // Get enabled sections
//     const enabledSections = sections.filter(s => s.enabled);
//     const customer = customers.find(c => c.id === quotationData.customerId);

//     // Helper function to add text with page break
//     const addTextWithPageBreak = (text: string, fontSize: number = 12, isBold: boolean = false, lineHeight: number = 7) => {
//       pdf.setFontSize(fontSize);
//       pdf.setFont(isBold ? 'helvetica' : 'helvetica', isBold ? 'bold' : 'normal');
      
//       const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      
//       for (let i = 0; i < lines.length; i++) {
//         if (yPosition + lineHeight > pageHeight - margin) {
//           pdf.addPage();
//           currentPage++;
//           yPosition = margin;
//         }
//         pdf.text(lines[i], margin, yPosition);
//         yPosition += lineHeight;
//       }
//       yPosition += 2;
//     };

//     // Helper function to add section header
//     const addSectionHeader = (title: string) => {
//       if (yPosition + 15 > pageHeight - margin) {
//         pdf.addPage();
//         currentPage++;
//         yPosition = margin;
//       }
//       addTextWithPageBreak(title, 16, true, 10);
//       pdf.setDrawColor(200, 200, 200);
//       pdf.line(margin, yPosition, pageWidth - margin, yPosition);
//       yPosition += 5;
//     };

//     // Cover Page
//     addSectionHeader('QUOTATION PROPOSAL');
//     yPosition += 10;

//     // Company Information
//     const coverSection = sections.find(s => s.type === 'cover_page');
//     if (coverSection) {
//       addTextWithPageBreak(coverSection.data.companyName, 14, true);
//       addTextWithPageBreak(coverSection.data.companyAddress, 10);
//       addTextWithPageBreak(`Phone: ${coverSection.data.companyPhone}`, 10);
//       addTextWithPageBreak(`Email: ${coverSection.data.companyEmail}`, 10);
//       addTextWithPageBreak(`Website: ${coverSection.data.companyWebsite}`, 10);
//       yPosition += 10;
//     }

//     // Recipient Information
//     if (customer) {
//       addTextWithPageBreak('To:', 12, true);
//       addTextWithPageBreak(customer.contactPerson, 12);
//       addTextWithPageBreak(customer.companyName, 12);
//       addTextWithPageBreak(`Email: ${customer.email}`, 10);
//       addTextWithPageBreak(`Phone: ${customer.phone}`, 10);
//       yPosition += 10;
//     }

//     // Quotation Details
//     addTextWithPageBreak(`Quotation Number: ${quotationData.quotationNumber}`, 12);
//     addTextWithPageBreak(`Issue Date: ${new Date(quotationData.issueDate).toLocaleDateString()}`, 12);
//     addTextWithPageBreak(`Valid Until: ${new Date(quotationData.validUntil).toLocaleDateString()}`, 12);
//     yPosition += 15;

//     // Cover Letter
//     if (coverSection?.data.letterContent) {
//       addTextWithPageBreak('Dear Valued Client,', 12);
//       addTextWithPageBreak(coverSection.data.letterContent, 11);
//       yPosition += 10;
//     }

//     // Process each enabled section
//     for (const section of enabledSections) {
//       if (section.type === 'cover_page') continue; // Skip cover page as we already processed it
      
//       // Add page break for new section
//       if (yPosition + 30 > pageHeight - margin) {
//         pdf.addPage();
//         currentPage++;
//         yPosition = margin;
//       }

//       addSectionHeader(section.title.toUpperCase());

//       switch (section.type) {
//         case 'executive_summary':
//           if (section.data.summary) {
//             addTextWithPageBreak(section.data.summary, 11);
//           }
//           if (section.data.keyBenefits && section.data.keyBenefits.length > 0) {
//             yPosition += 5;
//             addTextWithPageBreak('Key Benefits:', 12, true);
//             section.data.keyBenefits.forEach((benefit: string) => {
//               addTextWithPageBreak(`• ${benefit}`, 11);
//             });
//           }
//           break;

//         case 'company_introduction':
//           if (section.data.description) {
//             addTextWithPageBreak(section.data.description, 11);
//           }
//           if (section.data.achievements && section.data.achievements.length > 0) {
//             yPosition += 5;
//             addTextWithPageBreak('Achievements:', 12, true);
//             section.data.achievements.forEach((achievement: string) => {
//               addTextWithPageBreak(`• ${achievement}`, 11);
//             });
//           }
//           break;

//         case 'problem_statement':
//           if (section.data.currentSituation) {
//             addTextWithPageBreak(section.data.currentSituation, 11);
//           }
//           if (section.data.objectives && section.data.objectives.length > 0) {
//             yPosition += 5;
//             addTextWithPageBreak('Objectives:', 12, true);
//             section.data.objectives.forEach((objective: string) => {
//               addTextWithPageBreak(`• ${objective}`, 11);
//             });
//           }
//           break;

//         case 'solution_details':
//           if (section.data.solutionOverview) {
//             addTextWithPageBreak(section.data.solutionOverview, 11);
//           }
//           if (section.data.keyFeatures && section.data.keyFeatures.length > 0) {
//             yPosition += 5;
//             addTextWithPageBreak('Key Features:', 12, true);
//             section.data.keyFeatures.forEach((feature: string) => {
//               addTextWithPageBreak(`• ${feature}`, 11);
//             });
//           }
//           break;

//         case 'product_specifications':
//           if (section.data.products && section.data.products.length > 0) {
//             addTextWithPageBreak('Products & Services:', 12, true);
//             section.data.products.forEach((product: ProductDetail, index: number) => {
//               const selectedProduct = products.find(p => p.id === product.productId);
//               if (selectedProduct) {
//                 addTextWithPageBreak(`${index + 1}. ${selectedProduct.name}`, 11, true);
//                 addTextWithPageBreak(`   Description: ${product.description || selectedProduct.description}`, 10);
//                 addTextWithPageBreak(`   Quantity: ${product.quantity}`, 10);
//                 addTextWithPageBreak(`   Unit Price: ${formatAmount(product.unitPrice)}`, 10);
//                 addTextWithPageBreak(`   Discount: ${product.discount}%`, 10);
//                 const lineTotal = (product.quantity * product.unitPrice) * (1 - product.discount / 100);
//                 addTextWithPageBreak(`   Line Total: ${formatAmount(lineTotal)}`, 10);
//                 yPosition += 2;
//               }
//             });
//           }
//           break;

//         case 'quotation_items':
//           if (section.data.items && section.data.items.length > 0) {
//             addTextWithPageBreak('Quotation Items:', 12, true);
            
//             // Table header
//             const tableTop = yPosition;
//             pdf.setFontSize(10);
//             pdf.setFont('helvetica', 'bold');
//             pdf.text('Item', margin, yPosition);
//             pdf.text('Description', margin + 30, yPosition);
//             pdf.text('Qty', margin + 100, yPosition);
//             pdf.text('Rate', margin + 120, yPosition);
//             pdf.text('Amount', margin + 150, yPosition);
//             yPosition += 5;
//             pdf.line(margin, yPosition, pageWidth - margin, yPosition);
//             yPosition += 3;

//             // Table rows
//             pdf.setFont('helvetica', 'normal');
//             section.data.items.forEach((item: QuotationItem, index: number) => {
//               if (yPosition + 15 > pageHeight - margin) {
//                 pdf.addPage();
//                 currentPage++;
//                 yPosition = margin + 20;
//               }
              
//               pdf.text((index + 1).toString(), margin, yPosition);
//               pdf.text(item.productName.substring(0, 20), margin + 10, yPosition);
//               pdf.text(item.description.substring(0, 25), margin + 30, yPosition);
//               pdf.text(item.quantity.toString(), margin + 100, yPosition);
//               pdf.text(formatAmount(item.rate), margin + 120, yPosition);
//               pdf.text(formatAmount(item.amount), margin + 150, yPosition);
//               yPosition += 6;
//             });

//             yPosition += 10;

//             // Summary
//             addTextWithPageBreak('Summary:', 12, true);
//             addTextWithPageBreak(`Subtotal: ${formatAmount(section.data.subtotal)}`, 11);
//             addTextWithPageBreak(`Discount: -${formatAmount(section.data.totalDiscount)}`, 11);
//             addTextWithPageBreak(`Tax: ${formatAmount(section.data.totalTax)}`, 11);
//             addTextWithPageBreak(`Service Charges: ${formatAmount(section.data.serviceCharges)}`, 11);
//             addTextWithPageBreak(`Grand Total: ${formatAmount(section.data.grandTotal)}`, 14, true);
//           }
//           break;

//         case 'timeline_schedule':
//           if (section.data.phases && section.data.phases.length > 0) {
//             addTextWithPageBreak('Project Timeline:', 12, true);
//             section.data.phases.forEach((phase: any, index: number) => {
//               addTextWithPageBreak(`${index + 1}. ${phase.name} (${phase.duration})`, 11, true);
//               if (phase.deliverables && phase.deliverables.length > 0) {
//                 phase.deliverables.forEach((deliverable: string) => {
//                   addTextWithPageBreak(`   • ${deliverable}`, 10);
//                 });
//               }
//               yPosition += 2;
//             });
//           }
//           break;

//         case 'terms_warranties':
//           if (section.data.generalTerms) {
//             addTextWithPageBreak('Terms & Conditions:', 12, true);
//             addTextWithPageBreak(section.data.generalTerms, 10);
//           }
//           break;

//         case 'contact_information':
//           if (section.data.companyContacts && section.data.companyContacts.length > 0) {
//             addTextWithPageBreak('Contact Information:', 12, true);
//             section.data.companyContacts.forEach((contact: any) => {
//               addTextWithPageBreak(`${contact.name} - ${contact.title}`, 11);
//               addTextWithPageBreak(`Phone: ${contact.phone} | Email: ${contact.email}`, 10);
//               yPosition += 2;
//             });
//           }
//           break;
//       }

//       yPosition += 10;
//     }

//     // Footer with page numbers
//     const totalPages = (pdf.internal as any).getNumberOfPages();
//     for (let i = 1; i <= totalPages; i++) {
//       pdf.setPage(i);
//       pdf.setFontSize(8);
//       pdf.setTextColor(128, 128, 128);
//       pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
//       pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
//     }

//     // Save the PDF
//     pdf.save(`quotation-${quotationData.quotationNumber}.pdf`);
    
//     alert('PDF generated successfully!');
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     alert('Error generating PDF. Please try again.');
//   } finally {
//     setLoading(false);
//   }
// };

//   // Render functions for all sections (exactly as in your original code)
//   const renderCoverPage = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <h4 className="font-semibold text-lg">Company Information</h4>
//           <div className="space-y-3">
//             <div className="space-y-2">
//               <Label htmlFor="companyLogo">Company Logo URL</Label>
//               <Input
//                 id="companyLogo"
//                 value={section.data.companyLogo}
//                 onChange={(e) => updateSectionData(section.id, { companyLogo: e.target.value })}
//                 placeholder="https://example.com/logo.png"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="companyName">Company Name</Label>
//               <Input
//                 id="companyName"
//                 value={section.data.companyName}
//                 onChange={(e) => updateSectionData(section.id, { companyName: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="companyAddress">Company Address</Label>
//               <Textarea
//                 id="companyAddress"
//                 value={section.data.companyAddress}
//                 onChange={(e) => updateSectionData(section.id, { companyAddress: e.target.value })}
//                 rows={3}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <h4 className="font-semibold text-lg">Recipient Information</h4>
//           <div className="space-y-3">
//             <div className="space-y-2">
//               <Label htmlFor="recipientName">Recipient Name</Label>
//               <Input
//                 id="recipientName"
//                 value={section.data.recipientName}
//                 onChange={(e) => updateSectionData(section.id, { recipientName: e.target.value })}
//                 placeholder="Enter recipient name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="recipientCompany">Company</Label>
//               <Input
//                 id="recipientCompany"
//                 value={section.data.recipientCompany}
//                 onChange={(e) => updateSectionData(section.id, { recipientCompany: e.target.value })}
//                 placeholder="Enter company name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="recipientEmail">Email</Label>
//               <Input
//                 id="recipientEmail"
//                 type="email"
//                 value={section.data.recipientEmail}
//                 onChange={(e) => updateSectionData(section.id, { recipientEmail: e.target.value })}
//                 placeholder="Enter email address"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Cover Letter</h4>
//         <div className="space-y-3">
//           <div className="space-y-2">
//             <Label htmlFor="subject">Subject</Label>
//             <Input
//               id="subject"
//               value={section.data.subject}
//               onChange={(e) => updateSectionData(section.id, { subject: e.target.value })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="salutation">Salutation</Label>
//             <Input
//               id="salutation"
//               value={section.data.salutation}
//               onChange={(e) => updateSectionData(section.id, { salutation: e.target.value })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="letterContent">Letter Content</Label>
//             <Textarea
//               id="letterContent"
//               value={section.data.letterContent}
//               onChange={(e) => updateSectionData(section.id, { letterContent: e.target.value })}
//               rows={8}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderExecutiveSummary = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <Label htmlFor="summary">Executive Summary</Label>
//         <Textarea
//           id="summary"
//           value={section.data.summary}
//           onChange={(e) => updateSectionData(section.id, { summary: e.target.value })}
//           rows={8}
//           className="text-lg leading-relaxed"
//         />
//       </div>

//       <div className="space-y-4">
//         <Label>Key Benefits</Label>
//         <div className="space-y-2">
//           {section.data.keyBenefits.map((benefit: string, index: number) => (
//             <div key={index} className="flex items-center space-x-2">
//               <span className="text-green-600 font-bold">•</span>
//               <Input
//                 value={benefit}
//                 onChange={(e) => {
//                   const newBenefits = [...section.data.keyBenefits];
//                   newBenefits[index] = e.target.value;
//                   updateSectionData(section.id, { keyBenefits: newBenefits });
//                 }}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="proposalValue">Proposal Value</Label>
//           <Input
//             id="proposalValue"
//             value={section.data.proposalValue}
//             onChange={(e) => updateSectionData(section.id, { proposalValue: e.target.value })}
//             placeholder="e.g., $500,000"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="estimatedDuration">Estimated Duration</Label>
//           <Input
//             id="estimatedDuration"
//             value={section.data.estimatedDuration}
//             onChange={(e) => updateSectionData(section.id, { estimatedDuration: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="totalInvestment">Total Investment</Label>
//           <Input
//             id="totalInvestment"
//             value={section.data.totalInvestment}
//             onChange={(e) => updateSectionData(section.id, { totalInvestment: e.target.value })}
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderCompanyIntroduction = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* Company Logo and Basic Info */}
//       <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//         <img
//           src={section.data.companyLogo}
//           alt="Company Logo"
//           className="h-20 w-20 object-contain rounded-lg border"
//         />
//         <div className="space-y-2">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="foundedYear">Founded Year</Label>
//               <Input
//                 id="foundedYear"
//                 value={section.data.foundedYear}
//                 onChange={(e) => updateSectionData(section.id, { foundedYear: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="employeeCount">Employee Count</Label>
//               <Input
//                 id="employeeCount"
//                 value={section.data.employeeCount}
//                 onChange={(e) => updateSectionData(section.id, { employeeCount: e.target.value })}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Company Description */}
//       <div className="space-y-2">
//         <Label htmlFor="description">Company Description</Label>
//         <Textarea
//           id="description"
//           value={section.data.description}
//           onChange={(e) => updateSectionData(section.id, { description: e.target.value })}
//           rows={4}
//         />
//       </div>

//       {/* Office Locations */}
//       <div className="space-y-2">
//         <Label>Office Locations</Label>
//         <div className="flex flex-wrap gap-2">
//           {section.data.officeLocations.map((location: string, index: number) => (
//             <Badge key={index} variant="secondary" className="px-3 py-1">
//               {location}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       {/* Certifications */}
//       <div className="space-y-2">
//         <Label>Certifications</Label>
//         <div className="flex flex-wrap gap-2">
//           {section.data.certifications.map((cert: string, index: number) => (
//             <Badge key={index} variant="outline" className="px-3 py-1 border-blue-200 text-blue-700">
//               {cert}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       {/* Achievements */}
//       <div className="space-y-2">
//         <Label>Achievements</Label>
//         <div className="grid grid-cols-2 gap-2">
//           {section.data.achievements.map((achievement: string, index: number) => (
//             <Input
//               key={index}
//               value={achievement}
//               onChange={(e) => {
//                 const newAchievements = [...section.data.achievements];
//                 newAchievements[index] = e.target.value;
//                 updateSectionData(section.id, { achievements: newAchievements });
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Core Values */}
//       <div className="space-y-2">
//         <Label>Core Values</Label>
//         <div className="grid grid-cols-2 gap-2">
//           {section.data.coreValues.map((value: string, index: number) => (
//             <Input
//               key={index}
//               value={value}
//               onChange={(e) => {
//                 const newValues = [...section.data.coreValues];
//                 newValues[index] = e.target.value;
//                 updateSectionData(section.id, { coreValues: newValues });
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Company Images */}
//       <div className="space-y-4">
//         <Label>Company Images</Label>
//         <div className="grid grid-cols-3 gap-4">
//           {section.data.companyImages.map((image: string, index: number) => (
//             <div key={index} className="space-y-2">
//               <img
//                 src={image}
//                 alt={`Company ${index + 1}`}
//                 className="w-full h-32 object-cover rounded-lg border"
//               />
//               <Input
//                 value={image}
//                 onChange={(e) => {
//                   const newImages = [...section.data.companyImages];
//                   newImages[index] = e.target.value;
//                   updateSectionData(section.id, { companyImages: newImages });
//                 }}
//                 placeholder="Image URL"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderProblemStatement = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* Client Challenges */}
//       <div className="space-y-4">
//         <Label>Client Challenges</Label>
//         <div className="space-y-2">
//           {section.data.clientChallenges.map((challenge: string, index: number) => (
//             <div key={index} className="flex items-start space-x-2">
//               <span className="text-red-600 font-bold mt-1">•</span>
//               <Textarea
//                 value={challenge}
//                 onChange={(e) => {
//                   const newChallenges = [...section.data.clientChallenges];
//                   newChallenges[index] = e.target.value;
//                   updateSectionData(section.id, { clientChallenges: newChallenges });
//                 }}
//                 rows={2}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Current Situation */}
//       <div className="space-y-2">
//         <Label htmlFor="currentSituation">Current Situation Analysis</Label>
//         <Textarea
//           id="currentSituation"
//           value={section.data.currentSituation}
//           onChange={(e) => updateSectionData(section.id, { currentSituation: e.target.value })}
//           rows={6}
//         />
//       </div>

//       {/* Impact Assessment */}
//       <div className="space-y-2">
//         <Label htmlFor="impactAssessment">Impact Assessment</Label>
//         <Textarea
//           id="impactAssessment"
//           value={section.data.impactAssessment}
//           onChange={(e) => updateSectionData(section.id, { impactAssessment: e.target.value })}
//           rows={4}
//         />
//       </div>

//       {/* Objectives */}
//       <div className="space-y-4">
//         <Label>Project Objectives</Label>
//         <div className="space-y-2">
//           {section.data.objectives.map((objective: string, index: number) => (
//             <div key={index} className="flex items-start space-x-2">
//               <span className="text-green-600 font-bold mt-1">✓</span>
//               <Textarea
//                 value={objective}
//                 onChange={(e) => {
//                   const newObjectives = [...section.data.objectives];
//                   newObjectives[index] = e.target.value;
//                   updateSectionData(section.id, { objectives: newObjectives });
//                 }}
//                 rows={2}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Success Criteria */}
//       <div className="space-y-4">
//         <Label>Success Criteria</Label>
//         <div className="space-y-2">
//           {section.data.successCriteria.map((criteria: string, index: number) => (
//             <div key={index} className="flex items-start space-x-2">
//               <span className="text-blue-600 font-bold mt-1">🎯</span>
//               <Textarea
//                 value={criteria}
//                 onChange={(e) => {
//                   const newCriteria = [...section.data.successCriteria];
//                   newCriteria[index] = e.target.value;
//                   updateSectionData(section.id, { successCriteria: newCriteria });
//                 }}
//                 rows={2}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderSolutionDetails = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* Approach */}
//       <div className="space-y-2">
//         <Label htmlFor="approach">Our Approach</Label>
//         <Textarea
//           id="approach"
//           value={section.data.approach}
//           onChange={(e) => updateSectionData(section.id, { approach: e.target.value })}
//           rows={6}
//         />
//       </div>

//       {/* Solution Overview */}
//       <div className="space-y-2">
//         <Label htmlFor="solutionOverview">Solution Overview</Label>
//         <Textarea
//           id="solutionOverview"
//           value={section.data.solutionOverview}
//           onChange={(e) => updateSectionData(section.id, { solutionOverview: e.target.value })}
//           rows={8}
//         />
//       </div>

//       {/* Key Features */}
//       <div className="space-y-4">
//         <Label>Key Features</Label>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {section.data.keyFeatures.map((feature: string, index: number) => (
//             <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
//               <span className="text-blue-600 font-bold">✨</span>
//               <Input
//                 value={feature}
//                 onChange={(e) => {
//                   const newFeatures = [...section.data.keyFeatures];
//                   newFeatures[index] = e.target.value;
//                   updateSectionData(section.id, { keyFeatures: newFeatures });
//                 }}
//                 className="flex-1 bg-transparent border-none"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Technical Approach */}
//       <div className="space-y-2">
//         <Label htmlFor="technicalApproach">Technical Approach</Label>
//         <Textarea
//           id="technicalApproach"
//           value={section.data.technicalApproach}
//           onChange={(e) => updateSectionData(section.id, { technicalApproach: e.target.value })}
//           rows={6}
//           className="font-mono text-sm"
//         />
//       </div>

//       {/* Benefits */}
//       <div className="space-y-4">
//         <Label>Benefits</Label>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {section.data.benefits.map((benefit: string, index: number) => (
//             <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
//               <span className="text-green-600 font-bold">✓</span>
//               <Input
//                 value={benefit}
//                 onChange={(e) => {
//                   const newBenefits = [...section.data.benefits];
//                   newBenefits[index] = e.target.value;
//                   updateSectionData(section.id, { benefits: newBenefits });
//                 }}
//                 className="flex-1 bg-transparent border-none"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Solution Images */}
//       <div className="space-y-4">
//         <Label>Solution Images</Label>
//         <div className="grid grid-cols-3 gap-4">
//           {section.data.solutionImages.map((image: string, index: number) => (
//             <div key={index} className="space-y-2">
//               <img
//                 src={image}
//                 alt={`Solution ${index + 1}`}
//                 className="w-full h-32 object-cover rounded-lg border"
//               />
//               <Input
//                 value={image}
//                 onChange={(e) => {
//                   const newImages = [...section.data.solutionImages];
//                   newImages[index] = e.target.value;
//                   updateSectionData(section.id, { solutionImages: newImages });
//                 }}
//                 placeholder="Image URL"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderProductSpecifications = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* Products Section */}
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <h4 className="font-semibold text-lg">Product Details</h4>
//           <Button onClick={addProductDetail} size="sm">
//             <Plus className="h-4 w-4 mr-2" />
//             Add Product
//           </Button>
//         </div>
//         {section.data.products.map((product: ProductDetail, index: number) => (
//           <Card key={product.id} className="p-4">
//             <div className="flex justify-between items-start mb-4">
//               <h5 className="font-medium">Product {index + 1}</h5>
//               <Button
//                 onClick={() => removeProductDetail(product.id)}
//                 variant="destructive"
//                 size="sm"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label>Product</Label>
//                 <Select
//                   value={product.productId}
//                   onValueChange={(value) => updateProductDetail(product.id, { productId: value })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select product" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {products.map((p) => (
//                       <SelectItem key={p.id} value={p.id}>
//                         {p.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Quantity</Label>
//                 <Input
//                   type="number"
//                   value={product.quantity}
//                   onChange={(e) => updateProductDetail(product.id, { quantity: parseInt(e.target.value) || 0 })}
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-3 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label>Unit Price</Label>
//                 <Input
//                   type="number"
//                   value={product.unitPrice}
//                   onChange={(e) => {
//                     updateProductDetail(product.id, { unitPrice: parseFloat(e.target.value) || 0 });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Discount (%)</Label>
//                 <Input
//                   type="number"
//                   value={product.discount}
//                   onChange={(e) => {
//                     updateProductDetail(product.id, { discount: parseFloat(e.target.value) || 0 });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Line Total</Label>
//                 <Input
//                   value={formatAmount((product.quantity * product.unitPrice) * (1 - product.discount / 100))}
//                   readOnly
//                   className="bg-gray-50"
//                 />
//               </div>
//             </div>
//             <div className="space-y-2 mb-4">
//               <Label>Description</Label>
//               <Textarea
//                 value={product.description}
//                 onChange={(e) => updateProductDetail(product.id, { description: e.target.value })}
//                 rows={2}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Product Images (URLs)</Label>
//               <div className="space-y-2">
//                 {product.images.map((image: string, imgIndex: number) => (
//                   <div key={imgIndex} className="flex gap-2">
//                     <Input
//                       value={image}
//                       onChange={(e) => {
//                         const newImages = [...product.images];
//                         newImages[imgIndex] = e.target.value;
//                         updateProductDetail(product.id, { images: newImages });
//                       }}
//                       placeholder="https://example.com/image.jpg"
//                     />
//                     <Button
//                       onClick={() => {
//                         const newImages = product.images.filter((_, i) => i !== imgIndex);
//                         updateProductDetail(product.id, { images: newImages });
//                       }}
//                       variant="outline"
//                       size="sm"
//                     >
//                       <Minus className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//                 <Button
//                   onClick={() => {
//                     updateProductDetail(product.id, { images: [...product.images, ''] });
//                   }}
//                   variant="outline"
//                   size="sm"
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Image
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Technical Specifications */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Technical Specifications</h4>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="platform">Platform</Label>
//             <Input
//               id="platform"
//               value={section.data.technicalSpecifications.platform}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   platform: e.target.value
//                 }
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="technology">Technology Stack</Label>
//             <Input
//               id="technology"
//               value={section.data.technicalSpecifications.technology}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   technology: e.target.value
//                 }
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="mobileSupport">Mobile Support</Label>
//             <Input
//               id="mobileSupport"
//               value={section.data.technicalSpecifications.mobileSupport}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   mobileSupport: e.target.value
//                 }
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="browserSupport">Browser Support</Label>
//             <Input
//               id="browserSupport"
//               value={section.data.technicalSpecifications.browserSupport}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   browserSupport: e.target.value
//                 }
//               })}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Service Specifications */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Service Specifications</h4>
//         {section.data.serviceSpecifications.map((service: any, index: number) => (
//           <Card key={index} className="p-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Service</Label>
//                 <Input
//                   value={service.service}
//                   onChange={(e) => {
//                     const newServices = [...section.data.serviceSpecifications];
//                     newServices[index].service = e.target.value;
//                     updateSectionData(section.id, { serviceSpecifications: newServices });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Timeline</Label>
//                 <Input
//                   value={service.timeline}
//                   onChange={(e) => {
//                     const newServices = [...section.data.serviceSpecifications];
//                     newServices[index].timeline = e.target.value;
//                     updateSectionData(section.id, { serviceSpecifications: newServices });
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2 mt-4">
//               <Label>Description</Label>
//               <Textarea
//                 value={service.description}
//                 onChange={(e) => {
//                   const newServices = [...section.data.serviceSpecifications];
//                   newServices[index].description = e.target.value;
//                   updateSectionData(section.id, { serviceSpecifications: newServices });
//                 }}
//                 rows={2}
//               />
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Compliance Standards */}
//       <div className="space-y-4">
//         <Label>Compliance Standards</Label>
//         <div className="flex flex-wrap gap-2">
//           {section.data.complianceStandards.map((standard: string, index: number) => (
//             <Badge key={index} variant="outline" className="px-3 py-1 border-green-200 text-green-700">
//               {standard}
//             </Badge>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderQuotationItems = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* Quotation Items Table */}
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <h4 className="font-semibold text-lg">Quotation Items</h4>
//           <Button onClick={addQuotationItem} size="sm">
//             <Plus className="h-4 w-4 mr-2" />
//             Add Item
//           </Button>
//         </div>

//         {/* Table Header */}
//         <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg font-medium text-sm">
//           <div className="col-span-1">Item ID</div>
//           <div className="col-span-2">Product</div>
//           <div className="col-span-2">Description</div>
//           <div className="col-span-1">Qty</div>
//           <div className="col-span-1">Rate</div>
//           <div className="col-span-1">Discount</div>
//           <div className="col-span-1">Tax</div>
//           <div className="col-span-1">Service</div>
//           <div className="col-span-1">Amount</div>
//           <div className="col-span-1">Actions</div>
//         </div>

//         {/* Items */}
//         {section.data.items.map((item: QuotationItem, index: number) => (
//           <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
//             <div className="col-span-1">
//               <Input
//                 value={item.itemId}
//                 onChange={(e) => updateQuotationItem(item.id, { itemId: e.target.value })}
//                 placeholder="001"
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-2 space-y-1">
//               <Select
//                 value={item.productId}
//                 onValueChange={(value) => {
//                   const product = products.find(p => p.id === value);
//                   updateQuotationItem(item.id, {
//                     productId: value,
//                     productName: product?.name || '',
//                     description: product?.description || '',
//                     rate: product?.sellingPrice || 0
//                   });
//                 }}
//               >
//                 <SelectTrigger className="text-sm">
//                   <SelectValue placeholder="Select product" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {products.map((p) => (
//                     <SelectItem key={p.id} value={p.id}>
//                       {p.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Input
//                 value={item.productName}
//                 onChange={(e) => updateQuotationItem(item.id, { productName: e.target.value })}
//                 placeholder="Product name"
//                 className="text-xs"
//               />
//             </div>
//             <div className="col-span-2">
//               <Textarea
//                 value={item.description}
//                 onChange={(e) => updateQuotationItem(item.id, { description: e.target.value })}
//                 rows={2}
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-1">
//               <Input
//                 type="number"
//                 value={item.quantity}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { quantity: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-1">
//               <Input
//                 type="number"
//                 value={item.rate}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { rate: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-1 space-y-1">
//               <Input
//                 type="number"
//                 value={item.discount}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { discount: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//               <Select
//                 value={item.discountType}
//                 onValueChange={(value: 'percentage' | 'fixed') => {
//                   updateQuotationItem(item.id, { discountType: value });
//                 }}
//               >
//                 <SelectTrigger className="text-xs h-6">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="percentage">%</SelectItem>
//                   <SelectItem value="fixed">Fixed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="col-span-1 space-y-1">
//               <Input
//                 type="number"
//                 value={item.tax}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { tax: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//               <Select
//                 value={item.taxType}
//                 onValueChange={(value: 'percentage' | 'fixed') => {
//                   updateQuotationItem(item.id, { taxType: value });
//                 }}
//               >
//                 <SelectTrigger className="text-xs h-6">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="percentage">%</SelectItem>
//                   <SelectItem value="fixed">Fixed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="col-span-1">
//               <Input
//                 type="number"
//                 value={item.serviceCharges}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { serviceCharges: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-1">
//               <Input
//                 value={formatAmount(item.amount)}
//                 readOnly
//                 className="bg-gray-50 text-sm font-medium"
//               />
//             </div>
//             <div className="col-span-1">
//               <Button
//                 onClick={() => removeQuotationItem(item.id)}
//                 variant="destructive"
//                 size="sm"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Summary */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Summary</h4>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="space-y-2">
//             <Label>Currency</Label>
//             <Select
//               value={section.data.currency}
//               onValueChange={(value) => updateSectionData(section.id, { currency: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="AED">AED</SelectItem>
//                 <SelectItem value="USD">USD</SelectItem>
//                 <SelectItem value="EUR">EUR</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label>Service Charges</Label>
//             <Input
//               type="number"
//               value={section.data.serviceCharges}
//               onChange={(e) => {
//                 updateSectionData(section.id, { serviceCharges: parseFloat(e.target.value) || 0 });
//               }}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Notes</Label>
//             <Textarea
//               value={section.data.notes}
//               onChange={(e) => updateSectionData(section.id, { notes: e.target.value })}
//               rows={2}
//               placeholder="Additional notes..."
//             />
//           </div>
//         </div>

//         {/* Totals */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Subtotal</p>
//             <p className="text-lg font-bold text-gray-900">
//               {formatAmount(section.data.subtotal)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Discount</p>
//             <p className="text-lg font-bold text-green-600">
//               -{formatAmount(section.data.totalDiscount)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Tax</p>
//             <p className="text-lg font-bold text-blue-600">
//               +{formatAmount(section.data.totalTax)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Grand Total</p>
//             <p className="text-2xl font-bold text-red-600">
//               {formatAmount(section.data.grandTotal)}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderTimelineSchedule = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* Project Overview */}
//       <div className="grid grid-cols-3 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="totalDuration">Total Duration</Label>
//           <Input
//             id="totalDuration"
//             value={section.data.totalDuration}
//             onChange={(e) => updateSectionData(section.id, { totalDuration: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="startDate">Start Date</Label>
//           <Input
//             id="startDate"
//             type="date"
//             value={section.data.startDate}
//             onChange={(e) => updateSectionData(section.id, { startDate: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="endDate">End Date</Label>
//           <Input
//             id="endDate"
//             type="date"
//             value={section.data.endDate}
//             onChange={(e) => updateSectionData(section.id, { endDate: e.target.value })}
//           />
//         </div>
//       </div>

//       {/* Project Phases */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Project Phases</h4>
//         {section.data.phases.map((phase: any, index: number) => (
//           <Card key={index} className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label>Phase Name</Label>
//                 <Input
//                   value={phase.name}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].name = e.target.value;
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Duration</Label>
//                 <Input
//                   value={phase.duration}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].duration = e.target.value;
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Start Date</Label>
//                 <Input
//                   type="date"
//                   value={phase.startDate}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].startDate = e.target.value;
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Deliverables</Label>
//                 <Textarea
//                   value={phase.deliverables.join('\n')}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].deliverables = e.target.value.split('\n');
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                   rows={3}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Milestones</Label>
//                 <Textarea
//                   value={phase.milestones.join('\n')}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].milestones = e.target.value.split('\n');
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                   rows={2}
//                 />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Critical Path */}
//       <div className="space-y-2">
//         <Label>Critical Path</Label>
//         <Textarea
//           value={section.data.criticalPath.join('\n')}
//           onChange={(e) => updateSectionData(section.id, {
//             criticalPath: e.target.value.split('\n')
//           })}
//           rows={4}
//         />
//       </div>

//       {/* Dependencies */}
//       <div className="space-y-2">
//         <Label>Dependencies</Label>
//         <Textarea
//           value={section.data.dependencies.join('\n')}
//           onChange={(e) => updateSectionData(section.id, {
//             dependencies: e.target.value.split('\n')
//           })}
//           rows={3}
//         />
//       </div>

//       {/* Risks */}
//       <div className="space-y-4">
//         <Label>Risks & Mitigation</Label>
//         {section.data.risks.map((risk: any, index: number) => (
//           <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
//             <div className="flex-1 space-y-2">
//               <Input
//                 value={risk.risk}
//                 onChange={(e) => {
//                   const newRisks = [...section.data.risks];
//                   newRisks[index].risk = e.target.value;
//                   updateSectionData(section.id, { risks: newRisks });
//                 }}
//                 placeholder="Risk description"
//               />
//             </div>
//             <Select
//               value={risk.impact}
//               onValueChange={(value) => {
//                 const newRisks = [...section.data.risks];
//                 newRisks[index].impact = value;
//                 updateSectionData(section.id, { risks: newRisks });
//               }}
//             >
//               <SelectTrigger className="w-24">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Low">Low</SelectItem>
//                 <SelectItem value="Medium">Medium</SelectItem>
//                 <SelectItem value="High">High</SelectItem>
//               </SelectContent>
//             </Select>
//             <div className="flex-1">
//               <Textarea
//                 value={risk.mitigation}
//                 onChange={(e) => {
//                   const newRisks = [...section.data.risks];
//                   newRisks[index].mitigation = e.target.value;
//                   updateSectionData(section.id, { risks: newRisks });
//                 }}
//                 placeholder="Mitigation strategy"
//                 rows={2}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderTermsWarranties = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* General Terms */}
//       <div className="space-y-2">
//         <Label htmlFor="generalTerms">General Terms</Label>
//         <Textarea
//           id="generalTerms"
//           value={section.data.generalTerms}
//           onChange={(e) => updateSectionData(section.id, { generalTerms: e.target.value })}
//           rows={8}
//           className="font-mono text-sm"
//         />
//       </div>

//       {/* Warranties */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Warranties</h4>
//         {section.data.warranties.map((warranty: any, index: number) => (
//           <Card key={index} className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="space-y-2">
//                 <Label>Item</Label>
//                 <Input
//                   value={warranty.item}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].item = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Warranty</Label>
//                 <Input
//                   value={warranty.warranty}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].warranty = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Coverage</Label>
//                 <Textarea
//                   value={warranty.coverage}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].coverage = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                   rows={2}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Exclusions</Label>
//                 <Textarea
//                   value={warranty.exclusions}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].exclusions = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                   rows={2}
//                 />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Limitations */}
//       <div className="space-y-2">
//         <Label htmlFor="limitations">Limitations</Label>
//         <Textarea
//           id="limitations"
//           value={section.data.limitations}
//           onChange={(e) => updateSectionData(section.id, { limitations: e.target.value })}
//           rows={4}
//         />
//       </div>

//       {/* Support Services */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Support Services</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <h5 className="font-medium text-green-700">Included Services</h5>
//             <div className="space-y-2">
//               {section.data.supportServices.included.map((service: string, index: number) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span className="text-green-600">✓</span>
//                   <Input
//                     value={service}
//                     onChange={(e) => {
//                       const newIncluded = [...section.data.supportServices.included];
//                       newIncluded[index] = e.target.value;
//                       updateSectionData(section.id, {
//                         supportServices: {
//                           ...section.data.supportServices,
//                           included: newIncluded
//                         }
//                       });
//                     }}
//                     className="flex-1"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="space-y-4">
//             <h5 className="font-medium text-blue-700">Optional Services</h5>
//             <div className="space-y-2">
//               {section.data.supportServices.optional.map((service: string, index: number) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span className="text-blue-600">+</span>
//                   <Input
//                     value={service}
//                     onChange={(e) => {
//                       const newOptional = [...section.data.supportServices.optional];
//                       newOptional[index] = e.target.value;
//                       updateSectionData(section.id, {
//                         supportServices: {
//                           ...section.data.supportServices,
//                           optional: newOptional
//                         }
//                       });
//                     }}
//                     className="flex-1"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Termination Clauses */}
//       <div className="space-y-2">
//         <Label htmlFor="terminationClauses">Termination Clauses</Label>
//         <Textarea
//           id="terminationClauses"
//           value={section.data.terminationClauses}
//           onChange={(e) => updateSectionData(section.id, { terminationClauses: e.target.value })}
//           rows={4}
//         />
//       </div>

//       {/* Governing Law */}
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="governingLaw">Governing Law</Label>
//           <Input
//             id="governingLaw"
//             value={section.data.governingLaw}
//             onChange={(e) => updateSectionData(section.id, { governingLaw: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="disputeResolution">Dispute Resolution</Label>
//           <Input
//             id="disputeResolution"
//             value={section.data.disputeResolution}
//             onChange={(e) => updateSectionData(section.id, { disputeResolution: e.target.value })}
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderContactInformation = (section: QuotationSection) => (
//     <div className="space-y-6">
//       {/* Company Contacts */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Company Contacts</h4>
//         {section.data.companyContacts.map((contact: any, index: number) => (
//           <Card key={index} className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Name</Label>
//                 <Input
//                   value={contact.name}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.companyContacts];
//                     newContacts[index].name = e.target.value;
//                     updateSectionData(section.id, { companyContacts: newContacts });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Title</Label>
//                 <Input
//                   value={contact.title}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.companyContacts];
//                     newContacts[index].title = e.target.value;
//                     updateSectionData(section.id, { companyContacts: newContacts });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Phone</Label>
//                 <Input
//                   value={contact.phone}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.companyContacts];
//                     newContacts[index].phone = e.target.value;
//                     updateSectionData(section.id, { companyContacts: newContacts });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   value={contact.email}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.companyContacts];
//                     newContacts[index].email = e.target.value;
//                     updateSectionData(section.id, { companyContacts: newContacts });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <Label>Department</Label>
//                 <Input
//                   value={contact.department}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.companyContacts];
//                     newContacts[index].department = e.target.value;
//                     updateSectionData(section.id, { companyContacts: newContacts });
//                   }}
//                 />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Client Contacts */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Client Contacts</h4>
//         {section.data.clientContacts.map((contact: any, index: number) => (
//           <Card key={index} className="p-4 border-dashed">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Name</Label>
//                 <Input
//                   value={contact.name}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.clientContacts];
//                     newContacts[index].name = e.target.value;
//                     updateSectionData(section.id, { clientContacts: newContacts });
//                   }}
//                   placeholder="Client name"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Title</Label>
//                 <Input
//                   value={contact.title}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.clientContacts];
//                     newContacts[index].title = e.target.value;
//                     updateSectionData(section.id, { clientContacts: newContacts });
//                   }}
//                   placeholder="Client title"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Phone</Label>
//                 <Input
//                   value={contact.phone}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.clientContacts];
//                     newContacts[index].phone = e.target.value;
//                     updateSectionData(section.id, { clientContacts: newContacts });
//                   }}
//                   placeholder="Client phone"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   value={contact.email}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.clientContacts];
//                     newContacts[index].email = e.target.value;
//                     updateSectionData(section.id, { clientContacts: newContacts });
//                   }}
//                   placeholder="Client email"
//                 />
//               </div>
//               <div className="space-y-2 md:col-span-2">
//                 <Label>Department</Label>
//                 <Input
//                   value={contact.department}
//                   onChange={(e) => {
//                     const newContacts = [...section.data.clientContacts];
//                     newContacts[index].department = e.target.value;
//                     updateSectionData(section.id, { clientContacts: newContacts });
//                   }}
//                   placeholder="Client department"
//                 />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       {/* Signatures */}
//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Signatures</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Card className="p-4 border-blue-200">
//             <h5 className="font-medium text-blue-700 mb-4">Client Signature</h5>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Signature</Label>
//                 <Input
//                   value={section.data.signatures.clientSignature}
//                   onChange={(e) => updateSectionData(section.id, {
//                     signatures: {
//                       ...section.data.signatures,
//                       clientSignature: e.target.value
//                     }
//                   })}
//                   placeholder="Client signature"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Name</Label>
//                 <Input
//                   value={section.data.signatures.clientName}
//                   onChange={(e) => updateSectionData(section.id, {
//                     signatures: {
//                       ...section.data.signatures,
//                       clientName: e.target.value
//                     }
//                   })}
//                   placeholder="Client name"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Title</Label>
//                 <Input
//                   value={section.data.signatures.clientTitle}
//                   onChange={(e) => updateSectionData(section.id, {
//                     signatures: {
//                       ...section.data.signatures,
//                       clientTitle: e.target.value
//                     }
//                   })}
//                   placeholder="Client title"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Date</Label>
//                 <Input
//                   type="date"
//                   value={section.data.signatures.clientDate}
//                   onChange={(e) => updateSectionData(section.id, {
//                     signatures: {
//                       ...section.data.signatures,
//                       clientDate: e.target.value
//                     }
//                   })}
//                 />
//               </div>
//             </div>
//           </Card>

//           <Card className="p-4 border-red-200">
//             <h5 className="font-medium text-red-700 mb-4">Company Signature</h5>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Signature</Label>
//                 <Input
//                   value={section.data.signatures.companySignature}
//                   onChange={(e) => updateSectionData(section.id, {
//                     signatures: {
//                       ...section.data.signatures,
//                       companySignature: e.target.value
//                     }
//                   })}
//                   placeholder="Company signature"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Name</Label>
//                 <Input
//                   value={section.data.signatures.companyName}
//                   readOnly
//                   className="bg-gray-50"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Title</Label>
//                 <Input
//                   value={section.data.signatures.companyTitle}
//                   readOnly
//                   className="bg-gray-50"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Date</Label>
//                 <Input
//                   type="date"
//                   value={section.data.signatures.companyDate}
//                   readOnly
//                   className="bg-gray-50"
//                 />
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>

//       {/* Next Steps */}
//       <div className="space-y-4">
//         <Label>Next Steps</Label>
//         <div className="space-y-2">
//           {section.data.nextSteps.map((step: string, index: number) => (
//             <div key={index} className="flex items-center space-x-2">
//               <span className="text-blue-600 font-bold">{index + 1}.</span>
//               <Input
//                 value={step}
//                 onChange={(e) => {
//                   const newSteps = [...section.data.nextSteps];
//                   newSteps[index] = e.target.value;
//                   updateSectionData(section.id, { nextSteps: newSteps });
//                 }}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Additional Notes */}
//       <div className="space-y-2">
//         <Label htmlFor="additionalNotes">Additional Notes</Label>
//         <Textarea
//           id="additionalNotes"
//           value={section.data.additionalNotes}
//           onChange={(e) => updateSectionData(section.id, { additionalNotes: e.target.value })}
//           rows={4}
//           placeholder="Any additional notes or special considerations..."
//         />
//       </div>
//     </div>
//   );

//   const renderSection = (section: QuotationSection) => {
//     switch (section.type) {
//       case 'cover_page':
//         return renderCoverPage(section);
//       case 'executive_summary':
//         return renderExecutiveSummary(section);
//       case 'company_introduction':
//         return renderCompanyIntroduction(section);
//       case 'problem_statement':
//         return renderProblemStatement(section);
//       case 'solution_details':
//         return renderSolutionDetails(section);
//       case 'product_specifications':
//         return renderProductSpecifications(section);
//       case 'quotation_items':
//         return renderQuotationItems(section);
//       case 'timeline_schedule':
//         return renderTimelineSchedule(section);
//       case 'terms_warranties':
//         return renderTermsWarranties(section);
//       case 'contact_information':
//         return renderContactInformation(section);
//       default:
//         return (
//           <div className="space-y-4">
//             <Label>Section Content</Label>
//             <Textarea
//               value={JSON.stringify(section.data, null, 2)}
//               onChange={(e) => {
//                 try {
//                   const newData = JSON.parse(e.target.value);
//                   updateSectionData(section.id, newData);
//                 } catch (error) {
//                   // Invalid JSON, do nothing
//                 }
//               }}
//               rows={6}
//               className="font-mono text-sm"
//             />
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Create Professional Proposal</h1>
//             <p className="text-red-100 mt-1 text-lg">Build comprehensive proposals with 10 customizable sections</p>
//           </div>
//           <div className="flex gap-3">
//             <Button 
//               variant="outline" 
//               className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//               onClick={() => saveQuotation('draft')}
//               disabled={loading}
//             >
//               <Save className="h-5 w-5 mr-2" />
//               {loading ? 'Saving...' : 'Save Draft'}
//             </Button>
//             <Button 
//               className="bg-white text-red-600 hover:bg-red-50" 
//               onClick={generatePDF}
//             >
//               <Download className="h-5 w-5 mr-2" />
//               Generate PDF
//             </Button>
//             <Button 
//               className="bg-green-600 hover:bg-green-700 text-white"
//               onClick={() => saveQuotation('sent')}
//               disabled={loading || !quotationData.customerId}
//             >
//               <Send className="h-5 w-5 mr-2" />
//               {loading ? 'Sending...' : 'Send Quotation'}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Basic Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-xl">Basic Information</CardTitle>
//           <CardDescription>Enter quotation details and select customer</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="quotationNumber">Quotation Number</Label>
//                 <Input
//                   id="quotationNumber"
//                   value={quotationData.quotationNumber}
//                   onChange={(e) => setQuotationData(prev => ({ ...prev, quotationNumber: e.target.value }))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="customer">Customer</Label>
//                 <Select
//                   value={quotationData.customerId}
//                   onValueChange={(value) => setQuotationData(prev => ({ ...prev, customerId: value }))}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a customer" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {customers.map((customer) => (
//                       <SelectItem key={customer.id} value={customer.id}>
//                         {customer.companyName} - {customer.contactPerson}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="issueDate">Issue Date</Label>
//                 <Input
//                   id="issueDate"
//                   type="date"
//                   value={quotationData.issueDate}
//                   onChange={(e) => setQuotationData(prev => ({ ...prev, issueDate: e.target.value }))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="validUntil">Valid Until</Label>
//                 <Input
//                   id="validUntil"
//                   type="date"
//                   value={quotationData.validUntil}
//                   onChange={(e) => setQuotationData(prev => ({ ...prev, validUntil: e.target.value }))}
//                 />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sections List */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle className="text-lg">Proposal Sections</CardTitle>
//             <CardDescription>Reorder and enable/disable proposal sections</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {sections.map((section, index) => (
//               <div
//                 key={section.id}
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, section.id)}
//                 onDragOver={handleDragOver}
//                 onDrop={(e) => handleDrop(e, section.id)}
//                 className={`p-3 rounded-lg border-2 cursor-move transition-all ${
//                   section.enabled
//                     ? 'border-red-200 bg-red-50 hover:border-red-300'
//                     : 'border-gray-200 bg-gray-50 opacity-60'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <GripVertical className="h-4 w-4 text-gray-400" />
//                     <span className={`text-sm font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
//                       {section.order}. {section.title}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => moveSection(index, Math.max(0, index - 1))}
//                       disabled={index === 0}
//                     >
//                       <ArrowUp className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => moveSection(index, Math.min(sections.length - 1, index + 1))}
//                       disabled={index === sections.length - 1}
//                     >
//                       <ArrowDown className="h-4 w-4" />
//                     </Button>
//                     <Checkbox
//                       checked={section.enabled}
//                       onCheckedChange={() => toggleSection(section.id)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Section Content */}
//         <div className="lg:col-span-3 space-y-6">
//           {sections.filter(section => section.enabled).map((section) => (
//             <Card key={section.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Eye className="h-5 w-5 text-green-600" />
//                     <div>
//                       <CardTitle className="text-xl">{section.title}</CardTitle>
//                       <CardDescription>
//                         Section {section.order} • Enabled for PDF
//                       </CardDescription>
//                     </div>
//                   </div>
//                   <Badge variant="default">
//                     PDF
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {renderSection(section)}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


// new code



// 'use client';

// import { useState, useRef, useEffect, useCallback } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import jsPDF from 'jspdf';

// // Firebase imports
// import { db } from '@/lib/firebase';
// import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';

// // Icons imports
// import {
//   ArrowUp,
//   ArrowDown,
//   Plus,
//   Minus,
//   Save,
//   Download,
//   Building2,
//   FileText,
//   Package,
//   DollarSign,
//   FileCheck,
//   Handshake,
//   Eye,
//   EyeOff,
//   GripVertical,
//   Image as ImageIcon,
//   Trash2,
//   Send,
//   Loader2
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// // Firebase Hooks
// const useCustomers = () => {
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const q = query(
//       collection(db, 'customers'),
//       where('isActive', '==', true),
//       orderBy('companyName')
//     );

//     const unsubscribe = onSnapshot(q, 
//       (querySnapshot) => {
//         const customersData: any[] = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           customersData.push({
//             id: doc.id,
//             companyName: data.companyName || '',
//             primaryContact: {
//               name: data.primaryContact?.name || '',
//               email: data.primaryContact?.email || '',
//               phone: data.primaryContact?.phone || '',
//               designation: data.primaryContact?.designation || ''
//             },
//             city: data.city || '',
//             country: data.country || '',
//             customerType: data.customerType || '',
//             industry: data.industry || '',
//             isActive: data.isActive || false
//           });
//         });
//         setCustomers(customersData);
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error fetching customers:', error);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   return { customers, loading };
// };

// const useProducts = () => {
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const q = query(
//       collection(db, 'products'),
//       orderBy('name')
//     );

//     const unsubscribe = onSnapshot(q, 
//       (querySnapshot) => {
//         const productsData: any[] = [];
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           productsData.push({
//             id: doc.id,
//             name: data.name || '',
//             sellingPrice: data.sellingPrice || 0,
//             description: data.description || '',
//             currentStock: data.currentStock || 0,
//             sku: data.sku || '',
//             category: data.category || '',
//             status: data.status || ''
//           });
//         });
//         setProducts(productsData);
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error fetching products:', error);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   return { products, loading };
// };

// // Company settings
// const companySettings = {
//   logoUrl: 'https://via.placeholder.com/150x50?text=Company+Logo',
//   companyName: 'SBR Technologies',
//   address: {
//     street: 'Business Bay',
//     city: 'Dubai',
//     state: 'Dubai',
//     zipCode: '12345',
//     country: 'UAE'
//   },
//   contact: {
//     phone: '+971 4 123 4567',
//     email: 'info@sbrtech.com',
//     website: 'www.sbrtech.com'
//   }
// };

// // Currency hook
// const useCurrency = () => {
//   const formatAmount = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'AED',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   return { formatAmount };
// };

// interface QuotationSection {
//   id: string;
//   type: 'cover_page' | 'executive_summary' | 'company_introduction' | 'problem_statement' | 'solution_details' | 'product_specifications' | 'quotation_items' | 'timeline_schedule' | 'terms_warranties' | 'contact_information';
//   title: string;
//   enabled: boolean;
//   order: number;
//   data: any;
// }

// interface ProductDetail {
//   id: string;
//   productId: string;
//   quantity: number;
//   unitPrice: number;
//   discount: number;
//   description: string;
//   images: string[];
// }

// interface QuotationItem {
//   id: string;
//   itemId: string;
//   productId: string;
//   productName: string;
//   description: string;
//   quantity: number;
//   rate: number;
//   discount: number;
//   discountType: 'percentage' | 'fixed';
//   tax: number;
//   taxType: 'percentage' | 'fixed';
//   serviceCharges: number;
//   amount: number;
// }

// // Firebase mein quotation save karna
// const saveQuotationToFirebase = async (quotationData: any): Promise<string> => {
//   try {
//     const docRef = await addDoc(collection(db, 'quotations'), quotationData);
//     return docRef.id;
//   } catch (error) {
//     console.error('Error saving quotation to Firebase:', error);
//     throw error;
//   }
// };

// export default function NewQuotationPage() {
//   const { formatAmount } = useCurrency();
//   const router = useRouter();
  
//   // Use real Firebase data
//   const { customers, loading: customersLoading } = useCustomers();
//   const { products, loading: productsLoading } = useProducts();
  
//   // Main quotation state
//   const [quotationData, setQuotationData] = useState({
//     quotationNumber: `QT-${Date.now()}`,
//     customerId: '',
//     status: 'draft' as 'draft' | 'sent' | 'approved' | 'rejected',
//     issueDate: new Date().toISOString().split('T')[0],
//     validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
//     notes: '',
//     terms: ''
//   });

//   const [sections, setSections] = useState<QuotationSection[]>([
//     {
//       id: 'cover_page',
//       type: 'cover_page',
//       title: 'Cover Page & Letter',
//       enabled: true,
//       order: 1,
//       data: {
//         companyLogo: companySettings.logoUrl,
//         companyName: companySettings.companyName,
//         companyAddress: `${companySettings.address.street}, ${companySettings.address.city}, ${companySettings.address.state} ${companySettings.address.zipCode}, ${companySettings.address.country}`,
//         companyPhone: companySettings.contact.phone,
//         companyEmail: companySettings.contact.email,
//         companyWebsite: companySettings.contact.website,
//         date: new Date().toISOString().split('T')[0],
//         recipientName: '',
//         recipientCompany: '',
//         recipientAddress: '',
//         recipientPhone: '',
//         recipientEmail: '',
//         subject: 'Proposal for Professional Services',
//         salutation: 'Dear [Recipient Name],',
//         letterContent: `We are pleased to submit this comprehensive proposal for your consideration. Our team has carefully analyzed your requirements and developed a tailored solution that meets your specific needs.

// This proposal outlines our understanding of your project requirements, our proposed solution, detailed specifications, pricing structure, and implementation timeline.

// We look forward to the opportunity to work with you and deliver exceptional results.`,
//         senderName: 'John Smith',
//         senderTitle: 'Business Development Manager',
//         senderPhone: '+971 50 123 4567',
//         senderEmail: 'john.smith@sbrtech.com'
//       }
//     },
//     {
//       id: 'executive_summary',
//       type: 'executive_summary',
//       title: 'Executive Summary',
//       enabled: true,
//       order: 2,
//       data: {
//         summary: `This proposal presents a comprehensive solution tailored to meet your specific business requirements. Our experienced team brings deep industry knowledge and proven methodologies to deliver exceptional results.

// Key highlights of our proposal include:
// • Customized solution addressing your unique challenges
// • Competitive pricing with flexible payment terms
// • Proven track record of successful project delivery
// • Comprehensive support and maintenance services
// • Commitment to quality and customer satisfaction

// We are confident that our solution will exceed your expectations and deliver significant value to your organization.`,
//         keyBenefits: [
//           'Cost-effective solution with ROI within 6 months',
//           'Streamlined processes reducing operational overhead by 30%',
//           'Scalable architecture supporting future growth',
//           '24/7 technical support and maintenance',
//           'Comprehensive training and knowledge transfer'
//         ],
//         proposalValue: '',
//         estimatedDuration: '3-6 months',
//         totalInvestment: ''
//       }
//     },
//     {
//       id: 'company_introduction',
//       type: 'company_introduction',
//       title: 'Company Introduction',
//       enabled: true,
//       order: 3,
//       data: {
//         companyLogo: 'https://via.placeholder.com/150x50?text=SBR+Logo',
//         description: 'SBR Technologies is a leading provider of enterprise software solutions, specializing in digital transformation, custom software development, and technology consulting services. With over 10 years of experience, we have successfully delivered projects for Fortune 500 companies and startups alike.',
//         foundedYear: '2015',
//         employeeCount: '50+',
//         officeLocations: ['Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE'],
//         certifications: ['ISO 9001:2015', 'ISO 27001', 'CMMI Level 3'],
//         achievements: [
//           '500+ Successful Projects Completed',
//           '50+ Enterprise Clients Served',
//           '98% Client Satisfaction Rate',
//           '10+ Years Industry Experience',
//           'Award-winning Development Team'
//         ],
//         coreValues: [
//           'Innovation & Excellence',
//           'Customer-Centric Approach',
//           'Quality & Reliability',
//           'Ethical Business Practices',
//           'Continuous Learning'
//         ],
//         companyImages: [
//           'https://via.placeholder.com/400x300?text=Office+Building',
//           'https://via.placeholder.com/400x300?text=Team+Photo',
//           'https://via.placeholder.com/400x300?text=Work+Environment'
//         ]
//       }
//     },
//     {
//       id: 'problem_statement',
//       type: 'problem_statement',
//       title: 'Problem Statement',
//       enabled: true,
//       order: 4,
//       data: {
//         clientChallenges: [
//           'Inefficient manual processes causing delays and errors',
//           'Lack of real-time visibility into business operations',
//           'Difficulty scaling operations with business growth',
//           'Data silos preventing comprehensive insights',
//           'Compliance and regulatory reporting challenges'
//         ],
//         currentSituation: `Your organization is currently facing several operational challenges that are impacting efficiency, scalability, and competitiveness. Manual processes, disparate systems, and lack of integration are creating bottlenecks that hinder productivity and decision-making capabilities.

// The current technology infrastructure is not equipped to handle growing business demands, leading to increased operational costs, reduced customer satisfaction, and missed opportunities for optimization.`,
//         impactAssessment: `These challenges are resulting in:
// • Increased operational costs (estimated 25-30% higher than optimized operations)
// • Reduced productivity and efficiency
// • Higher error rates and rework requirements
// • Delayed decision-making processes
// • Limited scalability for business growth
// • Reduced customer satisfaction scores`,
//         objectives: [
//           'Streamline and automate manual processes',
//           'Implement integrated systems for real-time visibility',
//           'Create scalable architecture for future growth',
//           'Establish comprehensive reporting and analytics',
//           'Ensure compliance with industry standards'
//         ],
//         successCriteria: [
//           '30% reduction in operational costs',
//           '50% improvement in process efficiency',
//           'Real-time visibility into all business operations',
//           'Scalable system supporting 200% growth capacity',
//           '100% compliance with regulatory requirements'
//         ]
//       }
//     },
//     {
//       id: 'solution_details',
//       type: 'solution_details',
//       title: 'Solution Details',
//       enabled: true,
//       order: 5,
//       data: {
//         approach: `Our solution approach is based on industry best practices and proven methodologies. We follow a structured implementation process that ensures quality, minimizes risks, and maximizes value delivery.

// Our methodology includes:
// • Comprehensive requirements analysis and planning
// • Agile development with iterative delivery
// • Quality assurance and testing at every stage
// • User training and change management
// • Post-implementation support and optimization`,
//         solutionOverview: `We propose a comprehensive solution that addresses all identified challenges through:

// 1. **Integrated Platform**: Unified system replacing disparate tools and processes
// 2. **Automation Engine**: Intelligent automation of repetitive tasks and workflows
// 3. **Analytics Dashboard**: Real-time insights and reporting capabilities
// 4. **Scalable Architecture**: Cloud-native design supporting future growth
// 5. **Security Framework**: Enterprise-grade security and compliance features

// This solution will transform your operations, improve efficiency, and position your organization for sustained growth.`,
//         keyFeatures: [
//           'Unified dashboard for all business operations',
//           'Automated workflow processing and approvals',
//           'Real-time analytics and reporting',
//           'Mobile-responsive design for remote access',
//           'Integration capabilities with existing systems',
//           'Advanced security and data protection',
//           'Scalable cloud infrastructure',
//           '24/7 system availability and monitoring'
//         ],
//         technicalApproach: `Our technical implementation follows industry standards and best practices:

// • **Frontend**: Modern React-based user interface with responsive design
// • **Backend**: Microservices architecture with RESTful APIs
// • **Database**: High-performance relational database with data warehousing capabilities
// • **Infrastructure**: Cloud-native deployment with auto-scaling and high availability
// • **Security**: Multi-layered security with encryption, access controls, and compliance features
// • **Integration**: API-first design enabling seamless integration with existing systems`,
//         benefits: [
//           'Improved operational efficiency and productivity',
//           'Reduced costs through automation and optimization',
//           'Enhanced decision-making with real-time insights',
//           'Increased scalability and flexibility',
//           'Better compliance and risk management',
//           'Improved customer experience and satisfaction'
//         ],
//         solutionImages: [
//           'https://via.placeholder.com/500x300?text=Solution+Architecture',
//           'https://via.placeholder.com/500x300?text=User+Interface+Mockup',
//           'https://via.placeholder.com/500x300?text=Workflow+Diagram'
//         ]
//       }
//     },
//     {
//       id: 'product_specifications',
//       type: 'product_specifications',
//       title: 'Product & Service Specifications',
//       enabled: true,
//       order: 6,
//       data: {
//         products: [] as ProductDetail[],
//         technicalSpecifications: {
//           platform: 'Web-based SaaS Platform',
//           technology: 'React, Node.js, PostgreSQL, AWS Cloud',
//           mobileSupport: 'Responsive design for all devices',
//           browserSupport: 'Chrome, Firefox, Safari, Edge (latest versions)',
//           apiIntegration: 'RESTful APIs with OAuth 2.0 authentication',
//           dataSecurity: 'AES-256 encryption, SSL/TLS, GDPR compliance',
//           backup: 'Automated daily backups with disaster recovery',
//           uptime: '99.9% SLA with 24/7 monitoring'
//         },
//         serviceSpecifications: [
//           {
//             service: 'Implementation & Deployment',
//             description: 'Complete system setup, configuration, and deployment',
//             deliverables: ['System installation', 'Data migration', 'User training', 'Go-live support'],
//             timeline: '4-6 weeks'
//           },
//           {
//             service: 'Customization & Integration',
//             description: 'Tailored modifications and third-party system integration',
//             deliverables: ['Custom development', 'API integration', 'Testing', 'Documentation'],
//             timeline: '2-4 weeks'
//           },
//           {
//             service: 'Training & Support',
//             description: 'Comprehensive training and ongoing technical support',
//             deliverables: ['User training sessions', 'Admin training', '24/7 support', 'Knowledge base'],
//             timeline: 'Ongoing'
//           }
//         ],
//         complianceStandards: [
//           'ISO 27001 Information Security Management',
//           'GDPR Data Protection Compliance',
//           'SOC 2 Type II Security Controls',
//           'PCI DSS Payment Card Industry Standards',
//           'HIPAA Health Insurance Portability (if applicable)'
//         ]
//       }
//     },
//     {
//       id: 'quotation_items',
//       type: 'quotation_items',
//       title: 'Quotation Items',
//       enabled: true,
//       order: 7,
//       data: {
//         items: [] as QuotationItem[],
//         subtotal: 0,
//         totalDiscount: 0,
//         totalTax: 0,
//         serviceCharges: 0,
//         grandTotal: 0,
//         currency: 'AED',
//         notes: ''
//       }
//     },
//     {
//       id: 'timeline_schedule',
//       type: 'timeline_schedule',
//       title: 'Timeline & Delivery Schedule',
//       enabled: true,
//       order: 8,
//       data: {
//         totalDuration: '16 weeks',
//         startDate: '',
//         endDate: '',
//         phases: [
//           {
//             name: 'Planning & Analysis',
//             duration: '2 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Requirements gathering',
//               'System analysis',
//               'Project plan development',
//               'Resource allocation'
//             ],
//             milestones: ['Kickoff meeting', 'Requirements signoff']
//           },
//           {
//             name: 'Design & Development',
//             duration: '8 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'System design documents',
//               'UI/UX mockups',
//               'Database design',
//               'Core functionality development',
//               'Integration development'
//             ],
//             milestones: ['Design approval', 'Development completion', 'Testing phase start']
//           },
//           {
//             name: 'Testing & Quality Assurance',
//             duration: '3 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Unit testing',
//               'Integration testing',
//               'User acceptance testing',
//               'Performance testing',
//               'Security testing'
//             ],
//             milestones: ['QA completion', 'UAT signoff']
//           },
//           {
//             name: 'Deployment & Training',
//             duration: '3 weeks',
//             startDate: '',
//             endDate: '',
//             deliverables: [
//               'Production deployment',
//               'Data migration',
//               'User training sessions',
//               'Documentation delivery',
//               'Go-live support'
//             ],
//             milestones: ['Go-live', 'Training completion', 'Project closure']
//           }
//         ],
//         criticalPath: [
//           'Requirements analysis completion',
//           'Design approval',
//           'Development milestone reviews',
//           'Testing completion',
//           'User acceptance signoff'
//         ],
//         dependencies: [
//           'Phase 2 cannot start until Phase 1 requirements are approved',
//           'Phase 3 testing requires Phase 2 development completion',
//           'Phase 4 deployment requires Phase 3 testing signoff'
//         ],
//         risks: [
//           {
//             risk: 'Resource availability',
//             impact: 'Medium',
//             mitigation: 'Backup resource planning and cross-training'
//           },
//           {
//             risk: 'Third-party integration delays',
//             impact: 'High',
//             mitigation: 'Early vendor engagement and contingency planning'
//           },
//           {
//             risk: 'Scope changes',
//             impact: 'Medium',
//             mitigation: 'Change control process and regular scope reviews'
//           }
//         ]
//       }
//     },
//     {
//       id: 'terms_warranties',
//       type: 'terms_warranties',
//       title: 'Terms & Warranties',
//       enabled: true,
//       order: 9,
//       data: {
//         generalTerms: `1. **Acceptance**: This proposal constitutes the entire agreement between the parties.
// 2. **Validity**: This proposal is valid for 30 days from the date of submission.
// 3. **Payment Terms**: All payments must be made according to the agreed schedule.
// 4. **Intellectual Property**: All deliverables remain the property of the client upon full payment.
// 5. **Confidentiality**: Both parties agree to maintain confidentiality of proprietary information.`,
//         warranties: [
//           {
//             item: 'Software Functionality',
//             warranty: '12 months from go-live date',
//             coverage: 'Bugs and defects in core functionality',
//             exclusions: 'Custom modifications, third-party integrations'
//           },
//           {
//             item: 'System Performance',
//             warranty: '99.5% uptime SLA',
//             coverage: 'System availability and performance',
//             exclusions: 'Scheduled maintenance, force majeure events'
//           },
//           {
//             item: 'Data Security',
//             warranty: 'Industry-standard security measures',
//             coverage: 'Data protection and privacy compliance',
//             exclusions: 'Client data breaches due to misuse'
//           }
//         ],
//         limitations: `• Warranty does not cover damages due to misuse or unauthorized modifications
// • Warranty is limited to the original specifications and scope
// • Third-party components are covered by their respective vendor warranties
// • Warranty claims must be reported within 30 days of discovery`,
//         supportServices: {
//           included: [
//             '24/7 system monitoring',
//             'Email support during business hours',
//             'Phone support for critical issues',
//             'Regular system updates and patches',
//             'Knowledge base and documentation access'
//           ],
//           optional: [
//             'Dedicated support engineer',
//             'On-site support visits',
//             'Extended warranty coverage',
//             'Custom training sessions',
//             'Emergency response service'
//           ]
//         },
//         terminationClauses: `Either party may terminate this agreement with 30 days written notice. In case of termination:
// • Client will pay for all services rendered up to termination date
// • All intellectual property rights transfer to client
// • Confidential information remains protected
// • Outstanding payments become immediately due`,
//         governingLaw: 'United Arab Emirates',
//         disputeResolution: 'Arbitration in Dubai International Arbitration Centre'
//       }
//     },
//     {
//       id: 'contact_information',
//       type: 'contact_information',
//       title: 'Contact Information & Signatures',
//       enabled: true,
//       order: 10,
//       data: {
//         companyContacts: [
//           {
//             name: 'John Smith',
//             title: 'Business Development Manager',
//             phone: '+971 50 123 4567',
//             email: 'john.smith@sbrtech.com',
//             department: 'Sales'
//           },
//           {
//             name: 'Sarah Johnson',
//             title: 'Project Manager',
//             phone: '+971 50 765 4321',
//             email: 'sarah.johnson@sbrtech.com',
//             department: 'Delivery'
//           },
//           {
//             name: 'Mike Davis',
//             title: 'Technical Lead',
//             phone: '+971 50 987 6543',
//             email: 'mike.davis@sbrtech.com',
//             department: 'Technical'
//           }
//         ],
//         clientContacts: [
//           {
//             name: '',
//             title: '',
//             phone: '',
//             email: '',
//             department: ''
//           }
//         ],
//         signatures: {
//           clientSignature: '',
//           clientName: '',
//           clientTitle: '',
//           clientDate: '',
//           companySignature: 'John Smith',
//           companyTitle: 'Business Development Manager',
//           companyDate: new Date().toISOString().split('T')[0]
//         },
//         nextSteps: [
//           'Review and approval of proposal',
//           'Contract signing and legal review',
//           'Project kickoff meeting scheduling',
//           'Resource allocation and team assignment',
//           'Detailed project planning and timeline confirmation'
//         ],
//         additionalNotes: ''
//       }
//     }
//   ]);

//   const [draggedSection, setDraggedSection] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Auto-fill customer details when customer is selected
//   useEffect(() => {
//     if (quotationData.customerId) {
//       const selectedCustomer = customers.find(c => c.id === quotationData.customerId);
//       if (selectedCustomer) {
//         // Update cover page with customer details
//         const coverSection = sections.find(s => s.type === 'cover_page');
//         if (coverSection) {
//           updateSectionData('cover_page', {
//             recipientName: selectedCustomer.primaryContact.name,
//             recipientCompany: selectedCustomer.companyName,
//             recipientEmail: selectedCustomer.primaryContact.email,
//             recipientPhone: selectedCustomer.primaryContact.phone
//           });
//         }

//         // Update contact information with customer details
//         const contactSection = sections.find(s => s.type === 'contact_information');
//         if (contactSection) {
//           updateSectionData('contact_information', {
//             clientContacts: [{
//               name: selectedCustomer.primaryContact.name,
//               title: selectedCustomer.primaryContact.designation,
//               phone: selectedCustomer.primaryContact.phone,
//               email: selectedCustomer.primaryContact.email,
//               department: ''
//             }]
//           });
//         }
//       }
//     }
//   }, [quotationData.customerId, customers]);

//   // Calculate totals function with useCallback to prevent infinite re-renders
//   const calculateTotals = useCallback(() => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (!quotationSection) return;

//     let subtotal = 0;
//     let totalDiscount = 0;
//     let totalTax = 0;

//     quotationSection.data.items.forEach((item: QuotationItem) => {
//       const itemSubtotal = item.quantity * item.rate;
//       const itemDiscount = item.discountType === 'percentage'
//         ? itemSubtotal * (item.discount / 100)
//         : item.discount;
//       const itemTax = item.taxType === 'percentage'
//         ? (itemSubtotal - itemDiscount) * (item.tax / 100)
//         : item.tax;

//       subtotal += itemSubtotal;
//       totalDiscount += itemDiscount;
//       totalTax += itemTax;
//     });

//     const grandTotal = subtotal - totalDiscount + totalTax + quotationSection.data.serviceCharges;

//     // Only update if values actually changed
//     if (quotationSection.data.subtotal !== subtotal || 
//         quotationSection.data.totalDiscount !== totalDiscount || 
//         quotationSection.data.totalTax !== totalTax || 
//         quotationSection.data.grandTotal !== grandTotal) {
      
//       const updatedSections = sections.map(section =>
//         section.id === 'quotation_items'
//           ? { ...section, data: { ...section.data, subtotal, totalDiscount, totalTax, grandTotal } }
//           : section
//       );
//       setSections(updatedSections);
//     }
//   }, [sections]);

//   // Use effect with proper dependencies
//   useEffect(() => {
//     calculateTotals();
//   }, [calculateTotals]);

//   const moveSection = (fromIndex: number, toIndex: number) => {
//     const newSections = [...sections];
//     const [moved] = newSections.splice(fromIndex, 1);
//     newSections.splice(toIndex, 0, moved);

//     newSections.forEach((section, index) => {
//       section.order = index + 1;
//     });

//     setSections(newSections);
//   };

//   const toggleSection = (sectionId: string) => {
//     setSections(sections.map(section =>
//       section.id === sectionId
//         ? { ...section, enabled: !section.enabled }
//         : section
//     ));
//   };

//   const updateSectionData = (sectionId: string, data: any) => {
//     setSections(sections.map(section =>
//       section.id === sectionId
//         ? { ...section, data: { ...section.data, ...data } }
//         : section
//     ));
//   };

//   const addProductDetail = () => {
//     const productSection = sections.find(s => s.type === 'product_specifications');
//     if (productSection) {
//       const newProduct: ProductDetail = {
//         id: `product_${Date.now()}`,
//         productId: '',
//         quantity: 1,
//         unitPrice: 0,
//         discount: 0,
//         description: '',
//         images: []
//       };

//       updateSectionData('product_specifications', {
//         products: [...productSection.data.products, newProduct]
//       });
//     }
//   };

//   const removeProductDetail = (productId: string) => {
//     const productSection = sections.find(s => s.type === 'product_specifications');
//     if (productSection) {
//       updateSectionData('product_specifications', {
//         products: productSection.data.products.filter((p: ProductDetail) => p.id !== productId)
//       });
//     }
//   };

//   const updateProductDetail = (productId: string, data: Partial<ProductDetail>) => {
//     const productSection = sections.find(s => s.type === 'product_specifications');
//     if (productSection) {
//       updateSectionData('product_specifications', {
//         products: productSection.data.products.map((p: ProductDetail) =>
//           p.id === productId ? { ...p, ...data } : p
//         )
//       });
//     }
//   };

//   const addQuotationItem = () => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       const newItem: QuotationItem = {
//         id: `item_${Date.now()}`,
//         itemId: `Q${(quotationSection.data.items.length + 1).toString().padStart(3, '0')}`,
//         productId: '',
//         productName: '',
//         description: '',
//         quantity: 1,
//         rate: 0,
//         discount: 0,
//         discountType: 'percentage',
//         tax: 0,
//         taxType: 'percentage',
//         serviceCharges: 0,
//         amount: 0
//       };

//       updateSectionData('quotation_items', {
//         items: [...quotationSection.data.items, newItem]
//       });
//     }
//   };

//   const removeQuotationItem = (itemId: string) => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       updateSectionData('quotation_items', {
//         items: quotationSection.data.items.filter((item: QuotationItem) => item.id !== itemId)
//       });
//     }
//   };

//   const updateQuotationItem = (itemId: string, data: Partial<QuotationItem>) => {
//     const quotationSection = sections.find(s => s.type === 'quotation_items');
//     if (quotationSection) {
//       const updatedItems = quotationSection.data.items.map((item: QuotationItem) => {
//         if (item.id === itemId) {
//           const updatedItem = { ...item, ...data };
          
//           // Calculate amount for this item only
//           const subtotal = updatedItem.quantity * updatedItem.rate;
//           const discountAmount = updatedItem.discountType === 'percentage'
//             ? subtotal * (updatedItem.discount / 100)
//             : updatedItem.discount;
//           const taxableAmount = subtotal - discountAmount;
//           const taxAmount = updatedItem.taxType === 'percentage'
//             ? taxableAmount * (updatedItem.tax / 100)
//             : updatedItem.tax;
//           updatedItem.amount = taxableAmount + taxAmount + updatedItem.serviceCharges;
          
//           return updatedItem;
//         }
//         return item;
//       });

//       updateSectionData('quotation_items', { items: updatedItems });
//     }
//   };

//   const handleDragStart = (e: React.DragEvent, sectionId: string) => {
//     setDraggedSection(sectionId);
//     e.dataTransfer.effectAllowed = 'move';
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = 'move';
//   };

//   const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
//     e.preventDefault();
//     if (!draggedSection || draggedSection === targetSectionId) return;

//     const fromIndex = sections.findIndex(s => s.id === draggedSection);
//     const toIndex = sections.findIndex(s => s.id === targetSectionId);

//     moveSection(fromIndex, toIndex);
//     setDraggedSection(null);
//   };

//   // Save quotation function - Firebase compatible
//   const saveQuotation = async (status: 'draft' | 'sent' = 'draft') => {
//     setLoading(true);
//     try {
//       const quotationSection = sections.find(s => s.type === 'quotation_items');
//       const customer = customers.find(c => c.id === quotationData.customerId);

//       if (!customer) {
//         alert('Please select a customer');
//         setLoading(false);
//         return;
//       }

//       const finalQuotationData = {
//         ...quotationData,
//         status,
//         customerName: customer.primaryContact.name,
//         customerCompany: customer.companyName,
//         customerEmail: customer.primaryContact.email,
//         customerPhone: customer.primaryContact.phone,
//         sections: sections.filter(s => s.enabled),
//         items: quotationSection?.data.items || [],
//         subtotal: quotationSection?.data.subtotal || 0,
//         totalDiscount: quotationSection?.data.totalDiscount || 0,
//         totalTax: quotationSection?.data.totalTax || 0,
//         serviceCharges: quotationSection?.data.serviceCharges || 0,
//         totalAmount: quotationSection?.data.grandTotal || 0,
//         createdBy: 'admin',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Firebase mein save karein
//       const quotationId = await saveQuotationToFirebase(finalQuotationData);
      
//       alert(`Quotation ${status === 'draft' ? 'saved as draft' : 'sent'} successfully!`);
      
//       if (status === 'sent') {
//         router.push('/admin/sales/quotations');
//       }
//     } catch (error) {
//       console.error('Error saving quotation:', error);
//       alert('Error saving quotation');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // PDF Generation Function
//   const generatePDF = async () => {
//     setLoading(true);
//     try {
//       // Create a new PDF instance
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       let currentPage = 1;
//       const pageHeight = pdf.internal.pageSize.height;
//       const pageWidth = pdf.internal.pageSize.width;
//       const margin = 20;
//       let yPosition = margin;

//       // Get enabled sections
//       const enabledSections = sections.filter(s => s.enabled);
//       const customer = customers.find(c => c.id === quotationData.customerId);

//       // Helper function to add text with page break
//       const addTextWithPageBreak = (text: string, fontSize: number = 12, isBold: boolean = false, lineHeight: number = 7) => {
//         pdf.setFontSize(fontSize);
//         pdf.setFont(isBold ? 'helvetica' : 'helvetica', isBold ? 'bold' : 'normal');
        
//         const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
        
//         for (let i = 0; i < lines.length; i++) {
//           if (yPosition + lineHeight > pageHeight - margin) {
//             pdf.addPage();
//             currentPage++;
//             yPosition = margin;
//           }
//           pdf.text(lines[i], margin, yPosition);
//           yPosition += lineHeight;
//         }
//         yPosition += 2;
//       };

//       // Helper function to add section header
//       const addSectionHeader = (title: string) => {
//         if (yPosition + 15 > pageHeight - margin) {
//           pdf.addPage();
//           currentPage++;
//           yPosition = margin;
//         }
//         addTextWithPageBreak(title, 16, true, 10);
//         pdf.setDrawColor(200, 200, 200);
//         pdf.line(margin, yPosition, pageWidth - margin, yPosition);
//         yPosition += 5;
//       };

//       // Cover Page
//       addSectionHeader('QUOTATION PROPOSAL');
//       yPosition += 10;

//       // Company Information
//       const coverSection = sections.find(s => s.type === 'cover_page');
//       if (coverSection) {
//         addTextWithPageBreak(coverSection.data.companyName, 14, true);
//         addTextWithPageBreak(coverSection.data.companyAddress, 10);
//         addTextWithPageBreak(`Phone: ${coverSection.data.companyPhone}`, 10);
//         addTextWithPageBreak(`Email: ${coverSection.data.companyEmail}`, 10);
//         addTextWithPageBreak(`Website: ${coverSection.data.companyWebsite}`, 10);
//         yPosition += 10;
//       }

//       // Recipient Information
//       if (customer) {
//         addTextWithPageBreak('To:', 12, true);
//         addTextWithPageBreak(customer.primaryContact.name, 12);
//         addTextWithPageBreak(customer.companyName, 12);
//         addTextWithPageBreak(`Email: ${customer.primaryContact.email}`, 10);
//         addTextWithPageBreak(`Phone: ${customer.primaryContact.phone}`, 10);
//         yPosition += 10;
//       }

//       // Quotation Details
//       addTextWithPageBreak(`Quotation Number: ${quotationData.quotationNumber}`, 12);
//       addTextWithPageBreak(`Issue Date: ${new Date(quotationData.issueDate).toLocaleDateString()}`, 12);
//       addTextWithPageBreak(`Valid Until: ${new Date(quotationData.validUntil).toLocaleDateString()}`, 12);
//       yPosition += 15;

//       // Cover Letter
//       if (coverSection?.data.letterContent) {
//         addTextWithPageBreak('Dear Valued Client,', 12);
//         addTextWithPageBreak(coverSection.data.letterContent, 11);
//         yPosition += 10;
//       }

//       // Process each enabled section
//       for (const section of enabledSections) {
//         if (section.type === 'cover_page') continue; // Skip cover page as we already processed it
        
//         // Add page break for new section
//         if (yPosition + 30 > pageHeight - margin) {
//           pdf.addPage();
//           currentPage++;
//           yPosition = margin;
//         }

//         addSectionHeader(section.title.toUpperCase());

//         switch (section.type) {
//           case 'executive_summary':
//             if (section.data.summary) {
//               addTextWithPageBreak(section.data.summary, 11);
//             }
//             if (section.data.keyBenefits && section.data.keyBenefits.length > 0) {
//               yPosition += 5;
//               addTextWithPageBreak('Key Benefits:', 12, true);
//               section.data.keyBenefits.forEach((benefit: string) => {
//                 addTextWithPageBreak(`• ${benefit}`, 11);
//               });
//             }
//             break;

//           case 'company_introduction':
//             if (section.data.description) {
//               addTextWithPageBreak(section.data.description, 11);
//             }
//             if (section.data.achievements && section.data.achievements.length > 0) {
//               yPosition += 5;
//               addTextWithPageBreak('Achievements:', 12, true);
//               section.data.achievements.forEach((achievement: string) => {
//                 addTextWithPageBreak(`• ${achievement}`, 11);
//               });
//             }
//             break;

//           case 'problem_statement':
//             if (section.data.currentSituation) {
//               addTextWithPageBreak(section.data.currentSituation, 11);
//             }
//             if (section.data.objectives && section.data.objectives.length > 0) {
//               yPosition += 5;
//               addTextWithPageBreak('Objectives:', 12, true);
//               section.data.objectives.forEach((objective: string) => {
//                 addTextWithPageBreak(`• ${objective}`, 11);
//               });
//             }
//             break;

//           case 'solution_details':
//             if (section.data.solutionOverview) {
//               addTextWithPageBreak(section.data.solutionOverview, 11);
//             }
//             if (section.data.keyFeatures && section.data.keyFeatures.length > 0) {
//               yPosition += 5;
//               addTextWithPageBreak('Key Features:', 12, true);
//               section.data.keyFeatures.forEach((feature: string) => {
//                 addTextWithPageBreak(`• ${feature}`, 11);
//               });
//             }
//             break;

//           case 'product_specifications':
//             if (section.data.products && section.data.products.length > 0) {
//               addTextWithPageBreak('Products & Services:', 12, true);
//               section.data.products.forEach((product: ProductDetail, index: number) => {
//                 const selectedProduct = products.find(p => p.id === product.productId);
//                 if (selectedProduct) {
//                   addTextWithPageBreak(`${index + 1}. ${selectedProduct.name}`, 11, true);
//                   addTextWithPageBreak(`   Description: ${product.description || selectedProduct.description}`, 10);
//                   addTextWithPageBreak(`   Quantity: ${product.quantity}`, 10);
//                   addTextWithPageBreak(`   Unit Price: ${formatAmount(product.unitPrice)}`, 10);
//                   addTextWithPageBreak(`   Discount: ${product.discount}%`, 10);
//                   const lineTotal = (product.quantity * product.unitPrice) * (1 - product.discount / 100);
//                   addTextWithPageBreak(`   Line Total: ${formatAmount(lineTotal)}`, 10);
//                   yPosition += 2;
//                 }
//               });
//             }
//             break;

//           case 'quotation_items':
//             if (section.data.items && section.data.items.length > 0) {
//               addTextWithPageBreak('Quotation Items:', 12, true);
              
//               // Table header
//               const tableTop = yPosition;
//               pdf.setFontSize(10);
//               pdf.setFont('helvetica', 'bold');
//               pdf.text('Item', margin, yPosition);
//               pdf.text('Description', margin + 30, yPosition);
//               pdf.text('Qty', margin + 100, yPosition);
//               pdf.text('Rate', margin + 120, yPosition);
//               pdf.text('Amount', margin + 150, yPosition);
//               yPosition += 5;
//               pdf.line(margin, yPosition, pageWidth - margin, yPosition);
//               yPosition += 3;

//               // Table rows
//               pdf.setFont('helvetica', 'normal');
//               section.data.items.forEach((item: QuotationItem, index: number) => {
//                 if (yPosition + 15 > pageHeight - margin) {
//                   pdf.addPage();
//                   currentPage++;
//                   yPosition = margin + 20;
//                 }
                
//                 pdf.text((index + 1).toString(), margin, yPosition);
//                 pdf.text(item.productName.substring(0, 20), margin + 10, yPosition);
//                 pdf.text(item.description.substring(0, 25), margin + 30, yPosition);
//                 pdf.text(item.quantity.toString(), margin + 100, yPosition);
//                 pdf.text(formatAmount(item.rate), margin + 120, yPosition);
//                 pdf.text(formatAmount(item.amount), margin + 150, yPosition);
//                 yPosition += 6;
//               });

//               yPosition += 10;

//               // Summary
//               addTextWithPageBreak('Summary:', 12, true);
//               addTextWithPageBreak(`Subtotal: ${formatAmount(section.data.subtotal)}`, 11);
//               addTextWithPageBreak(`Discount: -${formatAmount(section.data.totalDiscount)}`, 11);
//               addTextWithPageBreak(`Tax: ${formatAmount(section.data.totalTax)}`, 11);
//               addTextWithPageBreak(`Service Charges: ${formatAmount(section.data.serviceCharges)}`, 11);
//               addTextWithPageBreak(`Grand Total: ${formatAmount(section.data.grandTotal)}`, 14, true);
//             }
//             break;

//           case 'timeline_schedule':
//             if (section.data.phases && section.data.phases.length > 0) {
//               addTextWithPageBreak('Project Timeline:', 12, true);
//               section.data.phases.forEach((phase: any, index: number) => {
//                 addTextWithPageBreak(`${index + 1}. ${phase.name} (${phase.duration})`, 11, true);
//                 if (phase.deliverables && phase.deliverables.length > 0) {
//                   phase.deliverables.forEach((deliverable: string) => {
//                     addTextWithPageBreak(`   • ${deliverable}`, 10);
//                   });
//                 }
//                 yPosition += 2;
//               });
//             }
//             break;

//           case 'terms_warranties':
//             if (section.data.generalTerms) {
//               addTextWithPageBreak('Terms & Conditions:', 12, true);
//               addTextWithPageBreak(section.data.generalTerms, 10);
//             }
//             break;

//           case 'contact_information':
//             if (section.data.companyContacts && section.data.companyContacts.length > 0) {
//               addTextWithPageBreak('Contact Information:', 12, true);
//               section.data.companyContacts.forEach((contact: any) => {
//                 addTextWithPageBreak(`${contact.name} - ${contact.title}`, 11);
//                 addTextWithPageBreak(`Phone: ${contact.phone} | Email: ${contact.email}`, 10);
//                 yPosition += 2;
//               });
//             }
//             break;
//         }

//         yPosition += 10;
//       }

//       // Footer with page numbers
//       const totalPages = (pdf.internal as any).getNumberOfPages();
//       for (let i = 1; i <= totalPages; i++) {
//         pdf.setPage(i);
//         pdf.setFontSize(8);
//         pdf.setTextColor(128, 128, 128);
//         pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 10);
//         pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
//       }

//       // Save the PDF
//       pdf.save(`quotation-${quotationData.quotationNumber}.pdf`);
      
//       alert('PDF generated successfully!');
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating PDF. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render functions for all sections
//   const renderCoverPage = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <h4 className="font-semibold text-lg">Company Information</h4>
//           <div className="space-y-3">
//             <div className="space-y-2">
//               <Label htmlFor="companyLogo">Company Logo URL</Label>
//               <Input
//                 id="companyLogo"
//                 value={section.data.companyLogo}
//                 onChange={(e) => updateSectionData(section.id, { companyLogo: e.target.value })}
//                 placeholder="https://example.com/logo.png"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="companyName">Company Name</Label>
//               <Input
//                 id="companyName"
//                 value={section.data.companyName}
//                 onChange={(e) => updateSectionData(section.id, { companyName: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="companyAddress">Company Address</Label>
//               <Textarea
//                 id="companyAddress"
//                 value={section.data.companyAddress}
//                 onChange={(e) => updateSectionData(section.id, { companyAddress: e.target.value })}
//                 rows={3}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <h4 className="font-semibold text-lg">Recipient Information</h4>
//           <div className="space-y-3">
//             <div className="space-y-2">
//               <Label htmlFor="recipientName">Recipient Name</Label>
//               <Input
//                 id="recipientName"
//                 value={section.data.recipientName}
//                 onChange={(e) => updateSectionData(section.id, { recipientName: e.target.value })}
//                 placeholder="Enter recipient name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="recipientCompany">Company</Label>
//               <Input
//                 id="recipientCompany"
//                 value={section.data.recipientCompany}
//                 onChange={(e) => updateSectionData(section.id, { recipientCompany: e.target.value })}
//                 placeholder="Enter company name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="recipientEmail">Email</Label>
//               <Input
//                 id="recipientEmail"
//                 type="email"
//                 value={section.data.recipientEmail}
//                 onChange={(e) => updateSectionData(section.id, { recipientEmail: e.target.value })}
//                 placeholder="Enter email address"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Cover Letter</h4>
//         <div className="space-y-3">
//           <div className="space-y-2">
//             <Label htmlFor="subject">Subject</Label>
//             <Input
//               id="subject"
//               value={section.data.subject}
//               onChange={(e) => updateSectionData(section.id, { subject: e.target.value })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="salutation">Salutation</Label>
//             <Input
//               id="salutation"
//               value={section.data.salutation}
//               onChange={(e) => updateSectionData(section.id, { salutation: e.target.value })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="letterContent">Letter Content</Label>
//             <Textarea
//               id="letterContent"
//               value={section.data.letterContent}
//               onChange={(e) => updateSectionData(section.id, { letterContent: e.target.value })}
//               rows={8}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderExecutiveSummary = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <Label htmlFor="summary">Executive Summary</Label>
//         <Textarea
//           id="summary"
//           value={section.data.summary}
//           onChange={(e) => updateSectionData(section.id, { summary: e.target.value })}
//           rows={8}
//           className="text-lg leading-relaxed"
//         />
//       </div>

//       <div className="space-y-4">
//         <Label>Key Benefits</Label>
//         <div className="space-y-2">
//           {section.data.keyBenefits.map((benefit: string, index: number) => (
//             <div key={index} className="flex items-center space-x-2">
//               <span className="text-green-600 font-bold">•</span>
//               <Input
//                 value={benefit}
//                 onChange={(e) => {
//                   const newBenefits = [...section.data.keyBenefits];
//                   newBenefits[index] = e.target.value;
//                   updateSectionData(section.id, { keyBenefits: newBenefits });
//                 }}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="proposalValue">Proposal Value</Label>
//           <Input
//             id="proposalValue"
//             value={section.data.proposalValue}
//             onChange={(e) => updateSectionData(section.id, { proposalValue: e.target.value })}
//             placeholder="e.g., $500,000"
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="estimatedDuration">Estimated Duration</Label>
//           <Input
//             id="estimatedDuration"
//             value={section.data.estimatedDuration}
//             onChange={(e) => updateSectionData(section.id, { estimatedDuration: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="totalInvestment">Total Investment</Label>
//           <Input
//             id="totalInvestment"
//             value={section.data.totalInvestment}
//             onChange={(e) => updateSectionData(section.id, { totalInvestment: e.target.value })}
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderCompanyIntroduction = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//         <img
//           src={section.data.companyLogo}
//           alt="Company Logo"
//           className="h-20 w-20 object-contain rounded-lg border"
//         />
//         <div className="space-y-2">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="foundedYear">Founded Year</Label>
//               <Input
//                 id="foundedYear"
//                 value={section.data.foundedYear}
//                 onChange={(e) => updateSectionData(section.id, { foundedYear: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="employeeCount">Employee Count</Label>
//               <Input
//                 id="employeeCount"
//                 value={section.data.employeeCount}
//                 onChange={(e) => updateSectionData(section.id, { employeeCount: e.target.value })}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="description">Company Description</Label>
//         <Textarea
//           id="description"
//           value={section.data.description}
//           onChange={(e) => updateSectionData(section.id, { description: e.target.value })}
//           rows={4}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label>Office Locations</Label>
//         <div className="flex flex-wrap gap-2">
//           {section.data.officeLocations.map((location: string, index: number) => (
//             <Badge key={index} variant="secondary" className="px-3 py-1">
//               {location}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Certifications</Label>
//         <div className="flex flex-wrap gap-2">
//           {section.data.certifications.map((cert: string, index: number) => (
//             <Badge key={index} variant="outline" className="px-3 py-1 border-blue-200 text-blue-700">
//               {cert}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Achievements</Label>
//         <div className="grid grid-cols-2 gap-2">
//           {section.data.achievements.map((achievement: string, index: number) => (
//             <Input
//               key={index}
//               value={achievement}
//               onChange={(e) => {
//                 const newAchievements = [...section.data.achievements];
//                 newAchievements[index] = e.target.value;
//                 updateSectionData(section.id, { achievements: newAchievements });
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label>Core Values</Label>
//         <div className="grid grid-cols-2 gap-2">
//           {section.data.coreValues.map((value: string, index: number) => (
//             <Input
//               key={index}
//               value={value}
//               onChange={(e) => {
//                 const newValues = [...section.data.coreValues];
//                 newValues[index] = e.target.value;
//                 updateSectionData(section.id, { coreValues: newValues });
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       <div className="space-y-4">
//         <Label>Company Images</Label>
//         <div className="grid grid-cols-3 gap-4">
//           {section.data.companyImages.map((image: string, index: number) => (
//             <div key={index} className="space-y-2">
//               <img
//                 src={image}
//                 alt={`Company ${index + 1}`}
//                 className="w-full h-32 object-cover rounded-lg border"
//               />
//               <Input
//                 value={image}
//                 onChange={(e) => {
//                   const newImages = [...section.data.companyImages];
//                   newImages[index] = e.target.value;
//                   updateSectionData(section.id, { companyImages: newImages });
//                 }}
//                 placeholder="Image URL"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderProblemStatement = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <Label>Client Challenges</Label>
//         <div className="space-y-2">
//           {section.data.clientChallenges.map((challenge: string, index: number) => (
//             <div key={index} className="flex items-start space-x-2">
//               <span className="text-red-600 font-bold mt-1">•</span>
//               <Textarea
//                 value={challenge}
//                 onChange={(e) => {
//                   const newChallenges = [...section.data.clientChallenges];
//                   newChallenges[index] = e.target.value;
//                   updateSectionData(section.id, { clientChallenges: newChallenges });
//                 }}
//                 rows={2}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="currentSituation">Current Situation Analysis</Label>
//         <Textarea
//           id="currentSituation"
//           value={section.data.currentSituation}
//           onChange={(e) => updateSectionData(section.id, { currentSituation: e.target.value })}
//           rows={6}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="impactAssessment">Impact Assessment</Label>
//         <Textarea
//           id="impactAssessment"
//           value={section.data.impactAssessment}
//           onChange={(e) => updateSectionData(section.id, { impactAssessment: e.target.value })}
//           rows={4}
//         />
//       </div>

//       <div className="space-y-4">
//         <Label>Project Objectives</Label>
//         <div className="space-y-2">
//           {section.data.objectives.map((objective: string, index: number) => (
//             <div key={index} className="flex items-start space-x-2">
//               <span className="text-green-600 font-bold mt-1">✓</span>
//               <Textarea
//                 value={objective}
//                 onChange={(e) => {
//                   const newObjectives = [...section.data.objectives];
//                   newObjectives[index] = e.target.value;
//                   updateSectionData(section.id, { objectives: newObjectives });
//                 }}
//                 rows={2}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-4">
//         <Label>Success Criteria</Label>
//         <div className="space-y-2">
//           {section.data.successCriteria.map((criteria: string, index: number) => (
//             <div key={index} className="flex items-start space-x-2">
//               <span className="text-blue-600 font-bold mt-1">🎯</span>
//               <Textarea
//                 value={criteria}
//                 onChange={(e) => {
//                   const newCriteria = [...section.data.successCriteria];
//                   newCriteria[index] = e.target.value;
//                   updateSectionData(section.id, { successCriteria: newCriteria });
//                 }}
//                 rows={2}
//                 className="flex-1"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderSolutionDetails = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <Label htmlFor="approach">Our Approach</Label>
//         <Textarea
//           id="approach"
//           value={section.data.approach}
//           onChange={(e) => updateSectionData(section.id, { approach: e.target.value })}
//           rows={6}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="solutionOverview">Solution Overview</Label>
//         <Textarea
//           id="solutionOverview"
//           value={section.data.solutionOverview}
//           onChange={(e) => updateSectionData(section.id, { solutionOverview: e.target.value })}
//           rows={8}
//         />
//       </div>

//       <div className="space-y-4">
//         <Label>Key Features</Label>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {section.data.keyFeatures.map((feature: string, index: number) => (
//             <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
//               <span className="text-blue-600 font-bold">✨</span>
//               <Input
//                 value={feature}
//                 onChange={(e) => {
//                   const newFeatures = [...section.data.keyFeatures];
//                   newFeatures[index] = e.target.value;
//                   updateSectionData(section.id, { keyFeatures: newFeatures });
//                 }}
//                 className="flex-1 bg-transparent border-none"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="technicalApproach">Technical Approach</Label>
//         <Textarea
//           id="technicalApproach"
//           value={section.data.technicalApproach}
//           onChange={(e) => updateSectionData(section.id, { technicalApproach: e.target.value })}
//           rows={6}
//           className="font-mono text-sm"
//         />
//       </div>

//       <div className="space-y-4">
//         <Label>Benefits</Label>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {section.data.benefits.map((benefit: string, index: number) => (
//             <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
//               <span className="text-green-600 font-bold">✓</span>
//               <Input
//                 value={benefit}
//                 onChange={(e) => {
//                   const newBenefits = [...section.data.benefits];
//                   newBenefits[index] = e.target.value;
//                   updateSectionData(section.id, { benefits: newBenefits });
//                 }}
//                 className="flex-1 bg-transparent border-none"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-4">
//         <Label>Solution Images</Label>
//         <div className="grid grid-cols-3 gap-4">
//           {section.data.solutionImages.map((image: string, index: number) => (
//             <div key={index} className="space-y-2">
//               <img
//                 src={image}
//                 alt={`Solution ${index + 1}`}
//                 className="w-full h-32 object-cover rounded-lg border"
//               />
//               <Input
//                 value={image}
//                 onChange={(e) => {
//                   const newImages = [...section.data.solutionImages];
//                   newImages[index] = e.target.value;
//                   updateSectionData(section.id, { solutionImages: newImages });
//                 }}
//                 placeholder="Image URL"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderProductSpecifications = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <h4 className="font-semibold text-lg">Product Details</h4>
//           <Button onClick={addProductDetail} size="sm" disabled={productsLoading}>
//             <Plus className="h-4 w-4 mr-2" />
//             {productsLoading ? 'Loading...' : 'Add Product'}
//           </Button>
//         </div>

//         {productsLoading && (
//           <div className="flex items-center justify-center p-8">
//             <Loader2 className="h-6 w-6 animate-spin mr-2" />
//             <span>Loading products...</span>
//           </div>
//         )}

//         {section.data.products.map((product: ProductDetail, index: number) => {
//           const selectedProduct = products.find(p => p.id === product.productId);
//           return (
//             <Card key={product.id} className="p-4">
//               <div className="flex justify-between items-start mb-4">
//                 <h5 className="font-medium">Product {index + 1}</h5>
//                 <Button
//                   onClick={() => removeProductDetail(product.id)}
//                   variant="destructive"
//                   size="sm"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="space-y-2">
//                   <Label>Product</Label>
//                   <Select
//                     value={product.productId}
//                     onValueChange={(value) => {
//                       const selectedProd = products.find(p => p.id === value);
//                       updateProductDetail(product.id, { 
//                         productId: value,
//                         unitPrice: selectedProd?.sellingPrice || 0,
//                         description: selectedProd?.description || ''
//                       });
//                     }}
//                     disabled={productsLoading}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder={productsLoading ? "Loading products..." : "Select product"} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {products.map((p) => (
//                         <SelectItem key={p.id} value={p.id}>
//                           {p.name} - {formatAmount(p.sellingPrice)}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Quantity</Label>
//                   <Input
//                     type="number"
//                     value={product.quantity}
//                     onChange={(e) => updateProductDetail(product.id, { quantity: parseInt(e.target.value) || 0 })}
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <div className="space-y-2">
//                   <Label>Unit Price</Label>
//                   <Input
//                     type="number"
//                     value={product.unitPrice}
//                     onChange={(e) => {
//                       updateProductDetail(product.id, { unitPrice: parseFloat(e.target.value) || 0 });
//                     }}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Discount (%)</Label>
//                   <Input
//                     type="number"
//                     value={product.discount}
//                     onChange={(e) => {
//                       updateProductDetail(product.id, { discount: parseFloat(e.target.value) || 0 });
//                     }}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Line Total</Label>
//                   <Input
//                     value={formatAmount((product.quantity * product.unitPrice) * (1 - product.discount / 100))}
//                     readOnly
//                     className="bg-gray-50"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2 mb-4">
//                 <Label>Description</Label>
//                 <Textarea
//                   value={product.description || selectedProduct?.description || ''}
//                   onChange={(e) => updateProductDetail(product.id, { description: e.target.value })}
//                   rows={2}
//                   placeholder={selectedProduct?.description || "Product description"}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Product Images (URLs)</Label>
//                 <div className="space-y-2">
//                   {product.images.map((image: string, imgIndex: number) => (
//                     <div key={imgIndex} className="flex gap-2">
//                       <Input
//                         value={image}
//                         onChange={(e) => {
//                           const newImages = [...product.images];
//                           newImages[imgIndex] = e.target.value;
//                           updateProductDetail(product.id, { images: newImages });
//                         }}
//                         placeholder="https://example.com/image.jpg"
//                       />
//                       <Button
//                         onClick={() => {
//                           const newImages = product.images.filter((_, i) => i !== imgIndex);
//                           updateProductDetail(product.id, { images: newImages });
//                         }}
//                         variant="outline"
//                         size="sm"
//                       >
//                         <Minus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                   <Button
//                     onClick={() => {
//                       updateProductDetail(product.id, { images: [...product.images, ''] });
//                     }}
//                     variant="outline"
//                     size="sm"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Image
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           );
//         })}
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Technical Specifications</h4>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="platform">Platform</Label>
//             <Input
//               id="platform"
//               value={section.data.technicalSpecifications.platform}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   platform: e.target.value
//                 }
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="technology">Technology Stack</Label>
//             <Input
//               id="technology"
//               value={section.data.technicalSpecifications.technology}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   technology: e.target.value
//                 }
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="mobileSupport">Mobile Support</Label>
//             <Input
//               id="mobileSupport"
//               value={section.data.technicalSpecifications.mobileSupport}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   mobileSupport: e.target.value
//                 }
//               })}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="browserSupport">Browser Support</Label>
//             <Input
//               id="browserSupport"
//               value={section.data.technicalSpecifications.browserSupport}
//               onChange={(e) => updateSectionData(section.id, {
//                 technicalSpecifications: {
//                   ...section.data.technicalSpecifications,
//                   browserSupport: e.target.value
//                 }
//               })}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Service Specifications</h4>
//         {section.data.serviceSpecifications.map((service: any, index: number) => (
//           <Card key={index} className="p-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Service</Label>
//                 <Input
//                   value={service.service}
//                   onChange={(e) => {
//                     const newServices = [...section.data.serviceSpecifications];
//                     newServices[index].service = e.target.value;
//                     updateSectionData(section.id, { serviceSpecifications: newServices });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Timeline</Label>
//                 <Input
//                   value={service.timeline}
//                   onChange={(e) => {
//                     const newServices = [...section.data.serviceSpecifications];
//                     newServices[index].timeline = e.target.value;
//                     updateSectionData(section.id, { serviceSpecifications: newServices });
//                   }}
//                 />
//               </div>
//             </div>
//             <div className="space-y-2 mt-4">
//               <Label>Description</Label>
//               <Textarea
//                 value={service.description}
//                 onChange={(e) => {
//                   const newServices = [...section.data.serviceSpecifications];
//                   newServices[index].description = e.target.value;
//                   updateSectionData(section.id, { serviceSpecifications: newServices });
//                 }}
//                 rows={2}
//               />
//             </div>
//           </Card>
//         ))}
//       </div>

//       <div className="space-y-4">
//         <Label>Compliance Standards</Label>
//         <div className="flex flex-wrap gap-2">
//           {section.data.complianceStandards.map((standard: string, index: number) => (
//             <Badge key={index} variant="outline" className="px-3 py-1 border-green-200 text-green-700">
//               {standard}
//             </Badge>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderQuotationItems = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <h4 className="font-semibold text-lg">Quotation Items</h4>
//           <Button onClick={addQuotationItem} size="sm" disabled={productsLoading}>
//             <Plus className="h-4 w-4 mr-2" />
//             {productsLoading ? 'Loading Products...' : 'Add Item'}
//           </Button>
//         </div>

//         {productsLoading && (
//           <div className="flex items-center justify-center p-8">
//             <Loader2 className="h-6 w-6 animate-spin mr-2" />
//             <span>Loading products...</span>
//           </div>
//         )}

//         <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg font-medium text-sm">
//           <div className="col-span-1">Item ID</div>
//           <div className="col-span-2">Product</div>
//           <div className="col-span-2">Description</div>
//           <div className="col-span-1">Qty</div>
//           <div className="col-span-1">Rate</div>
//           <div className="col-span-1">Discount</div>
//           <div className="col-span-1">Tax</div>
//           <div className="col-span-1">Service</div>
//           <div className="col-span-1">Amount</div>
//           <div className="col-span-1">Actions</div>
//         </div>

//         {section.data.items.map((item: QuotationItem, index: number) => (
//           <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
//             <div className="col-span-1">
//               <Input
//                 value={item.itemId}
//                 onChange={(e) => updateQuotationItem(item.id, { itemId: e.target.value })}
//                 placeholder="001"
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-2 space-y-1">
//               <Select
//                 value={item.productId}
//                 onValueChange={(value) => {
//                   const product = products.find(p => p.id === value);
//                   if (product) {
//                     updateQuotationItem(item.id, {
//                       productId: value,
//                       productName: product.name,
//                       description: product.description,
//                       rate: product.sellingPrice
//                     });
//                   }
//                 }}
//                 disabled={productsLoading}
//               >
//                 <SelectTrigger className="text-sm">
//                   <SelectValue placeholder={productsLoading ? "Loading..." : "Select product"} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {products.map((p) => (
//                     <SelectItem key={p.id} value={p.id}>
//                       {p.name} - {formatAmount(p.sellingPrice)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Input
//                 value={item.productName}
//                 onChange={(e) => updateQuotationItem(item.id, { productName: e.target.value })}
//                 placeholder="Product name"
//                 className="text-xs"
//               />
//             </div>
//             <div className="col-span-2">
//               <Textarea
//                 value={item.description}
//                 onChange={(e) => updateQuotationItem(item.id, { description: e.target.value })}
//                 rows={2}
//                 className="text-sm"
//                 placeholder="Product description"
//               />
//             </div>
//             <div className="col-span-1">
//               <Input
//                 type="number"
//                 value={item.quantity}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { quantity: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-1">
//               <Input
//                 type="number"
//                 value={item.rate}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { rate: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-1 space-y-1">
//               <Input
//                 type="number"
//                 value={item.discount}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { discount: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//               <Select
//                 value={item.discountType}
//                 onValueChange={(value: 'percentage' | 'fixed') => {
//                   updateQuotationItem(item.id, { discountType: value });
//                 }}
//               >
//                 <SelectTrigger className="text-xs h-6">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="percentage">%</SelectItem>
//                   <SelectItem value="fixed">Fixed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="col-span-1 space-y-1">
//               <Input
//                 type="number"
//                 value={item.tax}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { tax: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//               <Select
//                 value={item.taxType}
//                 onValueChange={(value: 'percentage' | 'fixed') => {
//                   updateQuotationItem(item.id, { taxType: value });
//                 }}
//               >
//                 <SelectTrigger className="text-xs h-6">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="percentage">%</SelectItem>
//                   <SelectItem value="fixed">Fixed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="col-span-1">
//               <Input
//                 type="number"
//                 value={item.serviceCharges}
//                 onChange={(e) => {
//                   updateQuotationItem(item.id, { serviceCharges: parseFloat(e.target.value) || 0 });
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             <div className="col-span-1">
//               <Input
//                 value={formatAmount(item.amount)}
//                 readOnly
//                 className="bg-gray-50 text-sm font-medium"
//               />
//             </div>
//             <div className="col-span-1">
//               <Button
//                 onClick={() => removeQuotationItem(item.id)}
//                 variant="destructive"
//                 size="sm"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Summary</h4>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="space-y-2">
//             <Label>Currency</Label>
//             <Select
//               value={section.data.currency}
//               onValueChange={(value) => updateSectionData(section.id, { currency: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="AED">AED</SelectItem>
//                 <SelectItem value="USD">USD</SelectItem>
//                 <SelectItem value="EUR">EUR</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div className="space-y-2">
//             <Label>Service Charges</Label>
//             <Input
//               type="number"
//               value={section.data.serviceCharges}
//               onChange={(e) => {
//                 updateSectionData(section.id, { serviceCharges: parseFloat(e.target.value) || 0 });
//               }}
//             />
//           </div>
//           <div className="space-y-2">
//             <Label>Notes</Label>
//             <Textarea
//               value={section.data.notes}
//               onChange={(e) => updateSectionData(section.id, { notes: e.target.value })}
//               rows={2}
//               placeholder="Additional notes..."
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Subtotal</p>
//             <p className="text-lg font-bold text-gray-900">
//               {formatAmount(section.data.subtotal)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Discount</p>
//             <p className="text-lg font-bold text-green-600">
//               -{formatAmount(section.data.totalDiscount)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Tax</p>
//             <p className="text-lg font-bold text-blue-600">
//               +{formatAmount(section.data.totalTax)}
//             </p>
//           </div>
//           <div className="text-center">
//             <p className="text-sm text-gray-600">Grand Total</p>
//             <p className="text-2xl font-bold text-red-600">
//               {formatAmount(section.data.grandTotal)}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderTimelineSchedule = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-3 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="totalDuration">Total Duration</Label>
//           <Input
//             id="totalDuration"
//             value={section.data.totalDuration}
//             onChange={(e) => updateSectionData(section.id, { totalDuration: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="startDate">Start Date</Label>
//           <Input
//             id="startDate"
//             type="date"
//             value={section.data.startDate}
//             onChange={(e) => updateSectionData(section.id, { startDate: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="endDate">End Date</Label>
//           <Input
//             id="endDate"
//             type="date"
//             value={section.data.endDate}
//             onChange={(e) => updateSectionData(section.id, { endDate: e.target.value })}
//           />
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Project Phases</h4>
//         {section.data.phases.map((phase: any, index: number) => (
//           <Card key={index} className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//               <div className="space-y-2">
//                 <Label>Phase Name</Label>
//                 <Input
//                   value={phase.name}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].name = e.target.value;
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Duration</Label>
//                 <Input
//                   value={phase.duration}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].duration = e.target.value;
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Start Date</Label>
//                 <Input
//                   type="date"
//                   value={phase.startDate}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].startDate = e.target.value;
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Deliverables</Label>
//                 <Textarea
//                   value={phase.deliverables.join('\n')}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].deliverables = e.target.value.split('\n');
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                   rows={3}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Milestones</Label>
//                 <Textarea
//                   value={phase.milestones.join('\n')}
//                   onChange={(e) => {
//                     const newPhases = [...section.data.phases];
//                     newPhases[index].milestones = e.target.value.split('\n');
//                     updateSectionData(section.id, { phases: newPhases });
//                   }}
//                   rows={2}
//                 />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       <div className="space-y-2">
//         <Label>Critical Path</Label>
//         <Textarea
//           value={section.data.criticalPath.join('\n')}
//           onChange={(e) => updateSectionData(section.id, {
//             criticalPath: e.target.value.split('\n')
//           })}
//           rows={4}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label>Dependencies</Label>
//         <Textarea
//           value={section.data.dependencies.join('\n')}
//           onChange={(e) => updateSectionData(section.id, {
//             dependencies: e.target.value.split('\n')
//           })}
//           rows={3}
//         />
//       </div>

//       <div className="space-y-4">
//         <Label>Risks & Mitigation</Label>
//         {section.data.risks.map((risk: any, index: number) => (
//           <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
//             <div className="flex-1 space-y-2">
//               <Input
//                 value={risk.risk}
//                 onChange={(e) => {
//                   const newRisks = [...section.data.risks];
//                   newRisks[index].risk = e.target.value;
//                   updateSectionData(section.id, { risks: newRisks });
//                 }}
//                 placeholder="Risk description"
//               />
//             </div>
//             <Select
//               value={risk.impact}
//               onValueChange={(value) => {
//                 const newRisks = [...section.data.risks];
//                 newRisks[index].impact = value;
//                 updateSectionData(section.id, { risks: newRisks });
//               }}
//             >
//               <SelectTrigger className="w-24">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Low">Low</SelectItem>
//                 <SelectItem value="Medium">Medium</SelectItem>
//                 <SelectItem value="High">High</SelectItem>
//               </SelectContent>
//             </Select>
//             <div className="flex-1">
//               <Textarea
//                 value={risk.mitigation}
//                 onChange={(e) => {
//                   const newRisks = [...section.data.risks];
//                   newRisks[index].mitigation = e.target.value;
//                   updateSectionData(section.id, { risks: newRisks });
//                 }}
//                 placeholder="Mitigation strategy"
//                 rows={2}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderTermsWarranties = (section: QuotationSection) => (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <Label htmlFor="generalTerms">General Terms</Label>
//         <Textarea
//           id="generalTerms"
//           value={section.data.generalTerms}
//           onChange={(e) => updateSectionData(section.id, { generalTerms: e.target.value })}
//           rows={8}
//           className="font-mono text-sm"
//         />
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Warranties</h4>
//         {section.data.warranties.map((warranty: any, index: number) => (
//           <Card key={index} className="p-4">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="space-y-2">
//                 <Label>Item</Label>
//                 <Input
//                   value={warranty.item}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].item = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Warranty</Label>
//                 <Input
//                   value={warranty.warranty}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].warranty = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Coverage</Label>
//                 <Textarea
//                   value={warranty.coverage}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].coverage = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                   rows={2}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Exclusions</Label>
//                 <Textarea
//                   value={warranty.exclusions}
//                   onChange={(e) => {
//                     const newWarranties = [...section.data.warranties];
//                     newWarranties[index].exclusions = e.target.value;
//                     updateSectionData(section.id, { warranties: newWarranties });
//                   }}
//                   rows={2}
//                 />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="limitations">Limitations</Label>
//         <Textarea
//           id="limitations"
//           value={section.data.limitations}
//           onChange={(e) => updateSectionData(section.id, { limitations: e.target.value })}
//           rows={4}
//         />
//       </div>

//       <div className="space-y-4">
//         <h4 className="font-semibold text-lg">Support Services</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-4">
//             <h5 className="font-medium text-green-700">Included Services</h5>
//             <div className="space-y-2">
//               {section.data.supportServices.included.map((service: string, index: number) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span className="text-green-600">✓</span>
//                   <Input
//                     value={service}
//                     onChange={(e) => {
//                       const newIncluded = [...section.data.supportServices.included];
//                       newIncluded[index] = e.target.value;
//                       updateSectionData(section.id, {
//                         supportServices: {
//                           ...section.data.supportServices,
//                           included: newIncluded
//                         }
//                       });
//                     }}
//                     className="flex-1"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="space-y-4">
//             <h5 className="font-medium text-blue-700">Optional Services</h5>
//             <div className="space-y-2">
//               {section.data.supportServices.optional.map((service: string, index: number) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <span className="text-blue-600">+</span>
//                   <Input
//                     value={service}
//                     onChange={(e) => {
//                       const newOptional = [...section.data.supportServices.optional];
//                       newOptional[index] = e.target.value;
//                       updateSectionData(section.id, {
//                         supportServices: {
//                           ...section.data.supportServices,
//                           optional: newOptional
//                         }
//                       });
//                     }}
//                     className="flex-1"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="terminationClauses">Termination Clauses</Label>
//         <Textarea
//           id="terminationClauses"
//           value={section.data.terminationClauses}
//           onChange={(e) => updateSectionData(section.id, { terminationClauses: e.target.value })}
//           rows={4}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="governingLaw">Governing Law</Label>
//           <Input
//             id="governingLaw"
//             value={section.data.governingLaw}
//             onChange={(e) => updateSectionData(section.id, { governingLaw: e.target.value })}
//           />
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="disputeResolution">Dispute Resolution</Label>
//           <Input
//             id="disputeResolution"
//             value={section.data.disputeResolution}
//             onChange={(e) => updateSectionData(section.id, { disputeResolution: e.target.value })}
//           />
//         </div>
//       </div>
//     </div>
//   );

//   const renderContactInformation = (section: QuotationSection) => (
//   <div className="space-y-6">
//     {/* Company Contacts */}
//     <div className="space-y-4">
//       <h4 className="font-semibold text-lg">Company Contacts</h4>
//       {section.data.companyContacts.map((contact: any, index: number) => (
//         <Card key={index} className="p-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Name</Label>
//               <Input
//                 value={contact.name}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.companyContacts];
//                   newContacts[index].name = e.target.value;
//                   updateSectionData(section.id, { companyContacts: newContacts });
//                 }}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Title</Label>
//               <Input
//                 value={contact.title}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.companyContacts];
//                   newContacts[index].title = e.target.value;
//                   updateSectionData(section.id, { companyContacts: newContacts });
//                 }}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Phone</Label>
//               <Input
//                 value={contact.phone}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.companyContacts];
//                   newContacts[index].phone = e.target.value;
//                   updateSectionData(section.id, { companyContacts: newContacts });
//                 }}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={contact.email}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.companyContacts];
//                   newContacts[index].email = e.target.value;
//                   updateSectionData(section.id, { companyContacts: newContacts });
//                 }}
//               />
//             </div>
//             <div className="space-y-2 md:col-span-2">
//               <Label>Department</Label>
//               <Input
//                 value={contact.department}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.companyContacts];
//                   newContacts[index].department = e.target.value;
//                   updateSectionData(section.id, { companyContacts: newContacts });
//                 }}
//               />
//             </div>
//           </div>
//         </Card>
//       ))}
//     </div>

//     {/* Client Contacts */}
//     <div className="space-y-4">
//       <h4 className="font-semibold text-lg">Client Contacts</h4>
//       {section.data.clientContacts.map((contact: any, index: number) => (
//         <Card key={index} className="p-4 border-dashed">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Name</Label>
//               <Input
//                 value={contact.name}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.clientContacts];
//                   newContacts[index].name = e.target.value;
//                   updateSectionData(section.id, { clientContacts: newContacts });
//                 }}
//                 placeholder="Client name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Title</Label>
//               <Input
//                 value={contact.title}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.clientContacts];
//                   newContacts[index].title = e.target.value;
//                   updateSectionData(section.id, { clientContacts: newContacts });
//                 }}
//                 placeholder="Client title"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Phone</Label>
//               <Input
//                 value={contact.phone}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.clientContacts];
//                   newContacts[index].phone = e.target.value;
//                   updateSectionData(section.id, { clientContacts: newContacts });
//                 }}
//                 placeholder="Client phone"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={contact.email}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.clientContacts];
//                   newContacts[index].email = e.target.value;
//                   updateSectionData(section.id, { clientContacts: newContacts });
//                 }}
//                 placeholder="Client email"
//               />
//             </div>
//             <div className="space-y-2 md:col-span-2">
//               <Label>Department</Label>
//               <Input
//                 value={contact.department}
//                 onChange={(e) => {
//                   const newContacts = [...section.data.clientContacts];
//                   newContacts[index].department = e.target.value;
//                   updateSectionData(section.id, { clientContacts: newContacts });
//                 }}
//                 placeholder="Client department"
//               />
//             </div>
//           </div>
//         </Card>
//       ))}
//     </div>

//     {/* Signatures */}
//     <div className="space-y-4">
//       <h4 className="font-semibold text-lg">Signatures</h4>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="p-4 border-blue-200">
//           <h5 className="font-medium text-blue-700 mb-4">Client Signature</h5>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Signature</Label>
//               <Input
//                 value={section.data.signatures.clientSignature}
//                 onChange={(e) => updateSectionData(section.id, {
//                   signatures: {
//                     ...section.data.signatures,
//                     clientSignature: e.target.value
//                   }
//                 })}
//                 placeholder="Client signature"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Name</Label>
//               <Input
//                 value={section.data.signatures.clientName}
//                 onChange={(e) => updateSectionData(section.id, {
//                   signatures: {
//                     ...section.data.signatures,
//                     clientName: e.target.value
//                   }
//                 })}
//                 placeholder="Client name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Title</Label>
//               <Input
//                 value={section.data.signatures.clientTitle}
//                 onChange={(e) => updateSectionData(section.id, {
//                   signatures: {
//                     ...section.data.signatures,
//                     clientTitle: e.target.value
//                   }
//                 })}
//                 placeholder="Client title"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Date</Label>
//               <Input
//                 type="date"
//                 value={section.data.signatures.clientDate}
//                 onChange={(e) => updateSectionData(section.id, {
//                   signatures: {
//                     ...section.data.signatures,
//                     clientDate: e.target.value
//                   }
//                 })}
//               />
//             </div>
//           </div>
//         </Card>

//         <Card className="p-4 border-red-200">
//           <h5 className="font-medium text-red-700 mb-4">Company Signature</h5>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Signature</Label>
//               <Input
//                 value={section.data.signatures.companySignature}
//                 onChange={(e) => updateSectionData(section.id, {
//                   signatures: {
//                     ...section.data.signatures,
//                     companySignature: e.target.value
//                   }
//                 })}
//                 placeholder="Company signature"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Name</Label>
//               <Input
//                 value={section.data.signatures.companyName}
                
//                 className="bg-gray-50"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Title</Label>
//               <Input
//                 value={section.data.signatures.companyTitle}
//                 readOnly
//                 className="bg-gray-50"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Date</Label>
//               <Input
//                 type="date"
//                 value={section.data.signatures.companyDate}
//                 readOnly
//                 className="bg-gray-50"
//               />
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>

//     {/* Next Steps with + - functionality */}
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Label className="text-lg font-semibold">Next Steps</Label>
//         <div className="flex gap-2">
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               const newSteps = [...section.data.nextSteps, ''];
//               updateSectionData(section.id, { nextSteps: newSteps });
//             }}
//           >
//             <Plus className="h-4 w-4" />
//           </Button>
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               if (section.data.nextSteps.length > 1) {
//                 const newSteps = section.data.nextSteps.slice(0, -1);
//                 updateSectionData(section.id, { nextSteps: newSteps });
//               }
//             }}
//             disabled={section.data.nextSteps.length <= 1}
//           >
//             <Minus className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
      
//       <div className="space-y-3">
//         {section.data.nextSteps.map((step: string, index: number) => (
//           <div key={index} className="flex items-center gap-3 group">
//             <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex-shrink-0">
//               {index + 1}
//             </div>
//             <Input
//               value={step}
//               onChange={(e) => {
//                 const newSteps = [...section.data.nextSteps];
//                 newSteps[index] = e.target.value;
//                 updateSectionData(section.id, { nextSteps: newSteps });
//               }}
//               placeholder={`Next step ${index + 1}...`}
//               className="flex-1"
//             />
//             {section.data.nextSteps.length > 1 && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => {
//                   const newSteps = section.data.nextSteps.filter((_, i) => i !== index);
//                   updateSectionData(section.id, { nextSteps: newSteps });
//                 }}
//                 className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
//               >
//                 <Trash2 className="h-4 w-4 text-red-500" />
//               </Button>
//             )}
//           </div>
//         ))}
//       </div>
      
//       <p className="text-sm text-gray-500 flex items-center gap-1">
//         <span>• Use the</span> 
//         <Plus className="h-3 w-3" />
//         <span>button to add more steps</span>
//         <span>• Use the</span>
//         <Minus className="h-3 w-3" />
//         <span>button to remove the last step</span>
//         <span>• Hover over any step to delete it individually</span>
//       </p>
//     </div>

//     {/* Additional Notes */}
//     <div className="space-y-2">
//       <Label htmlFor="additionalNotes">Additional Notes</Label>
//       <Textarea
//         id="additionalNotes"
//         value={section.data.additionalNotes}
//         onChange={(e) => updateSectionData(section.id, { additionalNotes: e.target.value })}
//         rows={4}
//         placeholder="Any additional notes or special considerations..."
//       />
//     </div>
//   </div>
// );
  

//   const renderSection = (section: QuotationSection) => {
//     switch (section.type) {
//       case 'cover_page':
//         return renderCoverPage(section);
//       case 'executive_summary':
//         return renderExecutiveSummary(section);
//       case 'company_introduction':
//         return renderCompanyIntroduction(section);
//       case 'problem_statement':
//         return renderProblemStatement(section);
//       case 'solution_details':
//         return renderSolutionDetails(section);
//       case 'product_specifications':
//         return renderProductSpecifications(section);
//       case 'quotation_items':
//         return renderQuotationItems(section);
//       case 'timeline_schedule':
//         return renderTimelineSchedule(section);
//       case 'terms_warranties':
//         return renderTermsWarranties(section);
//       case 'contact_information':
//         return renderContactInformation(section);
//       default:
//         return (
//           <div className="space-y-4">
//             <Label>Section Content</Label>
//             <Textarea
//               value={JSON.stringify(section.data, null, 2)}
//               onChange={(e) => {
//                 try {
//                   const newData = JSON.parse(e.target.value);
//                   updateSectionData(section.id, newData);
//                 } catch (error) {
//                   // Invalid JSON, do nothing
//                 }
//               }}
//               rows={6}
//               className="font-mono text-sm"
//             />
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Create Professional Proposal</h1>
//             <p className="text-red-100 mt-1 text-lg">Build comprehensive proposals with 10 customizable sections</p>
//           </div>
//           <div className="flex gap-3">
//             <Button 
//               variant="outline" 
//               className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//               onClick={() => saveQuotation('draft')}
//               disabled={loading}
//             >
//               <Save className="h-5 w-5 mr-2" />
//               {loading ? 'Saving...' : 'Save Draft'}
//             </Button>
//             <Button 
//               className="bg-white text-red-600 hover:bg-red-50" 
//               onClick={generatePDF}
//               disabled={loading}
//             >
//               <Download className="h-5 w-5 mr-2" />
//               {loading ? 'Generating...' : 'Generate PDF'}
//             </Button>
            
//           </div>
//         </div>
//       </div>

//       {/* Basic Information */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-xl">Basic Information</CardTitle>
//           <CardDescription>Enter quotation details and select customer</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="quotationNumber">Quotation Number</Label>
//                 <Input
//                   id="quotationNumber"
//                   value={quotationData.quotationNumber}
//                   onChange={(e) => setQuotationData(prev => ({ ...prev, quotationNumber: e.target.value }))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="customer">Customer</Label>
//                 <Select
//                   value={quotationData.customerId}
//                   onValueChange={(value) => setQuotationData(prev => ({ ...prev, customerId: value }))}
//                   disabled={customersLoading}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder={customersLoading ? "Loading customers..." : "Select a customer"} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {customers.map((customer) => (
//                       <SelectItem key={customer.id} value={customer.id}>
//                         {customer.companyName} - {customer.primaryContact.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {customersLoading && (
//                   <p className="text-sm text-gray-500 flex items-center">
//                     <Loader2 className="h-3 w-3 animate-spin mr-1" />
//                     Loading customers...
//                   </p>
//                 )}
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="issueDate">Issue Date</Label>
//                 <Input
//                   id="issueDate"
//                   type="date"
//                   value={quotationData.issueDate}
//                   onChange={(e) => setQuotationData(prev => ({ ...prev, issueDate: e.target.value }))}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="validUntil">Valid Until</Label>
//                 <Input
//                   id="validUntil"
//                   type="date"
//                   value={quotationData.validUntil}
//                   onChange={(e) => setQuotationData(prev => ({ ...prev, validUntil: e.target.value }))}
//                 />
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Sections List */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle className="text-lg">Proposal Sections</CardTitle>
//             <CardDescription>Reorder and enable/disable proposal sections</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {sections.map((section, index) => (
//               <div
//                 key={section.id}
//                 draggable
//                 onDragStart={(e) => handleDragStart(e, section.id)}
//                 onDragOver={handleDragOver}
//                 onDrop={(e) => handleDrop(e, section.id)}
//                 className={`p-3 rounded-lg border-2 cursor-move transition-all ${
//                   section.enabled
//                     ? 'border-red-200 bg-red-50 hover:border-red-300'
//                     : 'border-gray-200 bg-gray-50 opacity-60'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <GripVertical className="h-4 w-4 text-gray-400" />
//                     <span className={`text-sm font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
//                       {section.order}. {section.title}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => moveSection(index, Math.max(0, index - 1))}
//                       disabled={index === 0}
//                     >
//                       <ArrowUp className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => moveSection(index, Math.min(sections.length - 1, index + 1))}
//                       disabled={index === sections.length - 1}
//                     >
//                       <ArrowDown className="h-4 w-4" />
//                     </Button>
//                     <Checkbox
//                       checked={section.enabled}
//                       onCheckedChange={() => toggleSection(section.id)}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Section Content */}
//         <div className="lg:col-span-3 space-y-6">
//           {sections.filter(section => section.enabled).map((section) => (
//             <Card key={section.id}>
//               <CardHeader>
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Eye className="h-5 w-5 text-green-600" />
//                     <div>
//                       <CardTitle className="text-xl">{section.title}</CardTitle>
//                       <CardDescription>
//                         Section {section.order} • Enabled for PDF
//                       </CardDescription>
//                     </div>
//                   </div>
//                   <Badge variant="default">
//                     PDF
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 {renderSection(section)}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




// new code

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import jsPDF from 'jspdf';

// Firebase imports
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';

// Icons imports
import {
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  Save,
  Download,
  Building2,
  FileText,
  Package,
  DollarSign,
  FileCheck,
  Handshake,
  Eye,
  EyeOff,
  GripVertical,
  Image as ImageIcon,
  Trash2,
  Send,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Firebase Hooks
const useCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try the optimized query first
        const q = query(
          collection(db, 'customers'),
          where('isActive', '==', true),
          orderBy('companyName')
        );

        const unsubscribe = onSnapshot(q, 
          (querySnapshot) => {
            const customersData: any[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              customersData.push({
                id: doc.id,
                companyName: data.companyName || '',
                primaryContact: {
                  name: data.primaryContact?.name || '',
                  email: data.primaryContact?.email || '',
                  phone: data.primaryContact?.phone || '',
                  designation: data.primaryContact?.designation || ''
                },
                city: data.city || '',
                country: data.country || '',
                customerType: data.customerType || '',
                industry: data.industry || '',
                isActive: data.isActive || false
              });
            });
            setCustomers(customersData);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching customers:', error);
            
            // If index error, fallback to simpler query
            if (error.code === 'failed-precondition') {
              console.warn('Index not ready, using fallback query');
              fetchCustomersFallback();
            } else {
              setError(error.message);
              setLoading(false);
            }
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error in customers hook:', error);
        setError('Failed to load customers');
        setLoading(false);
      }
    };

    // Fallback function without ordering
    const fetchCustomersFallback = () => {
      const simpleQuery = query(
        collection(db, 'customers'),
        where('isActive', '==', true)
      );

      const unsubscribe = onSnapshot(simpleQuery, 
        (querySnapshot) => {
          const customersData: any[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            customersData.push({
              id: doc.id,
              companyName: data.companyName || '',
              primaryContact: {
                name: data.primaryContact?.name || '',
                email: data.primaryContact?.email || '',
                phone: data.primaryContact?.phone || '',
                designation: data.primaryContact?.designation || ''
              },
              city: data.city || '',
              country: data.country || '',
              customerType: data.customerType || '',
              industry: data.industry || '',
              isActive: data.isActive || false
            });
          });
          
          // Sort manually on client side
          customersData.sort((a, b) => a.companyName.localeCompare(b.companyName));
          setCustomers(customersData);
          setLoading(false);
        },
        (fallbackError) => {
          console.error('Error in fallback query:', fallbackError);
          setError(fallbackError.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    };

    fetchCustomers();
  }, []);

  return { customers, loading, error };
};

const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      orderBy('name')
    );

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const productsData: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          productsData.push({
            id: doc.id,
            name: data.name || '',
            sellingPrice: data.sellingPrice || 0,
            description: data.description || '',
            currentStock: data.currentStock || 0,
            sku: data.sku || '',
            category: data.category || '',
            status: data.status || ''
          });
        });
        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { products, loading, error };
};

// Company settings
const companySettings = {
  logoUrl: 'https://via.placeholder.com/150x50?text=Company+Logo',
  companyName: 'SBR Technologies',
  address: {
    street: 'Business Bay',
    city: 'Dubai',
    state: 'Dubai',
    zipCode: '12345',
    country: 'UAE'
  },
  contact: {
    phone: '+971 4 123 4567',
    email: 'info@sbrtech.com',
    website: 'www.sbrtech.com'
  }
};

// Currency hook
const useCurrency = () => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return { formatAmount };
};

interface QuotationSection {
  id: string;
  type: 'cover_page' | 'executive_summary' | 'company_introduction' | 'problem_statement' | 'solution_details' | 'product_specifications' | 'quotation_items' | 'timeline_schedule' | 'terms_warranties' | 'contact_information';
  title: string;
  enabled: boolean;
  order: number;
  data: any;
}

interface ProductDetail {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  description: string;
  images: string[];
}

interface QuotationItem {
  id: string;
  itemId: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  tax: number;
  taxType: 'percentage' | 'fixed';
  serviceCharges: number;
  amount: number;
}

// Firebase mein quotation save karna
const saveQuotationToFirebase = async (quotationData: any): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'quotations'), quotationData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving quotation to Firebase:', error);
    throw error;
  }
};

export default function NewQuotationPage() {
  const { formatAmount } = useCurrency();
  const router = useRouter();
  
  // Use real Firebase data
  const { customers, loading: customersLoading, error: customersError } = useCustomers();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  
  // Main quotation state
  const [quotationData, setQuotationData] = useState({
    quotationNumber: `QT-${Date.now()}`,
    customerId: '',
    status: 'draft' as 'draft' | 'sent' | 'approved' | 'rejected',
    issueDate: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    terms: ''
  });

  const [sections, setSections] = useState<QuotationSection[]>(() => {
    // base/default sections
    const baseSections: QuotationSection[] = [
      {
        id: 'cover_page',
        type: 'cover_page',
        title: 'Cover Page & Letter',
        enabled: true,
        order: 1,
        data: {
          companyLogo: companySettings.logoUrl,
          companyName: companySettings.companyName,
          companyAddress: `${companySettings.address.street}, ${companySettings.address.city}, ${companySettings.address.state} ${companySettings.address.zipCode}, ${companySettings.address.country}`,
          companyPhone: companySettings.contact.phone,
          companyEmail: companySettings.contact.email,
          companyWebsite: companySettings.contact.website,
          date: new Date().toISOString().split('T')[0],
          recipientName: '',
          recipientCompany: '',
          recipientAddress: '',
          recipientPhone: '',
          recipientEmail: '',
          subject: 'Quotation for Electronic & Hardware Products',
          salutation: 'Dear [Recipient Name],',
          letterContent: `We are pleased to submit this comprehensive proposal for your consideration. Our team has carefully analyzed your requirements and developed a tailored solution that meets your specific needs.

This proposal outlines our understanding of your project requirements, our proposed solution, detailed specifications, pricing structure, and implementation timeline.

We look forward to the opportunity to work with you and deliver exceptional results.`,
          senderName: 'John Smith',
          senderTitle: 'Business Development Manager',
          senderPhone: '+971 50 123 4567',
          senderEmail: 'john.smith@sbrtech.com'
        }
      },
    {
      id: 'executive_summary',
      type: 'executive_summary',
      title: 'Executive Summary',
      enabled: true,
      order: 2,
      data: {
        summary: `This proposal presents a comprehensive solution tailored to meet your specific business requirements. Our experienced team brings deep industry knowledge and proven methodologies to deliver exceptional results.

Key highlights of our proposal include:
• Customized solution addressing your unique challenges
• Competitive pricing with flexible payment terms
• Proven track record of successful project delivery
• Comprehensive support and maintenance services
• Commitment to quality and customer satisfaction

We are confident that our solution will exceed your expectations and deliver significant value to your organization.`,
        keyBenefits: [
          'Cost-effective solution with ROI within 6 months',
          'Streamlined processes reducing operational overhead by 30%',
          'Scalable architecture supporting future growth',
          '24/7 technical support and maintenance',
          'Comprehensive training and knowledge transfer'
        ],
        proposalValue: '',
        estimatedDuration: '3-6 months',
        totalInvestment: ''
      }
    },
    {
      id: 'company_introduction',
      type: 'company_introduction',
      title: 'Company Introduction',
      enabled: true,
      order: 3,
      data: {
        companyLogo: 'https://via.placeholder.com/150x50?text=SBR+Logo',
        description: 'SBR Technologies is a leading provider of enterprise software solutions, specializing in digital transformation, custom software development, and technology consulting services. With over 10 years of experience, we have successfully delivered projects for Fortune 500 companies and startups alike.',
        foundedYear: '2015',
        employeeCount: '50+',
        officeLocations: ['Dubai, UAE', 'Abu Dhabi, UAE', 'Sharjah, UAE'],
        certifications: ['ISO 9001:2015', 'ISO 27001', 'CMMI Level 3'],
        achievements: [
          '500+ Successful Projects Completed',
          '50+ Enterprise Clients Served',
          '98% Client Satisfaction Rate',
          '10+ Years Industry Experience',
          'Award-winning Development Team'
        ],
        coreValues: [
          'Innovation & Excellence',
          'Customer-Centric Approach',
          'Quality & Reliability',
          'Ethical Business Practices',
          'Continuous Learning'
        ],
        companyImages: [
          'https://via.placeholder.com/400x300?text=Office+Building',
          'https://via.placeholder.com/400x300?text=Team+Photo',
          'https://via.placeholder.com/400x300?text=Work+Environment'
        ]
      }
    },
    {
      id: 'problem_statement',
      type: 'problem_statement',
      title: 'Problem Statement',
      enabled: true,
      order: 4,
      data: {
        clientChallenges: [
          'Inefficient manual processes causing delays and errors',
          'Lack of real-time visibility into business operations',
          'Difficulty scaling operations with business growth',
          'Data silos preventing comprehensive insights',
          'Compliance and regulatory reporting challenges'
        ],
        currentSituation: `Your organization is currently facing several operational challenges that are impacting efficiency, scalability, and competitiveness. Manual processes, disparate systems, and lack of integration are creating bottlenecks that hinder productivity and decision-making capabilities.

The current technology infrastructure is not equipped to handle growing business demands, leading to increased operational costs, reduced customer satisfaction, and missed opportunities for optimization.`,
        impactAssessment: `These challenges are resulting in:
• Increased operational costs (estimated 25-30% higher than optimized operations)
• Reduced productivity and efficiency
• Higher error rates and rework requirements
• Delayed decision-making processes
• Limited scalability for business growth
• Reduced customer satisfaction scores`,
        objectives: [
          'Streamline and automate manual processes',
          'Implement integrated systems for real-time visibility',
          'Create scalable architecture for future growth',
          'Establish comprehensive reporting and analytics',
          'Ensure compliance with industry standards'
        ],
        successCriteria: [
          '30% reduction in operational costs',
          '50% improvement in process efficiency',
          'Real-time visibility into all business operations',
          'Scalable system supporting 200% growth capacity',
          '100% compliance with regulatory requirements'
        ]
      }
    },
    {
      id: 'solution_details',
      type: 'solution_details',
      title: 'Solution Details',
      enabled: true,
      order: 5,
      data: {
        approach: `Our solution approach is based on industry best practices and proven methodologies. We follow a structured implementation process that ensures quality, minimizes risks, and maximizes value delivery.

Our methodology includes:
• Comprehensive requirements analysis and planning
• Agile development with iterative delivery
• Quality assurance and testing at every stage
• User training and change management
• Post-implementation support and optimization`,
        solutionOverview: `We propose a comprehensive solution that addresses all identified challenges through:

1. **Integrated Platform**: Unified system replacing disparate tools and processes
2. **Automation Engine**: Intelligent automation of repetitive tasks and workflows
3. **Analytics Dashboard**: Real-time insights and reporting capabilities
4. **Scalable Architecture**: Cloud-native design supporting future growth
5. **Security Framework**: Enterprise-grade security and compliance features

This solution will transform your operations, improve efficiency, and position your organization for sustained growth.`,
        keyFeatures: [
          'Unified dashboard for all business operations',
          'Automated workflow processing and approvals',
          'Real-time analytics and reporting',
          'Mobile-responsive design for remote access',
          'Integration capabilities with existing systems',
          'Advanced security and data protection',
          'Scalable cloud infrastructure',
          '24/7 system availability and monitoring'
        ],
        technicalApproach: `Our technical implementation follows industry standards and best practices:

• **Frontend**: Modern React-based user interface with responsive design
• **Backend**: Microservices architecture with RESTful APIs
• **Database**: High-performance relational database with data warehousing capabilities
• **Infrastructure**: Cloud-native deployment with auto-scaling and high availability
• **Security**: Multi-layered security with encryption, access controls, and compliance features
• **Integration**: API-first design enabling seamless integration with existing systems`,
        benefits: [
          'Improved operational efficiency and productivity',
          'Reduced costs through automation and optimization',
          'Enhanced decision-making with real-time insights',
          'Increased scalability and flexibility',
          'Better compliance and risk management',
          'Improved customer experience and satisfaction'
        ],
        solutionImages: [
          'https://via.placeholder.com/500x300?text=Solution+Architecture',
          'https://via.placeholder.com/500x300?text=User+Interface+Mockup',
          'https://via.placeholder.com/500x300?text=Workflow+Diagram'
        ]
      }
    },
    {
  id: 'product_specifications',
  type: 'product_specifications',
  title: 'Hardware & Electronics Specifications',
      enabled: true,
      order: 6,
      data: {
        products: [] as ProductDetail[],
        technicalSpecifications: {
          platform: 'Embedded Hardware (MCU-based)',
          processor: 'ARM Cortex-M4 (or equivalent)',
          firmware: 'RTOS-based firmware (C/C++)',
          connectivity: 'Wi-Fi 802.11ac / BLE 5.0 / Ethernet (optional)',
          powerRequirements: '12V DC / 5W typical (specify per model)',
          operatingTemperature: '-20°C to 60°C',
          storageTemperature: '-40°C to 85°C',
          humidity: '0% - 95% non-condensing',
          ingressProtection: 'IP20 (indoor) or IP54/IP65 options available',
          certifications: ['CE', 'FCC', 'RoHS'],
          compliance: 'EMC and safety standards as applicable',
          mobileAppSupport: 'iOS and Android companion app available',
          webPortal: 'Management portal (Chrome, Firefox, Edge, Safari latest)',
          apiIntegration: 'RESTful API with token-based auth (OAuth2 optional)',
          warranty: '12 months standard manufacturer warranty',
          notes: 'Lead times depend on component availability; custom configurations available on request.'
        },
        serviceSpecifications: [
          {
            service: 'Implementation & Deployment',
            description: 'Complete system setup, configuration, and deployment',
            deliverables: ['System installation', 'Data migration', 'User training', 'Go-live support'],
            timeline: '4-6 weeks'
          },
          {
            service: 'Customization & Integration',
            description: 'Tailored modifications and third-party system integration',
            deliverables: ['Custom development', 'API integration', 'Testing', 'Documentation'],
            timeline: '2-4 weeks'
          },
          {
            service: 'Training & Support',
            description: 'Comprehensive training and ongoing technical support',
            deliverables: ['User training sessions', 'Admin training', '24/7 support', 'Knowledge base'],
            timeline: 'Ongoing'
          }
        ],
        complianceStandards: [
          'ISO 27001 Information Security Management',
          'GDPR Data Protection Compliance',
          'SOC 2 Type II Security Controls',
          'PCI DSS Payment Card Industry Standards',
          'HIPAA Health Insurance Portability (if applicable)'
        ]
      }
    },
    {
      id: 'quotation_items',
      type: 'quotation_items',
      title: 'Quotation Items',
      enabled: true,
      order: 7,
      data: {
        items: [] as QuotationItem[],
        subtotal: 0,
        totalDiscount: 0,
        totalTax: 0,
        serviceCharges: 0,
        grandTotal: 0,
        currency: 'AED',
        notes: ''
      }
    },
    {
      id: 'timeline_schedule',
      type: 'timeline_schedule',
      title: 'Timeline & Delivery Schedule',
      enabled: true,
      order: 8,
      data: {
        totalDuration: '16 weeks',
        startDate: '',
        endDate: '',
        phases: [
          {
            name: 'Planning & Analysis',
            duration: '2 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'Requirements gathering',
              'System analysis',
              'Project plan development',
              'Resource allocation'
            ],
            milestones: ['Kickoff meeting', 'Requirements signoff']
          },
          {
            name: 'Design & Development',
            duration: '8 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'System design documents',
              'UI/UX mockups',
              'Database design',
              'Core functionality development',
              'Integration development'
            ],
            milestones: ['Design approval', 'Development completion', 'Testing phase start']
          },
          {
            name: 'Testing & Quality Assurance',
            duration: '3 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'Unit testing',
              'Integration testing',
              'User acceptance testing',
              'Performance testing',
              'Security testing'
            ],
            milestones: ['QA completion', 'UAT signoff']
          },
          {
            name: 'Deployment & Training',
            duration: '3 weeks',
            startDate: '',
            endDate: '',
            deliverables: [
              'Production deployment',
              'Data migration',
              'User training sessions',
              'Documentation delivery',
              'Go-live support'
            ],
            milestones: ['Go-live', 'Training completion', 'Project closure']
          }
        ],
        criticalPath: [
          'Requirements analysis completion',
          'Design approval',
          'Development milestone reviews',
          'Testing completion',
          'User acceptance signoff'
        ],
        dependencies: [
          'Phase 2 cannot start until Phase 1 requirements are approved',
          'Phase 3 testing requires Phase 2 development completion',
          'Phase 4 deployment requires Phase 3 testing signoff'
        ],
        risks: [
          {
            risk: 'Resource availability',
            impact: 'Medium',
            mitigation: 'Backup resource planning and cross-training'
          },
          {
            risk: 'Third-party integration delays',
            impact: 'High',
            mitigation: 'Early vendor engagement and contingency planning'
          },
          {
            risk: 'Scope changes',
            impact: 'Medium',
            mitigation: 'Change control process and regular scope reviews'
          }
        ]
      }
    },
    {
      id: 'terms_warranties',
      type: 'terms_warranties',
      title: 'Terms & Warranties',
      enabled: true,
      order: 9,
      data: {
  generalTerms: `1. Acceptance: This quotation outlines the supply of electronic and hardware products as specified. Acceptance requires written confirmation and an authorised purchase order.

2. Validity: This quotation is valid for 30 days from the date issued unless otherwise stated.

3. Pricing & Taxes: Prices quoted are exclusive of applicable taxes, customs duties, and import fees unless specified. Any changes in tax or duty after quotation issue may be passed on to the customer.

4. Payment Terms: Unless otherwise agreed in writing, payment terms are Net 30 days from invoice date. Late payments beyond the agreed terms may incur a finance charge of 1.5% per month on the outstanding balance.

5. Delivery & Lead Times: Lead times are estimates and subject to supplier and component availability. Expedited delivery requests may attract additional charges and are subject to feasibility.

6. Warranty & Returns: Standard manufacturer warranty applies to hardware items (typically 12 months from delivery) unless a different warranty term is specified per product. Returns for defective goods are subject to inspection and an RMA (Return Merchandise Authorization). Non-defective returns are accepted within 14 days of delivery and may be subject to restocking fees.

7. Shipping & Risk: Title and risk transfer to the buyer upon delivery at the agreed delivery point unless otherwise specified (Incoterms apply when stated).

8. Exclusions & Liability: SBR's liability for direct damages is limited to the value of the supplied goods; indirect or consequential losses are excluded to the fullest extent permitted by law.
`,
        warranties: [
          {
            item: 'Software Functionality',
            warranty: '12 months from go-live date',
            coverage: 'Bugs and defects in core functionality',
            exclusions: 'Custom modifications, third-party integrations'
          },
          {
            item: 'System Performance',
            warranty: '99.5% uptime SLA',
            coverage: 'System availability and performance',
            exclusions: 'Scheduled maintenance, force majeure events'
          },
          {
            item: 'Data Security',
            warranty: 'Industry-standard security measures',
            coverage: 'Data protection and privacy compliance',
            exclusions: 'Client data breaches due to misuse'
          }
        ],
        limitations: `• Warranty does not cover damages due to misuse or unauthorized modifications
• Warranty is limited to the original specifications and scope
• Third-party components are covered by their respective vendor warranties
• Warranty claims must be reported within 30 days of discovery`,
        supportServices: {
          included: [
            '24/7 system monitoring',
            'Email support during business hours',
            'Phone support for critical issues',
            'Regular system updates and patches',
            'Knowledge base and documentation access'
          ],
          optional: [
            'Dedicated support engineer',
            'On-site support visits',
            'Extended warranty coverage',
            'Custom training sessions',
            'Emergency response service'
          ]
        },
        terminationClauses: `Either party may terminate this agreement with 30 days written notice. In case of termination:
• Client will pay for all services rendered up to termination date
• All intellectual property rights transfer to client
• Confidential information remains protected
• Outstanding payments become immediately due`,
        governingLaw: 'United Arab Emirates',
        disputeResolution: 'Arbitration in Dubai International Arbitration Centre'
      }
    },
    {
      id: 'contact_information',
      type: 'contact_information',
      title: 'Contact Information & Signatures',
      enabled: true,
      order: 10,
      data: {
        companyContacts: [
          {
            name: 'John Smith',
            title: 'Business Development Manager',
            phone: '+971 50 123 4567',
            email: 'john.smith@sbrtech.com',
            department: 'Sales'
          },
          {
            name: 'Sarah Johnson',
            title: 'Project Manager',
            phone: '+971 50 765 4321',
            email: 'sarah.johnson@sbrtech.com',
            department: 'Delivery'
          },
          {
            name: 'Mike Davis',
            title: 'Technical Lead',
            phone: '+971 50 987 6543',
            email: 'mike.davis@sbrtech.com',
            department: 'Technical'
          }
        ],
        clientContacts: [
          {
            name: '',
            title: '',
            phone: '',
            email: '',
            department: ''
          }
        ],
        signatures: {
          clientSignature: '',
          clientName: '',
          clientTitle: '',
          clientDate: '',
          companySignature: 'John Smith',
          companyName: 'John Smith',
          companyTitle: 'Business Development Manager',
          companyDate: new Date().toISOString().split('T')[0]
        },
        nextSteps: [
          'Review and approval of proposal',
          'Contract signing and legal review',
          'Project kickoff meeting scheduling',
          'Resource allocation and team assignment',
          'Detailed project planning and timeline confirmation'
        ],
        additionalNotes: ''
      }
    }
  ];
  const defaultsKey = 'quotationDefaults';
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(defaultsKey);
        if (raw) {
          const defaults = JSON.parse(raw);
          const merged = baseSections.map((s) => {
            const def = defaults && defaults[s.id];
            if (!def) return s;
            if (s.id === 'quotation_items') {
              // keep items empty by default for new quotations
              return { ...s, data: { ...s.data, ...def, items: s.data.items || [] } };
            }
            return { ...s, data: { ...s.data, ...def } };
          });
          return merged;
        }
      }
    } catch (e) {
      // ignore JSON / storage errors
    }
    return baseSections;
  });

  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const saveCloudTimeout = useRef<any | null>(null);
  const currentUser = useAuthStore((s) => s.user);

  // Auto-fill customer details when customer is selected
  useEffect(() => {
    if (quotationData.customerId) {
      const selectedCustomer = customers.find(c => c.id === quotationData.customerId);
      if (selectedCustomer) {
        // Update cover page with customer details
        const coverSection = sections.find(s => s.type === 'cover_page');
        if (coverSection) {
          updateSectionData('cover_page', {
            recipientName: selectedCustomer.primaryContact.name,
            recipientCompany: selectedCustomer.companyName,
            recipientEmail: selectedCustomer.primaryContact.email,
            recipientPhone: selectedCustomer.primaryContact.phone
          });
        }

        // Update contact information with customer details
        const contactSection = sections.find(s => s.type === 'contact_information');
        if (contactSection) {
          updateSectionData('contact_information', {
            clientContacts: [{
              name: selectedCustomer.primaryContact.name,
              title: selectedCustomer.primaryContact.designation,
              phone: selectedCustomer.primaryContact.phone,
              email: selectedCustomer.primaryContact.email,
              department: ''
            }]
          });
        }
      }
    }
  }, [quotationData.customerId, customers, currentUser]);

  // Calculate totals function with useCallback to prevent infinite re-renders
  const calculateTotals = useCallback(() => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (!quotationSection) return;

    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    quotationSection.data.items.forEach((item: QuotationItem) => {
      const itemSubtotal = item.quantity * item.rate;
      const itemDiscount = item.discountType === 'percentage'
        ? itemSubtotal * (item.discount / 100)
        : item.discount;
      const itemTax = item.taxType === 'percentage'
        ? (itemSubtotal - itemDiscount) * (item.tax / 100)
        : item.tax;

      subtotal += itemSubtotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    const grandTotal = subtotal - totalDiscount + totalTax + quotationSection.data.serviceCharges;

    // Only update if values actually changed
    if (quotationSection.data.subtotal !== subtotal || 
        quotationSection.data.totalDiscount !== totalDiscount || 
        quotationSection.data.totalTax !== totalTax || 
        quotationSection.data.grandTotal !== grandTotal) {
      
      const updatedSections = sections.map(section =>
        section.id === 'quotation_items'
          ? { ...section, data: { ...section.data, subtotal, totalDiscount, totalTax, grandTotal } }
          : section
      );
      setSections(updatedSections);
    }
  }, [sections]);

  // Use effect with proper dependencies
  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  // Load cloud-saved quotation defaults (if available) when user loads page
  useEffect(() => {
    (async () => {
      if (!currentUser || !currentUser.id) return;
      try {
        const cloud = await loadQuotationDefaultsFromCloud(currentUser.id);
        if (cloud) {
          const merged = sections.map((s) => {
            const def = cloud && cloud[s.id];
            if (!def) return s;
            if (s.id === 'quotation_items') return { ...s, data: { ...s.data, ...def, items: s.data.items || [] } };
            return { ...s, data: { ...s.data, ...def } };
          });
          setSections(merged);
        }
      } catch (e) {
        console.warn('Unable to load cloud defaults', e);
      }
    })();
  }, [currentUser]);

  const moveSection = (fromIndex: number, toIndex: number) => {
    const newSections = [...sections];
    const [moved] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, moved);

    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    setSections(newSections);
  };

  const toggleSection = (sectionId: string) => {
    const updated = sections.map(section =>
      section.id === sectionId
        ? { ...section, enabled: !section.enabled }
        : section
    );
    setSections(updated);
    // Persist the section's enabled state via updateSectionData (will trigger cloud save as well)
    const sec = updated.find(s => s.id === sectionId);
    if (sec) updateSectionData(sectionId, { enabled: sec.enabled });
  };

  const updateSectionData = (sectionId: string, data: any) => {
    const updated = sections.map(section =>
      section.id === sectionId
        ? { ...section, data: { ...section.data, ...data } }
        : section
    );
    setSections(updated);

    // Persist defaults for all sections except the live quotation items
    try {
      if (typeof window !== 'undefined') {
        const key = 'quotationDefaults';
        const raw = localStorage.getItem(key);
        const defaults = raw ? JSON.parse(raw) : {};
        if (sectionId !== 'quotation_items') {
          const sec = updated.find(s => s.id === sectionId);
          if (sec) {
            defaults[sectionId] = sec.data;
            localStorage.setItem(key, JSON.stringify(defaults));
          }
        }
      }
    } catch (e) {
      // ignore storage errors
    }
    // Persist defaults to cloud (debounced) for non-items sections
    try {
      if (typeof window !== 'undefined' && currentUser && currentUser.id && sectionId !== 'quotation_items') {
        const payload = updated.reduce((acc: any, s) => {
          if (s.id === 'quotation_items') return acc;
          acc[s.id] = s.data;
          return acc;
        }, {});
        if (saveCloudTimeout.current) clearTimeout(saveCloudTimeout.current);
        saveCloudTimeout.current = setTimeout(() => {
          saveQuotationDefaultsToCloud(currentUser.id, payload).catch(err => console.warn('Failed to save quotation defaults to cloud', err));
        }, 900);
      }
    } catch (err) {
      // ignore cloud errors silently
    }
  };

  const addProductDetail = () => {
    const productSection = sections.find(s => s.type === 'product_specifications');
    if (productSection) {
      const newProduct: ProductDetail = {
        id: `product_${Date.now()}`,
        productId: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        description: '',
        images: []
      };

      updateSectionData('product_specifications', {
        products: [...productSection.data.products, newProduct]
      });
    }
  };

  const removeProductDetail = (productId: string) => {
    const productSection = sections.find(s => s.type === 'product_specifications');
    if (productSection) {
      updateSectionData('product_specifications', {
        products: productSection.data.products.filter((p: ProductDetail) => p.id !== productId)
      });
    }
  };

  const updateProductDetail = (productId: string, data: Partial<ProductDetail>) => {
    const productSection = sections.find(s => s.type === 'product_specifications');
    if (productSection) {
      updateSectionData('product_specifications', {
        products: productSection.data.products.map((p: ProductDetail) =>
          p.id === productId ? { ...p, ...data } : p
        )
      });
    }
  };

  const addQuotationItem = () => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (quotationSection) {
      const newItem: QuotationItem = {
        id: `item_${Date.now()}`,
        itemId: `Q${(quotationSection.data.items.length + 1).toString().padStart(3, '0')}`,
        productId: '',
        productName: '',
        description: '',
        quantity: 1,
        rate: 0,
        discount: 0,
        discountType: 'percentage',
        tax: 0,
        taxType: 'percentage',
        serviceCharges: 0,
        amount: 0
      };

      updateSectionData('quotation_items', {
        items: [...quotationSection.data.items, newItem]
      });
    }
  };

  const removeQuotationItem = (itemId: string) => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (quotationSection) {
      updateSectionData('quotation_items', {
        items: quotationSection.data.items.filter((item: QuotationItem) => item.id !== itemId)
      });
    }
  };

  const updateQuotationItem = (itemId: string, data: Partial<QuotationItem>) => {
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (quotationSection) {
      const updatedItems = quotationSection.data.items.map((item: QuotationItem) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, ...data };
          
          // Calculate amount for this item only
          const subtotal = updatedItem.quantity * updatedItem.rate;
          const discountAmount = updatedItem.discountType === 'percentage'
            ? subtotal * (updatedItem.discount / 100)
            : updatedItem.discount;
          const taxableAmount = subtotal - discountAmount;
          const taxAmount = updatedItem.taxType === 'percentage'
            ? taxableAmount * (updatedItem.tax / 100)
            : updatedItem.tax;
          updatedItem.amount = taxableAmount + taxAmount + updatedItem.serviceCharges;
          
          return updatedItem;
        }
        return item;
      });

      updateSectionData('quotation_items', { items: updatedItems });
    }
  };

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetSectionId) return;

    const fromIndex = sections.findIndex(s => s.id === draggedSection);
    const toIndex = sections.findIndex(s => s.id === targetSectionId);

    moveSection(fromIndex, toIndex);
    setDraggedSection(null);
  };

  // Validation function
  const validateQuotation = () => {
    if (!quotationData.customerId) {
      return 'Please select a customer';
    }
    
    const quotationSection = sections.find(s => s.type === 'quotation_items');
    if (quotationSection?.data.items.length === 0) {
      return 'Please add at least one quotation item';
    }
    
    if (!quotationData.quotationNumber) {
      return 'Quotation number is required';
    }
    
    return null;
  };

  // Save quotation function - Firebase compatible
  const saveQuotation = async (status: 'draft' | 'sent' = 'draft') => {
    setLoading(true);
    try {
      // Validate before saving
      const validationError = validateQuotation();
      if (validationError) {
        alert(validationError);
        setLoading(false);
        return;
      }

      const quotationSection = sections.find(s => s.type === 'quotation_items');
      const customer = customers.find(c => c.id === quotationData.customerId);

      if (!customer) {
        alert('Please select a customer');
        setLoading(false);
        return;
      }

      const finalQuotationData = {
        ...quotationData,
        status,
        customerName: customer.primaryContact.name,
        customerCompany: customer.companyName,
        customerEmail: customer.primaryContact.email,
        customerPhone: customer.primaryContact.phone,
        sections: sections.filter(s => s.enabled),
        items: quotationSection?.data.items || [],
        subtotal: quotationSection?.data.subtotal || 0,
        totalDiscount: quotationSection?.data.totalDiscount || 0,
        totalTax: quotationSection?.data.totalTax || 0,
        serviceCharges: quotationSection?.data.serviceCharges || 0,
        totalAmount: quotationSection?.data.grandTotal || 0,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Validate Firebase data
      const firebaseData = JSON.parse(JSON.stringify(finalQuotationData));
      
      const quotationId = await saveQuotationToFirebase(firebaseData);
      
      alert(`Quotation ${status === 'draft' ? 'saved as draft' : 'sent'} successfully!`);
      
      if (status === 'sent') {
        router.push('/admin/sales/quotations');
      }
    } catch (error: any) {
      console.error('Error saving quotation:', error);
      
      let errorMessage = 'Error saving quotation';
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please check your Firebase rules.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // PDF Generation Function
  const generatePDF = async () => {
    setLoading(true);
    try {
      const enabledSections = sections.filter((s: any) => s.enabled);
      const customer = customers.find((c: any) => c.id === quotationData.customerId);

      // Use centralized professional PDF generator
      const coverSection = sections.find((s: any) => s.type === 'cover_page');
      const accentColor = coverSection?.data?.accentColor || coverSection?.data?.primaryColor || '#0f60d9';
      const headerColor = coverSection?.data?.headerColor || coverSection?.data?.primaryColor || '#0b4bd8';

      const blob = await generateQuotationPDF(
        quotationData,
        enabledSections,
        customer,
        { accentColor, headerColor, formatAmount }
      );

      downloadPDF(blob, `quotation-${quotationData.quotationNumber || Date.now()}.pdf`);
      alert('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render functions for all sections
  const renderCoverPage = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Company Information</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="companyLogo">Company Logo URL</Label>
              <Input
                id="companyLogo"
                value={section.data.companyLogo}
                onChange={(e) => updateSectionData(section.id, { companyLogo: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={section.data.companyName}
                onChange={(e) => updateSectionData(section.id, { companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                value={section.data.companyAddress}
                onChange={(e) => updateSectionData(section.id, { companyAddress: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Recipient Information</h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={section.data.recipientName}
                onChange={(e) => updateSectionData(section.id, { recipientName: e.target.value })}
                placeholder="Enter recipient name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientCompany">Company</Label>
              <Input
                id="recipientCompany"
                value={section.data.recipientCompany}
                onChange={(e) => updateSectionData(section.id, { recipientCompany: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Email</Label>
              <Input
                id="recipientEmail"
                type="email"
                value={section.data.recipientEmail}
                onChange={(e) => updateSectionData(section.id, { recipientEmail: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Cover Letter</h4>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={section.data.subject}
              onChange={(e) => updateSectionData(section.id, { subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salutation">Salutation</Label>
            <Input
              id="salutation"
              value={section.data.salutation}
              onChange={(e) => updateSectionData(section.id, { salutation: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="letterContent">Letter Content</Label>
            <Textarea
              id="letterContent"
              value={section.data.letterContent}
              onChange={(e) => updateSectionData(section.id, { letterContent: e.target.value })}
              rows={8}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutiveSummary = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="summary">Executive Summary</Label>
        <Textarea
          id="summary"
          value={section.data.summary}
          onChange={(e) => updateSectionData(section.id, { summary: e.target.value })}
          rows={8}
          className="text-lg leading-relaxed"
        />
      </div>

      <div className="space-y-4">
        <Label>Key Benefits</Label>
        <div className="space-y-2">
          {section.data.keyBenefits.map((benefit: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-green-600 font-bold">•</span>
              <Input
                value={benefit}
                onChange={(e) => {
                  const newBenefits = [...section.data.keyBenefits];
                  newBenefits[index] = e.target.value;
                  updateSectionData(section.id, { keyBenefits: newBenefits });
                }}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="proposalValue">Proposal Value</Label>
          <Input
            id="proposalValue"
            value={section.data.proposalValue}
            onChange={(e) => updateSectionData(section.id, { proposalValue: e.target.value })}
            placeholder="e.g., $500,000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedDuration">Estimated Duration</Label>
          <Input
            id="estimatedDuration"
            value={section.data.estimatedDuration}
            onChange={(e) => updateSectionData(section.id, { estimatedDuration: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalInvestment">Total Investment</Label>
          <Input
            id="totalInvestment"
            value={section.data.totalInvestment}
            onChange={(e) => updateSectionData(section.id, { totalInvestment: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderCompanyIntroduction = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <img
          src={section.data.companyLogo}
          alt="Company Logo"
          className="h-20 w-20 object-contain rounded-lg border"
        />
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year</Label>
              <Input
                id="foundedYear"
                value={section.data.foundedYear}
                onChange={(e) => updateSectionData(section.id, { foundedYear: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeCount">Employee Count</Label>
              <Input
                id="employeeCount"
                value={section.data.employeeCount}
                onChange={(e) => updateSectionData(section.id, { employeeCount: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          value={section.data.description}
          onChange={(e) => updateSectionData(section.id, { description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Office Locations</Label>
        <div className="flex flex-wrap gap-2">
          {section.data.officeLocations.map((location: string, index: number) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {location}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Certifications</Label>
        <div className="flex flex-wrap gap-2">
          {section.data.certifications.map((cert: string, index: number) => (
            <Badge key={index} variant="outline" className="px-3 py-1 border-blue-200 text-blue-700">
              {cert}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Achievements</Label>
        <div className="grid grid-cols-2 gap-2">
          {section.data.achievements.map((achievement: string, index: number) => (
            <Input
              key={index}
              value={achievement}
              onChange={(e) => {
                const newAchievements = [...section.data.achievements];
                newAchievements[index] = e.target.value;
                updateSectionData(section.id, { achievements: newAchievements });
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Core Values</Label>
        <div className="grid grid-cols-2 gap-2">
          {section.data.coreValues.map((value: string, index: number) => (
            <Input
              key={index}
              value={value}
              onChange={(e) => {
                const newValues = [...section.data.coreValues];
                newValues[index] = e.target.value;
                updateSectionData(section.id, { coreValues: newValues });
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Company Images</Label>
        <div className="grid grid-cols-3 gap-4">
          {section.data.companyImages.map((image: string, index: number) => (
            <div key={index} className="space-y-2">
              <img
                src={image}
                alt={`Company ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Input
                value={image}
                onChange={(e) => {
                  const newImages = [...section.data.companyImages];
                  newImages[index] = e.target.value;
                  updateSectionData(section.id, { companyImages: newImages });
                }}
                placeholder="Image URL"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProblemStatement = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Client Challenges</Label>
        <div className="space-y-2">
          {section.data.clientChallenges.map((challenge: string, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-red-600 font-bold mt-1">•</span>
              <Textarea
                value={challenge}
                onChange={(e) => {
                  const newChallenges = [...section.data.clientChallenges];
                  newChallenges[index] = e.target.value;
                  updateSectionData(section.id, { clientChallenges: newChallenges });
                }}
                rows={2}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentSituation">Current Situation Analysis</Label>
        <Textarea
          id="currentSituation"
          value={section.data.currentSituation}
          onChange={(e) => updateSectionData(section.id, { currentSituation: e.target.value })}
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="impactAssessment">Impact Assessment</Label>
        <Textarea
          id="impactAssessment"
          value={section.data.impactAssessment}
          onChange={(e) => updateSectionData(section.id, { impactAssessment: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <Label>Project Objectives</Label>
        <div className="space-y-2">
          {section.data.objectives.map((objective: string, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-green-600 font-bold mt-1">✓</span>
              <Textarea
                value={objective}
                onChange={(e) => {
                  const newObjectives = [...section.data.objectives];
                  newObjectives[index] = e.target.value;
                  updateSectionData(section.id, { objectives: newObjectives });
                }}
                rows={2}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Success Criteria</Label>
        <div className="space-y-2">
          {section.data.successCriteria.map((criteria: string, index: number) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold mt-1">🎯</span>
              <Textarea
                value={criteria}
                onChange={(e) => {
                  const newCriteria = [...section.data.successCriteria];
                  newCriteria[index] = e.target.value;
                  updateSectionData(section.id, { successCriteria: newCriteria });
                }}
                rows={2}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSolutionDetails = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="approach">Our Approach</Label>
        <Textarea
          id="approach"
          value={section.data.approach}
          onChange={(e) => updateSectionData(section.id, { approach: e.target.value })}
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="solutionOverview">Solution Overview</Label>
        <Textarea
          id="solutionOverview"
          value={section.data.solutionOverview}
          onChange={(e) => updateSectionData(section.id, { solutionOverview: e.target.value })}
          rows={8}
        />
      </div>

      <div className="space-y-4">
        <Label>Key Features</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.data.keyFeatures.map((feature: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-600 font-bold">✨</span>
              <Input
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...section.data.keyFeatures];
                  newFeatures[index] = e.target.value;
                  updateSectionData(section.id, { keyFeatures: newFeatures });
                }}
                className="flex-1 bg-transparent border-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technicalApproach">Technical Approach</Label>
        <Textarea
          id="technicalApproach"
          value={section.data.technicalApproach}
          onChange={(e) => updateSectionData(section.id, { technicalApproach: e.target.value })}
          rows={6}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-4">
        <Label>Benefits</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.data.benefits.map((benefit: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <span className="text-green-600 font-bold">✓</span>
              <Input
                value={benefit}
                onChange={(e) => {
                  const newBenefits = [...section.data.benefits];
                  newBenefits[index] = e.target.value;
                  updateSectionData(section.id, { benefits: newBenefits });
                }}
                className="flex-1 bg-transparent border-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Solution Images</Label>
        <div className="grid grid-cols-3 gap-4">
          {section.data.solutionImages.map((image: string, index: number) => (
            <div key={index} className="space-y-2">
              <img
                src={image}
                alt={`Solution ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Input
                value={image}
                onChange={(e) => {
                  const newImages = [...section.data.solutionImages];
                  newImages[index] = e.target.value;
                  updateSectionData(section.id, { solutionImages: newImages });
                }}
                placeholder="Image URL"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductSpecifications = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-lg">Product Details</h4>
          <Button onClick={addProductDetail} size="sm" disabled={productsLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {productsLoading ? 'Loading...' : 'Add Product'}
          </Button>
        </div>
        {productsLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading products...</span>
          </div>
        )}

        {section.data.products.map((product: ProductDetail, index: number) => {
          const selectedProduct = products.find(p => p.id === product.productId);
          return (
            <Card key={product.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h5 className="font-medium">Product {index + 1}</h5>
                <Button
                  onClick={() => removeProductDetail(product.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select
                    value={product.productId}
                    onValueChange={(value) => {
                      const selectedProd = products.find(p => p.id === value);
                      updateProductDetail(product.id, { 
                        productId: value,
                        unitPrice: selectedProd?.sellingPrice || 0,
                        description: selectedProd?.description || ''
                      });
                    }}
                    disabled={productsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={productsLoading ? "Loading products..." : "Select product"} />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} - {formatAmount(p.sellingPrice)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => updateProductDetail(product.id, { quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    value={product.unitPrice}
                    onChange={(e) => {
                      updateProductDetail(product.id, { unitPrice: parseFloat(e.target.value) || 0 });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    value={product.discount}
                    onChange={(e) => {
                      updateProductDetail(product.id, { discount: parseFloat(e.target.value) || 0 });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Line Total</Label>
                  <Input
                    value={formatAmount((product.quantity * product.unitPrice) * (1 - product.discount / 100))}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Label>Description</Label>
                <Textarea
                  value={product.description || selectedProduct?.description || ''}
                  onChange={(e) => updateProductDetail(product.id, { description: e.target.value })}
                  rows={2}
                  placeholder={selectedProduct?.description || "Product description"}
                />
              </div>
              <div className="space-y-2">
                <Label>Product Images (URLs)</Label>
                <div className="space-y-2">
                  {product.images.map((image: string, imgIndex: number) => (
                    <div key={imgIndex} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => {
                          const newImages = [...product.images];
                          newImages[imgIndex] = e.target.value;
                          updateProductDetail(product.id, { images: newImages });
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button
                        onClick={() => {
                          const newImages = product.images.filter((_: any, i: number) => i !== imgIndex);
                          updateProductDetail(product.id, { images: newImages });
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      updateProductDetail(product.id, { images: [...product.images, ''] });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Technical Specifications</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={section.data.technicalSpecifications.platform}
              onChange={(e) => updateSectionData(section.id, {
                technicalSpecifications: {
                  ...section.data.technicalSpecifications,
                  platform: e.target.value
                }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technology">Technology Stack</Label>
            <Input
              id="technology"
              value={section.data.technicalSpecifications.technology}
              onChange={(e) => updateSectionData(section.id, {
                technicalSpecifications: {
                  ...section.data.technicalSpecifications,
                  technology: e.target.value
                }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileSupport">Mobile Support</Label>
            <Input
              id="mobileSupport"
              value={section.data.technicalSpecifications.mobileSupport}
              onChange={(e) => updateSectionData(section.id, {
                technicalSpecifications: {
                  ...section.data.technicalSpecifications,
                  mobileSupport: e.target.value
                }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="browserSupport">Browser Support</Label>
            <Input
              id="browserSupport"
              value={section.data.technicalSpecifications.browserSupport}
              onChange={(e) => updateSectionData(section.id, {
                technicalSpecifications: {
                  ...section.data.technicalSpecifications,
                  browserSupport: e.target.value
                }
              })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Service Specifications</h4>
        {section.data.serviceSpecifications.map((service: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service</Label>
                <Input
                  value={service.service}
                  onChange={(e) => {
                    const newServices = [...section.data.serviceSpecifications];
                    newServices[index].service = e.target.value;
                    updateSectionData(section.id, { serviceSpecifications: newServices });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Timeline</Label>
                <Input
                  value={service.timeline}
                  onChange={(e) => {
                    const newServices = [...section.data.serviceSpecifications];
                    newServices[index].timeline = e.target.value;
                    updateSectionData(section.id, { serviceSpecifications: newServices });
                  }}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label>Description</Label>
              <Textarea
                value={service.description}
                onChange={(e) => {
                  const newServices = [...section.data.serviceSpecifications];
                  newServices[index].description = e.target.value;
                  updateSectionData(section.id, { serviceSpecifications: newServices });
                }}
                rows={2}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Label>Compliance Standards</Label>
        <div className="flex flex-wrap gap-2">
          {section.data.complianceStandards.map((standard: string, index: number) => (
            <Badge key={index} variant="outline" className="px-3 py-1 border-green-200 text-green-700">
              {standard}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuotationItems = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-lg">Quotation Items</h4>
          <Button onClick={addQuotationItem} size="sm" disabled={productsLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {productsLoading ? 'Loading Products...' : 'Add Item'}
          </Button>
        </div>

        {productsLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading products...</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg font-medium text-sm">
          <div className="col-span-1">Item ID</div>
          <div className="col-span-2">Product</div>
          <div className="col-span-2">Description</div>
          <div className="col-span-1">Qty</div>
          <div className="col-span-1">Rate</div>
          <div className="col-span-1">Discount</div>
          <div className="col-span-1">Tax</div>
          <div className="col-span-1">Service</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1">Actions</div>
        </div>

        {section.data.items.map((item: QuotationItem, index: number) => (
          <div key={item.id} className="grid grid-cols-12 gap-2 p-3 border rounded-lg">
            <div className="col-span-1">
              <Input
                value={item.itemId}
                onChange={(e) => updateQuotationItem(item.id, { itemId: e.target.value })}
                placeholder="001"
                className="text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Select
                value={item.productId}
                onValueChange={(value) => {
                  const product = products.find(p => p.id === value);
                  if (product) {
                    updateQuotationItem(item.id, {
                      productId: value,
                      productName: product.name,
                      description: product.description,
                      rate: product.sellingPrice
                    });
                  }
                }}
                disabled={productsLoading}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={productsLoading ? "Loading..." : "Select product"} />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {formatAmount(p.sellingPrice)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={item.productName}
                onChange={(e) => updateQuotationItem(item.id, { productName: e.target.value })}
                placeholder="Product name"
                className="text-xs"
              />
            </div>
            <div className="col-span-2">
              <Textarea
                value={item.description}
                onChange={(e) => updateQuotationItem(item.id, { description: e.target.value })}
                rows={2}
                className="text-sm"
                placeholder="Product description"
              />
            </div>
            <div className="col-span-1">
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  updateQuotationItem(item.id, { quantity: parseFloat(e.target.value) || 0 });
                }}
                className="text-sm"
              />
            </div>
            <div className="col-span-1">
              <Input
                type="number"
                value={item.rate}
                onChange={(e) => {
                  updateQuotationItem(item.id, { rate: parseFloat(e.target.value) || 0 });
                }}
                className="text-sm"
              />
            </div>
            <div className="col-span-1 space-y-1">
              <Input
                type="number"
                value={item.discount}
                onChange={(e) => {
                  updateQuotationItem(item.id, { discount: parseFloat(e.target.value) || 0 });
                }}
                className="text-sm"
              />
              <Select
                value={item.discountType}
                onValueChange={(value: 'percentage' | 'fixed') => {
                  updateQuotationItem(item.id, { discountType: value });
                }}
              >
                <SelectTrigger className="text-xs h-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 space-y-1">
              <Input
                type="number"
                value={item.tax}
                onChange={(e) => {
                  updateQuotationItem(item.id, { tax: parseFloat(e.target.value) || 0 });
                }}
                className="text-sm"
              />
              <Select
                value={item.taxType}
                onValueChange={(value: 'percentage' | 'fixed') => {
                  updateQuotationItem(item.id, { taxType: value });
                }}
              >
                <SelectTrigger className="text-xs h-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">%</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Input
                type="number"
                value={item.serviceCharges}
                onChange={(e) => {
                  updateQuotationItem(item.id, { serviceCharges: parseFloat(e.target.value) || 0 });
                }}
                className="text-sm"
              />
            </div>
            <div className="col-span-1">
              <Input
                value={formatAmount(item.amount)}
                readOnly
                className="bg-gray-50 text-sm font-medium"
              />
            </div>
            <div className="col-span-1">
              <Button
                onClick={() => removeQuotationItem(item.id)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Currency</Label>
            <Select
              value={section.data.currency}
              onValueChange={(value) => updateSectionData(section.id, { currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Service Charges</Label>
            <Input
              type="number"
              value={section.data.serviceCharges}
              onChange={(e) => {
                updateSectionData(section.id, { serviceCharges: parseFloat(e.target.value) || 0 });
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={section.data.notes}
              onChange={(e) => updateSectionData(section.id, { notes: e.target.value })}
              rows={2}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-lg font-bold text-gray-900">
              {formatAmount(section.data.subtotal)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Discount</p>
            <p className="text-lg font-bold text-green-600">
              -{formatAmount(section.data.totalDiscount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Tax</p>
            <p className="text-lg font-bold text-blue-600">
              +{formatAmount(section.data.totalTax)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Grand Total</p>
            <p className="text-2xl font-bold text-red-600">
              {formatAmount(section.data.grandTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimelineSchedule = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalDuration">Total Duration</Label>
          <Input
            id="totalDuration"
            value={section.data.totalDuration}
            onChange={(e) => updateSectionData(section.id, { totalDuration: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={section.data.startDate}
            onChange={(e) => updateSectionData(section.id, { startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={section.data.endDate}
            onChange={(e) => updateSectionData(section.id, { endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Project Phases</h4>
        {section.data.phases.map((phase: any, index: number) => (
          <Card key={index} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Phase Name</Label>
                <Input
                  value={phase.name}
                  onChange={(e) => {
                    const newPhases = [...section.data.phases];
                    newPhases[index].name = e.target.value;
                    updateSectionData(section.id, { phases: newPhases });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  value={phase.duration}
                  onChange={(e) => {
                    const newPhases = [...section.data.phases];
                    newPhases[index].duration = e.target.value;
                    updateSectionData(section.id, { phases: newPhases });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={phase.startDate}
                  onChange={(e) => {
                    const newPhases = [...section.data.phases];
                    newPhases[index].startDate = e.target.value;
                    updateSectionData(section.id, { phases: newPhases });
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Deliverables</Label>
                <Textarea
                  value={phase.deliverables.join('\n')}
                  onChange={(e) => {
                    const newPhases = [...section.data.phases];
                    newPhases[index].deliverables = e.target.value.split('\n');
                    updateSectionData(section.id, { phases: newPhases });
                  }}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Milestones</Label>
                <Textarea
                  value={phase.milestones.join('\n')}
                  onChange={(e) => {
                    const newPhases = [...section.data.phases];
                    newPhases[index].milestones = e.target.value.split('\n');
                    updateSectionData(section.id, { phases: newPhases });
                  }}
                  rows={2}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Critical Path</Label>
        <Textarea
          value={section.data.criticalPath.join('\n')}
          onChange={(e) => updateSectionData(section.id, {
            criticalPath: e.target.value.split('\n')
          })}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Dependencies</Label>
        <Textarea
          value={section.data.dependencies.join('\n')}
          onChange={(e) => updateSectionData(section.id, {
            dependencies: e.target.value.split('\n')
          })}
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Risks & Mitigation</Label>
        {section.data.risks.map((risk: any, index: number) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
            <div className="flex-1 space-y-2">
              <Input
                value={risk.risk}
                onChange={(e) => {
                  const newRisks = [...section.data.risks];
                  newRisks[index].risk = e.target.value;
                  updateSectionData(section.id, { risks: newRisks });
                }}
                placeholder="Risk description"
              />
            </div>
            <Select
              value={risk.impact}
              onValueChange={(value) => {
                const newRisks = [...section.data.risks];
                newRisks[index].impact = value;
                updateSectionData(section.id, { risks: newRisks });
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1">
              <Textarea
                value={risk.mitigation}
                onChange={(e) => {
                  const newRisks = [...section.data.risks];
                  newRisks[index].mitigation = e.target.value;
                  updateSectionData(section.id, { risks: newRisks });
                }}
                placeholder="Mitigation strategy"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTermsWarranties = (section: QuotationSection) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="generalTerms">General Terms</Label>
        <Textarea
          id="generalTerms"
          value={section.data.generalTerms}
          onChange={(e) => updateSectionData(section.id, { generalTerms: e.target.value })}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Warranties</h4>
        {section.data.warranties.map((warranty: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Item</Label>
                <Input
                  value={warranty.item}
                  onChange={(e) => {
                    const newWarranties = [...section.data.warranties];
                    newWarranties[index].item = e.target.value;
                    updateSectionData(section.id, { warranties: newWarranties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Warranty</Label>
                <Input
                  value={warranty.warranty}
                  onChange={(e) => {
                    const newWarranties = [...section.data.warranties];
                    newWarranties[index].warranty = e.target.value;
                    updateSectionData(section.id, { warranties: newWarranties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Coverage</Label>
                <Textarea
                  value={warranty.coverage}
                  onChange={(e) => {
                    const newWarranties = [...section.data.warranties];
                    newWarranties[index].coverage = e.target.value;
                    updateSectionData(section.id, { warranties: newWarranties });
                  }}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Exclusions</Label>
                <Textarea
                  value={warranty.exclusions}
                  onChange={(e) => {
                    const newWarranties = [...section.data.warranties];
                    newWarranties[index].exclusions = e.target.value;
                    updateSectionData(section.id, { warranties: newWarranties });
                  }}
                  rows={2}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="limitations">Limitations</Label>
        <Textarea
          id="limitations"
          value={section.data.limitations}
          onChange={(e) => updateSectionData(section.id, { limitations: e.target.value })}
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Support Services</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h5 className="font-medium text-green-700">Included Services</h5>
            <div className="space-y-2">
              {section.data.supportServices.included.map((service: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <Input
                    value={service}
                    onChange={(e) => {
                      const newIncluded = [...section.data.supportServices.included];
                      newIncluded[index] = e.target.value;
                      updateSectionData(section.id, {
                        supportServices: {
                          ...section.data.supportServices,
                          included: newIncluded
                        }
                      });
                    }}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="font-medium text-blue-700">Optional Services</h5>
            <div className="space-y-2">
              {section.data.supportServices.optional.map((service: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-blue-600">+</span>
                  <Input
                    value={service}
                    onChange={(e) => {
                      const newOptional = [...section.data.supportServices.optional];
                      newOptional[index] = e.target.value;
                      updateSectionData(section.id, {
                        supportServices: {
                          ...section.data.supportServices,
                          optional: newOptional
                        }
                      });
                    }}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="terminationClauses">Termination Clauses</Label>
        <Textarea
          id="terminationClauses"
          value={section.data.terminationClauses}
          onChange={(e) => updateSectionData(section.id, { terminationClauses: e.target.value })}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="governingLaw">Governing Law</Label>
          <Input
            id="governingLaw"
            value={section.data.governingLaw}
            onChange={(e) => updateSectionData(section.id, { governingLaw: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="disputeResolution">Dispute Resolution</Label>
          <Input
            id="disputeResolution"
            value={section.data.disputeResolution}
            onChange={(e) => updateSectionData(section.id, { disputeResolution: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderContactInformation = (section: QuotationSection) => (
    <div className="space-y-6">
      {/* Company Contacts */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Company Contacts</h4>
        {section.data.companyContacts.map((contact: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...section.data.companyContacts];
                    newContacts[index].name = e.target.value;
                    updateSectionData(section.id, { companyContacts: newContacts });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={contact.title}
                  onChange={(e) => {
                    const newContacts = [...section.data.companyContacts];
                    newContacts[index].title = e.target.value;
                    updateSectionData(section.id, { companyContacts: newContacts });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...section.data.companyContacts];
                    newContacts[index].phone = e.target.value;
                    updateSectionData(section.id, { companyContacts: newContacts });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...section.data.companyContacts];
                    newContacts[index].email = e.target.value;
                    updateSectionData(section.id, { companyContacts: newContacts });
                  }}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Department</Label>
                <Input
                  value={contact.department}
                  onChange={(e) => {
                    const newContacts = [...section.data.companyContacts];
                    newContacts[index].department = e.target.value;
                    updateSectionData(section.id, { companyContacts: newContacts });
                  }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Client Contacts */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Client Contacts</h4>
        {section.data.clientContacts.map((contact: any, index: number) => (
          <Card key={index} className="p-4 border-dashed">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...section.data.clientContacts];
                    newContacts[index].name = e.target.value;
                    updateSectionData(section.id, { clientContacts: newContacts });
                  }}
                  placeholder="Client name"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={contact.title}
                  onChange={(e) => {
                    const newContacts = [...section.data.clientContacts];
                    newContacts[index].title = e.target.value;
                    updateSectionData(section.id, { clientContacts: newContacts });
                  }}
                  placeholder="Client title"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...section.data.clientContacts];
                    newContacts[index].phone = e.target.value;
                    updateSectionData(section.id, { clientContacts: newContacts });
                  }}
                  placeholder="Client phone"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...section.data.clientContacts];
                    newContacts[index].email = e.target.value;
                    updateSectionData(section.id, { clientContacts: newContacts });
                  }}
                  placeholder="Client email"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Department</Label>
                <Input
                  value={contact.department}
                  onChange={(e) => {
                    const newContacts = [...section.data.clientContacts];
                    newContacts[index].department = e.target.value;
                    updateSectionData(section.id, { clientContacts: newContacts });
                  }}
                  placeholder="Client department"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Signatures */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Signatures</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 border-blue-200">
            <h5 className="font-medium text-blue-700 mb-4">Client Signature</h5>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Signature</Label>
                <Input
                  value={section.data.signatures.clientSignature}
                  onChange={(e) => updateSectionData(section.id, {
                    signatures: {
                      ...section.data.signatures,
                      clientSignature: e.target.value
                    }
                  })}
                  placeholder="Client signature"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={section.data.signatures.clientName}
                  onChange={(e) => updateSectionData(section.id, {
                    signatures: {
                      ...section.data.signatures,
                      clientName: e.target.value
                    }
                  })}
                  placeholder="Client name"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={section.data.signatures.clientTitle}
                  onChange={(e) => updateSectionData(section.id, {
                    signatures: {
                      ...section.data.signatures,
                      clientTitle: e.target.value
                    }
                  })}
                  placeholder="Client title"
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={section.data.signatures.clientDate}
                  onChange={(e) => updateSectionData(section.id, {
                    signatures: {
                      ...section.data.signatures,
                      clientDate: e.target.value
                    }
                  })}
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-red-200">
            <h5 className="font-medium text-red-700 mb-4">Company Signature</h5>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Signature</Label>
                <Input
                  value={section.data.signatures.companySignature}
                  onChange={(e) => updateSectionData(section.id, {
                    signatures: {
                      ...section.data.signatures,
                      companySignature: e.target.value
                    }
                  })}
                  placeholder="Company signature"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={section.data.signatures.companyName}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={section.data.signatures.companyTitle}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={section.data.signatures.companyDate}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Next Steps with + - functionality */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Next Steps</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newSteps = [...section.data.nextSteps, ''];
                updateSectionData(section.id, { nextSteps: newSteps });
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (section.data.nextSteps.length > 1) {
                  const newSteps = section.data.nextSteps.slice(0, -1);
                  updateSectionData(section.id, { nextSteps: newSteps });
                }
              }}
              disabled={section.data.nextSteps.length <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {section.data.nextSteps.map((step: string, index: number) => (
            <div key={index} className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex-shrink-0">
                {index + 1}
              </div>
              <Input
                value={step}
                onChange={(e) => {
                  const newSteps = [...section.data.nextSteps];
                  newSteps[index] = e.target.value;
                  updateSectionData(section.id, { nextSteps: newSteps });
                }}
                placeholder={`Next step ${index + 1}...`}
                className="flex-1"
              />
              {section.data.nextSteps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newSteps = section.data.nextSteps.filter((_: any, i: number) => i !== index);
                    updateSectionData(section.id, { nextSteps: newSteps });
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <span>• Use the</span> 
          <Plus className="h-3 w-3" />
          <span>button to add more steps</span>
          <span>• Use the</span>
          <Minus className="h-3 w-3" />
          <span>button to remove the last step</span>
          <span>• Hover over any step to delete it individually</span>
        </p>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          value={section.data.additionalNotes}
          onChange={(e) => updateSectionData(section.id, { additionalNotes: e.target.value })}
          rows={4}
          placeholder="Any additional notes or special considerations..."
        />
      </div>
    </div>
  );

  const renderSection = (section: QuotationSection) => {
    switch (section.type) {
      case 'cover_page':
        return renderCoverPage(section);
      case 'executive_summary':
        return renderExecutiveSummary(section);
      case 'company_introduction':
        return renderCompanyIntroduction(section);
      case 'problem_statement':
        return renderProblemStatement(section);
      case 'solution_details':
        return renderSolutionDetails(section);
      case 'product_specifications':
        return renderProductSpecifications(section);
      case 'quotation_items':
        return renderQuotationItems(section);
      case 'timeline_schedule':
        return renderTimelineSchedule(section);
      case 'terms_warranties':
        return renderTermsWarranties(section);
      case 'contact_information':
        return renderContactInformation(section);
      default:
        return (
          <div className="space-y-4">
            <Label>Section Content</Label>
            <Textarea
              value={JSON.stringify(section.data, null, 2)}
              onChange={(e) => {
                try {
                  const newData = JSON.parse(e.target.value);
                  updateSectionData(section.id, newData);
                } catch (error) {
                  // Invalid JSON, do nothing
                }
              }}
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-red-600 to-red-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Create Professional Proposal</h1>
            <p className="text-red-100 mt-1 text-lg">Build comprehensive proposals with 10 customizable sections</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => saveQuotation('draft')}
              disabled={loading || customersLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
            <Button 
              className="bg-white text-red-600 hover:bg-red-50" 
              onClick={generatePDF}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate PDF
                </>
              )}
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => saveQuotation('sent')}
              disabled={loading || customersLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Quotation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {customersError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800 text-sm">
              {customersError.includes('index') 
                ? 'Optimizing customer data loading... Please wait a few minutes.'
                : customersError
              }
            </span>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Basic Information</CardTitle>
          <CardDescription>Enter quotation details and select customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quotationNumber">Quotation Number</Label>
                <Input
                  id="quotationNumber"
                  value={quotationData.quotationNumber}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, quotationNumber: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select
                  value={quotationData.customerId}
                  onValueChange={(value) => setQuotationData(prev => ({ ...prev, customerId: value }))}
                  disabled={customersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={customersLoading ? "Loading customers..." : "Select a customer"} />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.companyName} - {customer.primaryContact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {customersLoading && (
                  <p className="text-sm text-gray-500 flex items-center">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Loading customers...
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={quotationData.issueDate}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, issueDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={quotationData.validUntil}
                  onChange={(e) => setQuotationData(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sections List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Proposal Sections</CardTitle>
            <CardDescription>Reorder and enable/disable proposal sections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sections.map((section, index) => (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.id)}
                className={`p-3 rounded-lg border-2 cursor-move transition-all ${
                  section.enabled
                    ? 'border-red-200 bg-red-50 hover:border-red-300'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                      {section.order}. {section.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveSection(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveSection(index, Math.min(sections.length - 1, index + 1))}
                      disabled={index === sections.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Checkbox
                      checked={section.enabled}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section Content */}
        <div className="lg:col-span-3 space-y-6">
          {sections.filter(section => section.enabled).map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-green-600" />
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>
                        Section {section.order} • Enabled for PDF
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="default">
                    PDF
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderSection(section)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}